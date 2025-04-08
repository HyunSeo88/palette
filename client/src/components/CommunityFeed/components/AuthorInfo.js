import React from 'react';
import { Box, Avatar, Typography } from '@mui/material';

const AuthorInfo = ({ author, avatar }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
    <Avatar src={avatar} sx={{ width: 24, height: 24 }} />
    <Typography variant="body2">{author}</Typography>
  </Box>
);

export default AuthorInfo; 