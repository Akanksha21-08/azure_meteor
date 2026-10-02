import axios from 'axios';

const apiBase = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : '/api';

const API = axios.create({
  baseURL: apiBase,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

API.interceptors.request.use((config) => {
  const user = localStorage.getItem('userInfo');
  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      if (parsedUser.token) {
        config.headers.Authorization = 'Bearer ' + parsedUser.token;
      }
    } catch {
      // Ignore parse error
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
