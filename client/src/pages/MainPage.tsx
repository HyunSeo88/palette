import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Container, Paper, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

// TODO: Define actual types for Post, OOTD, Poll, User based on project types
interface Post {
  id: string;
  category?: string;
  title: string;
  content: string;
  user: string;
  likes: number;
  comments: number;
  imageUrl?: string; // For OOTD
  avatarUrl?: string; // For OOTD user
  date?: string; // For OOTD
}

interface Poll {
  id: string;
  question: string;
  options: { text: string; percentage: number }[];
}

const sectionData = [
  { id: 'section-about-us', title: 'About Us', dataColor: '#005A9C', contentKey: 'aboutUs' },
  { id: 'section-hot-posts', title: 'Hot 게시물 🔥', dataColor: '#ff5733', contentKey: 'hotPosts' },
  { id: 'section-best-ootd', title: 'BEST OOTD 🏆', dataColor: '#FFC107', contentKey: 'bestOotd' },
  { id: 'section-weekly-poll', title: '주간 투표 Best 📊', dataColor: '#747272', contentKey: 'weeklyPoll' },
  { id: 'section-event-discount', title: '할인 / 이벤트 🎉', dataColor: '#FFFFFF', contentKey: 'eventDiscount' },
];

// Apple 스타일 컴포넌트들
const PageContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '100vh',
  overflow: 'hidden',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
});

const Section = styled(Box)<{ active: boolean; bgColor: string }>(({ active, bgColor }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  top: 0,
  left: 0,
  opacity: active ? 1 : 0,
  visibility: active ? 'visible' : 'hidden',
  transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  background: bgColor === '#FFFFFF' 
    ? 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    : bgColor === '#005A9C'
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    : bgColor === '#ff5733'
    ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)'
    : bgColor === '#FFC107'
    ? 'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)'
    : 'linear-gradient(135deg, #636e72 0%, #2d3436 100%)',
  color: bgColor === '#FFFFFF' || bgColor === '#FFC107' ? '#1d1d1f' : '#ffffff',
  padding: '40px 20px',
  boxSizing: 'border-box',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.1) 0%, transparent 50%)',
    pointerEvents: 'none',
  }
}));

const AppleContainer = styled(Container)({
  textAlign: 'center',
  position: 'relative',
  zIndex: 2,
});

const AppleTitle = styled(Typography)({
  fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
  fontWeight: 700,
  marginBottom: '2rem',
  color: 'inherit',
  letterSpacing: '-0.02em',
  lineHeight: 1.1,
  fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
});

const AppleSubtitle = styled(Typography)({
  fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
  fontWeight: 400,
  color: 'inherit',
  opacity: 0.8,
  lineHeight: 1.5,
  maxWidth: '800px',
  margin: '0 auto',
  fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
});

const GlassCard = styled(Paper)({
  background: 'rgba(255, 255, 255, 0.15)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '20px',
  padding: '2rem',
  transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  '&:hover': {
    transform: 'translateY(-5px)',
    background: 'rgba(255, 255, 255, 0.25)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  }
});

const HotPostCard = styled(GlassCard)({
  textAlign: 'left',
  background: 'rgba(255, 255, 255, 0.95)',
  color: '#1d1d1f',
  '&:hover': {
    background: 'rgba(255, 255, 255, 1)',
  }
});

const NavDotsContainer = styled(Box)({
  position: 'fixed',
  right: '40px',
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  zIndex: 100,
});

const NavDot = styled(Box)<{ active: boolean }>(({ active }) => ({
  width: active ? '24px' : '12px',
  height: '12px',
  backgroundColor: active ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.4)',
  borderRadius: '6px',
        cursor: 'pointer',
  transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
        '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    transform: 'scale(1.1)',
    }
}));

const PollOption = styled(Box)({
  padding: '1rem 1.5rem',
  marginBottom: '0.75rem',
  background: 'rgba(255, 255, 255, 0.2)',
  borderRadius: '12px',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  fontWeight: 500,
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.3)',
    transform: 'translateX(5px)',
  }
});

const MainPage: React.FC = () => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const AUTO_SCROLL_DELAY = 6000; // Apple style: 조금 더 여유롭게

  // --- Mock data for dynamic content ---
  const [hotPosts] = useState<Post[]>([
    { id: '1', category: '코디 질문', title: '이 민트색 셔츠, 어떤 바지와 어울릴까요?', content: '색 구분이 어려워서 그런데, 이 민트색 셔츠에 어울리는 바지 색 추천해주세요!', user: '패션초보', likes: 85, comments: 5 },
    { id: '2', category: '정보 공유', title: '색 보정 앱, 실제로 써보니 어때요?', content: '최근 출시된 색 보정 앱 사용 후기 공유합니다.', user: '앱테스터', likes: 153, comments: 12 },
  ]);

  const [bestOotd] = useState<Post | null>({
    id: 'ootd1', 
    title: '화사한 봄날의 피크닉룩! 옐로우 포인트가 마음에 들어요 🌼', 
    user: '스타일퀸', 
    likes: 310, 
    comments: 25, 
    imageUrl: 'https://placehold.co/300x400/f5f5f7/86868b?text=OOTD', 
    avatarUrl: 'https://placehold.co/50x50/007aff/ffffff?text=User', 
    date: '2일 전', 
    content: '화사한 봄날의 피크닉룩!'
  });

  const [weeklyPoll] = useState<Poll | null>({
    id: 'poll1', 
    question: '봄에 가장 선호하는 아우터 스타일은?', 
    options: [
      { text: '트렌치 코트', percentage: 45 }, 
      { text: '데님 자켓', percentage: 30 }, 
      { text: '가디건', percentage: 15 }, 
      { text: '블레이저', percentage: 10 }
    ]
  });

  const updateSection = (newIndex: number, isManualNav = false) => {
    setCurrentSectionIndex(newIndex);
    if (isManualNav) {
      resetAutoScroll();
    }
  };

  const goToSection = (index: number) => {
    if (index >= 0 && index < sectionData.length && index !== currentSectionIndex) {
      updateSection(index, true);
    }
  };

  const startAutoScroll = () => {
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
    }
    autoScrollIntervalRef.current = setInterval(() => {
      setCurrentSectionIndex(prevIndex => (prevIndex + 1) % sectionData.length);
    }, AUTO_SCROLL_DELAY);
  };

  const resetAutoScroll = () => {
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
    }
    startAutoScroll();
  };

  useEffect(() => {
    updateSection(0, true);
    startAutoScroll();

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, []);

  const renderSectionContent = (section: typeof sectionData[0]) => {
    return (
      <AppleContainer maxWidth="lg">
        <AppleTitle variant="h1">
            {section.title}
        </AppleTitle>

        {section.contentKey === 'aboutUs' && (
          <AppleSubtitle>
            Palette는 모든 색각 사용자를 위한 패션 커뮤니티입니다. 우리는 색을 다르게 인식하는 사람들이 패션 정보를 더 쉽게 접근하고, 자신감을 가지고 스타일을 탐색하며, 서로 소통하고 지지할 수 있는 포용적인 환경을 만듭니다.
          </AppleSubtitle>
        )}

        {section.contentKey === 'hotPosts' && (
          <div>
            <AppleSubtitle sx={{ mb: 6 }}>
              지금 Palette에서 가장 뜨거운 반응을 얻고 있는 게시물들을 확인해보세요!
            </AppleSubtitle>
            <Grid container spacing={4} justifyContent="center">
              {hotPosts.map((post) => (
                <Grid item xs={12} sm={6} md={5} key={post.id}>
                  <HotPostCard>
                    <Typography variant="body2" sx={{ color: '#ff5733', fontWeight: 600, mb: 1.5, fontSize: '0.9rem' }}>
                      {post.category}
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 1.5, color: '#1d1d1f', fontWeight: 600, lineHeight: 1.3 }}>
                      {post.title}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: '#86868b', lineHeight: 1.5 }}>
                      {post.content}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#86868b', fontSize: '0.85rem' }}>
                      {post.user} • 👍 {post.likes} • 💬 {post.comments}
                    </Typography>
                  </HotPostCard>
                </Grid>
              ))}
            </Grid>
          </div>
        )}

        {section.contentKey === 'bestOotd' && bestOotd && (
          <div>
            <AppleSubtitle sx={{ mb: 6 }}>
              이번 주 회원들이 뽑은 최고의 OOTD를 만나보세요!
            </AppleSubtitle>
            <GlassCard sx={{ maxWidth: '400px', mx: 'auto' }}>
              <img 
                src={bestOotd.imageUrl} 
                alt="OOTD" 
                style={{ 
                  width: '100%', 
                  borderRadius: '16px', 
                  marginBottom: '20px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <img 
                  src={bestOotd.avatarUrl} 
                  alt="User" 
                  style={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: '50%', 
                    marginRight: 16,
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }} 
                />
                <div>
                  <Typography sx={{ fontWeight: 600, color: 'inherit', fontSize: '1rem' }}>
                    {bestOotd.user}
                  </Typography>
                  <Typography sx={{ fontSize: '0.85rem', opacity: 0.7 }}>
                    {bestOotd.date}
                  </Typography>
                </div>
              </Box>
              <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.5 }}>
                {bestOotd.content}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.9rem' }}>
                👍 {bestOotd.likes} • 💬 {bestOotd.comments}
              </Typography>
            </GlassCard>
          </div>
        )}

        {section.contentKey === 'weeklyPoll' && weeklyPoll && (
          <div>
            <AppleSubtitle sx={{ mb: 6 }}>
              매주 진행되는 다양한 패션 주제의 투표에 참여하고 결과를 확인하세요.
            </AppleSubtitle>
            <GlassCard sx={{ maxWidth: '600px', mx: 'auto' }}>
              <Typography variant="h4" sx={{ mb: 4, fontWeight: 600, lineHeight: 1.3 }}>
                {weeklyPoll.question}
              </Typography>
              {weeklyPoll.options.map((option) => (
                <PollOption key={option.text}>
                  {option.text} ({option.percentage}%)
                </PollOption>
              ))}
            </GlassCard>
          </div>
        )}

        {section.contentKey === 'eventDiscount' && (
          <AppleSubtitle>
            Palette 회원들만을 위한 특별한 할인 정보와 풍성한 이벤트가 준비되어 있습니다. 놓치지 말고 참여하여 혜택을 누리세요!
          </AppleSubtitle>
        )}
      </AppleContainer>
    );
  };

  console.log('Current section:', currentSectionIndex, sectionData[currentSectionIndex].title);

  return (
    <PageContainer>
      {sectionData.map((sec, index) => (
        <Section
          key={sec.id}
          active={index === currentSectionIndex}
          bgColor={sec.dataColor}
        >
          {renderSectionContent(sec)}
        </Section>
      ))}
      
      <NavDotsContainer>
        {sectionData.map((sec, index) => (
          <NavDot
            key={`dot-${sec.id}`}
            active={index === currentSectionIndex}
            onClick={() => goToSection(index)}
          />
        ))}
      </NavDotsContainer>
    </PageContainer>
  );
};

export default MainPage; 