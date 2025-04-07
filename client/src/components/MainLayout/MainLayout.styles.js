import { styled } from '@mui/material/styles';
import { Box, Paper, Typography } from '@mui/material';
import { motion } from 'framer-motion';

export const LayoutContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  position: 'relative',
}));

export const TopSection = styled(Paper)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  zIndex: 1200,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2, 0),
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease',
  
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(2, 0),
  },

  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(2, 0),
  },

  '.scrolled &': {
    padding: theme.spacing(1, 0),
  }
}));

export const ContentSection = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isScrolled',
})(({ theme, isScrolled }) => ({
  flex: 1,
  width: '100%',
  position: 'relative',
  backgroundColor: theme.palette.background.default,
  transition: 'padding 0.3s ease',
  
  padding: theme.spacing(2, 0),
  paddingTop: isScrolled ? theme.spacing(2) : theme.spacing(4),
  
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3, 0),
    paddingTop: isScrolled ? theme.spacing(3) : theme.spacing(6),
  },

  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4, 0),
    paddingTop: isScrolled ? theme.spacing(4) : theme.spacing(8),
  },

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
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
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

export const HeroSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 0, 6),
  marginBottom: theme.spacing(4),
  position: 'relative',
  minHeight: 'calc(100vh - 80px)',
  display: 'flex',
  flexDirection: 'column',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: '30%',
    backgroundImage: `radial-gradient(circle at 50% 30%, ${theme.palette.primary.light}20, transparent 70%)`,
    zIndex: -1,
  },
  
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(6, 0, 8),
    marginBottom: theme.spacing(6),
  },
}));

export const SplitPanelContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  flex: 1,
  
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
  },
}));

export const LeftPanel = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  
  [theme.breakpoints.up('md')]: {
    width: '35%',
    padding: theme.spacing(4),
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

export const RightPanel = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2),
  
  [theme.breakpoints.up('md')]: {
    width: '65%',
    padding: theme.spacing(4),
  },
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
  maxWidth: '400px',
}));

export const MenuIconWrapper = styled(motion.div)(({ theme, color }) => ({
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  backgroundColor: color,
  color: theme.palette.getContrastText(color),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '24px',
  boxShadow: `0 4px 12px ${color}80`,
}));

export const HeroContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  marginBottom: theme.spacing(4),
}));

export const ColorPaletteContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  justifyContent: 'center',
  margin: theme.spacing(2, 0),
  flexWrap: 'wrap',
}));

export const ColorDot = styled(motion.div)(({ theme, color }) => ({
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  backgroundColor: color,
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  cursor: 'pointer',
  
  [theme.breakpoints.up('sm')]: {
    width: '32px',
    height: '32px',
  },
}));

export const HeroImage = styled(motion.img)(({ theme }) => ({
  width: '100%',
  maxWidth: '800px',
  margin: '0 auto',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
  aspectRatio: '16/9',
  objectFit: 'cover',
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
  
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
}));

export const FeedSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4, 0),
  backgroundColor: theme.palette.background.default,
  borderTop: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(4),
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
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

export const VoteOption = styled(Box)(({ theme, isSelected }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1.5, 2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: isSelected ? theme.palette.primary.light : theme.palette.grey[100],
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  border: `1px solid ${isSelected ? theme.palette.primary.main : 'transparent'}`,
  '&:hover': {
    backgroundColor: isSelected ? theme.palette.primary.light : theme.palette.grey[200],
  },
  gap: theme.spacing(1.5),
}));

export const FeedCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
})); 