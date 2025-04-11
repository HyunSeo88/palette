import { TokenPayload } from '../types/auth';

// Token storage keys
const ACCESS_TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';

// Storage type
export type StorageType = 'local' | 'session';

// 토큰 상태 타입 정의
export interface TokenValidationResult {
  isValid: boolean;
  error?: 'TOKEN_MISSING' | 'TOKEN_INVALID' | 'TOKEN_EXPIRED';
  message: string | null;
}

// Get storage based on type
const getStorage = (type: StorageType = 'local'): Storage => {
  return type === 'local' ? localStorage : sessionStorage;
};

// Token management functions
export const setTokens = (
  accessToken: string,
  refreshToken: string,
  rememberMe: boolean
) => {
  const storage = rememberMe ? localStorage : sessionStorage;
  
  // 기존 토큰 제거
  removeTokens();
  
  // 새 토큰 저장
  storage.setItem(ACCESS_TOKEN_KEY, accessToken);
  storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const getTokens = () => {
  // localStorage에서 먼저 확인
  let accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  let refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

  // localStorage에 없으면 sessionStorage에서 확인
  if (!accessToken && !refreshToken) {
    accessToken = sessionStorage.getItem(ACCESS_TOKEN_KEY);
    refreshToken = sessionStorage.getItem(REFRESH_TOKEN_KEY);
  }

  return { accessToken, refreshToken };
};

export const removeTokens = () => {
  // 모든 스토리지에서 토큰 제거
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const validateToken = (token: string | null): TokenValidationResult => {
  if (!token) {
    return { 
      isValid: false, 
      error: 'TOKEN_MISSING',
      message: '인증 토큰이 없습니다.'
    };
  }

  try {
    const [header, payload, signature] = token.split('.');
    
    if (!header || !payload || !signature) {
      return { 
        isValid: false, 
        error: 'TOKEN_INVALID',
        message: '유효하지 않은 토큰입니다.'
      };
    }

    const decodedPayload = JSON.parse(atob(payload)) as TokenPayload;
    
    if (decodedPayload.exp * 1000 <= Date.now()) {
      return { 
        isValid: false, 
        error: 'TOKEN_EXPIRED',
        message: '만료된 토큰입니다.'
      };
    }

    return { isValid: true, message: null };
  } catch (error) {
    return { 
      isValid: false, 
      error: 'TOKEN_INVALID',
      message: '유효하지 않은 토큰입니다.'
    };
  }
};

export const validateTokenPair = (
  accessToken: string | null,
  refreshToken: string | null
): TokenValidationResult => {
  // 토큰 존재 여부 확인
  if (!accessToken || !refreshToken) {
    return {
      isValid: false,
      error: 'TOKEN_MISSING',
      message: '인증 토큰이 없습니다.'
    };
  }

  // 액세스 토큰 검증
  const accessTokenValidation = validateToken(accessToken);
  if (!accessTokenValidation.isValid) {
    return accessTokenValidation;
  }

  return { isValid: true, message: null };
};

export const hasValidToken = (): boolean => {
  const { accessToken, refreshToken } = getTokens();
  return validateTokenPair(accessToken, refreshToken).isValid;
};

// Axios interceptor helper
export const getAuthHeader = (): { Authorization?: string } => {
  const { accessToken } = getTokens();
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
}; 