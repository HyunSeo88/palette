import React from 'react';
import { Typography, Box, Button, Avatar, Grid, Divider, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { Star, Award, ThumbsUp, Eye } from 'react-feather';
import { ContentCard, MenuContentContainer, CardImage } from '../MainLayout.styles';
import { PALETTE_COLORS } from '../MainLayout.constants';

const outfits = [
  {
    id: 1,
    title: '여름 오피스룩 스타일링',
    image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: '회사에서도 시원하게! 가볍고 통풍이 좋은 소재의 정장으로 오피스룩을 스타일리시하게 연출하는 방법',
    author: {
      name: '최코디',
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg'
    },
    isBest: true,
    votes: 842,
    views: 3201,
    colors: ['#E3F2FD', '#FFECB3', '#FFFFFF'],
    comments: 52,
    tags: ['오피스룩', '썸머코디', '미니멀']
  },
  {
    id: 2,
    title: '데일리 캐주얼 코디',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: '일상에서 편안하게 입을 수 있는 캐주얼 코디. 색상 대비를 활용해 밋밋하지 않게 스타일링하는 팁을 소개합니다.',
    author: {
      name: '정스타일',
      avatar: 'https://randomuser.me/api/portraits/men/15.jpg'
    },
    isBest: false,
    votes: 623,
    views: 2853,
    colors: ['#BBDEFB', '#FFE082', '#C5CAE9'],
    comments: 41,
    tags: ['캐주얼', '데일리룩', '스트릿']
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

const ColorSwatch = ({ colors }) => (
  <Box sx={{ display: 'flex', gap: 1, my: 1 }}>
    {colors.map((color, index) => (
      <Box
        key={index}
        sx={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          backgroundColor: color,
          border: '2px solid white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
        }}
      />
    ))}
    <Typography variant="caption" sx={{ ml: 1, alignSelf: 'center', color: 'text.secondary' }}>
      사용된 컬러
    </Typography>
  </Box>
);

const OutfitContent = () => {
  return (
    <MenuContentContainer
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      exit={{ opacity: 0 }}
    >
      <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
        오늘의 Best 코디
      </Typography>
      
      <Grid container spacing={3}>
        {outfits.map((outfit) => (
          <Grid item xs={12} key={outfit.id}>
            <ContentCard component={motion.div} variants={itemVariants}
              sx={{ 
                position: 'relative',
                borderColor: outfit.isBest ? PALETTE_COLORS.YELLOW : 'transparent',
                borderWidth: outfit.isBest ? 2 : 0,
                borderStyle: outfit.isBest ? 'solid' : 'none',
              }}
            >
              {outfit.isBest && (
                <Box sx={{ 
                  position: 'absolute',
                  top: -15,
                  right: 20,
                  backgroundColor: PALETTE_COLORS.YELLOW,
                  borderRadius: '14px',
                  px: 2,
                  py: 0.5,
                  color: 'white',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  zIndex: 1,
                }}>
                  <Award size={16} />
                  <Typography variant="caption" fontWeight="bold">BEST</Typography>
                </Box>
              )}
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <CardImage 
                    src={outfit.image} 
                    alt={outfit.title}
                    sx={{ 
                      height: 320,
                      borderRadius: 2,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar src={outfit.author.avatar} alt={outfit.author.name} sx={{ width: 40, height: 40 }} />
                      <Box>
                        <Typography variant="subtitle2">{outfit.author.name}</Typography>
                        <Typography variant="caption" color="text.secondary">스타일리스트</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ThumbsUp size={14} color={PALETTE_COLORS.YELLOW} />
                        <Typography variant="caption" fontWeight="medium">{outfit.votes}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Eye size={14} />
                        <Typography variant="caption">{outfit.views}</Typography>
                      </Box>
                    </Box>
                  </Box>
                  
                  <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 2 }}>
                    {outfit.title}
                  </Typography>
                  
                  <Typography variant="body2" paragraph>
                    {outfit.description}
                  </Typography>
                  
                  <ColorSwatch colors={outfit.colors} />
                  
                  <Box sx={{ mt: 2, mb: 2 }}>
                    {outfit.tags.map(tag => (
                      <Chip 
                        key={tag} 
                        label={`#${tag}`} 
                        size="small" 
                        sx={{ 
                          mr: 1, 
                          mb: 1, 
                          backgroundColor: `${PALETTE_COLORS.YELLOW}15`,
                          color: 'text.primary'
                        }} 
                      />
                    ))}
                  </Box>
                  
                  <Button 
                    variant="outlined" 
                    color="warning" 
                    fullWidth
                    sx={{ mt: 2 }}
                    component={motion.button}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    자세히 보기
                  </Button>
                </Grid>
              </Grid>
            </ContentCard>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button 
          variant="contained" 
          color="warning"
          startIcon={<Star size={16} />}
          component={motion.button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          나의 코디 공유하기
        </Button>
      </Box>
    </MenuContentContainer>
  );
};

export default OutfitContent; 