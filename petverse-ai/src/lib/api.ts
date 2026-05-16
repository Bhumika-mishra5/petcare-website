import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Express backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add auth token if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
