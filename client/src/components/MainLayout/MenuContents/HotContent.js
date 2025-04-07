import React from 'react';
import { Typography, Box, Avatar, Button, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2 } from 'react-feather';
import { ContentCard, MenuContentContainer, CardImage } from '../MainLayout.styles';
import { PALETTE_COLORS } from '../MainLayout.constants';

const hotPosts = [
  {
    id: 1,
    title: '색각이상자를 위한 여름 코디 제안',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    excerpt: '청록색과 핑크색의 조합은 대부분의 색각이상 유형에서도 구분이 용이합니다. 이번 여름 트렌드 컬러를 활용한 코디법을 소개합니다.',
    author: {
      name: '김패션',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    category: '스타일 팁',
    likes: 342,
    comments: 48,
    timestamp: '2시간 전'
  },
  {
    id: 2,
    title: '색 대비를 활용한 가을 아우터 추천',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    excerpt: '가을에 활용하기 좋은 아우터 컬렉션과 색 대비를 고려한 레이어링 방법을 알아봅니다. 채도 차이를 활용한 코디법으로 누구나 스타일리시하게!',
    author: {
      name: '이스타일',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    category: '트렌드',
    likes: 287,
    comments: 36,
    timestamp: '4시간 전'
  },
  {
    id: 3,
    title: '패턴과 텍스처로 스타일 완성하기',
    image: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    excerpt: '색상 구분이 어려울 때 패턴과 텍스처를 활용하는 방법. 모노톤 착장에도 포인트를 줄 수 있는 다양한 텍스처 믹스 매치 방법을 소개합니다.',
    author: {
      name: '박텍스처',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
    },
    category: '스타일링',
    likes: 253,
    comments: 29,
    timestamp: '8시간 전'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const HotContent = () => {
  return (
    <MenuContentContainer
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      exit={{ opacity: 0 }}
    >
      <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
        인기 게시물
      </Typography>
      
      {hotPosts.map((post) => (
        <ContentCard 
          key={post.id} 
          component={motion.div} 
          variants={itemVariants}
          sx={{ mb: 3 }}
        >
          <Box sx={{ display: 'flex', flexDirection: {xs: 'column', md: 'row'}, gap: 3 }}>
            <Box sx={{ flex: {xs: '1 1 auto', md: '0 0 40%'} }}>
              <CardImage src={post.image} alt={post.title} />
            </Box>
            
            <Box sx={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Chip 
                  label={post.category} 
                  size="small" 
                  sx={{ 
                    backgroundColor: `${PALETTE_COLORS.RED}20`, 
                    color: PALETTE_COLORS.RED,
                    fontWeight: 'bold'
                  }} 
                />
                <Typography variant="caption" color="text.secondary">{post.timestamp}</Typography>
              </Box>
              
              <Typography variant="h6" component="h3" gutterBottom>{post.title}</Typography>
              <Typography variant="body2" color="text.secondary" paragraph>{post.excerpt}</Typography>
              
              <Box sx={{ mt: 'auto' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar src={post.author.avatar} alt={post.author.name} sx={{ width: 32, height: 32, mr: 1 }} />
                  <Typography variant="body2" fontWeight="medium">{post.author.name}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Heart size={16} color={PALETTE_COLORS.RED} />
                      <Typography variant="body2">{post.likes}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <MessageCircle size={16} />
                      <Typography variant="body2">{post.comments}</Typography>
                    </Box>
                  </Box>
                  
                  <Button 
                    size="small" 
                    endIcon={<Share2 size={14} />}
                    sx={{ 
                      color: PALETTE_COLORS.RED, 
                      '&:hover': { color: PALETTE_COLORS.RED, backgroundColor: `${PALETTE_COLORS.RED}10` } 
                    }}
                  >
                    공유하기
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </ContentCard>
      ))}
      
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Button 
          variant="outlined" 
          color="primary" 
          component={motion.button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          더 많은 인기글 보기
        </Button>
      </Box>
    </MenuContentContainer>
  );
};

export default HotContent; 