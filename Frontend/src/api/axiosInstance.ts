import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // Send cookies (refresh token) along with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

import { useAuthStore } from '../store/authStore';

// Request interceptor - Add auth token if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired, etc.)
    if (error.response?.status === 401) {
      // Clear auth store if available
        // Dynamic import to avoid circular dependency and Vite require() error
        import('../store/authStore').then(({ useAuthStore }) => {
          useAuthStore.getState().logout();
        }).catch(() => {});
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
