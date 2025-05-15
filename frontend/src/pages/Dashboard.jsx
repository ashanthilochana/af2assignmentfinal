import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  IconButton,
  Pagination,
  Stack,
  Modal,
  List,
  ListItem,
  ListItemText,
  InputAdornment,
  Collapse,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fade,
} from '@mui/material';
import { Favorite, FavoriteBorder, Close, FilterList, Search, SearchOff } from '@mui/icons-material';
import { getFavorites, addFavorite, removeFavorite } from '../store/slices/favoritesSlice';
import { keyframes } from '@mui/system';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ITEMS_PER_PAGE = 12;

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: '900px',
  bgcolor: 'background.paper',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  p: 0,
  maxHeight: '90vh',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const { favorites, loading } = useSelector((state) => state.favorites);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [open, setOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [regionFilter, setRegionFilter] = useState('all');
  const [populationFilter, setPopulationFilter] = useState('all');

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getFavorites());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        setCountries(data);
        setFilteredCountries(data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };
    fetchCountries();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFavorite = (countryCode, isFavorite) => {
    if (isFavorite) {
      dispatch(removeFavorite(countryCode));
    } else {
      dispatch(addFavorite(countryCode));
    }
  };

  const handleCountryClick = (country) => {
    setSelectedCountry(country);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCountry(null);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleFilterToggle = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterChange = (type, value) => {
    if (type === 'region') {
      setRegionFilter(value);
    } else if (type === 'population') {
      setPopulationFilter(value);
    }
  };

  useEffect(() => {
    let filtered = countries.filter((country) =>
      country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (regionFilter !== 'all') {
      filtered = filtered.filter((country) => country.region === regionFilter);
    }

    if (populationFilter !== 'all') {
      const populationRanges = {
        small: (pop) => pop < 1000000,
        medium: (pop) => pop >= 1000000 && pop < 10000000,
        large: (pop) => pop >= 10000000,
      };
      filtered = filtered.filter((country) => populationRanges[populationFilter](country.population));
    }

    setFilteredCountries(filtered);
    setCurrentPage(1);
  }, [searchTerm, countries, regionFilter, populationFilter]);

  const totalPages = Math.ceil(filteredCountries.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCountries = filteredCountries.slice(startIndex, endIndex);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ height: '100%', display: 'flex', flexDirection: 'column', py: 4 }}>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mb: 4, width: '100%', maxWidth: '100%' }}>
          <TextField
            fullWidth
            placeholder="Search for a country..."
            variant="outlined"
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'text.secondary', fontSize: '1.25rem' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton 
                    onClick={handleFilterToggle} 
                    edge="end"
                    sx={{ 
                      color: showFilters ? 'primary.main' : 'text.secondary',
                      '&:hover': {
                        backgroundColor: 'transparent',
                        color: 'primary.main',
                      }
                    }}
                  >
                    <FilterList sx={{ fontSize: '1.25rem' }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ 
              mb: 0,
              '& .MuiOutlinedInput-root': {
                borderRadius: '50px',
                backgroundColor: 'white',
                height: '56px',
                '& fieldset': {
                  borderColor: 'rgba(0, 0, 0, 0.08)',
                  borderWidth: '1px',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(0, 0, 0, 0.15)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                  borderWidth: '1px',
                },
              },
              '& .MuiInputBase-input': {
                py: 2,
                px: 0,
                fontSize: '1rem',
              },
              '& .MuiInputAdornment-root': {
                marginLeft: 2,
                marginRight: 1,
              }
            }}
          />
          <Collapse in={showFilters}>
            <Paper 
              elevation={0} 
              sx={{ 
                mt: 2, 
                p: 3, 
                border: '1px solid',
                borderColor: 'rgba(0, 0, 0, 0.08)',
                borderRadius: '16px',
                backgroundColor: 'white',
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>Region</InputLabel>
                    <Select
                      value={regionFilter}
                      label="Region"
                      onChange={(e) => handleFilterChange('region', e.target.value)}
                      sx={{
                        borderRadius: '12px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(0, 0, 0, 0.08)',
                          borderWidth: '1px',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(0, 0, 0, 0.15)',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'primary.main',
                          borderWidth: '1px',
                        },
                        '& .MuiSelect-select': {
                          py: 1.5,
                          fontSize: '0.875rem',
                        },
                      }}
                    >
                      <MenuItem value="all" sx={{ fontSize: '0.875rem' }}>All Regions</MenuItem>
                      <MenuItem value="Africa" sx={{ fontSize: '0.875rem' }}>Africa</MenuItem>
                      <MenuItem value="Americas" sx={{ fontSize: '0.875rem' }}>Americas</MenuItem>
                      <MenuItem value="Asia" sx={{ fontSize: '0.875rem' }}>Asia</MenuItem>
                      <MenuItem value="Europe" sx={{ fontSize: '0.875rem' }}>Europe</MenuItem>
                      <MenuItem value="Oceania" sx={{ fontSize: '0.875rem' }}>Oceania</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>Population</InputLabel>
                    <Select
                      value={populationFilter}
                      label="Population"
                      onChange={(e) => handleFilterChange('population', e.target.value)}
                      sx={{
                        borderRadius: '12px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(0, 0, 0, 0.08)',
                          borderWidth: '1px',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(0, 0, 0, 0.15)',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'primary.main',
                          borderWidth: '1px',
                        },
                        '& .MuiSelect-select': {
                          py: 1.5,
                          fontSize: '0.875rem',
                        },
                      }}
                    >
                      <MenuItem value="all" sx={{ fontSize: '0.875rem' }}>All Populations</MenuItem>
                      <MenuItem value="small" sx={{ fontSize: '0.875rem' }}>Small (less than 1M)</MenuItem>
                      <MenuItem value="medium" sx={{ fontSize: '0.875rem' }}>Medium (1M to 10M)</MenuItem>
                      <MenuItem value="large" sx={{ fontSize: '0.875rem' }}>Large (more than 10M)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          </Collapse>
        </Box>
        <Box sx={{ flex: 1, width: '100%' }}>
          {currentCountries.length > 0 ? (
            <Grid 
              container 
              spacing={3} 
              sx={{ 
                width: '100%',
                margin: 0,
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                },
                gap: '24px',
                '& .MuiGrid-item': {
                  padding: 0,
                  width: '100% !important',
                  maxWidth: '100% !important',
                  flexBasis: '100% !important',
                }
              }}
            >
              {currentCountries.map((country, index) => (
                <Grid item key={country.cca3}>
                  <Card sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'box-shadow 0.3s ease-in-out',
                    animation: `${fadeInUp} 0.5s ease-out forwards`,
                    animationDelay: `${index * 100}ms`,
                    opacity: 0,
                    '&:hover': {
                      boxShadow: '0 0 20px rgba(37, 99, 235, 0.15)',
                    },
                  }}>
                    <Box
                      component="img"
                      src={country.flags.png}
                      alt={`${country.name.common} flag`}
                      sx={{
                        width: '100%',
                        height: '140px',
                        objectFit: 'cover',
                        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {country.name.common}
                      </Typography>
                      <Typography color="textSecondary">
                        Capital: {country.capital?.[0] || 'N/A'}
                      </Typography>
                      <Typography color="textSecondary">
                        Population: {country.population.toLocaleString()}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      px: 1.5,
                      pb: 1.5
                    }}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleCountryClick(country)}
                        sx={{
                          backgroundColor: 'primary.main',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'primary.dark',
                          },
                          textTransform: 'none',
                          fontWeight: 500,
                          py: 0.5,
                          px: 1.5,
                          minWidth: 'auto',
                          fontSize: '0.875rem',
                          borderRadius: '50px',
                        }}
                      >
                        Learn More
                      </Button>
                      {isAuthenticated && (
                        <IconButton
                          onClick={() =>
                            handleFavorite(
                              country.cca3,
                              favorites.includes(country.cca3)
                            )
                          }
                          sx={{
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            },
                          }}
                        >
                          {favorites.includes(country.cca3) ? (
                            <Favorite color="error" />
                          ) : (
                            <FavoriteBorder />
                          )}
                        </IconButton>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 8,
                textAlign: 'center',
              }}
            >
              <SearchOff sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Countries Found
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Try adjusting your search or filter criteria
              </Typography>
            </Box>
          )}
        </Box>
        <Box sx={{ mt: 4, py: 2, display: 'flex', justifyContent: 'center' }}>
          <Stack spacing={2}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
            />
          </Stack>
        </Box>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="country-details-modal"
      >
        <Box sx={style}>
          {selectedCountry && (
            <>
              <Box
                sx={{
                  position: 'relative',
                  height: '300px',
                  overflow: 'hidden',
                  borderTopLeftRadius: '16px',
                  borderTopRightRadius: '16px',
                }}
              >
                <img
                  src={selectedCountry.flags.svg}
                  alt={selectedCountry.flags.alt || `${selectedCountry.name.common} flag`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <IconButton
                  onClick={handleClose}
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 1)',
                    },
                  }}
                >
                  <Close />
                </IconButton>
              </Box>
              <Box sx={{ p: 4, overflow: 'auto' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Typography variant="h4" component="h2" sx={{ fontWeight: 600 }}>
                    {selectedCountry.name.common}
                  </Typography>
                  {isAuthenticated && (
                    <IconButton
                      onClick={() => handleFavorite(selectedCountry.cca3, favorites.includes(selectedCountry.cca3))}
                      sx={{
                        color: favorites.includes(selectedCountry.cca3) ? 'error.main' : 'text.secondary',
                        '&:hover': {
                          color: 'error.main',
                        },
                      }}
                    >
                      {favorites.includes(selectedCountry.cca3) ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                  )}
                </Box>

                <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <List>
                      <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Official Name"
                          secondary={selectedCountry.name.official}
                          primaryTypographyProps={{ color: 'text.secondary', fontSize: '0.875rem' }}
                          secondaryTypographyProps={{ fontSize: '1rem', fontWeight: 500 }}
                  />
                </ListItem>
                      <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Capital"
                          secondary={selectedCountry.capital?.[0] || 'N/A'}
                          primaryTypographyProps={{ color: 'text.secondary', fontSize: '0.875rem' }}
                          secondaryTypographyProps={{ fontSize: '1rem', fontWeight: 500 }}
                  />
                </ListItem>
                      <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Region"
                          secondary={selectedCountry.region}
                          primaryTypographyProps={{ color: 'text.secondary', fontSize: '0.875rem' }}
                          secondaryTypographyProps={{ fontSize: '1rem', fontWeight: 500 }}
                  />
                </ListItem>
                      <ListItem sx={{ px: 0 }}>
                  <ListItemText
                          primary="Population"
                          secondary={selectedCountry.population.toLocaleString()}
                          primaryTypographyProps={{ color: 'text.secondary', fontSize: '0.875rem' }}
                          secondaryTypographyProps={{ fontSize: '1rem', fontWeight: 500 }}
                  />
                </ListItem>
                    </List>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <List>
                      <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Languages"
                          secondary={Object.values(selectedCountry.languages || {}).join(', ') || 'N/A'}
                          primaryTypographyProps={{ color: 'text.secondary', fontSize: '0.875rem' }}
                          secondaryTypographyProps={{ fontSize: '1rem', fontWeight: 500 }}
                  />
                </ListItem>
                      <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Currencies"
                          secondary={Object.values(selectedCountry.currencies || {})
                            .map(currency => `${currency.name} (${currency.symbol})`)
                            .join(', ') || 'N/A'}
                          primaryTypographyProps={{ color: 'text.secondary', fontSize: '0.875rem' }}
                          secondaryTypographyProps={{ fontSize: '1rem', fontWeight: 500 }}
                        />
                      </ListItem>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemText
                          primary="Time Zones"
                          secondary={selectedCountry.timezones.join(', ')}
                          primaryTypographyProps={{ color: 'text.secondary', fontSize: '0.875rem' }}
                          secondaryTypographyProps={{ fontSize: '1rem', fontWeight: 500 }}
                        />
                      </ListItem>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemText
                          primary="Area"
                          secondary={`${selectedCountry.area.toLocaleString()} km²`}
                          primaryTypographyProps={{ color: 'text.secondary', fontSize: '0.875rem' }}
                          secondaryTypographyProps={{ fontSize: '1rem', fontWeight: 500 }}
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default Dashboard; 