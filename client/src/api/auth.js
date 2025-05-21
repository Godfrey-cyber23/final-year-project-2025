import api from './axios';

/**
 * Lecturer Authentication API Service
 * Handles all lecturer auth-related API calls
 */
export const authService = {
  /**
   * Lecturer login
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<{success: boolean, lecturer?: object, token?: string, error?: string}>}
   */
  async loginLecturer(email, password) {
    try {
      const { data } = await api.post('/auth/lecturer/login', { email, password });
      return {
        success: true,
        lecturer: data.lecturer,
        token: data.token
      };
    } catch (error) {
      console.error('Lecturer login error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 
               error.message || 
               'Login failed. Please try again.'
      };
    }
  },

  /**
   * Get current authenticated lecturer
   * @returns {Promise<{success: boolean, lecturer?: object, error?: string}>}
   */
  async getCurrentLecturer() {
    try {
      const { data } = await api.get('/auth/lecturer/me');
      return {
        success: true,
        lecturer: data
      };
    } catch (error) {
      console.error('Get current lecturer error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 
               'Session expired. Please login again.'
      };
    }
  },

  /**
   * Lecturer password reset request
   * @param {string} email 
   * @returns {Promise<{success: boolean, message?: string, error?: string}>}
   */
  async forgotLecturerPassword(email) {
    try {
      await api.post('/auth/lecturer/forgot-password', { email });
      return {
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link shortly.'
      };
    } catch (error) {
      console.error('Lecturer forgot password error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 
               'Failed to send reset link. Please verify your email address.'
      };
    }
  },

  /**
   * Lecturer password reset confirmation
   * @param {string} token 
   * @param {string} newPassword 
   * @returns {Promise<{success: boolean, message?: string, error?: string}>}
   */
  async resetLecturerPassword(token, newPassword) {
    try {
      await api.post('/auth/lecturer/reset-password', { token, newPassword });
      return {
        success: true,
        message: 'Password updated successfully. You can now login with your new password.'
      };
    } catch (error) {
      console.error('Lecturer reset password error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 
               'Password reset failed. The link may have expired.'
      };
    }
  }
};

// Named exports
export const loginLecturer = authService.loginLecturer;
export const getCurrentLecturer = authService.getCurrentLecturer;
export const forgotLecturerPassword = authService.forgotLecturerPassword;
export const resetLecturerPassword = authService.resetLecturerPassword;