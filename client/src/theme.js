import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#4A90E2',
      light: '#F0F8FF',
      dark: '#2171C7',
    },
    secondary: {
      main: '#F5F7FA',
      light: '#FFFFFF',
      dark: '#E4E7EB',
    },
    background: {
      default: '#F0F8FF',
      paper: 'rgba(255, 255, 255, 0.9)',
    },
    text: {
      primary: '#2C3E50',
      secondary: '#5A6B7B',
    },
  },
  typography: {
    fontFamily: '"Pretendard", -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1.1rem',
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
  },
  shape: {
    borderRadius: 12,
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
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
  },
});

export const SECTION_COLORS = {
  value: '#F0F8FF',
  hotPosts: '#F5F0FF',
  ootd: '#FFF0F5',
  events: '#F0FFF4',
}; 