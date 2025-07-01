import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Button, TextField, Alert, Card, CardContent, CardActionArea, Dialog, DialogTitle, DialogContent, DialogActions, Rating } from '@mui/material';
import { Payment as PaymentIcon, Save, Add, Remove } from '@mui/icons-material';
import Confetti from 'react-confetti';
import { useNavigate } from 'react-router-dom';

// Import the new CustomizedProductImage component
import CustomizedProductImage from '../components/CustomizedProductImage';

// Import payment logos
import esewaLogo from '../assets/esewa_logo.jpg'; // Assuming path and filename
import khaltiLogo from '../assets/khalti_logo.png'; // Assuming path and filename
import imepayLogo from '../assets/imepay_logo.png'; // Assuming path and filename

// Simple client-side price map (placeholder) - Needed for calculating subtotal and delivery charge
const productPrices: Record<string, number> = {
  tshirt: 500,
  mug: 300,
  phonecase: 800,
  waterbottle: 600,
  cap: 400,
  notebook: 700,
  pen: 200,
  keychain: 200,
  frame: 3000,
  pillowcase: 900,
};

// Placeholder delivery charge
const DELIVERY_CHARGE = 100; // Example fixed delivery charge

const CheckoutPage: React.FC = () => {
  const [checkoutItem, setCheckoutItem] = useState<any>(null); // Single item
  const [checkoutCart, setCheckoutCart] = useState<any[] | null>(null); // Multiple items
  const [quantities, setQuantities] = useState<{ [id: string]: number }>({}); // For cart items
  const [quantity, setQuantity] = useState(1); // For single item
  const [address, setAddress] = useState('');
  const [addressError, setAddressError] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [orderConfirmedMessage, setOrderConfirmedMessage] = useState('');
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Check for cart checkout first
    const savedCart = localStorage.getItem('giftcraftCheckoutCart');
    if (savedCart) {
      try {
        const cart = JSON.parse(savedCart);
        setCheckoutCart(cart);
        // Set default quantities for each item
        const qtys: { [id: string]: number } = {};
        cart.forEach((item: any) => {
          qtys[item.id] = item.quantity || 1;
        });
        setQuantities(qtys);
        return;
      } catch (e) {
        console.error('Failed to load checkout cart from localStorage', e);
        localStorage.removeItem('giftcraftCheckoutCart');
        navigate('/');
      }
    }
    // Fallback to single item checkout
    const savedItem = localStorage.getItem('giftcraftCheckoutItem');
    if (savedItem) {
      try {
        const item = JSON.parse(savedItem);
        setCheckoutItem(item);
        setQuantity(item.quantity || 1);
      } catch (e) {
        console.error('Failed to load checkout item from localStorage', e);
        localStorage.removeItem('giftcraftCheckoutItem');
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  // --- Price calculations ---
  let itemSubtotal = 0;
  let itemTotal = 0;
  if (checkoutCart) {
    itemSubtotal = checkoutCart.reduce((sum, item) => sum + (productPrices[item.productType] || 0) * (quantities[item.id] || 1), 0);
    itemTotal = itemSubtotal + (itemSubtotal > 0 ? DELIVERY_CHARGE : 0);
  } else if (checkoutItem) {
    itemSubtotal = (productPrices[checkoutItem.productType] || 0) * quantity;
    itemTotal = itemSubtotal + DELIVERY_CHARGE;
  }

  // --- Quantity handlers ---
  const handleQuantityChange = (amount: number) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };
  const handleCartQuantityChange = (id: string, amount: number) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, (prev[id] || 1) + amount) }));
  };

  // --- Address and payment logic ---
  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
    setAddressError('');
  };
  const validateAddress = () => {
    if (!address.trim()) {
      setAddressError('Address is required');
      return false;
    }
    return true;
  };
  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method);
  };
  const isConfirmButtonEnabled = address.trim() !== '' && selectedPaymentMethod !== null;

  // --- Order confirmation logic ---
  const handleConfirmOrder = () => {
    if (!validateAddress()) return;
    const existingOrderHistory = localStorage.getItem('giftcraftOrderHistory');
    let orderHistory = existingOrderHistory ? JSON.parse(existingOrderHistory) : [];
    if (checkoutCart) {
      // Multi-item order
      const newOrder = {
        id: Date.now(),
        date: new Date().toISOString(),
        items: checkoutCart.map(item => ({ ...item, quantity: quantities[item.id] || 1 })),
        address,
        paymentMethod: selectedPaymentMethod,
        total: itemTotal,
        status: 'Processing',
        review: null,
        rating: null,
      };
      orderHistory.push(newOrder);
      localStorage.setItem('giftcraftOrderHistory', JSON.stringify(orderHistory));
      setOrderConfirmedMessage(`Your order for ${checkoutCart.length} items has been placed using ${selectedPaymentMethod}.\n\nThank you for trusting and choosing us!`);
      localStorage.removeItem('giftcraftCheckoutCart');
      localStorage.removeItem('giftcraftCart'); // Clear cart after order
    } else if (checkoutItem) {
      // Single item order (existing logic)
    const newOrder = {
        id: Date.now(),
        date: new Date().toISOString(),
        item: { ...checkoutItem, quantity },
        address,
        paymentMethod: selectedPaymentMethod,
        total: itemTotal,
        status: 'Processing',
        review: null,
        rating: null,
    };
    orderHistory.push(newOrder);
    localStorage.setItem('giftcraftOrderHistory', JSON.stringify(orderHistory));
    setOrderConfirmedMessage(`Your order has been placed using ${selectedPaymentMethod}.\n\nThank you for trusting and choosing us!`);
    localStorage.removeItem('giftcraftCheckoutItem');
    }
  };

  // Handle opening and closing the review modal
  const handleOpenReviewModal = () => {
    setOpenReviewModal(true);
  };

  const handleCloseReviewModal = () => {
    setOpenReviewModal(false);
    setReviewText(''); // Clear review text on close
    setReviewRating(null); // Clear rating on close
  };

  // Handle submitting the review
  const handleSubmitReview = () => {
    console.log('Submitted Review:', { review: reviewText, rating: reviewRating }); // Log review and rating

    // Get existing order history from localStorage
    const existingOrderHistory = localStorage.getItem('giftcraftOrderHistory');
    let orderHistory = existingOrderHistory ? JSON.parse(existingOrderHistory) : [];

    // Find the most recent order (assuming the review is for the last placed order)
    // In a real app, you might associate the review with a specific order ID
    const mostRecentOrderIndex = orderHistory.length > 0 ? orderHistory.length - 1 : -1;

    if (mostRecentOrderIndex !== -1) {
      // Update the review and rating for the most recent order
      orderHistory[mostRecentOrderIndex].review = reviewText;
      orderHistory[mostRecentOrderIndex].rating = reviewRating;

      // Save the updated order history back to localStorage
      localStorage.setItem('giftcraftOrderHistory', JSON.stringify(orderHistory));
      console.log('Review added to most recent order in localStorage.'); // Log success
    } else {
      console.error('No recent order found in localStorage to add review.'); // Log error if no orders
    }

    // In a real app, you would send this review and rating to your backend
    handleCloseReviewModal(); // Close modal after submission
    // Optionally clear the checkout item from localStorage if a review is the final step
    // localStorage.removeItem('giftcraftCheckoutItem'); // This is now handled in handleConfirmOrder
  };

  if (!checkoutCart && !checkoutItem) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper elevation={4} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5">Redirecting...</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={4} sx={{ p: { xs: 2, md: 4 }, mb: 4, borderRadius: 4 }}>
        {/* Conditionally render Checkout title */}
        {!orderConfirmedMessage && (
          <Typography variant="h4" fontWeight={900} gutterBottom align="center">
            Checkout
          </Typography>
        )}

        {/* Order Confirmed Section - Shown when order is confirmed */}
        {orderConfirmedMessage ? (
          <Box 
            sx={{
              textAlign: 'center', 
              mt: 3, 
              opacity: 0, // Start invisible for animation
              animation: 'fadeIn 0.5s ease-in-out forwards', // Apply fade-in animation
              '@keyframes fadeIn': {
                '0%': { opacity: 0 },
                '100%': { opacity: 1 },
              },
            }}
          >
            {/* Place your party burst animation component here */}
            <Confetti width={window.innerWidth} height={window.innerHeight} />

            <Typography variant="h5" color="success.main" fontWeight={700} gutterBottom>
              Order Confirmed!
            </Typography>
            {/* Split message by newline for multiple paragraphs */}
            {orderConfirmedMessage.split('\n\n').map((paragraph, index) => (
              <Typography key={index} variant="body1" gutterBottom={index < orderConfirmedMessage.split('\n\n').length - 1}>
                {paragraph}
              </Typography>
            ))}
            {/* You can add more details like order number here in a real app */}

          </Box>
        ) : (
          /* Content to show BEFORE order is confirmed */
          <>
            {/* Item Details Summary */}
            <Box sx={{ mb: 3, borderBottom: '1px solid #eee', pb: 2 }}>
              <Typography variant="h6" fontWeight={700}>Item Summary:</Typography>
              {checkoutCart ? (
                <Box>
                  {checkoutCart.map((item) => (
                    <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                      <Box sx={{ width: 80, height: 80, mr: 2 }}>
                        <CustomizedProductImage 
                          baseImage={item.image} 
                          elements={item.elements || []}
                          color={item.color || '#ffffff'}
                          productType={item.productType}
                        />
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={700}>
                          {item.productType.charAt(0).toUpperCase() + item.productType.slice(1)}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <Typography variant="subtitle2" sx={{ mr: 1 }}>Quantity:</Typography>
                          <Button size="small" onClick={() => handleCartQuantityChange(item.id, -1)}><Remove /></Button>
                          <Typography sx={{ mx: 1 }}>{quantities[item.id] || 1}</Typography>
                          <Button size="small" onClick={() => handleCartQuantityChange(item.id, 1)}><Add /></Button>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              ) : checkoutItem && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <Box sx={{ width: 80, height: 80, mr: 2 }}>
                  <CustomizedProductImage 
                    baseImage={checkoutItem.image} 
                      elements={checkoutItem.elements || []}
                      color={checkoutItem.color || '#ffffff'}
                      productType={checkoutItem.productType}
                  />
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={700}>
                      {checkoutItem.productType.charAt(0).toUpperCase() + checkoutItem.productType.slice(1)}
                  </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Typography variant="subtitle2" sx={{ mr: 1 }}>Quantity:</Typography>
                      <Button size="small" onClick={() => handleQuantityChange(-1)}><Remove /></Button>
                      <Typography sx={{ mx: 1 }}>{quantity}</Typography>
                      <Button size="small" onClick={() => handleQuantityChange(1)}><Add /></Button>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>

            {/* Price Breakdown */}
            <Box sx={{ mb: 3, borderBottom: '1px solid #eee', pb: 2 }}>
              <Typography variant="h6" fontWeight={700}>Order Summary:</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Typography variant="body1">Subtotal:</Typography>
                <Typography variant="body1">Rs. {itemSubtotal}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                <Typography variant="body1">Delivery Charge:</Typography>
                <Typography variant="body1">Rs. {DELIVERY_CHARGE}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Typography variant="h6" fontWeight={700}>Total:</Typography>
                <Typography variant="h6" fontWeight={700}>Rs. {itemTotal}</Typography>
              </Box>
            </Box>

            {/* Address Section */}
            <Box sx={{ mb: 3, borderBottom: '1px solid #eee', pb: 2 }}>
              <Typography variant="h6" fontWeight={700}>Delivery Address:</Typography>
              {addressError && (
                <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                  {addressError}
                </Alert>
              )}
              <Box sx={{ mt: 2 }}>
                <TextField
                  required
                  label="Delivery Address"
                  value={address}
                  onChange={handleAddressChange}
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Enter your complete delivery address"
                  error={!!addressError}
                  helperText={addressError}
                />
              </Box>
            </Box>

            {/* Payment Methods Section */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Choose Payment Method:</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mt: 2 }}>
                {/* eSewa */}
                <Card 
                  elevation={2} 
                  sx={{
                    border: selectedPaymentMethod === 'eSewa' ? '2px solid #F46A6A' : '1px solid #eee', // Highlight selected
                    '&:hover': {
                      borderColor: '#F46A6A',
                      boxShadow: 3
                    }
                  }}
                >
                  <CardActionArea onClick={() => handlePaymentMethodSelect('eSewa')}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
                      {/* Use actual logo */}
                      <Box sx={{ 
                        width: 40, 
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Box 
                          component="img" 
                          src={esewaLogo} 
                          alt="eSewa Logo" 
                          sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        />
                      </Box>
                      <Box>
                        <Typography variant="h6" fontWeight={600}>eSewa</Typography>
                        <Typography variant="body2" color="text.secondary">Digital Wallet</Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>

                {/* Khalti */}
                <Card 
                  elevation={2} 
                  sx={{
                    border: selectedPaymentMethod === 'Khalti' ? '2px solid #F46A6A' : '1px solid #eee', // Highlight selected
                    '&:hover': {
                      borderColor: '#F46A6A',
                      boxShadow: 3
                    }
                  }}
                >
                  <CardActionArea onClick={() => handlePaymentMethodSelect('Khalti')}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
                       {/* Use actual logo */}
                      <Box sx={{ 
                        width: 40, 
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Box 
                          component="img" 
                          src={khaltiLogo} 
                          alt="Khalti Logo" 
                          sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        />
                      </Box>
                      <Box>
                        <Typography variant="h6" fontWeight={600}>Khalti</Typography>
                        <Typography variant="body2" color="text.secondary">Digital Wallet</Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>

                {/* IME Pay */}
                <Card 
                  elevation={2} 
                  sx={{
                    border: selectedPaymentMethod === 'IME Pay' ? '2px solid #F46A6A' : '1px solid #eee', // Highlight selected
                    '&:hover': {
                      borderColor: '#F46A6A',
                      boxShadow: 3
                    }
                  }}
                >
                  <CardActionArea onClick={() => handlePaymentMethodSelect('IME Pay')}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
                       {/* Use actual logo */}
                      <Box sx={{ 
                        width: 40, 
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Box 
                          component="img" 
                          src={imepayLogo} 
                          alt="IME Pay Logo" 
                          sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        />
                      </Box>
                      <Box>
                        <Typography variant="h6" fontWeight={600}>IME Pay</Typography>
                        <Typography variant="body2" color="text.secondary">Digital Wallet</Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>

                {/* Cash on Delivery */}
                <Card 
                  elevation={2} 
                  sx={{
                    border: selectedPaymentMethod === 'Cash on Delivery' ? '2px solid #F46A6A' : '1px solid #eee', // Highlight selected
                    '&:hover': {
                      borderColor: '#F46A6A',
                      boxShadow: 3
                    }
                  }}
                >
                  <CardActionArea onClick={() => handlePaymentMethodSelect('Cash on Delivery')}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
                      {/* Use placeholder icon for COD */}
                      <Box sx={{ 
                        width: 40, 
                        height: 40, 
                        bgcolor: '#2E7D32', 
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                      }}>
                        <PaymentIcon />
                      </Box>
                      <Box>
                        <Typography variant="h6" fontWeight={600}>Cash on Delivery</Typography>
                        <Typography variant="body2" color="text.secondary">Pay when you receive</Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Box>
            </Box>

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
              {/* Confirm Order Button - Enabled when address and payment are selected */}
              <Button 
                variant="contained" 
                color="secondary" 
                size="large" 
                onClick={handleConfirmOrder}
                disabled={!isConfirmButtonEnabled}
              >
                Confirm Order
              </Button>
            </Box>
          </>
        )}

      </Paper>

      {/* Review Modal */}
      <Dialog open={openReviewModal} onClose={handleCloseReviewModal}>
        <DialogTitle>Leave a Review</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Typography component="legend">Your Rating</Typography>
            <Rating
              name="review-rating"
              value={reviewRating}
              onChange={(event, newValue) => {
                setReviewRating(newValue);
              }}
            />
            <TextField
              autoFocus
              margin="dense"
              label="Your Review"
              type="text"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReviewModal} color="secondary">Cancel</Button>
          <Button onClick={handleSubmitReview} color="primary" disabled={!reviewText.trim() || reviewRating === null}>Submit Review</Button> {/* Disable submit if no rating or review text */}
        </DialogActions>
      </Dialog>

    </Container>
  );
};

export default CheckoutPage; 