import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  Box,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { ArrowBack, Favorite, FavoriteBorder } from '@mui/icons-material';
import { addFavorite, removeFavorite } from '../store/slices/favoritesSlice';

const CountryDetails = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { favorites } = useSelector((state) => state.favorites);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountryDetails = async () => {
      try {
        const response = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
        const data = await response.json();
        setCountry(data[0]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching country details:', error);
        setLoading(false);
      }
    };
    fetchCountryDetails();
  }, [code]);

  const handleFavorite = () => {
    if (favorites.includes(code)) {
      dispatch(removeFavorite(code));
    } else {
      dispatch(addFavorite(code));
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!country) {
    return (
      <Container>
        <Typography variant="h5" align="center">
          Country not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ height: '100%' }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/')}
        sx={{ mb: 3 }}
      >
        Back to Dashboard
      </Button>
      <Paper elevation={3} sx={{ p: 4, height: 'calc(100% - 60px)' }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {country.name.common}
              </Typography>
              {isAuthenticated && (
                <IconButton onClick={handleFavorite} sx={{ ml: 2 }}>
                  {favorites.includes(code) ? (
                    <Favorite color="error" />
                  ) : (
                    <FavoriteBorder />
                  )}
                </IconButton>
              )}
            </Box>
            <Typography variant="h6" gutterBottom>
              {country.name.official}
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Capital"
                  secondary={country.capital?.[0] || 'N/A'}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Population"
                  secondary={country.population.toLocaleString()}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Region"
                  secondary={country.region}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Subregion"
                  secondary={country.subregion || 'N/A'}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Languages"
                  secondary={Object.values(country.languages || {}).join(', ')}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Currencies"
                  secondary={Object.values(country.currencies || {})
                    .map((currency) => `${currency.name} (${currency.symbol})`)
                    .join(', ')}
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={country.flags.png}
              alt={`${country.name.common} flag`}
              sx={{
                width: '100%',
                maxWidth: '400px',
                height: 'auto',
                display: 'block',
                margin: '0 auto',
              }}
            />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default CountryDetails; 