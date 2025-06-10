import { DesignServices } from '@mui/icons-material';
import {
  Box, Button, Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import hero1 from '../assets/hero1.jpeg';
import hero2 from '../assets/hero2.jpg';
import hero3 from '../assets/hero3.jpg';

const rotatingImages = [hero1, hero2, hero3];

const RotatingHeroSection: React.FC = () => {
  const [bgIndex, setBgIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % rotatingImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: '600px',
        backgroundImage: `url(${rotatingImages[bgIndex]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'background-image 1s ease-in-out',
      }}
    >
      {/* Dark overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.4))',
          zIndex: 1,
        }}
      />
      {/* Content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: 'white',
          px: 2,
          py: { xs: 10, md: 14 },
          maxWidth: '900px',
          mx: 'auto',
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 900,
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            letterSpacing: '-1px',
          }}
        >
          Create Personalized Gifts That Leave a Lasting Impression
        </Typography>
        <Typography
          variant="h6"
          paragraph
          sx={{ maxWidth: 700, color: '#eee', fontWeight: 400 }}
        >
          Design unique gifts for your loved ones with our easy-to-use customization tools.
          Make every occasion special.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 4 }}>
          <Button
            component={RouterLink}
            to="/customize"
            variant="contained"
            size="large"
            onClick={(e) => {
              const isLoggedIn = localStorage.getItem('giftcraftUser');
              if (!isLoggedIn) {
                e.preventDefault();
                navigate('/login');
              }
            }}
            sx={{
              px: 4,
              fontWeight: 700,
              backgroundColor: '#F46A6A',
              '&:hover': { backgroundColor: '#e05555' },
            }}
            startIcon={<DesignServices />}
          >
            Start Customizing
          </Button>
          <Button
            component={RouterLink}
            to="/products"
            variant="outlined"
            size="large"
            sx={{
              px: 4,
              fontWeight: 700,
              color: 'white',
              borderColor: 'white',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)',
                borderColor: 'white',
              },
            }}
          >
            Browse Products
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default RotatingHeroSection;
