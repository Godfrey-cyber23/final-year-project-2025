import { api } from '../api';

export const forgotPassword = async (email) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (token, newPassword) => {
  const response = await api.post('/auth/reset-password', { token, newPassword });
  return response.data;
};

export const registerLecturer = async (lecturerData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const login = async (email, password,secret_key) => {
  try {
    const response = await api.post('/auth/login', { email, password,secret_key });
    return {
      success: true,
      lecturer: response.data.user,
      token: response.data.token
    };
  } catch (error) {
    console.error('Login error:', error);
  }
}