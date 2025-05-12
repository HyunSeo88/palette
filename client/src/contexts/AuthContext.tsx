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
  socialLogin: (provider: 'google' | 'kakao', token: string, intent: 'login' | 'signup' | 'link') => Promise<{ success: boolean; isNewUser?: boolean; errorCode?: string; message?: string; tempKakaoProfile?: any; user?: User }>;
  clearError: () => void;
  verifyEmail: (token: string) => Promise<boolean>;
  resendVerificationEmail: (email: string) => Promise<boolean>;
  completeKakaoSignup: (profileData: { kakaoId: string; email: string; nickname?: string; profileImage?: string; }) => Promise<{ success: boolean; isNewUser?: boolean; errorCode?: string; message?: string }>;
  deleteAccount: (password?: string) => Promise<{ success: boolean; errorCode?: string; message?: string }>;
  refreshUserSession: () => Promise<void>;
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

  const checkAuth = useCallback(async () => {
    if (blockCheckAuthRef.current) {
      return;
    }

    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { accessToken, refreshToken } = getTokens();
      const tokenValidation = validateTokenPair(accessToken, refreshToken);

      if (!tokenValidation.isValid) {
        removeTokens();
        setAuthState(prev => ({ ...prev, user: null, isEmailVerified: false, loading: false }));
        return;
      }

      const response = await api.get<{ success: boolean; data: User }>('/auth/me');

      if (response.data.success) {
        setAuthState(prev => ({
          ...prev,
          user: response.data.data,
          isEmailVerified: response.data.data.isEmailVerified,
          loading: false,
          error: null,
        }));
      } else {
        removeTokens();
        setAuthState(prev => ({ ...prev, user: null, isEmailVerified: false, loading: false, error: '사용자 정보를 가져오는데 실패했습니다.' }));
      }
    } catch (error: any) {
      if (error.response?.data?.error === 'EMAIL_NOT_VERIFIED') {
        setAuthState(prev => ({ ...prev, user: null, isEmailVerified: false, loading: false, error: '이메일 인증이 필요합니다.' }));
      } else {
        removeTokens();
        setAuthState(prev => ({ ...prev, user: null, isEmailVerified: false, loading: false, error: error.message || '인증 확인 중 오류 발생' }));
      }
    }
  }, []);

  useEffect(() => {
    if (!skipInitialCheckRef.current) {
      checkAuth();
    }
  }, [checkAuth]);

  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  const login = useCallback(async (email: string, password: string, rememberMe: boolean): Promise<boolean> => {
    setIsLoading(true);
    blockCheckAuthRef.current = true;
    let success = false;
    try {
      console.log(`[AuthContext Login] Calling POST /api/auth/login for ${email}`);
      const response = await api.post('/auth/login', { email, password });
      console.log('[AuthContext Login] API Response received:', response);

      if (response.data.success && response.data.token && response.data.refreshToken) {
        console.log('[AuthContext Login] Login API call successful, setting tokens.');
        setTokens(response.data.token, response.data.refreshToken, rememberMe);
        blockCheckAuthRef.current = false;
        await checkAuth();
        success = true;
      } else {
        console.warn('[AuthContext Login] Login API call failed or returned invalid data:', response.data);
        throw new Error(response.data.message || '로그인 실패 (서버 응답 오류)');
      }
    } catch (error: any) {
      console.error('[AuthContext Login] Error during API call or processing:', error.response || error);
      const errorMessage = error.response?.data?.message || error.message || '로그인 중 오류 발생';
       setAuthState(prev => ({ ...prev, error: errorMessage }));
      success = false;
    } finally {
      setIsLoading(false);
      blockCheckAuthRef.current = false;
    }
    console.log(`[AuthContext Login] Returning success: ${success}`);
    return success;
  }, []);

  const register = useCallback(async (userData: RegisterData): Promise<AuthResponse> => {
    setIsLoading(true);
    blockCheckAuthRef.current = true;
    skipInitialCheckRef.current = true;

    try {
      const response = await directApi.post<AuthResponse>('/auth/register', userData);

      if (!response.data.success) {
        throw new Error(response.data.message || '회원가입 실패');
      }

      if (response.data.data?.requiresVerification) {
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

      if (response.data.data?.token && response.data.data?.refreshToken) {
        setTokens(response.data.data.token, response.data.data.refreshToken, true);
        blockCheckAuthRef.current = false;
        await checkAuth();
        return response.data;
      }

      throw new Error('인증 토큰을 받지 못했습니다.');

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || '회원가입 중 오류 발생';
      
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
    }
  }, [checkAuth]);

  const logout = useCallback(() => {
    const currentProvider = authState.user?.provider; // 현재 사용자 provider 정보 저장

    removeTokens();
    setAuthState(prev => ({
      ...prev,
      user: null,
      error: null,
      isEmailVerified: false
    }));

    // 카카오 SDK 로그아웃 처리
    if (currentProvider === 'kakao') {
      try {
        const Kakao = (window as any).Kakao;
        if (Kakao && Kakao.Auth && Kakao.Auth.getAccessToken()) {
          Kakao.Auth.logout(() => {
            console.log('[AuthContext] Kakao SDK logout successful');
          });
        } else {
          console.log('[AuthContext] Kakao SDK not initialized or not logged in, skipping Kakao logout.');
        }
      } catch (e) {
        console.error('[AuthContext] Error during Kakao SDK logout:', e);
      }
    }
    // Google 로그아웃 (Google Identity Services gapi.auth2) - 현재는 GSI 사용으로 자동 처리 또는 명시적 revoke 불필요할 수 있음
    // Google의 경우, GSI는 토큰 기반이며, 명시적인 SDK 레벨의 세션 로그아웃이 카카오와 다름.
    // 클라이언트에서 토큰을 제거하는 것만으로 충분할 수 있음. 필요시 Google 문서를 참조하여 revokeToken 등의 처리를 할 수 있으나,
    // 현재 구조에서는 removeTokens()가 주된 역할.

  }, [authState.user?.provider]); // authState.user.provider를 의존성 배열에 추가

  const updateProfile = useCallback(async (userData: Partial<User>): Promise<boolean> => {
    const userId = authState.user?._id;
    if (!userId) {
      setAuthState(prev => ({ ...prev, error: '사용자 ID를 찾을 수 없습니다.' }));
      return false;
    }

    try {
      setAuthState(prev => ({ ...prev, error: null }));
      const response = await api.put<{ success: boolean; data: User }>(`/users/${userId}`, userData);

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
  }, [authState.user?._id]);

  const resetPassword = useCallback(async (email: string): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, error: null }));
      const response = await api.post<{ success: boolean }>('/auth/reset-password', { email });
      return response.data.success;
    } catch (error: any) {
      const message = error.response?.data?.message || '비밀번호 재설정 요청 중 오류가 발생했습니다.';
      setAuthState(prev => ({ ...prev, error: message }));
      throw new Error(message);
    }
  }, []);

  const updatePassword = useCallback(async (currentPassword: string, newPassword: string): Promise<boolean> => {
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
  }, []);

  const verifyEmail = useCallback(async (token: string): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, error: null, isLoading: true }));
      blockCheckAuthRef.current = true;
      
      const response = await api.post<{
        success: boolean;
        message?: string;
      }>('/auth/verify-email', { token });

      if (response.data.success) {
        setAuthState(prev => ({ ...prev, isLoading: false, error: null }));
        blockCheckAuthRef.current = false;
        return true;
      }
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: response.data.message || '이메일 인증에 실패했습니다.' 
      }));
      blockCheckAuthRef.current = false;
      return false;
    } catch (error: any) {
      const message = error.response?.data?.message || '이메일 인증 중 오류가 발생했습니다.';
      setAuthState(prev => ({ ...prev, isLoading: false, error: message }));
      blockCheckAuthRef.current = false;
      return false;
    }
  }, []);

  const resendVerificationEmail = useCallback(async (email: string): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, error: null }));
      const response = await api.post<{ success: boolean }>('/auth/resend-verification', { email });
      return response.data.success;
    } catch (error: any) {
      const message = error.response?.data?.message || '인증 이메일 재발송 중 오류가 발생했습니다.';
      setAuthState(prev => ({ ...prev, error: message }));
      throw new Error(message);
    }
  }, []);

  const completeKakaoSignup = useCallback(async (profileData: { kakaoId: string; email: string; nickname?: string; profileImage?: string; }) => {
    try {
      setAuthState(prev => ({ ...prev, error: null, isLoading: true }));
      const response = await api.post<{
        success: boolean;
        token?: string;
        refreshToken?: string;
        isNewUser?: boolean;
        errorCode?: string;
        message?: string;
      }>('/auth/kakao/complete-signup', profileData);

      if (response.data.success && response.data.token && response.data.refreshToken) {
        setTokens(response.data.token, response.data.refreshToken, true);
        await checkAuth(); // Fetch user info and update state
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return { success: true, isNewUser: response.data.isNewUser };
      } else {
        // Handle cases where signup might be successful but no tokens (should not happen for this flow ideally)
        // Or if success is false
        setAuthState(prev => ({ ...prev, isLoading: false, error: response.data.message || '카카오 계정 가입 완료에 실패했습니다.' }));
        return { success: false, errorCode: response.data.errorCode, message: response.data.message };
      }
    } catch (error: any) {
      const errResponse = error.response?.data;
      const message = errResponse?.message || '카카오 계정 가입 완료 중 오류가 발생했습니다.';
      const errorCode = errResponse?.errorCode;
      console.error('[AuthContext completeKakaoSignup] Error:', error.response || error);
      setAuthState(prev => ({ ...prev, isLoading: false, error: message }));
      return { success: false, errorCode, message };
    }
  }, [checkAuth]);

  const deleteAccount = useCallback(async (password?: string): Promise<{ success: boolean; errorCode?: string; message?: string }> => {
    setAuthState(prev => ({ ...prev, error: null, isLoading: true }));
    try {
      const response = await api.post<{
        success: boolean;
        errorCode?: string;
        message?: string;
      }>('/auth/delete-account', { password }); // password가 undefined여도 괜찮음 (소셜 유저)

      if (response.data.success) {
        logout(); // 기존 logout 함수 호출하여 토큰 제거 및 상태 업데이트
        setAuthState(prev => ({ ...prev, isLoading: false, user: null, error: null })); // 확실하게 초기화
        return { success: true, message: response.data.message };
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false, error: response.data.message || '계정 삭제에 실패했습니다.' }));
        return { success: false, errorCode: response.data.errorCode, message: response.data.message };
      }
    } catch (error: any) {
      const errResponse = error.response?.data;
      const message = errResponse?.message || '계정 삭제 중 오류가 발생했습니다.';
      const errorCode = errResponse?.errorCode;
      console.error('[AuthContext deleteAccount] Error:', error.response || error);
      setAuthState(prev => ({ ...prev, isLoading: false, error: message }));
      return { success: false, errorCode, message };
    }
  }, [logout, checkAuth]); // checkAuth는 직접 호출되지 않지만 logout 내부에서 간접적 영향 고려 가능성 (일단 logout만 명시)

  const socialLogin = useCallback(async (provider: 'google' | 'kakao', token: string, intent: 'login' | 'signup' | 'link'): Promise<{ success: boolean; isNewUser?: boolean; errorCode?: string; message?: string; tempKakaoProfile?: any; user?: User }> => {
    setIsLoading(true);
    blockCheckAuthRef.current = true;
    let operationResult: { success: boolean; isNewUser?: boolean; errorCode?: string; message?: string; tempKakaoProfile?: any; user?: User } = { success: false };

    try {
      const endpoint = intent === 'link' ? `/auth/link/${provider}` : `/auth/${provider}`;
      console.log(`[AuthContext SocialLogin] Calling POST ${api.defaults.baseURL}${endpoint} for ${provider}, intent: ${intent}`);
      
      // For linking, API instance already has token. For login/signup, no token needed for this call.
      const response = await api.post(endpoint, { token, intent });
      console.log('[AuthContext SocialLogin] API Response received:', response.data);

      if (response.data.success) {
        if (response.data.token && response.data.refreshToken) {
          console.log('[AuthContext SocialLogin] Social operation successful, setting tokens.');
          // For login and signup, rememberMe is true by default for social logins.
          // For linking, tokens are already set, but refreshing them is fine.
          setTokens(response.data.token, response.data.refreshToken, true);
          blockCheckAuthRef.current = false; // Allow checkAuth to run
          await checkAuth(); // Refresh user state from /me endpoint
        } else if (intent === 'link' && response.data.user) {
          // If it was a link operation and successful, but no new tokens (e.g. already linked, details updated)
          // We still want to refresh the user state from the potentially updated user object in the response.
          // Or better, just rely on checkAuth if it's robust enough.
          // For now, let checkAuth handle it to keep logic consistent.
          console.log('[AuthContext SocialLogin] Link operation successful, user data might have been updated. Relying on checkAuth.');
          blockCheckAuthRef.current = false; // Allow checkAuth to run
          await checkAuth(); 
        } else if (intent !== 'link' && !response.data.token) {
          // Login/Signup intent but no token in response - should not happen for success:true usually
          console.warn('[AuthContext SocialLogin] Social operation reported success but no tokens provided for login/signup.');
          throw new Error(response.data.message || '소셜 로그인/가입에 성공했으나, 인증 토큰을 받지 못했습니다.');
        }
        
        operationResult = { 
          success: true, 
          isNewUser: response.data.isNewUser, 
          message: response.data.message, 
          user: response.data.user // Pass the user object back
        };

      } else if (provider === 'kakao' && response.data.errorCode === 'ACCOUNT_NOT_FOUND_NO_EMAIL' && response.data.tempKakaoProfile) {
        // Specific case for Kakao needing email completion
        console.log('[AuthContext SocialLogin] Kakao signup requires email completion.');
        operationResult = { 
          success: false, 
          errorCode: response.data.errorCode, 
          message: response.data.message, 
          tempKakaoProfile: response.data.tempKakaoProfile 
        };
      } else {
        console.warn('[AuthContext SocialLogin] Social operation API call failed:', response.data);
        throw new Error(response.data.message || '소셜 인증 처리 중 오류가 발생했습니다.');
      }
    } catch (error: any) {
      console.error('[AuthContext SocialLogin] Error during API call or processing:', error.response?.data || error.message || error);
      const errorMessage = error.response?.data?.message || error.message || '소셜 인증 중 오류 발생';
      const errorCode = error.response?.data?.errorCode;
      const tempKakaoProfile = error.response?.data?.tempKakaoProfile;
      setAuthState(prev => ({ ...prev, error: errorMessage }));
      operationResult = { success: false, message: errorMessage, errorCode, tempKakaoProfile };
    } finally {
      setIsLoading(false);
      if (intent !== 'link' || !operationResult.success) {
         // If it's not a successful link operation, or any failure, ensure checkAuth block is lifted.
         blockCheckAuthRef.current = false;
      }
      // If it WAS a successful link operation, checkAuth was already called and block lifted.
    }
    console.log(`[AuthContext SocialLogin] Returning result:`, operationResult);
    return operationResult;
  }, [checkAuth]);

  const refreshUserSession = useCallback(async () => {
    await checkAuth();
  }, [checkAuth]);

  const providerValue = {
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
    resendVerificationEmail,
    completeKakaoSignup,
    deleteAccount,
    refreshUserSession,
  };

  return (
    <AuthContext.Provider value={providerValue}>
      {children}
    </AuthContext.Provider>
  );
};

// export default AuthContext; // 기본 내보내기 제거 