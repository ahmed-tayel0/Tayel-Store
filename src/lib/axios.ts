import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = 'https://ecommerce.routemisr.com/api/';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor to attach JWT token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Read token ONLY from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear the auth token from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }

      // Dispatch auth-change event to notify Navbar and other components
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth-change'));
      }

      // Only redirect to login if we're on a protected route
      // Don't redirect for background fetches (cart, wishlist, etc.)
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        const protectedRoutes = ['/profile', '/checkout', '/cart', '/wishlist', '/orders'];
        const isProtectedRoute = protectedRoutes.some(route => currentPath.startsWith(route));

        if (isProtectedRoute) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;