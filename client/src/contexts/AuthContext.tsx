import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import api from '../utils/api';
import axios from 'axios';
import { setTokens, removeTokens, hasValidToken, validateTokenPair, getTokens } from '../utils/tokenUtils';
import { User as UserType, ColorVisionType } from '../types/user';
import { AuthResponse, RegisterData, LoginData } from '../types/auth';

// Create a direct API instance without interceptors for register function only
const directApi = axios.create({
  baseURL: api.defaults.baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Types
export type User = UserType;

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isEmailVerified: boolean;
  isAuthenticating: boolean;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<AuthResponse>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  socialLogin: (provider: 'google' | 'kakao', token: string) => Promise<boolean>;
  clearError: () => void;
  verifyEmail: (token: string) => Promise<boolean>;
  resendVerificationEmail: (email: string) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
    isEmailVerified: false,
    isAuthenticating: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const blockCheckAuthRef = useRef<boolean>(false);
  const skipInitialCheckRef = useRef<boolean>(false);

  useEffect(() => {
    if (!skipInitialCheckRef.current) {
      checkAuth();
    }
  }, []);

  const checkAuth = async () => {
    if (blockCheckAuthRef.current) {
      console.log('[AuthContext checkAuth] checkAuth is temporarily blocked.');
      return;
    }

    console.log('[AuthContext checkAuth] Attempting to check authentication status...');
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { accessToken, refreshToken } = getTokens();
      console.log('[AuthContext checkAuth] Retrieved tokens:', { hasAccessToken: !!accessToken, hasRefreshToken: !!refreshToken });
      const tokenValidation = validateTokenPair(accessToken, refreshToken);
      console.log('[AuthContext checkAuth] Token validation result:', tokenValidation);

      if (!tokenValidation.isValid) {
        console.log('[AuthContext checkAuth] Tokens invalid or missing. Setting unauthenticated state.');
        removeTokens();
        setAuthState(prev => ({ ...prev, user: null, isEmailVerified: false, loading: false }));
        return;
      }

      console.log('[AuthContext checkAuth] Valid tokens found. Calling /auth/me using main api instance...');
      const response = await api.get<{ success: boolean; data: User }>('/auth/me');
      console.log('[AuthContext checkAuth] Received /auth/me response:', response.data);

      if (response.data.success) {
        console.log('[AuthContext checkAuth] /auth/me successful. Setting authenticated state.');
        setAuthState(prev => ({
          ...prev,
          user: response.data.data,
          isEmailVerified: response.data.data.isEmailVerified,
          loading: false,
          error: null,
        }));
      } else {
        console.error('[AuthContext checkAuth] /auth/me call succeeded but returned success: false.');
        removeTokens();
        setAuthState(prev => ({ ...prev, user: null, isEmailVerified: false, loading: false, error: '사용자 정보를 가져오는데 실패했습니다.' }));
      }
    } catch (error: any) {
      console.error('[AuthContext checkAuth] Error during checkAuth:', error);
      if (error.response?.data?.error === 'EMAIL_NOT_VERIFIED') {
        console.log('[AuthContext checkAuth] Email not verified.');
        setAuthState(prev => ({ ...prev, user: null, isEmailVerified: false, loading: false, error: '이메일 인증이 필요합니다.' }));
      } else {
        console.log('[AuthContext checkAuth] Failed. Setting unauthenticated state.');
        removeTokens();
        setAuthState(prev => ({ ...prev, user: null, isEmailVerified: false, loading: false, error: error.message || '인증 확인 중 오류 발생' }));
      }
    }
  };

  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  const login = useCallback(async (email: string, password: string, rememberMe: boolean): Promise<boolean> => {
    setIsLoading(true);
    blockCheckAuthRef.current = true;
    console.log('[AuthContext Login] Starting login, checkAuth blocked.');
    let success = false;
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success && response.data.token && response.data.refreshToken) {
        setTokens(response.data.token, response.data.refreshToken, rememberMe);
        await checkAuth();
        success = authState.user !== null;
      } else {
        throw new Error(response.data.message || '로그인 실패');
      }
    } catch (error: any) {
      console.error('[AuthContext Login] Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || '로그인 중 오류 발생';
       setAuthState(prev => ({ ...prev, error: errorMessage }));
      success = false;
    } finally {
      setIsLoading(false);
      blockCheckAuthRef.current = false;
      console.log('[AuthContext Login] Login process finished, checkAuth unblocked.');
    }
    return success;
  }, [authState.user]);

  const register = async (userData: RegisterData): Promise<AuthResponse> => {
    setIsLoading(true);
    blockCheckAuthRef.current = true;
    skipInitialCheckRef.current = true;
    console.log('[AuthContext Register] Starting registration process...');

    try {
      // 회원가입 요청
      const response = await directApi.post<AuthResponse>('/auth/register', userData);
      console.log('[AuthContext Register] Server response:', response.data);

      // 회원가입 실패
      if (!response.data.success) {
        throw new Error(response.data.message || '회원가입 실패');
      }

      // 이메일 인증이 필요한 경우
      if (response.data.data?.requiresVerification) {
        console.log('[AuthContext Register] Email verification required');
        removeTokens();
        setAuthState(prev => ({
          ...prev,
          user: null,
          isEmailVerified: false,
          error: null
        }));

        return {
          success: true,
          message: '회원가입이 완료되었습니다. 이메일을 확인해주세요.',
          data: {
            requiresVerification: true,
            email: userData.email
          }
        };
      }

      // 이메일 인증이 필요하지 않은 경우
      if (response.data.data?.token && response.data.data?.refreshToken) {
        console.log('[AuthContext Register] No email verification required, setting tokens');
        setTokens(response.data.data.token, response.data.data.refreshToken, true);
        blockCheckAuthRef.current = false;
        await checkAuth();
        return response.data;
      }

      throw new Error('인증 토큰을 받지 못했습니다.');

    } catch (error: any) {
      console.error('[AuthContext Register] Registration error:', error);
      const errorMessage = error.response?.data?.message || error.message || '회원가입 중 오류 발생';
      
      // 401 에러는 이메일 인증이 필요한 경우일 수 있음
      if (error.response?.status === 401 && error.response?.data?.error === 'EMAIL_NOT_VERIFIED') {
        removeTokens();
        setAuthState(prev => ({
          ...prev,
          user: null,
          isEmailVerified: false,
          error: null
        }));

        return {
          success: true,
          message: '회원가입이 완료되었습니다. 이메일을 확인해주세요.',
          data: {
            requiresVerification: true,
            email: userData.email
          }
        };
      }

      removeTokens();
      setAuthState(prev => ({
        ...prev,
        user: null,
        isEmailVerified: false,
        error: errorMessage
      }));
      blockCheckAuthRef.current = false;

      return {
        success: false,
        message: errorMessage,
        error: { field: 'general', message: errorMessage }
      };

    } finally {
      setIsLoading(false);
      console.log('[AuthContext Register] Registration process completed');
    }
  };

  const logout = useCallback(() => {
    removeTokens();
    setAuthState(prev => ({
      ...prev,
      user: null,
      error: null,
      isEmailVerified: false
    }));
  }, []);

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, error: null }));
      const response = await api.put<{ success: boolean; data: User }>(`/users/${authState.user?._id}`, userData);

      if (response.data.success) {
        setAuthState(prev => ({
          ...prev,
          user: response.data.data,
          error: null
        }));
        return true;
      }
      return false;
    } catch (error: any) {
      const message = error.response?.data?.message || '프로필 업데이트 중 오류가 발생했습니다.';
      setAuthState(prev => ({ ...prev, error: message }));
      throw new Error(message);
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, error: null }));
      const response = await api.post<{ success: boolean }>('/auth/reset-password', { email });
      return response.data.success;
    } catch (error: any) {
      const message = error.response?.data?.message || '비밀번호 재설정 요청 중 오류가 발생했습니다.';
      setAuthState(prev => ({ ...prev, error: message }));
      throw new Error(message);
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, error: null }));
      const response = await api.put<{ success: boolean }>('/auth/password', {
        currentPassword,
        newPassword,
      });
      return response.data.success;
    } catch (error: any) {
      const message = error.response?.data?.message || '비밀번호 변경 중 오류가 발생했습니다.';
      setAuthState(prev => ({ ...prev, error: message }));
      throw new Error(message);
    }
  };

  const verifyEmail = async (token: string): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, error: null }));
      blockCheckAuthRef.current = true; // 인증 프로세스 동안 checkAuth 차단
      
      const response = await api.post<{
        success: boolean;
        token: string;
        refreshToken: string;
      }>('/auth/verify-email', { token });

      if (response.data.success) {
        const { token: accessToken, refreshToken } = response.data;
        setTokens(accessToken, refreshToken, true);
        
        try {
          const userResponse = await api.get<{ success: boolean; data: User }>('/auth/me');
          if (userResponse.data.success) {
            setAuthState(prev => ({
              ...prev,
              user: userResponse.data.data,
              error: null,
              isEmailVerified: userResponse.data.data.isEmailVerified
            }));
            blockCheckAuthRef.current = false; // 인증 성공 시 checkAuth 허용
            return true;
          }
        } catch (error) {
          console.error('[AuthContext verifyEmail] Failed to fetch user data:', error);
          removeTokens();
          throw new Error('사용자 정보를 가져오는데 실패했습니다.');
        }
      }
      blockCheckAuthRef.current = false; // 인증 실패 시에도 checkAuth 허용
      return false;
    } catch (error: any) {
      const message = error.response?.data?.message || '이메일 인증 중 오류가 발생했습니다.';
      setAuthState(prev => ({ ...prev, error: message }));
      removeTokens();
      blockCheckAuthRef.current = false; // 에러 발생 시에도 checkAuth 허용
      return false;
    }
  };

  const resendVerificationEmail = async (email: string): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, error: null }));
      const response = await api.post<{ success: boolean }>('/auth/resend-verification', { email });
      return response.data.success;
    } catch (error: any) {
      const message = error.response?.data?.message || '인증 이메일 재발송 중 오류가 발생했습니다.';
      setAuthState(prev => ({ ...prev, error: message }));
      throw new Error(message);
    }
  };

  const socialLogin = async (provider: 'google' | 'kakao', token: string): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, error: null }));
      const response = await api.post<{ success: boolean; token: string; refreshToken: string; isNewUser: boolean }>(`/auth/${provider}`, {
        token,
      });

      if (response.data.success) {
        const { token: authToken, refreshToken, isNewUser } = response.data;
        setTokens(authToken, refreshToken, true);
        await checkAuth();
        return isNewUser;
      }
      return false;
    } catch (error: any) {
      const message = error.response?.data?.message || '소셜 로그인 중 오류가 발생했습니다.';
      setAuthState(prev => ({ ...prev, error: message }));
      throw new Error(message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        loading: authState.loading,
        isAuthenticated: !!authState.user,
        error: authState.error,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        resetPassword,
        updatePassword,
        socialLogin,
        clearError,
        verifyEmail,
        resendVerificationEmail
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 