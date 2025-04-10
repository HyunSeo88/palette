// Token storage keys
const ACCESS_TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';

// Storage type
type StorageType = 'local' | 'session';

// Get storage based on type
const getStorage = (type: StorageType = 'local'): Storage => {
  return type === 'local' ? localStorage : sessionStorage;
};

// Token management functions
export const setTokens = (
  accessToken: string,
  refreshToken: string,
  storageType: StorageType = 'local'
): void => {
  const storage = getStorage(storageType);
  storage.setItem(ACCESS_TOKEN_KEY, accessToken);
  storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const getAccessToken = (storageType: StorageType = 'local'): string | null => {
  const storage = getStorage(storageType);
  return storage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = (storageType: StorageType = 'local'): string | null => {
  const storage = getStorage(storageType);
  return storage.getItem(REFRESH_TOKEN_KEY);
};

export const removeTokens = (storageType: StorageType = 'local'): void => {
  const storage = getStorage(storageType);
  storage.removeItem(ACCESS_TOKEN_KEY);
  storage.removeItem(REFRESH_TOKEN_KEY);
};

export const hasValidToken = (): boolean => {
  const token = getAccessToken('local') || getAccessToken('session');
  if (!token) return false;

  try {
    // Basic token validation (check if expired)
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

// Axios interceptor helper
export const getAuthHeader = (): { Authorization?: string } => {
  const token = getAccessToken('local') || getAccessToken('session');
  return token ? { Authorization: `Bearer ${token}` } : {};
}; 