import React from 'react';
import { Box, Grid, Typography, CircularProgress, Pagination } from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import UserPostCard from './UserPostCard';
import { IUserPost } from '../../../../types/user';
import { 
  ANIMATION_DURATION_STANDARD,
  APPLE_EASING,
  STAGGER_DELAY_STANDARD 
} from '../../../../constants/animations';

interface PostGridProps {
  posts: IUserPost[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  selectedFilter: string;
  totalPosts: number;
}

const GridContainer = styled(motion.div)({
  width: '100%',
});

const EmptyState = styled(Box)({
  textAlign: 'center',
  padding: '4rem 0',
  color: '#86868b',
});

const LoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  padding: '3rem 0',
});

const PaginationContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  marginTop: '3rem',
});

const PostsHeader = styled(Box)({
  marginBottom: '2rem',
});

// Animation variants (following @frontend.mdc: naming magic numbers)
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

// Loading component (following @frontend.mdc: separate conditional rendering)
const LoadingState: React.FC = () => (
  <LoadingContainer>
    <CircularProgress sx={{ color: '#007aff' }} />
  </LoadingContainer>
);

// Empty state component (following @frontend.mdc: separate conditional rendering)
const EmptyPostsState: React.FC<{ selectedFilter: string }> = ({ selectedFilter }) => (
  <EmptyState>
    <Typography variant="h6" sx={{ fontSize: '1.2rem', fontWeight: 500, mb: 1 }}>
      No posts found
    </Typography>
    <Typography variant="body2" sx={{ fontSize: '0.95rem' }}>
      {selectedFilter === 'all' 
        ? 'You haven\'t created any posts yet. Start sharing your style!' 
        : `No ${selectedFilter} posts found. Try a different filter.`}
    </Typography>
  </EmptyState>
);

// Posts list component (following @frontend.mdc: separate conditional rendering)
const PostsList: React.FC<{ posts: IUserPost[] }> = ({ posts }) => (
  <Grid container spacing={3}>
    {posts.map((post, index) => (
      <Grid item xs={12} sm={6} md={4} key={post._id}>
        <UserPostCard post={post} index={index} />
      </Grid>
    ))}
  </Grid>
);

// Pagination component (following @frontend.mdc: separate conditional rendering)
const PostsPagination: React.FC<{
  totalPages: number;
  currentPage: number;
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  isLoading: boolean;
}> = ({ totalPages, currentPage, onPageChange, isLoading }) => {
  if (totalPages <= 1) return null;

  return (
    <PaginationContainer>
      <Pagination 
        count={totalPages}
        page={currentPage}
        onChange={onPageChange} 
        color="primary"
        disabled={isLoading}
        sx={{
          '& .MuiPaginationItem-root': {
            color: '#86868b',
            fontWeight: 500,
            '&.Mui-selected': {
              backgroundColor: '#007aff',
              color: 'white',
              '&:hover': {
                backgroundColor: '#0056b3',
              }
            },
            '&:hover': {
              backgroundColor: 'rgba(0, 122, 255, 0.1)',
            }
          }
        }}
      />
    </PaginationContainer>
  );
};

const PostGrid: React.FC<PostGridProps> = ({ 
  posts, 
  isLoading, 
  currentPage, 
  totalPages, 
  onPageChange, 
  selectedFilter,
  totalPosts 
}) => {
  // Post count calculation (following @frontend.mdc: naming complex conditions)
  const getPostCountText = (): string => {
    if (selectedFilter === 'all') {
      return `My Posts (${totalPosts})`;
    }
    return `My ${selectedFilter.toUpperCase()} Posts (${posts.length})`;
  };

  return (
    <GridContainer
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <PostsHeader>
        <Typography 
          variant="h5" 
          sx={{ 
            fontSize: { xs: '1.4rem', sm: '1.6rem' },
            fontWeight: 600,
            color: '#1d1d1f',
            letterSpacing: '-0.01em'
          }}
        >
          {getPostCountText()}
        </Typography>
      </PostsHeader>

      {/* Conditional rendering based on loading and posts availability */}
      {isLoading ? (
        <LoadingState />
      ) : posts.length > 0 ? (
        <>
          <PostsList posts={posts} />
          <PostsPagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={onPageChange}
            isLoading={isLoading}
          />
        </>
      ) : (
        <EmptyPostsState selectedFilter={selectedFilter} />
      )}
    </GridContainer>
  );
};

export default PostGrid; 