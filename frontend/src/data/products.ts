import cap1 from "../assets/cap1.jpeg";
import cap2 from "../assets/cap2.jpeg";
import cap3 from "../assets/cap3.jpeg";
import cap4 from "../assets/cap4.jpeg";
// import frame from "../assets/frame.jpg";
import keychain1 from "../assets/keychain1.jpeg";
import keychain2 from "../assets/keychain2.webp";
import keychain3 from "../assets/keychain3.webp";
import keychain4 from "../assets/keychain4.jpeg";
import keychain from "../assets/keychain5.webp";
import mug from "../assets/mug.jpg";
import mug1 from "../assets/mug1.jpg";
import mug2 from "../assets/mug2.jpg";
import mug3 from "../assets/mug3.jpg";
import mug4 from "../assets/mug4.jpg";
import mug5 from "../assets/mug5.jpg";
import notebook1 from "../assets/notebook1.jpeg";
import notebook2 from "../assets/notebook2.jpeg";
import notebook3 from "../assets/notebook3.jpg";
import notebook4 from "../assets/notebook4.jpg";
import notebook5 from "../assets/notebook5.webp";
import pen1 from "../assets/pen1.webp";
import pen2 from "../assets/pen2.jpeg";
import pen3 from "../assets/pen3.png";
import phonecase1 from "../assets/phonecase1.jpg";
import phonecase2 from "../assets/phonecase2.jpg";
import phonecase3 from "../assets/phonecase3.jpg";
import phonecase4 from "../assets/phonecase4.jpg";
import photoframe1 from "../assets/photoframe1.jpg";
import photoframe2 from "../assets/photoframe2.jpg";
import photoframe3 from "../assets/photoframe3.jpg";
import photoframe4 from "../assets/photoframe4.jpg";
import pillowcase1 from "../assets/pillowcase1.jpg";
import pillowcase2 from "../assets/pillowcase2.jpg";
import pillowcase3 from "../assets/pillowcase3.jpg";
import pillowcase4 from "../assets/pillowcase4.jpg";
import pillowcase5 from "../assets/pillowcase5.jpg";
import pillowcase6 from "../assets/pillowcase6.jpg";
import pillowcase7 from "../assets/pillowcase7.jpg";
import tshirt1 from "../assets/tshirt1.jpeg";
import tshirt2 from "../assets/tshirt2.jpg";
import tshirt3 from "../assets/tshirt3.jpg";
import tshirt4 from "../assets/tshirt4.jpg";
import tshirt5 from "../assets/tshirt5.webp";
import waterbottle1 from "../assets/waterbottle1.jpg";
import waterbottle2 from "../assets/waterbottle2.jpg";
import waterbottle3 from "../assets/waterbottle3.jpg";
import waterbottle4 from "../assets/waterbottle4.jpg";
import waterbottle5 from "../assets/waterbottle5.jpg";


export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  images?: string[];
  description: string;
  category: string;
  rating: number;
  reviews: number;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Classic Custom T-Shirt",
    price: 1500,
    image: tshirt1,
    images: [tshirt1, tshirt2, tshirt3, tshirt4, tshirt5],
    description: "Personalize your own t-shirt with custom designs and text",
    category: "tshirts",
    rating: 4.5,
    reviews: 128,
  },
  {
    id: 13,
    name: "Premium Cotton T-Shirt",
    price: 3800,
    image: tshirt2,
    images: [tshirt2, tshirt1, tshirt3, tshirt4, tshirt5],
    description: "High-quality cotton t-shirt with premium printing",
    category: "tshirts",
    rating: 4.7,
    reviews: 95,
  },
  {
    id: 14,
    name: "Vintage Style T-Shirt",
    price: 3500,
    image: tshirt3,
    images: [tshirt3, tshirt1, tshirt2, tshirt4, tshirt5],
    description: "Vintage-inspired design with custom artwork",
    category: "tshirts",
    rating: 4.6,
    reviews: 82,
  },
  {
    id: 37,
    name: "Oversized T-Shirt",
    price: 3600,
    image: tshirt4,
    images: [tshirt4, tshirt1, tshirt2, tshirt3, tshirt5],
    description: "Trendy oversized fit with custom graphics",
    category: "tshirts",
    rating: 4.4,
    reviews: 68,
  },
  {
    id: 38,
    name: "Athletic T-Shirt",
    price: 3400,
    image: tshirt5,
    images: [tshirt5, tshirt1, tshirt2, tshirt3, tshirt4],
    description: "Performance fabric with moisture-wicking technology",
    category: "tshirts",
    rating: 4.5,
    reviews: 74,
  },
  {
    id: 2,
    name: "Classic Custom Mug",
    price: 900,
    image: mug1,
    images: [mug1, mug2, mug3, mug4, mug5, mug],
    description: "Create your own personalized mug",
    category: "mugs",
    rating: 4.7,
    reviews: 98,
  },
  {
    id: 15,
    name: "Premium Ceramic Mug",
    price: 1500,
    image: mug2,
    images: [mug2, mug1, mug3, mug4, mug5],
    description: "High-quality ceramic mug with vibrant printing",
    category: "mugs",
    rating: 4.8,
    reviews: 76,
  },
  {
    id: 16,
    name: "Travel Mug",
    price: 1800,
    image: mug3,
    images: [mug3, mug1, mug2, mug4, mug5],
    description: "Insulated travel mug with custom design",
    category: "mugs",
    rating: 4.6,
    reviews: 64,
  },
  {
    id: 3,
    name: "Phone Case",
    price: 1600,
    image: phonecase1,
    images: [phonecase1, phonecase2, phonecase3, phonecase4],
    description: "Personalize your own phone case with custom designs and text",
    category: "phonecases",
    rating: 4.3,
    reviews: 76,
  },
  {
    id: 17,
    name: "Phone Case",
    price: 1700,
    image: phonecase2,
    images: [phonecase1, phonecase2, phonecase3, phonecase4],
    description: "High-quality phone case with premium printing",
    category: "phonecases",
    rating: 4.5,
    reviews: 58,
  },
  {
    id: 18,
    name: "Phone Case",
    price: 1800,
    image: phonecase3,
    images: [phonecase1, phonecase2, phonecase3, phonecase4],
    description: "Modern minimalist design with custom artwork",
    category: "phonecases",
    rating: 4.4,
    reviews: 45,
  },




  {
    id: 4,
    name: "Baby and Mother Picture Water Bottle",
    price: 900,
    image: waterbottle1,
    images: [
      waterbottle1,
      waterbottle2,
      waterbottle3,
      waterbottle4,
      waterbottle5,
    ],
    description: "Personalized water bottle for everyday use",
    category: "waterbottles",
    rating: 4.6,
    reviews: 54,
  },
  {
    id: 19,
    name: "Insulated Water Bottle",
    price: 1200,
    image: waterbottle2,
    images: [
      waterbottle2,
      waterbottle1,
      waterbottle3,
      waterbottle4,
      waterbottle5,
    ],
    description: "Double-walled insulated bottle with custom design",
    category: "waterbottles",
    rating: 4.7,
    reviews: 42,
  },
  {
    id: 20,
    name: "Name Signature Water Bottle",
    price: 1100,
    image: waterbottle3,
    images: [
      waterbottle3,
      waterbottle1,
      waterbottle2,
      waterbottle4,
      waterbottle5,
    ],
    description: "Sports-style bottle with personalized graphics",
    category: "waterbottles",
    rating: 4.5,
    reviews: 38,
  },
  {
    id: 88,
    name: "Avenger Water Bottle",
    price: 1300,
    image: waterbottle4,
    images: [
      waterbottle4,
      waterbottle1,
      waterbottle2,
      waterbottle3,
      waterbottle5,
    ],
    description: "Space-saving design with custom artwork",
    category: "waterbottles",
    rating: 4.4,
    reviews: 31,
  },
  {
    id: 89,
    name: "We bear bears Water Bottle",
    price: 1500,
    image: waterbottle5,
    images: [
      waterbottle5,
      waterbottle1,
      waterbottle2,
      waterbottle3,
      waterbottle4,
    ],
    description: "Elegant glass bottle with custom design",
    category: "waterbottles",
    rating: 4.6,
    reviews: 27,
  },
  {
    id: 5,
    name: "Classic Cap",
    price: 700,
    image: cap1,
    images: [cap1, cap2, cap3, cap4],
    description: "Custom cap with your own logo or text",
    category: "caps",
    rating: 4.2,
    reviews: 39,
  },
  {
    id: 21,
    name: "Premium Cap",
    price: 900,
    image: cap2,
    images: [cap2, cap1, cap3, cap4],
    description: "High-quality cap with embroidered design",
    category: "caps",
    rating: 4.4,
    reviews: 31,
  },
  {
    id: 22,
    name: "Sports Cap",
    price: 800,
    image: cap3,
    images: [cap3, cap1, cap2, cap4],
    description: "Sports-style cap with custom graphics",
    category: "caps",
    rating: 4.3,
    reviews: 27,
  },
  {
    id: 49,
    name: "Snapback Cap",
    price: 850,
    image: cap4,
    images: [cap4, cap1, cap2, cap3],
    description: "Classic snapback with custom embroidery",
    category: "caps",
    rating: 4.3,
    reviews: 23,
  },
  {
    id: 6,
    name: "Premium Named Notebook",
    price: 500,
    image: notebook1,
    images: [notebook1, notebook2, notebook3, notebook4, notebook5],
    description: "Personalized notebook for notes and sketches",
    category: "notebooks",
    rating: 4.4,
    reviews: 61,
  },
  {
    id: 23,
    name: "Premium Named Notebook",
    price: 700,
    image: notebook2,
    images: [notebook2, notebook1, notebook3, notebook4, notebook5],
    description: "High-quality paper notebook with custom cover",
    category: "notebooks",
    rating: 4.6,
    reviews: 48,
  },
  {
    id: 24,
    name: "Couple Notebook",
    price: 600,
    image: notebook3,
    images: [notebook3, notebook1, notebook2, notebook4, notebook5],
    description: "Artist sketchbook with personalized design",
    category: "notebooks",
    rating: 4.5,
    reviews: 39,
  },
  {
    id: 52,
    name: "Basis Name Notebook",
    price: 900,
    image: notebook4,
    images: [notebook4, notebook1, notebook2, notebook3, notebook5],
    description: "Premium leather cover with custom embossing",
    category: "notebooks",
    rating: 4.7,
    reviews: 32,
  },
  {
    id: 53,
    name: "Picture Notebook",
    price: 400,
    image: notebook5,
    images: [notebook5, notebook1, notebook2, notebook3, notebook4],
    description: "Compact notebook with custom cover",
    category: "notebooks",
    rating: 4.3,
    reviews: 28,
  },
  {
    id: 7,
    name: "Basic Pen",
    price: 200,
    image: pen1,
    images: [pen1, pen2, pen3],
    description: "Custom pen with your name or logo",
    category: "pens",
    rating: 4.1,
    reviews: 33,
  },
  {
    id: 25,
    name: "Premium Pen",
    price: 400,
    image: pen2,
    images: [pen2, pen1, pen3],
    description: "High-quality pen with engraved design",
    category: "pens",
    rating: 4.3,
    reviews: 26,
  },
  {
    id: 26,
    name: "Gift Pen Set",
    price: 600,
    image: pen3,
    images: [pen3, pen1, pen2],
    description: "Set of personalized pens in gift box",
    category: "pens",
    rating: 4.4,
    reviews: 19,
  },
  {
    id: 27,
    name: "Premium Keychain",
    price: 250,
    image: keychain2,
    images: [keychain2, keychain1, keychain3, keychain4, keychain],
    description: "High-quality metal keychain with custom design",
    category: "keychains",
    rating: 4.2,
    reviews: 21,
  },
  {
    id: 28,
    name: "Photo Keychain",
    price: 200,
    image: keychain3,
    images: [keychain3, keychain1, keychain2, keychain4, keychain],
    description: "Keychain with your favorite photo",
    category: "keychains",
    rating: 4.1,
    reviews: 18,
  },
  {
    id: 58,
    name: "Company Logo Keychain",
    price: 300,
    image: keychain4,
    images: [keychain4, keychain1, keychain2, keychain3, keychain],
    description: "Genuine keychain with custom design",
    category: "keychains",
    rating: 4.3,
    reviews: 14,
  },
  {
    id: 59,
    name: "Star Metal Keychain",
    price: 180,
    image: keychain,
    images: [keychain, keychain1, keychain2, keychain3, keychain4],
    description: "Star Metal acrylic keychain with custom artwork",
    category: "keychains",
    rating: 4.2,
    reviews: 16,
  },
  {
    id: 60,
    name: "Rectangle Metal Keychain",
    price: 220,
    image: keychain1,
    images: [keychain1, keychain2, keychain3, keychain4, keychain],
    description: "Rectangle Metal keychain with custom engraving",
    category: "keychains",
    rating: 4.1,
    reviews: 12,
  },
  {
    id: 9,
    name: "Classic Photo Frame",
    price: 2400,
    image: photoframe1,
    images: [photoframe1, photoframe2, photoframe3, photoframe4],
    description: "Create a beautiful custom photo frame for your memories",
    category: "frames",
    rating: 4.8,
    reviews: 112,
  },
  {
    id: 29,
    name: "Premium Photo Frame",
    price: 3000,
    image: photoframe2,
    images: [photoframe2, photoframe1, photoframe3, photoframe4],
    description: "High-quality wooden frame with custom design",
    category: "frames",
    rating: 4.9,
    reviews: 88,
  },
  {
    id: 30,
    name: "Digital Photo Frame",
    price: 4500,
    image: photoframe3,
    images: [photoframe3, photoframe1, photoframe2, photoframe4],
    description: "Digital frame with multiple photo display",
    category: "frames",
    rating: 4.7,
    reviews: 65,
  },
  {
    id: 61,
    name: "Collage Frame",
    price: 3500,
    image: photoframe4,
    images: [photoframe4, photoframe1, photoframe2, photoframe3],
    description: "Frame for multiple photos with custom design",
    category: "frames",
    rating: 4.6,
    reviews: 52,
  },
  {
    id: 64,
    name: "Silk Pillow Case",
    price: 1500,
    image: pillowcase1,
    images: [pillowcase1, pillowcase2, pillowcase3],
    description: "Luxurious silk pillow case with custom design",
    category: "pillowcases",
    rating: 4.6,
    reviews: 24,
  },
  {
    id: 65,
    name: "Pink Color Silk Pillow Case",
    price: 1300,
    image: pillowcase2,
    images: [pillowcase2, pillowcase1, pillowcase3],
    description: "Comfortable case for memory foam pillows",
    category: "pillowcases",
    rating: 4.4,
    reviews: 21,
  },
  {
    id: 66,
    name: "Couple Pictured Pillow Case",
    price: 1100,
    image: pillowcase3,
    images: [pillowcase3, pillowcase1, pillowcase2],
    description: "Themed pillow case for different seasons",
    category: "pillowcases",
    rating: 4.3,
    reviews: 18,
  },
  {
    id: 67,
    name: "Heart Shaped Pillow Case",
    price: 1100,
    image: pillowcase4,
    images: [pillowcase3, pillowcase1, pillowcase2],
    description: "Themed pillow case for different seasons",
    category: "pillowcases",
    rating: 4.3,
    reviews: 18,
  },
  {
    id: 68,
    name: "Emoji Pillow Case",
    price: 1100,
    image: pillowcase5,
    images: [pillowcase3, pillowcase4, pillowcase2],
    description: "Themed pillow case for different seasons",
    category: "pillowcases",
    rating: 4.3,
    reviews: 18,
  },
  {
    id: 69,
    name: "Star Shaped Emoji Pillow Case",
    price: 1100,
    image: pillowcase6,
    images: [pillowcase5, pillowcase4, pillowcase2],
    description: "Themed pillow case for different seasons",
    category: "pillowcases",
    rating: 4.3,
    reviews: 18,
  },
  {
    id: 70,
    name: "Silk Pillow Case",
    price: 1100,
    image: pillowcase7,
    images: [pillowcase2, pillowcase4, pillowcase2],
    description: "Themed pillow case for different seasons",
    category: "pillowcases",
    rating: 4.3,
    reviews: 18,
  },
];

// TEMP: Export products as JSON for backend script
if (typeof window === 'undefined') {
  const fs = require('fs');
  fs.writeFileSync('./products.json', JSON.stringify(products, null, 2));
  console.log('Exported products.json');
}


