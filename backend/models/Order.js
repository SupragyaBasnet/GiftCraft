const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    }
  ],
  total: { type: Number, required: true },
  status: { type: String, default: 'Processing' },
  createdAt: { type: Date, default: Date.now },
  address: { type: String, required: true },
  paymentMethod: { type: String, required: true },
});

module.exports = mongoose.model('Order', orderSchema); 