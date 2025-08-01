import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Card,
  CardMedia,
  CardContent
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddFood = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    customCategory: '',
    quantity: '',
    brand: '',
    packaging: '',
    expiryDate: new Date(),
    condition: '',
    allergens: [],
    dietaryRestrictions: [],
    pickupInstructions: '',
    location: {
      address: '',
      city: '',
      state: '',
      zipCode: ''
    },
    isUrgent: false,
    images: []
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  
  const navigate = useNavigate();

  const categories = [
    { value: 'fruits', label: 'Fruits' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'bread', label: 'Bread' },
    { value: 'canned', label: 'Canned Goods' },
    { value: 'frozen', label: 'Frozen Foods' },
    { value: 'pantry', label: 'Pantry Items' },
    { value: 'meat', label: 'Meat & Fish' },
    { value: 'beverages', label: 'Beverages' },
    { value: 'snacks', label: 'Snacks' },
    { value: 'baked-goods', label: 'Baked Goods' },
    { value: 'other', label: 'Other' },
    { value: 'custom', label: 'Custom Category' }
  ];

  const conditions = [
    { value: 'fresh', label: 'Fresh' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'expiring-soon', label: 'Expiring Soon' }
  ];

  const allergenOptions = [
    { value: 'nuts', label: 'Nuts' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'gluten', label: 'Gluten' },
    { value: 'eggs', label: 'Eggs' },
    { value: 'soy', label: 'Soy' },
    { value: 'fish', label: 'Fish' },
    { value: 'shellfish', label: 'Shellfish' },
    { value: 'wheat', label: 'Wheat' },
    { value: 'none', label: 'None' }
  ];

  const dietaryRestrictions = [
    { value: 'vegan', label: 'Vegan' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'gluten-free', label: 'Gluten-Free' },
    { value: 'dairy-free', label: 'Dairy-Free' },
    { value: 'nut-free', label: 'Nut-Free' },
    { value: 'organic', label: 'Organic' },
    { value: 'non-gmo', label: 'Non-GMO' },
    { value: 'kosher', label: 'Kosher' },
    { value: 'halal', label: 'Halal' },
    { value: 'none', label: 'None' }
  ];

  const packagingTypes = [
    { value: 'original', label: 'Original Packaging' },
    { value: 'repackaged', label: 'Repackaged' },
    { value: 'bulk', label: 'Bulk' },
    { value: 'individual', label: 'Individual Items' },
    { value: 'mixed', label: 'Mixed Items' }
  ];

  const commonFoodItems = [
    'Apples', 'Bananas', 'Oranges', 'Tomatoes', 'Carrots', 'Potatoes',
    'Onions', 'Garlic', 'Spinach', 'Lettuce', 'Cucumber', 'Bell Peppers',
    'Milk', 'Cheese', 'Yogurt', 'Butter', 'Eggs', 'Bread', 'Pasta',
    'Rice', 'Beans', 'Canned Tomatoes', 'Canned Beans', 'Cereal',
    'Crackers', 'Nuts', 'Dried Fruits', 'Frozen Vegetables', 'Frozen Fruits'
  ];

  const categoryImages = {
    fruits: [
      "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=300&fit=crop"
    ],
    vegetables: [
      "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop"
    ],
    bread: [
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop"
    ],
    dairy: [
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop"
    ],
    canned: [
      "https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=400&h=300&fit=crop"
    ],
    frozen: [
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop"
    ],
    pantry: [
      "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=400&h=300&fit=crop"
    ],
    other: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop"
    ]
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Handle category change
    if (name === 'category') {
      if (value === 'custom') {
        setShowCustomCategory(true);
      } else {
        setShowCustomCategory(false);
        setFormData(prev => ({ ...prev, customCategory: '' }));
      }
    }
  };

  const handleAllergenChange = (allergen) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens.includes(allergen)
        ? prev.allergens.filter(a => a !== allergen)
        : [...prev.allergens, allergen]
    }));
  };

  const handleDietaryRestrictionChange = (restriction) => {
    setFormData(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(restriction)
        ? prev.dietaryRestrictions.filter(r => r !== restriction)
        : [...prev.dietaryRestrictions, restriction]
    }));
  };

  const handleImageSelection = (imageUrl) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.includes(imageUrl)
        ? prev.images.filter(img => img !== imageUrl)
        : [...prev.images, imageUrl]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (formData.category === 'custom' && !formData.customCategory.trim()) {
      newErrors.customCategory = 'Custom category name is required';
    }
    
    if (!formData.quantity.trim()) {
      newErrors.quantity = 'Quantity is required';
    }
    
    if (!formData.condition) {
      newErrors.condition = 'Condition is required';
    }
    
    if (!formData.location.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.location.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.location.state.trim()) {
      newErrors.state = 'State is required';
    }
    
    if (!formData.location.zipCode.trim()) {
      newErrors.zipCode = 'Zip code is required';
    }
    
    // Check if expiry date is in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (formData.expiryDate <= today) {
      newErrors.expiryDate = 'Expiry date must be in the future';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setSuccess(false);
    
    try {
      const finalCategory = formData.category === 'custom' ? formData.customCategory : formData.category;
      const foodDataWithImages = {
        ...formData,
        category: finalCategory,
        images: formData.images.length > 0 ? formData.images : [categoryImages[formData.category]?.[0] || categoryImages.other[0]]
      };
      
      const response = await axios.post('http://localhost:5000/api/food', foodDataWithImages);
      setSuccess(true);
      setTimeout(() => {
        navigate('/my-donations');
      }, 2000);
    } catch (error) {
      console.error('Error creating food donation:', error);
      const message = error.response?.data?.message || 'Failed to create donation';
      setErrors({ submit: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Donate Food
          </Typography>
          
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
            Share surplus food with your community. Help reduce waste and support those in need.
          </Typography>

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Food donation created successfully! Redirecting to your donations...
            </Alert>
          )}

          {errors.submit && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.submit}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Autocomplete
                  freeSolo
                  options={commonFoodItems}
                  value={formData.title}
                  onChange={(event, newValue) => {
                    setFormData(prev => ({ ...prev, title: newValue || '' }));
                    if (errors.title) {
                      setErrors(prev => ({ ...prev, title: '' }));
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      fullWidth
                      label="Food Item Title"
                      error={!!errors.title}
                      helperText={errors.title || "Type or select from common food items"}
                      disabled={loading}
                      placeholder="e.g., Fresh Apples, Canned Beans, etc."
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={3}
                  id="description"
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  error={!!errors.description}
                  helperText={errors.description}
                  disabled={loading}
                  placeholder="Describe the food item, any special notes, brand, etc."
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={!!errors.category}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    label="Category"
                    onChange={handleChange}
                    disabled={loading}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.value} value={category.value}>
                        {category.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {showCustomCategory && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Custom Category Name"
                    name="customCategory"
                    value={formData.customCategory}
                    onChange={handleChange}
                    error={!!errors.customCategory}
                    helperText={errors.customCategory}
                    disabled={loading}
                    placeholder="e.g., Homemade, Local Produce, etc."
                  />
                </Grid>
              )}
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="brand"
                  label="Brand (Optional)"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="e.g., Organic Valley, Local Bakery"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Packaging Type</InputLabel>
                  <Select
                    name="packaging"
                    value={formData.packaging}
                    label="Packaging Type"
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <MenuItem value="">Select packaging type</MenuItem>
                    {packagingTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="quantity"
                  label="Quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  error={!!errors.quantity}
                  helperText={errors.quantity}
                  disabled={loading}
                  placeholder="e.g., 5 apples, 2 cans, 1 loaf"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={!!errors.condition}>
                  <InputLabel>Condition</InputLabel>
                  <Select
                    name="condition"
                    value={formData.condition}
                    label="Condition"
                    onChange={handleChange}
                    disabled={loading}
                  >
                    {conditions.map((condition) => (
                      <MenuItem key={condition.value} value={condition.value}>
                        {condition.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Expiry Date"
                    value={formData.expiryDate}
                    onChange={(newValue) => {
                      setFormData(prev => ({ ...prev, expiryDate: newValue }));
                      if (errors.expiryDate) {
                        setErrors(prev => ({ ...prev, expiryDate: '' }));
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        required
                        error={!!errors.expiryDate}
                        helperText={errors.expiryDate}
                        disabled={loading}
                      />
                    )}
                    minDate={new Date()}
                  />
                </LocalizationProvider>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Allergens (Select all that apply)
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {allergenOptions.map((allergen) => (
                    <Chip
                      key={allergen.value}
                      label={allergen.label}
                      onClick={() => handleAllergenChange(allergen.value)}
                      color={formData.allergens.includes(allergen.value) ? 'primary' : 'default'}
                      variant={formData.allergens.includes(allergen.value) ? 'filled' : 'outlined'}
                      clickable
                      disabled={loading}
                    />
                  ))}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Dietary Restrictions (Select all that apply)
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {dietaryRestrictions.map((restriction) => (
                    <Chip
                      key={restriction.value}
                      label={restriction.label}
                      onClick={() => handleDietaryRestrictionChange(restriction.value)}
                      color={formData.dietaryRestrictions.includes(restriction.value) ? 'primary' : 'default'}
                      variant={formData.dietaryRestrictions.includes(restriction.value) ? 'filled' : 'outlined'}
                      clickable
                      disabled={loading}
                    />
                  ))}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Typography variant="h6">
                    Food Images (Optional)
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => setShowImageDialog(true)}
                    disabled={loading}
                  >
                    Select Images
                  </Button>
                </Box>
                {formData.images.length > 0 && (
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {formData.images.map((image, index) => (
                      <Card key={index} sx={{ width: 100, height: 80 }}>
                        <CardMedia
                          component="img"
                          height="60"
                          image={image}
                          alt={`Food image ${index + 1}`}
                        />
                        <CardContent sx={{ p: 0.5 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleImageSelection(image)}
                            sx={{ p: 0 }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  id="pickupInstructions"
                  label="Pickup Instructions (Optional)"
                  name="pickupInstructions"
                  value={formData.pickupInstructions}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="e.g., Ring doorbell, call when arriving, etc."
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="isUrgent"
                      checked={formData.isUrgent}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  }
                  label="Mark as urgent (expiring soon or special circumstances)"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Pickup Location
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="address"
                  label="Street Address"
                  name="location.address"
                  value={formData.location.address}
                  onChange={handleChange}
                  error={!!errors.address}
                  helperText={errors.address}
                  disabled={loading}
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  id="city"
                  label="City"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleChange}
                  error={!!errors.city}
                  helperText={errors.city}
                  disabled={loading}
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  id="state"
                  label="State"
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleChange}
                  error={!!errors.state}
                  helperText={errors.state}
                  disabled={loading}
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  id="zipCode"
                  label="Zip Code"
                  name="location.zipCode"
                  value={formData.location.zipCode}
                  onChange={handleChange}
                  error={!!errors.zipCode}
                  helperText={errors.zipCode}
                  disabled={loading}
                />
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ flexGrow: 1 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Create Donation'}
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/food')}
                disabled={loading}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Image Selection Dialog */}
      <Dialog
        open={showImageDialog}
        onClose={() => setShowImageDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Select Food Images</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Choose images that best represent your food item. You can select multiple images.
          </Typography>
          <Grid container spacing={2}>
            {formData.category && categoryImages[formData.category] ? (
              categoryImages[formData.category].map((image, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      border: formData.images.includes(image) ? 2 : 0,
                      borderColor: 'primary.main'
                    }}
                    onClick={() => handleImageSelection(image)}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={image}
                      alt={`Food option ${index + 1}`}
                    />
                    <CardContent sx={{ p: 1, textAlign: 'center' }}>
                      <Typography variant="body2">
                        {formData.images.includes(image) ? 'Selected' : 'Click to select'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography color="text.secondary">
                  Please select a category first to see available images.
                </Typography>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowImageDialog(false)}>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AddFood; 