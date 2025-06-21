require('dotenv').config();
const express = require('express');
const app = require('./app');

app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.send('GiftCraft backend is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 