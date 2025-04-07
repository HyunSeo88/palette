/**
 * MainLayout 컴포넌트에서 사용하는 상수 값 모음
 */

// 시스템 상수
export const RETRY_DELAY = 500; // ms - 재시도 딜레이
export const SCROLL_THRESHOLD = 50; // px - 스크롤 감지 임계값
export const INITIAL_SECTION = 'values'; // 초기 선택 섹션

// 디자인 상수
export const PALETTE_COLORS = {
  RED: '#FF6347',
  BLUE: '#87CEEB',
  YELLOW: '#FFDA63',
  GRAY: '#B0B0B0',
  LIGHT_GRAY: '#F5F5F5'
};

// 이미지 URL
export const HERO_IMAGE_URL = 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';
export const HERO_IMAGE_ALT = 'Colorful palette of paints';

// 텍스트 상수
export const UI_TEXT = {
  COMMUNITY_NAME: 'Palette',
  HERO_TITLE: '색각이상자를 위한 패션 커뮤니티',
  HERO_DESCRIPTION: '다양한 컬러 팔레트와 패션 스타일링 정보를 공유하고, 색각이상자를 위한 맞춤형 패션 추천을 제공하는 공간입니다.',
  JOIN_BUTTON: '커뮤니티 가입하기'
};

// 애니메이션 확률 - API 오류 시뮬레이션용
export const ERROR_PROBABILITY = 0.05; // 5% 확률로 에러 발생 