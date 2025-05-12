// 색각이상 유형
export type ColorVisionType = 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'monochromacy';

// 소셜 연결 정보 타입
export interface SocialLink {
  provider: 'google' | 'kakao';
  socialId: string;
  email?: string; // 소셜 계정에 연결된 이메일
  nickname?: string; // 소셜 프로필 닉네임
  profileImage?: string; // 소셜 프로필 이미지 URL
  isVerified?: boolean; // 해당 소셜 계정의 이메일 인증 여부
  linkedAt: string; // 연결된 날짜 (ISO 문자열)
}

// 사용자 기본 정보
export interface UserBase {
  _id: string;
  id: string; // Typically same as _id
  email: string; // 주 이메일 주소
  nickname: string;
  colorVisionType: ColorVisionType;
  bio?: string;
  photoURL?: string; // 프로필 이미지 URL (기존: profileImage)
  provider: 'email' | 'google' | 'kakao'; // 최초 가입 방식
  socialId?: string; // Deprecated: Use socialLinks instead. Represents socialId if initial signup was social.
  socialLinks: SocialLink[]; // 연결된 소셜 계정 목록
  createdAt: string;
  updatedAt: string;
  displayName: string; // 표시 이름 (닉네임과 동일할 수 있음)
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
  isEmailVerified: boolean; // 주 이메일 인증 여부
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