import React, { useRef, useState, useEffect } from 'react';
import { 
  Box, Typography, IconButton, Avatar, Tooltip, Button, Menu, MenuItem as MuiMenuItem, ListItemIcon, ListItemText, Divider, 
  TextField, InputAdornment, Card, CardMedia, CardContent, Grid
} from '@mui/material';
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
  Camera as CameraIcon,
  Search as SearchIcon,
  Home as HomeIcon,
  Bookmark as BookmarkIcon
} from 'react-feather';
import {
  LayoutContainer,
  TopFixedArea,
  Header,
  Logo,
  MainContent,
  LeftPanel,
  MenuItem as MenuItemComponent,
  CommunityStats,
  RightPanel,
  HeaderIcons,
} from './MainLayout.styles';
import { getSectionColors, SectionColorKey, COMMON_STYLES } from '../../theme';
import { MENU_ITEMS, AVATAR_SIZE, SectionId, MenuItem as MenuItemTypeDefinition } from './MainLayout.types.tsx';
import useScrollSpy from '../../hooks/useScrollSpy';
import { useTheme, alpha } from '@mui/material/styles';

// Style constants from the user's example, adapt to MUI
const cardImageHeight = '224px'; // h-56
const popularImageHeight = '192px'; // h-48

// Mock data from user's example
const ootdItems = [
  { id: 1, src: '/images/ootd1.jpg', title: 'Beige blazer, denim, sneakers', likes: 132, saves: 18 },
  { id: 2, src: '/images/ootd2.jpg', title: 'Green top and wide-leg pants', likes: 150, saves: 12 },
  { id: 3, src: '/images/ootd3.jpg', title: 'Puffer vest and cap', likes: 87, saves: 7 },
  { id: 4, src: '/images/ootd4.jpg', title: 'Classic Black Dress & Red Accent', likes: 205, saves: 30 },
];

const popularItems = ootdItems.slice(0, 4); // Show 4 popular items for better grid fill

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const rightPanelRef = useRef<HTMLDivElement | null>(null);
  const theme = useTheme();

  // Default active section to 'home'
  const [currentActiveSection, setCurrentActiveSection] = useState<SectionId>('home');

  const { sectionRefs, activeSection: scrollSpyActiveSection } = useScrollSpy({
    sectionIds: MENU_ITEMS.filter(item => item.id !== 'home').map(item => item.id),
  });
  
  useEffect(() => {
    if (scrollSpyActiveSection && MENU_ITEMS.some(item => item.id === scrollSpyActiveSection)) {
      setCurrentActiveSection(scrollSpyActiveSection as SectionId);
    } 
  }, [scrollSpyActiveSection]);

  const handleMenuClick = (menuId: SectionId): void => {
    setCurrentActiveSection(menuId);
    setIsMobileMenuOpen(false);
    const headerHeight = parseFloat(theme.mixins.toolbar.minHeight as string) || 64;

    if (menuId === 'home' && rightPanelRef.current) {
      rightPanelRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = sectionRefs.current[menuId];
      if (element && rightPanelRef.current) { 
        rightPanelRef.current.scrollTo({
          top: element.offsetTop - headerHeight,
          behavior: 'smooth'
        });
      }
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    try {
      await logout();
      handleMenuClose();
      navigate('/');
      setCurrentActiveSection('home'); 
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };
  
  // Helper to determine if a menu item is active
  const isMenuItemActive = (menuId: SectionId) => currentActiveSection === menuId;

  // Define placeholder content for non-home sections
  const renderSectionContent = (sectionId: SectionId) => {
    if (sectionId === 'home') {
      return (
        <Box> 
          <Box component="section" sx={{ pb: { xs: 3, sm: 4, md: 6 } }}>
            <Typography variant="h5" component="h2" sx={{ mb: {xs: 2, sm: 3}, fontWeight: 'bold', color: 'text.primary' }}>
              OOTD
            </Typography>
            <Box sx={{ display: 'flex', gap: {xs: 1.5, sm: 2, md: 2.5}, overflowX: 'auto', py: 1, 
                       scrollbarWidth: 'thin', '&::-webkit-scrollbar': { height: '8px'}, 
                       '&::-webkit-scrollbar-thumb': { bgcolor: alpha(theme.palette.text.disabled, 0.5), borderRadius: '4px'},
                       '&::-webkit-scrollbar-track': { bgcolor: alpha(theme.palette.text.disabled, 0.1), borderRadius: '4px'}
            }}>
              {ootdItems.map((item) => (
                <Card key={item.id} sx={{ minWidth: {xs: 180, sm: 200, md: 220}, flexShrink: 0, borderRadius: '12px', boxShadow: theme.shadows[2] }}>
                  <CardMedia
                    component="img"
                    sx={{ height: cardImageHeight, width: '100%', objectFit: 'cover' }}
                    image={item.src || `https://source.unsplash.com/random/220x${cardImageHeight.replace('px','')}?fashion&sig=${item.id}`}
                    alt={item.title}
                  />
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="body2" component="p" sx={{ fontWeight: 500, color: 'text.primary', mb: 1.5, height: '3.6em', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {item.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.secondary', fontSize: '0.875rem' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <HeartIcon size={16} style={{ fill: theme.palette.error.main, color: theme.palette.error.main }} /> 
                        {item.likes}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <BookmarkIcon size={16} /> 
                        {item.saves}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>

          <Box component="section" sx={{ pb: { xs: 3, sm: 4, md: 6 } }}>
            <Typography variant="h5" component="h2" sx={{ mb: {xs: 2, sm: 3}, fontWeight: 'bold', color: 'text.primary' }}>
              Popular Posts
            </Typography>
            <Grid container spacing={{xs: 1.5, sm: 2, md: 2.5}}>
              {popularItems.map((item) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item.id + '-popular'}> {/* Ensure unique key */}
                  <Card sx={{ borderRadius: '12px', overflow: 'hidden', boxShadow: theme.shadows[2] }}>
                    <CardMedia
                      component="img"
                      sx={{ height: popularImageHeight, width: '100%', objectFit: 'cover' }}
                      image={item.src || `https://source.unsplash.com/random/300x${popularImageHeight.replace('px','')}?fashion&sig=${item.id + 100}`}
                      alt={item.title}
                    />
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="body2" component="p" sx={{ fontWeight: 500, color: 'text.primary', height: '3.6em', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {item.title}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      );
    }
    // Placeholder for other sections
    return (
      <Box 
        id={sectionId} // For scroll spy target
        ref={(el: HTMLDivElement | null) => { if (sectionRefs.current) sectionRefs.current[sectionId] = el; }} 
        sx={{ py: 3, minHeight: 'calc(100vh - 120px)' /* Ensure it takes some space for scroll spy */ }}
      >
        <Typography variant="h4">{(MENU_ITEMS.find(m=>m.id === sectionId) as MenuItemTypeDefinition)?.label || sectionId} (Content TBD)</Typography>
      </Box>
    );
  };

  return (
    <LayoutContainer sx={{ bgcolor: theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[900] }}>
      {/* Sidebar (LeftPanel) */}
      <LeftPanel open={isMobileMenuOpen} sx={{bgcolor: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[800] }}>
        <Box sx={{ p: 1, display: { xs: 'flex', sm: 'none' }, justifyContent: 'flex-end' }}>
          <IconButton onClick={() => setIsMobileMenuOpen(false)}><CloseIcon /></IconButton>
        </Box>
        
        {/* Logo inside Sidebar - from new design */}
        <Box sx={{ p: {xs: 1, sm: 2}, pt: {xs: 0, sm: 2}, mb: {xs: 1, sm: 3} }}>
          <Logo onClick={() => handleMenuClick('home')} sx={{ cursor:'pointer' }}>
            <DropletIcon />
            <Typography variant="h4" component="span" sx={{ fontWeight: 'extrabold', color: 'text.primary', ml: 1 }}>
              Palette
            </Typography>
          </Logo>
        </Box>

        <Box component="nav" sx={{ flexGrow: 1, px: {xs:0.5, sm:1} }}>
          {MENU_ITEMS.map((item) => (
            <MenuItemComponent
              key={item.id}
              isactive={isMenuItemActive(item.id).toString()} // Pass as string 'true'/'false'
              onClick={() => handleMenuClick(item.id)}
            >
              {item.icon} 
              <Typography variant="body1" component="span" sx={{ fontWeight: 'inherit', color: 'inherit', ml: 0.5 }}>{item.label}</Typography>
            </MenuItemComponent>
          ))}
        </Box>
      </LeftPanel>

      {/* Main Area including Top Bar and Content */}
      <Box component={MainContent} sx={{flexDirection: 'column', flexGrow: 1, overflow: 'hidden', mt:0, pt: `${theme.mixins.toolbar.minHeight}px`, /* Offset for sticky header */ position: 'relative'}}>
        {/* Top bar (Header) */}
        <TopFixedArea sx={{ position: 'absolute', top:0, left:0, right:0, boxShadow: theme.shadows[1], zIndex: 1100, bgcolor: alpha(theme.palette.background.paper, 0.85), backdropFilter: 'blur(8px)' }}>
          <Header sx={{ px: {xs:1, sm:2, md:3}, height: theme.mixins.toolbar.minHeight }}>
            {/* Hamburger for mobile */}
            <IconButton
              sx={{ display: { sm: 'none' }, mr: 1, color: 'text.primary' }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <MenuIcon />
            </IconButton>

            {/* Search Bar */}
            <Box sx={{ flexGrow: 1, maxWidth: {xs: '100%', sm:'50%', md: '40%'}, minWidth: '180px' }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon size={20} style={{ color: theme.palette.text.secondary }}/>
                    </InputAdornment>
                  ),
                  sx: { 
                    borderRadius: '12px',
                    bgcolor: alpha(theme.palette.common.black, 0.05),
                    transition: 'background-color 0.2s',
                    '&:hover': { bgcolor: alpha(theme.palette.common.black, 0.08) },
                    '&.Mui-focused': { bgcolor: theme.palette.common.white, boxShadow: `0 0 0 2px ${theme.palette.primary.light}` },
                    '.MuiOutlinedInput-notchedOutline': { border: 'none' }
                  }
                }}
                size="small"
              />
            </Box>

            {/* Header Icons */}
            <HeaderIcons sx={{ gap: {xs:0.5, sm:1, md:2} }}>
              {!isAuthenticated ? (
                <>
                  <Button variant="outlined" size="small" onClick={() => navigate('/login')}>Login</Button>
                  <Button variant="contained" size="small" onClick={() => navigate('/register')}>Sign Up</Button>
                </>
              ) : (
                <>
                  <Tooltip title="알림">
                    <IconButton sx={{ color: 'text.primary' }}>
                      <NotificationIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="마이페이지">
                    <IconButton 
                      onClick={handleMenuOpen}
                      sx={{ 
                        p: 0.5,
                        '& .MuiAvatar-root': {
                          width: AVATAR_SIZE.width,
                          height: AVATAR_SIZE.height,
                          border: `2px solid ${theme.palette.common.white}`
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
                      elevation: 3,
                      sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                        mt: 1.5,
                        minWidth: 220,
                        borderRadius: '8px',
                        '& .MuiMenuItem-root': {
                          px: 2,
                          py: 1,
                          '& .MuiSvgIcon-root, & .feather': {
                            mr: 1.5,
                            fontSize: '1.25rem',
                          },
                        },
                      },
                    }}
                  >
                    <Box sx={{ px: 2, py: 1.5 }}>
                      <Typography variant="subtitle1" noWrap>
                        {user?.nickname || '사용자'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {user?.email || '이메일 정보 없음'}
                      </Typography>
                    </Box>
                    <Divider />
                    <MuiMenuItem onClick={() => { navigate(`/profile/${user?.nickname}`); handleMenuClose(); }}>
                      <UserIcon size={20} style={{ marginRight: theme.spacing(1.5)}} /> 프로필
                    </MuiMenuItem>
                    <MuiMenuItem onClick={() => { navigate('/settings'); handleMenuClose(); }}>
                      <SettingsIcon size={20} style={{ marginRight: theme.spacing(1.5)}} /> 설정
                    </MuiMenuItem>
                    <Divider />
                    <MuiMenuItem onClick={handleLogout}>
                      <LogOutIcon size={20} style={{ marginRight: theme.spacing(1.5)}} /> 로그아웃
                    </MuiMenuItem>
                  </Menu>
                </>
              )}
            </HeaderIcons>
          </Header>
        </TopFixedArea>

        {/* Main Scrollable Content (RightPanel) */}
        <RightPanel ref={rightPanelRef} sx={{ bgcolor: 'transparent', pt:0 /* Padding now on MainContent Box/offset by Header*/ }}>
          {renderSectionContent(currentActiveSection)}
        </RightPanel>
      </Box>
    </LayoutContainer>
  );
};

export default MainLayout; 