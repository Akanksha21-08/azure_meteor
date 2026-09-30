import API from './api';

export const register = async (userData) => {
  const response = await API.post('/auth/register', userData);
  if (response.data.token) {
    localStorage.setItem('userInfo', JSON.stringify(response.data));
  }
  return response.data;
};

export const login = async (credentials) => {
  const response = await API.post('/auth/login', credentials);
  if (response.data.token) {
    localStorage.setItem('userInfo', JSON.stringify(response.data));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('userInfo');
};

export const getMe = async () => {
  const response = await API.get('/auth/me');
  return response.data;
};

export const changePassword = async (passwords) => {
  const response = await API.put('/auth/change-password', passwords);
  return response.data;
};
