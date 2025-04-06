import React from 'react';
import styled from 'styled-components';

const ValuesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const ValueCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
`;

const ValueTitle = styled.h4`
  color: var(--primary-color);
  margin-bottom: 15px;
  font-size: 1.2rem;
`;

const ValueDescription = styled.p`
  color: var(--text-color);
  line-height: 1.6;
`;

const Values = () => {
  return (
    <ValuesContainer>
      <ValueCard>
        <ValueTitle>포용성</ValueTitle>
        <ValueDescription>
          색맹, 색약을 가진 모든 사람들이 자신의 스타일을 자유롭게 표현하고 공유할 수 있는 공간을 제공합니다.
        </ValueDescription>
      </ValueCard>
      <ValueCard>
        <ValueTitle>공동체</ValueTitle>
        <ValueDescription>
          비슷한 경험을 가진 사람들이 서로의 이야기를 나누고, 지식을 공유하며 함께 성장하는 커뮤니티를 구축합니다.
        </ValueDescription>
      </ValueCard>
      <ValueCard>
        <ValueTitle>혁신</ValueTitle>
        <ValueDescription>
          색각 이상을 가진 사람들의 패션 경험을 혁신적으로 개선하는 도구와 서비스를 개발합니다.
        </ValueDescription>
      </ValueCard>
      <ValueCard>
        <ValueTitle>교육</ValueTitle>
        <ValueDescription>
          색각 이상에 대한 이해를 높이고, 더 나은 패션 선택을 할 수 있도록 교육 자료를 제공합니다.
        </ValueDescription>
      </ValueCard>
    </ValuesContainer>
  );
};

export default Values; 