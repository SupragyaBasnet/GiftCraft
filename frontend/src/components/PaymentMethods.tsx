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

const PaymentMethods: React.FC = () => {
  const methods = [
    {
      icon: <Payment sx={{ fontSize: 40 }} />,
      title: 'eSewa',
      description: 'Pay securely through eSewa',
    },
    {
      icon: <AccountBalanceWallet sx={{ fontSize: 40 }} />,
      title: 'Khalti',
      description: 'Quick payment through Khalti',
    },
    {
      icon: <PhoneAndroid sx={{ fontSize: 40 }} />,
      title: 'IME Pay',
      description: 'Pay securely through IME Pay',
    },
    {
      icon: <DeliveryDining sx={{ fontSize: 40 }} />,
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
          sx={{ fontWeight: 900, color: '#111', mb: 6, letterSpacing: '-1px', fontSize: { xs: '2.2rem', md: '2.8rem' } }}
        >
          Payment Methods
        </Typography>
        <Grid container spacing={4}>
          {methods.map((method, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
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

export default PaymentMethods; 