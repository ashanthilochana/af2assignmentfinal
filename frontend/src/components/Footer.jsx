import { Box, Container, Typography, Link, Stack } from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: 'white',
        borderTop: '1px solid',
        borderColor: 'rgba(0, 0, 0, 0.08)',
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 2, sm: 4 }}
          alignItems="center"
          justifyContent="space-between"
        >
          <Link
            component={RouterLink}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              textDecoration: 'none',
              color: 'inherit',
              '&:hover': {
                opacity: 0.8,
              },
            }}
          >
            <PublicIcon sx={{ color: 'primary.main', fontSize: '1.5rem' }} />
            <Typography variant="h6" color="text.primary" sx={{ fontWeight: 600 }}>
              Country Explorer
            </Typography>
          </Link>
          
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Country Explorer. All rights reserved.
          </Typography>

          <Stack direction="row" spacing={2}>
            <Link
              href="https://restcountries.com/"
              target="_blank"
              rel="noopener noreferrer"
              color="text.secondary"
              sx={{
                textDecoration: 'none',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              API Source
            </Link>
            <Link
              component={RouterLink}
              to="/documentation"
              sx={{
                color: 'text.secondary',
                textDecoration: 'none',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              Documentation
            </Link>
            <Link
              component={RouterLink}
              to="/privacy"
              sx={{
                color: 'text.secondary',
                textDecoration: 'none',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              Privacy Policy
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer; 