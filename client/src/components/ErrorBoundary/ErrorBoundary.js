import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { AlertTriangle } from 'react-feather';

const ErrorContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  textAlign: 'center',
  minHeight: '200px',
  backgroundColor: theme.palette.error.light,
  borderRadius: theme.shape.borderRadius,
  color: theme.palette.error.contrastText,
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& svg': {
    width: 48,
    height: 48,
    color: theme.palette.error.main,
  },
}));

/**
 * 에러 바운더리 컴포넌트
 * React 컴포넌트 트리에서 발생하는 JavaScript 에러를 캐치하고 폴백 UI를 표시합니다.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // 에러 로깅 서비스에 에러 정보를 보낼 수 있습니다.
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <IconWrapper>
            <AlertTriangle />
          </IconWrapper>
          <Typography variant="h6" gutterBottom>
            죄송합니다. 문제가 발생했습니다.
          </Typography>
          <Typography variant="body2" color="inherit" paragraph>
            {this.state.error?.message || '알 수 없는 오류가 발생했습니다.'}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleReset}
            sx={{ mt: 2 }}
          >
            다시 시도
          </Button>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary; 