import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import OotdPostCard from './OotdPostCard';
import { IOotdPost } from '../types/ootd.types';

interface OotdPostListProps {
  posts: IOotdPost[];
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onInfo: (postId: string) => void;
}

// 스태거 애니메이션 variants
const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  initial: { 
    opacity: 0, 
    y: 40,
    scale: 0.95
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.8, 0.25, 1]
    }
  }
};

const OotdPostList: React.FC<OotdPostListProps> = ({ posts, onLike, onComment, onInfo }) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)'
          },
          gap: { xs: 2, sm: 3, md: 4 },
          px: { xs: 1, sm: 2 }
        }}
      >
        {posts.map((post, index) => (
          <motion.div
            key={post._id}
            variants={itemVariants}
            custom={index}
            whileHover={{
              y: -4,
              transition: { duration: 0.3, ease: [0.25, 0.8, 0.25, 1] }
            }}
            style={{
              willChange: 'transform',
              backfaceVisibility: 'hidden'
            }}
          >
            <OotdPostCard 
              post={post} 
              onLike={onLike}
              onComment={onComment}
              onInfo={onInfo}
            />
          </motion.div>
        ))}
      </Box>
    </motion.div>
  );
};

export default OotdPostList; 