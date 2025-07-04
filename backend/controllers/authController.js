const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
  // Optional: for auto-login after register

  exports.register = async (req, res) => {
    try {
      const { name, email, phone, password } = req.body;
  
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Please enter a valid email address.' });
      }
  
      // Phone validation (+977 followed by 10 digits)
      const phoneRegex = /^\+977\d{10}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({ message: 'Phone number must start with +977 and be followed by exactly 10 digits.' });
      }
  
      // Password strength validation
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character.' });
      }
  
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'Email already registered' });
      }
  
      const user = new User({ name, email, phone, password });
      await user.save();
  
      // Generate token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || "your_jwt_secret_here",
        { expiresIn: '7d' }
      );
  
      res.status(201).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          profileImage: user.profileImage,
        },
      });
    } catch (err) {
      console.error('Registration error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, isAdmin: user.isAdmin, profileImage: user.profileImage } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage || null,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper: send OTP email
const sendOtpEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to,
    subject: 'Your GiftCraft Password Reset OTP',
    text: `Your OTP for password reset is: ${otp}. It is valid for 5 minutes.`,
  });
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      // For security, always respond with success
      return res.json({ message: 'If this email exists, an OTP has been sent.' });
    }
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();
    await sendOtpEmail(email, otp);
    res.json({ message: 'If this email exists, an OTP has been sent.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.otp || !user.otpExpiry) {
    return res.status(400).json({ message: 'Invalid or expired OTP.' });
  }
  if (user.otp !== otp || user.otpExpiry < new Date()) {
    return res.status(400).json({ message: 'Invalid or expired OTP.' });
  }
  res.json({ message: 'OTP verified.' });
};

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.otp || !user.otpExpiry) {
    return res.status(400).json({ message: 'Invalid or expired OTP.' });
  }
  if (user.otp !== otp || user.otpExpiry < new Date()) {
    return res.status(400).json({ message: 'Invalid or expired OTP.' });
  }
  user.password = newPassword;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();
  res.json({ message: 'Password reset successful.' });
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (name) user.name = name;
    if (phone) user.phone = phone;
    await user.save();
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { profileImage } = req.body;
    const user = await User.findByIdAndUpdate(userId, { profileImage }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ profileImage: user.profileImage });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.removeProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByIdAndUpdate(userId, { profileImage: '' }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Profile image removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.product');
    if (!user) return res.status(404).json({ message: 'User not found' });
    console.log('[getCart] User:', req.user.id, 'Cart:', user.cart);
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { product, quantity } = req.body;
    console.log('[addToCart] User:', req.user.id, 'Product:', product, 'Quantity:', quantity);
    const existingItem = user.cart.find(item => item.product.toString() === product);
    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      user.cart.push({ product, quantity: quantity || 1 });
    }
    await user.save();
    console.log('[addToCart] Updated Cart:', user.cart);
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { product, quantity } = req.body;
    const item = user.cart.find(item => item.product.toString() === product);
    if (!item) return res.status(404).json({ message: 'Cart item not found' });
    item.quantity = quantity;
    await user.save();
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { product } = req.body;
    user.cart = user.cart.filter(item => item.product.toString() !== product);
    await user.save();
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.cart = [];
    await user.save();
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 