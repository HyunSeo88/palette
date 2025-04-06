import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Stack,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Welcome = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h3" gutterBottom>
            Welcome to Palette
          </Typography>
          <Typography variant="h6" color="text.secondary" align="center" paragraph>
            Your creative space for organizing tasks and bringing ideas to life.
          </Typography>

          {user ? (
            <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
              <Button
                component={RouterLink}
                to="/tasks"
                variant="contained"
                color="primary"
                size="large"
              >
                View My Tasks
              </Button>
              <Button
                component={RouterLink}
                to="/profile"
                variant="outlined"
                color="primary"
                size="large"
              >
                My Profile
              </Button>
            </Stack>
          ) : (
            <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                color="primary"
                size="large"
              >
                Get Started
              </Button>
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                color="primary"
                size="large"
              >
                Sign In
              </Button>
            </Stack>
          )}
        </Paper>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary" paragraph>
            Palette helps you organize your tasks, track your progress, and achieve your goals.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Join our community today and start your journey towards better productivity.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Welcome;