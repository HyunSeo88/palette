import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress, Alert, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useOotdStore } from 'domains/ootd/stores/useOotdStore';
import TopOotdCarousel from 'domains/ootd/components/TopOotdCarousel';
import OotdPostList from 'domains/ootd/components/OotdPostList';
import KeywordFilter from 'domains/ootd/components/KeywordFilter';
import OotdCommentModal from 'domains/ootd/components/OotdCommentModal';
import OotdInfoModal from 'domains/ootd/components/OotdInfoModal';
import EnhancedOotdCard from 'domains/ootd/components/enhanced/EnhancedOotdCard';
import FloatingActionButton from 'domains/ootd/components/enhanced/FloatingActionButton';
import { useAuth } from '../contexts/AuthContext';
import { 
  ANIMATION_DURATION_STANDARD, 
  STAGGER_DELAY_STANDARD, 
  APPLE_EASING,
  VIEWPORT_MARGIN 
} from '../constants/animations';
// import MainLayout from 'components/layout/MainLayout'; // MainLayout도 절대경로 사용 가능

// 애플 스타일 애니메이션 variants (메모이제이션됨)
const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: ANIMATION_DURATION_STANDARD,
      ease: APPLE_EASING
    }
  }
};

const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: ANIMATION_DURATION_STANDARD,
      staggerChildren: STAGGER_DELAY_STANDARD,
      ease: APPLE_EASING
    }
  }
};

const sectionVariants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_DURATION_STANDARD,
      ease: APPLE_EASING
    }
  }
};

const OotdPage: React.FC = () => {
  const theme = useTheme();
  const { user: currentUser } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  
  const {
    fetchOotdPosts,
    fetchTopOotdPosts,
    isLoading,
    error,
    posts,
    topPosts,
    currentPage,
    totalPages,
    // 모달 상태 및 핸들러는 각 모달 컴포넌트 내부 또는 Context로 관리하는 것이 더 적합할 수 있음
    // 여기서는 스토어에서 직접 가져와서 prop으로 넘기는 예시
    isCommentModalOpen,
    isInfoModalOpen,
    activePostIdForModal,
    openCommentModal,
    closeCommentModal,
    openInfoModal,
    closeInfoModal,
  } = useOotdStore();

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchTopOotdPosts(10),
        fetchOotdPosts({ page: 1, limit: 9 })
      ]);
      setIsLoaded(true);
    };
    loadData();
  }, [fetchOotdPosts, fetchTopOotdPosts]);

  // 무한 스크롤 또는 페이지네이션 로직 (예시)
  const handleLoadMore = () => {
    if (currentPage < totalPages && !isLoading) {
      fetchOotdPosts({ page: currentPage + 1, limit: 9 });
    }
  };

  // OOTD 작성 페이지로 이동
  const handleCreatePost = () => {
    // TODO: Navigate to create post page
    console.log('Create new OOTD post');
  };

  // 사진 촬영 기능 (향후 구현)
  const handleTakePhoto = () => {
    console.log('Take photo for OOTD');
  };

  // TODO: 실제 MainLayout으로 감싸야 함
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      style={{
        minHeight: '100vh',
        backgroundColor: '#fafafa',
        position: 'relative'
      }}
    >
      {/* 메인 콘텐츠 */}
      <Container 
        maxWidth="lg" 
        sx={{ 
          pt: { xs: 4, sm: 6, md: 8 },
          pb: { xs: 6, sm: 8, md: 10 }
        }}
      >
        <motion.div variants={containerVariants}>
          {/* 헤더 섹션 - 애플 스타일 */}
          <motion.div variants={sectionVariants}>
            <Box 
              textAlign="center" 
              mb={{ xs: 6, sm: 8, md: 10 }}
            >
              <Typography 
                variant="h1" 
                sx={{ 
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                  fontWeight: 600,
                  color: '#1d1d1f',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1,
                  mb: 2
                }}
              >
                OOTD Collection
              </Typography>
              <Typography 
                variant="h6" 
                sx={{
                  fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.4rem' },
                  fontWeight: 400,
                  color: '#86868b',
                  lineHeight: 1.4,
                  maxWidth: '600px',
                  mx: 'auto'
                }}
              >
                당신만의 스타일을 세상과 공유하세요
              </Typography>
            </Box>
          </motion.div>

          {error && (
            <motion.div variants={sectionVariants}>
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 4,
                  borderRadius: '12px',
                  backgroundColor: '#fff',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)'
                }}
              >
                {error}
              </Alert>
            </motion.div>
          )}
          
          {/* 인기 OOTD 섹션 - 애플 스타일 */}
          <motion.div variants={sectionVariants}>
            <Box mb={{ xs: 8, sm: 10, md: 12 }}>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
                  fontWeight: 600,
                  color: '#1d1d1f',
                  letterSpacing: '-0.02em',
                  textAlign: 'center',
                  mb: { xs: 4, sm: 6 }
                }}
              >
                Weekly Top OOTD
              </Typography>
              
              {isLoading && topPosts.length === 0 && (
                <Box display="flex" justifyContent="center" py={8}>
                  <CircularProgress sx={{ color: '#007aff' }} />
                </Box>
              )}
              {!isLoading && topPosts.length === 0 && !error && (
                <Typography 
                  variant="body1" 
                  textAlign="center" 
                  sx={{ color: '#86868b', py: 8, fontSize: '1.1rem' }}
                >
                  아직 인기 OOTD가 없습니다
                </Typography>
              )}
              {topPosts.length > 0 && <TopOotdCarousel posts={topPosts} />}
            </Box>
          </motion.div>

          {/* 키워드 필터 섹션 - 애플 스타일 */}
          <motion.div variants={sectionVariants}>
            <Box 
              mb={{ xs: 6, sm: 8, md: 10 }}
              sx={{
                p: { xs: 3, sm: 4 },
                backgroundColor: '#fff',
                borderRadius: '16px',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)'
              }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  fontSize: { xs: '1.25rem', sm: '1.4rem' },
                  fontWeight: 600,
                  color: '#1d1d1f',
                  letterSpacing: '-0.01em',
                  mb: 3
                }}
              >
                Style Keywords
              </Typography>
              <KeywordFilter />
            </Box>
          </motion.div>

          {/* 최신 OOTD 섹션 - 애플 스타일 */}
          <motion.div variants={sectionVariants}>
            <Box>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
                  fontWeight: 600,
                  color: '#1d1d1f',
                  letterSpacing: '-0.02em',
                  textAlign: 'center',
                  mb: { xs: 4, sm: 6 }
                }}
              >
                Latest OOTD
              </Typography>
              
              {isLoading && posts.length === 0 && (
                <Box display="flex" justifyContent="center" py={12}>
                  <CircularProgress sx={{ color: '#007aff' }} />
                </Box>
              )}
              {!isLoading && posts.length === 0 && !error && (
                <Typography 
                  variant="body1" 
                  textAlign="center" 
                  sx={{ color: '#86868b', py: 12, fontSize: '1.1rem' }}
                >
                  첫 번째 OOTD를 공유해보세요
                </Typography>
              )}
              {posts.length > 0 && (
                <Box 
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(3, 1fr)',
                      lg: 'repeat(3, 1fr)'
                    },
                    gap: { xs: 3, sm: 4, md: 4 },
                    mb: 6
                  }}
                >
                  {posts.map((post, index) => (
                    <motion.div
                      key={post._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        transition: { 
                          delay: index * 0.1,
                          duration: ANIMATION_DURATION_STANDARD,
                          ease: APPLE_EASING
                        }
                      }}
                      whileInView={{ 
                        opacity: 1, 
                        y: 0,
                        transition: { 
                          duration: ANIMATION_DURATION_STANDARD,
                          ease: APPLE_EASING
                        }
                      }}
                      viewport={{ once: true, margin: VIEWPORT_MARGIN }}
                    >
                      <EnhancedOotdCard
                        post={post}
                        onLike={(postId, userId) => {
                          useOotdStore.getState().toggleLike(postId, userId);
                        }}
                        onComment={openCommentModal}
                        onInfo={openInfoModal}
                      />
                    </motion.div>
                  ))}
                </Box>
              )}
              
              {/* 더 보기 버튼 - 애플 스타일 */}
              {currentPage < totalPages && !isLoading && (
                <Box textAlign="center" mt={8}>
                  <motion.button
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      padding: '14px 28px',
                      borderRadius: '12px',
                      border: 'none',
                      backgroundColor: '#007aff',
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      boxShadow: '0 4px 16px rgba(0, 122, 255, 0.3)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {isLoading ? '로딩 중...' : '더 많은 OOTD 보기'}
                  </motion.button>
                </Box>
              )}
            </Box>
          </motion.div>
        </motion.div>

        {/* Floating Action Button */}
        <FloatingActionButton
          onCreatePost={handleCreatePost}
          onTakePhoto={handleTakePhoto}
        />

        {/* 모달들 */}
        {activePostIdForModal && (
          <>
            <OotdCommentModal 
              open={isCommentModalOpen} 
              onClose={closeCommentModal} 
              postId={activePostIdForModal} 
            />
            <OotdInfoModal 
              open={isInfoModalOpen} 
              onClose={closeInfoModal} 
              postId={activePostIdForModal} 
            />
          </>
        )}
      </Container>
    </motion.div>
  );
};

export default OotdPage; 