import React from 'react';
import { Typography, Box, Button, Grid, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { Calendar, Clock, Tag, ArrowRight } from 'react-feather';
import { ContentCard, MenuContentContainer, CardImage } from '../MainLayout.styles';
import { PALETTE_COLORS } from '../MainLayout.constants';

const events = [
  {
    id: 1,
    title: '색각이상자를 위한 스타일링 워크샵',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: '다양한 색 조합과 패턴을 활용한 스타일링 방법을 배워보세요. 색각이상 유형별 맞춤 팁과 실제 스타일링 세션이 준비되어 있습니다.',
    date: '2023년 7월 15일 (토)',
    time: '오후 2시 - 오후 5시',
    location: '서울 강남구 팔레트 스튜디오',
    isOnline: false,
    price: '무료 (사전 예약 필수)',
    tag: '워크샵',
    isHot: true
  },
  {
    id: 2,
    title: '여름 패션 아이템 특별 할인전',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: '무더운 여름을 시원하게 보낼 수 있는 패션 아이템을 한정 할인가로 만나보세요. 색상별 큐레이션 상품을 특별가로 제공합니다.',
    date: '2023년 7월 1일 - 7월 31일',
    time: '상시',
    location: '팔레트 공식 온라인 스토어',
    isOnline: true,
    price: '최대 50% 할인',
    tag: '할인',
    isHot: false
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

const EventCard = ({ event }) => {
  return (
    <ContentCard component={motion.div} variants={itemVariants}>
      <Box sx={{ position: 'relative' }}>
        <CardImage 
          src={event.image} 
          alt={event.title} 
          sx={{ height: 200 }}
        />
        
        <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1 }}>
          <Chip 
            label={event.tag} 
            color={event.tag === '워크샵' ? 'primary' : 'secondary'} 
            size="small" 
            sx={{ fontWeight: 'bold' }}
          />
          
          {event.isHot && (
            <Chip 
              label="HOT" 
              color="error" 
              size="small" 
              sx={{ fontWeight: 'bold' }}
            />
          )}
        </Box>
      </Box>
      
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="h3" gutterBottom>{event.title}</Typography>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          {event.description}
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Calendar size={16} color={PALETTE_COLORS.LIGHT_GRAY} />
            <Typography variant="body2">{event.date}</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Clock size={16} color={PALETTE_COLORS.LIGHT_GRAY} />
            <Typography variant="body2">{event.time}</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tag size={16} color={PALETTE_COLORS.LIGHT_GRAY} />
            <Typography variant="body2">{event.price}</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {event.isOnline ? 
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip label="온라인" size="small" sx={{ backgroundColor: '#E3F2FD', color: PALETTE_COLORS.BLUE }} />
              </Box> :
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip label="오프라인" size="small" sx={{ backgroundColor: '#FFF8E1', color: PALETTE_COLORS.YELLOW }} />
              </Box>
            }
            <Typography variant="body2">{event.location}</Typography>
          </Box>
        </Box>
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="text" 
            color="inherit"
            endIcon={<ArrowRight size={16} />}
            component={motion.button}
            whileHover={{ x: 5 }}
            sx={{ fontWeight: 'medium' }}
          >
            자세히 보기
          </Button>
        </Box>
      </Box>
    </ContentCard>
  );
};

const EventContent = () => {
  return (
    <MenuContentContainer
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      exit={{ opacity: 0 }}
    >
      <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
        이벤트 & 할인 정보
      </Typography>
      
      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} md={6} key={event.id}>
            <EventCard event={event} />
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ 
        mt: 4, 
        p: 3, 
        bgcolor: `${PALETTE_COLORS.LIGHT_GRAY}40`, 
        borderRadius: 2,
        textAlign: 'center',
        maxWidth: 700,
        mx: 'auto'
      }}>
        <Typography variant="h6" gutterBottom>이벤트 알림 받기</Typography>
        <Typography variant="body2" paragraph>
          새로운 이벤트, 워크샵, 할인 정보를 놓치지 마세요! 알림 신청하면 가장 먼저 소식을 받아볼 수 있습니다.
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          component={motion.button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          알림 신청하기
        </Button>
      </Box>
    </MenuContentContainer>
  );
};

export default EventContent; 