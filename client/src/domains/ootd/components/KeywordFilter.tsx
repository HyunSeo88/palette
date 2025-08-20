import React, { useState, useEffect } from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useOotdStore } from '../stores/useOotdStore';
// import { getOotdKeywords } from '../services/ootd.service'; // 백엔드에서 키워드 목록을 가져올 경우

// 애플 스타일 애니메이션 variants
const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.04,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

const chipVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

const KeywordFilter: React.FC = () => {
  const currentKeywordFilter = useOotdStore((state) => state.currentKeywordFilter);
  const setKeywordFilter = useOotdStore((state) => state.setKeywordFilter);
  const posts = useOotdStore((state) => state.posts);
  const topPosts = useOotdStore((state) => state.topPosts);

  const [allKeywords, setAllKeywords] = useState<string[]>([]);

  useEffect(() => {
    const keywordsFromPosts = new Set<string>();
    [...posts, ...topPosts].forEach(post => 
      post.tags?.forEach(tag => keywordsFromPosts.add(tag))
    );
    // 백엔드에서 키워드 목록을 직접 가져오는 API가 있다면 아래 로직으로 대체
    // const fetchKeywords = async () => {
    //   try {
    //     const keywords = await getOotdKeywords(); 
    //     setAllKeywords(['전체', ...new Set(keywords)]);
    //   } catch (error) {
    //     console.error("Failed to fetch keywords:", error);
    //     setAllKeywords(['전체']); // 에러 시 기본값
    //   }
    // };
    // fetchKeywords();
    setAllKeywords(['전체', ...Array.from(keywordsFromPosts).sort()]);
  }, [posts, topPosts]);

  const handleKeywordClick = (keyword: string) => {
    if (keyword === '전체') {
      setKeywordFilter(null);
    } else {
      setKeywordFilter(keyword);
    }
  };

  if (allKeywords.length <= 1 && allKeywords[0] === '전체') {
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
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 1.5,
          mb: 2
        }}
      >
        <AnimatePresence>
          {allKeywords.map((keyword) => {
            const isActive = (currentKeywordFilter === keyword) || (keyword === '전체' && currentKeywordFilter === null);
            
            return (
              <motion.div
                key={keyword}
                variants={chipVariants}
                initial="initial"
                animate="animate"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Chip
                  label={keyword}
                  onClick={() => handleKeywordClick(keyword)}
                  sx={{
                    height: 36,
                    borderRadius: '8px',
                    backgroundColor: isActive ? '#007aff' : '#f5f5f7',
                    color: isActive ? '#fff' : '#1d1d1f',
                    border: 'none',
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: isActive ? '#0051d5' : '#ebebeb'
                    },
                    '& .MuiChip-label': {
                      px: 2
                    }
                  }}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </Box>
      
      {/* 선택된 키워드 인디케이터 */}
      {currentKeywordFilter && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Box
            sx={{
              mt: 2,
              p: 2,
              borderRadius: '12px',
              backgroundColor: '#f5f5f7',
              textAlign: 'center'
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: '#86868b',
                fontSize: '0.9rem',
                fontWeight: 500
              }}
            >
              현재 필터: <strong style={{ color: '#1d1d1f' }}>#{currentKeywordFilter}</strong>
            </Typography>
          </Box>
        </motion.div>
      )}
    </motion.div>
  );
};

export default KeywordFilter; 