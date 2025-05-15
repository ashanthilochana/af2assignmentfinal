import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Divider,
  Button,
  Grid,
} from '@mui/material';
import { getMe } from '../store/slices/authSlice';
import { logout } from '../store/slices/authSlice';

const UserProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // Only fetch user data if we don't already have it
    if (!user) {
      dispatch(getMe());
    }
  }, [isAuthenticated, navigate, dispatch, user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ textAlign: 'center' }}>Loading profile...</Typography>
        </Paper>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h6" color="error" sx={{ textAlign: 'center' }}>
            Failed to load profile. Please try refreshing the page.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: 'primary.main',
              fontSize: '2.5rem',
              mb: 2,
            }}
          >
            {user.username?.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="h4" component="h1" gutterBottom>
            {user.username}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {user.email}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Username
            </Typography>
            <Typography variant="body1" gutterBottom>
              {user.username}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Email
            </Typography>
            <Typography variant="body1" gutterBottom>
              {user.email}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Account Created
            </Typography>
            <Typography variant="body1" gutterBottom>
              {new Date(user.createdAt).toLocaleDateString()}
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            color="error"
            onClick={handleLogout}
            sx={{ minWidth: 200 }}
          >
            Logout
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default UserProfile; 