import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Alamat backend kita
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Setiap request otomatis bawa Token jika ada
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;