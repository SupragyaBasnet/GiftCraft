import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  // Placeholder function to send OTP
  const handleSendOtp = async () => {
    setError('');
    setLoading(true);
    console.log(`Sending OTP to ${email}`);
    // In a real app: Call backend API to send OTP
    // await api.sendOtp(email);
    setLoading(false);
    setStep('otp'); // Move to OTP step on success (simulated)
  };

  // Placeholder function to verify OTP
  const handleVerifyOtp = async () => {
    setError('');
    setLoading(true);
    console.log(`Verifying OTP ${otp} for ${email}`);
    // In a real app: Call backend API to verify OTP
    // const isValid = await api.verifyOtp(email, otp);
    setLoading(false);
    // if (isValid) {
      setStep('reset'); // Move to Reset Password step on success (simulated)
    // } else {
    //   setError('Invalid OTP.');
    // }
  };

  // Placeholder function to reset password
  const handleResetPassword = async () => {
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    console.log(`Resetting password for ${email}`);
    // In a real app: Call backend API to reset password
    // await api.resetPassword(email, newPassword);
    setLoading(false);
    console.log('Password reset successfully!'); // Log success
    navigate('/login'); // Navigate to login page on success (simulated)
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Forgot Password
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {step === 'email' && (
            <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSendOtp(); }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading || !email}
              >
                Send OTP
              </Button>
            </Box>
          )}

          {step === 'otp' && (
            <Box component="form" onSubmit={(e) => { e.preventDefault(); handleVerifyOtp(); }}>
              <Typography variant="body1" align="center" sx={{ mb: 2 }}>
                Enter the OTP sent to {email}
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                id="otp"
                label="OTP Code"
                name="otp"
                autoFocus
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading || !otp}
              >
                Verify OTP
              </Button>
            </Box>
          )}

          {step === 'reset' && (
            <Box component="form" onSubmit={(e) => { e.preventDefault(); handleResetPassword(); }}>
              <Typography variant="body1" align="center" sx={{ mb: 2 }}>
                Reset Your Password
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                name="newPassword"
                label="New Password"
                type={showNewPassword ? 'text' : 'password'}
                id="newPassword"
                autoFocus
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle new password visibility"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                      >
                        {showNewPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm New Password"
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                      >
                        {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading || !newPassword || !confirmPassword}
              >
                Reset Password
              </Button>
            </Box>
          )}

        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPassword; 