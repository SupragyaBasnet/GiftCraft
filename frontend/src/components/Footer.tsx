import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  Email,
  Phone,
  LocationOn,
} from '@mui/icons-material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'white',
        color: '#111',
        py: 6,
        mt: 8,
        borderTop: '1px solid #eee',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom sx={{ color: '#111', fontWeight: 700, mb: 2 }}>
              GiftCraft 🎁
            </Typography>
            <Typography variant="body2" sx={{ color: '#111', mb: 1 }}>
              Create personalized gifts for your loved ones. Customize products with your own designs and make every gift special.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom sx={{ color: '#111', fontWeight: 700, mb: 2 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/" color="inherit" underline="hover" sx={{ color: '#111' }}>
                Home
              </Link>
              <Link href="/products" color="inherit" underline="hover" sx={{ color: '#111' }}>
                Products
              </Link>
              <Link href="/about-us" color="inherit" underline="hover" sx={{ color: '#111' }}>
                About Us
              </Link>
              <Link href="/cart" color="inherit" underline="hover" sx={{ color: '#111' }}>
                Cart
              </Link>
              <Link href="/help" color="inherit" underline="hover" sx={{ color: '#111' }}>
                Help
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom sx={{ color: '#111', fontWeight: 700, mb: 2 }}>
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone fontSize="small" />
                <Typography variant="body2" sx={{ color: '#111', mb: 1 }}>+977 9816315056</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email fontSize="small" />
                <Typography variant="body2" sx={{ color: '#111', mb: 1 }}>info@giftcraft.com</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn fontSize="small" />
                <Typography variant="body2" sx={{ color: '#111', mb: 1 }}>Dharmabari, Kathmandu</Typography>
              </Box>
            </Box>
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <IconButton color="inherit" sx={{ color: '#111' }}>
                <Facebook />
              </IconButton>
              <IconButton color="inherit" sx={{ color: '#111' }}>
                <Twitter />
              </IconButton>
              <IconButton color="inherit" sx={{ color: '#111' }}>
                <Instagram />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Typography variant="body2" align="center" sx={{ color: '#111' }}>
            © {new Date().getFullYear()} GiftCraft. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 