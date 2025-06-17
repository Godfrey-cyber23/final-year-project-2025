import { api } from '../api';

/**
 * Enhanced Authentication Service
 * Handles all authentication-related API calls with improved error handling and logging
 */

export const authService = {
  /**
   * Send password reset email (updated to handle empty responses more gracefully)
   * @param {string} email - User's email address
   * @returns {Promise<{success: boolean, message?: string, error?: string, isNetworkError?: boolean}>}
   */
  async forgotPassword(email) {
    try {
      const response = await api.post('/api/auth/forgot-password', { email });

      // Handle successful responses with or without data
      if (response.status >= 200 && response.status < 300) {
        return {
          success: true,
          message: response.data?.message || 'If your email exists, you will receive a reset link shortly'
        };
      }

      // Handle unexpected successful status codes without data
      if (!response.data) {
        console.warn('Empty response data with status:', response.status);
        return {
          success: true,
          message: 'Password reset initiated (no response data)'
        };
      }

      return {
        success: response.data.success,
        message: response.data.message
      };

    } catch (error) {
      console.error('Forgot password error:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });

      let userMessage = 'Failed to send reset link';
      let isNetworkError = false;
      let debugInfo = '';

      // Enhanced error classification
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
        userMessage = 'Network error. Please check your connection.';
        isNetworkError = true;
        debugInfo = 'Network connectivity issue';
      } else if (error.response) {
        // Handle HTTP error responses
        switch (error.response.status) {
          case 400:
            userMessage = error.response.data?.message || 'Invalid email format';
            break;
          case 404:
            userMessage = 'Password reset service not available';
            debugInfo = 'Endpoint not found';
            break;
          case 429:
            userMessage = 'Too many requests. Please try again later.';
            break;
          case 500:
            userMessage = 'Server error. Please try again later.';
            debugInfo = 'Server-side error occurred';
            break;
          default:
            userMessage = error.response.data?.message || `Request failed with status ${error.response.status}`;
        }
      } else if (error.message.includes('Empty response')) {
        userMessage = 'Password reset service is currently unavailable';
        debugInfo = 'Empty server response';
      }

      if (process.env.NODE_ENV === 'development') {
        console.debug('Debug info:', { debugInfo, error });
      }

      return {
        success: false,
        error: userMessage,
        isNetworkError,
        debugInfo: process.env.NODE_ENV === 'development' ? debugInfo : undefined
      };
    }
  },

  /**
   * Reset user password with enhanced token handling
   * @param {string} token - Password reset token
   * @param {string} newPassword - New password
   * @returns {Promise<{success: boolean, message?: string, error?: string}>}
   */
  async resetPassword(token, newPassword) {
    try {
      // Validate token structure first (basic check)
      if (!token || typeof token !== 'string' || token.length < 20) {
        return {
          success: false,
          error: 'Invalid reset token format'
        };
      }

      // Validate password requirements
      if (!newPassword || newPassword.length < 8) {
        return {
          success: false,
          error: 'Password must be at least 8 characters'
        };
      }

      const response = await api.post('/api/auth/reset-password', {
        token,
        newPassword
      }, {
        // Special headers for password reset
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'X-Password-Reset': 'true'
        }
      });

      // Handle cases where endpoint might return 204 No Content
      if (response.status === 204) {
        return {
          success: true,
          message: 'Password reset successfully'
        };
      }

      // Standard response handling
      if (!response.data) {
        console.error('Empty reset password response', {
          status: response.status,
          headers: response.headers
        });
        return {
          success: false,
          error: 'Password reset failed (no response data)'
        };
      }

      return {
        success: response.data.success === true,
        message: response.data.message || 'Password reset successfully',
        error: response.data.error
      };

    } catch (error) {
      console.error('Reset password error:', {
        message: error.message,
        status: error.response?.status,
        code: error.code,
        url: error.config?.url
      });

      let errorMessage = 'Password reset failed';

      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = error.response.data?.message || 'Invalid token or password';
            break;
          case 401:
            errorMessage = 'Reset token expired or invalid';
            break;
          case 404:
            errorMessage = 'Reset link invalid or already used';
            break;
          case 410:
            errorMessage = 'Reset link has expired';
            break;
          default:
            errorMessage = error.response.data?.message ||
              `Password reset failed (status ${error.response.status})`;
        }
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Network error. Please check your connection.';
      }

      return {
        success: false,
        error: errorMessage,
        isNetworkError: !!error.code
      };
    }
  },
  /**
   * Register a new lecturer with improved validation
   * @param {object} lecturerData - Lecturer registration data
   * @returns {Promise<{success: boolean, lecturer?: object, token?: string, error?: string}>}
   */
  async registerLecturer(lecturerData) {
    try {
      // Basic client-side validation
      if (!lecturerData.email?.trim() || !lecturerData.password?.trim()) {
        return {
          success: false,
          error: 'Email and password are required'
        };
      }

      const response = await api.post('/api/auth/register', lecturerData);

      if (!response.data) {
        console.error('Empty registration response:', response);
        return {
          success: false,
          error: 'Registration service unavailable'
        };
      }

      return {
        success: true,
        lecturer: response.data.user,
        token: response.data.token,
        message: response.data.message || 'Registration successful'
      };
    } catch (error) {
      console.error('Registration error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });

      let errorMessage = 'Registration failed. Please check your details';

      if (error.response) {
        if (error.response.status === 409) {
          errorMessage = 'Email already registered';
        } else if (error.response.data?.errors) {
          // Handle validation errors
          errorMessage = Object.values(error.response.data.errors)
            .map(err => Array.isArray(err) ? err.join(' ') : err)
            .join('. ');
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  },

  /**
   * Get the current lecturer with improved error handling
   * @returns {Promise<object>} - The current lecturer object
   * @throws {Error} - Re-throws error for component to handle
   */
  async getCurrentLecturer() {
    try {
      const response = await api.get('/api/lecturer/me');

      if (!response.data) {
        throw new Error('No lecturer data received');
      }

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      return response.data.lecturer || response.data.user;
    } catch (error) {
      console.error('Get current lecturer error:', {
        message: error.message,
        status: error.response?.status,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });

      // Enhance the error before re-throwing
      error.userMessage = error.response?.status === 401
        ? 'Please login again'
        : 'Failed to load lecturer information';

      throw error;
    }
  },

  /**
   * User login with enhanced security and validation
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} secret_key - Department secret key
   * @returns {Promise<{success: boolean, lecturer?: object, token?: string, error?: string}>}
   */
  async login(email, password, secret_key) {
    try {
      // Enhanced input validation
      if (!email?.trim()) {
        return { success: false, error: 'Email is required' };
      }
      if (!password?.trim()) {
        return { success: false, error: 'Password is required' };
      }
      if (!secret_key?.trim()) {
        return { success: false, error: 'Department secret key is required' };
      }

      const response = await api.post('/api/auth/login', {
        email: email.trim(),
        password: password.trim(),
        secret_key: secret_key.trim()
      });

      // Handle empty responses
      if (!response.data) {
        console.error('Empty login response with status:', response.status);
        return {
          success: false,
          error: 'Authentication service unavailable'
        };
      }

      // Validate response structure
      if (!response.data.token) {
        console.error('Missing token in response:', response.data);
        return {
          success: false,
          error: response.data.message || 'Authentication failed'
        };
      }

      return {
        success: true,
        token: response.data.token,
        lecturer: {
          ...(response.data.user || response.data.lecturer),
          is_admin: response.data.user?.is_admin || false
        },
        message: response.data.message
      };
    } catch (error) {
      console.error('Login error:', {
        message: error.message,
        status: error.response?.status,
        code: error.code,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });

      let errorMessage = 'Login failed. Please try again.';

      // Enhanced error handling
      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = error.response.data?.message || 'Invalid request format';
            break;
          case 401:
            errorMessage = error.response.data?.message || 'Invalid credentials';
            break;
          case 403:
            errorMessage = error.response.data?.message || 'Account not activated or access denied';
            break;
          case 423:
            errorMessage = 'Account locked due to too many attempts';
            break;
          case 429:
            errorMessage = 'Too many login attempts. Please wait before trying again.';
            break;
          case 500:
            errorMessage = 'Server error during authentication';
            break;
        }
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Connection timeout. Please check your network.';
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Network error. Please check your connection.';
      }

      return {
        success: false,
        error: errorMessage,
        isNetworkError: !!error.code // Indicate if it's a network-related error
      };
    }
  }
};

// Named exports for backward compatibility
export const forgotPassword = authService.forgotPassword;
export const resetPassword = authService.resetPassword;
export const registerLecturer = authService.registerLecturer;
export const getCurrentLecturer = authService.getCurrentLecturer;
export const login = authService.login;