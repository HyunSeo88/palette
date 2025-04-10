import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { setTokens, removeTokens } from '../utils/tokenUtils';
import { User as UserType, ColorVisionType } from '../types/user';

// Types
export type User = UserType;

export interface RegisterData {
  email: string;
  password: string;
  nickname: string;
  colorVisionType: ColorVisionType;
  bio?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string, rememberMe: boolean) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  socialLogin: (provider: 'google' | 'kakao', token: string) => Promise<boolean>;
  clearError: () => void;
  verifyEmail: (token: string) => Promise<boolean>;
  resendVerificationEmail: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await api.get<{ success: boolean; data: User }>('/api/auth/me');
      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
      removeTokens();
    } finally {
      setLoading(false);
    }
  };

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const login = useCallback(async (email: string, password: string, rememberMe: boolean): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/api/auth/login', { email, password });
      
      // 서버 응답에서 토큰 추출
      const { token: accessToken, refreshToken } = response.data;
      
      if (!accessToken || !refreshToken) {
        setError('로그인에 실패했습니다. 서버 응답이 올바르지 않습니다.');
        setIsLoading(false);
        return false;
      }

      // 토큰 저장
      setTokens(accessToken, refreshToken, rememberMe);
      
      // 사용자 정보 가져오기
      try {
        const userResponse = await api.get('/api/auth/me');
        if (userResponse.data.success) {
          setUser(userResponse.data.data);
          setIsLoading(false);
          return true;
        } else {
          throw new Error('Failed to get user data');
        }
      } catch (userError) {
        console.error('Failed to fetch user info:', userError);
        removeTokens();
        setError('사용자 정보를 가져오는데 실패했습니다.');
        setIsLoading(false);
        return false;
      }
    } catch (error: any) {
      console.error('Login request failed:', error);
      
      if (error.response?.status === 401) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
      
      setIsLoading(false);
      return false;
    }
  }, []);

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setError(null);
      const response = await api.post<{ success: boolean; token: string; refreshToken: string }>('/api/auth/register', userData);

      console.log('Register response:', response.data); // 디버깅용

      if (response.data.success && response.data.token && response.data.refreshToken) {
        // 토큰 저장
        setTokens(response.data.token, response.data.refreshToken, true);
        
        // 사용자 정보 요청 전에 잠시 대기
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // 토큰이 저장된 후에 사용자 정보 요청
        try {
          const userResponse = await api.get<{ success: boolean; data: User }>('/api/auth/me');
          if (userResponse.data.success) {
            setUser(userResponse.data.data);
            return true;
          }
        } catch (userError: any) {
          console.error('Failed to fetch user info after registration:', userError);
          removeTokens();
          setError('회원가입은 성공했지만 사용자 정보를 가져오는데 실패했습니다.');
          return false;
        }
      }
      
      setError('회원가입 응답에 토큰이 없습니다.');
      return false;
    } catch (error: any) {
      console.error('Registration failed:', error);
      const message = error.response?.data?.message || '회원가입 중 오류가 발생했습니다.';
      setError(message);
      return false;
    }
  };

  const socialLogin = async (provider: 'google' | 'kakao', token: string): Promise<boolean> => {
    try {
      setError(null);
      const response = await api.post<{ success: boolean; token: string; refreshToken: string; isNewUser: boolean }>(`/api/auth/${provider}`, {
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
      setError(message);
      throw new Error(message);
    }
  };

  const logout = useCallback(() => {
    removeTokens();
    setUser(null);
  }, []);

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      setError(null);
      const response = await api.put<{ success: boolean; data: User }>(`/users/${user?._id}`, userData);

      if (response.data.success) {
        setUser(response.data.data);
        return true;
      }
      return false;
    } catch (error: any) {
      const message = error.response?.data?.message || '프로필 업데이트 중 오류가 발생했습니다.';
      setError(message);
      throw new Error(message);
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      setError(null);
      const response = await api.post<{ success: boolean }>('/api/auth/reset-password', { email });
      return response.data.success;
    } catch (error: any) {
      const message = error.response?.data?.message || '비밀번호 재설정 요청 중 오류가 발생했습니다.';
      setError(message);
      throw new Error(message);
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      setError(null);
      const response = await api.put<{ success: boolean }>('/api/auth/password', {
        currentPassword,
        newPassword,
      });
      return response.data.success;
    } catch (error: any) {
      const message = error.response?.data?.message || '비밀번호 변경 중 오류가 발생했습니다.';
      setError(message);
      throw new Error(message);
    }
  };

  const verifyEmail = async (token: string): Promise<boolean> => {
    try {
      setError(null);
      const response = await api.post<{ success: boolean }>('/api/auth/verify-email', { token });
      return response.data.success;
    } catch (error: any) {
      const message = error.response?.data?.message || '이메일 인증 중 오류가 발생했습니다.';
      setError(message);
      throw new Error(message);
    }
  };

  const resendVerificationEmail = async (email: string): Promise<boolean> => {
    try {
      setError(null);
      const response = await api.post<{ success: boolean }>('/api/auth/resend-verification', { email });
      return response.data.success;
    } catch (error: any) {
      const message = error.response?.data?.message || '인증 이메일 재발송 중 오류가 발생했습니다.';
      setError(message);
      throw new Error(message);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    error,
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 