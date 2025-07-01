import {
  Container, Grid,
  Paper, Typography, Box, useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';
import aboutUsImg from '../assets/aboutus.jpg';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import PublicIcon from '@mui/icons-material/Public';

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.3,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
};

const AboutUs: React.FC = () => {
  const theme = useTheme();
  return (
    <Box sx={{ bgcolor: '#fff6f6', minHeight: '100vh', py: { xs: 4, md: 8 } }}>
      {/* Hero Section */}
      <Container maxWidth="lg">
        <Paper
          elevation={6}
          sx={{
            p: { xs: 2, md: 5 },
            mb: 8,
            borderRadius: 6,
            background: 'linear-gradient(135deg, #ffeaea 0%, #fff6f6 100%)',
            boxShadow: '0 8px 32px rgba(224,85,85,0.08)',
          }}
        >
          <Grid container spacing={4} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={5}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <img src={aboutUsImg} alt="About GiftCraft" style={{ width: '100%', maxWidth: 340, borderRadius: 24, boxShadow: '0 4px 24px rgba(224,85,85,0.10)' }} />
              </Box>
            </Grid>
            <Grid item xs={12} md={7}>
              <Typography
                variant="h2"
                component="h1"
                align="left"
                sx={{ fontWeight: 900, letterSpacing: '-1px', fontSize: { xs: '2.2rem', md: '2.8rem' }, color: '#222', mb: 1 }}
              >
                About GiftCraft
              </Typography>
              <Box sx={{ width: 56, height: 5, bgcolor: 'rgb(224,85,85)', borderRadius: 2, mb: 3 }} />
              <Typography variant="h6" sx={{ color: '#333', maxWidth: 600 }}>
                GiftCraft is your destination for thoughtful, personalized gifts that tell your story. Whether you're celebrating birthdays, anniversaries, or any special occasion, we help you design unique products with ease.
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Mission & Why Choose Us */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 4, height: '100%', bgcolor: '#fff', boxShadow: '0 2px 12px 0 rgba(224,85,85,0.07)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EmojiObjectsIcon sx={{ color: 'rgb(224,85,85)', fontSize: 32, mr: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, fontSize: { xs: '1.5rem', md: '2rem' }, color: '#222' }}>
                  Our Mission
                </Typography>
              </Box>
              <Box sx={{ width: 40, height: 4, bgcolor: 'rgb(224,85,85)', borderRadius: 2, mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                We believe gifts should be meaningful and memorable. Our platform empowers you to customize everything from mugs and t-shirts to jewelry and stationery, blending creativity with convenience.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 4, height: '100%', bgcolor: '#fff', boxShadow: '0 2px 12px 0 rgba(224,85,85,0.07)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PublicIcon sx={{ color: 'rgb(224,85,85)', fontSize: 32, mr: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, fontSize: { xs: '1.5rem', md: '2rem' }, color: '#222' }}>
                  Why Choose Us?
                </Typography>
              </Box>
              <Box sx={{ width: 40, height: 4, bgcolor: 'rgb(224,85,85)', borderRadius: 2, mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                Based in Nepal, we deliver quality and care in every product. With a user-friendly interface and fast customer support, GiftCraft makes personalization simple and enjoyable—no design skills needed!
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutUs;
