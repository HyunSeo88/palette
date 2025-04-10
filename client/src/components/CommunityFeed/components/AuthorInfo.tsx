import React from 'react';
import { Box, Avatar, Typography } from '@mui/material';

// Constants
const AVATAR_SIZE = 24;

// Styles
const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    mt: 1,
  } as const,
  
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
  } as const,
} as const;

interface AuthorInfoProps {
  /** Author's display name */
  author: string;
  /** URL of the author's avatar image */
  avatar: string;
}

/**
 * AuthorInfo Component
 * 
 * Displays author information including their avatar and name.
 * Used in post headers and comment sections.
 */
const AuthorInfo: React.FC<AuthorInfoProps> = ({ author, avatar }) => (
  <Box sx={styles.container}>
    <Avatar src={avatar} sx={styles.avatar} />
    <Typography variant="body2">{author}</Typography>
  </Box>
);

export default AuthorInfo; 