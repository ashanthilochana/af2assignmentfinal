import { Container, Typography, Box, Paper, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Search, FilterList, Favorite, FavoriteBorder, Info, Public, Person, Star } from '@mui/icons-material';
import { useEffect } from 'react';

const Documentation = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
        Country Explorer Documentation
      </Typography>

      <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: '16px', border: '1px solid rgba(0, 0, 0, 0.08)' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 500, mb: 2 }}>
          Getting Started
        </Typography>
        <Typography paragraph>
          Welcome to Country Explorer! This application allows you to explore information about countries around the world. 
          You can search, filter, and save your favorite countries for quick access.
        </Typography>
      </Paper>

      <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: '16px', border: '1px solid rgba(0, 0, 0, 0.08)' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 500, mb: 2 }}>
          Features
        </Typography>
        <List>
          <ListItem sx={{ px: 0 }}>
            <ListItemIcon>
              <Search sx={{ color: 'primary.main' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Search Countries" 
              secondary="Use the search bar to find countries by name. The search is case-insensitive and updates results in real-time."
            />
          </ListItem>
          <Divider component="li" sx={{ my: 2 }} />
          <ListItem sx={{ px: 0 }}>
            <ListItemIcon>
              <FilterList sx={{ color: 'primary.main' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Filter Results" 
              secondary="Filter countries by region and population size. Click the filter icon to show/hide filter options."
            />
          </ListItem>
          <Divider component="li" sx={{ my: 2 }} />
          <ListItem sx={{ px: 0 }}>
            <ListItemIcon>
              <Favorite sx={{ color: 'error.main' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Save Favorites" 
              secondary="Create an account to save your favorite countries. Click the heart icon to add or remove countries from your favorites."
            />
          </ListItem>
          <Divider component="li" sx={{ my: 2 }} />
          <ListItem sx={{ px: 0 }}>
            <ListItemIcon>
              <Info sx={{ color: 'primary.main' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Country Details" 
              secondary="Click 'Learn More' on any country card to view detailed information including capital, population, languages, and more."
            />
          </ListItem>
        </List>
      </Paper>

      <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: '16px', border: '1px solid rgba(0, 0, 0, 0.08)' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 500, mb: 2 }}>
          Navigation
        </Typography>
        <List>
          <ListItem sx={{ px: 0 }}>
            <ListItemIcon>
              <Public sx={{ color: 'primary.main' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Home" 
              secondary="Click the 'Country Explorer' logo to return to the main page."
            />
          </ListItem>
          <Divider component="li" sx={{ my: 2 }} />
          <ListItem sx={{ px: 0 }}>
            <ListItemIcon>
              <Star sx={{ color: 'primary.main' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Favorites" 
              secondary="Access your saved countries through the heart icon in the navigation bar."
            />
          </ListItem>
          <Divider component="li" sx={{ my: 2 }} />
          <ListItem sx={{ px: 0 }}>
            <ListItemIcon>
              <Person sx={{ color: 'primary.main' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Profile" 
              secondary="View and manage your account information through the profile icon."
            />
          </ListItem>
        </List>
      </Paper>

      <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: '16px', border: '1px solid rgba(0, 0, 0, 0.08)' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 500, mb: 2 }}>
          Tips & Tricks
        </Typography>
        <List>
          <ListItem sx={{ px: 0 }}>
            <ListItemText 
              primary="Quick Search" 
              secondary="Start typing in the search bar to instantly filter countries. The results update as you type."
            />
          </ListItem>
          <Divider component="li" sx={{ my: 2 }} />
          <ListItem sx={{ px: 0 }}>
            <ListItemText 
              primary="Combined Filters" 
              secondary="Use both region and population filters together to narrow down your search results."
            />
          </ListItem>
          <Divider component="li" sx={{ my: 2 }} />
          <ListItem sx={{ px: 0 }}>
            <ListItemText 
              primary="Responsive Design" 
              secondary="The application is fully responsive and works well on desktop, tablet, and mobile devices."
            />
          </ListItem>
        </List>
      </Paper>

      <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid rgba(0, 0, 0, 0.08)' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 500, mb: 2 }}>
          Need Help?
        </Typography>
        <Typography paragraph>
          If you encounter any issues or have questions about using Country Explorer, please contact our support team.
          We're here to help you make the most of your country exploration experience!
        </Typography>
      </Paper>
    </Container>
  );
};

export default Documentation; 