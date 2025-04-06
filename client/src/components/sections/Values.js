import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import StyleIcon from '@mui/icons-material/Style';
import GroupsIcon from '@mui/icons-material/Groups';

const ValueItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: 30,
  opacity: 0,
  transform: 'translateX(-20px)',
  animation: 'valueItemFadeIn 0.6s ease forwards',
}));

const ValueIcon = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  flexShrink: 0,
  marginRight: 20,
  backgroundColor: 'rgba(135, 206, 235, 0.2)',
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: theme.palette.primary.main,
}));

const Values = () => {
  const values = [
    {
      icon: <ColorLensIcon />,
      title: '색, 세상을 보는 다양한 창',
      description: '우리는 색을 인지하는 방식이 저마다 다르다는 것을 존중합니다. 색각 이상은 "틀림"이 아닌 "다름"이며, 세상을 더욱 풍부하게 만드는 다양성의 한 부분입니다.',
    },
    {
      icon: <StyleIcon />,
      title: '패션, 경계를 넘어서',
      description: '패션은 누구나 즐길 수 있는 자기 표현의 언어입니다. 색상의 제약 없이 자신만의 스타일을 찾고, 서로에게 영감을 주며 소통하는 커뮤니티를 지향합니다.',
    },
    {
      icon: <GroupsIcon />,
      title: '공감과 정보의 교류',
      description: '색각 이상 사용자들의 경험을 공유하고, 패션 선택에 도움이 되는 실질적인 정보를 나누며, 서로에게 힘이 되는 따뜻한 공간을 만들어갑니다.',
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
        우리의 가치관
      </Typography>
      <Grid container spacing={3}>
        {values.map((value, index) => (
          <Grid item xs={12} key={index}>
            <ValueItem sx={{ animationDelay: `${0.2 * (index + 1)}s` }}>
              <ValueIcon>
                {value.icon}
              </ValueIcon>
              <Box>
                <Typography variant="h6" gutterBottom sx={{ 
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  color: '#333',
                  marginBottom: '8px'
                }}>
                  {value.title}
                </Typography>
                <Typography variant="body1" sx={{ 
                  fontSize: '0.95rem',
                  color: '#777',
                  lineHeight: 1.6
                }}>
                  {value.description}
                </Typography>
              </Box>
            </ValueItem>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Values; 