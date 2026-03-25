import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Send cookies (refresh token) along with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token if available
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add token to headers here if needed
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
      // Clear auth store and redirect to login if needed
      // This will be handled by components
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
