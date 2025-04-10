import { memo } from 'react';
import { Typography } from '@mui/material';
import { OOTDCard, OOTDContent, OOTDFooter, OOTDImage } from './OOTDPost.styles';
import { DEFAULT_OOTD_POST } from '../../../constants/community';
import AuthorInfo from './AuthorInfo';
import PostMetrics from './PostMetrics';
import { OOTDPostProps } from '../../../types/community';

const OOTDPost = memo<OOTDPostProps>(({
  image = DEFAULT_OOTD_POST.image,
  label = DEFAULT_OOTD_POST.label,
  title = DEFAULT_OOTD_POST.title,
  author = DEFAULT_OOTD_POST.author,
  metrics = DEFAULT_OOTD_POST.metrics,
}) => (
  <OOTDCard>
    <OOTDImage src={image} alt={title} />
    <OOTDContent>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="subtitle1" sx={{ mt: 1 }}>
        {title}
      </Typography>
      <AuthorInfo author={author.name} avatar={author.avatar} />
    </OOTDContent>
    <OOTDFooter>
      <PostMetrics {...metrics} />
    </OOTDFooter>
  </OOTDCard>
));

export default OOTDPost;