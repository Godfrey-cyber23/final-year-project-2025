import api from './axios';

/**
 * Lecturer Authentication API Service
 * Handles all auth-related API calls for lecturers with standardized error handling
 */
export const authService = {
  /**
   * Lecturer login
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<{success: boolean, lecturer?: object, token?: string, error?: string}>}
   */
  async login(email, password) {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      return {
        success: true,
        lecturer: data.lecturer,
        token: data.token
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 
               error.message || 
               'Login failed. Please check your credentials.'
      };
    }
  },

  /**
   * Create new lecturer (admin-only)
   * @param {object} lecturerData 
   * @returns {Promise<{success: boolean, lecturer?: object, error?: string}>}
   */
  async registerLecturer(lecturerData) {
    try {
      const { data } = await api.post('/admin/lecturers', lecturerData);
      return {
        success: true,
        lecturer: data
      };
    } catch (error) {
      console.error('Create lecturer error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 
               'Failed to create lecturer account.'
      };
    }
  },

  /**
   * Password reset request
   * @param {string} email 
   * @returns {Promise<{success: boolean, message?: string, error?: string}>}
   */
  async forgotPassword(email) {
    try {
      await api.post('/auth/forgot-password', { email });
      return {
        success: true,
        message: 'If a lecturer account exists with this email, you will receive a password reset link shortly.'
      };
    } catch (error) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 
               'Failed to send reset link. Please verify your email address.'
      };
    }
  },

  /**
   * Password reset confirmation
   * @param {string} token 
   * @param {string} newPassword 
   * @returns {Promise<{success: boolean, message?: string, error?: string}>}
   */
  async resetPassword(token, newPassword) {
    try {
      await api.post(`/auth/reset-password/${token}`, { newPassword });
      return {
        success: true,
        message: 'Password updated successfully. You can now login with your new password.'
      };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 
               'Password reset failed. The link may have expired.'
      };
    }
  },

  /**
   * Get current authenticated lecturer
   * @returns {Promise<{success: boolean, lecturer?: object, error?: string}>}
   */
  async getCurrentLecturer() {
    try {
      const { data } = await api.get('/lecturer/me');
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
   * Verify password reset token
   * @param {string} token 
   * @returns {Promise<{success: boolean, valid?: boolean, error?: string}>}
   */
  async verifyResetToken(token) {
    try {
      await api.get(`/auth/verify-reset-token/${token}`);
      return {
        success: true,
        valid: true
      };
    } catch (error) {
      return {
        success: false,
        valid: false,
        error: error.response?.data?.message || 'Invalid or expired token'
      };
    }
  },

  /**
   * Update lecturer profile (for current lecturer)
   * @param {object} updates 
   * @returns {Promise<{success: boolean, lecturer?: object, error?: string}>}
   */
  async updateProfile(updates) {
    try {
      const { data } = await api.patch('/lecturer/profile', updates);
      return {
        success: true,
        lecturer: data
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 
               'Failed to update profile.'
      };
    }
  }
};

// Named exports
export const login = authService.login;
export const registerLecturer = authService.registerLecturer;
export const forgotPassword = authService.forgotPassword;
export const resetPassword = authService.resetPassword;
export const getCurrentLecturer = authService.getCurrentLecturer;
export const verifyResetToken = authService.verifyResetToken;
export const updateProfile = authService.updateProfile;