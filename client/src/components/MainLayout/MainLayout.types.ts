import { Theme } from '@mui/material/styles';

/** Available section identifiers for the main layout */
export type SectionId = 'value' | 'hot-posts' | 'ootd' | 'voting' | 'events';

/** Color mapping for sections using theme tokens */
export const SECTION_COLORS = {
  value: 'primary.main',
  'hot-posts': 'primary.light',
  ootd: 'secondary.light',
  voting: 'info.light',
  events: 'success.light',
} as const;

/** Menu item configuration interface */
export interface MenuItem {
  /** Unique identifier for the menu item */
  id: SectionId;
  /** Display label for the menu item */
  label: string;
  /** Theme color token for the menu item */
  color: string;
  /** Description of the menu item's purpose */
  description: string;
  /** Icon representation for the menu item */
  icon: React.ReactNode;
}

/** Community statistics interface */
export interface CommunityStats {
  /** Label for the statistic */
  label: string;
  /** Value of the statistic */
  value: string;
}

/** Menu items configuration */
export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'value',
    label: 'VALUES',
    color: '#1976D2',
    description: '팔레트의 핵심 가치',
    icon: '💫'
  },
  {
    id: 'hot-posts',
    label: 'TRENDING',
    color: '#C62828',
    description: '실시간 인기 게시물',
    icon: '🔥'
  },
  {
    id: 'ootd',
    label: 'STYLE',
    color: '#F57F17',
    description: '오늘의 코디 모음',
    icon: '👕'
  },
  {
    id: 'voting',
    label: 'VOTE',
    color: '#455A64',
    description: '스타일 투표 진행중',
    icon: '🗳️'
  },
  {
    id: 'events',
    label: 'EVENTS',
    color: '#558B2F',
    description: '진행중인 이벤트',
    icon: '📅'
  },
];

/** Community statistics data */
export const COMMUNITY_STATS: CommunityStats[] = [
  { label: '회원', value: '1,234' },
  { label: '게시물', value: '56' },
  { label: '댓글', value: '789' },
];

/** Configuration for intersection observer used in scroll detection */
export const INTERSECTION_OBSERVER_CONFIG = {
  thresholds: [0.1, 0.5, 0.9, 1.0],
  rootMargin: '-64px 0px -64px 0px',
} as const;

/** Avatar size configuration */
export const AVATAR_SIZE = {
  width: 32,
  height: 32,
} as const; 