import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Container, Button, Paper, Grid, IconButton, SvgIcon } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
// Placeholder for icons, replace with actual MUI icons or SVGs
// import MenuIcon from '@mui/icons-material/Menu';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import CloseIcon from '@mui/icons-material/Close';
// import ChevronRightIcon from '@mui/icons-material/ChevronRight';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import CommentIcon from '@mui/icons-material/Comment';

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

// Styled components (basic examples, to be refined)
const PageContainer = styled(Box)({
  position: 'relative',
  width: '100vw',
  height: '100vh', // Each section takes full viewport height initially
  overflow: 'hidden', // To manage section transitions
});

const Section = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'bgColor' && prop !== 'isBestOotd' && prop !== 'isEventDiscount',
})<{ active: boolean; bgColor: string; isBestOotd?: boolean; isEventDiscount?: boolean }>(({ theme, active, bgColor, isBestOotd, isEventDiscount }) => ({
  width: '100vw',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  top: 0,
  left: 0,
  opacity: active ? 1 : 0,
  visibility: active ? 'visible' : 'hidden',
  transition: 'opacity 0.7s ease-in-out, visibility 0.7s ease-in-out',
  paddingBottom: theme.spacing(2),
  // Default top padding: header height (assumed 4rem) + desired spacing (4rem) = 8rem
  // This will be applied to the content container within the section
  boxSizing: 'border-box',
  overflowY: 'auto',
  backgroundColor: bgColor,
  color: (isBestOotd || isEventDiscount) ? theme.palette.text.primary : '#FFFFFF', // Default to white text, adjust for specific sections

  [theme.breakpoints.down('md')]: {
    // paddingLeft: theme.spacing(2),
    // paddingRight: theme.spacing(2),
  },
}));

const SectionContentWrapper = styled(Container)(({ theme }) => ({
  paddingTop: `calc(${theme.spacing(8)} + ${theme.spacing(4)})`, // Header (64px) + 2rem margin (32px) = 96px. Reduced from 128px
  textAlign: 'center',
  maxHeight: '100%',
  overflowY: 'auto',
  [theme.breakpoints.down('md')]: {
    paddingTop: `calc(${theme.spacing(8)} + ${theme.spacing(4)})`, // Header + 2rem. Reduced from Header + 2.5rem
  },
}));

const BestOotdSectionContentWrapper = styled(SectionContentWrapper)(({ theme }) => ({
    paddingTop: `calc(${theme.spacing(8)} + ${theme.spacing(4)} + ${theme.spacing(2)})`, // Header (64px) + 2rem margin (32px) + 1rem extra (16px) = 112px. Reduced from 192px
    [theme.breakpoints.down('md')]: {
        paddingTop: `calc(${theme.spacing(8)} + ${theme.spacing(4)})`, // Header + 2rem. Reduced from Header + 2.5rem
    },
}));


const SectionTitleLink = styled(RouterLink)(({ theme }) => ({
  display: 'inline-block',
  textDecoration: 'none',
  '&:hover .section-title': {
    color: theme.palette.mode === 'dark' ? theme.palette.grey[400] : theme.palette.grey[200], // Example hover
  },
}));

const SectionTitle = styled(Typography, {
    shouldForwardProp: (prop) => prop !== 'isBestOotd' && prop !== 'isEventDiscount',
})<{ isBestOotd?: boolean; isEventDiscount?: boolean }>(({ theme, isBestOotd, isEventDiscount }) => ({
  fontSize: '2.5rem',
  fontWeight: 800,
  marginBottom: theme.spacing(3), // 1.5rem
  textAlign: 'center',
  color: (isBestOotd || isEventDiscount) ? theme.palette.text.primary : '#FFFFFF',
  transition: 'color 0.3s ease',
  [theme.breakpoints.down('md')]: {
    fontSize: '2rem',
  },
  // Specific hover logic needs to be handled by parent or direct style override if color depends on section
}));


const SectionTextContent = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isBestOotd' && prop !== 'isEventDiscount',
})<{ isBestOotd?: boolean; isEventDiscount?: boolean }>(({ theme, isBestOotd, isEventDiscount }) => ({
  fontSize: '1.125rem',
  color: (isBestOotd || isEventDiscount) ? theme.palette.text.secondary : '#f0f0f0',
  maxWidth: '800px',
  textAlign: 'center',
  lineHeight: 1.6,
  marginLeft: 'auto',
  marginRight: 'auto',
  [theme.breakpoints.down('md')]: {
    fontSize: '1rem',
  },
}));

const NavDotsContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  right: 30,
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
  zIndex: 10,
  [theme.breakpoints.down('md')]: {
    right: 15,
    gap: '10px',
  },
}));

const NavDot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'sectionColor',
})<{ active: boolean; sectionColor?: string }>(({ theme, active, sectionColor }) => {
  const isLightSectionBg = sectionColor === '#FFFFFF' || sectionColor === '#FFC107';
  return {
    width: 12,
    height: 12,
    backgroundColor: active
      ? (isLightSectionBg ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 1)')
      : (isLightSectionBg ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.5)'),
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
    transform: active ? 'scale(1.3)' : 'scale(1)',
    [theme.breakpoints.down('md')]: {
      width: 10,
      height: 10,
    },
  };
});

// TODO: Implement ContentCard, PollCard using MUI Paper/Card and Grid
const ContentGrid = styled(Grid)(({ theme }) => ({
    marginTop: theme.spacing(3),
    maxWidth: '900px', // Max width from CSS
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
}));

const ContentCardStyled = styled(Paper, {
    shouldForwardProp: (prop) => prop !== 'isBestOotdCard',
})<{isBestOotdCard?: boolean}>(({ theme, isBestOotdCard }) => ({
    padding: theme.spacing(3), // 1.5rem
    textAlign: 'left',
    borderRadius: theme.shape.borderRadius * 1.5, // 0.75rem,
    backgroundColor: isBestOotdCard ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(5px)', // May need to be applied carefully for performance
    border: `1px solid ${isBestOotdCard ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)'}`,
    color: isBestOotdCard ? theme.palette.text.primary : '#FFFFFF',
    marginLeft: 'auto',
    marginRight: 'auto',

    '.content-card-title': {
        fontSize: '1.25rem',
        fontWeight: 600,
        marginBottom: theme.spacing(1),
        color: isBestOotdCard ? theme.palette.primary.main : undefined,
    },
    '.content-card-category': {
        fontSize: '0.875rem',
        fontWeight: 500,
        color: '#FFC107', // Keep original color for now
        marginBottom: theme.spacing(1),
        display: 'inline-block',
        padding: theme.spacing(0.5, 1),
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: theme.shape.borderRadius * 0.5,
    },
    '.content-card-user': {
        fontSize: '0.875rem',
        opacity: 0.8,
        marginTop: theme.spacing(2),
        color: isBestOotdCard ? '#555555' : undefined,
    },
    '.content-card-stats': {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
        fontSize: '0.875rem',
        opacity: 0.8,
        marginTop: theme.spacing(1.5),
        color: isBestOotdCard ? '#555555' : undefined,
        'svg': {
            width: '1rem',
            height: '1rem',
        }
    },
}));

const OotdImage = styled('img')(({ theme }) => ({
    width: '100%',
    maxWidth: '300px',
    height: 'auto',
    borderRadius: theme.shape.borderRadius, // 0.5rem
    margin: '0 auto 1rem auto',
    display: 'block',
    boxShadow: theme.shadows[3], // Example shadow
}));

const PollCardStyled = styled(Paper)(({ theme }) => ({
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: theme.shape.borderRadius * 1.5, // 0.75rem
    padding: theme.spacing(4), // 2rem
    maxWidth: '500px',
    width: '100%',
    marginTop: theme.spacing(3),
    backdropFilter: 'blur(5px)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#FFFFFF',
    marginLeft: 'auto',
    marginRight: 'auto',
    '.poll-question': {
        fontSize: '1.5rem',
        fontWeight: 600,
        marginBottom: theme.spacing(3),
    },
    '.poll-option': {
        display: 'block',
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: theme.spacing(1.5, 2.5), // 0.75rem 1.25rem
        borderRadius: theme.shape.borderRadius, // 0.5rem
        marginBottom: theme.spacing(1.5),
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.3)',
        }
    }
}));


const MainPage: React.FC = () => {
  const theme = useTheme();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const AUTO_SCROLL_DELAY = 4000; // Changed from 7000 to 4000 (4 seconds)

  // --- Mock data for dynamic content ---
  const [hotPosts, setHotPosts] = useState<Post[]>([
    { id: '1', category: '코디 질문', title: '이 민트색 셔츠, 어떤 바지와 어울릴까요?', content: '색 구분이 어려워서 그런데, 이 민트색 셔츠에 어울리는 바지 색 추천해주세요! (사진은 댓글에)', user: '패션초보', likes: 85, comments: 5 },
    { id: '2', category: '정보 공유', title: '색 보정 앱, 실제로 써보니 어때요?', content: '최근 출시된 색 보정 앱 사용 후기 공유합니다. 장단점 위주로 정리했어요.', user: '앱테스터', likes: 153, comments: 12 },
  ]);
  const [bestOotd, setBestOotd] = useState<Post | null>({
    id: 'ootd1', title: '화사한 봄날의 피크닉룩! 옐로우 포인트가 마음에 들어요 🌼', user: '스타일퀸', likes: 310, comments: 25, imageUrl: 'https://placehold.co/600x800/E0E0E0/333333?text=OOTD+Champion', avatarUrl: 'https://placehold.co/100x100/7AB8D4/FFFFFF?text=User', date: '2일 전', content: '화사한 봄날의 피크닉룩! 옐로우 포인트가 마음에 들어요 🌼'
  });
  const [weeklyPoll, setWeeklyPoll] = useState<Poll | null>({
    id: 'poll1', question: '봄에 가장 선호하는 아우터 스타일은?', options: [{ text: '트렌치 코트', percentage: 45 }, { text: '데님 자켓', percentage: 30 }, { text: '가디건', percentage: 15 }, { text: '블레이저', percentage: 10 }]
  });

  // TODO: Fetch actual data from API using services (e.g., post.service.ts) in useEffect

  const updateSection = (newIndex: number, isManualNav = false) => {
    setCurrentSectionIndex(newIndex);
    if (isManualNav) {
      resetAutoScroll();
    }
  };

  // goToSection function restored
  const goToSection = (index: number) => {
    if (index >= 0 && index < sectionData.length && index !== currentSectionIndex) {
      updateSection(index, true); // Ensure isManualNav is true
    }
  };

  const startAutoScroll = () => {
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
    }
    autoScrollIntervalRef.current = setInterval(() => {
      // Directly update currentSectionIndex using functional update to avoid stale closures
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
    // Initialize first section
    updateSection(0, true); // Mark as manual to trigger initial resetAutoScroll if needed
    startAutoScroll();

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount


  // Placeholder for Favorite and Comment icons
  const FavoriteIcon = () => <SvgIcon><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></SvgIcon>;
  const CommentIcon = () => <SvgIcon><path d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zm-4 0H9v2h2V9z" /></SvgIcon>;


  const renderSectionContent = (section: typeof sectionData[0]) => {
    const Wrapper = section.id === 'section-best-ootd' ? BestOotdSectionContentWrapper : SectionContentWrapper;
    const titleIsBestOotd = section.id === 'section-best-ootd';
    const titleIsEventDiscount = section.id === 'section-event-discount';

    return (
      <Wrapper maxWidth="lg">
        <SectionTitleLink to="#"> {/* TODO: Add actual links */}
          <SectionTitle variant="h1" className="section-title" isBestOotd={titleIsBestOotd} isEventDiscount={titleIsEventDiscount}>
            {section.title}
          </SectionTitle>
        </SectionTitleLink>

        {section.contentKey === 'aboutUs' && (
          <SectionTextContent isBestOotd={titleIsBestOotd} isEventDiscount={titleIsEventDiscount}>
            Palette는 모든 색각 사용자를 위한 패션 커뮤니티입니다. 우리는 색을 다르게 인식하는 사람들이 패션 정보를 더 쉽게 접근하고, 자신감을 가지고 스타일을 탐색하며, 서로 소통하고 지지할 수 있는 포용적인 환경을 만듭니다. Palette는 색상 제안, 코디 아이디어, 접근성 기능 및 활발한 커뮤니티 지원을 통해 모든 사람이 패션을 즐길 수 있도록 돕습니다.
          </SectionTextContent>
        )}

        {section.contentKey === 'hotPosts' && (
          <>
            <SectionTextContent sx={{ mb: 3 }} isBestOotd={titleIsBestOotd} isEventDiscount={titleIsEventDiscount}>
              지금 Palette에서 가장 뜨거운 반응을 얻고 있는 게시물들을 확인해보세요!
            </SectionTextContent>
            <ContentGrid container spacing={3} justifyContent="center">
              {hotPosts.map(post => (
                <Grid item xs={12} sm={6} md={5} key={post.id}>
                  <ContentCardStyled>
                    {post.category && <Typography className="content-card-category">{post.category}</Typography>}
                    <Typography variant="h6" className="content-card-title">{post.title}</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>{post.content}</Typography>
                    <Typography className="content-card-user">{post.user}</Typography>
                    <Box className="content-card-stats">
                      <FavoriteIcon /> {post.likes}
                      <CommentIcon /> {post.comments}
                    </Box>
                  </ContentCardStyled>
                </Grid>
              ))}
            </ContentGrid>
          </>
        )}

        {section.contentKey === 'bestOotd' && bestOotd && (
          <>
            <SectionTextContent sx={{ mb: 3 }} isBestOotd={titleIsBestOotd} isEventDiscount={titleIsEventDiscount}>
              이번 주 회원들이 뽑은 최고의 OOTD를 만나보세요!
            </SectionTextContent>
            <ContentCardStyled sx={{ maxWidth: '24rem', mx: 'auto' }} isBestOotdCard> {/* Approx 384px (max-w-sm) */}
              <OotdImage src={bestOotd.imageUrl} alt="베스트 OOTD 이미지" />
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <img src={bestOotd.avatarUrl} alt="유저 아바타" style={{ width: 40, height: 40, borderRadius: '50%', marginRight: theme.spacing(1.5) }}/>
                <Box>
                  <Typography sx={{ fontWeight: 'semibold', color: 'text.primary' }}>{bestOotd.user}</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{bestOotd.date}</Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ mb: 1.5 }}>{bestOotd.content}</Typography>
              <Box className="content-card-stats" sx={{ justifyContent: 'center' }}>
                <FavoriteIcon /> {bestOotd.likes}
                <CommentIcon /> {bestOotd.comments}
              </Box>
            </ContentCardStyled>
          </>
        )}

        {section.contentKey === 'weeklyPoll' && weeklyPoll && (
          <>
            <SectionTextContent sx={{ mb: 3 }} isBestOotd={titleIsBestOotd} isEventDiscount={titleIsEventDiscount}>
              매주 진행되는 다양한 패션 주제의 투표에 참여하고 결과를 확인하세요.
            </SectionTextContent>
            <PollCardStyled>
              <Typography className="poll-question">{weeklyPoll.question}</Typography>
              {weeklyPoll.options.map(option => (
                <Typography key={option.text} className="poll-option">
                  {option.text} ({option.percentage}%)
                </Typography>
              ))}
            </PollCardStyled>
          </>
        )}

        {section.contentKey === 'eventDiscount' && (
          <SectionTextContent isBestOotd={titleIsBestOotd} isEventDiscount={titleIsEventDiscount}>
            Palette 회원들만을 위한 특별한 할인 정보와 풍성한 이벤트가 준비되어 있습니다. 놓치지 말고 참여하여 혜택을 누리세요!
          </SectionTextContent>
        )}
      </Wrapper>
    );
  };


  return (
    <PageContainer>
      {sectionData.map((sec, index) => (
        <Section
          key={sec.id}
          id={sec.id}
          active={index === currentSectionIndex}
          bgColor={sec.dataColor}
          isBestOotd={sec.id === 'section-best-ootd'}
          isEventDiscount={sec.id === 'section-event-discount'}
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
            sectionColor={sectionData[currentSectionIndex].dataColor}
          />
        ))}
      </NavDotsContainer>
    </PageContainer>
  );
};

export default MainPage; 