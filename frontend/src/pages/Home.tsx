import {
  CardGiftcard, Inventory2,
  Palette, Star
} from '@mui/icons-material';
import {
  Box, Button, Card, CardContent,
  CardMedia, Container, Grid, Paper, Rating, Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import mug1 from '../assets/mug1.jpg';
import notebook1 from '../assets/notebook1.jpg';
import pen1 from '../assets/pen1.webp';
import phonecase1 from '../assets/phonecase1.jpg';
import photoframe1 from '../assets/photoframe1.jpg';


import tshirt1 from '../assets/tshirt1.jpg';
import yellowOrangeBanner from '../assets/Yellow and Orange Modern Summer Sale Etsy shop cover.png';

import { products } from '../data/products';
import RotatingHeroSection from './RotatingHeroSection';

const featuredProductIds = [1, 9, 3, 2, 6, 7, 8, 4, 5, 10];

const featuredProducts = products.filter(p => featuredProductIds.includes(p.id));

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
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeatured() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch products');
        const allProducts = await res.json();
        // Optionally filter for featured (e.g., by category, or top N)
        // Here, just take the first 8 for demo
        setFeaturedProducts(allProducts.slice(0, 8));
      } catch (err: any) {
        setError(err.message || 'Error loading products');
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

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

      {/* Promotional Banner Section */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper
          elevation={4}
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 4,
            p: 0,
            cursor: 'pointer',
          }}
          onClick={() => navigate('/products')}
        >
          <Box
            sx={{
              width: '100%',
              height: { xs: 180, md: 260 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              component="img"
              src={yellowOrangeBanner}
              alt="Sale Banner"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </Box>
        </Paper>
      </Container>

      {/* Why Choose Us Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography
          variant="h3"
          component="h2"
          align="center"
          sx={{ fontWeight: 800, fontSize: { xs: '2rem', md: '2.2rem' }, mb: 0 }}
        >
          Why Choose GiftCraft?
        </Typography>
        <div className="heading-dash" />
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
          align="center"
          sx={{ fontWeight: 800, fontSize: { xs: '2rem', md: '2.2rem' }, mb: 0 }}
        >
          Featured Products
        </Typography>
        <div className="heading-dash" />
        {loading ? (
          <Typography align="center" sx={{ mt: 4 }}>Loading...</Typography>
        ) : error ? (
          <Typography color="error" align="center" sx={{ mt: 4 }}>{error}</Typography>
        ) : (
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {featuredProducts.map((product) => (
              <Grid item key={product._id || product.id} xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    width: 260,
                    height: 370,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    borderRadius: 4,
                    boxShadow: '0 2px 16px 0 rgba(244,106,106,0.09)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-6px) scale(1.03)',
                      boxShadow: '0 6px 24px 0 rgba(244,106,106,0.18)',
                    },
                    mx: 'auto',
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate(`/products/${product._id || product.id}`)}
                >
                  <CardMedia
                    component="img"
                    image={product.image}
                    alt={product.name}
                    sx={{
                      width: 180,
                      height: 180,
                      objectFit: 'contain',
                      mx: 'auto',
                      mt: 1,
                      mb: 0.5,
                      bgcolor: 'white',
                      borderRadius: 2,
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 2, width: '100%', minHeight: 0 }}>
                    <Typography gutterBottom variant="h6" component="h3" sx={{ fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {product.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                      <Rating value={0} readOnly size="small" />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                        ({product.reviews || 0})
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" paragraph sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', minHeight: 40 }}>
                      {product.description}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      Rs. {product.price?.toLocaleString('en-IN')}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

    

      {/* How It Works Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography
          variant="h3"
          component="h2"
          align="center"
          sx={{ fontWeight: 800, fontSize: { xs: '2rem', md: '2.2rem' }, mb: 0 }}
        >
          How It Works
        </Typography>
        <div className="heading-dash" />
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



      {/* Testimonials Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            align="center"
            sx={{ fontWeight: 800, fontSize: { xs: '2rem', md: '2.2rem' }, mb: 0 }}
          >
            What Our Customers Say
          </Typography>
          <div className="heading-dash" />
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {testimonials.map((testimonial: { name: string; comment: string; rating: number }, index: number) => (
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
          align="center"
          sx={{ fontWeight: 800, fontSize: { xs: '2rem', md: '2.2rem' }, mb: 0 }}
        >
          Ready to Create Something Special?
        </Typography>
        <div className="heading-dash" />
        <Typography variant="body1" paragraph color="text.secondary">
          Start customizing your perfect gift today
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={RouterLink}
          to="/products"
          sx={{ mt: 3, fontWeight: 700, borderRadius: 7, px: 3, py: 1.35, fontSize: '1rem', backgroundColor: '#F46A6A', '&:hover': { backgroundColor: '#e05555' } }}
        >
          Browse Products
        </Button>
      </Container>

    </Box>
  );
};

export default Home; 