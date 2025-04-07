import React from 'react';
import { Typography, Box, Grid, Divider, Button, Avatar, Chip, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { Star, Heart, MessageCircle, ArrowRight, Bookmark, Eye } from 'react-feather';
import { FeedSection, SectionTitle, FeedCard, CardImage, ContentCard } from './MainLayout.styles';
import { PALETTE_COLORS } from './MainLayout.constants';

// 더미 데이터: 인기 게시물
const hotPosts = [
  {
    id: 1,
    title: '색각이상자를 위한 여름 코디 제안',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: '스타일 팁',
    author: {
      name: '김패션',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    likes: 342,
    comments: 48
  },
  {
    id: 2,
    title: '색 대비를 활용한 가을 아우터 추천',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: '트렌드',
    author: {
      name: '이스타일',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    likes: 287,
    comments: 36
  },
  {
    id: 3,
    title: '패턴과 텍스처로 스타일 완성하기',
    image: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: '스타일링',
    author: {
      name: '박텍스처',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
    },
    likes: 253,
    comments: 29
  }
];

// 더미 데이터: 오늘의 코디
const ootdPosts = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    author: {
      name: '최코디',
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg'
    },
    likes: 842,
    views: 3201,
    tags: ['오피스룩', '썸머코디', '미니멀']
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    author: {
      name: '정스타일',
      avatar: 'https://randomuser.me/api/portraits/men/15.jpg'
    },
    likes: 623,
    views: 2853,
    tags: ['캐주얼', '데일리룩', '스트릿']
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    author: {
      name: '한패션',
      avatar: 'https://randomuser.me/api/portraits/women/57.jpg'
    },
    likes: 512,
    views: 2102,
    tags: ['모노톤', '블랙', '미니멀']
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    author: {
      name: '홍스타일',
      avatar: 'https://randomuser.me/api/portraits/women/36.jpg'
    },
    likes: 498,
    views: 1932,
    tags: ['여름', '비치룩', '화이트']
  }
];

// 더미 데이터: 이벤트/할인
const events = [
  {
    id: 1,
    title: '색각이상자를 위한 스타일링 워크샵',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    date: '2023년 7월 15일 (토)',
    location: '서울 강남구 팔레트 스튜디오',
    isOnline: false,
    tag: '워크샵',
    isHot: true
  },
  {
    id: 2,
    title: '여름 패션 아이템 특별 할인전',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    date: '2023년 7월 1일 - 7월 31일',
    location: '팔레트 공식 온라인 스토어',
    isOnline: true,
    tag: '할인',
    isHot: false
  }
];

// 더미 데이터: 자유게시판
const freePosts = [
  {
    id: 1,
    title: '색 구별이 어려운 분들을 위한 조언 부탁드립니다',
    excerpt: '저는 중등도 적녹색맹입니다. 옷 고를 때 늘 어려움을 겪는데, 여러분의 조언이나 경험을 나눠주세요.',
    author: '색구분어려움',
    comments: 24,
    timestamp: '3시간 전'
  },
  {
    id: 2,
    title: '텍스처와 패턴으로 스타일링하는 팁',
    excerpt: '컬러 코디네이션이 어려울 때는 패턴과 텍스처로 차별화하는 방법을 공유합니다.',
    author: '패턴킹',
    comments: 16,
    timestamp: '6시간 전'
  },
  {
    id: 3,
    title: '매장에서 직원에게 도움 요청하는 팁',
    excerpt: '색각이상으로 인해 매장에서 옷을 고를 때 직원에게 어떻게 도움을 요청하면 좋을지에 대한 제 경험을 공유합니다.',
    author: '쇼핑러버',
    comments: 19,
    timestamp: '12시간 전'
  }
];

const MainFeedSection = () => {
  return (
    <FeedSection>
      <Container>
        {/* 인기 게시물 섹션 */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <SectionTitle variant="h5" component="h2">
              인기 게시물
            </SectionTitle>
            <Button 
              endIcon={<ArrowRight size={16} />}
              component={motion.button}
              whileHover={{ x: 5 }}
            >
              더보기
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            {hotPosts.map((post) => (
              <Grid item xs={12} sm={6} md={4} key={post.id}>
                <ContentCard 
                  component={motion.div}
                  whileHover={{ y: -5 }}
                >
                  <CardImage src={post.image} alt={post.title} />
                  <Box sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Chip 
                        label={post.category} 
                        size="small" 
                        sx={{ 
                          backgroundColor: `${PALETTE_COLORS.RED}20`, 
                          color: PALETTE_COLORS.RED,
                          fontWeight: 'medium'
                        }} 
                      />
                    </Box>
                    
                    <Typography variant="h6" component="h3" gutterBottom>
                      {post.title}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar src={post.author.avatar} alt={post.author.name} sx={{ width: 24, height: 24, mr: 1 }} />
                        <Typography variant="body2">{post.author.name}</Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Heart size={14} color={PALETTE_COLORS.RED} />
                          <Typography variant="caption">{post.likes}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <MessageCircle size={14} />
                          <Typography variant="caption">{post.comments}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </ContentCard>
              </Grid>
            ))}
          </Grid>
        </Box>
        
        {/* OOTD 섹션 */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <SectionTitle variant="h5" component="h2">
              오늘의 코디 (OOTD)
            </SectionTitle>
            <Button 
              endIcon={<ArrowRight size={16} />}
              component={motion.button}
              whileHover={{ x: 5 }}
            >
              더보기
            </Button>
          </Box>
          
          <Grid container spacing={2}>
            {ootdPosts.map((post) => (
              <Grid item xs={6} sm={6} md={3} key={post.id}>
                <Box
                  component={motion.div}
                  whileHover={{ y: -5 }}
                  sx={{ 
                    position: 'relative',
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    height: 320
                  }}
                >
                  <Box 
                    component="img"
                    src={post.image}
                    alt={`OOTD by ${post.author.name}`}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  
                  <Box sx={{ 
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))',
                    padding: '16px 12px',
                    color: 'white'
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar src={post.author.avatar} alt={post.author.name} sx={{ width: 24, height: 24, mr: 1 }} />
                        <Typography variant="body2">{post.author.name}</Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Heart size={14} fill="white" stroke="none" />
                          <Typography variant="caption">{post.likes}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Eye size={14} />
                          <Typography variant="caption">{post.views}</Typography>
                        </Box>
                      </Box>
                    </Box>
                    
                    <Box sx={{ mt: 1 }}>
                      {post.tags.slice(0, 2).map(tag => (
                        <Chip 
                          key={tag} 
                          label={`#${tag}`} 
                          size="small" 
                          sx={{ 
                            mr: 0.5, 
                            height: 20,
                            fontSize: '0.7rem',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            color: 'white'
                          }} 
                        />
                      ))}
                      {post.tags.length > 2 && (
                        <Typography variant="caption" component="span" sx={{ ml: 0.5 }}>
                          +{post.tags.length - 2}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  
                  <Box sx={{ 
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}>
                    <Bookmark size={16} color="white" />
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button 
              variant="outlined" 
              color="warning"
              startIcon={<Star size={16} />}
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              나의 코디 공유하기
            </Button>
          </Box>
        </Box>
        
        {/* 이벤트/할인 섹션 */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <SectionTitle variant="h5" component="h2">
              이벤트 & 할인
            </SectionTitle>
            <Button 
              endIcon={<ArrowRight size={16} />}
              component={motion.button}
              whileHover={{ x: 5 }}
            >
              더보기
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            {events.map((event) => (
              <Grid item xs={12} sm={6} key={event.id}>
                <ContentCard 
                  component={motion.div}
                  whileHover={{ y: -5 }}
                  sx={{ display: 'flex', flexDirection: {xs: 'column', md: 'row'}, height: '100%' }}
                >
                  <Box sx={{ width: {xs: '100%', md: '40%'}, position: 'relative' }}>
                    <CardImage 
                      src={event.image} 
                      alt={event.title} 
                      sx={{ height: {xs: 200, md: '100%'}, objectPosition: 'center' }}
                    />
                    
                    {event.isHot && (
                      <Chip 
                        label="HOT" 
                        color="error" 
                        size="small" 
                        sx={{ 
                          position: 'absolute',
                          top: 12,
                          left: 12,
                          fontWeight: 'bold'
                        }}
                      />
                    )}
                    
                    <Chip 
                      label={event.tag} 
                      color={event.tag === '워크샵' ? 'primary' : 'secondary'} 
                      size="small" 
                      sx={{ 
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" component="h3" gutterBottom>{event.title}</Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Calendar size={16} color={PALETTE_COLORS.LIGHT_GRAY} />
                      <Typography variant="body2">{event.date}</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {event.isOnline ? 
                        <Chip label="온라인" size="small" sx={{ backgroundColor: '#E3F2FD', color: PALETTE_COLORS.BLUE }} /> :
                        <Chip label="오프라인" size="small" sx={{ backgroundColor: '#FFF8E1', color: PALETTE_COLORS.YELLOW }} />
                      }
                      <Typography variant="body2">{event.location}</Typography>
                    </Box>
                    
                    <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
                      <Button 
                        variant="text" 
                        color="inherit"
                        endIcon={<ArrowRight size={16} />}
                        component={motion.button}
                        whileHover={{ x: 5 }}
                      >
                        자세히 보기
                      </Button>
                    </Box>
                  </Box>
                </ContentCard>
              </Grid>
            ))}
          </Grid>
        </Box>
        
        {/* 자유게시판 섹션 */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <SectionTitle variant="h5" component="h2">
              자유게시판
            </SectionTitle>
            <Button 
              endIcon={<ArrowRight size={16} />}
              component={motion.button}
              whileHover={{ x: 5 }}
            >
              더보기
            </Button>
          </Box>
          
          {freePosts.map((post, index) => (
            <React.Fragment key={post.id}>
              <FeedCard 
                component={motion.div}
                whileHover={{ x: 5 }}
                sx={{ cursor: 'pointer' }}
              >
                <Typography variant="h6" component="h3" gutterBottom>
                  {post.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {post.excerpt}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {post.author}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {post.timestamp}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <MessageCircle size={14} />
                    <Typography variant="caption">{post.comments}</Typography>
                  </Box>
                </Box>
              </FeedCard>
              {index < freePosts.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </Box>
      </Container>
    </FeedSection>
  );
};

export default MainFeedSection; 