import React from 'react';
import {
  OOTDCard,
  OOTDImageContainer,
  OOTDImage,
  OOTDLabel
} from '../../MainLayout/MainLayout.styles';

const OOTDPost = ({ image, label }) => (
  <OOTDCard>
    <OOTDImageContainer>
      <OOTDImage src={image} alt={label} />
    </OOTDImageContainer>
    <OOTDLabel>{label}</OOTDLabel>
  </OOTDCard>
);

export default OOTDPost; 