import { createTheme, Theme } from '@mui/material/styles';
import { ColorVisionType } from './types/user';

// Common style constants
export const COMMON_STYLES = {
  card: {
    borderRadius: 8,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s ease',
    hover: {
      transform: 'translateY(-4px)'
    }
  },
  glass: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)'
  },
  gridBreakpoints: {
    xs: '1fr',
    sm: 'repeat(2, 1fr)',
    md: 'repeat(3, 1fr)',
    lg: 'repeat(4, 1fr)'
  }
};

// Base section colors
const BASE_SECTION_COLORS = {
  value: '#F0F8FF',
  hotPosts: '#F5F0FF',
  ootd: '#FFF0F5',
  events: '#F0FFF4',
};

// Get section colors adjusted for color vision type
export const getSectionColors = (colorVisionType: ColorVisionType = 'normal'): typeof BASE_SECTION_COLORS => {
  const transformed = transformColors(BASE_SECTION_COLORS, colorVisionType);
  return {
    value: transformed.value || BASE_SECTION_COLORS.value,
    hotPosts: transformed.hotPosts || BASE_SECTION_COLORS.hotPosts,
    ootd: transformed.ootd || BASE_SECTION_COLORS.ootd,
    events: transformed.events || BASE_SECTION_COLORS.events,
  };
};

// 색각이상 유형별 색상 변환 함수
const transformColors = (colors: Record<string, string>, type: ColorVisionType): Record<string, string> => {
  switch (type) {
    case 'protanopia': // 제1색각이상 (적색맹)
      return Object.fromEntries(
        Object.entries(colors).map(([key, value]) => {
          // 빨간색을 더 어둡게, 녹색을 더 밝게 조정
          if (value.startsWith('#f')) {
            return [key, value.replace(/^#f/, '#d')];
          }
          if (value.startsWith('#0')) {
            return [key, value.replace(/^#0/, '#2')];
          }
          return [key, value];
        })
      );

    case 'deuteranopia': // 제2색각이상 (녹색맹)
      return Object.fromEntries(
        Object.entries(colors).map(([key, value]) => {
          // 녹색을 더 어둡게, 빨간색을 더 밝게 조정
          if (value.startsWith('#0')) {
            return [key, value.replace(/^#0/, '#2')];
          }
          if (value.startsWith('#f')) {
            return [key, value.replace(/^#f/, '#d')];
          }
          return [key, value];
        })
      );

    case 'tritanopia': // 제3색각이상 (청색맹)
      return Object.fromEntries(
        Object.entries(colors).map(([key, value]) => {
          // 파란색과 노란색의 대비를 강화
          if (value.includes('blue')) {
            return [key, value.replace('blue', 'darkblue')];
          }
          if (value.includes('yellow')) {
            return [key, value.replace('yellow', 'gold')];
          }
          return [key, value];
        })
      );

    case 'monochromacy': // 전색맹
      return Object.fromEntries(
        Object.entries(colors).map(([key, value]) => {
          // 모든 색상을 흑백 스케일로 변환
          const rgb = parseInt(value.slice(1), 16);
          const r = (rgb >> 16) & 0xff;
          const g = (rgb >> 8) & 0xff;
          const b = rgb & 0xff;
          const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
          const grayHex = gray.toString(16).padStart(2, '0');
          return [key, `#${grayHex}${grayHex}${grayHex}`];
        })
      );

    default:
      return colors;
  }
};

// 기본 색상 팔레트
const baseColors = {
  primary: '#1976d2',
  secondary: '#9C27B0',
  error: '#FF6347',
  warning: '#FFDA63',
  info: '#2196F3',
  success: '#4CAF50',
};

// 테마 생성 함수
export const createAppTheme = (colorVisionType: ColorVisionType = 'normal'): Theme => {
  const transformedColors = transformColors(baseColors, colorVisionType);

  return createTheme({
    palette: {
      primary: {
        main: transformedColors.primary,
        light: '#42a5f5',
        dark: '#1565c0',
      },
      secondary: {
        main: transformedColors.secondary,
        light: '#BA68C8',
        dark: '#7B1FA2',
        contrastText: '#FFFFFF',
      },
      error: {
        main: transformedColors.error,
        light: '#FF8A7A',
        dark: '#E53E2F',
        contrastText: '#FFFFFF',
      },
      warning: {
        main: transformedColors.warning,
        light: '#FFE48F',
        dark: '#FFCA28',
        contrastText: '#212121',
      },
      info: {
        main: transformedColors.info,
        light: '#64B5F6',
        dark: '#1976D2',
        contrastText: '#FFFFFF',
      },
      success: {
        main: transformedColors.success,
        light: '#81C784',
        dark: '#388E3C',
        contrastText: '#FFFFFF',
      },
      background: {
        default: '#F0F8FF',
        paper: '#FFFFFF',
      },
    },
    typography: {
      fontFamily: '"Pretendard", -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif',
      h1: { fontWeight: 600 },
      h2: { fontWeight: 600 },
      h3: { fontWeight: 600 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiPaper: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
          },
          containedPrimary: {
            background: 'linear-gradient(135deg, #87CEEB, #5BACD8)',
          },
          containedSecondary: {
            background: 'linear-gradient(135deg, #BA68C8, #7B1FA2)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            overflow: 'hidden',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
            },
          },
        },
      },
    },
  });
};

// Create and export the default theme
export const theme = createAppTheme('normal');
export default theme; 