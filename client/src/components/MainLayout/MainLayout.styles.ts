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
    PRIMARY: '#2D3748',
    BORDER: 'rgba(0,0,0,0.1)',
    SCROLLBAR_TRACK: '#f1f1f1',
    SCROLLBAR_THUMB: '#888',
    WHITE: '#fff',
  },
  SPACING: {
    XS: '8px',
    SM: '12px',
    MD: '24px',
    LG: '48px',
  },
  SHADOWS: {
    HEADER: '0 2px 4px rgba(0,0,0,0.1)',
    CONTENT: '0 4px 12px rgba(0,0,0,0.1)',
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
  color: string;
}

interface MenuIconProps {
  color?: string;
}

export const LayoutContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  overflow: 'hidden',
});

export const TopFixedArea = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
}));

export const Header = styled(Box)({
  ...flexCenter,
  justifyContent: 'space-between',
  padding: '12px 24px',
  height: '64px',
});

export const Logo = styled(Box)({
  ...flexCenter,
  gap: '8px',
  fontSize: '24px',
  fontWeight: 600,
  cursor: 'pointer',
  color: '#2D3748',
});

export const MainContent = styled(Box)({
  display: 'flex',
  height: 'calc(100vh - 64px)',
  marginTop: '64px',
});

export const LeftPanel = styled(Box)<LeftPanelProps>(({ open, theme }) => ({
  width: '280px',
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  borderRight: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  transition: 'transform 0.3s ease',
  [`@media (max-width: ${theme.breakpoints.values.sm}px)`]: {
    position: 'fixed',
    top: '64px',
    bottom: 0,
    transform: open ? 'translateX(0)' : 'translateX(-100%)',
    zIndex: 1000,
  },
}));

export const MenuItem = styled(Box)<MenuItemProps>(({ theme, isactive, color }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.5, 2),
  cursor: 'pointer',
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',

  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '4px',
    backgroundColor: color,
    opacity: isactive === 'true' ? 1 : 0,
    transition: 'opacity 0.3s ease',
  },

  '& .MuiTypography-root': {
    transition: 'color 0.3s ease',
  },

  '& .MuiTypography-body1': {
    color: isactive === 'true' ? color : theme.palette.text.primary,
    fontWeight: isactive === 'true' ? 600 : 400,
  },

  '&:hover': {
    backgroundColor: alpha(color, 0.08),
    '& .MuiTypography-body1': {
      color: color,
    },
    '&::before': {
      opacity: 0.5,
    },
  },

  ...(isactive === 'true' && {
    backgroundColor: alpha(color, 0.08),
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

export const RightPanel = styled(Box)({
  flex: 1,
  overflow: 'auto',
  scrollBehavior: 'smooth',
  scrollSnapType: 'y mandatory',
  ...scrollbarStyle,
});

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