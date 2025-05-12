import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

// 카카오 로고 모양 SVG Path 데이터 및 viewBox 수정
const KakaoTalkIcon: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path 
      fill="currentColor"
      d="M12 2C6.477 2 2 5.821 2 10c0 2.459 1.295 4.635 3.349 6.031L4.438 18.65c-.172.422.016.912.438 1.084C4.961 19.777 5.047 19.781 5.125 19.781c.344 0 .664-.203.812-.531l1.406-3.109c.852.305 1.766.477 2.734.477c4.859 0 8.922-3.828 8.922-7.617C19 5.821 15.523 2 12 2Z"
    />
  </SvgIcon>
);

export default KakaoTalkIcon; 