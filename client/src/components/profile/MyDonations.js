import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MyDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const conditions = {
    fresh: { label: 'Fresh', color: 'success' },
    good: { label: 'Good', color: 'primary' },
    fair: { label: 'Fair', color: 'warning' },
    'expiring-soon': { label: 'Expiring Soon', color: 'error' }
  };

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/food/user/donations');
        setDonations(response.data.foods);
      } catch (error) {
        console.error('Error fetching donations:', error);
        setError('Failed to load your donations');
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const getDaysUntilExpiry = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Donations
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track all the food items you've donated to the community
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {donations.length === 0 ? (
        <Alert severity="info">
          You haven't donated any food items yet. Start by donating some food!
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {donations.map((donation) => {
            const daysUntilExpiry = getDaysUntilExpiry(donation.expiryDate);
            const isExpiringSoon = daysUntilExpiry <= 2;
            
            return (
              <Grid item xs={12} sm={6} md={4} key={donation._id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      transition: 'transform 0.2s ease-in-out',
                      boxShadow: 3
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" component="h2" gutterBottom>
                        {donation.title}
                      </Typography>
                      <Chip
                        label={conditions[donation.condition].label}
                        color={conditions[donation.condition].color}
                        size="small"
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {donation.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {donation.location.city}, {donation.location.state}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <TimeIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                      <Typography 
                        variant="body2" 
                        color={isExpiringSoon ? 'error.main' : 'text.secondary'}
                      >
                        Expires: {formatDate(donation.expiryDate)} 
                        {isExpiringSoon && ` (${daysUntilExpiry} days)`}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Quantity: {donation.quantity}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Chip 
                        label={donation.status} 
                        color={
                          donation.status === 'available' ? 'success' :
                          donation.status === 'reserved' ? 'warning' :
                          donation.status === 'claimed' ? 'primary' : 'default'
                        }
                        size="small"
                      />
                      {donation.isUrgent && (
                        <Chip label="Urgent" color="error" size="small" sx={{ ml: 1 }} />
                      )}
                    </Box>

                    {donation.reservedBy && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <PersonIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          Reserved by: {donation.reservedBy.name}
                        </Typography>
                      </Box>
                    )}

                    {donation.claimedBy && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <PersonIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          Claimed by: {donation.claimedBy.name}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                  
                  <CardActions>
                    <Button 
                      size="small" 
                      onClick={() => navigate(`/food/${donation._id}`)}
                      fullWidth
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default MyDonations; 