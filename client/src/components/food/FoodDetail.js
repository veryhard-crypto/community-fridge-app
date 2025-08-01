import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const FoodDetail = () => {
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);
  
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const conditions = {
    fresh: { label: 'Fresh', color: 'success' },
    good: { label: 'Good', color: 'primary' },
    fair: { label: 'Fair', color: 'warning' },
    'expiring-soon': { label: 'Expiring Soon', color: 'error' }
  };

  useEffect(() => {
    const fetchFood = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/food/${id}`);
        setFood(response.data.food);
      } catch (error) {
        console.error('Error fetching food:', error);
        setError('Failed to load food item');
      } finally {
        setLoading(false);
      }
    };

    fetchFood();
  }, [id]);

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

  const handleReserve = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setActionLoading(true);
    try {
      await axios.post(`http://localhost:5000/api/food/${id}/reserve`);
      setActionSuccess('Food item reserved successfully!');
      // Refresh food data
      const response = await axios.get(`http://localhost:5000/api/food/${id}`);
      setFood(response.data.food);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reserve food';
      setError(message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleClaim = async () => {
    setActionLoading(true);
    try {
      await axios.post(`http://localhost:5000/api/food/${id}/claim`);
      setActionSuccess('Food item claimed successfully!');
      // Refresh food data
      const response = await axios.get(`http://localhost:5000/api/food/${id}`);
      setFood(response.data.food);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to claim food';
      setError(message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelReservation = async () => {
    setActionLoading(true);
    try {
      await axios.post(`http://localhost:5000/api/food/${id}/cancel-reservation`);
      setActionSuccess('Reservation cancelled successfully!');
      // Refresh food data
      const response = await axios.get(`http://localhost:5000/api/food/${id}`);
      setFood(response.data.food);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to cancel reservation';
      setError(message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!food) {
    return (
      <Container maxWidth="md">
        <Alert severity="info" sx={{ mt: 4 }}>
          Food item not found
        </Alert>
      </Container>
    );
  }

  const daysUntilExpiry = getDaysUntilExpiry(food.expiryDate);
  const isExpiringSoon = daysUntilExpiry <= 2;
  const isOwnDonation = user && food.donor._id === user._id;
  const isReservedByMe = user && food.reservedBy && food.reservedBy._id === user._id;
  const canReserve = food.status === 'available' && !isOwnDonation && user;
  const canClaim = food.status === 'reserved' && isReservedByMe;
  const canCancelReservation = food.status === 'reserved' && isReservedByMe;

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          {actionSuccess && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {actionSuccess}
            </Alert>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Typography variant="h4" component="h1">
              {food.title}
            </Typography>
            <Chip
              label={conditions[food.condition].label}
              color={conditions[food.condition].color}
              size="large"
            />
          </Box>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {food.description}
          </Typography>

          {/* Food Images */}
          {food.images && food.images.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Photos
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {food.images.map((image, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 200,
                      height: 150,
                      backgroundImage: `url(${image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      borderRadius: 1,
                      border: '1px solid #e0e0e0'
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Food Details
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Category:</strong> {food.category}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Quantity:</strong> {food.quantity}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Status:</strong> {food.status}
                    </Typography>
                    {food.isUrgent && (
                      <Chip label="Urgent" color="error" size="small" sx={{ mt: 1 }} />
                    )}
                  </Box>

                  {food.allergens && food.allergens.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Allergens:</strong>
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {food.allergens.map((allergen) => (
                          <Chip key={allergen} label={allergen} size="small" />
                        ))}
                      </Box>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <TimeIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                    <Typography 
                      variant="body2" 
                      color={isExpiringSoon ? 'error.main' : 'text.secondary'}
                    >
                      Expires: {formatDate(food.expiryDate)} 
                      {isExpiringSoon && ` (${daysUntilExpiry} days)`}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Pickup Information
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {food.location.address}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {food.location.city}, {food.location.state} {food.location.zipCode}
                  </Typography>

                  {food.pickupInstructions && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Pickup Instructions:</strong>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {food.pickupInstructions}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Divider sx={{ mb: 3 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <PersonIcon sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
            <Box>
              <Typography variant="h6">
                {food.donor.name}
              </Typography>
              {food.donor.rating > 0 && (
                <Chip 
                  label={`${food.donor.rating}★ Rating`} 
                  color="primary" 
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              )}
            </Box>
          </Box>

          {food.reservedBy && (
            <Alert severity="info" sx={{ mb: 3 }}>
              Reserved by: {food.reservedBy.name}
            </Alert>
          )}

          {food.claimedBy && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Claimed by: {food.claimedBy.name}
            </Alert>
          )}

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {canReserve && (
              <Button
                variant="contained"
                size="large"
                onClick={handleReserve}
                disabled={actionLoading}
              >
                {actionLoading ? <CircularProgress size={24} /> : 'Reserve Food'}
              </Button>
            )}

            {canClaim && (
              <Button
                variant="contained"
                color="success"
                size="large"
                onClick={handleClaim}
                disabled={actionLoading}
              >
                {actionLoading ? <CircularProgress size={24} /> : 'Claim Food'}
              </Button>
            )}

            {canCancelReservation && (
              <Button
                variant="outlined"
                color="error"
                size="large"
                onClick={handleCancelReservation}
                disabled={actionLoading}
              >
                {actionLoading ? <CircularProgress size={24} /> : 'Cancel Reservation'}
              </Button>
            )}

            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/food')}
            >
              Back to Browse
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default FoodDetail; 