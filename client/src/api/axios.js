import axios from 'axios';

// Configure base API settings
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true // For cross-site cookies if needed
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request ID for tracking
    config.headers['X-Request-ID'] = crypto.randomUUID();

    // Cancel duplicate requests
    if (config.method === 'get') {
      config.cancelToken = new axios.CancelToken((cancel) => {
        const requestKey = `${config.url}-${JSON.stringify(config.params)}`;
        if (pendingRequests.has(requestKey)) {
          cancel(`Duplicate request cancelled: ${requestKey}`);
        } else {
          pendingRequests.set(requestKey, cancel);
        }
      });
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Clean up request tracking
    if (response.config.method === 'get') {
      const requestKey = `${response.config.url}-${JSON.stringify(response.config.params)}`;
      pendingRequests.delete(requestKey);
    }

    return response.data; // Return only data by default
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error.message);
      return Promise.reject({
        code: 'NETWORK_ERROR',
        message: 'Please check your internet connection'
      });
    }

    // Handle specific status codes
    switch (error.response.status) {
      case 401: // Unauthorized
        localStorage.removeItem('token');
        window.location.href = '/login?session_expired=true';
        break;
      case 403: // Forbidden
        window.location.href = '/unauthorized';
        break;
      case 429: // Rate limited
        console.warn('Rate limited:', error.response.data);
        break;
      case 500: // Server error
        console.error('Server Error:', error.response.data);
        break;
    }

    // Enhanced error object
    return Promise.reject({
      code: error.response.status,
      message: error.response.data?.message || 'Request failed',
      ...error.response.data
    });
  }
);

// Request cancellation storage
const pendingRequests = new Map();

/**
 * Cancel all pending requests
 */
export const cancelAllRequests = () => {
  pendingRequests.forEach((cancel, key) => {
    cancel(`Request cancelled: ${key}`);
    pendingRequests.delete(key);
  });
};

// Export configured instance
export default api;