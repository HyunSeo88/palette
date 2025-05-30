import { ColorVisionType, User as MainUser } from './user';

export interface AuthError {
  success: false;
  message: string;
  error: AuthErrorType;
}

export type AuthErrorType = 
  | 'TOKEN_EXPIRED'
  | 'TOKEN_INVALID'
  | 'TOKEN_MISSING'
  | 'REFRESH_TOKEN_EXPIRED'
  | 'REFRESH_TOKEN_INVALID'
  | 'REFRESH_TOKEN_MISSING'
  | 'EMAIL_NOT_VERIFIED'
  | 'UNAUTHORIZED'
  | 'SERVER_ERROR';

export interface TokenPayload {
  id: string;
  exp: number;
  iat: number;
}

export interface RefreshAttemptInfo {
  count: number;
  lastAttempt: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    email?: string;
    token?: string;
    refreshToken?: string;
    requiresVerification?: boolean;
  };
  error?: {
    field: string;
    message: string;
  };
}

export interface RegisterData {
  email: string;
  password: string;
  nickname: string;
  colorVisionType: ColorVisionType;
  bio?: string;
}

export interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
}

// Re-export the main User type for use in auth contexts
// This ensures consistency with the comprehensive User definition
export type User = MainUser; 