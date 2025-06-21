import {
  CardGiftcard, DesignServices,
  Inventory2,
  Palette, Star
} from '@mui/icons-material';
import {
  Box, Button, Card, CardActions, CardContent,
  CardMedia, Container, Grid, Paper, Typography
} from '@mui/material';
import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import mug1 from '../assets/mug1.jpg';
import notebook1 from '../assets/notebook1.jpg';
import pen1 from '../assets/pen1.webp';
import phonecase1 from '../assets/phonecase1.jpg';
import photoframe1 from '../assets/photoframe1.jpg';
import ring1 from '../assets/ring1.webp';
import tshirt1 from '../assets/tshirt1.jpg';
import PaymentMethods from '../components/PaymentMethods';
import RotatingHeroSection from './RotatingHeroSection';
import keychain1 from '../assets/keychain1.webp';
import cap1 from '../assets/cap1.jpg';
import pillowcase1 from '../assets/pillowcase1.jpg';
import waterbottle1 from '../assets/waterbottle1.jpeg';

const featuredProducts = [
  {
    id: 1,
    name: 'Custom T-Shirt',
    category: 'tshirts',
    price: 3200,
    image: tshirt1,
    description: 'Personalize your own t-shirt with custom designs and text',
  },
  {
    id: 9,
    name: 'Photo Frame',
    category: 'frames',
    price: 2400,
    image: photoframe1,
    description: 'Create a beautiful custom photo frame for your memories',
  },
  {
    id: 3,
    name: 'Phone Cover',
    category: 'phonecases',
    price: 1600,
    image: phonecase1,
    description: 'Design your own unique phone cover',
  },
  {
    id: 2,
    name: 'Custom Mug',
    category: 'mugs',
    price: 1200,
    image: mug1,
    description: "Start your day with a mug that's uniquely yours.",
  },
  {
    id: 6,
    name: 'Custom Notebook',
    category: 'notebooks',
    price: 800,
    image: notebook1,
    description: 'Jot down your ideas in a notebook made just for you.',
  },
  {
    id: 7,
    name: 'Custom Pen',
    category: 'pens',
    price: 300,
    image: pen1,
    description: 'Write your story with a personalized pen.',
  },
  {
    id: 8,
    name: 'Custom Keychain',
    category: 'keychains',
    price: 500,
    image: keychain1,
    description: 'Carry your memories with a personalized keychain.',
  },
  {
    id: 4,
    name: 'Custom Water Bottle',
    category: 'waterbottles',
    price: 1500,
    image: waterbottle1,
    description: 'Stay hydrated with a custom-designed water bottle.',
  },
  {
    id: 5,
    name: 'Custom Cap',
    category: 'caps',
    price: 900,
    image: cap1,
    description: 'Top off your look with a personalized cap.',
  },
  {
    id: 10,
    name: 'Custom Pillowcase',
    category: 'pillowcases',
    price: 1800,
    image: pillowcase1,
    description: 'Design a cozy pillowcase with your own style.',
  },
];

const testimonials = [
  {
    name: 'Ramesh Shrestha',
    comment: 'The quality of the custom t-shirt was amazing! Will definitely order again.',
    rating: 5,
  },
  {
    name: 'Sita Gurung',
    comment: 'Perfect gift for my sister\'s birthday. She loved the personalized photo frame.',
    rating: 5,
  },
  {
    name: 'Hari Thapa',
    comment: 'Great service and fast delivery. The phone cover looks exactly as I designed it.',
    rating: 4,
  },
];

let baseSlides = [
  {
    image: tshirt1,
    caption: 'Personalized T-Shirts',
    link: '/products?category=tshirts',
  },
  {
    image: mug1,
    caption: 'Custom Mugs',
    link: '/products?category=mugs',
  },
  {
    image: phonecase1,
    caption: 'Unique Phone Cases',
    link: '/products?category=phonecases',
  },
  {
    image: photoframe1,
    caption: 'Photo Frames',
    link: '/products?category=frames',
  },
];

interface Slide {
  image: string;
  caption: string;
  link: string;
}

const featuredSlides: Slide[] = [];
for (let i = 0; i < baseSlides.length; i++) {
  featuredSlides.push(baseSlides[i]);
  if ((i + 1) % 11 === 0 || i === baseSlides.length - 1) {
    featuredSlides.push(
      {
        image: notebook1,
        caption: 'Custom Notebooks',
        link: '/products?category=notebooks',
      },
      {
        image: pen1,
        caption: 'Personalized Pens',
        link: '/products?category=pens',
      }
    );
  }
}

function getSlideDescription(caption: string) {
  switch (caption) {
    case 'Personalized T-Shirts':
      return 'Express yourself with custom designs and premium quality.';
    case 'Custom Mugs':
      return "Start your day with a mug that's uniquely yours.";
    case 'Unique Phone Cases':
      return 'Protect your phone in style with a personalized case.';
    case 'Photo Frames':
      return 'Frame your memories with a custom touch.';
    case 'Custom Notebooks':
      return 'Jot down your ideas in a notebook made just for you.';
    case 'Personalized Pens':
      return "Write your story with a pen that's truly yours.";
    default:
      return '';
  }
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    responsive: [
      {
        breakpoint: 600,
        settings: { arrows: false },
      },
    ],
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero Section */}
      <RotatingHeroSection />


      {/* Why Choose Us Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography
          variant="h3"
          component="h2"
          gutterBottom
          align="center"
          sx={{ fontWeight: 900, color: '#111', mb: 6, letterSpacing: '-1px', fontSize: { xs: '2.2rem', md: '2.8rem' } }}
        >
          Why Choose GiftCraft?
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={3}>
            <Paper 
              sx={{ 
                p: 3, 
                textAlign: 'center', 
                height: '100%',
                bgcolor: 'grey.100',
                color: '#222',
                borderRadius: 4,
                boxShadow: '0 2px 12px 0 rgba(0,0,0,0.04)',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 6px 24px 0 rgba(244,106,106,0.10)',
                }
              }}
            >
              <Typography variant="h4" color="inherit" sx={{ mb: 1, fontWeight: 700 }}>
                ★
              </Typography>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                High Quality
              </Typography>
              <Typography variant="body2">
                Premium materials and expert craftsmanship for every product
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper 
              sx={{ 
                p: 3, 
                textAlign: 'center', 
                height: '100%',
                bgcolor: 'grey.100',
                color: '#222',
                borderRadius: 4,
                boxShadow: '0 2px 12px 0 rgba(0,0,0,0.04)',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 6px 24px 0 rgba(244,106,106,0.10)',
                }
              }}
            >
              <Typography variant="h4" color="inherit" sx={{ mb: 1, fontWeight: 700 }}>
                🚚
              </Typography>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                Fast Delivery
              </Typography>
              <Typography variant="body2">
                Quick processing and reliable delivery across Nepal
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper 
              sx={{ 
                p: 3, 
                textAlign: 'center', 
                height: '100%',
                bgcolor: 'grey.100',
                color: '#222',
                borderRadius: 4,
                boxShadow: '0 2px 12px 0 rgba(0,0,0,0.04)',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 6px 24px 0 rgba(244,106,106,0.10)',
                }
              }}
            >
              <Typography variant="h4" color="inherit" sx={{ mb: 1, fontWeight: 700 }}>
                🔒
              </Typography>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                Secure Payment
              </Typography>
              <Typography variant="body2">
                Safe and secure payment options
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper 
              sx={{ 
                p: 3, 
                textAlign: 'center', 
                height: '100%',
                bgcolor: 'grey.100',
                color: '#222',
                borderRadius: 4,
                boxShadow: '0 2px 12px 0 rgba(0,0,0,0.04)',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 6px 24px 0 rgba(244,106,106,0.10)',
                }
              }}
            >
              <Typography variant="h4" color="inherit" sx={{ mb: 1, fontWeight: 700 }}>
                💬
              </Typography>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                24/7 Support
              </Typography>
              <Typography variant="body2">
                Dedicated customer support team
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Featured Products */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography
          variant="h3"
          component="h2"
          gutterBottom
          align="center"
          sx={{ fontWeight: 900, color: '#111', mb: 6, letterSpacing: '-1px', fontSize: { xs: '2.2rem', md: '2.8rem' } }}
        >
          Featured Products
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {featuredProducts.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={3}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  boxShadow: '0 2px 16px 0 rgba(244,106,106,0.09)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-6px) scale(1.03)',
                    boxShadow: '0 6px 24px 0 rgba(244,106,106,0.18)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="220"
                  image={product.image}
                  alt={product.name}
                  sx={{ objectFit: 'cover', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
                />
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Typography gutterBottom variant="h6" component="h3" sx={{ fontWeight: 700 }}>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {product.description}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    Rs. {product.price.toLocaleString('en-IN')}
                  </Typography>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                    <Button
                      component={RouterLink}
                      to={`/customize/${product.category}`}
                      variant="contained"
                      size="medium"
                      onClick={(e) => {
                        const isLoggedIn = localStorage.getItem('giftcraftUser');
                        if (!isLoggedIn) {
                          e.preventDefault();
                          localStorage.setItem('giftcraftPendingProduct', product.category);
                          navigate('/login');
                        }
                      }}
                      sx={{
                        flex: 1,
                        borderRadius: 8,
                        fontWeight: 700,
                        backgroundColor: '#F46A6A',
                        color: 'white',
                        '&:hover': { backgroundColor: '#e05555' },
                      }}
                      startIcon={<DesignServices />}
                    >
                      Customize
                    </Button>
                    <Button
                      component={RouterLink}
                      to={`/products/${product.id.toString()}`}
                      variant="outlined"
                      size="medium"
                      sx={{
                        flex: 1,
                        borderRadius: 8,
                        fontWeight: 600,
                        color: '#F46A6A',
                        borderColor: '#F46A6A',
                        '&:hover': { bgcolor: 'rgba(244,106,106,0.08)', borderColor: '#e05555' },
                      }}
                    >
                      View
                    </Button>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography
          variant="h3"
          component="h2"
          gutterBottom
          align="center"
          sx={{ fontWeight: 900, color: '#111', mb: 3, letterSpacing: '-1px', fontSize: { xs: '2.2rem', md: '2.8rem' } }}
        >
          How It Works
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {[
            {
              number: 1,
              icon: <Inventory2 sx={{ fontSize: 36, color: '#F46A6A' }} />,
              iconBg: 'rgba(244,106,106,0.10)',
              title: 'Choose Your Product',
              description: 'Select from our range of customizable products',
            },
            {
              number: 2,
              icon: <Palette sx={{ fontSize: 36, color: '#8e24aa' }} />,
              iconBg: 'rgba(126,87,194,0.10)',
              title: 'Customize Your Design',
              description: 'Add your personal touch with our easy-to-use design tool',
            },
            {
              number: 3,
              icon: <CardGiftcard sx={{ fontSize: 36, color: '#F46A6A' }} />,
              iconBg: 'rgba(244,106,106,0.10)',
              title: 'Place Your Order',
              description: 'Complete your order and we\'ll deliver it to your doorstep',
            },
          ].map((step) => (
            <Grid item xs={12} md={4} key={step.number}>
              <Box
                sx={{
                  bgcolor: 'white',
                  borderRadius: 4,
                  boxShadow: '0 2px 12px 0 rgba(0,0,0,0.04)',
                  p: 4,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minHeight: 260,
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 6px 24px 0 rgba(244,106,106,0.10)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 72,
                    height: 72,
                    bgcolor: step.iconBg,
                    color: 'inherit',
                    borderRadius: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 32,
                    fontWeight: 900,
                    mb: 2,
                    boxShadow: '0 2px 8px 0 rgba(244,106,106,0.10)',
                  }}
                >
                  {step.icon}
                  <Typography variant="subtitle2" sx={{ color: '#222', fontWeight: 700, fontSize: '1.1rem', mt: 0.5 }}>
                    {step.number}
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#111', mb: 1 }}>
                  {step.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#444', fontSize: '1.05rem' }}>
                  {step.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Payment Methods Section */}
      <PaymentMethods />

      {/* Testimonials Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            align="center"
            sx={{ fontWeight: 900, color: '#111', mb: 6, letterSpacing: '-1px', fontSize: { xs: '2.2rem', md: '2.8rem' } }}
          >
            What Our Customers Say
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {testimonials.map((testimonial, index) => (
              <Grid item key={index} xs={12} md={4}>
                <Paper 
                  sx={{ 
                    p: 3,
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} color="warning" />
                    ))}
                  </Box>
                  <Typography variant="body1" paragraph>
                    "{testimonial.comment}"
                  </Typography>
                  <Typography variant="subtitle1">
                    - {testimonial.name}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography
          variant="h3"
          component="h2"
          gutterBottom
          align="center"
          sx={{ fontWeight: 900, color: '#111', mb: 4, letterSpacing: '-1px', fontSize: { xs: '2.2rem', md: '2.8rem' } }}
        >
          Ready to Create Something Special?
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          Start customizing your perfect gift today
        </Typography>
        <Button
          component={RouterLink}
          to="/products"
          variant="contained"
          size="large"
          startIcon={<DesignServices />}
          sx={{ 
            mt: 2,
            backgroundColor: '#F46A6A',
            '&:hover': {
              backgroundColor: '#e05555'
            }
          }}
        >
          Browse Products
        </Button>
      </Container>

    </Box>
  );
};

export default Home; 