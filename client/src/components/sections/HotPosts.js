import React from 'react';
import { Box, Typography, Grid, Paper, Chip, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

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
  color: '#fff',
  fontWeight: 500,
  marginBottom: 12,
  borderRadius: 8,
}));

const HotPosts = () => {
  const posts = [
    {
      tag: '정보',
      tagColor: '#FF6347',
      title: '색 보정 앱, 실제로 써보니 어때요?',
      content: '최근 출시된 색 보정 앱 사용 후기 공유합니다. 장단점 위주로...',
      author: '앱테스터',
      likes: 15,
      comments: 3,
    },
    {
      tag: '코디 질문',
      tagColor: '#87CEEB',
      title: '이 셔츠, 무슨 색 바지와 어울릴까요?',
      content: '색 구분이 어려워서 그런데, 이 민트색 셔츠에 어울리는 바지 색 추천해주세요! (사진은 댓글에)',
      author: '패션초보',
      likes: 8,
      comments: 5,
    },
    {
      tag: '일상',
      tagColor: '#FFDA63',
      title: '무채색 코디 장인 계신가요?',
      content: '요즘 무채색 코디에 푹 빠졌는데, 팁이나 예쁜 아이템 공유해요!',
      author: '모노톤러버',
      likes: 22,
      comments: 7,
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
        Hot 게시물
      </Typography>
      <Grid container spacing={3}>
        {posts.map((post, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card>
              <CardTag label={post.tag} color="primary" sx={{ backgroundColor: post.tagColor }} />
              <Typography variant="h6" gutterBottom sx={{ 
                fontSize: '1.15rem',
                fontWeight: 600,
                color: '#333',
                marginBottom: '8px',
                lineHeight: 1.4
              }}>
                {post.title}
              </Typography>
              <Typography variant="body2" sx={{ 
                fontSize: '0.9rem',
                color: '#777',
                lineHeight: 1.6,
                flexGrow: 1,
                marginBottom: '20px'
              }}>
                {post.content}
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
                    {post.author}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <FavoriteIcon sx={{ fontSize: 16, color: '#777' }} />
                    <Typography variant="body2" color="text.secondary">
                      {post.likes}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <ChatBubbleOutlineIcon sx={{ fontSize: 16, color: '#777' }} />
                    <Typography variant="body2" color="text.secondary">
                      {post.comments}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HotPosts; 