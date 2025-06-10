import React, { useState } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Grid, Button, Rating, Stack, Paper } from '@mui/material';
import { DesignServices, ShoppingCart } from '@mui/icons-material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { products, Product } from '../data/products';
console.log('Products data on load:', products);
import FavoriteIcon from '@mui/icons-material/Favorite';
import { keyframes } from '@mui/system';

function getProductStory(category: string) {
  switch (category) {
    case 'tshirts':
      return "A custom t-shirt is more than just clothing—it's a canvas for memories, inside jokes, and love. Every time they wear it, they'll feel your thoughtfulness close to their heart.";
    case 'mugs':
      return "A personalized mug turns every morning into a moment of connection. With every sip, your loved one will remember the warmth of your gesture.";
    case 'phonecases':
      return "A custom phone case is a daily companion, a reminder of your bond and creativity. It protects their phone and carries your message everywhere they go.";
    case 'waterbottles':
      return "A personalized water bottle is a gift of care—keeping them refreshed and reminding them of you with every sip, wherever life takes them.";
    case 'caps':
      return "A custom cap is a stylish way to say you care. Every time they step out, they'll carry a piece of your affection and personality.";
    case 'notebooks':
      return "A custom notebook is a place for dreams, plans, and memories. Every page turned is a new chapter in your shared story.";
    case 'pens':
      return "A personalized pen is more than a writing tool—it's a way to inspire, encourage, and remind them of your support with every word they write.";
    case 'keychains':
      return "A custom keychain is a small treasure that keeps you close, no matter where they go. It's a daily reminder of your special connection.";
    case 'frames':
      return "A custom photo frame turns moments into memories. It's a window to the happiest times, beautifully displayed for all to see.";
    case 'pillowcases':
      return "A personalized pillowcase brings comfort and warmth, wrapping your loved one in sweet dreams and the memory of your care.";
    default:
      return "A personalized gift is a story waiting to be told—a memory in the making, a gesture that lasts a lifetime.";
  }
}

// Define keyframes for floating/popping animation
const floatPop = keyframes`
  0% { transform: scale(0.8) translateY(0); opacity: 0.7; }
  30% { transform: scale(1.1) translateY(-10px); opacity: 1; }
  60% { transform: scale(1) translateY(-20px); opacity: 0.85; }
  100% { transform: scale(0.8) translateY(0); opacity: 0.7; }
`;

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = products.find(p => p.id === Number(id));
  if (!product) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>Product Not Found</Typography>
        <Button component={RouterLink} to="/products" variant="contained">Back to Products</Button>
      </Container>
    );
  }
  const images = product.images && product.images.length > 0 ? product.images : [product.image || ''];
  const [mainIdx, setMainIdx] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  // Pick 2 other products from the same category, or any 2 others
  let relatedProducts = products.filter(p => p.id !== product.id && p.category === product.category);
  if (relatedProducts.length < 2) {
    relatedProducts = products.filter(p => p.id !== product.id).slice(0, 2);
  } else {
    relatedProducts = relatedProducts.slice(0, 2);
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box
              component="img"
              src={images[mainIdx]}
              alt={product.name || ''}
              sx={{ width: '100%', maxWidth: 350, borderRadius: 4, boxShadow: 3, mb: 2, objectFit: 'contain', bgcolor: 'white' }}
            />
            {images.length > 1 && (
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mt: 1 }}>
                {images.map((img, idx) => (
                  <Box
                    key={idx}
                    component="img"
                    src={img || ''}
                    alt={product.name + '-thumb-' + idx || ''}
                    sx={{
                      width: 48,
                      height: 48,
                      objectFit: 'cover',
                      borderRadius: 2,
                      border: mainIdx === idx ? '2px solid #F46A6A' : '1px solid #eee',
                      cursor: 'pointer',
                      transition: 'border 0.2s',
                    }}
                    onClick={() => setMainIdx(idx)}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" fontWeight={900} gutterBottom>{product.name || 'Product Name'}</Typography>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <Rating value={product.rating} precision={0.5} readOnly size="medium" />
            <Typography variant="body2" color="text.secondary">({product.reviews || 0})</Typography>
          </Stack>
          <Typography variant="h5" color="primary" fontWeight={700} sx={{ mb: 2 }}>
            Rs. {product.price ? product.price.toLocaleString('en-IN') : 'N/A'}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>{product.description || 'No description available.'}</Typography>
          <Typography variant="subtitle2" color="success.main" sx={{ mb: 2 }}>
            In Stock
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <Button
              variant="contained"
              size="large"
              sx={{ borderRadius: 8, fontWeight: 700, backgroundColor: '#F46A6A', color: 'white', '&:hover': { backgroundColor: '#e05555' } }}
              startIcon={<ShoppingCart />}
              onClick={() => setSnackbarOpen(true)}
            >
              Add to Cart
            </Button>
            <Button
              component={RouterLink}
              to={`/customize/${product.category}`}
              variant="outlined"
              size="large"
              onClick={(e) => {
                const isLoggedIn = localStorage.getItem('giftcraftUser');
                if (!isLoggedIn) {
                  e.preventDefault();
                  localStorage.setItem('giftcraftPendingProduct', product.category);
                  navigate('/login');
                }
              }}
              sx={{ borderRadius: 8, fontWeight: 700, color: '#F46A6A', borderColor: '#F46A6A', '&:hover': { borderColor: '#e05555', backgroundColor: 'rgba(244,106,106,0.04)' } }}
              startIcon={<DesignServices />}
            >
              Customize
            </Button>
          </Stack>
        </Grid>
      </Grid>
      <Box sx={{
        position: 'relative',
        bgcolor: '#FFF6F6',
        borderRadius: 3,
        p: { xs: 3, md: 5 },
        my: 5,
        textAlign: 'center',
        boxShadow: 2,
        maxWidth: 700,
        mx: 'auto',
        overflow: 'visible',
      }}>
        {/* Animated hearts left */}
        <FavoriteIcon sx={{
          position: 'absolute',
          left: -32,
          top: 32,
          color: '#F46A6A',
          fontSize: 32,
          opacity: 0.7,
          animation: `${floatPop} 2.5s ease-in-out infinite`,
          animationDelay: '0s',
          display: { xs: 'none', sm: 'block' },
        }} />
        <FavoriteIcon sx={{
          position: 'absolute',
          left: -24,
          bottom: 48,
          color: '#F46A6A',
          fontSize: 24,
          opacity: 0.6,
          animation: `${floatPop} 2.8s ease-in-out infinite`,
          animationDelay: '0.7s',
          display: { xs: 'none', sm: 'block' },
        }} />
        {/* Animated hearts right */}
        <FavoriteIcon sx={{
          position: 'absolute',
          right: -32,
          top: 48,
          color: '#F46A6A',
          fontSize: 28,
          opacity: 0.7,
          animation: `${floatPop} 2.7s ease-in-out infinite`,
          animationDelay: '0.3s',
          display: { xs: 'none', sm: 'block' },
        }} />
        <FavoriteIcon sx={{
          position: 'absolute',
          right: -24,
          bottom: 32,
          color: '#F46A6A',
          fontSize: 36,
          opacity: 0.6,
          animation: `${floatPop} 2.9s ease-in-out infinite`,
          animationDelay: '1.1s',
          display: { xs: 'none', sm: 'block' },
        }} />
        {/* Hearts row and heading as before */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
          {[...Array(5)].map((_, i) => (
            <FavoriteIcon key={i} sx={{ color: '#F46A6A', mx: 0.5, fontSize: 28, opacity: 0.85 }} />
          ))}
        </Box>
        <Typography variant="h4" fontWeight={900} sx={{ mb: 2, color: '#B22234', letterSpacing: '-1px', fontSize: { xs: '1.5rem', md: '2rem' } }}>
          Why This Gift is Special
        </Typography>
        <Typography variant="h5" sx={{ color: '#B22234', fontWeight: 500, fontSize: { xs: '1.15rem', md: '1.35rem' }, lineHeight: 1.7, maxWidth: 700, mx: 'auto' }}>
          {getProductStory(product.category)}
        </Typography>
      </Box>
      {/* Related Products */}
      <Box sx={{ mt: 8 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>Related Products</Typography>
        <Grid container spacing={3}>
          {relatedProducts.map((rel) => (
            <Grid item xs={12} sm={6} md={4} key={rel.id}>
              <Paper
                component={RouterLink}
                to={`/products/${rel.id}`}
                sx={{
                  p: 2,
                  textDecoration: 'none',
                  borderRadius: 3,
                  boxShadow: 2,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px) scale(1.03)',
                    boxShadow: 4,
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <Box
                  component="img"
                  src={rel.image}
                  alt={rel.name}
                  sx={{ width: 100, height: 100, objectFit: 'contain', mb: 1, borderRadius: 2, bgcolor: 'white' }}
                />
                <Typography variant="subtitle1" fontWeight={700}>{rel.name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{rel.description}</Typography>
                <Typography variant="body2" fontWeight={700} color="primary">Rs. {rel.price.toLocaleString('en-IN')}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <MuiAlert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          Added to cart!
        </MuiAlert>
      </Snackbar>
    </Container>
  );
};

export default ProductDetails; 