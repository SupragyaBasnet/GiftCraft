import {
  Container, Grid,
  Paper, Typography
} from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';

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
  return (
    <Container maxWidth="lg" sx={{ py: 8, minHeight: '70vh' }}>
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, md: 6 },
            mb: 8,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #F46A6A 0%, #FFB6B6 100%)',
            color: '#111',
            borderRadius: 4,
            boxShadow: 4,
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 900, letterSpacing: '-1px', fontSize: { xs: '2.2rem', md: '2.8rem' } }}
          >
            About GiftCraft
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: '800px', mx: 'auto', color: '#111' }}>
            GiftCraft is your destination for thoughtful, personalized gifts that tell your story. 
            Whether you're celebrating birthdays, anniversaries, or any special occasion, 
            we help you design unique products with ease.
          </Typography>
        </Paper>
      </motion.div>

      <Grid container spacing={6}>
        <Grid item xs={12} md={6}>
          <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={1}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
              🎁 Our Mission
            </Typography>
            <Typography variant="body1" color="text.secondary">
              We believe gifts should be meaningful and memorable. Our platform empowers you to customize everything 
              from mugs and t-shirts to jewelry and stationery, blending creativity with convenience.
            </Typography>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={6}>
          <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={2}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
              🌏 Why Choose Us?
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Based in Nepal, we deliver quality and care in every product. With a user-friendly interface and fast 
              customer support, GiftCraft makes personalization simple and enjoyable—no design skills needed!
            </Typography>
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AboutUs;
