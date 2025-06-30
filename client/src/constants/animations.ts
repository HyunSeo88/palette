/**
 * Animation Constants for Palette Application
 * Following @frontend.mdc guidelines: Replace magic numbers with named constants for clarity
 */

// 애플 표준 애니메이션 지속 시간
export const ANIMATION_DURATION_FAST = 0.2;
export const ANIMATION_DURATION_STANDARD = 0.4;
export const ANIMATION_DURATION_SLOW = 0.6;

// 애플 표준 이징 함수
export const APPLE_EASING = [0.25, 0.1, 0.25, 1] as const;
export const SPRING_EASING = [0.68, -0.55, 0.265, 1.55] as const;

// Stagger 애니메이션 지연
export const STAGGER_DELAY_FAST = 0.05;
export const STAGGER_DELAY_STANDARD = 0.08;
export const STAGGER_DELAY_SLOW = 0.12;

// 캐러셀 관련 상수
export const CAROUSEL_CARD_WIDTH = 360;
export const CAROUSEL_CARD_GAP = 24;
export const CAROUSEL_AUTO_PLAY_INTERVAL = 6000; // 6초
export const CAROUSEL_NAVIGATION_BUTTON_SIZE = 48;

// 카드 애니메이션 관련
export const CARD_BORDER_RADIUS = 20;
export const CARD_HOVER_SCALE = 1.005;
export const CARD_TAP_SCALE = 0.98;

// 모달 및 오버레이
export const MODAL_BACKDROP_BLUR = 20;
export const GLASSMORPHISM_BLUR = 20;

// 스크롤 및 뷰포트
export const SCROLL_THRESHOLD = 50;
export const VIEWPORT_MARGIN = '-50px';

// 마이페이지 관련 상수
export const MYPAGE_POSTS_PER_PAGE = 6;
export const MYPAGE_PROFILE_AVATAR_SIZE = 80;
export const MYPAGE_POST_CARD_HEIGHT = 280;
export const ALL_POSTS_FILTER = 'all'; // 상수로 추출

export default {
  durations: {
    fast: ANIMATION_DURATION_FAST,
    standard: ANIMATION_DURATION_STANDARD,
    slow: ANIMATION_DURATION_SLOW,
  },
  easing: {
    apple: APPLE_EASING,
    spring: SPRING_EASING,
  },
  stagger: {
    fast: STAGGER_DELAY_FAST,
    standard: STAGGER_DELAY_STANDARD,
    slow: STAGGER_DELAY_SLOW,
  },
  carousel: {
    cardWidth: CAROUSEL_CARD_WIDTH,
    cardGap: CAROUSEL_CARD_GAP,
    autoPlayInterval: CAROUSEL_AUTO_PLAY_INTERVAL,
    navigationButtonSize: CAROUSEL_NAVIGATION_BUTTON_SIZE,
  },
  card: {
    borderRadius: CARD_BORDER_RADIUS,
    hoverScale: CARD_HOVER_SCALE,
    tapScale: CARD_TAP_SCALE,
  },
  effects: {
    backdropBlur: MODAL_BACKDROP_BLUR,
    glassmorphismBlur: GLASSMORPHISM_BLUR,
  },
  scroll: {
    threshold: SCROLL_THRESHOLD,
    viewportMargin: VIEWPORT_MARGIN,
  },
}; 