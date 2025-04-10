import { AuthorInfo, Metrics } from '../types/community';

export const DEFAULT_AUTHOR: AuthorInfo = {
  name: 'Anonymous',
  avatar: '/images/default-avatar.png',
  role: 'Member'
};

export const DEFAULT_METRICS: Metrics = {
  likes: 0,
  comments: 0,
  shares: 0
};

export const DEFAULT_OOTD_POST = {
  image: '/images/default-ootd.jpg',
  label: 'OOTD',
  title: 'My Style Today',
  author: DEFAULT_AUTHOR,
  metrics: DEFAULT_METRICS
}; 