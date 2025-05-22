import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
// Import CreatePostForm
import CreatePostForm from '../components/CreatePostForm/CreatePostForm';

const CreatePostPage: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
          새 게시물 작성
        </Typography>
        <CreatePostForm /> {/* Use CreatePostForm */}
      </Paper>
    </Container>
  );
};

export default CreatePostPage; 