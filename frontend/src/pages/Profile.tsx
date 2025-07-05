import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Divider,
  Collapse,
  Stack,
  Snackbar,
  Alert,
  Rating,
} from '@mui/material';
import {
  PhotoCamera,
  PhotoLibrary,
  Delete,
  Close,
  Home,
  LocalShipping,
  LocationOn,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  ExpandMore,
  ExpandLess,
  Edit,
  Star,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import CustomizedProductImage from '../components/CustomizedProductImage';
import { useNavigate } from 'react-router-dom';

// Mock data for addresses
const mockAddresses = [
  { id: 1, label: 'Home', address: '123 Main St, Kathmandu, Nepal' },
  { id: 2, label: 'Office', address: '456 Business Rd, Lalitpur, Nepal' },
];

// Simple client-side price map (placeholder) - Needed for calculating and displaying item price
const productPrices: Record<string, number> = {
  tshirt: 500,
  mug: 300,
  phonecase: 800,
  waterbottle: 600,
  cap: 400,
  notebook: 700,
  pen: 200,
  keychain: 200,
  frame: 3000,
  pillowcase: 900,
};

const Profile: React.FC = () => {
  const { user, logout, setUser } = useAuth() as any;
  const [tab, setTab] = useState(0);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<string[]>([]); // Initialize as an empty array of strings
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'success'|'error'}>({open: false, message: '', severity: 'success'});

  // Add state for order history
  const [orderHistory, setOrderHistory] = useState<any[]>([]);

  // Local state for form fields
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone ? user.phone.replace(/^\+977/, '') : '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showCameraDialog, setShowCameraDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState<number | null>(null);
  const [reviewOrderId, setReviewOrderId] = useState<string | null>(null);

  // State for password
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password strength validation
  const isStrongPassword = (password: string) => {
    // At least 8 characters, one uppercase, one lowercase, one number, one special character
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password);
  };
  const newPasswordError = newPassword && !isStrongPassword(newPassword);

  // Sync local state with user when user changes
  useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setPhone(user?.phone ? user.phone.replace(/^\+977/, '') : '');
  }, [user]);
  

  // Tab change handler
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => setTab(newValue);

  // Address handlers
  // Update the handleDeleteAddress to remove from the state array
  const handleDeleteAddress = (addressToDelete: string) => {
    setAddresses(addresses.filter(addr => addr !== addressToDelete));
    setSnackbar({open: true, message: 'Address removed from list', severity: 'success'});
  };

  // Profile update handler (mock)
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSnackbar({ open: false, message: '', severity: 'success' });
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('giftcraftToken')}`,
        },
        body: JSON.stringify({ name, phone: '+977' + phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update profile');
      setSnackbar({ open: true, message: 'Profile updated!', severity: 'success' });
      // Update global user state only after successful save
      setUser && setUser((prev: any) => ({ ...prev, name: data.name, phone: data.phone }));
    } catch (err) {
      setSnackbar({ open: true, message: err instanceof Error ? err.message : 'Failed to update profile', severity: 'error' });
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleGalleryUpload = () => {
    fileInputRef.current?.click();
    handleMenuClose();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        try {
          const res = await fetch('/api/auth/profile-image', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('giftcraftToken')}`,
            },
            body: JSON.stringify({ profileImage: base64Image }),
          });
          const data = await res.json();
          if (res.ok) {
            setUser && setUser((prev: any) => ({ ...prev, profileImage: data.profileImage }));
            setSnackbar({ open: true, message: 'Profile image updated!', severity: 'success' });
          } else {
            setSnackbar({ open: true, message: data.message || 'Failed to update profile image', severity: 'error' });
          }
        } catch (err) {
          setSnackbar({ open: true, message: 'Failed to update profile image', severity: 'error' });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraOpen = () => {
    setShowCameraDialog(true);
    handleMenuClose();
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((mediaStream) => {
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      })
      .catch((err) => {
        console.error('Error accessing camera:', err);
      });
  };

  const handleCameraClose = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCameraDialog(false);
  };

  const handleCapturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const base64Image = canvas.toDataURL('image/jpeg');
        // Upload to backend just like gallery upload
        (async () => {
          try {
            const res = await fetch('/api/auth/profile-image', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('giftcraftToken')}`,
              },
              body: JSON.stringify({ profileImage: base64Image }),
            });
            const data = await res.json();
            if (res.ok) {
              setUser && setUser((prev: any) => ({ ...prev, profileImage: data.profileImage }));
              setSnackbar({ open: true, message: 'Profile image updated!', severity: 'success' });
            } else {
              setSnackbar({ open: true, message: data.message || 'Failed to update profile image', severity: 'error' });
            }
          } catch (err) {
            setSnackbar({ open: true, message: 'Failed to update profile image', severity: 'error' });
          }
        })();
        handleCameraClose();
      }
    }
  };

  const handleRemovePhoto = async () => {
    try {
      const res = await fetch('/api/auth/profile-image', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('giftcraftToken')}`,
        },
      });
      if (res.ok) {
        setUser && setUser((prev: any) => ({ ...prev, profileImage: null }));
        setSnackbar({ open: true, message: 'Profile image removed!', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Failed to remove profile image', severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to remove profile image', severity: 'error' });
    }
    handleMenuClose();
  };

  // Toggle expanded order details
  const handleToggleExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Review modal handlers
  const handleOpenReviewModal = (orderId: string) => {
    setReviewOrderId(orderId);
    setOpenReviewModal(true);
  };
  const handleCloseReviewModal = () => {
    setOpenReviewModal(false);
    setReviewText('');
    setReviewRating(null);
    setReviewOrderId(null);
  };

  // --- Tab Panels ---
  function TabPanel({ children, value, index }: { children: React.ReactNode, value: number, index: number }) {
    return (
      <div hidden={value !== index} style={{ width: '100%' }}>
        {value === index && children}
      </div>
    );
  }

  // Fetch order history from backend when Orders tab is selected
  useEffect(() => {
    if (tab === 1) {
      const fetchOrders = async () => {
        try {
          const res = await fetch('/api/products/orders', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('giftcraftToken')}`,
            },
          });
          const data = await res.json();
          if (res.ok) {
            setOrderHistory(data);
            // Extract unique addresses from backend order history
            const uniqueAddresses = Array.from(new Set(data
              .filter((order: any) => order.address)
              .map((order: any) => order.address as string)
            ));
            setAddresses(uniqueAddresses as string[]);
          }
        } catch (err) {
          // Optionally handle error
        }
      };
      fetchOrders();
  }
  }, [tab]);

  // Remove handleSubmitReview's localStorage logic
  const handleSubmitReview = () => {
    // In a real app, you would send this review and rating to your backend
    handleCloseReviewModal();
  };

  // Change password handler
  const navigate = useNavigate();
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setSnackbar({ open: true, message: 'Please fill all fields.', severity: 'error' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setSnackbar({ open: true, message: 'New passwords do not match.', severity: 'error' });
      return;
    }
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('giftcraftToken')}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to change password');
      setSnackbar({ open: true, message: 'Password changed successfully! Please log in again.', severity: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Failed to change password', severity: 'error' });
    }
  };

  // Fetch profile image from backend on mount
  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const res = await fetch('/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('giftcraftToken')}`,
          },
        });
        const data = await res.json();
        if (res.ok && data.profileImage) {
          setUser && setUser((prev: any) => ({ ...prev, profileImage: data.profileImage }));
        } else {
          setUser && setUser((prev: any) => ({ ...prev, profileImage: null }));
        }
      } catch (err) {
        setUser && setUser((prev: any) => ({ ...prev, profileImage: null }));
      }
    };
    fetchProfileImage();
  }, [setUser]);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 4 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} alignItems="flex-start">
          {/* Sidebar/Profile summary */}
          <Box sx={{ minWidth: 200, textAlign: 'center', mb: { xs: 2, sm: 0 }, position: 'relative' }}>
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <Avatar
                sx={{ width: 100, height: 100, fontSize: '2.5rem', mx: 'auto', mb: 2 }}
                src={user?.profileImage || undefined}
              >
                {!user?.profileImage && user?.name.charAt(0)}
              </Avatar>
              <IconButton
                aria-label="upload profile photo"
                onClick={handleMenuOpen}
                sx={{
                  position: 'absolute',
                  bottom: 12,
                  right: 12,
                  backgroundColor: 'white',
                  color: 'black',
                  boxShadow: 2,
                  '&:hover': { backgroundColor: '#f0f0f0' },
                  width: 32,
                  height: 32,
                  zIndex: 1,
                  p: 0,
                }}
                size="small"
              >
                <PhotoCamera fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="h6">{user?.name}</Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>{user?.email}</Typography>
            <Tabs
              orientation={window.innerWidth < 600 ? 'horizontal' : 'vertical'}
              value={tab}
              onChange={handleTabChange}
              variant="scrollable"
              sx={{
                borderRight: { sm: 1, md: 1, xs: 0, borderColor: 'divider' },
                minWidth: 180,
                mt: 2,
                mb: { xs: 2, sm: 0 },
                '& .MuiTab-root': {
                  color: '#888', // grey for all tab text
                  fontWeight: 600,
                },
                '& .Mui-selected': {
                  color: '#111 !important', // black for selected tab text
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#111', // black indicator
                },
              }}
            >
              <Tab icon={<Home />} iconPosition="start" label="Profile" />
              <Tab icon={<LocalShipping />} iconPosition="start" label="Orders" />
              <Tab icon={<LocationOn />} iconPosition="start" label="Addresses" />
              <Tab icon={<SettingsIcon />} iconPosition="start" label="Settings" />
            </Tabs>
          </Box>
          {/* Main content */}
          <Box sx={{ flex: 1 }}>
            {/* Profile Tab */}
            <TabPanel value={tab} index={0}>
              <Typography variant="h5" fontWeight={700} gutterBottom>Profile Overview</Typography>
              <Box component="form" onSubmit={handleProfileSubmit}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Full Name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoComplete="off"
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  type="text"
                  value={email}
                  InputProps={{ readOnly: true }}
                  autoComplete="off"
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="phone"
                  label="Phone Number"
                  name="phone"
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ mr: 1, color: 'text.secondary' }}>+977</Box>
                    ),
                  }}
                  autoComplete="off"
                />
                <Button 
                  type="submit" 
                  size="small"
                  variant="outlined"
                  sx={{ 
                    mt: 3, 
                    mb: 2,
                    color: 'rgb(255,106,106)',
                    borderColor: 'rgb(255,106,106)',
                    width: 'auto',
                    alignSelf: 'flex-start',
                    '&:hover': {
                      color: 'rgb(255,106,106)',
                      borderColor: 'rgb(255,106,106)',
                      backgroundColor: 'rgba(255,106,106,0.08)',
                    },
                  }}
                >
                  Save Changes
                </Button>
              </Box>
            </TabPanel>
            {/* Orders Tab */}
            <TabPanel value={tab} index={1}>
              <Typography variant="h5" fontWeight={700} gutterBottom>Order History</Typography>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 3, background: '#fafbfc', boxShadow: 'none', mt: 2, maxHeight: 400, overflowY: 'auto' }}>
                <List>
                  {orderHistory.length === 0 ? (
                    <Typography variant="body1" align="center">No orders found.</Typography>
                  ) : (
                    orderHistory.map((order) => (
                      <React.Fragment key={order.id}>
                        <ListItem button onClick={() => handleToggleExpand(order.id)}>
                          <ListItemText
                            primary={
                              <Typography variant="body1" fontWeight={700}>Order ID: {order.id}</Typography>
                            }
                            secondary={
                              <React.Fragment>
                                <Typography component="span" variant="body2" color="text.primary">
                                  Date: {new Date(order.date).toLocaleDateString()}
                                </Typography>
                                <Typography component="span" variant="body2" color="text.primary" sx={{ display: 'block' }}>
                                  Total: Rs. {order.total}
                                </Typography>
                                <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block' }}>
                                  Status: {order.status}
                                </Typography>
                              </React.Fragment>
                            }
                          />
                          {expandedOrder === order.id ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={expandedOrder === order.id} timeout="auto" unmountOnExit>
                          <Box sx={{ pl: 4, pr: 2, pb: 2, borderBottom: '1px solid #eee' }}>
                            <Typography variant="subtitle1" fontWeight={700} gutterBottom>Items:</Typography>
                            {/* Display order items - Assuming 'item' in order object has name, qty, price */} {/* Use CustomizedProductImage here */}
                            {order.item ? (
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Box sx={{ width: 60, height: 60, mr: 2 }}>
                                  <CustomizedProductImage 
                                    baseImage={order.item.image} 
                                    elements={order.item.elements || []} 
                                    color={order.item.color || '#ffffff'} 
                                    productType={order.item.productType}
                                  />
                                </Box>
                                <Box>
                                   <Typography variant="body2" fontWeight={600}>
                                     {order.item.productType.charAt(0).toUpperCase() + order.item.productType.slice(1).replace('-', ' ')}
                                     {order.item.size ? ` - Size: ${order.item.size}` : ''}
                                   </Typography>
                                    <Typography variant="body2">Color: {order.item.color}</Typography>
                                     {order.item.elements && order.item.elements.length > 0 && (
                                       <Typography variant="body2">Elements: {order.item.elements.length} added</Typography>
                                     )}
                                   <Typography variant="body2">Price: Rs. {productPrices[order.item.productType] || 0}</Typography>
                                </Box>
                              </Box>
                            ) : (
                              <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                                Order item details missing.
                              </Typography>
                            )}

                            {/* Display Address */}
                            {order.address && (
                              <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle1" fontWeight={700}>Shipping Address:</Typography>
                                <Typography variant="body2">{order.address}</Typography>
                              </Box>
                            )}

                            {/* Display Review and Rating if available */}
                            {order.review ? (
                              <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle1" fontWeight={700}>Your Review:</Typography>
                                <Rating name="read-only-rating" value={order.rating} readOnly />
                                <Typography variant="body2">{order.review}</Typography>
                              </Box>
                            ) : (
                              <Button
                                variant="contained"
                                sx={{
                                  mt: 2,
                                  borderRadius: 2,
                                  backgroundColor: 'rgb(255,106,106)',
                                  color: '#fff',
                                  fontWeight: 700,
                                  boxShadow: 'none',
                                  '&:hover': {
                                    backgroundColor: 'rgb(230,86,86)',
                                    boxShadow: 'none',
                                  }
                                }}
                                onClick={() => handleOpenReviewModal(order.id)}
                              >
                                Leave a Review
                              </Button>
                            )}

                            <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{ mt: 2 }}>Tracking:</Typography>
                            {/* Display tracking information - Assuming 'tracking' in order object is an array */} {/* Mock Tracking data - Replace with real logic if needed */}
                             <List dense disablePadding>
                               {order.tracking && order.tracking.map((track: any, trackIndex: number) => (
                                  <ListItem key={trackIndex} disableGutters>
                                    <ListItemText
                                       primary={<Typography variant="body2" fontWeight={trackIndex === order.tracking.length - 1 ? 700 : 400}>{track.status}</Typography>}
                                       secondary={<Typography variant="caption" color="text.secondary">{new Date(track.date).toLocaleString()}</Typography>}
                                    />
                                  </ListItem>
                               ))}
                             </List>

                          </Box>
                        </Collapse>
                        <Divider />
                      </React.Fragment>
                    ))
                  )}
                </List>
              </Paper>
            </TabPanel>
            {/* Addresses Tab */}
            <TabPanel value={tab} index={2}>
              <Typography variant="h5" fontWeight={700} gutterBottom>Address Book</Typography>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 3, background: '#fafbfc', boxShadow: 'none', mt: 2, maxHeight: 400, overflowY: 'auto' }}>
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
              </Paper>
            </TabPanel>
            {/* Settings Tab */}
            <TabPanel value={tab} index={3}>
              <Typography variant="h5" fontWeight={700} gutterBottom>Account Settings</Typography>
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
            </TabPanel>
          </Box>
        </Stack>
      </Paper>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({...snackbar, open: false})}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>

      {/* Photo Upload Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleGalleryUpload}>
          <PhotoLibrary sx={{ mr: 1 }} /> Upload from Gallery
        </MenuItem>
        <MenuItem onClick={handleCameraOpen}>
          <PhotoCamera sx={{ mr: 1 }} /> Take Photo
        </MenuItem>
        {user?.profileImage && (
          <MenuItem onClick={handleRemovePhoto} sx={{ color: 'error.main' }}>
            <Delete sx={{ mr: 1 }} /> Remove Photo
          </MenuItem>
        )}
      </Menu>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleFileChange}
      />

      {/* Camera Dialog */}
      <Dialog open={showCameraDialog} onClose={handleCameraClose} maxWidth="sm" fullWidth>
        <DialogTitle>Take Photo</DialogTitle>
        <DialogContent>
          <Box sx={{ position: 'relative', width: '100%', paddingTop: '75%' }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCameraClose} startIcon={<Close />}>
            Cancel
          </Button>
          <Button
            onClick={handleCapturePhoto}
            variant="contained"
            color="primary"
            startIcon={<PhotoCamera />}
          >
            Capture
          </Button>
        </DialogActions>
      </Dialog>

      {/* Review Modal */}
      <Dialog open={openReviewModal} onClose={handleCloseReviewModal} maxWidth="sm" fullWidth>
        <DialogTitle>Leave a Review</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Typography variant="subtitle1">Your Rating:</Typography>
            <Rating
              name="review-rating"
              value={reviewRating}
              onChange={(_, newValue) => setReviewRating(newValue)}
              size="large"
            />
            <TextField
              label="Your Review"
              multiline
              minRows={3}
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReviewModal}>Cancel</Button>
          <Button onClick={handleSubmitReview} variant="contained" disabled={!reviewRating || !reviewText.trim()}>
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile; 