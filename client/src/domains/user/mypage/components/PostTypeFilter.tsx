import React from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { IActivitySummary } from '../../../../types/user';
import { 
  ANIMATION_DURATION_STANDARD,
  APPLE_EASING 
} from '../../../../constants/animations';

interface PostTypeFilterProps {
  selectedFilter: string;
  onFilterChange: (event: React.SyntheticEvent, newValue: string) => void;
  activitySummary: IActivitySummary | null;
  allPostsFilterValue: string;
}

const FilterContainer = styled(motion.div)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  marginBottom: theme.spacing(4),
  overflow: 'hidden',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  minHeight: 'auto',
  '& .MuiTabs-indicator': {
    backgroundColor: '#007aff',
    height: '3px',
    borderRadius: '1.5px',
  },
  '& .MuiTabs-flexContainer': {
    gap: theme.spacing(1),
  }
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  minHeight: 'auto',
  padding: theme.spacing(2, 3),
  fontSize: '0.95rem',
  fontWeight: 500,
  color: '#86868b',
  textTransform: 'none',
  borderRadius: '12px',
  margin: theme.spacing(0.5),
  transition: 'all 0.2s ease',
  '&.Mui-selected': {
    color: '#007aff',
    fontWeight: 600,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  '&:hover': {
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
    color: '#007aff',
  }
}));

const PostTypeFilter: React.FC<PostTypeFilterProps> = ({
  selectedFilter,
  onFilterChange,
  activitySummary,
  allPostsFilterValue
}) => {
  // Post types for filter (following @frontend.mdc: colocate simple logic)
  const postTypesForFilter = activitySummary?.postsByType 
    ? [allPostsFilterValue, ...Object.keys(activitySummary.postsByType)] 
    : [allPostsFilterValue];

  // Get count for each filter type (following @frontend.mdc: naming complex conditions)
  const getFilterCount = (type: string): number => {
    if (type === allPostsFilterValue) {
      return activitySummary?.totalPosts || 0;
    }
    return activitySummary?.postsByType[type] || 0;
  };

  // Generate filter label (following @frontend.mdc: single responsibility)
  const getFilterLabel = (type: string): string => {
    const count = getFilterCount(type);
    const displayName = type === allPostsFilterValue ? 'All' : type.toUpperCase();
    return `${displayName} (${count})`;
  };

  return (
    <FilterContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: {
          duration: ANIMATION_DURATION_STANDARD,
          ease: APPLE_EASING
        }
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontSize: '1.1rem',
            fontWeight: 600,
            color: '#1d1d1f',
            letterSpacing: '-0.01em',
            mb: 2
          }}
        >
          Filter Posts
        </Typography>
        
        <StyledTabs 
          value={selectedFilter} 
          onChange={onFilterChange} 
          aria-label="Post type filter tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          {postTypesForFilter.map(type => (
            <StyledTab 
              key={type} 
              label={getFilterLabel(type)}
              value={type} 
            />
          ))}
        </StyledTabs>
      </Box>
    </FilterContainer>
  );
};

export default PostTypeFilter; 