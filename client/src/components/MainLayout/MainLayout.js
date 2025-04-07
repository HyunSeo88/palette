import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { 
  Container, 
  useTheme, 
  useMediaQuery, 
  Typography, 
  Box, 
  Button,
  useScrollTrigger,
  Slide,
  alpha
} from '@mui/material';
import PaletteMenu from '../PaletteMenu';
import { MENU_ITEMS } from '../PaletteMenu/PaletteMenu';
import ScrollSection from '../ScrollSection';
import ErrorBoundary from '../ErrorBoundary';
import {
  LayoutContainer,
  TopSection,
  ContentSection,
  LogoContainer,
  HeroSection,
  ColorDot,
  GradientText,
  HeroImage,
  PaletteIconWrapper,
  HeroContent,
  ColorPaletteContainer
} from './MainLayout.styles';
import { Edit3, Feather, Droplet } from 'react-feather';
import {
  RETRY_DELAY,
  SCROLL_THRESHOLD,
  INITIAL_SECTION,
  PALETTE_COLORS,
  HERO_IMAGE_URL,
  HERO_IMAGE_ALT,
  UI_TEXT,
  ERROR_PROBABILITY
} from './MainLayout.constants';
import {
  logoIconAnimation,
  logoTextAnimation,
  heroTitleAnimation,
  heroDescriptionAnimation,
  heroButtonAnimation,
  heroImageAnimation,
  getColorDotAnimation,
  animationConfig
} from './MainLayout.animations';

// 컬러 아이콘 컴포넌트
const ColorPaletteIcon = ({ size }) => {
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <Droplet size={size} color={PALETTE_COLORS.RED} style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-30deg) translate(-30%, -10%)' }} />
      <Droplet size={size} color={PALETTE_COLORS.BLUE} style={{ position: 'absolute', top: 0, left: 0 }} />
      <Droplet size={size} color={PALETTE_COLORS.YELLOW} style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(30deg) translate(30%, -10%)' }} />
    </div>
  );
};

/**
 * 메인 레이아웃 컴포넌트
 * 팔레트 메뉴와 콘텐츠 섹션을 포함하는 전체 레이아웃을 구성합니다.
 */
const MainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [activeMenu, setActiveMenu] = useState(INITIAL_SECTION);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > SCROLL_THRESHOLD;
      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  // 스크롤 트리거 효과
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: SCROLL_THRESHOLD,
  });

  // 섹션 로드 시뮬레이션
  const fetchSectionData = useCallback(async (menuId) => {
    // API 호출을 시뮬레이션하는 함수
    return new Promise((resolve, reject) => {
      // 실제 API 호출은 여기서 구현
      setTimeout(() => {
        // 간혹 에러 발생 시뮬레이션 (5% 확률)
        if (Math.random() < ERROR_PROBABILITY) {
          reject(new Error('네트워크 오류가 발생했습니다.'));
          return;
        }
        resolve({ success: true, data: menuId });
      }, RETRY_DELAY);
    });
  }, []);

  const handleMenuClick = useCallback(async (menuId) => {
    try {
      // 이미 선택된 메뉴인 경우 스킵
      if (menuId === activeMenu && !error && !isLoading) return;
      
      setIsLoading(true);
      setError(null);
      
      // API 데이터 로드
      await fetchSectionData(menuId);
      
      // 상태 업데이트
      setActiveMenu(menuId);
      setRetryCount(0); // 성공 시 재시도 카운트 리셋
    } catch (err) {
      console.error('Content loading error:', err);
      setError(err.message || '콘텐츠를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [activeMenu, error, fetchSectionData, isLoading]);

  const handleRetry = useCallback(() => {
    if (retryCount >= 3) {
      setError('여러 번 시도했으나 실패했습니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    setRetryCount(prev => prev + 1);
    setTimeout(() => {
      handleMenuClick(activeMenu);
    }, RETRY_DELAY);
  }, [activeMenu, handleMenuClick, retryCount]);

  // 컨테이너 설정
  const containerProps = useMemo(() => ({
    maxWidth: isMobile ? "sm" : isTablet ? "md" : "lg",
    disableGutters: isMobile,
    sx: { 
      px: { 
        xs: 1.5,
        sm: 2, 
        md: 3,
      }
    }
  }), [isMobile, isTablet]);

  // 컬러 팔레트 렌더링
  const renderColorPalette = () => (
    <ColorPaletteContainer>
      {Object.values(PALETTE_COLORS).map((color, index) => (
        <ColorDot 
          key={index} 
          color={color} 
          {...getColorDotAnimation(index)}
        />
      ))}
    </ColorPaletteContainer>
  );

  return (
    <ErrorBoundary>
      <LayoutContainer className={isScrolled ? 'scrolled' : ''}>
        <Slide appear={false} direction="down" in={!trigger}>
          <TopSection elevation={trigger ? 4 : 0}>
            <Container {...containerProps}>
              <LogoContainer>
                <PaletteIconWrapper
                  {...logoIconAnimation}
                >
                  <ColorPaletteIcon size={isMobile ? 24 : 32} />
                </PaletteIconWrapper>
                <GradientText
                  variant={isMobile ? "h5" : "h4"}
                  component="h1"
                  {...logoTextAnimation}
                >
                  {UI_TEXT.COMMUNITY_NAME}
                </GradientText>
              </LogoContainer>
              <PaletteMenu
                items={MENU_ITEMS}
                activeItem={activeMenu}
                onMenuClick={handleMenuClick}
                isMobile={isMobile}
              />
            </Container>
          </TopSection>
        </Slide>
        
        {!isScrolled && (
          <HeroSection>
            <Container {...containerProps}>
              <HeroContent>
                <GradientText
                  variant={isMobile ? "h4" : "h3"}
                  component="h2"
                  align="center"
                  {...heroTitleAnimation}
                >
                  {UI_TEXT.HERO_TITLE}
                </GradientText>
                <Typography
                  variant="body1"
                  align="center"
                  color="textSecondary"
                  sx={{ mt: 2, mb: 4, maxWidth: '800px', mx: 'auto' }}
                  component={Box}
                  {...heroDescriptionAnimation}
                >
                  {UI_TEXT.HERO_DESCRIPTION}
                </Typography>
                {renderColorPalette()}
                <Box
                  sx={{ mt: 4 }}
                  component={Box}
                  {...heroButtonAnimation}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{
                      borderRadius: 8,
                      px: 4,
                      py: 1.5,
                      background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: `0 12px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                      },
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    {UI_TEXT.JOIN_BUTTON}
                    <Feather size={16} />
                  </Button>
                </Box>
              </HeroContent>
              <HeroImage
                src={HERO_IMAGE_URL}
                alt={HERO_IMAGE_ALT}
                {...heroImageAnimation}
              />
            </Container>
          </HeroSection>
        )}
        
        <ContentSection isScrolled={isScrolled}>
          <Container {...containerProps}>
            <ScrollSection
              activeSection={activeMenu}
              isLoading={isLoading}
              error={error}
              onRetry={handleRetry}
            />
          </Container>
        </ContentSection>
      </LayoutContainer>
    </ErrorBoundary>
  );
};

export default MainLayout; 