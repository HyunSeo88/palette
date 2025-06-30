import React, { useMemo, useCallback } from 'react';
import { Box, useTheme } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { IOotdPost } from '../types/ootd.types';
import EnhancedOotdCard from './enhanced/EnhancedOotdCard';
import CarouselNavigation from './enhanced/CarouselNavigation';
import CarouselIndicators from './enhanced/CarouselIndicators';
import { useCarouselSlide } from '../hooks/useCarouselSlide';
import { useOotdStore } from '../stores/useOotdStore';
import { 
  CAROUSEL_CARD_WIDTH, 
  CAROUSEL_CARD_GAP, 
  ANIMATION_DURATION_STANDARD,
  APPLE_EASING 
} from '../../../constants/animations';

export interface TopOotdCarouselProps {
  posts: IOotdPost[];
}

/**
 * Optimized Top OOTD Carousel Component
 * Following @frontend.mdc guidelines for performance and maintainability
 */
const TopOotdCarousel: React.FC<TopOotdCarouselProps> = React.memo(({ posts }) => {
  const theme = useTheme();
  const openCommentModal = useOotdStore((state) => state.openCommentModal);
  const openInfoModal = useOotdStore((state) => state.openInfoModal);
  const toggleLike = useOotdStore((state) => state.toggleLike);

  // 커스텀 훅으로 슬라이드 로직 추상화
  const {
    currentIndex,
    direction,
    isAnimating,
    handleNext,
    handlePrev,
    goToSlide,
  } = useCarouselSlide({
    totalItems: posts.length,
    autoPlay: posts.length > 1,
    animationDuration: ANIMATION_DURATION_STANDARD,
  });

  // 메모이제이션된 애니메이션 variants
  const containerVariants = useMemo(() => ({
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        duration: ANIMATION_DURATION_STANDARD,
        ease: APPLE_EASING,
      }
    }
  }), []);

  const slideVariants = useMemo(() => ({
    enter: (direction: number) => ({
      x: direction > 0 ? CAROUSEL_CARD_WIDTH + CAROUSEL_CARD_GAP : -(CAROUSEL_CARD_WIDTH + CAROUSEL_CARD_GAP),
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: ANIMATION_DURATION_STANDARD,
        ease: APPLE_EASING,
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? CAROUSEL_CARD_WIDTH + CAROUSEL_CARD_GAP : -(CAROUSEL_CARD_WIDTH + CAROUSEL_CARD_GAP),
      opacity: 0,
      transition: {
        duration: ANIMATION_DURATION_STANDARD,
        ease: APPLE_EASING,
      }
    })
  }), []);

  // 메모이제이션된 이벤트 핸들러들
  const handleLike = useCallback((postId: string, userId: string) => {
    toggleLike(postId, userId);
  }, [toggleLike]);

  const handleComment = useCallback((postId: string) => {
    openCommentModal(postId);
  }, [openCommentModal]);

  const handleInfo = useCallback((postId: string) => {
    openInfoModal(postId);
  }, [openInfoModal]);

  // 빈 포스트 처리
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <Box 
        sx={{
          position: 'relative',
          width: '100%',
          height: 'auto',
          minHeight: { xs: 480, sm: 540, md: 580 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          py: 2
        }}
      >
        {/* 메인 카드 영역 */}
        <Box
          sx={{
            position: 'relative',
            width: { xs: 320, sm: 360, md: CAROUSEL_CARD_WIDTH },
            maxWidth: '90vw',
            height: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              style={{
                position: 'absolute',
                width: '100%',
                height: 'auto'
              }}
            >
              <EnhancedOotdCard 
                post={posts[currentIndex]} 
                isTopPostCard={true}
                onLike={handleLike}
                onComment={handleComment}
                onInfo={handleInfo}
              />
            </motion.div>
          </AnimatePresence>
        </Box>

        {/* 네비게이션 버튼 */}
        <CarouselNavigation
          onNext={handleNext}
          onPrev={handlePrev}
          isDisabled={isAnimating}
          showNavigation={posts.length > 1}
        />

        {/* 인디케이터 (5개 이하일 때만 표시) */}
        <CarouselIndicators
          totalItems={posts.length}
          currentIndex={currentIndex}
          onIndicatorClick={goToSlide}
          showIndicators={posts.length > 1}
          maxIndicators={5} // 5개 초과시 자동으로 숨김
        />
      </Box>
    </motion.div>
  );
});

TopOotdCarousel.displayName = 'TopOotdCarousel';

export default TopOotdCarousel; 