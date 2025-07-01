import React from 'react';
import { Container, Typography, Box, TextField, Button, Grid, Paper } from '@mui/material';
import { Email, Phone, LocationOn } from '@mui/icons-material';

const Contact: React.FC = () => {
  return (
    <Box sx={{ bgcolor: 'rgba(244,106,106,0.05)', minHeight: '100vh', py: 8 }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 4, boxShadow: '0 4px 24px rgba(224,85,85,0.07)', mt: 4, mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 800, fontSize: { xs: '2rem', md: '2.2rem' }, color: '#111', mb: 0 }}>
            Contact Us
          </Typography>
          <div className="heading-dash" />
         
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Phone fontSize="small" />
              <a href="tel:+9779816315056" className="contact-link" style={{ fontSize: '1rem' }}>+977 9816315056</a>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Email fontSize="small" />
              <a href="mailto:info@giftcraft.com" className="contact-link" style={{ fontSize: '1rem' }}>info@giftcraft.com</a>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOn fontSize="small" />
              <a href="https://www.google.com/maps/search/?api=1&query=Dhumrabari,+Kathmandu" target="_blank" rel="noopener noreferrer" className="contact-link" style={{ fontSize: '1rem' }}>Dhumrabarahi, Kathmandu</a>
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Business hours: 9:00 AM - 5:00 PM, Sunday to Friday
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Contact; 