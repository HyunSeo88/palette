import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import Sidebar from '../Sidebar/Sidebar';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import {
  UI_TEXT,
  MENU_ITEMS,
  menuIcons
} from '../MainLayout/MainLayout.constants';
import {
  logoIconAnimation,
  logoTextAnimation
} from '../MainLayout/MainLayout.animations';

// Styled components
const LogoContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '32px',
});

const GradientText = styled(motion.div)({
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontSize: '2rem',
  fontWeight: 600,
});

const PaletteIconWrapper = styled(motion.div)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const LeftPanelWidgets = styled(Box)({
  marginTop: 'auto',
  padding: '16px',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '8px',
});

interface LeftPanelContentProps {
  activeMenu: string;
  onMenuClick: (menuId: string) => void;
  isMobile?: boolean;
}

const LeftPanelContent: React.FC<LeftPanelContentProps> = ({ 
  activeMenu, 
  onMenuClick, 
  isMobile 
}) => {
  const theme = useTheme();

  return (
    <>
      {/* Top section: Logo and Sidebar */}
      <Box sx={{ flexGrow: 0, mb: 4 }}>
        <LogoContainer>
          <PaletteIconWrapper {...logoIconAnimation}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill={theme.palette.primary.main} />
              <path d="M12 6C9.79 6 8 7.79 8 10C8 12.21 9.79 14 12 14C14.21 14 16 12.21 16 10C16 7.79 14.21 6 12 6ZM12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12Z" fill={theme.palette.secondary.main} />
            </svg>
          </PaletteIconWrapper>
          <GradientText {...logoTextAnimation}>
            {UI_TEXT.COMMUNITY_NAME}
          </GradientText>
        </LogoContainer>

        {/* Sidebar Navigation */}
        <Sidebar
          activeItem={activeMenu}
          onSelectItem={onMenuClick}
        />
      </Box>

      {/* Bottom section: Widgets/Stats (Pushed to bottom) */}
      {!isMobile && (
        <LeftPanelWidgets>
          <Typography variant="overline" color="text.secondary" display="block" mb={1.5}>
            커뮤니티 현황
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', gap: 1 }}>
            <Box textAlign="center">
              <Typography variant="h6" fontWeight="bold">1,234</Typography>
              <Typography variant="caption" color="text.secondary">접속중</Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h6" fontWeight="bold">56</Typography>
              <Typography variant="caption" color="text.secondary">새 글</Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h6" fontWeight="bold">789</Typography>
              <Typography variant="caption" color="text.secondary">방문</Typography>
            </Box>
          </Box>
        </LeftPanelWidgets>
      )}
    </>
  );
};

export default LeftPanelContent; 