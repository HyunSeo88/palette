import React, { createContext, useState, useContext, useEffect } from 'react';
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

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await api.get<{ success: boolean; data: User }>('/auth/me');
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

  const login = async (email: string, password: string, rememberMe: boolean): Promise<boolean> => {
    try {
      setError(null);
      const response = await api.post<{ success: boolean; token: string; refreshToken: string }>('/auth/login', {
        email,
        password,
      });

      if (response.data.success) {
        const { token, refreshToken } = response.data;
        setTokens(token, refreshToken, rememberMe ? 'local' : 'session');
        await checkAuth();
        return true;
      }
      return false;
    } catch (error: any) {
      const message = error.response?.data?.message || '로그인 중 오류가 발생했습니다.';
      setError(message);
      throw new Error(message);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setError(null);
      const response = await api.post<{ success: boolean; token: string; refreshToken: string }>('/auth/register', userData);

      if (response.data.success) {
        const { token, refreshToken } = response.data;
        setTokens(token, refreshToken);
        await checkAuth();
        return true;
      }
      return false;
    } catch (error: any) {
      const message = error.response?.data?.message || '회원가입 중 오류가 발생했습니다.';
      setError(message);
      throw new Error(message);
    }
  };

  const socialLogin = async (provider: 'google' | 'kakao', token: string): Promise<boolean> => {
    try {
      setError(null);
      const response = await api.post<{ success: boolean; token: string; refreshToken: string; isNewUser: boolean }>(`/auth/${provider}`, {
        token,
      });

      if (response.data.success) {
        const { token: authToken, refreshToken, isNewUser } = response.data;
        setTokens(authToken, refreshToken);
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

  const logout = () => {
    removeTokens();
    setUser(null);
  };

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
      const response = await api.post<{ success: boolean }>('/auth/reset-password', { email });
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
      const response = await api.put<{ success: boolean }>('/auth/password', {
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
      const response = await api.post<{ success: boolean }>('/auth/verify-email', { token });
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
      const response = await api.post<{ success: boolean }>('/auth/resend-verification', { email });
      return response.data.success;
    } catch (error: any) {
      const message = error.response?.data?.message || '인증 이메일 재발송 중 오류가 발생했습니다.';
      setError(message);
      throw new Error(message);
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    error,
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