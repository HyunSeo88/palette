import { styled } from '@mui/material/styles';
import { Box, Container, Typography } from '@mui/material';

interface StyledContainerProps {
  bgcolor?: string;
}

interface MenuItemProps {
  active?: boolean;
  color: string;
}

export const LayoutContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  width: '100%',
  backgroundColor: '#FAFAFA',
});

export const TopFixedArea = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  backgroundColor: '#fff',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
});

export const Header = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 24px',
  borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
  height: '64px',
});

export const Logo = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  fontSize: '28px',
  fontWeight: 700,
  color: '#2D3748',
  cursor: 'pointer',
  '& svg': {
    width: '28px',
    height: '28px',
    color: '#4A90E2',
    transform: 'rotate(-45deg)',
    filter: 'drop-shadow(0 2px 4px rgba(74, 144, 226, 0.2))',
  },
  '&:hover svg': {
    transform: 'rotate(-45deg) scale(1.1)',
    transition: 'transform 0.2s ease',
  },
});

export const HeaderIcons = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  '& .MuiIconButton-root': {
    color: '#4A5568',
    '&:hover': {
      backgroundColor: 'rgba(74, 144, 226, 0.08)',
    },
  },
});

export const MainContent = styled(Box)({
  display: 'flex',
  position: 'relative',
  height: 'calc(100vh - 64px)',
  marginTop: '64px',
  gap: '24px',
  overflow: 'hidden',
});

export const LeftPanel = styled(Box)({
  width: '280px',
  backgroundColor: '#fff',
  padding: '24px',
  height: 'calc(100vh - 64px)',
  position: 'fixed',
  left: 0,
  top: '64px',
  overflowY: 'auto',
  borderRight: '1px solid rgba(0, 0, 0, 0.06)',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const MenuItem = styled(Box)<MenuItemProps>(({ active, color }) => ({
  padding: '12px 16px',
  marginBottom: '8px',
  borderRadius: '12px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  backgroundColor: active ? `${color}10` : 'transparent',
  '& .MuiTypography-root': {
    color: active ? color : '#4A5568',
    fontWeight: active ? 600 : 400,
  },
  '&:hover': {
    backgroundColor: `${color}08`,
  },
}));

export const MenuIcon = styled(Box)<{ color: string }>(({ color }) => ({
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  marginRight: '12px',
  backgroundColor: color,
  boxShadow: `0 0 0 2px ${color}20`,
}));

export const CommunityStats = styled(Box)({
  marginTop: 'auto',
  padding: '20px',
  backgroundColor: '#F7FAFC',
  borderRadius: '16px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  '& .MuiTypography-subtitle2': {
    color: '#2D3748',
    fontWeight: 600,
    marginBottom: '16px',
  },
  '& .MuiBox-root': {
    marginBottom: '8px',
    '&:last-child': {
      marginBottom: 0,
    },
  },
});

export const RightPanel = styled(Box)<StyledContainerProps>(({ bgcolor }) => ({
  flex: 1,
  marginLeft: '280px',
  backgroundColor: bgcolor || '#ffffff',
  transition: 'background-color 0.3s ease',
  padding: 0,
  height: 'calc(100vh - 64px)',
  borderRadius: '24px 0 0 0',
  overflowY: 'auto',
  scrollBehavior: 'smooth',
  scrollSnapType: 'y mandatory',
  position: 'relative',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '4px',
  },
}));

export const ValueContent = styled(Box)({
  maxWidth: '1200px',
  margin: '0 auto',
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  '& img': {
    width: '100%',
    height: 'auto',
    display: 'block',
  },
});

export const CardGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '24px',
  padding: '24px',
});

export const TextCard = styled(Box)({
  backgroundColor: '#fff',
  borderRadius: '12px',
  padding: '16px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
});

export const OOTDImageContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  paddingTop: '100%',
  borderRadius: '12px',
  overflow: 'hidden',
  marginBottom: '12px',
});

export const OOTDImage = styled('img')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

export const OOTDLabel = styled(Typography)({
  position: 'absolute',
  bottom: '12px',
  left: '12px',
  color: '#fff',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '14px',
});

export const Section = styled(Box)<StyledContainerProps>(({ bgcolor }) => ({
  height: 'calc(100vh - 64px)',
  minHeight: 'calc(100vh - 64px)',
  width: '100%',
  backgroundColor: bgcolor || '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '48px 24px',
  scrollSnapAlign: 'start',
  scrollSnapStop: 'always',
  position: 'relative',
  overflow: 'hidden',
  marginTop: 0,
  marginBottom: 0,
  '&:first-of-type': {
    marginTop: 0,
  },
  '&:last-child': {
    marginBottom: 0,
  },
}));

export const SectionTitle = styled(Typography)({
  fontSize: '32px',
  fontWeight: 700,
  color: '#2D3748',
  marginBottom: '32px',
  textAlign: 'center',
  opacity: 0,
  transform: 'translateY(20px)',
  transition: 'opacity 0.5s ease, transform 0.5s ease',
  '&.visible': {
    opacity: 1,
    transform: 'translateY(0)',
  },
});

export const SectionContent = styled(Box)({
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',
  opacity: 0,
  transform: 'translateY(20px)',
  transition: 'opacity 0.5s ease, transform 0.5s ease',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  '&.visible': {
    opacity: 1,
    transform: 'translateY(0)',
  },
}); 