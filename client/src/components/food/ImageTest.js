import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const ImageTest = () => {
  const testImages = [
    "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop"
  ];

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ mt: 4, mb: 3 }}>
        Image Test
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3 }}>
        Testing if images load correctly:
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {testImages.map((image, index) => (
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
              border: '1px solid #e0e0e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography variant="body2" sx={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
              Image {index + 1}
            </Typography>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default ImageTest; 