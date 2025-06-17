import axios from 'axios';

// Request tracking and cancellation
const pendingRequests = new Map();
const CANCEL_MESSAGE = 'Request cancelled by duplicate detection';

// Configure base API settings
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000, // 15 seconds timeout
  withCredentials: true, // For cross-site cookies
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  validateStatus: function (status) {
    // Consider status codes less than 500 as success to handle 4xx errors gracefully
    return status < 500;
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add unique request ID for tracking
    const requestId = crypto.randomUUID();
    config.headers['X-Request-ID'] = requestId;
    config.metadata = { 
      requestId, 
      startTime: new Date(),
      originalUrl: config.url // Store original URL for cleanup
    };

    // Only cancel GET requests that are exact duplicates within 300ms
    if (config.method?.toLowerCase() === 'get') {
      const requestKey = `${config.url}-${JSON.stringify(config.params)}`;
      
      // Check if same request was made recently
      if (pendingRequests.has(requestKey)) {
        const previousRequest = pendingRequests.get(requestKey);
        const timeSinceLastRequest = Date.now() - previousRequest.time;
        
        // Only cancel if the same request was made within 300ms
        if (timeSinceLastRequest < 300) {
          previousRequest.cancel(CANCEL_MESSAGE);
        }
      }
      
      // Add cancel token to current request
      config.cancelToken = new axios.CancelToken((cancel) => {
        pendingRequests.set(requestKey, { 
          cancel, 
          time: Date.now(),
          url: config.url // Store URL for cleanup
        });
      });
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject({
      code: 'REQUEST_ERROR',
      message: 'Failed to process request',
      details: error
    });
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Clean up request tracking
    if (response.config.method?.toLowerCase() === 'get') {
      const requestKey = `${response.config.metadata.originalUrl}-${JSON.stringify(response.config.params)}`;
      pendingRequests.delete(requestKey);
    }

    // Log performance metrics
    const duration = new Date() - response.config.metadata.startTime;
    console.debug(`API call ${response.config.metadata.requestId} took ${duration}ms`);

    // Return response data directly for easier consumption
    return response.data;
  },
  (error) => {
    // Clean up pending requests on error
    if (error.config?.method?.toLowerCase() === 'get' && error.config.metadata) {
      const requestKey = `${error.config.metadata.originalUrl}-${JSON.stringify(error.config.params)}`;
      pendingRequests.delete(requestKey);
    }

    // Handle cancellation differently
    if (axios.isCancel(error)) {
      console.warn('Request cancelled:', error.message);
      return Promise.reject({
        code: 'REQUEST_CANCELLED',
        message: error.message,
        isCancelled: true
      });
    }

    // Enhanced error handling
    const errorResponse = {
      code: 'API_ERROR',
      message: 'Request failed',
      status: error.response?.status,
      details: {},
      config: error.config
    };

    // Network errors (no response)
    if (error.code === 'ERR_NETWORK') {
      errorResponse.code = 'NETWORK_ERROR';
      errorResponse.message = 'Network connection failed';
      errorResponse.details = {
        isNetworkError: true,
        originalError: error.message
      };
    }
    // Timeout errors
    else if (error.code === 'ECONNABORTED') {
      errorResponse.code = 'TIMEOUT_ERROR';
      errorResponse.message = 'Request timed out';
    }
    // Server response errors
    else if (error.response) {
      errorResponse.code = `HTTP_${error.response.status}`;
      errorResponse.message = error.response.data?.message || error.message;
      errorResponse.details = error.response.data;

      // Special handling for auth errors
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        // Use window.location instead of navigate to ensure complete reload
        window.location.href = '/login?session_expired=true';
      }
      if (error.response.status === 403) {
        window.location.href = '/unauthorized';
      }
    }

    console.error('API Error:', {
      message: errorResponse.message,
      code: errorResponse.code,
      status: errorResponse.status,
      url: error.config?.url
    });
    
    return Promise.reject(errorResponse);
  }
);

/**
 * Cancel all pending requests
 */
export const cancelAllRequests = () => {
  pendingRequests.forEach(({ cancel }, key) => {
    cancel(CANCEL_MESSAGE);
    pendingRequests.delete(key);
  });
};

/**
 * Retry failed requests with exponential backoff
 * @param {Object} config - Axios request config
 * @param {number} retries - Number of retries remaining
 * @param {number} delay - Initial delay in ms
 * @returns {Promise} - Promise that resolves with the response or rejects with the error
 */
export const retryRequest = async (config, retries = 3, delay = 1000) => {
  try {
    return await api(config);
  } catch (error) {
    if (retries <= 0 || error.code === 'REQUEST_CANCELLED') {
      throw error;
    }
    
    // Only retry on certain errors
    const retryableErrors = ['NETWORK_ERROR', 'TIMEOUT_ERROR', 'HTTP_429', 'HTTP_502', 'HTTP_503', 'HTTP_504'];
    if (retryableErrors.includes(error.code)) {
      console.log(`Retrying request (${retries} attempts left)...`);
      await new Promise(res => setTimeout(res, delay));
      return retryRequest(config, retries - 1, delay * 2);
    }
    
    throw error;
  }
};

// Export configured instance
export default api;