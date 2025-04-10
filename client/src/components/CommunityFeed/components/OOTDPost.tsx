import React from 'react';
import { Typography } from '@mui/material';
import { 
  OOTDImageContainer,
  OOTDImage,
  OOTDLabel 
} from '../../MainLayout/MainLayout.styles';
import { 
  OOTDCard,
  OOTDContent,
  OOTDFooter 
} from './OOTDPost.styles';
import PostMetrics from './PostMetrics';
import AuthorInfo from './AuthorInfo';

interface OOTDPostProps {
  image?: string;
  label?: string;
  title?: string;
  author?: {
    name: string;
    avatar: string;
  };
  metrics?: {
    likes: number;
    comments: number;
  };
}

const OOTDPost: React.FC<OOTDPostProps> = ({
  image = 'https://source.unsplash.com/random/400x400?fashion',
  label = 'OOTD',
  title = '오늘의 코디',
  author = { name: '팔레트', avatar: 'https://source.unsplash.com/random/40x40?portrait' },
  metrics = { likes: 42, comments: 7 }
}) => {
  return (
    <OOTDCard>
      <OOTDImageContainer>
        <OOTDImage src={image} alt={title} />
        <OOTDLabel>{label}</OOTDLabel>
      </OOTDImageContainer>
      <OOTDContent>
        <AuthorInfo author={author.name} avatar={author.avatar} />
        <Typography variant="h6" sx={{ mt: 1 }}>
          {title}
        </Typography>
      </OOTDContent>
      <OOTDFooter>
        <PostMetrics likes={metrics.likes} comments={metrics.comments} />
      </OOTDFooter>
    </OOTDCard>
  );
};

export default OOTDPost; 