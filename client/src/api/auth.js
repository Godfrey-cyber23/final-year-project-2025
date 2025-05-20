import api from './axios';

/**
 * Authentication API Service
 * Handles all auth-related API calls with standardized error handling
 */
export const authService = {
  /**
   * User login
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<{success: boolean, user?: object, token?: string, error?: string}>}
   */
  async login(email, password) {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      return {
        success: true,
        user: data.user,
        token: data.token
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 
               error.message || 
               'Login failed. Please try again.'
      };
    }
  },

  /**
   * User registration
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<{success: boolean, user?: object, error?: string}>}
   */
  async register(email, password) {
    try {
      const { data } = await api.post('/auth/register', { 
        email, 
        password,
        role: 'user'
      });
      return {
        success: true,
        user: data.user
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 
               'Registration failed. Please try different credentials.'
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
        message: 'If an account exists with this email, you will receive a password reset link shortly.'
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
      await api.post('/auth/reset-password', { token, newPassword });
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
   * Get current authenticated user
   * @returns {Promise<{success: boolean, user?: object, error?: string}>}
   */
  async getCurrentUser() {
    try {
      const { data } = await api.get('/auth/me');
      return {
        success: true,
        user: data
      };
    } catch (error) {
      console.error('Get current user error:', error);
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
  }
};

// Named exports
export const login = authService.login;
export const register = authService.register;
export const forgotPassword = authService.forgotPassword;
export const resetPassword = authService.resetPassword;
export const getCurrentUser = authService.getCurrentUser;
export const verifyResetToken = authService.verifyResetToken;