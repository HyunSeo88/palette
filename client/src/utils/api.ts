import axios from 'axios';
import { getAuthHeader, setTokens, removeTokens, getTokens } from './tokenUtils';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth header if available
    const authHeader = getAuthHeader();
    if (authHeader.Authorization) {
      config.headers.Authorization = authHeader.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is not 401 or request has already been retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // Get refresh token
      const { refreshToken } = getTokens();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Try to refresh the token
      const response = await axios.post(`${API_URL}/api/auth/refresh`, {
        refreshToken
      });

      if (response.data.success) {
        const { token: newAccessToken, refreshToken: newRefreshToken } = response.data;
        
        // Store new tokens
        setTokens(newAccessToken, newRefreshToken, true);
        
        // Update Authorization header
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        
        // Retry original request
        return api(originalRequest);
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (refreshError) {
      console.error('Token refresh failed:', refreshError);
      // If refresh fails, remove tokens and reject
      removeTokens();
      return Promise.reject(error);
    }
  }
);

export default api; 