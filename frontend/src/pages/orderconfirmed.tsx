import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Box, CircularProgress, Paper } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { base64Decode } from 'esewajs';
import Confetti from 'react-confetti';
import { useCart } from '../context/CartContext';

const OrderConfirmed: React.FC = () => {
  const location = useLocation();
  const { clearCart, removeFromCart } = useCart();
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const data = params.get('data');
    if (data) {
      try {
        const decoded = base64Decode(data);
        setPaymentInfo(decoded);
        setLoading(false);
      } catch (err) {
        setError('Failed to decode payment information.');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [location.search]);

  useEffect(() => {
    // Only perform cart removal/clearing if paymentInfo is present (eSewa)
    if (paymentInfo) {
      const params = new URLSearchParams(location.search);
      const singleItemId = params.get('singleItemId');
      if (singleItemId) {
        const cartItem = JSON.parse(localStorage.getItem('giftcraftCart') || '[]').find((item: any) => item.cartItemId === singleItemId || item.id === singleItemId);
        if (cartItem) {
          removeFromCart(cartItem.id);
        } else {
          removeFromCart(singleItemId);
        }
      } else {
        clearCart();
      }
    }
  }, [paymentInfo]);

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Verifying payment...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 8 }, minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Confetti width={windowSize.width} height={windowSize.height} numberOfPieces={250} recycle={false} />
      <Paper elevation={4} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, width: '100%', maxWidth: 500, textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" color="success.main" gutterBottom sx={{ fontWeight: 700, fontSize: { xs: '2rem', md: '2.5rem' } }}>
          Order Confirmed!
        </Typography>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
          Thank you for your order. Your payment was successful and your order has been placed!
        </Typography>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
        )}
        {paymentInfo && (
          <Box sx={{ mb: 4, p: { xs: 2, md: 3 }, border: '1px solid #eee', borderRadius: 2, background: '#f9f9f9', textAlign: 'left', overflowX: 'auto' }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1, textAlign: 'center' }}>Transaction Details:</Typography>
            {Object.entries(paymentInfo).map(([key, value]) => (
              <Typography key={key} variant="body2" sx={{ wordBreak: 'break-all' }}>
                <strong>{key.replace(/_/g, ' ')}:</strong> {String(value)}
              </Typography>
            ))}
          </Box>
        )}
        <Button 
          variant="contained" 
          color="primary" 
          component={RouterLink} 
          to="/" 
          size="large" 
          sx={{ 
            mt: 2, 
            fontWeight: 700,borderRadius: 7,width:200,
            backgroundColor: 'rgb(255,106,106)', 
            '&:hover': { backgroundColor: 'rgb(220,80,80)' } 
          }}
        >
          GO TO HOME
        </Button>
      </Paper>
    </Container>
  );
};

export default OrderConfirmed; 