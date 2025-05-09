// 색각이상 유형
export type ColorVisionType = 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'monochromacy';

// 사용자 기본 정보
export interface UserBase {
  _id: string;
  id: string;
  email: string;
  nickname: string;
  colorVisionType: ColorVisionType;
  bio?: string;
  photoURL?: string;
  provider: 'email' | 'google' | 'kakao';
  createdAt: string;
  updatedAt: string;
  displayName: string;
}

// 사용자 선호도 정보
export interface UserPreferences {
  styles: string[];
  interests: string[];
  colorSchemes: string[];
}

// 전체 사용자 정보
export interface User extends UserBase {
  preferences: UserPreferences;
  isEmailVerified: boolean;
  role: 'user' | 'admin';
}

// 회원가입 데이터
export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
  colorVisionType: ColorVisionType;
  bio?: string;
}

// 프로필 업데이트 데이터
export interface ProfileUpdateData {
  nickname?: string;
  bio?: string;
  colorVisionType?: ColorVisionType;
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
  preferences?: Partial<UserPreferences>;
} 