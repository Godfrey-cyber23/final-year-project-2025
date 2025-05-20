 
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 8;
};

export const validateDetection = (data) => {
  const errors = {};
  if (!data.studentId) errors.studentId = 'Student ID is required';
  if (!data.deviceId) errors.deviceId = 'Device ID is required';
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};