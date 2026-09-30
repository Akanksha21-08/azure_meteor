import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

API.interceptors.request.use((config) => {
  const user = localStorage.getItem('userInfo');
  if (user) {
    const parsedUser = JSON.parse(user);
    if (parsedUser.token) {
      config.headers.Authorization = 'Bearer ' + parsedUser.token;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
