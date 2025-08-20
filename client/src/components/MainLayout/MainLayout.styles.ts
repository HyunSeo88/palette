import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { COMMON_STYLES } from '../../theme';
import { alpha } from '@mui/material/styles';
import { Theme } from '@mui/material/styles';

const {
  card: cardStyle,
  glass: glassStyle,
  gridBreakpoints
} = COMMON_STYLES;

// Style constants
const STYLE_CONSTANTS = {
  HEADER_HEIGHT: '64px',
  PANEL_WIDTH: '280px',
  BREAKPOINT_MOBILE: '600px',
  COLORS: {
    PRIMARY: '#1976d2', // MUI primary blue
    BORDER: 'rgba(0,0,0,0.1)',
    SCROLLBAR_TRACK: '#f1f1f1',
    SCROLLBAR_THUMB: '#888',
    WHITE: '#fff',
    LIGHT_BG: '#F0F8FF', // Light blue background matching theme.ts
  },
  SPACING: {
    XS: '8px',
    SM: '12px',
    MD: '24px',
    LG: '48px',
  },
  SHADOWS: {
    HEADER: '0 2px 8px rgba(0,0,0,0.05)',
    CONTENT: '0 4px 12px rgba(0,0,0,0.05)',
    CARD: '0 4px 12px rgba(0, 0, 0, 0.05)', // Matches Card shadow from theme.ts
  },
} as const;

// Shared styles
const flexCenter = {
  display: 'flex',
  alignItems: 'center',
};

const scrollbarStyle = {
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#888',
    borderRadius: '4px',
  },
};

interface LeftPanelProps {
  open: boolean;
}

interface MenuItemProps {
  isactive: string;
}

interface MenuIconProps {
  color?: string;
}

export const LayoutContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  overflow: 'hidden',
  backgroundColor: STYLE_CONSTANTS.COLORS.LIGHT_BG, // Use the light blue background from theme.ts
});

export const TopFixedArea = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1200,
  backgroundColor: alpha(theme.palette.background.paper, 0.85),
  borderBottom: `1px solid ${theme.palette.grey[100]}`,
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  backdropFilter: 'blur(20px)',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
}));

export const Header = styled(Box)(({ theme }) => ({
  ...flexCenter,
  justifyContent: 'space-between',
  padding: '16px 32px',
  height: '72px',
  maxWidth: '1400px',
  margin: '0 auto',
  width: '100%',
  
  [theme.breakpoints.down('sm')]: {
    padding: '12px 16px',
    height: '64px',
  },
}));

export const Logo = styled(Box)(({ theme }) => ({
  ...flexCenter,
  gap: '12px',
  fontSize: '28px',
  fontWeight: 700,
  cursor: 'pointer',
  color: theme.palette.primary.main,
  letterSpacing: '-0.02em',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  
  '&:hover': {
    transform: 'scale(1.02)',
  },
  
  [theme.breakpoints.down('sm')]: {
    fontSize: '24px',
    gap: '8px',
  },
}));

export const MainContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: 'calc(100vh - 72px)',
  marginTop: '72px',
  
  [theme.breakpoints.down('sm')]: {
    height: 'calc(100vh - 64px)',
    marginTop: '64px',
  },
}));

export const LeftPanel = styled(Box)<LeftPanelProps>(({ open, theme }) => ({
  width: STYLE_CONSTANTS.PANEL_WIDTH,
  flexShrink: 0,
  backgroundColor: theme.palette.background.paper, // White paper background
  borderRight: `1px solid ${theme.palette.divider}`,
  padding: STYLE_CONSTANTS.SPACING.SM,
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  boxShadow: '4px 0px 10px rgba(0, 0, 0, 0.03)', // Subtle shadow on the right edge
  [`@media (max-width: ${theme.breakpoints.values.sm}px)`]: {
    position: 'fixed',
    top: STYLE_CONSTANTS.HEADER_HEIGHT,
    bottom: 0,
    transform: open ? 'translateX(0)' : 'translateX(-100%)',
    zIndex: 1000,
    boxShadow: theme.shadows[3],
  },
}));

export const MenuItem = styled(Box)<MenuItemProps>(({ theme, isactive }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.5, 2),
  cursor: 'pointer',
  borderRadius: '12px',
  transition: 'background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out, transform 0.2s ease',
  marginBottom: theme.spacing(1),
  color: theme.palette.text.secondary,
  fontWeight: 500,

  '& .MuiTypography-root': {
    transition: 'color 0.3s ease',
    fontWeight: 'inherit',
  },

  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    color: theme.palette.primary.main,
    transform: 'translateX(4px)', // Subtle movement on hover
  },

  ...(isactive === 'true' && {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
    fontWeight: 600,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)', // Subtle shadow for active items
  }),
}));

export const MenuIcon = styled('div')<{ color?: string }>(({ theme, color }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: color || theme.palette.primary.main,
  flexShrink: 0,
}));

export const HeaderIcons = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: STYLE_CONSTANTS.SPACING.XS,
});

export const CommunityStats = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: STYLE_CONSTANTS.SPACING.XS,
});

export const RightPanel = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  scrollBehavior: 'smooth',
  ...scrollbarStyle,
  padding: STYLE_CONSTANTS.SPACING.MD,
  backgroundColor: alpha(theme.palette.background.default, 0.5), // Lighter than the LayoutContainer background
}));

export const Section = styled(Box)({
  minHeight: `calc(100vh - ${STYLE_CONSTANTS.HEADER_HEIGHT})`,
  height: `calc(100vh - ${STYLE_CONSTANTS.HEADER_HEIGHT})`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: STYLE_CONSTANTS.SPACING.LG,
  position: 'relative',
  overflow: 'hidden',
  flex: `0 0 calc(100vh - ${STYLE_CONSTANTS.HEADER_HEIGHT})`,
  scrollSnapAlign: 'start',
});

export const SectionContent = styled(Box)({
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',
  position: 'relative',
  zIndex: 1,
  height: 'auto',
});

export const SectionTitle = styled(Typography)({
  marginBottom: STYLE_CONSTANTS.SPACING.LG,
  transition: 'opacity 0.5s ease',
});

export const ValueContent = styled(Box)({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  maxHeight: `calc(100vh - ${STYLE_CONSTANTS.HEADER_HEIGHT} - 120px)`,
  padding: '24px',
  
  '& img': {
    width: 'auto',
    maxWidth: '100%',
    height: 'auto',
    maxHeight: `calc(100vh - ${STYLE_CONSTANTS.HEADER_HEIGHT} - 180px)`,
    objectFit: 'contain',
    borderRadius: '16px',
    boxShadow: STYLE_CONSTANTS.SHADOWS.CONTENT,
  },
});

export const CardGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: theme.spacing(3),
  padding: theme.spacing(3),
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',
})); 