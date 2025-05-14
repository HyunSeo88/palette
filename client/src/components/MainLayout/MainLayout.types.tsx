import { Theme } from '@mui/material/styles';
import { Home, Camera, Users, Star } from 'react-feather';

/** Available section identifiers for the main layout */
export type SectionId = 'home' | 'ootd' | 'community' | 'events';

/** Color mapping for sections using theme tokens */
export const SECTION_COLORS = {
  home: 'primary.main',
  ootd: 'secondary.light',
  community: 'info.main',
  voting: 'info.light',
  events: 'success.light',
} as const;

/** Menu item configuration interface */
export interface MenuItem {
  /** Unique identifier for the menu item */
  id: SectionId;
  /** Display label for the menu item */
  label: string;
  /** Description of the menu item's purpose */
  description?: string;
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
    id: 'home',
    label: 'Home',
    description: '메인 페이지',
    icon: <Home size={20} />,
  },
  {
    id: 'ootd',
    label: 'OOTD',
    description: '오늘의 코디 모음',
    icon: <Camera size={20} />,
  },
  {
    id: 'community',
    label: 'Community',
    description: '커뮤니티 게시판',
    icon: <Users size={20} />,
  },
  {
    id: 'events',
    label: 'Events',
    description: '진행중인 이벤트',
    icon: <Star size={20} />,
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