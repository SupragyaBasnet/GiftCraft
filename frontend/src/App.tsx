import { Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AboutUs from './pages/AboutUs';
import Cart from './pages/Cart';
import CheckoutPage from './pages/CheckoutPage';
import Contact from './pages/Contact';
import Customize from './pages/Customize';
import ForgotPassword from './pages/ForgotPassword';
import Help from './pages/Help';
import Home from './pages/Home';
import Login from './pages/Login';
import OrderConfirmed from './pages/orderconfirmed';
import PaymentFailure from './pages/payment-failure';
import PaymentSuccess from './pages/payment-success';
import ProductCustomize from './pages/ProductCustomize';
import ProductDetails from './pages/ProductDetails';
import Products from './pages/Products';
import ProfileAddresses from './pages/ProfileAddresses';
import ProfileImage from './pages/ProfileImage';
import ProfileLayout from './pages/ProfileLayout';
import ProfileOrders from './pages/ProfileOrders';
import ProfileOverview from './pages/ProfileOverview';
import ProfileSettings from './pages/ProfileSettings';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import SetNewPassword from './pages/SetNewPassword';
import VerifyOtp from './pages/VerifyOtp';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#Ff4242',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <Router>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
              }}
            >
              <Navbar />
              <Box component="main" sx={{ flexGrow: 1 }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetails />} />
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/customize" element={<Customize />} />
                  <Route path="/customize/:product" element={<ProductCustomize />} />
                  <Route
                    path="/cart"
                    element={
                      <PrivateRoute>
                        <Cart />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/profile/*"
                    element={
                      <PrivateRoute>
                        <ProfileLayout />
                      </PrivateRoute>
                    }
                  >
                    <Route index element={<Navigate to="info" replace />} />
                    <Route path="image" element={<ProfileImage />} />
                    <Route path="info" element={<ProfileOverview />} />
                    <Route path="orders" element={<ProfileOrders />} />
                    <Route path="addresses" element={<ProfileAddresses />} />
                    <Route path="settings" element={<ProfileSettings />} />
                  </Route>
                 
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/help" element={<Help />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/verify-otp" element={<VerifyOtp />} />
                  <Route path="/set-new-password" element={<SetNewPassword />} />
                  <Route path="/payment-success" element={<PaymentSuccess />} />
                  <Route path="/payment-failure" element={<PaymentFailure />} />
                  <Route path="/orderconfirmed" element={<OrderConfirmed />} />
                </Routes>
              </Box>
              <Footer />
            </Box>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App; 