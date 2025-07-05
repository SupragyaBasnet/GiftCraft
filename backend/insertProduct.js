const mongoose = require('mongoose');
const Product = require('./models/Product');

const MONGO_URI = 'mongodb://localhost:27017/giftcraft'; // Update if using a different URI

async function insertProduct() {
  await mongoose.connect(MONGO_URI);

  const product = new Product({
    name: "Premium Named Notebook",
    category: "notebooks",
    price: 500,
    description: "Personalized notebook for notes and sketches",
    image: "https://your-image-url.com/notebook.jpg" // Replace with a real image URL if desired
  });

  await product.save();
  console.log('Product inserted:', product);
  await mongoose.disconnect();
}

insertProduct().catch(err => {
  console.error('Error inserting product:', err);
  mongoose.disconnect();
}); 