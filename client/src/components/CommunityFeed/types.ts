export type SectionType = 'hot-posts' | 'ootd' | 'voting' | 'events';

export interface Author {
  name: string;
  avatar: string;
}

export interface Metrics {
  likes: number;
  comments: number;
}

export interface BasePost {
  id: string;
  title: string;
  author: Author;
  metrics: Metrics;
}

export interface TextPostType extends BasePost {
  content: string;
}

export interface OOTDPostType extends BasePost {
  image?: string;
}

export type Post = TextPostType | OOTDPostType;

export interface CommunityFeedProps {
  /** Type of content section to display */
  sectionType: SectionType;
  /** Array of posts to display */
  posts?: Post[];
  /** Loading state indicator */
  isLoading?: boolean;
  /** Error message if any */
  error?: string | null;
} 