import axios from 'axios';
import { getAuthHeader, setTokens, removeTokens, getTokens, validateToken } from './tokenUtils';
import { RefreshAttemptInfo, AuthError } from '../types/auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// 토큰 갱신 시도 관리를 위한 상수
const REFRESH_CONFIG = {
  maxAttempts: 3,
  resetTime: 1000 * 60 * 5, // 5분
  attempts: new Map<string, RefreshAttemptInfo>()
};

// 인증이 필요하지 않은 엔드포인트 목록
const PUBLIC_ENDPOINTS = [
  '/auth/register',
  '/auth/verify-email',
  '/auth/login',
  '/auth/refresh'
];

// 토큰 갱신 로직 분리
const refreshAccessToken = async (refreshToken: string): Promise<{
  success: boolean;
  token?: string;
  refreshToken?: string;
  error?: string;
}> => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/refresh`, { refreshToken });
    
    if (response.data.success) {
      return {
        success: true,
        token: response.data.token,
        refreshToken: response.data.refreshToken
      };
    }
    
    return {
      success: false,
      error: 'REFRESH_FAILED'
    };
  } catch (error) {
    return {
      success: false,
      error: 'REFRESH_ERROR'
    };
  }
};

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // 공개 엔드포인트는 토큰 검사 제외
    if (config.url && PUBLIC_ENDPOINTS.some(endpoint => config.url?.includes(endpoint))) {
      return config;
    }

    const authHeader = getAuthHeader();
    if (authHeader.Authorization) {
      const { isValid, error } = validateToken(authHeader.Authorization.replace('Bearer ', ''));
      if (!isValid && error === 'TOKEN_EXPIRED') {
        removeTokens();
      } else {
        config.headers.Authorization = authHeader.Authorization;
      }
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

    // Check if it's a 401 error and not a request to the refresh endpoint itself
    if (error.response?.status === 401 && originalRequest.url !== '/auth/refresh') {
      const errorType = error.response.data?.error;

      // Handle email not verified specifically
      if (errorType === 'EMAIL_NOT_VERIFIED') {
        console.warn('[API Interceptor] Email not verified error detected.');
        // Reject with a specific structure that AuthContext can understand if needed
        // Or simply let the original error propagate if UI handles it
        return Promise.reject(error); // Let the original error propagate
      }

      // Handle token errors (Expired, Invalid, Missing)
      if (['TOKEN_EXPIRED', 'TOKEN_INVALID', 'TOKEN_MISSING'].includes(errorType)) {
        const { refreshToken } = getTokens();

        if (!refreshToken) {
          console.warn('[API Interceptor] No refresh token found.');
          removeTokens();
          // Reject with the original error, AuthContext checkAuth will handle this state
          return Promise.reject(error); 
        }

        // Prevent multiple refresh attempts for the same original request
        if (originalRequest._retry) {
            console.warn('[API Interceptor] Refresh already attempted for this request.');
            return Promise.reject(error);
        }
        originalRequest._retry = true;

        // Check refresh attempt limits (optional but good practice)
        const now = Date.now();
        const attempt = REFRESH_CONFIG.attempts.get('global') || { count: 0, lastAttempt: 0 };
        if (attempt.count >= REFRESH_CONFIG.maxAttempts && now - attempt.lastAttempt < REFRESH_CONFIG.resetTime) {
            console.error('[API Interceptor] Refresh limit exceeded.');
            removeTokens();
            return Promise.reject(error); 
        }
        attempt.count = (now - attempt.lastAttempt >= REFRESH_CONFIG.resetTime) ? 1 : attempt.count + 1;
        attempt.lastAttempt = now;
        REFRESH_CONFIG.attempts.set('global', attempt);
        
        console.log('[API Interceptor] Attempting token refresh...');
        const refreshResult = await refreshAccessToken(refreshToken);

        if (refreshResult.success && refreshResult.token && refreshResult.refreshToken) {
          console.log('[API Interceptor] Token refresh successful. Retrying original request.');
          setTokens(refreshResult.token, refreshResult.refreshToken, true); // Assuming rememberMe
          // Update the header of the original request
          originalRequest.headers['Authorization'] = `Bearer ${refreshResult.token}`;
          // Retry the original request with the new token
          return api(originalRequest);
        }
        
        // Refresh failed
        console.error('[API Interceptor] Token refresh failed.');
        removeTokens();
        // Reject with the original error after failed refresh attempt
        return Promise.reject(error); 
      }
    }

    // For non-401 errors or unhandled 401s, just reject with the original error
    return Promise.reject(error);
  }
);

export default api; 