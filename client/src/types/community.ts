export interface AuthorInfo {
  name: string;
  avatar: string;
  role?: string;
}

export interface Metrics {
  likes: number;
  comments: number;
  shares?: number;
}

export interface OOTDPostProps {
  image?: string;
  label?: string;
  title?: string;
  author?: AuthorInfo;
  metrics?: Metrics;
}

export interface TextPostProps {
  title: string;
  content: string;
  author: AuthorInfo;
  metrics: Metrics;
  timestamp: string;
} 