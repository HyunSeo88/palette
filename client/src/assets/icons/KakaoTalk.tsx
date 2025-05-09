import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

// 카카오 로고 모양 SVG Path 데이터로 교체
const KakaoTalkIcon: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props} viewBox="0 0 32 32"> 
    <path 
      fill="#3C1E1E" 
      d="M16 2.8C8.7 2.8 2.8 7.8 2.8 13.9c0 4.1 2.5 7.6 6.1 9.4l-.7 2.6c-.2.7.4 1.3 1.1 1.1l3.4-.9c.9.2 1.9.3 2.9.3 7.3 0 13.2-5 13.2-11.1C29.2 7.8 23.3 2.8 16 2.8z"
    />
  </SvgIcon>
);

export default KakaoTalkIcon; 