import { Delete } from '@mui/icons-material';
import { Alert, IconButton, List, ListItem, ListItemText, Paper, Snackbar, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ProfileAddresses: React.FC = () => {
  const { token } = useAuth() as any;
  const [addresses, setAddresses] = useState<string[]>([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await fetch('/api/products/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch order history');
        const orders = await res.json();
        const uniqueAddresses = Array.from(
          new Set(
            orders
              .map((order: any) => order.address)
              .filter((address: string) => !!address)
          )
        );
        setAddresses(uniqueAddresses as string[]);
      } catch (e) {
        console.error('Fetch addresses error:', e);
        setAddresses([]);
      }
    };
    fetchAddresses();
  }, [token]);


  const handleDeleteAddress = (addressToDelete: string) => {
    const updatedAddresses = addresses.filter(addr => addr !== addressToDelete);
    setAddresses(updatedAddresses);
    setSnackbar({ open: true, message: 'Address removed from list', severity: 'success' });
  };

  return (
    <Paper elevation={0} sx={{ p: 2, borderRadius: 3, background: '#fafbfc', boxShadow: 'none', mt: 2, maxHeight: 400, overflowY: 'auto' }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>Address Book</Typography>
      <List>
        {addresses.length === 0 ? (
          <Typography variant="body1" align="center">No saved addresses found from orders.</Typography>
        ) : (
          addresses.map((address, index) => (
            <ListItem key={index} secondaryAction={
              <IconButton edge="end" aria-label="delete address" onClick={() => handleDeleteAddress(address)}>
                <Delete />
              </IconButton>
            }>
              <ListItemText primary={`Address ${index + 1}`} secondary={address} />
            </ListItem>
          ))
        )}
      </List>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Paper>
  );
};

export default ProfileAddresses; 