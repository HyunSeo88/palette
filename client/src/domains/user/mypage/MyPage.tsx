import React, { useState, useEffect, useCallback } from 'react';
import { Box, CircularProgress, Typography, Paper, Grid, Avatar, List, ListItem, ListItemText, Divider, Card, CardContent, CardMedia, Pagination, Tabs, Tab, Chip } from '@mui/material';
import { getMyPageData } from '../services/user.service';
import { IMyPageData, IUserPost } from '../../../types/user'; // Adjusted path
import { MyPageContainer } from './MyPage.styles';
import { Link as RouterLink } from 'react-router-dom'; // For linking posts
import { format } from 'date-fns'; // For date formatting

const POSTS_PER_PAGE = 6; // Define posts per page
const ALL_POSTS_FILTER = 'all'; // Constant for the "All" filter

const MyPage: React.FC = () => {
  const [myPageData, setMyPageData] = useState<IMyPageData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [postsLoading, setPostsLoading] = useState<boolean>(false); // Separate loading for posts when filtering/paging
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedPostTypeFilter, setSelectedPostTypeFilter] = useState<string>(ALL_POSTS_FILTER);

  const fetchMyPageDetails = useCallback(async (page: number, postType: string) => {
    // setLoading(true); // Initial full page load
    if(page === 1 && postType === ALL_POSTS_FILTER) setLoading(true); // only for initial full load
    else setPostsLoading(true); // For subsequent post loads (paging/filtering)
    
    try {
      const params: any = { page, limit: POSTS_PER_PAGE };
      if (postType !== ALL_POSTS_FILTER) {
        params.postType = postType;
      }
      const data = await getMyPageData(params);
      
      if (page === 1 && postType === ALL_POSTS_FILTER) {
        setMyPageData(data); // Full update for initial load or "All" filter reset
      } else {
        // Only update posts, keep profile and summary from initial load
        setMyPageData(prevData => prevData ? ({ 
            ...prevData, 
            userPosts: data.userPosts 
        }) : data);
      }
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch My Page data.');
      console.error(err);
    } finally {
      setLoading(false);
      setPostsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyPageDetails(currentPage, selectedPostTypeFilter);
  }, [currentPage, selectedPostTypeFilter, fetchMyPageDetails]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handleFilterChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedPostTypeFilter(newValue);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  if (loading) { // Initial loading spinner 
    return (
      <MyPageContainer sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </MyPageContainer>
    );
  }

  if (error && !myPageData) {
    return (
      <MyPageContainer>
        <Typography color="error">Error: {error}</Typography>
      </MyPageContainer>
    );
  }
  
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const postTypesForFilter = myPageData?.activitySummary?.postsByType 
    ? [ALL_POSTS_FILTER, ...Object.keys(myPageData.activitySummary.postsByType)] 
    : [ALL_POSTS_FILTER];

  return (
    <MyPageContainer>
      {myPageData?.userProfile && (
        <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar 
                src={myPageData.userProfile.profilePicture ? `${API_BASE_URL}${myPageData.userProfile.profilePicture}` : undefined} 
                alt={myPageData.userProfile.nickname} 
                sx={{ width: 80, height: 80 }}
              />
            </Grid>
            <Grid item xs>
              <Typography variant="h4">{myPageData.userProfile.nickname}</Typography>
              <Typography variant="subtitle1" color="textSecondary">{myPageData.userProfile.email}</Typography>
              {myPageData.userProfile.bio && <Typography variant="body1" sx={{ marginTop: 1 }}>{myPageData.userProfile.bio}</Typography>}
            </Grid>
            {/* Add Edit Profile button later */}
          </Grid>
        </Paper>
      )}

      {myPageData?.activitySummary && (
        <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
          <Typography variant="h5" gutterBottom>Activity Summary</Typography>
          <List>
            <ListItem>
              <ListItemText primary="Total Posts" secondary={myPageData.activitySummary.totalPosts} />
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemText primary="Total Comments" secondary={myPageData.activitySummary.totalComments} />
            </ListItem>
            <Divider component="li" />
            <Typography variant="h6" sx={{ marginTop: 2, marginLeft: 2 }}>Posts by Type:</Typography>
            {Object.entries(myPageData.activitySummary.postsByType).map(([type, count]) => (
              <ListItem key={type}>
                <ListItemText primary={type.toUpperCase()} secondary={count} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
      
      {error && myPageData && (
         <Typography color="error" sx={{mb: 2}}>Error loading posts: {error}.</Typography>
      )}

      <Typography variant="h5" gutterBottom>
        My Posts ({selectedPostTypeFilter === ALL_POSTS_FILTER ? (myPageData?.userPosts?.totalPosts || 0) : 
                  (myPageData?.userPosts?.posts.length || 0) + (myPageData?.userPosts?.totalPosts && myPageData?.userPosts?.currentPage < myPageData?.userPosts?.totalPages ? '+':'') // More complex count for filtered views
                 })
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={selectedPostTypeFilter} onChange={handleFilterChange} aria-label="Post type filter tabs">
          {postTypesForFilter.map(type => (
            <Tab 
              key={type} 
              label={`${type.toUpperCase()} (${type === ALL_POSTS_FILTER ? 
                                            myPageData?.activitySummary?.totalPosts || 0 :
                                            myPageData?.activitySummary?.postsByType[type] || 0})`} 
              value={type} 
            />
          ))}
        </Tabs>
      </Box>

      {postsLoading && <Box sx={{display: 'flex', justifyContent:'center', my:2}}><CircularProgress size={24} /></Box> }
      {!postsLoading && myPageData?.userPosts?.posts && myPageData.userPosts.posts.length > 0 ? (
        <Grid container spacing={2}>
          {myPageData.userPosts.posts.map((post: IUserPost) => (
            <Grid item xs={12} sm={6} md={4} key={post._id}>
              <Card>
                 {post.images && post.images.length > 0 && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={`${API_BASE_URL}${post.images[0]}`}
                    alt={post.title || 'Post image'}
                  />
                )}
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    <RouterLink to={`/posts/${post._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      {post.title || 'Untitled Post'}
                    </RouterLink>
                  </Typography>
                  <Typography variant="body2" color="textSecondary" noWrap>
                    {post.content}
                  </Typography>
                  <Box sx={{mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Chip label={post.postType.toUpperCase()} size="small" variant="outlined" />
                    <Typography variant="caption" color="textSecondary">
                      {format(new Date(post.createdAt), 'PPp')}
                    </Typography>
                  </Box>
                  <Typography variant="caption" display="block" color="textSecondary" sx={{mt: 0.5}}>
                    Likes: {post.likes.length} | Comments: {post.commentsCount}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        !postsLoading && <Typography>No posts found for this filter.</Typography>
      )}

      {myPageData?.userPosts?.totalPages && myPageData.userPosts.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
          <Pagination 
            count={myPageData.userPosts.totalPages}
            page={currentPage}
            onChange={handlePageChange} 
            color="primary"
            disabled={postsLoading}
          />
        </Box>
      )}
      
      {!myPageData && !loading && !error && (
        <Typography>No data available.</Typography>
      )}

    </MyPageContainer>
  );
};

export default MyPage; 