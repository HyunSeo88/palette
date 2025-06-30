import { createTheme, Theme } from '@mui/material/styles';
import { ColorVisionType } from './types/user';
import { useMemo } from 'react';

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
} as const;

// Base section colors with literal types
export const BASE_SECTION_COLORS = {
  value: '#F0F8FF' as const,
  hotPosts: '#F5F0FF' as const,
  ootd: '#FFF0F5' as const,
  events: '#F0FFF4' as const,
} as const;

export type SectionColorKey = keyof typeof BASE_SECTION_COLORS;
export type SectionColors = typeof BASE_SECTION_COLORS;

// Color transformation rules
const COLOR_TRANSFORM_RULES = {
  protanopia: {
    '#f': '#d',
    '#0': '#2'
  },
  deuteranopia: {
    '#0': '#2',
    '#f': '#d'
  },
  tritanopia: {
    'blue': 'darkblue',
    'yellow': 'gold'
  }
} as const;

// Simplified color transformation
const transformColors = (colors: Record<string, string>, type: ColorVisionType): Record<string, string> => {
  if (type === 'monochromacy') {
    return Object.fromEntries(
      Object.entries(colors).map(([key, value]) => {
        const rgb = parseInt(value.slice(1), 16);
        const gray = Math.round(
          0.299 * ((rgb >> 16) & 0xff) +
          0.587 * ((rgb >> 8) & 0xff) +
          0.114 * (rgb & 0xff)
        );
        const grayHex = gray.toString(16).padStart(2, '0');
        return [key, `#${grayHex}${grayHex}${grayHex}`];
      })
    );
  }

  const rules = COLOR_TRANSFORM_RULES[type as keyof typeof COLOR_TRANSFORM_RULES] || {};
  return Object.fromEntries(
    Object.entries(colors).map(([key, value]) => [
      key,
      Object.entries(rules).reduce(
        (acc, [pattern, replacement]) => acc.replace(pattern, replacement),
        value
      )
    ])
  );
};

// Base colors with literal types
const baseColors = {
  primary: '#1976d2',
  secondary: '#9C27B0',
  error: '#FF6347',
  warning: '#FFDA63',
  info: '#2196F3',
  success: '#4CAF50',
} as const;

// Memoized theme creation
export const useAppTheme = (colorVisionType: ColorVisionType = 'normal'): Theme => {
  return useMemo(() => {
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
  }, [colorVisionType]);
};

// Create and export the default theme
export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9C27B0',
      light: '#BA68C8',
      dark: '#7B1FA2',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#FF6347',
      light: '#FF8A7A',
      dark: '#E53E2F',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#FFDA63',
      light: '#FFE48F',
      dark: '#FFCA28',
      contrastText: '#212121',
    },
    info: {
      main: '#2196F3',
      light: '#64B5F6',
      dark: '#1976D2',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#4CAF50',
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

export const getSectionColors = (theme: Theme) => ({
  'value': {
    background: '#E3F2FD',
    color: '#1976D2',
  },
  'hot-posts': {
    background: '#FFEBEE',
    color: '#C62828',
  },
  'ootd': {
    background: '#FFF8E1',
    color: '#F57F17',
  },
  'community': {
    background: '#E0F7FA',
    color: '#00796B',
  },
  'voting': {
    background: '#ECEFF1',
    color: '#455A64',
  },
  'events': {
    background: '#F1F8E9',
    color: '#558B2F',
  },
});

export default theme; 