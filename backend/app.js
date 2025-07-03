const express = require('express');
const app = express();
require('dotenv').config();

const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.send('GiftCraft backend is running!');
});

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const productRoutes = require('./routes/product');
app.use('/api/products', productRoutes);




module.exports = app;
