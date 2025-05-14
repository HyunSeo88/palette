import React, { useRef, useState } from 'react';
import { Box, Typography, IconButton, Avatar, Tooltip, Button, Menu, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Menu as MenuIcon, 
  User as UserIcon, 
  Settings as SettingsIcon,
  Droplet as DropletIcon,
  LogIn as LogInIcon,
  UserPlus as RegisterIcon,
  X as CloseIcon,
  Heart as HeartIcon,
  MessageCircle as MessageIcon,
  Bell as NotificationIcon,
  LogOut as LogOutIcon,
  Edit as EditIcon,
  Camera as CameraIcon
} from 'react-feather';
import {
  LayoutContainer,
  TopFixedArea,
  Header,
  Logo,
  MainContent,
  LeftPanel,
  MenuItem as MenuItemComponent,
  MenuIcon as MenuDot,
  CommunityStats,
  RightPanel,
  Section,
  SectionTitle,
  SectionContent,
  ValueContent,
  HeaderIcons,
} from './MainLayout.styles';
import CommunityFeed from '../CommunityFeed/CommunityFeed';
import { getSectionColors, SectionColorKey, COMMON_STYLES } from '../../theme';
import { MENU_ITEMS, COMMUNITY_STATS, AVATAR_SIZE, MenuItem as MenuItemType } from './MainLayout.types';
import useScrollSpy from '../../hooks/useScrollSpy';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import styled from '@emotion/styled';
import { MenuItemProps } from '@mui/material';

// Style constants
const STYLES = {
  avatarBorder: '2px solid #fff',
  mobileBreakpoint: 'sm',
  padding: {
    menuBox: 2,
  },
} as const;

interface SectionContentProps {
  sectionId: string;
}

const SectionContentRenderer: React.FC<SectionContentProps> = ({ sectionId }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  switch (sectionId) {
    case 'value':
      return (
        <ValueContent>
          <img 
            src={imageError 
              ? "https://source.unsplash.com/featured/1200x800?fashion" 
              : "https://source.unsplash.com/random/1200x800?fashion"}
            alt="가치관 대표 이미지"
            onError={handleImageError}
            loading="lazy"
          />
        </ValueContent>
      );
    case 'hot-posts':
    case 'ootd':
    case 'voting':
    case 'events':
      return <CommunityFeed sectionType={sectionId} />;
    default:
      return null;
  }
};

type SectionId = string;

interface StyledMenuItemProps extends MenuItemProps {
  selected?: boolean;
  color?: string;
  children: React.ReactNode;
}

const StyledMenuItem = styled(MenuItem)<StyledMenuItemProps>(({ color }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '16px 24px',
  gap: '4px',
  borderRadius: '12px',
  transition: 'all 0.3s ease',
  margin: '4px 0',
  position: 'relative',
  overflow: 'hidden',

  '&:hover': {
    backgroundColor: alpha(color || '#1976D2', 0.1),
  },

  '&.Mui-selected': {
    backgroundColor: alpha(color || '#1976D2', 0.15),
    '&:hover': {
      backgroundColor: alpha(color || '#1976D2', 0.2),
    },
  },
}));

/**
 * MainLayout Component
 * 
 * The main layout component that provides the structure for the application.
 * Includes a header with navigation, left panel with menu items, and right panel
 * with scrollable content sections.
 */
const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const rightPanelRef = useRef<HTMLDivElement | null>(null);
  const theme = useTheme();

  const { sectionRefs, activeSection, visibleSections } = useScrollSpy({
    sectionIds: MENU_ITEMS.map(item => item.id),
  });

  const handleMenuClick = (menuId: string): void => {
    const element = sectionRefs.current[menuId];
    if (element && rightPanelRef.current) {
      rightPanelRef.current.scrollTo({
        top: element.offsetTop,
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleMenuClose();
      navigate('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  return (
    <LayoutContainer>
      <TopFixedArea>
        <Header>
          <Logo onClick={() => navigate('/')}>
            <DropletIcon />
            Palette
          </Logo>
          <HeaderIcons>
            {!isAuthenticated ? (
              <>
                <Tooltip title="로그인">
                  <IconButton 
                    onClick={() => navigate('/login')}
                    sx={{ mr: 1 }}
                  >
                    <LogInIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="회원가입">
                  <IconButton 
                    onClick={() => navigate('/register')}
                    sx={{ mr: 1 }}
                  >
                    <RegisterIcon />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip title="알림">
                  <IconButton sx={{ mr: 1 }}>
                    <NotificationIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="마이페이지">
                  <IconButton 
                    onClick={handleMenuOpen}
                    sx={{ 
                      mr: 1,
                      padding: 0.5,
                      '& .MuiAvatar-root': {
                        width: AVATAR_SIZE.width,
                        height: AVATAR_SIZE.height,
                        border: STYLES.avatarBorder
                      }
                    }}
                  >
                    <Avatar 
                      src={user?.photoURL || undefined}
                      alt={user?.displayName || '사용자'}
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  onClick={handleMenuClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                      mt: 1.5,
                      width: 220,
                      '& .MuiMenuItem-root': {
                        px: 2,
                        py: 1,
                      },
                    },
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle1" noWrap>
                      {user?.nickname || '사용자'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {user?.email}
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem onClick={() => user?.nickname && navigate(`/profile/${user.nickname}`)}>
                    <ListItemIcon>
                      <UserIcon size={18} />
                    </ListItemIcon>
                    <ListItemText>프로필</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => user?.nickname && navigate(`/profile/${user.nickname}`)}>
                    <ListItemIcon>
                      <CameraIcon size={18} />
                    </ListItemIcon>
                    <ListItemText>게시물</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => user?.nickname && navigate(`/profile/${user.nickname}`)}>
                    <ListItemIcon>
                      <HeartIcon size={18} />
                    </ListItemIcon>
                    <ListItemText>좋아요</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => user?.nickname && navigate(`/profile/${user.nickname}`)}>
                    <ListItemIcon>
                      <MessageIcon size={18} />
                    </ListItemIcon>
                    <ListItemText>댓글</ListItemText>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={() => navigate('/settings')}>
                    <ListItemIcon>
                      <SettingsIcon size={18} />
                    </ListItemIcon>
                    <ListItemText>설정</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogOutIcon size={18} />
                    </ListItemIcon>
                    <ListItemText>로그아웃</ListItemText>
                  </MenuItem>
                </Menu>
              </>
            )}
            <IconButton 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              sx={{ display: { sm: 'none' } }}
            >
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </HeaderIcons>
        </Header>
      </TopFixedArea>

      <MainContent>
        <LeftPanel open={isMobileMenuOpen}>
          {MENU_ITEMS.map((item) => (
            <StyledMenuItem
              key={item.id}
              selected={activeSection === item.id}
              onClick={() => handleMenuClick(item.id)}
              color={item.color}
              sx={{ 
                color: item.color,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                <MenuDot color={item.color} />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    fontSize: '1.1rem'
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  pl: '24px',
                  fontSize: '0.9rem',
                  lineHeight: 1.4
                }}
              >
                {item.description}
              </Typography>
            </StyledMenuItem>
          ))}
          <Box sx={{ mt: 'auto', p: STYLES.padding.menuBox }}>
            {COMMUNITY_STATS.map((stat, index) => (
              <CommunityStats key={index}>
                <Typography variant="caption" color="text.secondary">
                  {stat.label}
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {stat.value}
                </Typography>
              </CommunityStats>
            ))}
          </Box>
        </LeftPanel>

        <RightPanel ref={rightPanelRef}>
          {MENU_ITEMS.map((item) => {
            const sectionColors = getSectionColors(theme);
            const sectionColor = sectionColors[item.id];
            
            return (
              <Section
                key={item.id}
                data-section-id={item.id}
                ref={(el: HTMLDivElement | null) => (sectionRefs.current[item.id] = el)}
                style={{ 
                  backgroundColor: sectionColor.background,
                  color: sectionColor.color
                }}
              >
                <SectionContent>
                  <SectionTitle 
                    variant="h4"
                    style={{ 
                      opacity: visibleSections.has(item.id) ? 1 : 0,
                    }}
                  >
                    {item.label}
                  </SectionTitle>
                  <SectionContentRenderer sectionId={item.id} />
                </SectionContent>
              </Section>
            );
          })}
        </RightPanel>
      </MainContent>
    </LayoutContainer>
  );
};

export default MainLayout; 