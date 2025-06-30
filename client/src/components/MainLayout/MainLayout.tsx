import React, { useRef, useState, useEffect } from 'react';
import { 
  Box, Typography, IconButton, Avatar, Tooltip, Button, Menu, MenuItem as MuiMenuItem, ListItemIcon, ListItemText, Divider, 
  TextField, InputAdornment, Card, CardMedia, CardContent, Grid, CardHeader, CardActions
} from '@mui/material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
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
  Bookmark as BookmarkIcon,
  Star as StarIcon,
  Grid as GridIcon
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
import { MENU_ITEMS, AVATAR_SIZE, SectionId, MenuItem as MenuItemTypeDefinition, IPost, COMMUNITY_STATS, CommunityStats as CommunityStatsType } from './MainLayout.types';
import useScrollSpy from '../../hooks/useScrollSpy';
import { useTheme, alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// Import new components
import SlideInMenu from '../layout/SlideInMenu';
import LoginModalDialog from '../auth/LoginModalDialog';

// Style constants
// const cardImageHeight = '224px'; // Removed as it's no longer used by the new OOTD card design
const popularImageHeight = '192px'; // Retained for the Popular Posts section

// Mock data - ootdItems removed, popularItems set to empty for now
// const ootdItems = [
//   { id: 1, src: '/images/ootd1.jpg', title: 'Beige blazer, denim, sneakers', likes: 132, saves: 18 },
//   { id: 2, src: '/images/ootd2.jpg', title: 'Green top and wide-leg pants', likes: 150, saves: 12 },
//   { id: 3, src: '/images/ootd3.jpg', title: 'Puffer vest and cap', likes: 87, saves: 7 },
//   { id: 4, src: '/images/ootd4.jpg', title: 'Classic Black Dress & Red Accent', likes: 205, saves: 30 },
// ];

const popularItems: any[] = []; // Set to empty. Popular Posts section will show "no posts" message.
                                // TODO: Integrate API for Popular Posts section later.

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(null);
  const rightPanelRef = useRef<HTMLDivElement | null>(null);
  const theme = useTheme();

  // State for new slide-in menu and login modal (for new MainPage design)
  const [isNewSlideMenuOpen, setIsNewSlideMenuOpen] = useState<boolean>(false);
  const [isNewLoginModalOpen, setIsNewLoginModalOpen] = useState<boolean>(false);

  // Default active section to 'value'
  const [activeSection, setActiveSection] = useState<SectionId>('value');

  const { sectionRefs, activeSection: scrollSpyActiveSection } = useScrollSpy({
    sectionIds: MENU_ITEMS.filter(item => item.id !== 'value').map(item => item.id),
  });
  
  useEffect(() => {
    if (scrollSpyActiveSection && MENU_ITEMS.some(item => item.id === scrollSpyActiveSection)) {
      if (activeSection !== scrollSpyActiveSection) {
        setActiveSection(scrollSpyActiveSection as SectionId);
      }
    } 
  }, [scrollSpyActiveSection, activeSection]);

  const handleMenuClick = (menuId: SectionId): void => {
    setActiveSection(menuId);
    setIsMobileMenuOpen(false);
    const headerHeight = parseFloat(theme.mixins.toolbar.minHeight as string) || 64;

    if (menuId === 'value' && rightPanelRef.current) {
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

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    console.log('[MainLayout] handleUserMenuOpen triggered. event.currentTarget:', event.currentTarget);
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };
  
  const handleGoToMyPage = () => {
    navigate('/mypage');
    handleUserMenuClose();
  };

  const handleGoToSettings = () => {
    navigate('/settings');
    handleUserMenuClose();
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleUserMenuClose();
      navigate('/');
      setActiveSection('value');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };
  
  // Helper to determine if a menu item is active
  const isMenuItemActive = (menuId: SectionId) => activeSection === menuId;

  // State for OOTD posts
  const [ootdPosts, setOotdPosts] = useState<IPost[]>([]); // Updated to IPost[]
  const [ootdLoading, setOotdLoading] = useState<boolean>(true);
  const [ootdError, setOotdError] = useState<string | null>(null);

  const scrollSpyEnabled = activeSection === 'value';

  // Effect to fetch OOTD posts
  useEffect(() => {
    const fetchOotdPosts = async () => {
      setOotdLoading(true);
      setOotdError(null);
      try {
        // Ensure your backend is running and accessible at this URL
        // The port 5000 is an assumption. Change if your backend runs on a different port.
        const response = await fetch('http://localhost:5000/api/posts?postType=ootd'); // Updated API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setOotdPosts(data.posts || data || []); // Assuming posts are in data.posts or data directly
      } catch (error: any) {
        console.error("Failed to fetch OOTD posts:", error);
        let displayError = 'OOTD 게시물을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.';
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
          displayError = '서버에 연결할 수 없습니다. 백엔드 서버가 실행 중이고 접근 가능한지, 또는 CORS 설정을 확인해주세요. (오류: Failed to fetch)';
        } else if (error.message && error.message.startsWith('HTTP error! status:')) {
          const statusMatch = error.message.match(/status: (\d+)/);
          const status = statusMatch ? statusMatch[1] : '알 수 없음';
          displayError = `OOTD 게시물을 불러오는데 실패했습니다. 서버 응답 상태: ${status}.`;
        } else if (error.message) {
          displayError = `오류가 발생했습니다: ${error.message}`;
        }
        setOotdError(displayError);
      } finally {
        setOotdLoading(false);
      }
    };

    if (activeSection === 'value') { // Updated from 'home' to 'value'
        fetchOotdPosts();
    }
  }, [activeSection]); // Re-fetch if activeSection changes to 'value'

  // Handlers for new menu and modal
  const handleNewSlideMenuToggle = () => {
    setIsNewSlideMenuOpen(prev => !prev);
  };

  const handleNewLoginModalOpen = () => {
    setIsNewLoginModalOpen(true);
  };

  const handleNewLoginModalClose = () => {
    setIsNewLoginModalOpen(false);
  };
  
  const isMainPage = location.pathname === '/'; // 메인 페이지 여부 확인 (OOTD 등 다른 페이지는 false)

  // Define placeholder content for non-value sections
  const renderSectionContent = (sectionId: SectionId) => {
    if (isMainPage) {
      // For the new main page, content is rendered by <Outlet /> which will be MainPage.tsx
      // So, MainLayout doesn't need to render specific content here for '/'
      return null; 
    }
    
    // Existing logic for other sections if MainLayout handles more than just the new MainPage
    if (sectionId === 'value') {
      const secondaryNavItems = ['Trending', 'Collections', 'Categories', 'Topics', 'Files', 'Groups', 'People'];
      return (
        <Box sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
           <Box 
            sx={{ 
              mb: 4, 
              display: 'flex', 
              gap: 1.5, 
              flexWrap: 'wrap',
              pb: 2,
              borderBottom: 1,
              borderColor: 'divider'
            }}
          >
            {secondaryNavItems.map(item => (
              <Button 
                key={item} 
                variant={item === 'Trending' ? 'contained' : 'outlined'}
                size="small" 
                sx={{ 
                  borderRadius: '20px', 
                  textTransform: 'none',
                  fontWeight: item === 'Trending' ? 600 : 500,
                  px: 2.5,
                  py: 0.5
                }}
              >
                {item}
              </Button>
            ))}
          </Box>

          <Box component="section" sx={{ pb: { xs: 4, sm: 5, md: 6 } }}>
            {ootdLoading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>}
            {ootdError && <Alert severity="error" sx={{ my: 3 }}>Error fetching OOTD posts: {ootdError}</Alert>}
            {!ootdLoading && !ootdError && (
              <Grid container spacing={3}>
                {ootdPosts.length > 0 ? ootdPosts.map((post) => (
                  <Grid item xs={12} sm={6} md={4} key={post._id}>
                    <Card 
                      sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        height: '100%', 
                        borderRadius: 4, 
                        boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
                        overflow: 'visible', 
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
                        }
                      }}
                    >
                      {post.images && post.images.length > 0 && (
                        <Box sx={{ position: 'relative' }}>
                          <CardMedia
                            component="img"
                            sx={{ 
                              height: 280, 
                              objectFit: 'cover',
                              borderRadius: '16px 16px 0 0',
                            }}
                            image={post.images[0]}
                            alt={post.content || 'OOTD image'}
                          />
                          <Box sx={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            display: 'flex',
                            alignItems: 'center',
                            bgcolor: alpha(theme.palette.common.black, 0.5),
                            color: 'white',
                            px: 1.5, 
                            py: 0.5,  
                            borderRadius: 2, 
                          }}>
                            {post.author?.profileImageUrl && (
                              <Avatar 
                                src={post.author.profileImageUrl} 
                                alt={post.author.username} 
                                sx={{ width: 24, height: 24, mr: 0.75 }}
                              />
                            )}
                            <Typography variant="caption" sx={{ fontWeight: 500 }}>
                              {post.author?.username || 'User'}
                            </Typography>
                          </Box>
                          <Box sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            display: 'flex',
                            alignItems: 'center',
                            bgcolor: alpha(theme.palette.warning.light, 0.85), 
                            color: theme.palette.warning.contrastText,
                            px: 1,
                            py: 0.25,
                            borderRadius: '12px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                          }}>
                            <StarIcon size={14} style={{ marginRight: 4, fill: theme.palette.warning.contrastText }}/>
                            <Typography variant="caption" sx={{ fontWeight: 'bold', lineHeight: '1.2' }}> 
                              {post.likes?.length || 0}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                      <CardContent sx={{ pt: 2, pb: 1, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <Typography 
                          variant="subtitle1" 
                          component="div" 
                          gutterBottom 
                          sx={{ 
                            fontWeight: 600, 
                            lineHeight: 1.3,
                            color: theme.palette.text.primary,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            minHeight: 'calc(1.3em * 2)'
                          }}
                        >
                          {post.content || 'No caption'}
                        </Typography>
                      </CardContent>
                      <CardActions disableSpacing sx={{ pt: 0, pb: 1.5, px: 1.5, mt: 'auto', justifyContent: 'space-around' }}>
                        <Tooltip title="Like">
                          <IconButton aria-label="add to favorites" size="small" sx={{ '&:hover': { color: theme.palette.error.main }}}>
                            <HeartIcon size={18} /> 
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Comment">
                          <IconButton aria-label="comment" size="small" sx={{ '&:hover': { color: theme.palette.primary.main }}}>
                            <MessageIcon size={18} />
                            <Typography variant="caption" sx={{ ml: 0.5 }}>{post.commentsCount || 0}</Typography>
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Share">
                          <IconButton aria-label="share" size="small" sx={{ '&:hover': { color: theme.palette.info.main }}}>
                            <ShareIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Bookmark">
                          <IconButton aria-label="bookmark" size="small" sx={{ '&:hover': { color: theme.palette.secondary.main }}}>
                            <BookmarkIcon size={18} />
                          </IconButton>
                        </Tooltip>
                      </CardActions>
                    </Card>
                  </Grid>
                )) : (
                  <Grid item xs={12}>
                    <Box 
                      sx={{ 
                        textAlign: 'center', 
                        my: 4, 
                        p: 4, 
                        bgcolor: 'background.paper', 
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                      }}
                    >
                      <Typography sx={{ color: 'text.secondary' }}>아직 OOTD 게시물이 없습니다.</Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            )}
          </Box>
        </Box>
      );
    }
    // Placeholder for other original sections (ootd, community, events)
    return (
      <Box 
        id={sectionId} 
        ref={(el: HTMLDivElement | null) => { if (sectionRefs.current) sectionRefs.current[sectionId] = el; }} 
        sx={{ py: 3, minHeight: 'calc(100vh - 120px)', px: { xs: 1, sm: 2, md: 3 } }}
      >
        <Typography variant="h4">{(MENU_ITEMS.find(m=>m.id === sectionId) as MenuItemTypeDefinition)?.label || sectionId} (Content TBD)</Typography>
      </Box>
    );
  };

  return (
    <LayoutContainer sx={{ 
      bgcolor: theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
      display: 'flex', // Make LayoutContainer a flex container
      flexDirection: 'column',
      height: '100vh' // Ensure it takes full viewport height
    }}>
      <TopFixedArea 
        sx={{ 
          // boxShadow: theme.shadows[1], // Temporarily removed to test gap issue
          zIndex: 1100, 
          bgcolor: alpha(theme.palette.background.paper, 0.85),
          backdropFilter: 'blur(8px)',
          height: theme.mixins.toolbar.minHeight, // Header has fixed height
          // width: '100%' // Implicitly full width as a block or flex item parent
        }}
      >
        <Header sx={{ px: {xs:1, sm:2, md:3}, height: '100%' }}>
            {/* 모든 페이지에 공통으로 표시될 헤더 내용 */}
            {/* isNewMainPageActive 관련 분기 로직을 제거하고, 일관된 헤더를 사용 */}
            <IconButton 
              sx={{ color: 'text.secondary' }} 
              onClick={handleNewSlideMenuToggle} // 모든 페이지에서 새 슬라이드 메뉴 토글
            >
              <MenuIcon />
            </IconButton>

            {/* 검색 바 등 공통 헤더 요소 (기존 non-MainPage 헤더 로직 참고) */}
            <Box sx={{ flexGrow: 1, maxWidth: {xs: '100%', sm:'50%', md: '40%'}, minWidth: '180px', mx: 2 }}>
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
                    bgcolor: alpha(theme.palette.common.black, 0.03),
                    transition: 'all 0.3s ease',
                    '&:hover': { bgcolor: alpha(theme.palette.common.black, 0.05) },
                    '&.Mui-focused': { 
                      bgcolor: theme.palette.common.white, 
                      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.25)}`
                    },
                    '.MuiOutlinedInput-notchedOutline': { border: 'none' }
                  }
                }}
                size="small"
              />
            </Box>

            <HeaderIcons sx={{ gap: {xs:0.5, sm:1, md:2} }}>
              {isAuthenticated ? (
                <>
                  <Tooltip title="새 게시물 작성">
                    <IconButton 
                      sx={{ color: 'text.primary' }} 
                      onClick={() => navigate('/create-post')}
                    >
                      <EditIcon size={20}/>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="알림">
                    <IconButton sx={{ color: 'text.primary' }}>
                      <NotificationIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={user?.nickname || 'User Profile'}>
                    <IconButton onClick={handleUserMenuOpen} sx={{ p: 0, ml: 1.5 }}>
                      <Avatar
                        alt={user?.nickname || user?.email}
                        src={user?.photoURL || undefined} // profilePicture 대신 profileImage 사용 (User 모델 확인 필요)
                        sx={{ width: AVATAR_SIZE.width, height: AVATAR_SIZE.height, bgcolor: 'primary.main' }}
                      >
                        {!(user?.photoURL) && (user?.nickname?.[0] || user?.email?.[0])?.toUpperCase()}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                </>
              ) : (
                <Tooltip title="로그인">
                  <IconButton 
                    sx={{ color: 'text.primary' }}
                    onClick={handleNewLoginModalOpen} // 로그인 모달 열기
                  >
                    <LogInIcon />
                  </IconButton>
                </Tooltip>
              )}
            </HeaderIcons>
        </Header>
      </TopFixedArea>

      <SlideInMenu open={isNewSlideMenuOpen} onClose={handleNewSlideMenuToggle} />
      <LoginModalDialog open={isNewLoginModalOpen} onClose={handleNewLoginModalClose} />

      {/* Main Content Area - Adjusted for full-screen section display on main page */}
      <MainContent 
        sx={{
          flexGrow: 1, // Allows MainContent to take remaining space
          minHeight: 0, // Important for flex children to shrink properly if needed
          // width: '100%', // Implicitly full width as a flex item
          boxSizing: 'border-box',
          // Padding for non-main pages is now internal to MainContent, not for header offset
          paddingTop: !isMainPage ? theme.spacing(2) : 0,
          paddingBottom: !isMainPage ? theme.spacing(2) : 0,
          paddingLeft: !isMainPage ? { xs: 2, sm: 3 } : 0,
          paddingRight: !isMainPage ? { xs: 2, sm: 3 } : 0,
          
          overflowY: isMainPage ? 'hidden' : 'auto',
          backgroundColor: (() => {
            if (isMainPage && activeSection) {
              const sectionColorSet = getSectionColors(theme);
              if (sectionColorSet && sectionColorSet[activeSection as keyof typeof sectionColorSet]) {
                return sectionColorSet[activeSection as keyof typeof sectionColorSet].background;
              }
            }
            return theme.palette.background.default;
          })(),
          
          // Flex properties to center MainPage (which should be height: 100% of this)
          display: isMainPage ? 'flex' : 'block',
          flexDirection: isMainPage ? 'column' : undefined, // Or 'row' if MainPage structure implies
          alignItems: isMainPage ? 'center' : undefined,
          justifyContent: isMainPage ? 'center' : undefined,
          position: 'relative', // Keep for potential absolutely positioned children within Outlet views
        }}
      >
        <Outlet /> {/* Page content will be centered by MainContent's flex properties on main page */}
      </MainContent>

      {/* User Menu (기존과 동일하게 사용) */}
      <Box sx={{ zIndex: 1301 }}>
        <Menu
          id="user-menu"
          anchorEl={userMenuAnchorEl}
          open={Boolean(userMenuAnchorEl)}
          onClose={handleUserMenuClose}
          MenuListProps={{
            'aria-labelledby': 'user-menu-button',
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
        >
          <MuiMenuItem onClick={handleGoToMyPage}>
            <ListItemIcon>
              <UserIcon size={20} />
            </ListItemIcon>
            <ListItemText primary="My Page" />
          </MuiMenuItem>
          <MuiMenuItem onClick={handleGoToSettings}>
            <ListItemIcon>
              <SettingsIcon size={20} />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </MuiMenuItem>
          <MuiMenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogOutIcon size={20} />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </MuiMenuItem>
        </Menu>
      </Box>
    </LayoutContainer>
  );
};

export default MainLayout; 