import React, { memo } from 'react';
import { TextPostCard, PostTitle, PostContent } from './TextPost.styles';
import AuthorInfo from './AuthorInfo';
import PostMetrics from './PostMetrics';
import { TextPostType } from '../types';

interface TextPostProps extends Omit<TextPostType, 'id' | 'metrics' | 'author'> {
  author: string;
  avatar: string;
  likes: number;
  comments: number;
}

/**
 * TextPost Component
 * 
 * Displays a text-based post with author information, content,
 * and engagement metrics. Used for general community posts.
 * 
 * @memo This component is memoized to prevent unnecessary re-renders
 */
const TextPost = memo<TextPostProps>(({
  title,
  content,
  author,
  avatar,
  likes,
  comments,
}) => (
  <TextPostCard>
    <AuthorInfo author={author} avatar={avatar} />
    <PostTitle variant="h6">{title}</PostTitle>
    <PostContent variant="body2">{content}</PostContent>
    <PostMetrics likes={likes} comments={comments} />
  </TextPostCard>
));

TextPost.displayName = 'TextPost';

export default TextPost; 