import React, { useState } from 'react';
import { Typography, Box, Button, LinearProgress, Radio, RadioGroup, FormControlLabel, FormControl, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { HelpCircle, BarChart2, Users, Check } from 'react-feather';
import { ContentCard, MenuContentContainer, VoteContainer, VoteOption } from '../MainLayout.styles';
import { PALETTE_COLORS } from '../MainLayout.constants';

const poll = {
  id: 1,
  question: '여름에 선호하는 컬러 조합은 무엇인가요?',
  description: '여름에 입기 좋은 컬러 조합에 투표해주세요. 색각이상자를 위한 패션 가이드에 반영될 예정입니다.',
  options: [
    { id: 'a', text: '파스텔 블루 & 화이트', votes: 423, icon: '🔵' },
    { id: 'b', text: '네이비 & 라이트 그레이', votes: 318, icon: '🌊' },
    { id: 'c', text: '옐로우 & 다크 블루', votes: 265, icon: '🟡' },
    { id: 'd', text: '핑크 & 베이지', votes: 184, icon: '🌸' }
  ],
  totalVotes: 1190,
  endTime: '23시간 후 마감',
  participants: 1190
};

const getProgressColor = (optionId) => {
  switch(optionId) {
    case 'a': return PALETTE_COLORS.BLUE;
    case 'b': return PALETTE_COLORS.GRAY;
    case 'c': return PALETTE_COLORS.YELLOW;
    case 'd': return PALETTE_COLORS.RED;
    default: return PALETTE_COLORS.BLUE;
  }
};

const getPercentage = (votes, total) => {
  return Math.round((votes / total) * 100);
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4 }
  }
};

const PollContent = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = () => {
    if (selectedOption) {
      setHasVoted(true);
    }
  };

  return (
    <MenuContentContainer
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      exit={{ opacity: 0 }}
    >
      <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ mb: 2 }}>
        오늘의 투표
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 4 }}>
        <Users size={18} />
        <Typography variant="body2" color="text.secondary">
          {poll.participants}명 참여 중
        </Typography>
        <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
        <HelpCircle size={18} />
        <Typography variant="body2" color="text.secondary">
          {poll.endTime}
        </Typography>
      </Box>
      
      <ContentCard component={motion.div} variants={itemVariants} sx={{ maxWidth: 600, mx: 'auto' }}>
        <Typography variant="h6" component="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HelpCircle size={20} color={PALETTE_COLORS.GRAY} />
          {poll.question}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          {poll.description}
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        {!hasVoted ? (
          <FormControl component="fieldset" sx={{ width: '100%' }}>
            <RadioGroup
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              {poll.options.map((option) => (
                <FormControlLabel
                  key={option.id}
                  value={option.id}
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body1">{option.text}</Typography>
                      <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>{option.icon}</Typography>
                    </Box>
                  }
                  sx={{ 
                    mb: 1.5, 
                    p: 1, 
                    borderRadius: 1,
                    transition: 'background-color 0.2s',
                    '&:hover': { backgroundColor: 'action.hover' }
                  }}
                />
              ))}
            </RadioGroup>
            
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleVote}
                disabled={!selectedOption}
                startIcon={<Check size={16} />}
                component={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                sx={{ minWidth: 120 }}
              >
                투표하기
              </Button>
            </Box>
          </FormControl>
        ) : (
          <VoteContainer>
            <Typography variant="subtitle1" gutterBottom>
              투표 결과 (총 {poll.totalVotes}표)
            </Typography>
            
            {poll.options.map((option) => {
              const percentage = getPercentage(option.votes, poll.totalVotes);
              const isSelected = option.id === selectedOption;
              
              return (
                <Box key={option.id} sx={{ mb: 2 }}>
                  <VoteOption isSelected={isSelected}>
                    <Box sx={{ mr: 1, fontSize: '1.2rem' }}>{option.icon}</Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">{option.text}</Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {percentage}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: `${getProgressColor(option.id)}20`,
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getProgressColor(option.id),
                            borderRadius: 5,
                          }
                        }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {option.votes}표
                      </Typography>
                    </Box>
                  </VoteOption>
                </Box>
              );
            })}
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<BarChart2 size={16} />}
                component={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                결과 분석 보기
              </Button>
            </Box>
          </VoteContainer>
        )}
      </ContentCard>
      
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button 
          variant="text"
          color="inherit"
          component={motion.button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          더 많은 투표 참여하기
        </Button>
      </Box>
    </MenuContentContainer>
  );
};

export default PollContent; 