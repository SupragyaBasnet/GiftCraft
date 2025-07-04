import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
} from '@mui/material';
import {
  Payment,
  AccountBalanceWallet,
  PhoneAndroid,
  DeliveryDining,
} from '@mui/icons-material';
import esewaLogo from '../assets/esewa_logo.jpg';
import khaltiLogo from '../assets/khalti_logo.png';
import imepayLogo from '../assets/imepay_logo.jpg';

const PaymentMethods: React.FC = () => {
  const methods = [
    {
      icon: (
        <Box sx={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          bgcolor: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 1,
          mb: 0.5,
        }}>
          <Box component="img" src={esewaLogo} alt="eSewa" sx={{ height: 28, width: 28, objectFit: 'contain' }} />
        </Box>
      ),
      title: 'eSewa',
      description: 'Pay securely through eSewa',
    },
    {
      icon: (
        <Box sx={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          bgcolor: '#238A3B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 0.5,
        }}>
          <Payment sx={{ fontSize: 32, color: 'white' }} />
        </Box>
      ),
      title: 'Cash on Delivery',
      description: 'Pay with cash upon delivery',
    },
  ];

  return (
    <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h2"
          gutterBottom
          align="center"
          sx={{ fontWeight: 900, color: '#111', mb: 2, letterSpacing: '-1px', fontSize: { xs: '2rem', md: '2.4rem' } }}
        >
          Payment Methods
        </Typography>
        <div className="heading-dash" />
        <Grid container spacing={4} justifyContent="center">
          {methods.map((method, index) => (
            <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Paper
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  borderRadius: 4,
                  boxShadow: '0 2px 12px 0 rgba(0,0,0,0.04)',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 6px 24px 0 rgba(244,106,106,0.10)',
                  },
                }}
              >
                <Box sx={{ color: '#F46A6A', mb: 2 }}>
                  {method.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  {method.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {method.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

const WhyChooseGiftCraft: React.FC = () => {
  return (
    <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h2"
          gutterBottom
          align="center"
          sx={{ fontWeight: 900, color: '#111', mb: 2, letterSpacing: '-1px', fontSize: { xs: '2rem', md: '2.4rem' } }}
        >
          Why Choose GiftCraft?
        </Typography>
        <div className="heading-dash" />
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 3, borderRadius: 4, textAlign: 'center', height: '100%' }}>
              <Box sx={{ fontSize: 48, color: '#F46A6A', mb: 2 }}>🎁</Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Personalized Gifts
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create unique, custom gifts for your loved ones with your own designs, photos, and messages.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 3, borderRadius: 4, textAlign: 'center', height: '100%' }}>
              <Box sx={{ fontSize: 48, color: '#F46A6A', mb: 2 }}>🚚</Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Fast & Reliable Delivery
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We deliver your gifts quickly and safely to your doorstep, anywhere in Nepal.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 3, borderRadius: 4, textAlign: 'center', height: '100%' }}>
              <Box sx={{ fontSize: 48, color: '#F46A6A', mb: 2 }}>⭐</Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Quality & Satisfaction
              </Typography>
              <Typography variant="body2" color="text.secondary">
                High-quality products and a satisfaction guarantee—your happiness is our priority!
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

const SpecialOffers: React.FC = () => {
  return (
    <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h2"
          gutterBottom
          align="center"
          sx={{ fontWeight: 900, color: '#111', mb: 2, letterSpacing: '-1px', fontSize: { xs: '2rem', md: '2.4rem' } }}
        >
          Special Offers
        </Typography>
        <div className="heading-dash" />
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 3, borderRadius: 4, textAlign: 'center', height: '100%' }}>
              <Box sx={{ fontSize: 48, color: '#F46A6A', mb: 2 }}>🔥</Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Flash Sale: Up to 30% Off!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enjoy huge discounts on select personalized gifts. Limited time only—shop now and save big!
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 3, borderRadius: 4, textAlign: 'center', height: '100%' }}>
              <Box sx={{ fontSize: 48, color: '#F46A6A', mb: 2 }}>🎉</Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Buy 1 Get 1 Free
              </Typography>
              <Typography variant="body2" color="text.secondary">
                For a limited time, buy one custom mug or keychain and get another absolutely free!
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 3, borderRadius: 4, textAlign: 'center', height: '100%' }}>
              <Box sx={{ fontSize: 48, color: '#F46A6A', mb: 2 }}>💸</Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Free Delivery Over Rs. 2000
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Get free delivery on all orders above Rs. 2000. Shop more, save more!
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default SpecialOffers; 