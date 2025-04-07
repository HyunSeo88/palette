import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, CircularProgress, Box, Button } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertOctagon } from 'react-feather';
import { SECTION_CONTENT } from './ScrollSection.constants';
import {
  ScrollContainer,
  ContentCard,
  CardImageWrapper,
  CardContentWrapper,
  LoadingContainer,
  ErrorContainer,
} from './ScrollSection.styles';

const FALLBACK_IMAGE = 'https://via.placeholder.com/400x225?text=Image+Not+Found';

/**
 * 스크롤 가능한 섹션 컴포넌트
 * 선택된 섹션에 따라 다른 콘텐츠를 카드 형태로 표시합니다.
 * 
 * @param {Object} props
 * @param {string} props.activeSection - 현재 활성화된 섹션 ID
 * @param {boolean} props.isLoading - 로딩 상태
 * @param {string} props.error - 에러 메시지
 * @param {Function} props.onRetry - 재시도 핸들러
 */
const ScrollSection = ({ activeSection, isLoading = false, error = null, onRetry }) => {
  const sectionData = SECTION_CONTENT[activeSection] || [];

  if (isLoading) {
    return (
      <LoadingContainer>
        <CircularProgress size={40} />
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          콘텐츠를 불러오는 중입니다...
        </Typography>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <AlertOctagon size={40} />
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          콘텐츠를 불러오는데 실패했습니다
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {error}
        </Typography>
        {onRetry && (
          <Button 
            variant="contained" 
            onClick={onRetry} 
            sx={{ mt: 1 }}
            size="large"
          >
            다시 시도
          </Button>
        )}
      </ErrorContainer>
    );
  }

  if (sectionData.length === 0) {
    return (
      <LoadingContainer>
        <Typography variant="body1" color="text.secondary">
          표시할 콘텐츠가 없습니다.
        </Typography>
      </LoadingContainer>
    );
  }

  return (
    <ScrollContainer>
      <AnimatePresence mode="wait">
        <Grid 
          container 
          spacing={{ xs: 2, sm: 3 }} 
          component={motion.div} 
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {sectionData.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} lg={4} key={item.id}>
              <ContentCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <CardImageWrapper
                  image={item.image || FALLBACK_IMAGE}
                  title={item.title}
                  onError={(e) => {
                    e.target.src = FALLBACK_IMAGE;
                    e.target.onerror = null;
                  }}
                />
                <CardContentWrapper>
                  <Typography 
                    variant="h6" 
                    component="h3" 
                    gutterBottom
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {item.description}
                  </Typography>
                </CardContentWrapper>
              </ContentCard>
            </Grid>
          ))}
        </Grid>
      </AnimatePresence>
    </ScrollContainer>
  );
};

ScrollSection.propTypes = {
  activeSection: PropTypes.oneOf(['values', 'hot', 'outfit', 'poll', 'event']).isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  onRetry: PropTypes.func,
};

export default ScrollSection; 