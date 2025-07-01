import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Divider,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { Link as RouterLink } from 'react-router-dom';

const Cart: React.FC = () => {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Your Cart is Empty
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Start adding some amazing personalized gifts to your cart!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          component={RouterLink}
          to="/products"
        >
          Browse Products
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 800, fontSize: { xs: '2rem', md: '2.2rem' }, color: '#111', mb: 0 }}>
        Your Cart
      </Typography>
      <div className="heading-dash" />
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {items.map((item) => (
            <Card key={item.id} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <CardMedia
                      component="img"
                      height="100"
                      image={item.image}
                      alt={item.name}
                      sx={{ objectFit: 'contain' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6">{item.name}</Typography>
                    {item.customization?.text && (
                      <Typography variant="body2" color="text.secondary">
                        Text: {item.customization.text}
                      </Typography>
                    )}
                    {item.customization?.color && (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mt: 1,
                        }}
                      >
                        <Typography variant="body2" sx={{ mr: 1 }}>
                          Color:
                        </Typography>
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            bgcolor: item.customization.color,
                            border: '1px solid #ccc',
                            borderRadius: '50%',
                          }}
                        />
                      </Box>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Typography variant="h6" color="primary">
                        ${item.price}
                      </Typography>
                      <IconButton
                        color="error"
                        onClick={() => removeItem(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Typography>Subtotal</Typography>
                  </Grid>
                  <Grid item>
                    <Typography>${totalPrice.toFixed(2)}</Typography>
                  </Grid>
                </Grid>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ mb: 2 }}>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Typography variant="h6">Total</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="h6">
                      ${totalPrice.toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                component={RouterLink}
                to="/checkout"
              >
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart; 