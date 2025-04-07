import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  Container,
  useTheme,
  useMediaQuery,
  Typography,
  Box,
  Button
} from '@mui/material';
import PaletteMenu from '../PaletteMenu';
import ErrorBoundary from '../ErrorBoundary';
import {
  LayoutContainer,
  TopDynamicArea,
  LeftPanel,
  RightPanel,
  FeedSection,
  LogoContainer,
  GradientText,
  PaletteIconWrapper,
  MenuInfoContainer,
  MenuIconWrapper,
  ContentCard,
  CardGrid,
  SectionTitle,
  CardImage,
  VoteContainer,
  VoteOption,
  FeedCard,
  MenuContentContainer
} from './MainLayout.styles';
import { Feather, Droplet } from 'react-feather';
import {
  RETRY_DELAY,
  INITIAL_SECTION,
  PALETTE_COLORS,
  UI_TEXT,
  ERROR_PROBABILITY
} from './MainLayout.constants';
import {
  logoIconAnimation,
  logoTextAnimation,
  animationConfig
} from './MainLayout.animations';
import { ValuesContent, HotContent, OutfitContent, PollContent, EventContent } from './MenuContents';

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

// Map menu IDs to their corresponding content components
const menuContentMap = {
  values: ValuesContent,
  hot: HotContent,
  outfit: OutfitContent,
  poll: PollContent,
  event: EventContent,
};

/**
 * 메인 레이아웃 컴포넌트
 * 상단 고정 동적 영역(좌/우 분할)과 하단 스크롤 피드 영역으로 구성됩니다.
 */
const MainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [activeMenu, setActiveMenu] = useState(INITIAL_SECTION);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchSectionData = useCallback(async (menuId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < ERROR_PROBABILITY) {
          reject(new Error('네트워크 오류가 발생했습니다.'));
          return;
        }
        resolve({ success: true, data: menuId });
      }, RETRY_DELAY);
    });
  }, []);

  const handleMenuClick = useCallback(async (menuId) => {
    if (menuId === activeMenu && !error && !isLoading) return;

    setIsLoading(true);
    setError(null);
    try {
      await fetchSectionData(menuId);
      setActiveMenu(menuId);
      setRetryCount(0);
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
    handleMenuClick(activeMenu);
  }, [activeMenu, handleMenuClick, retryCount]);

  const containerProps = useMemo(() => ({
    maxWidth: "lg",
    disableGutters: isMobile,
    sx: { px: { xs: 1.5, sm: 2, md: 3 } }
  }), [isMobile]);

  const ActiveContentComponent = menuContentMap[activeMenu];

  return (
    <ErrorBoundary>
      <LayoutContainer>
        <TopDynamicArea>
          <LeftPanel>
            <LogoContainer sx={{ mb: 4 }}>
              <PaletteIconWrapper {...logoIconAnimation}>
                <ColorPaletteIcon size={isMobile ? 24 : 32} />
              </PaletteIconWrapper>
              <GradientText variant={isMobile ? "h5" : "h4"} component="h1" {...logoTextAnimation}>
                {UI_TEXT.COMMUNITY_NAME}
              </GradientText>
            </LogoContainer>

            <PaletteMenu
              activeItem={activeMenu}
              onMenuClick={handleMenuClick}
            />

            <MenuInfoContainer>
              <Typography>콘텐츠 로딩중...</Typography>
            </MenuInfoContainer>
          </LeftPanel>

          <RightPanel>
            {isLoading && <Typography>로딩 중...</Typography>}
            {error && (
              <Box>
                <Typography color="error">{error}</Typography>
                <Button onClick={handleRetry}>다시 시도</Button>
              </Box>
            )}
            {!isLoading && !error && ActiveContentComponent && (
              <MenuContentContainer key={activeMenu}>
                <ActiveContentComponent />
              </MenuContentContainer>
            )}
            {!isLoading && !error && !ActiveContentComponent && (
              <Typography>선택된 메뉴에 해당하는 콘텐츠가 없습니다.</Typography>
            )}
          </RightPanel>
        </TopDynamicArea>

        <FeedSection>
          <Container {...containerProps}>
            <SectionTitle variant="h4" component="h2">
              커뮤니티 피드
            </SectionTitle>
            <CardGrid>
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <FeedCard key={item}>
                  <CardImage src={`https://source.unsplash.com/random/400x225?sig=${item}`} alt={`피드 아이템 ${item}`} />
                  <Typography variant="h6">피드 아이템 제목 {item}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    피드 아이템 설명입니다. 다양한 컨텐츠가 이곳에 표시됩니다.
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">작성자 / 날짜</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Feather size={16} />
                      <Typography variant="caption">12</Typography>
                    </Box>
                  </Box>
                </FeedCard>
              ))}
            </CardGrid>
          </Container>
        </FeedSection>
      </LayoutContainer>
    </ErrorBoundary>
  );
};

export default MainLayout; 