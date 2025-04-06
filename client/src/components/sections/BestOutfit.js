import React from 'react';
import { Box, Typography, Grid, Paper, Chip, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';

const Card = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  borderRadius: 18,
  padding: 20,
  boxShadow: '0 5px 20px rgba(0,0,0,0.07)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-6px)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  },
}));

const CardTag = styled(Chip)(({ theme, color }) => ({
  backgroundColor: color || theme.palette.primary.main,
  color: color === '#FFDA63' ? '#333' : '#fff',
  fontWeight: 500,
  marginBottom: 12,
  borderRadius: 8,
}));

const ImagePlaceholder = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 200,
  backgroundColor: '#f5f5f5',
  borderRadius: 8,
  marginBottom: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#999',
}));

const BestOutfit = () => {
  const outfits = [
    {
      tag: 'Best',
      tagColor: '#FFDA63',
      title: '시원한 여름, 마린룩 코디',
      content: '파란색 스트라이프 티셔츠와 흰색 반바지로 시원함을 더했어요. 색 구분이 쉬운 조합!',
      author: '코디 장인',
      likes: 58,
      imageUrl: null,
    },
    {
      tag: '후보',
      tagColor: '#87CEEB',
      title: '톤온톤 베이지 코디',
      content: '베이지색 린넨 셔츠와 면바지로 부드러운 느낌을 연출했어요.',
      author: '베이지러버',
      likes: 31,
      imageUrl: null,
    },
  ];

  return (
    <Box>
      <Typography variant="h3" gutterBottom sx={{ 
        fontSize: '1.8rem', 
        fontWeight: 600, 
        color: '#333',
        marginBottom: '25px',
        borderBottom: '1px solid #eee',
        paddingBottom: '15px'
      }}>
        오늘의 Best 코디
      </Typography>
      <Grid container spacing={3}>
        {outfits.map((outfit, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card>
              <CardTag 
                icon={outfit.tag === 'Best' ? <StarIcon /> : undefined}
                label={outfit.tag} 
                color="primary" 
                sx={{ backgroundColor: outfit.tagColor }}
              />
              <ImagePlaceholder>
                이미지 준비중
              </ImagePlaceholder>
              <Typography variant="h6" gutterBottom sx={{ 
                fontSize: '1.15rem',
                fontWeight: 600,
                color: '#333',
                marginBottom: '8px',
                lineHeight: 1.4
              }}>
                {outfit.title}
              </Typography>
              <Typography variant="body2" sx={{ 
                fontSize: '0.9rem',
                color: '#777',
                lineHeight: 1.6,
                flexGrow: 1,
                marginBottom: '20px'
              }}>
                {outfit.content}
              </Typography>
              <Box sx={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '15px',
                borderTop: '1px solid #f0f0f0'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ width: 28, height: 28, marginRight: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {outfit.author}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <FavoriteIcon sx={{ fontSize: 16, color: '#777' }} />
                  <Typography variant="body2" color="text.secondary">
                    {outfit.likes}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BestOutfit; 