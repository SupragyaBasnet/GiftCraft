const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', auth, productController.createProduct);
router.put('/:id', auth, productController.updateProduct);
router.delete('/:id', auth, productController.deleteProduct);
router.post('/order', auth, productController.placeOrder);
router.get('/orders', auth, productController.getUserOrders);
router.delete('/orders', auth, productController.deleteAllUserOrders);

module.exports = router; 