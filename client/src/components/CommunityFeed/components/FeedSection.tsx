import React from 'react';
import { SectionContainer, SectionTitle } from '../CommunityFeed.styles';
import { CardGrid } from '../../MainLayout/MainLayout.styles';

interface FeedSectionProps {
  /** Title of the feed section */
  title: string;
  /** Content to be rendered within the section */
  children: React.ReactNode;
  /** Optional className for additional styling */
  className?: string;
}

/**
 * FeedSection Component
 * 
 * A reusable section component for the community feed that provides
 * consistent styling and layout for different types of content sections.
 * 
 * @example
 * ```tsx
 * <FeedSection title="Hot Posts">
 *   <PostList posts={hotPosts} />
 * </FeedSection>
 * ```
 */
const FeedSection: React.FC<FeedSectionProps> = ({
  title,
  children,
  className
}) => {
  return (
    <SectionContainer className={className}>
      <SectionTitle variant="h5">
        {title}
      </SectionTitle>
      <CardGrid>
        {children}
      </CardGrid>
    </SectionContainer>
  );
};

export default FeedSection; 