import { 
  Sun,
  TrendingUp,
  Camera,
  HelpCircle,
  Star
} from 'react-feather';

export const menuIcons = {
  values: Sun,
  hot: TrendingUp,
  outfit: Camera,
  poll: HelpCircle,
  event: Star,
};

export const MENU_ITEMS = [
  { id: 'values', title: '컬러 가치관', color: '#87CEEB' },
  { id: 'hot', title: '인기 게시물', color: '#FF6347' },
  { id: 'outfit', title: '오늘의 착장', color: '#FFDA63' },
  { id: 'poll', title: '컬러 투표', color: '#B0B0B0' },
  { id: 'event', title: '이벤트', color: '#F5F5F5' },
]; 