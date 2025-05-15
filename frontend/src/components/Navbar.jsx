import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Link, 
  Avatar, 
  IconButton, 
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider
} from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { logout } from '../store/slices/authSlice';
import { useState } from 'react';
import { 
  PersonOutline, 
  FavoriteBorder, 
  SettingsOutlined, 
  LogoutOutlined 
} from '@mui/icons-material';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
    navigate('/login');
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0} 
      sx={{ 
        backgroundColor: 'white', 
        color: 'text.primary',
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Toolbar>
        <Link
          component={RouterLink}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            '&:hover': {
              opacity: 0.8,
            },
          }}
        >
          <PublicIcon sx={{ fontSize: 32, color: 'primary.main', mr: 1 }} />
          <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
            Country Explorer
          </Typography>
        </Link>

        {isAuthenticated ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              component={RouterLink}
              to="/documentation"
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              <HelpOutlineIcon />
            </IconButton>
            <IconButton
              component={RouterLink}
              to="/favorites"
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              <Badge badgeContent={0} color="error">
                <FavoriteBorderIcon />
              </Badge>
            </IconButton>
            <Box
              onClick={handleClick}
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'primary.main',
                  fontSize: '1rem',
                  mr: 1,
                }}
              >
                {user?.username?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                {user?.username}
              </Typography>
            </Box>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                  mt: 1.5,
                  minWidth: 200,
                  borderRadius: '12px',
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Signed in as
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {user?.username}
                </Typography>
              </Box>
              <Divider />
              <MenuItem 
                component={RouterLink} 
                to="/profile"
                sx={{
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: 'rgba(37, 99, 235, 0.08)',
                  },
                }}
              >
                <ListItemIcon>
                  <PersonOutline fontSize="small" sx={{ color: 'primary.main' }} />
                </ListItemIcon>
                <Typography variant="body2">Overview</Typography>
              </MenuItem>
              <MenuItem 
                component={RouterLink} 
                to="/favorites"
                sx={{
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: 'rgba(37, 99, 235, 0.08)',
                  },
                }}
              >
                <ListItemIcon>
                  <FavoriteBorder fontSize="small" sx={{ color: 'error.main' }} />
                </ListItemIcon>
                <Typography variant="body2">Favorites</Typography>
              </MenuItem>
              <MenuItem 
                component={RouterLink} 
                to="/settings"
                sx={{
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: 'rgba(37, 99, 235, 0.08)',
                  },
                }}
              >
                <ListItemIcon>
                  <SettingsOutlined fontSize="small" sx={{ color: 'primary.main' }} />
                </ListItemIcon>
                <Typography variant="body2">Settings</Typography>
              </MenuItem>
              <Divider />
              <MenuItem 
                onClick={handleLogout}
                sx={{
                  py: 1.5,
                  color: 'error.main',
                  '&:hover': {
                    backgroundColor: 'rgba(211, 47, 47, 0.08)',
                  },
                }}
              >
                <ListItemIcon>
                  <LogoutOutlined fontSize="small" sx={{ color: 'error.main' }} />
                </ListItemIcon>
                <Typography variant="body2">Sign out</Typography>
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="outlined" 
              onClick={() => navigate('/login')}
              startIcon={<LoginIcon />}
              sx={{ 
                borderColor: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.dark',
                  backgroundColor: 'rgba(37, 99, 235, 0.04)'
                },
                borderRadius: '50px',
                px: 4,
                minWidth: '120px',
              }}
            >
              Login
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/register')}
              startIcon={<PersonAddIcon />}
              sx={{
                borderRadius: '50px',
                px: 4,
                minWidth: '120px',
              }}
            >
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 