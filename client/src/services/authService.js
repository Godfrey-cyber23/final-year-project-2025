import { api } from '../api';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

export const authService = {
  /**
   * Send password reset email
   * @param {string} email - User's email address
   * @returns {Promise<{success: boolean, message?: string, error?: string}>}
   */
  async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data; // This should contain {success: true/false, ...}
    } catch (error) {
      // Handle network errors or server errors
      console.error('Forgot password API error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Network error occurred'
      };
    }
  },
  /**
   * Reset user password
   * @param {string} token - Password reset token
   * @param {string} newPassword - New password
   * @returns {Promise<{success: boolean, message?: string, error?: string}>}
   */
  async resetPassword(token, newPassword) {
    try {
      const response = await api.post('/auth/reset-password', { token, newPassword });
      return {
        success: true,
        message: response.data.message || 'Password reset successfully'
      };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        error: error.response?.data?.message ||
          'Password reset failed. Token may be invalid or expired'
      };
    }
  },

  /**
   * Register a new lecturer
   * @param {object} lecturerData - Lecturer registration data
   * @returns {Promise<{success: boolean, lecturer?: object, error?: string}>}
   */
  async registerLecturer(lecturerData) {
    try {
      const response = await api.post('/auth/register', lecturerData);
      return {
        success: true,
        lecturer: response.data.user,
        token: response.data.token
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.response?.data?.message ||
          'Registration failed. Please check your details'
      };
    }
  },

/**
 * Get the current lecturer
 * @returns {Promise<object>} - The current lecturer object
 */
async getCurrentLecturer() {
  try {
    const response = await api.get('/lecturer/me');
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch current lecturer');
    }
    
    return response.lecturer;
  } catch (error) {
    console.error('Get current lecturer error:', error);
    throw error; // Re-throw to be caught by the calling component
  }
},

  /**
  * User login
  * @param {string} email - User email
  * @param {string} password - User password
  * @param {string} secret_key - Department secret key
  * @returns {Promise<{success: boolean, lecturer?: object, token?: string, error?: string}>}
  */
  async login(email, password, secret_key) {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
        secret_key
      });

      if (!response.data) {
        throw new Error('Empty response from server');
      }

      return {
        success: true,
        token: response.data.token,
        lecturer: response.data.lecturer
      };

    } catch (error) {
      console.error('Login error:', error);

      let errorMessage = 'Login failed. Please try again.';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message.includes('SQL')) {
        errorMessage = 'System error. Please contact support.';
      }

      return {
        success: false,
        error: errorMessage
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