import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, Snackbar, Alert, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ProfileSettings: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const navigate = useNavigate();

  const currentPasswordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => {
      currentPasswordRef.current?.focus();
    }, 0);
  }, []);

  const isStrongPassword = (password: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password);
  };
  const newPasswordError = newPassword && !isStrongPassword(newPassword);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setSnackbar({ open: true, message: 'Please fill all fields.', severity: 'error' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setSnackbar({ open: true, message: 'New passwords do not match.', severity: 'error' });
      return;
    }
    // Replace with your API call
    setSnackbar({ open: true, message: 'Password changed successfully!', severity: 'success' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  return (
    <Paper sx={{ p: 4, borderRadius: 4, maxWidth: 400, mx: 'auto', mt: 6 }}>
      <Typography variant="h5" gutterBottom>Account Settings</Typography>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
          Change Password
        </Typography>
        <TextField
          margin="normal"
          fullWidth
          name="currentPassword"
          label="Current Password"
          type={showCurrentPassword ? 'text' : 'password'}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          inputRef={currentPasswordRef}
          InputProps={{
            endAdornment: (
              <IconButton
                aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowCurrentPassword((show) => !show)}
                edge="end"
                size="small"
              >
                {showCurrentPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            ),
          }}
        />
        <TextField
          margin="normal"
          fullWidth
          name="newPassword"
          label="New Password"
          type={showNewPassword ? 'text' : 'password'}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton
                aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowNewPassword((show) => !show)}
                edge="end"
                size="small"
              >
                {showNewPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            ),
          }}
          error={!!newPasswordError}
          helperText={newPasswordError ? 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character.' : ''}
        />
        <TextField
          margin="normal"
          fullWidth
          name="confirmPassword"
          label="Confirm New Password"
          type={showConfirmPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowConfirmPassword((show) => !show)}
                edge="end"
                size="small"
              >
                {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            ),
          }}
        />
        <Button
          variant="outlined"
          sx={{
            mt: 2,
            borderRadius: 2,
            fontWeight: 700,
            color: 'rgb(255,106,106)',
            borderColor: 'rgb(255,106,106)',
            '&:hover': {
              backgroundColor: 'rgba(255,106,106,0.08)',
              borderColor: 'rgb(255,106,106)',
              color: 'rgb(255,106,106)',
            }
          }}
          onClick={handleChangePassword}
          disabled={!currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword || !!newPasswordError}
        >
          Change Password
        </Button>
      </Box>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Paper>
  );
};

export default ProfileSettings; 