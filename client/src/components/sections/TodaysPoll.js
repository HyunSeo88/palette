import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  RadioGroup, 
  FormControlLabel, 
  Radio,
  Button,
  LinearProgress,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import PeopleIcon from '@mui/icons-material/People';

const PollCard = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  borderRadius: 18,
  padding: 24,
  boxShadow: '0 5px 20px rgba(0,0,0,0.07)',
}));

const ProgressBar = styled(LinearProgress)(({ theme, color }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: '#f0f0f0',
  '& .MuiLinearProgress-bar': {
    backgroundColor: color || theme.palette.primary.main,
  },
}));

const VoteButton = styled(Button)(({ theme }) => ({
  marginTop: 20,
  borderRadius: 25,
  padding: '10px 24px',
}));

const TodaysPoll = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  
  const pollData = {
    question: '오늘의 패션 컬러 조합',
    totalVotes: 234,
    options: [
      {
        id: '1',
        text: '네이비 & 화이트',
        votes: 98,
        color: '#1976d2'
      },
      {
        id: '2',
        text: '베이지 & 브라운',
        votes: 76,
        color: '#8B4513'
      },
      {
        id: '3',
        text: '올리브 & 크림',
        votes: 60,
        color: '#556B2F'
      }
    ]
  };

  const handleVote = () => {
    if (selectedOption) {
      setHasVoted(true);
    }
  };

  const calculatePercentage = (votes) => {
    return Math.round((votes / pollData.totalVotes) * 100);
  };

  return (
    <Box>
      <Typography variant="h3" gutterBottom sx={{ 
        fontSize: '1.8rem', 
        fontWeight: 600, 
        color: '#333',
        marginBottom: '25px',
        borderBottom: '1px solid #eee',
        paddingBottom: '15px',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <HowToVoteIcon sx={{ fontSize: '1.8rem' }} />
        오늘의 투표
      </Typography>
      <PollCard>
        <Typography variant="h6" gutterBottom sx={{ 
          fontSize: '1.2rem',
          fontWeight: 600,
          color: '#333',
          marginBottom: '20px'
        }}>
          {pollData.question}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 3 }}>
          <PeopleIcon sx={{ fontSize: '1.1rem', color: '#666' }} />
          <Typography variant="body2" color="text.secondary">
            {pollData.totalVotes}명 참여
          </Typography>
        </Box>

        {!hasVoted ? (
          <RadioGroup
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            {pollData.options.map((option) => (
              <FormControlLabel
                key={option.id}
                value={option.id}
                control={<Radio />}
                label={option.text}
                sx={{ marginBottom: 1 }}
              />
            ))}
          </RadioGroup>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {pollData.options.map((option) => (
              <Box key={option.id}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 1
                }}>
                  <Typography variant="body2">
                    {option.text}
                  </Typography>
                  <Chip 
                    label={`${calculatePercentage(option.votes)}%`}
                    size="small"
                    sx={{ 
                      backgroundColor: option.color,
                      color: '#fff',
                      fontWeight: 500
                    }}
                  />
                </Box>
                <ProgressBar
                  variant="determinate"
                  value={calculatePercentage(option.votes)}
                  color={option.color}
                />
              </Box>
            ))}
          </Box>
        )}

        {!hasVoted && (
          <VoteButton
            variant="contained"
            fullWidth
            onClick={handleVote}
            disabled={!selectedOption}
          >
            투표하기
          </VoteButton>
        )}
      </PollCard>
    </Box>
  );
};

export default TodaysPoll; 