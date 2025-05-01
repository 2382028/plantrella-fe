import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000/api', // Sesuaikan dengan port backend
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor untuk menambahkan token ke header
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export default instance;