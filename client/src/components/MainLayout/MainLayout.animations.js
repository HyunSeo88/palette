/**
 * MainLayout 컴포넌트에서 사용하는 애니메이션 설정 모음
 */

// 로고 아이콘 애니메이션
export const logoIconAnimation = {
  initial: { opacity: 0, rotate: -20 },
  animate: { opacity: 1, rotate: 0 },
  transition: { duration: 0.8 },
  whileHover: { rotate: 360, scale: 1.1 },
  whileTap: { scale: 0.9 }
};

// 로고 텍스트 애니메이션
export const logoTextAnimation = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { delay: 0.2 }
};

// 히어로 타이틀 애니메이션
export const heroTitleAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.4 }
};

// 히어로 설명 애니메이션
export const heroDescriptionAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.6 }
};

// 히어로 버튼 애니메이션
export const heroButtonAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.8 }
};

// 히어로 이미지 애니메이션
export const heroImageAnimation = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 1, duration: 0.8 }
};

// 컬러 도트 애니메이션 - 인덱스에 따라 지연 시간 다르게 설정
export const getColorDotAnimation = (index) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: index * 0.1 },
  whileHover: { scale: 1.2 },
  whileTap: { scale: 0.9 }
});

// 애니메이션 모드 설정
export const animationConfig = {
  mode: "wait"
}; 