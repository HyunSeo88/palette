import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper,
  Chip,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const DiscountCard = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  borderRadius: 18,
  overflow: 'hidden',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  },
}));

const ImagePlaceholder = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 140,
  backgroundColor: '#f5f5f5',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#999',
}));

const ContentBox = styled(Box)(({ theme }) => ({
  padding: 20,
}));

const BrandDiscounts = () => {
  const discounts = [
    {
      id: 1,
      brand: 'ZARA',
      title: '여름 시즌오프',
      discount: '최대 50%',
      description: '컬러풀한 여름 아이템 할인',
      remainingDays: 5,
      imageUrl: null,
    },
    {
      id: 2,
      brand: 'UNIQLO',
      title: '린넨 컬렉션',
      discount: '30%',
      description: '시원한 린넨 의류 특가',
      remainingDays: 3,
      imageUrl: null,
    },
    {
      id: 3,
      brand: 'H&M',
      title: '컬러 티셔츠 기획전',
      discount: '2+1',
      description: '베이직 티셔츠 구매 이벤트',
      remainingDays: 7,
      imageUrl: null,
    }
  ];

  return (
    <Box>
      <Typography variant="h3" gutterBottom sx={{ 
        fontSize: '1.8rem', 
        fontWeight: 600, 
        color: '#333',
        marginBottom: '25px',
        borderBottom: '1px solid #eee',
        paddingBottom: '15px',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <LocalOfferIcon sx={{ fontSize: '1.8rem' }} />
        브랜드 할인/이벤트
      </Typography>
      
      <Grid container spacing={3}>
        {discounts.map((discount) => (
          <Grid item xs={12} sm={6} md={4} key={discount.id}>
            <DiscountCard>
              <ImagePlaceholder>
                이미지 준비중
              </ImagePlaceholder>
              <ContentBox>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 2
                }}>
                  <Typography variant="h6" sx={{ 
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#333'
                  }}>
                    {discount.brand}
                  </Typography>
                  <Chip
                    label={discount.discount}
                    color="error"
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
                
                <Typography variant="h5" sx={{ 
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  marginBottom: 1,
                  color: '#222'
                }}>
                  {discount.title}
                </Typography>
                
                <Typography variant="body2" sx={{ 
                  color: '#666',
                  marginBottom: 2
                }}>
                  {discount.description}
                </Typography>
                
                <Box sx={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Box sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}>
                    <AccessTimeIcon sx={{ fontSize: '0.9rem', color: '#999' }} />
                    <Typography variant="caption" sx={{ color: '#999' }}>
                      {discount.remainingDays}일 남음
                    </Typography>
                  </Box>
                  
                  <Button
                    endIcon={<ArrowForwardIcon />}
                    sx={{ 
                      textTransform: 'none',
                      fontWeight: 500,
                      fontSize: '0.9rem'
                    }}
                  >
                    자세히 보기
                  </Button>
                </Box>
              </ContentBox>
            </DiscountCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BrandDiscounts; 