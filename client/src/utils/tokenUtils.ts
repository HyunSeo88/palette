// Token storage keys
const ACCESS_TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';

// Storage type
export type StorageType = 'local' | 'session';

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
  
  // 다른 스토리지에 있는 토큰 제거
  const otherStorage = rememberMe ? sessionStorage : localStorage;
  otherStorage.removeItem(ACCESS_TOKEN_KEY);
  otherStorage.removeItem(REFRESH_TOKEN_KEY);
  
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

export const hasValidToken = (): boolean => {
  const { accessToken } = getTokens();
  if (!accessToken) return false;

  try {
    // Basic token validation (check if expired)
    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

// Axios interceptor helper
export const getAuthHeader = (): { Authorization?: string } => {
  const { accessToken } = getTokens();
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
}; 