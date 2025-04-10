import React, { memo } from 'react';
import { FeedContainer, EmptyFeedMessage } from './CommunityFeed.styles';
import TextPost from './components/TextPost';
import OOTDPost from './components/OOTDPost';
import { CommunityFeedProps, Post, TextPostType, OOTDPostType } from './types';

// Type guard functions with proper type annotations
const isTextPost = (post: Post): post is TextPostType => {
  return 'content' in post && typeof post.content === 'string';
};

const isOOTDPost = (post: Post): post is OOTDPostType => {
  return 'image' in post && typeof post.image === 'string';
};

/**
 * Renders a text-based post (hot posts, voting, events)
 */
const TextPostRenderer = memo<{ post: TextPostType }>(({ post }) => (
  <TextPost
    key={post.id}
    title={post.title}
    content={post.content}
    author={post.author.name}
    avatar={post.author.avatar}
    likes={post.metrics.likes}
    comments={post.metrics.comments}
  />
));

TextPostRenderer.displayName = 'TextPostRenderer';

/**
 * Renders an OOTD (Outfit of the Day) post
 */
const OOTDPostRenderer = memo<{ post: OOTDPostType }>(({ post }) => (
  <OOTDPost
    key={post.id}
    image={post.image}
    title={post.title}
    author={post.author}
    metrics={post.metrics}
  />
));

OOTDPostRenderer.displayName = 'OOTDPostRenderer';

/**
 * CommunityFeed Component
 * 
 * Displays a feed of posts based on the section type.
 * Handles both text-based posts and OOTD (Outfit of the Day) posts.
 */
const CommunityFeed = memo<CommunityFeedProps>(({ 
  sectionType,
  posts = [],
  isLoading = false,
  error = null
}) => {
  if (error) {
    return <EmptyFeedMessage>Error: {error}</EmptyFeedMessage>;
  }

  if (isLoading) {
    return <EmptyFeedMessage>Loading posts...</EmptyFeedMessage>;
  }

  if (!posts.length) {
    return <EmptyFeedMessage>No posts available</EmptyFeedMessage>;
  }

  return (
    <FeedContainer>
      {sectionType === 'ootd' ? (
        posts.map(post => 
          isOOTDPost(post) ? (
            <OOTDPostRenderer key={post.id} post={post} />
          ) : null
        )
      ) : (
        posts.map(post => 
          isTextPost(post) ? (
            <TextPostRenderer key={post.id} post={post} />
          ) : null
        )
      )}
    </FeedContainer>
  );
});

CommunityFeed.displayName = 'CommunityFeed';

export default CommunityFeed; 