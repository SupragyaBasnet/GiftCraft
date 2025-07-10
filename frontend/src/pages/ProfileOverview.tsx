import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, Snackbar, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const ProfileOverview: React.FC = () => {
  const { user, setUser } = useAuth() as any;
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone ? user.phone.replace(/^\+977/, '') : '');
  const [editMode, setEditMode] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editMode) {
      setTimeout(() => {
        nameRef.current?.focus();
      }, 0);
    }
  }, [editMode]);

  const handleEdit = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setPhone(user?.phone ? user.phone.replace(/^\+977/, '') : '');
    setEditMode(true);
  };
  const handleCancelEdit = () => setEditMode(false);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSnackbar({ open: false, message: '', severity: 'success' });
    try {
      setUser && setUser((prev: any) => ({ ...prev, name, email, phone: '+977' + phone }));
      setSnackbar({ open: true, message: 'Profile updated!', severity: 'success' });
      setEditMode(false);
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Failed to update profile', severity: 'error' });
    }
  };

  return (
    <Paper sx={{ p: 4, borderRadius: 4, maxWidth: 400, mx: 'auto', mt: 6 }}>
      <Typography variant="h5" align="center" gutterBottom>Profile Overview</Typography>
      <Box component="form" onSubmit={handleProfileSubmit}>
        <TextField
          margin="normal"
          required
          fullWidth
          label="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
          disabled={!editMode}
          inputRef={nameRef}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Email Address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={!editMode}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Phone Number"
          value={phone}
          onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
          disabled={!editMode}
          InputProps={{
            startAdornment: (
              <Box sx={{ mr: 1, color: 'text.secondary' }}>+977</Box>
            ),
          }}
        />
        {!editMode ? (
          <Button
            variant="outlined"
            sx={{ mt: 3 }}
            onClick={handleEdit}
            fullWidth
          >
            Edit
          </Button>
        ) : (
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Save Changes
            </Button>
            <Button
              variant="text"
              color="secondary"
              onClick={handleCancelEdit}
              fullWidth
            >
              Cancel
            </Button>
          </Box>
        )}
      </Box>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Paper>
  );
};

export default ProfileOverview; 