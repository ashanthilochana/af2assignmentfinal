import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Container } from '@mui/material';
import { getMe } from '../store/slices/authSlice';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';

const Layout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getMe());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <Navbar />
      <Box 
        component="main" 
        sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          py: 4
        }}
      >
        <Container maxWidth="lg" sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Outlet />
        </Container>
      </Box>
      <Footer />
      <ScrollToTop />
    </Box>
  );
};

export default Layout; 