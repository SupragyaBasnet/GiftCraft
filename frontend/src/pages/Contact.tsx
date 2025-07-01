import React from 'react';
import { Container, Typography, Box, TextField, Button, Grid, Paper } from '@mui/material';
import { Email, Phone, LocationOn } from '@mui/icons-material';

const Contact: React.FC = () => {
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 900, fontSize: { xs: '2rem', md: '2.4rem' }, color: '#111', mb: 1 }}>
          Contact Us
        </Typography>
        <div className="heading-dash" style={{ marginTop: 0, marginBottom: 16 }} />
        <Typography variant="body1" sx={{ mb: 3 }}>
          We'd love to hear from you! Fill out the form below or reach us directly at:
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={1} alignItems="center">
            <Grid item><Phone fontSize="small" /></Grid>
            <Grid item><Typography variant="body2"><a href="tel:+9779816315056" className="contact-link">+977 9816315056</a></Typography></Grid>
          </Grid>
          <Grid container spacing={1} alignItems="center">
            <Grid item><Email fontSize="small" /></Grid>
            <Grid item><Typography variant="body2"><a href="mailto:info@giftcraft.com" className="contact-link">info@giftcraft.com</a></Typography></Grid>
          </Grid>
          <Grid container spacing={1} alignItems="center">
            <Grid item><LocationOn fontSize="small" /></Grid>
            <Grid item><Typography variant="body2"><a href="https://www.google.com/maps/search/?api=1&query=Dhumrabari,+Kathmandu" target="_blank" rel="noopener noreferrer" className="contact-link">Dhumrabarahi, Kathmandu</a></Typography></Grid>
          </Grid>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Business hours: 9:00 AM - 5:00 PM, Sunday to Friday
        </Typography>
      </Paper>
    </Container>
  );
};

export default Contact; 