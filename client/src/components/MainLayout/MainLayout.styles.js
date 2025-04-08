import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { COMMON_STYLES } from '../../styles/theme';

// Main container for the entire layout
export const LayoutContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  flexDirection: 'column',
  transition: 'background-color 0.5s ease'
}));

<<<<<<< Updated upstream
// Top dynamic area (100vh)
export const TopDynamicArea = styled(Box)(({ theme }) => ({
  display: 'flex',
  position: 'relative',
  height: '100vh',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column'
  }
}));

// Left Panel
export const LeftPanel = styled(Box)(({ theme }) => ({
  width: '400px',
=======
export const TopDynamicArea = styled(Box)(({ theme }) => ({
  height: '100vh',
  width: '100%',
  display: 'flex',
  position: 'fixed',
  top: 0,
  left: 0,
  backgroundColor: theme.palette.background.paper,
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    height: 'auto',
    position: 'relative',
  },
}));

export const LeftPanel = styled(Box)(({ theme }) => ({
  width: '35%',
  height: '100vh',
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRight: `1px solid ${theme.palette.divider}`,
  position: 'relative',
  backgroundColor: theme.palette.background.default,

  [theme.breakpoints.down('md')]: {
    width: '100%',
    height: 'auto',
    padding: theme.spacing(2),
    borderRight: 'none',
    borderBottom: `1px solid ${theme.palette.divider}`,
    justifyContent: 'flex-start',
  },
}));

export const RightPanel = styled(Box)(({ theme }) => ({
  width: '65%',
  height: '100vh',
  padding: theme.spacing(4),
  overflowY: 'auto',
  position: 'relative',

  [theme.breakpoints.down('md')]: {
    width: '100%',
    height: 'auto',
    padding: theme.spacing(2),
    overflowY: 'visible',
  },
}));

export const FeedSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4, 0),
  backgroundColor: theme.palette.background.default,
  marginTop: '100vh',
  position: 'relative',
  zIndex: 1,

  [theme.breakpoints.down('md')]: {
    marginTop: 0,
  },
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

export const MenuInfoContainer = styled(motion.div)(({ theme }) => ({
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
>>>>>>> Stashed changes
  maxWidth: '400px',
  ...COMMON_STYLES.glass,
  borderRight: '1px solid rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    maxWidth: '100%',
    height: 'auto'
  }
}));

<<<<<<< Updated upstream
// Right Panel
export const RightPanel = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
  backgroundColor: 'rgba(255, 255, 255, 0.5)'
}));

// Right Panel Header
export const RightPanelHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}));

// Right Panel Title
export const RightPanelTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.primary
}));

// Content Container
export const MenuContentContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(3)
}));

// Feed Section
export const FeedSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  '&:not(:last-child)': {
    marginBottom: theme.spacing(4)
  }
}));

// OOTD Grid (4 columns)
export const OOTDGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: COMMON_STYLES.gridBreakpoints.lg,
=======
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

export const CardGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing(3),
  
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  
  [theme.breakpoints.up('lg')]: {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  position: 'relative',
  marginBottom: theme.spacing(4),
  fontWeight: 700,
  display: 'inline-block',
  
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: 60,
    height: 4,
    backgroundColor: theme.palette.primary.main,
    borderRadius: 2,
  },
}));

export const CardImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: '180px',
  objectFit: 'cover',
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
}));

export const VoteContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
>>>>>>> Stashed changes
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
  [theme.breakpoints.down('lg')]: {
    gridTemplateColumns: COMMON_STYLES.gridBreakpoints.md
  },
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: COMMON_STYLES.gridBreakpoints.sm
  },
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: COMMON_STYLES.gridBreakpoints.xs
  }
}));

// Text Content Grid (3 columns)
export const TextContentGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: COMMON_STYLES.gridBreakpoints.md,
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
  [theme.breakpoints.down('lg')]: {
    gridTemplateColumns: COMMON_STYLES.gridBreakpoints.sm
  },
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: COMMON_STYLES.gridBreakpoints.xs
  }
}));

// OOTD Card
export const OOTDCard = styled(Box)(({ theme }) => ({
  ...COMMON_STYLES.card,
  backgroundColor: theme.palette.background.paper,
  '&:hover': COMMON_STYLES.card.hover
}));

// OOTD Image Container
export const OOTDImageContainer = styled(Box)({
  position: 'relative',
  paddingTop: '100%',
  backgroundColor: '#f5f5f5'
});

// OOTD Image
export const OOTDImage = styled('img')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover'
});

// OOTD Label
export const OOTDLabel = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'center',
  fontSize: '0.875rem',
  fontWeight: 500
}));

// Text Card
export const TextCard = styled(Box)(({ theme }) => ({
  ...COMMON_STYLES.card,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  '&:hover': COMMON_STYLES.card.hover
}));

// Section Title Container
export const SectionTitleContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'rgba(0, 0, 0, 0.05)'
}));

// Section Title
export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 600,
  color: theme.palette.text.primary
}));

// Standard Grid Layout
export const CardGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: theme.spacing(3),
  marginTop: theme.spacing(2)
}));

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

// Logo Container
export const LogoContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

// Sidebar Container
export const SidebarContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  padding: theme.spacing(2)
}));

// Sidebar Item
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

// Stats Container
export const StatsContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: 'rgba(255, 255, 255, 0.6)',
  borderRadius: theme.shape.borderRadius,
  marginTop: 'auto'
}));

// Palette Icon Wrapper
export const PaletteIconWrapper = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.light,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: theme.spacing(2)
}));

// Gradient Text
export const GradientText = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 600
}));

// Left Panel Widgets
export const LeftPanelWidgets = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(3),
  marginTop: 'auto'
})); 