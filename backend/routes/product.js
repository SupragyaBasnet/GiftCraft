const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const Product = require('../models/Product');
const mongoose = require('mongoose');
const Order = require('../models/Order');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', auth, productController.createProduct);
router.put('/:id', auth, productController.updateProduct);
router.delete('/:id', auth, productController.deleteProduct);
router.post('/order', auth, productController.placeOrder);
router.get('/orders', auth, productController.getUserOrders);
router.delete('/orders', auth, productController.deleteAllUserOrders);
router.post('/add-or-get', productController.addOrGetProduct);

// Add review to an order
router.put('/orders/:orderId/review', auth, async (req, res) => {
  const { orderId } = req.params;
  const { review, rating } = req.body;
  if (!review || typeof rating !== 'number' || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Review and rating (1-5) are required.' });
  }
  try {
    const order = await Order.findOneAndUpdate(
      { _id: orderId, user: req.user.id },
      { review, rating },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found or not yours.' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/products/find?category=...&name=...
router.get('/find', async (req, res) => {
  const { category, name } = req.query;
  if (!category || !name) {
    return res.status(400).json({ message: 'Category and name are required.' });
  }
  try {
    const product = await Product.findOne({
      category: { $regex: new RegExp(`^${category}$`, 'i') },
      name: { $regex: new RegExp(`^${name}$`, 'i') }
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/products/orders?userId=...
// router.get('/orders', async (req, res, next) => {
//   if (req.query.userId) {
//     const { userId } = req.query;
//     console.log('Fetching orders for userId:', userId);
//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       console.log('Invalid userId:', userId);
//       return res.status(400).json({ message: 'Invalid user ID' });
//     }
//     try {
//       const orders = await Order.find({ user: mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 });
//       console.log('Orders found:', orders);
//       return res.json(orders);
//     } catch (err) {
//       console.error('Order fetch error:', err.message, err.stack);

//       return res.status(500).json({ message: 'Server error' });
//     }
//   }
//   next(); // fall through to the authenticated route if no userId param
// });



router.get('/orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Order fetch error:', err.message, err.stack);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router; 




