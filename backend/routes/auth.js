const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const { changePassword, updateProfileImage, removeProfileImage } = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', auth, authController.profile);
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-otp', authController.verifyOtp);
router.post('/reset-password', authController.resetPassword);
router.put('/profile', auth, authController.updateProfile);
router.put('/change-password', auth, changePassword);
router.put('/profile-image', auth, updateProfileImage);
router.delete('/profile-image', auth, removeProfileImage);

module.exports = router; 