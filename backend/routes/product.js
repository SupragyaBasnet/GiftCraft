const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const Product = require('../models/Product');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', auth, productController.createProduct);
router.put('/:id', auth, productController.updateProduct);
router.delete('/:id', auth, productController.deleteProduct);
router.post('/order', auth, productController.placeOrder);
router.get('/orders', auth, productController.getUserOrders);
router.delete('/orders', auth, productController.deleteAllUserOrders);
router.post('/add-or-get', productController.addOrGetProduct);

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

module.exports = router; 