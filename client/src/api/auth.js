import api from './axios';

/**
 * Lecturer Authentication API Service
 * Handles all auth-related API calls with comprehensive error handling and validation
 */
export const authService = {
  /**
   * Lecturer login with email, password, and department secret key
   * @param {string} email - Lecturer's email address
   * @param {string} password - Lecturer's password
   * @param {string} secret_key - Department secret key
   * @returns {Promise<{success: boolean, lecturer?: object, token?: string, error?: string}>}
   */
  async login(email, password, secret_key) {
    // Input validation
    if (!email?.trim() || !password?.trim() || !secret_key?.trim()) {
      return {
        success: false,
        error: 'Email, password, and department secret key are required.'
      };
    }

    try {
      const { data } = await api.post('/auth/login', { 
        email: email.trim(),
        password: password.trim(),
        secret_key: secret_key.trim()
      });

      // Validate response structure
      if (!data?.lecturer || !data?.token) {
        console.error('Invalid login response:', data);
        return {
          success: false,
          error: 'Invalid server response. Please try again.'
        };
      }

      return {
        success: true,
        lecturer: data.lecturer,
        token: data.token
      };
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle specific error cases
      if (error.code === 'ERR_NETWORK') {
        return {
          success: false,
          error: 'Network error. Please check your connection.'
        };
      }

      return {
        success: false,
        error: error.response?.data?.message || 
               'Login failed. Please check your credentials.'
      };
    }
  },

  /**
   * Register a new lecturer (admin-only)
   * @param {object} lecturerData - Lecturer registration data
   * @returns {Promise<{success: boolean, lecturer?: object, token?: string, error?: string}>}
   */
  async registerLecturer(lecturerData) {
    // Required fields validation
    const requiredFields = ['email', 'password', 'first_name', 'last_name', 'staff_id', 'department_id', 'secret_key'];
    const missingFields = requiredFields.filter(field => !lecturerData[field]);

    if (missingFields.length > 0) {
      return {
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      };
    }

    try {
      const { data } = await api.post('/auth/register', lecturerData);
      
      if (!data?.lecturer) {
        console.error('Invalid registration response:', data);
        return {
          success: false,
          error: 'Invalid server response. Please try again.'
        };
      }

      return {
        success: true,
        lecturer: data.lecturer,
        ...(data.token && { token: data.token }) // Optional token if returned
      };
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle validation errors differently
      if (error.response?.status === 422) {
        return {
          success: false,
          error: 'Validation failed',
          errors: error.response.data?.errors
        };
      }

      return {
        success: false,
        error: error.response?.data?.message || 
               'Registration failed. Please try again.'
      };
    }
  },

  /**
   * Request password reset
   * @param {string} email - Lecturer's email address
   * @returns {Promise<{success: boolean, message?: string, error?: string}>}
   */
  async forgotPassword(email) {
    if (!email?.trim()) {
      return {
        success: false,
        error: 'Email is required.'
      };
    }

    try {
      await api.post('/auth/forgot-password', { email: email.trim() });
      return {
        success: true,
        message: 'If this email is registered, you will receive a password reset link shortly.'
      };
    } catch (error) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 
               'Failed to send reset link. Please try again.'
      };
    }
  },

  /**
   * Reset password with token
   * @param {string} token - Password reset token
   * @param {string} newPassword - New password
   * @returns {Promise<{success: boolean, message?: string, error?: string}>}
   */
  async resetPassword(token, newPassword) {
    if (!token || !newPassword?.trim()) {
      return {
        success: false,
        error: 'Token and new password are required.'
      };
    }

    try {
      await api.post(`/auth/reset-password/${token}`, { 
        newPassword: newPassword.trim() 
      });
      return {
        success: true,
        message: 'Password updated successfully. You can now login with your new password.'
      };
    } catch (error) {
      console.error('Reset password error:', error);
      
      // Handle expired token specifically
      if (error.response?.status === 410) {
        return {
          success: false,
          error: 'This password reset link has expired. Please request a new one.'
        };
      }

      return {
        success: false,
        error: error.response?.data?.message || 
               'Password reset failed. Please try again.'
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
      
      if (!data) {
        return {
          success: false,
          error: 'Invalid lecturer data received'
        };
      }

      return {
        success: true,
        lecturer: data
      };
    } catch (error) {
      console.error('Get current lecturer error:', error);
      
      // Handle unauthorized specifically
      if (error.response?.status === 401) {
        return {
          success: false,
          error: 'Session expired. Please login again.'
        };
      }

      return {
        success: false,
        error: error.response?.data?.message || 
               'Failed to fetch lecturer data.'
      };
    }
  },

  /**
   * Verify password reset token validity
   * @param {string} token - Password reset token
   * @returns {Promise<{success: boolean, valid?: boolean, error?: string}>}
   */
  async verifyResetToken(token) {
    if (!token) {
      return {
        success: false,
        valid: false,
        error: 'Token is required'
      };
    }

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
   * Update lecturer profile
   * @param {object} updates - Profile updates
   * @returns {Promise<{success: boolean, lecturer?: object, error?: string}>}
   */
  async updateProfile(updates) {
    if (!updates || Object.keys(updates).length === 0) {
      return {
        success: false,
        error: 'No updates provided'
      };
    }

    try {
      const { data } = await api.patch('/lecturer/profile', updates);
      return {
        success: true,
        lecturer: data
      };
    } catch (error) {
      console.error('Update profile error:', error);
      
      // Handle validation errors
      if (error.response?.status === 422) {
        return {
          success: false,
          error: 'Validation failed',
          errors: error.response.data?.errors
        };
      }

      return {
        success: false,
        error: error.response?.data?.message || 
               'Failed to update profile.'
      };
    }
  }
};

// Named exports for backward compatibility
export const login = authService.login;
export const registerLecturer = authService.registerLecturer;
export const forgotPassword = authService.forgotPassword;
export const resetPassword = authService.resetPassword;
export const getCurrentLecturer = authService.getCurrentLecturer;
export const verifyResetToken = authService.verifyResetToken;
export const updateProfile = authService.updateProfile;