import { styled } from '@mui/material/styles';
import { Box, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';

// Common styles object for reuse
const COMMON_STYLES = {
  card: {
    borderRadius: 8,
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    hover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    }
  },
  panel: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: 12,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  }
};

// Main Layout Container
export const LayoutContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: 'var(--background-color, #F0F8FF)',
  transition: 'background-color 1s ease',
}));

// Top Fixed Area (100vh)
export const TopFixedArea = styled(Box)(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  backgroundColor: 'transparent',
}));

// Header
export const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 3),
  height: '64px',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(8px)',
  borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
}));

export const Logo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  fontSize: '1.5rem',
  fontWeight: 600,
  color: theme.palette.primary.main,
  '& svg': {
    width: 24,
    height: 24,
  },
}));

// Main Content Area
export const MainContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flex: 1,
  overflow: 'hidden',
}));

// Left Sidebar
export const LeftPanel = styled(Box)(({ theme }) => ({
  width: '320px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(8px)',
  borderRight: '1px solid rgba(0, 0, 0, 0.05)',
  padding: theme.spacing(4),
}));

// Menu Items - Increased size and spacing
export const MenuItem = styled(Box)(({ theme, active }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
  padding: theme.spacing(2.5, 3),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  backgroundColor: active ? 'rgba(74, 144, 226, 0.1)' : 'transparent',
  color: active ? theme.palette.primary.main : theme.palette.text.primary,
  '& .MuiTypography-root': {
    fontSize: '1.25rem',
    fontWeight: 500,
    letterSpacing: '0.02em',
  },
  '&:hover': {
    backgroundColor: 'rgba(74, 144, 226, 0.05)',
    transform: 'translateX(4px)',
  },
}));

export const MenuIcon = styled(Box)(({ theme, color }) => ({
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  backgroundColor: color || theme.palette.primary.main,
}));

// Community Stats - Increased text size
export const CommunityStats = styled(Box)(({ theme }) => ({
  marginTop: 'auto',
  padding: theme.spacing(4),
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  '& .MuiTypography-subtitle2': {
    fontSize: '1.3rem',
    fontWeight: 600,
    marginBottom: theme.spacing(3),
    color: theme.palette.text.primary,
  },
  '& .MuiTypography-body2': {
    fontSize: '1.1rem',
    lineHeight: 1.6,
  },
  '& > *:not(:last-child)': {
    marginBottom: theme.spacing(2),
  },
}));

// Right Content Panel
export const RightPanel = styled(Box)(({ theme, bgcolor }) => ({
  flex: 1,
  height: '100%',
  padding: theme.spacing(3),
  overflow: 'auto',
  backgroundColor: bgcolor ? `${bgcolor}20` : 'transparent', // 20 is for 12% opacity
  transition: 'background-color 0.3s ease',
}));

// Value Content (Full image)
export const ValueContent = styled(Paper)(({ theme }) => ({
  padding: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  position: 'relative',
  overflow: 'hidden',
  height: '100%',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
  },
  '&:hover img': {
    transform: 'scale(1.02)',
  },
}));

export const CloseButton = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  cursor: 'pointer',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.text.primary,
  },
}));

// Section spacing and dividers
export const FeedSection = styled(Box)(({ theme }) => ({
  minHeight: '50vh',
  padding: theme.spacing(6, 3),
  scrollMarginTop: '64px',
  '& .MuiTypography-h5': {
    fontSize: '2rem',
    fontWeight: 700,
    padding: theme.spacing(2, 3),
    marginBottom: theme.spacing(4),
    borderRadius: theme.shape.borderRadius * 2,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
    display: 'inline-block',
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: theme.spacing(3),
      right: theme.spacing(3),
      height: '2px',
      background: 'linear-gradient(to right, rgba(0,0,0,0.1), rgba(0,0,0,0.05))',
    },
  },
}));

// Section Title
export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 600,
  marginBottom: theme.spacing(3),
  color: theme.palette.text.primary,
}));

// Grid Layouts
export const CardGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: theme.spacing(3),
  marginTop: theme.spacing(2)
}));

// OOTD Card Components
export const OOTDImageContainer = styled(Box)(({ theme }) => ({
  ...COMMON_STYLES.card,
  position: 'relative',
  aspectRatio: '1',
  width: '100%',
  '&:hover': COMMON_STYLES.card.hover,
}));

export const OOTDImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

export const OOTDLabel = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(1),
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  color: '#fff',
  fontSize: '0.875rem',
  textAlign: 'center',
}));

// Text Content Components
export const TextCard = styled(Box)(({ theme }) => ({
  ...COMMON_STYLES.card,
  padding: theme.spacing(2),
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  '&:hover': COMMON_STYLES.card.hover,
}));

// Section Components
export const SectionTitleContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'rgba(0, 0, 0, 0.05)'
}));

// Sidebar Components
export const SidebarContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  padding: theme.spacing(2)
}));

export const SidebarItem = styled(Box)(({ theme, active }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(1.5, 2),
  borderRadius: theme.shape.borderRadius,
  cursor: 'pointer',
  color: active ? theme.palette.primary.main : theme.palette.text.primary,
  backgroundColor: active ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)'
  }
}));

// Stats and Widget Components
export const StatsContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: 'rgba(255, 255, 255, 0.6)',
  borderRadius: theme.shape.borderRadius,
  marginTop: 'auto'
}));

export const PaletteIconWrapper = styled(motion.div)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  color: theme.palette.primary.main,
  
  [theme.breakpoints.down('sm')]: {
    width: '40px',
    height: '40px',
  },
}));

export const GradientText = styled(motion(Typography))(({ theme }) => ({
  backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  fontWeight: 'bold',
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  letterSpacing: '0.5px',
}));

export const LeftPanelWidgets = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(3),
  marginTop: 'auto'
}));

export const ContentSection = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isScrolled',
})(({ theme, isScrolled }) => ({
  flex: 1,
  width: '100%',
  position: 'relative',
  backgroundColor: theme.palette.background.default,
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: theme.palette.background.paper,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.grey[300],
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: theme.palette.grey[400],
    },
  },
}));

export const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const MenuInfoContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  width: '100%',
}));

export const MenuIconWrapper = styled(motion.div)(({ theme, color }) => ({
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  backgroundColor: color,
  color: theme.palette.getContrastText(color || theme.palette.primary.main),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '24px',
  boxShadow: `0 4px 12px ${(color || theme.palette.primary.main)}80`,
}));

export const ContentCard = styled(motion(Paper))(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  overflow: 'hidden',
  height: '100%',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
  },
}));

export const MenuContentContainer = styled(motion.div)({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  gap: '1rem',
});

// Basic Card
export const UnifiedCard = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)'
  }
}));

// Card Image Container
export const CardImageContainer = styled(Box)({
  position: 'relative',
  paddingTop: '100%',
  backgroundColor: '#f5f5f5'
});

// Card Image
export const CardImage = styled('img')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover'
});

// Card Content
export const CardContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2)
}));

// Header Icons Container
export const HeaderIcons = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  '& .MuiIconButton-root': {
    color: theme.palette.text.primary,
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  },
})); 