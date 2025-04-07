import React from 'react';
import { Typography, Box, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { Sun, Users, Heart, Globe } from 'react-feather';
import { ContentCard, MenuContentContainer } from '../MainLayout.styles';
import { PALETTE_COLORS } from '../MainLayout.constants';

const values = [
  {
    id: 1,
    title: '색의 다양성 존중',
    icon: <Sun size={32} color={PALETTE_COLORS.BLUE} />,
    description: '모든 사람이 색을 다르게 인지하고 경험한다는 것을 이해하고 존중합니다. 색각이상자와 일반인 모두가 편안하게 이용할 수 있는 환경을 만들고자 합니다.'
  },
  {
    id: 2,
    title: '포용적 커뮤니티',
    icon: <Users size={32} color={PALETTE_COLORS.RED} />,
    description: '모든 사용자가 소속감을 느끼고 참여할 수 있는 열린 공간을 지향합니다. 다양한 의견과 스타일을 존중하고 서로 배우는 문화를 만들어 갑니다.'
  },
  {
    id: 3,
    title: '자기표현의 자유',
    icon: <Heart size={32} color={PALETTE_COLORS.YELLOW} />,
    description: '패션은 자신을 표현하는 강력한 수단입니다. 모든 사용자가 자신만의 독특한 스타일을 자유롭게 표현하고 공유할 수 있도록 지원합니다.'
  },
  {
    id: 4,
    title: '지속가능한 패션',
    icon: <Globe size={32} color={PALETTE_COLORS.GRAY} />,
    description: '환경을 생각하는 지속가능한 패션 문화를 장려합니다. 의류의 재활용, 업사이클링, 윤리적 소비에 대한 정보를 공유하고 실천합니다.'
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
    transition: { duration: 0.5 }
  }
};

const ValuesContent = () => {
  return (
    <MenuContentContainer
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      exit={{ opacity: 0 }}
    >
      <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ mb: 3 }}>
        우리의 가치관
      </Typography>
      
      <Typography variant="body1" paragraph align="center" sx={{ mb: 4 }}>
        Palette 커뮤니티는 다음과 같은 핵심 가치를 추구합니다. 이러한 가치는 우리의 모든 콘텐츠와 활동의 기반이 됩니다.
      </Typography>
      
      <Grid container spacing={3}>
        {values.map((value) => (
          <Grid item xs={12} md={6} key={value.id}>
            <ContentCard component={motion.div} variants={itemVariants}>
              <Box display="flex" alignItems="center" gap={2}>
                <Box sx={{ 
                  p: 1.5, 
                  borderRadius: '50%', 
                  backgroundColor: `${PALETTE_COLORS.BLUE}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {value.icon}
                </Box>
                <Typography variant="h6" component="h3">{value.title}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">{value.description}</Typography>
            </ContentCard>
          </Grid>
        ))}
      </Grid>
    </MenuContentContainer>
  );
};

export default ValuesContent; 