import React from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Paper
} from '@mui/material';
import {
  LocalOffer as LocalOfferIcon,
  People as PeopleIcon,
  Recycling as EcoIcon,
  VolunteerActivism as VolunteerIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ReactComponent as Logo } from '../../logo.svg';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: <LocalOfferIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Share Surplus Food',
      description: 'Donate excess food from restaurants, supermarkets, or households to those who need it.'
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Connect Communities',
      description: 'Build stronger communities by connecting food donors with recipients in your area.'
    },
    {
      icon: <EcoIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Reduce Food Waste',
      description: 'Help reduce food waste and environmental impact while addressing food insecurity.'
    },
    {
      icon: <VolunteerIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Easy & Safe',
      description: 'Simple platform with user verification and rating system for safe food sharing.'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: '#fff',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: 'url(https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)',
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.3)',
          }}
        />
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
            <Logo style={{ width: '80px', height: '80px' }} />
            <Typography
              component="h1"
              variant="h2"
              color="inherit"
              sx={{ fontWeight: 'bold' }}
            >
              Community Fridge
            </Typography>
          </Box>
          <Typography variant="h5" color="inherit" paragraph>
            Connecting food donors with recipients to reduce waste and address food insecurity in your community.
          </Typography>
          <Box sx={{ mt: 4 }}>
            {user ? (
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/add-food')}
                  sx={{ 
                    backgroundColor: 'primary.main',
                    '&:hover': { backgroundColor: 'primary.dark' }
                  }}
                >
                  Donate Food
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/food')}
                  sx={{ 
                    color: 'white',
                    borderColor: 'white',
                    '&:hover': { 
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Browse Food
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{ 
                    backgroundColor: 'primary.main',
                    '&:hover': { backgroundColor: 'primary.dark' }
                  }}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/food')}
                  sx={{ 
                    color: 'white',
                    borderColor: 'white',
                    '&:hover': { 
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Browse Food
                </Button>
              </Box>
            )}
          </Box>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          component="h2"
          variant="h3"
          align="center"
          color="text.primary"
          gutterBottom
          sx={{ mb: 6 }}
        >
          How It Works
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.3s ease-in-out',
                    boxShadow: 3
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography gutterBottom variant="h5" component="h3">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action */}
      <Paper sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
        <Container maxWidth="md">
          <Typography
            component="h2"
            variant="h3"
            align="center"
            gutterBottom
          >
            Join Our Community Today
          </Typography>
          <Typography variant="h6" align="center" paragraph>
            Be part of the solution to food waste and food insecurity in your community.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            {user ? (
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/add-food')}
                sx={{ 
                  backgroundColor: 'white',
                  color: 'primary.main',
                  '&:hover': { backgroundColor: 'grey.100' }
                }}
              >
                Start Donating
              </Button>
            ) : (
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                sx={{ 
                  backgroundColor: 'white',
                  color: 'primary.main',
                  '&:hover': { backgroundColor: 'grey.100' }
                }}
              >
                Sign Up Now
              </Button>
            )}
          </Box>
        </Container>
      </Paper>
    </Box>
  );
};

export default Home; 