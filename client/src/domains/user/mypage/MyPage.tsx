import React, { useState, useEffect, useCallback } from 'react';
import { Container, CircularProgress, Typography, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { getMyPageData } from '../services/user.service';
import { IMyPageData } from '../../../types/user';
import UserProfileCard from './components/UserProfileCard';
import ActivitySummary from './components/ActivitySummary';
import PostTypeFilter from './components/PostTypeFilter';
import PostGrid from './components/PostGrid';
import { 
  MYPAGE_POSTS_PER_PAGE,
  ALL_POSTS_FILTER,
  ANIMATION_DURATION_STANDARD,
  APPLE_EASING 
} from '../../../constants/animations';

const MyPageContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: '#fafafa',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(6),
}));

const LoadingContainer = styled(motion.div)({
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center', 
  height: '80vh'
});

const ErrorContainer = styled(motion.div)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center'
}));

const ContentContainer = styled(motion.div)({
  maxWidth: '1200px',
  margin: '0 auto',
});

// Animation variants (following @frontend.mdc: naming magic numbers)
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: ANIMATION_DURATION_STANDARD,
      ease: APPLE_EASING
    }
  }
};

// Loading component (following @frontend.mdc: separate conditional rendering)
const LoadingState: React.FC = () => (
  <LoadingContainer
    variants={pageVariants}
    initial="initial"
    animate="animate"
  >
    <CircularProgress sx={{ color: '#007aff' }} />
  </LoadingContainer>
);

// Error component (following @frontend.mdc: separate conditional rendering)
const ErrorState: React.FC<{ error: string }> = ({ error }) => (
  <ErrorContainer
    variants={pageVariants}
    initial="initial"
    animate="animate"
  >
    <Alert 
      severity="error" 
      sx={{ 
        borderRadius: '12px',
        backgroundColor: '#fff',
        border: '1px solid rgba(255, 59, 48, 0.2)',
        boxShadow: '0 4px 16px rgba(255, 59, 48, 0.1)'
      }}
    >
      Error: {error}
    </Alert>
  </ErrorContainer>
);

// Main content component (following @frontend.mdc: separate conditional rendering)
const MyPageContent: React.FC<{ 
  myPageData: IMyPageData;
  onPostsUpdate: (posts: any) => void;
}> = ({ myPageData, onPostsUpdate }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedPostTypeFilter, setSelectedPostTypeFilter] = useState<string>(ALL_POSTS_FILTER);
  const [postsLoading, setPostsLoading] = useState<boolean>(false);
  const [postsError, setPostsError] = useState<string | null>(null);

  // Fetch posts based on filter and page (following @frontend.mdc: abstract complex logic)
  const fetchFilteredPosts = useCallback(async (page: number, postType: string) => {
    setPostsLoading(true);
    setPostsError(null);
    
    try {
      const params: any = { page, limit: MYPAGE_POSTS_PER_PAGE };
      if (postType !== ALL_POSTS_FILTER) {
        params.postType = postType;
      }
      
      const data = await getMyPageData(params);
      
      // Update posts via parent callback to maintain immutability
      onPostsUpdate(data.userPosts);
    } catch (err: any) {
      setPostsError(err.message || 'Failed to fetch posts.');
      console.error(err);
    } finally {
      setPostsLoading(false);
    }
  }, [onPostsUpdate]);

  useEffect(() => {
    fetchFilteredPosts(currentPage, selectedPostTypeFilter);
  }, [currentPage, selectedPostTypeFilter, fetchFilteredPosts]);

  // Event handlers (following @frontend.mdc: single responsibility)
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handleFilterChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedPostTypeFilter(newValue);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  return (
    <ContentContainer
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      {/* User Profile Section */}
      <UserProfileCard userProfile={myPageData.userProfile} />

      {/* Activity Summary Section */}
      <ActivitySummary activitySummary={myPageData.activitySummary} />

      {/* Post Type Filter */}
      <PostTypeFilter
        selectedFilter={selectedPostTypeFilter}
        onFilterChange={handleFilterChange}
        activitySummary={myPageData.activitySummary}
        allPostsFilterValue={ALL_POSTS_FILTER}
      />

      {/* Posts Error Display */}
      {postsError && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            borderRadius: '12px',
            backgroundColor: '#fff',
            border: '1px solid rgba(255, 59, 48, 0.2)',
            boxShadow: '0 4px 16px rgba(255, 59, 48, 0.1)'
          }}
        >
          Error loading posts: {postsError}
        </Alert>
      )}

      {/* Posts Grid */}
      <PostGrid
        posts={myPageData.userPosts?.posts || []}
        isLoading={postsLoading}
        currentPage={currentPage}
        totalPages={myPageData.userPosts?.totalPages || 1}
        onPageChange={handlePageChange}
        selectedFilter={selectedPostTypeFilter}
        totalPosts={myPageData.activitySummary?.totalPosts || 0}
      />
    </ContentContainer>
  );
};

const MyPage: React.FC = () => {
  const [myPageData, setMyPageData] = useState<IMyPageData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initial data fetch (following @frontend.mdc: abstract complex logic)
  const fetchInitialData = useCallback(async () => {
    try {
      const params = { page: 1, limit: MYPAGE_POSTS_PER_PAGE };
      const data = await getMyPageData(params);
      setMyPageData(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch My Page data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Posts update callback (following @frontend.mdc: single responsibility)
  const handlePostsUpdate = useCallback((newUserPosts: any) => {
    setMyPageData(prevData => 
      prevData ? {
        ...prevData,
        userPosts: newUserPosts
      } : null
    );
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  return (
    <MyPageContainer maxWidth="xl">
      {/* Conditional rendering based on loading state */}
      {loading ? (
        <LoadingState />
      ) : error && !myPageData ? (
        <ErrorState error={error} />
      ) : myPageData ? (
        <MyPageContent 
          myPageData={myPageData} 
          onPostsUpdate={handlePostsUpdate}
        />
      ) : (
        <ErrorContainer
          variants={pageVariants}
          initial="initial"
          animate="animate"
        >
          <Typography>No data available.</Typography>
        </ErrorContainer>
      )}
    </MyPageContainer>
  );
};

export default MyPage; 