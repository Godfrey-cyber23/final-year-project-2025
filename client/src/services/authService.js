import { api } from '../api';

// Cache for ongoing requests to prevent duplicates
const requestCache = new Map();

/**
 * Wrapper function to handle duplicate requests and errors
 */
const makeRequest = async (key, requestFn) => {
  // If the same request is already in progress, return its promise
  if (requestCache.has(key)) {
    return requestCache.get(key);
  }

  try {
    const requestPromise = requestFn();
    requestCache.set(key, requestPromise);

    const response = await requestPromise;
    return response.data;
  } catch (error) {
    // Handle specific error cases
    if (error.code === 'CANCELED') {
      console.log('Request was canceled:', key);
      throw new Error('Request was canceled');
    }

    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('API Error:', error.response.status, error.response.data);
      throw error.response.data;
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network Error:', error.message);
      throw new Error('Network error. Please check your internet connection.');
    } else {
      // Something happened in setting up the request
      console.error('Request Error:', error.message);
      throw new Error('Request failed. Please try again.');
    }
  } finally {
    // Clean up the cache
    requestCache.delete(key);
  }
};

export const forgotPassword = async (email) => {
  const key = `forgotPassword:${email}`;
  return makeRequest(key, () => api.post('/auth/forgot-password', { email }));
};

export const resetLecturerPassword = async (token, newPassword) => {
  const key = `resetPassword:${token}`;
  return makeRequest(key, () => 
    api.post('/auth/reset-password', { token, newPassword })
  );
};

export const register = async (formData) => {
  const key = `register:${formData.email}`;
  return makeRequest(key, () => api.post('/auth/register', formData));
};

export const registerLecturer = async (lecturerData) => {
  const key = `registerLecturer:${lecturerData.email}`;
  return makeRequest(key, () => 
    api.post('/auth/lecturer/register', lecturerData)
  );
};

export const lecturerLogin = async (email, password) => {
  const key = `lecturerLogin:${email}`;
  return makeRequest(key, () => 
    api.post('/auth/lecturer/login', { email, password })
  );
};

export const getCurrentLecturer = async () => {
  const key = 'getCurrentLecturer';
  return makeRequest(key, () => api.get('/auth/lecturer/me'));
};

export const forgotLecturerPassword = async (email) => {
  const key = `forgotLecturerPassword:${email}`;
  return makeRequest(key, () => 
    api.post('/auth/lecturer/forgot-password', { email })
  );
};

export const logoutLecturer = async () => {
  const key = 'logoutLecturer';
  return makeRequest(key, () => api.post('/auth/lecturer/logout'));
};