
import axios from 'axios';

// Define token management utilities
const tokenManager = {
  // Get the appropriate token based on the request URL
  getToken: (url: string) => {
    // Check if the URL starts with /admin or contains /admin/
    const isAdminRoute = url.startsWith('/admin') || url.includes('/admin/');
    return isAdminRoute 
      ? localStorage.getItem('adminToken')
      : localStorage.getItem('publisherToken');
  },

  // Store tokens securely
  setToken: (type: 'admin' | 'publisher', token: string) => {
    localStorage.setItem(`${type}Token`, token);
  },

  // Remove tokens on logout
  removeToken: (type: 'admin' | 'publisher') => {
    localStorage.removeItem(`${type}Token`);
  },

  // Clear all authentication tokens
  clearTokens: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('publisherToken');
  }
};

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to handle authentication
axiosInstance.interceptors.request.use((config) => {
  // Get the appropriate token based on the request URL
  const token = tokenManager.getToken(config.url || '');
  
  // Add token to request header if it exists
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Determine which token expired
      const isAdminRoute = originalRequest.url.includes('/admin');
      
      // Remove the expired token
      tokenManager.removeToken(isAdminRoute ? 'admin' : 'publisher');

      // Redirect to appropriate login page
      window.location.href = isAdminRoute ? '/admin/login' : '/login';
    }

    return Promise.reject(error);
  }
);

// Export both the axios instance and token manager
export { tokenManager };
export default axiosInstance;