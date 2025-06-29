import { AddPhotoAlternate, Brush, ColorLens, Create, Edit, EmojiEmotions, FormatShapes, Palette, Payment, Save, ShoppingCart, TextFields } from '@mui/icons-material';
import FormatShapesIcon from '@mui/icons-material/FormatShapes';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import { Alert, Box, Button, Container, IconButton, MenuItem, Paper, Popover, Select, Snackbar, Tab, Tabs, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import CanvasDraw from 'react-canvas-draw';
import { ChromePicker, ColorResult } from 'react-color';
import { Rnd } from 'react-rnd';
import { useNavigate, useParams } from 'react-router-dom';

// Import product images from products directory
import frame1 from '../assets/products/frame1.jpeg';
import frame2 from '../assets/products/frame2.jpg';
import frame3 from '../assets/products/frame3.jpg';
import mugFrontImage from '../assets/products/front-mug.png';
import  notebookFront from '../assets/products/notebook.jpg';
import notebookBack from '../assets/products/notebookback.jpeg';
import penFront from '../assets/products/planepen.png';
import planepen1 from '../assets/products/planepen1.jpg';
import mugSideImage from '../assets/products/side-mug.png';
import tshirtBack from '../assets/products/whitetshirt-back.png';
import tshirtFront from '../assets/products/whitetshirt-front.jpg';

// Import the three new water bottle images
import bottle1White from '../assets/products/bottle-white1.png';
import bottleWhite2 from '../assets/products/bottle-white2.jpg';
import bottleWhite3 from '../assets/products/bottle-white3.jpg';

// Import the three new keychain images
import circleKeychain from '../assets/products/circle-keychain.jpg';
import keychainLeather from '../assets/products/keychain-leather.jpg';

// Import requested images from ../assets/
import whitepillowBack from '../assets/products/whitepillow-back.webp';
import whitepillowFront from '../assets/products/whitepillow-front.webp';

import phonecaseiphone8plus from '../assets/products/phonecaseiphone 8 plus.jpg';
import phonecaseiphone10 from '../assets/products/phonecaseiphone10.jpg';
import phonecaseiphone11 from '../assets/products/phonecaseiphone11.jpg';
import phonecaseiphone12 from '../assets/products/phonecaseiphone12.jpg';
import phonecaseiphone13promax from '../assets/products/phonecaseiphone13promax and 12 pro max.jpg';
import phonecaseiphone14 from '../assets/products/phonecaseiphone14.jpg';
import phonecases21ultra from '../assets/products/phonecases21ultra.jpg';
import phonecases23ultra from '../assets/products/phonecases23 ultra.jpg';

import keychainJpg from '../assets/products/keychain.jpg';
import planemetalkeychain from '../assets/products/planemetalkeychain.jpg';
import planemetalkeychain1 from '../assets/products/planemetalkeychain1.jpg';
import planewhitecap from '../assets/products/planewhitecap.jpg';
import planewhitekeychain from '../assets/products/planewhitekeychain.jpg';

// Assuming this is the correct filename

// Define product types
type ProductType = 'mug' | 'tshirt' | 'phonecase' | 'frame' | 'keychain' | 'pillowcase' | 'waterbottle' | 'pen' | 'notebook' | 'cap';
type ViewType = 'front' | 'back' | 'side';

interface ProductView {
  front: string;
  back?: string;
  side?: string;
}

// Define types for elements (should match the type in CustomizedProductImage.tsx)
interface Element {
  id: string;
  type: 'image' | 'text' | 'sticker' | 'art' | 'shape';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  borderColor?: string;
  fill?: boolean;
  fontFamily?: string;
  textStyle?: 'straight' | 'arcUp' | 'arcDown' | 'wavy';
  shape?: 'rectangle' | 'circle' | 'oval' | 'heart' | 'star';
  shapeSize?: number;
  rotation?: number;
}

// Map product type to images
const productImages: Record<ProductType, ProductView | string[]> = {
  tshirt: {
    front: tshirtFront,
    back: tshirtBack
  },
  notebook: {
    front: notebookFront,
    back: notebookBack // use the new image for the back
  },
  pen: [ // Use array for multiple pen options
    penFront,
    planepen1,
  ],
  mug: {
    front: mugFrontImage,
    side: mugSideImage
  },
  frame: [ // Use array for multiple frame options
    frame1,
    frame2,
    frame3,
  ],
  phonecase: [
    phonecaseiphone8plus,
    phonecaseiphone10,
    phonecaseiphone11,
    phonecaseiphone12,
    phonecaseiphone13promax,
    phonecaseiphone14,
    phonecases21ultra,
    phonecases23ultra,
  ],
  keychain: [
    keychainJpg,
    planewhitekeychain,
    planemetalkeychain,
    planemetalkeychain1,
    circleKeychain,
    keychainLeather,
  ],
  waterbottle: [ // Use array for multiple water bottle views
    bottle1White,
    bottleWhite2,
    bottleWhite3,
  ],
  cap: {
    front: planewhitecap
  },
  pillowcase: { // Use object for front/back pillowcase views
    front: whitepillowFront,
    back: whitepillowBack
  }
};

const stickers = [
  '🎉', '❤️', '🌟', '🎁', '😊', '🔥', '🥳', '💐', '👑', '🍰',
];

// Removed productAspectRatios map based on simplification request

const CanvasBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'enableRotating',
})<{ enableRotating?: boolean }>(({ theme, enableRotating }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: 350, // Revert to fixed width
  height: 350, // Revert to fixed height
  margin: '0 auto',
  background: '#fff',
  borderRadius: 16,
  boxShadow: theme.shadows[3],
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  '& img': {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
  }
}));

// Add type declaration for react-color
declare module 'react-color' {
  export interface ColorResult {
    hex: string;
    rgb: { r: number; g: number; b: number; a?: number };
    hsl: { h: number; s: number; l: number; a?: number };
  }
}

// Helper function to convert Hex to HSL and extract Hue
const hexToHsl = (hex: string) => {
  // Remove # if it exists
  const cleanHex = hex.replace('#', '');

  // Convert hex to RGB
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  // Normalize RGB values
  const normR = r / 255;
  const normG = g / 255;
  const normB = b / 255;

  // Find max and min RGB values
  const max = Math.max(normR, normG, normB);
  const min = Math.min(normR, normG, normB);
  let h = 0; // Hue
  let s = 0; // Saturation
  const l = (max + min) / 2; // Lightness

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case normR:
        h = (normG - normB) / d + (normG < normB ? 6 : 0);
        break;
      case normG:
        h = (normB - normR) / d + 2;
        break;
      case normB:
        h = (normR - normG) / d + 4;
        break;
    }

    h /= 6;
  }

  // Convert hue to degrees (0-360)
  const hueDegrees = Math.round(h * 360);
  return { h: hueDegrees, s: s, l: l };
};

// Sample art/clipart SVGs or emojis
const artLibrary = [
  {
    label: 'Teamwork',
    content: `data:image/svg+xml;utf8,<svg width='160' height='80' xmlns='http://www.w3.org/2000/svg'><text x='0' y='35' font-size='32' font-family='Arial' fill='%23555' font-style='italic'>t</text><text x='25' y='35' font-size='32' font-family='Arial' fill='%2348a9e6'>e</text><text x='55' y='35' font-size='32' font-family='Arial' fill='%2366bb6a'>a</text><text x='85' y='35' font-size='32' font-family='Arial' fill='%237e57c2'>m</text><text x='0' y='70' font-size='32' font-family='Arial' fill='%2348a9e6'>w</text><text x='40' y='70' font-size='32' font-family='Arial' fill='%23222' font-weight='bold'>o</text><text x='70' y='70' font-size='32' font-family='Arial' fill='%2366bb6a' font-weight='bold'>r</text><text x='95' y='70' font-size='32' font-family='Arial' fill='%237e57c2' font-weight='bold'>k</text></svg>`
  },
  {
    label: 'Congrats',
    content: `data:image/svg+xml;utf8,<svg width='180' height='60' xmlns='http://www.w3.org/2000/svg'><text x='0' y='35' font-size='32' font-family='Arial' fill='%23fbc02d' font-weight='bold'>CONGRATS</text><text x='0' y='55' font-size='16' font-family='Arial' fill='%23e57373'>I'M PROUD OF YOU!</text></svg>`
  },
  {
    label: 'Strategy',
    content: `data:image/svg+xml;utf8,<svg width='180' height='60' xmlns='http://www.w3.org/2000/svg'><text x='0' y='30' font-size='18' font-family='Georgia' fill='%23222'>financial</text><text x='0' y='55' font-size='32' font-family='Arial' fill='%2348a9e6' font-weight='bold'>STRATEGY</text></svg>`
  },
  {
    label: 'Content that Clicks',
    content: `data:image/svg+xml;utf8,<svg width='200' height='60' xmlns='http://www.w3.org/2000/svg'><text x='0' y='30' font-size='22' font-family='Brush Script MT' fill='%23999'>Content that</text><text x='0' y='55' font-size='32' font-family='Arial' fill='%2300b894' font-weight='bold'>CLICKS</text></svg>`
  },
  {
    label: 'Moving Parts',
    content: `data:image/svg+xml;utf8,<svg width='200' height='60' xmlns='http://www.w3.org/2000/svg'><text x='0' y='40' font-size='32' font-family='Monoton' fill='%23296fa8'>MOVING</text><text x='0' y='58' font-size='32' font-family='Monoton' fill='%23296fa8'>PARTS</text></svg>`
  },
  // Add more creative SVGs as you like
];

// Remove effectsLibrary and add toolsLibrary
const toolsLibrary = [
  {
    label: 'Pencil',
    content: `data:image/svg+xml;utf8,<svg width='48' height='48' xmlns='http://www.w3.org/2000/svg'><rect x='10' y='32' width='28' height='6' rx='2' fill='%23bdbdbd'/><rect x='20' y='8' width='8' height='28' rx='2' fill='%23fbc02d'/><polygon points='24,4 28,8 20,8' fill='%23ff7043'/></svg>`
  },
  {
    label: 'Pen',
    content: `data:image/svg+xml;utf8,<svg width='48' height='48' xmlns='http://www.w3.org/2000/svg'><rect x='20' y='8' width='8' height='28' rx='2' fill='%2348a9e6'/><rect x='22' y='36' width='4' height='8' rx='1' fill='%23296fa8'/><polygon points='24,4 28,8 20,8' fill='%23007bff'/></svg>`
  },
  {
    label: 'Paintbrush',
    content: `data:image/svg+xml;utf8,<svg width='48' height='48' xmlns='http://www.w3.org/2000/svg'><rect x='22' y='8' width='4' height='24' rx='2' fill='%238d6e63'/><ellipse cx='24' cy='36' rx='8' ry='6' fill='%23ffb300'/><ellipse cx='24' cy='40' rx='4' ry='2' fill='%23ffd54f'/></svg>`
  }
];

// Dynamically import all PNG, JPG, JPEG, and WEBP images from the art folder (Vite way)
const artModules = import.meta.glob('../assets/art/*.{png,jpg,jpeg,webp}', { eager: true });
const artImages = Object.entries(artModules).map(([path, mod]) => ({
  src: (mod as any).default,
  label: path.split('/').pop()?.replace(/\.[^/.]+$/, '').replace(/-/g, ' ').toUpperCase() || ''
}));

// Add a few example art images from Unsplash/Pexels as demo art (remote URLs)
const exampleArtImages = [
  {
    src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    label: 'COLORFUL ABSTRACT',
  },
  {
    src: 'https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&w=400',
    label: 'PAINT SPLASH',
  },
  {
    src: 'https://images.pexels.com/photos/370799/pexels-photo-370799.jpeg?auto=compress&w=400',
    label: 'MODERN ART',
  },
  {
    src: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
    label: 'MOUNTAIN ART',
  },
  {
    src: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80',
    label: 'VIBRANT SPLASH',
  },
  {
    src: 'https://images.pexels.com/photos/459225/pexels-photo-459225.jpeg?auto=compress&w=400',
    label: 'WATERCOLOR',
  },
  {
    src: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    label: 'ABSTRACT FACE',
  },
  {
    src: 'https://images.pexels.com/photos/1103971/pexels-photo-1103971.jpeg?auto=compress&w=400',
    label: 'COLORFUL LINES',
  },
  {
    src: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80',
    label: 'PASTEL ART',
  },
  {
    src: 'https://images.pexels.com/photos/355465/pexels-photo-355465.jpeg?auto=compress&w=400',
    label: 'CANVAS PAINT',
  },
  // New galaxy, moon, glitter, and cosmic themed images
  {
    src: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80',
    label: 'GALAXY SKY',
  },
  {
    src: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=400&q=80',
    label: 'MOON NIGHT',
  },
  {
    src: 'https://images.pexels.com/photos/355465/pexels-photo-355465.jpeg?auto=compress&w=400',
    label: 'GLITTER CANVAS',
  },
  {
    src: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80',
    label: 'COSMIC DREAM',
  },
  {
    src: 'https://images.unsplash.com/photo-1468421870903-4df1664ac249?auto=format&fit=crop&w=400&q=80',
    label: 'PURPLE GALAXY',
  },
  {
    src: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    label: 'MOONLIT NIGHT',
  },
  {
    src: 'https://images.pexels.com/photos/355465/pexels-photo-355465.jpeg?auto=compress&w=400',
    label: 'SPARKLE ART',
  },
];
// Filter out all art images whose label contains 'ABSTRA'
const validArtImages = artImages.filter(img => img.src && !img.src.includes('undefined') && !img.label.includes('ABSTRA'));
const allArtImages = [...exampleArtImages, ...validArtImages];

// Helper to check if an image URL is valid (for remote and local images)
function isImageUrlValid(url) {
  // Exclude undefined, empty, or broken images
  return url && !url.includes('undefined') && !url.includes('sample') && !url.includes('broken') && !url.endsWith('.svg');
}
const validAllArtImages = allArtImages.filter(img => isImageUrlValid(img.src));

// Phonecase model labels for the new images
const phonecaseLabels = [
  'iPhone 8 Plus',
  'iPhone 10',
  'iPhone 11',
  'iPhone 12',
  'iPhone 13 Pro Max / 12 Pro Max',
  'iPhone 14',
  'Samsung S21 Ultra',
  'Samsung S23 Ultra',
];

const ProductCustomize: React.FC = () => {
  const { product } = useParams<{ product: string }>();
  const navigate = useNavigate();

  // Validate product type from URL and provide default
  const selectedProduct: ProductType = (
    product && (
      Object.keys(productImages).includes(product) ||
      (product === 'mugs' && Object.keys(productImages).includes('mug')) ||
      (product === 'waterbottles' && Object.keys(productImages).includes('waterbottle')) ||
      (product === 'caps' && Object.keys(productImages).includes('cap')) ||
      (product === 'notebooks' && Object.keys(productImages).includes('notebook')) ||
      (product === 'pens' && Object.keys(productImages).includes('pen')) ||
      (product === 'phonecases' && Object.keys(productImages).includes('phonecase')) ||
      (product === 'keychains' && Object.keys(productImages).includes('keychain')) ||
      (product === 'frames' && Object.keys(productImages).includes('frame')) ||
      (product === 'pillowcases' && Object.keys(productImages).includes('pillowcase'))
    )
  ) ? (product === 'mugs' ? 'mug' : (product === 'waterbottles' ? 'waterbottle' : (product === 'caps' ? 'cap' : (product === 'notebooks' ? 'notebook' : (product === 'pens' ? 'pen' : (product === 'phonecases' ? 'phonecase' : (product === 'keychains' ? 'keychain' : (product === 'frames' ? 'frame' : (product === 'pillowcases' ? 'pillowcase' : product))))))))) as ProductType
  : 'tshirt';

  // Add authentication check on page load
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('giftcraftUser');
    if (!isLoggedIn) {
      // Save the current product type to restore after login
      localStorage.setItem('giftcraftPendingProduct', selectedProduct);
      navigate('/login');
    }
  }, [navigate, selectedProduct]);

  const [currentView, setCurrentView] = useState<ViewType>('front');
  const [currentArrayIndex, setCurrentArrayIndex] = useState(0);

  // Add state for selected notebook size
  const [selectedNotebookSize, setSelectedNotebookSize] = useState<string>('A5'); // Default size

  // Add state for selected t-shirt size
  const [selectedTshirtSize, setSelectedTshirtSize] = useState<string>('M'); // Default size

  // Add state for selected water bottle size
  const [selectedWaterBottleSize, setSelectedWaterBottleSize] = useState<string>('1 Liter'); // Default size

  // Add state for color picker anchor element
  const [colorAnchorEl, setColorAnchorEl] = useState<null | HTMLElement>(null);

  // Add state for cart items
  const [cartItems, setCartItems] = useState<any[]>(() => {
    const savedCart = localStorage.getItem('giftcraftCart');
    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch (e) {
        console.error('Failed to parse cart data from localStorage during initialization', e);
        localStorage.removeItem('giftcraftCart'); // Clear invalid data
        return []; // Return empty array on error
      }
    }
    return []; // Return empty array if no data found
  }); // Initialize state by reading from localStorage

  // Update localStorage whenever cartItems state changes - KEEP this useEffect
  React.useEffect(() => {
    localStorage.setItem('giftcraftCart', JSON.stringify(cartItems));
  }, [cartItems]); // Dependency array ensures this runs when cartItems changes

  // Clear elements and reset view when selectedProduct changes (now only via URL)
  React.useEffect(() => {
    setElements([]);
    setCurrentView('front');
    setCurrentArrayIndex(0); // Reset array index when product changes
  }, [selectedProduct]);

  // Removed useEffect for updating selectedProduct from URL as it's handled on initial render
  // Removed handleGalleryProductClick function based on simplification request
  // Removed handleProductChange function (used for dropdown) based on simplification request

  // Revert to fixed canvas height
  const canvasHeight = 350;

  // Get product-specific styling - Simplified switch cases to basic types
  const getProductStyle = (productType: ProductType) => {
    switch (productType) {
      case 'tshirt':
      case 'pillowcase':
      case 'notebook':
        return {
          padding: '10px',
          borderRadius: '8px',
        };
      case 'phonecase':
        return {
          padding: '15px',
          borderRadius: '20px',
        };
      case 'keychain':
        return {
          padding: '5px',
          borderRadius: '4px',
        };
        case 'mug':
          return {
            padding: '5px',
            borderRadius: '4px',
          };
      case 'waterbottle':
        return {
          padding: '10px',
          borderRadius: '8px',
        };
      case 'pen':
        return {
          padding: '5px',
          borderRadius: '4px',
        };
      default:
        return {
          padding: '10px',
          borderRadius: '8px',
        };
    }
  };

  // Check if the current product has back or side views defined (for object type)
  const isProductViewObject = typeof productImages[selectedProduct] === 'object' && !Array.isArray(productImages[selectedProduct]);
  const hasBackView = isProductViewObject && (productImages[selectedProduct] as ProductView)?.back !== undefined;
  const hasSideView = isProductViewObject && (productImages[selectedProduct] as ProductView)?.side !== undefined;
  const hasMultipleViews = hasBackView || hasSideView;
  const hasArrayViews = Array.isArray(productImages[selectedProduct]);

  const handleColorClick = (event: React.MouseEvent<HTMLElement>) => {
    setColorAnchorEl(event.currentTarget);
  };

  const handleColorClose = () => {
    setColorAnchorEl(null);
  };

  const handleColorChange = (color: ColorResult) => {
    setColor(color.hex);
  };

  const colorPickerOpen = Boolean(colorAnchorEl);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const newElement: Element = {
          id: Date.now().toString(),
          type: 'image',
          content: ev.target?.result as string,
          x: 50,
          y: 50,
          width: 120,
          height: 120,
          shape: 'rectangle',
        };
        setElements([...elements, newElement]);
        setSnackbar({open: true, message: 'Image uploaded successfully!', severity: 'success'});
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleAddText = () => {
    if (text) {
      const newElement: Element = {
        id: Date.now().toString(),
        type: 'text',
        content: text,
        x: 50,
        y: 50,
        width: 200,
        height: 50,
        fontFamily: selectedFont,
        textStyle,
      };
      setElements([...elements, newElement]);
      setText('');
      setSnackbar({open: true, message: 'Text added successfully!', severity: 'success'});
    }
  };

  const handleAddSticker = (stickerContent: string) => {
    const newElement: { id: string; type: 'image' | 'text' | 'sticker'; content: string; x: number; y: number; width: number; height: number } = {
      id: Date.now().toString(),
      type: 'sticker',
      content: stickerContent,
      x: 50,
      y: 50,
      width: 50,
      height: 50
    };
    setElements([...elements, newElement]);
    setSnackbar({open: true, message: 'Sticker added successfully!', severity: 'success'});
  };

  const handleDeleteElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
    setSnackbar({open: true, message: 'Element deleted successfully!', severity: 'success'});
  };

  const handleSave = () => {
    // Capture current customization details
    const currentCustomization = {
      productType: selectedProduct,
      viewIndex: hasArrayViews ? currentArrayIndex : currentView, // Use array index or view type
      size: selectedProduct === 'notebook' ? selectedNotebookSize
            : selectedProduct === 'tshirt' ? selectedTshirtSize
            : selectedProduct === 'waterbottle' ? selectedWaterBottleSize
            : undefined, // Capture size if applicable
      color: color,
      // Clean up elements before saving
      elements: elements.map(el => ({
          id: el.id,
          type: el.type,
          content: el.content,
          x: el.x,
          y: el.y,
          width: el.width,
          height: el.height,
          color: (el.type === 'text' && el.color) ? el.color : undefined, // Include color only for text elements if present
          fontFamily: el.fontFamily,
          textStyle: el.textStyle,
      })),
      image: currentImage, // Capture the image URL that was customized
    };
    console.log('Customization Saved:', currentCustomization); // Log to console for demonstration
    setSnackbar({open: true, message: 'Customization saved!', severity: 'success'});
    // In a real application, you would save this to a backend or localStorage
  };

  const handleAddToCart = () => {
    const customizedItem = {
      id: Date.now(), // Use timestamp for a simple unique ID
        productType: selectedProduct,
      image: Array.isArray(productImages[selectedProduct]) 
        ? (productImages[selectedProduct] as string[])[currentArrayIndex] 
        : (productImages[selectedProduct] as ProductView)[currentView],
      elements: elements,
        color: color,
      size: selectedProduct === 'tshirt' ? selectedTshirtSize : (selectedProduct === 'notebook' ? selectedNotebookSize : undefined),
      quantity: 1, // Default quantity to 1
    };

    const existingCart = JSON.parse(localStorage.getItem('giftcraftCart') || '[]');
    const updatedCart = [...existingCart, customizedItem];
    
    localStorage.setItem('giftcraftCart', JSON.stringify(updatedCart));
    setCartItems(updatedCart); // Update local state to reflect change

    setSnackbar({ open: true, message: 'Added to cart!', severity: 'success' });
    navigate('/cart'); // Redirect to cart page after adding
  };

  const handleBuyNow = () => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('giftcraftUser'); // Assuming we store user data in localStorage
    if (!isLoggedIn) {
      // Save current customization to localStorage to restore after login
      const currentCustomization = {
        productType: selectedProduct,
        viewIndex: hasArrayViews ? currentArrayIndex : currentView, // Use array index or view type
        size: selectedProduct === 'notebook' ? selectedNotebookSize
              : selectedProduct === 'tshirt' ? selectedTshirtSize
              : selectedProduct === 'waterbottle' ? selectedWaterBottleSize
              : undefined,
        color: color,
        // Clean up elements before saving
        elements: elements.map(el => ({
            id: el.id,
            type: el.type,
            content: el.content,
            x: el.x,
            y: el.y,
            width: el.width,
            height: el.height,
            color: (el.type === 'text' && el.color) ? el.color : undefined, // Include color only for text elements if present
            fontFamily: el.fontFamily,
            textStyle: el.textStyle,
        })),
        image: currentImage,
      };
      localStorage.setItem('giftcraftPendingCustomization', JSON.stringify(currentCustomization));
      // Redirect to login page
      navigate('/login');
      return;
    }

    // If logged in, proceed with buy now
    const customizedProduct = {
      id: Date.now(),
      productType: selectedProduct,
      viewIndex: hasArrayViews ? currentArrayIndex : currentView, // Use array index or view type
      size: selectedProduct === 'notebook' ? selectedNotebookSize
            : selectedProduct === 'tshirt' ? selectedTshirtSize
            : selectedProduct === 'waterbottle' ? selectedWaterBottleSize
            : undefined,
      color: color,
      elements: elements,
      image: currentImage,
    };

    localStorage.setItem('giftcraftCheckoutItem', JSON.stringify(customizedProduct));
    navigate('/checkout');
  };

  // Add useEffect to restore customization after login
  useEffect(() => {
    const pendingCustomization = localStorage.getItem('giftcraftPendingCustomization');
    const pendingProduct = localStorage.getItem('giftcraftPendingProduct');
    
    if (pendingProduct) {
      // Navigate to the correct product page
      navigate(`/customize/${pendingProduct}`);
      localStorage.removeItem('giftcraftPendingProduct');
    }

    if (pendingCustomization) {
      try {
        const customization = JSON.parse(pendingCustomization);
        // Restore customization state
        setColor(customization.color);
        setElements(customization.elements);
        if (customization.size) {
          if (selectedProduct === 'notebook') {
            setSelectedNotebookSize(customization.size);
          } else if (selectedProduct === 'tshirt') {
            setSelectedTshirtSize(customization.size);
          } else if (selectedProduct === 'waterbottle') {
            setSelectedWaterBottleSize(customization.size);
          }
        }
        // Restore array index or view type
        if (hasArrayViews) {
          setCurrentArrayIndex(customization.viewIndex as number); // Assuming viewIndex is stored as index for arrays
        } else {
          setCurrentView(customization.viewIndex as ViewType); // Assuming viewIndex is stored as view type for objects
        }
        // Clear the pending customization
        localStorage.removeItem('giftcraftPendingCustomization');
      } catch (e) {
        console.error('Failed to restore customization:', e);
        localStorage.removeItem('giftcraftPendingCustomization');
      }
    } else if (pendingProduct) { // Handle case where only product was pending
       // No customization to restore, but make sure view is reset if needed
       setCurrentView('front');
       setCurrentArrayIndex(0);
    }
  }, [selectedProduct, navigate, hasArrayViews]); // Added hasArrayViews to dependencies

  // Determine the current image based on selected product and view
  const currentImage = hasArrayViews
    ? (productImages[selectedProduct] as string[])[currentArrayIndex]
    : currentView === 'back' && isProductViewObject && (productImages[selectedProduct] as ProductView)?.back
      ? (productImages[selectedProduct] as ProductView)?.back
      : currentView === 'side' && isProductViewObject && (productImages[selectedProduct] as ProductView)?.side
        ? (productImages[selectedProduct] as ProductView)?.side
        : isProductViewObject ? (productImages[selectedProduct] as ProductView)?.front : ''; // Fallback for non-array, non-object (shouldn't happen)

  const [color, setColor] = useState('#ffffff');
  const [text, setText] = useState('');
  const [textColor, setTextColor] = useState('#F46A6A');
  const [sticker, setSticker] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [tab, setTab] = useState(0);
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'success'|'error'}>({open: false, message: '', severity: 'success'});
  const [elements, setElements] = useState<Element[]>([]);
  const [shapeColor, setShapeColor] = useState('#F46A6A');
  const [shapeBorderColor, setShapeBorderColor] = useState('#222222');
  const [shapeFill, setShapeFill] = useState(true);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [drawingTool, setDrawingTool] = useState<'paintbrush' | 'pen' | 'pencil'>('paintbrush');
  const [drawingColor, setDrawingColor] = useState('#222');
  const [canvasRef, setCanvasRef] = useState<any>(null);
  const [brushSize, setBrushSize] = useState(6);
  const [textStyle, setTextStyle] = useState<'straight' | 'arcUp' | 'arcDown' | 'wavy'>('straight');

  // Tool settings
  const toolSettings = {
    paintbrush: { brushRadius: brushSize, color: drawingColor },
    pen: { brushRadius: brushSize, color: drawingColor },
    pencil: { brushRadius: brushSize, color: drawingColor },
  };

  const updateElement = (id: string, changes: Partial<Element>) => {
    setElements(els => els.map(el => el.id === id ? { ...el, ...changes } : el));
  };

  const handleAddArt = (artContent: string) => {
    const newElement: Element = {
      id: Date.now().toString(),
      type: 'art',
      content: artContent,
      x: 60,
      y: 60,
      width: 60,
      height: 60,
      shape: 'rectangle',
    };
    setElements([...elements, newElement]);
    setSnackbar({ open: true, message: 'Art added!', severity: 'success' });
  };

  const handleAddShape = (shape: 'rectangle' | 'circle' | 'stripe' | 'line-h' | 'line-v' | 'line-d' | 'triangle' | 'arrow' | 'pentagon' | 'hexagon' | 'star' | 'heart' | 'diamond', fill: boolean, fillColor: string, borderColor: string) => {
    let width = 60, height = 60;
    if (shape === 'stripe') { width = 120; height = 20; }
    if (shape === 'line-h') { width = 100; height = 6; }
    if (shape === 'line-v') { width = 6; height = 100; }
    if (shape === 'line-d') { width = 100; height = 6; }
    if (shape === 'arrow') { width = 80; height = 30; }
    if (shape === 'triangle') { width = 60; height = 60; }
    if (shape === 'pentagon' || shape === 'hexagon' || shape === 'star' || shape === 'heart' || shape === 'diamond') { width = 60; height = 60; }
    const newElement: Element = {
      id: Date.now().toString(),
      type: 'shape',
      content: shape,
      x: 70,
      y: 70,
      width,
      height,
      color: fillColor,
      borderColor,
      fill,
    } as any;
    setElements([...elements, newElement]);
    setSnackbar({ open: true, message: `${shape.charAt(0).toUpperCase() + shape.slice(1)} added!`, severity: 'success' });
  };

  const handleAddEffect = (effectContent: string) => {
    const newElement: Element = {
      id: Date.now().toString(),
      type: 'art',
      content: effectContent,
      x: 0,
      y: 0,
      width: 350,
      height: canvasHeight,
    };
    setElements([...elements, newElement]);
    setSnackbar({ open: true, message: 'Effect added!', severity: 'success' });
  };

  // Add state for font selection
  const [selectedFont, setSelectedFont] = useState('Arial');
  const fontOptions = [
    { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
    { label: 'Courier New', value: '"Courier New", Courier, monospace' },
    { label: 'Comic Sans MS', value: '"Comic Sans MS", cursive, sans-serif' },
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
    { label: 'Monospace', value: 'monospace' },
  ];

  const [selectedPhonecaseIndex, setSelectedPhonecaseIndex] = useState(0);

  const shapeOptions = [
    { value: 'rectangle', label: 'Rectangle' },
    { value: 'circle', label: 'Circle' },
    { value: 'oval', label: 'Oval' },
    { value: 'heart', label: 'Heart' },
    { value: 'star', label: 'Star' },
  ];

  const [shapeAnchorEl, setShapeAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={4} sx={{ p: { xs: 2, md: 4 }, mb: 4, borderRadius: 4 }}>
        <Typography variant="h4" fontWeight={900} gutterBottom align="center">
          Customize Your {selectedProduct.charAt(0).toUpperCase() + selectedProduct.slice(1).replace('-', ' ')}
        </Typography>
        
        {/* View Options */}
        {hasArrayViews ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} mb={1}>Select View:</Typography>
            {/* Remove dropdown for keychain */}
            {selectedProduct === 'phonecase' && (
              <TextField
                select
                label="Phone Model"
                value={selectedPhonecaseIndex}
                onChange={e => {
                  setSelectedPhonecaseIndex(Number(e.target.value));
                  setCurrentArrayIndex(Number(e.target.value));
                }}
                sx={{ minWidth: 180, mb: 2 }}
              >
                {phonecaseLabels.map((label, idx) => (
                  <MenuItem key={label} value={idx}>{label}</MenuItem>
                ))}
              </TextField>
            )}
            <Box sx={{ display: 'flex', gap: 2 }}>
              {(productImages[selectedProduct] as string[]).map((image: string, index: number) => (
                <Box
                  key={index}
                  component="img"
                  src={image}
                  alt={`${selectedProduct} View ${index + 1}`}
                  sx={{
                    width: 60,
                    height: 60,
                    objectFit: 'contain',
                    borderRadius: 1,
                    border: index === currentArrayIndex ? '2px solid #F46A6A' : '1px solid #ccc',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    bgcolor: 'white',
                    p: 0.5,
                    '&:hover': {
                      borderColor: '#F46A6A',
                    }
                  }}
                  onClick={() => {
                    setCurrentArrayIndex(index);
                    if (selectedProduct === 'phonecase') setSelectedPhonecaseIndex(index);
                  }}
                />
              ))}
            </Box>
          </Box>
        ) : hasMultipleViews ? ( /* Existing View Toggle for products with front/back/side */
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <ToggleButtonGroup
              value={currentView}
              exclusive
              onChange={(_, newValue) => setCurrentView(newValue as ViewType)}
              aria-label="view mode"
              sx={{
                mb: 2,
                '& .MuiToggleButton-root': {
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  '&.Mui-selected': {
                    backgroundColor: '#F46A6A',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#e05555',
                    }
                  }
                }
              }}
            >
              <ToggleButton value="front">Front</ToggleButton>
              {(productImages[selectedProduct] as ProductView)?.back && <ToggleButton value="back">Back</ToggleButton>}
              {(productImages[selectedProduct] as ProductView)?.side && <ToggleButton value="side">Side</ToggleButton>}
            </ToggleButtonGroup>
          </Box>
        ) : ( /* Render nothing for single-image products */
           null
        )}

        {/* Gallery - Product Thumbnail (Keep this as a small preview of the current view) */}
         <Box sx={{ mb: 3, textAlign: 'center' }}> {/* Center the thumbnail */}
          <Typography variant="subtitle1" fontWeight={700} mb={1}>
            {hasArrayViews ? 'Current View:' : hasMultipleViews ? (currentView === 'front' ? 'Front' : (currentView === 'back' ? 'Back' : 'Side')) : ''}
          </Typography>
          <Box
                component="img"
                src={currentImage}
                alt={`${selectedProduct}-${hasArrayViews ? (currentArrayIndex + 1) : hasMultipleViews ? currentView : ''}`}
                sx={{
                  width: 80,
                  height: 80,
                  objectFit: 'contain',
                  borderRadius: 2,
                  border: '1px solid #ccc', // Static border
                  transition: 'all 0.2s',
                  bgcolor: 'white',
                  p: 1,
                }}
              />
        </Box>

        {/* Size Selection - Moved above image */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          {selectedProduct === 'notebook' && (
            <TextField
              select
              label="Size"
              value={selectedNotebookSize}
              onChange={(e) => setSelectedNotebookSize(e.target.value)}
              sx={{ minWidth: 120 }}
              title="A4: 210x297mm, A5: 148x210mm, B5: 176x250mm"
            >
              <MenuItem value="A4">A4</MenuItem>
              <MenuItem value="A5">A5</MenuItem>
              <MenuItem value="B5">B5</MenuItem>
            </TextField>
          )}
          {selectedProduct === 'tshirt' && (
            <TextField
              select
              label="Size"
              value={selectedTshirtSize}
              onChange={(e) => setSelectedTshirtSize(e.target.value)}
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="S">S</MenuItem>
              <MenuItem value="M">M</MenuItem>
              <MenuItem value="L">L</MenuItem>
              <MenuItem value="XL">XL</MenuItem>
              <MenuItem value="XXL">XXL</MenuItem>
            </TextField>
          )}
          {selectedProduct === 'waterbottle' && (
            <TextField
              select
              label="Size"
              value={selectedWaterBottleSize}
              onChange={(e) => setSelectedWaterBottleSize(e.target.value)}
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="1 Liter">1 Liter</MenuItem>
              <MenuItem value="0.5 Liter">0.5 Liter</MenuItem>
            </TextField>
          )}
        </Box>

        {/* Customization Canvas */}
        <CanvasBox
          sx={{
            mb: 3,
            height: canvasHeight,
            maxWidth: 350,
            position: 'relative',
          }}
        >
          {selectedProduct === 'cap' ? (
            <Box component="img"
              src={planewhitecap}
              alt="cap"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: color !== '#ffffff' ? `brightness(0) saturate(100%) sepia(1) hue-rotate(${hexToHsl(color).h}deg) saturate(500%)` : 'none',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 2,
              }}
            />
          ) : (
            <Box
              component="img"
              src={currentImage}
              alt="product"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 1,
                pointerEvents: 'none',
                p: 2,
                ...getProductStyle(selectedProduct),
                filter: color === '#ffffff' ? 'none' : `brightness(0) saturate(100%) sepia(1) hue-rotate(${hexToHsl(color).h}deg) saturate(500%)`,
              }}
            />
          )}
          {tab === 6 && (
            <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2 }}>
              <CanvasDraw
                ref={setCanvasRef}
                brushRadius={toolSettings[drawingTool].brushRadius}
                brushColor={toolSettings[drawingTool].color}
                canvasWidth={350}
                canvasHeight={canvasHeight}
                hideGrid={true}
                lazyRadius={0}
                style={{ width: '100%', height: '100%', background: 'transparent' }}
              />
            </Box>
          )}
          {elements.map((el) => (
            <Rnd
              key={el.id}
              size={{ width: el.width, height: el.height }}
              position={{ x: el.x, y: el.y }}
              bounds="parent"
              enableResizing={true}
              onDragStop={(e, d) => updateElement(el.id, { x: d.x, y: d.y })}
              onResizeStop={(e, direction, ref, delta, position) => updateElement(el.id, { width: parseInt(ref.style.width), height: parseInt(ref.style.height), ...position })}
              style={{
                zIndex: 3,
                border: selectedElementId === el.id ? '2px solid #F46A6A' : '2px dashed orange',
                boxShadow: selectedElementId === el.id ? '0 0 8px #F46A6A55' : 'none',
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'move',
                transform: `rotate(${el.rotation || 0}deg)`,
              }}
              onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                e.stopPropagation();
                setSelectedElementId(el.id);
                if (el.type === 'text') setEditText(el.content);
              }}
            >
              {el.type === 'image' && (
                <Box
                  component="img"
                  src={el.content}
                  alt="uploaded"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                    borderRadius: el.shape === 'circle' ? '50%' : 0,
                    clipPath:
                      el.shape === 'oval' ? `ellipse(${(el.shapeSize||100)/2}% ${(el.shapeSize||100)*0.4/1}% at 50% 50%)` :
                      el.shape === 'heart' ? `path('M 50 30 C 50 15, 90 15, 90 37.5 C 90 60, 50 80, 50 95 C 50 80, 10 60, 10 37.5 C 10 15, 50 15, 50 30 Z') scale(${(el.shapeSize||100)/100})` :
                      el.shape === 'star' ? `polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%) scale(${(el.shapeSize||100)/100})` :
                      undefined,
                  }}
                />
              )}
              {el.type === 'text' && (
                el.textStyle === 'arcUp' ? (
                  <svg width={el.width} height={el.height} viewBox={`0 0 ${el.width} ${el.height}`} style={{ width: '100%', height: '100%' }}>
                    <defs>
                      <path id={`arcUp-preview-${el.id}`} d={`M20,${el.height-20} Q${el.width/2},${-el.height/2} ${el.width-20},${el.height-20}`} fill="none" />
                    </defs>
                    <text fill={el.color || textColor} fontWeight="700" fontSize={Math.max(10, Math.min(el.height * 0.4, el.width / el.content.length))} textAnchor="middle">
                      <textPath xlinkHref={`#arcUp-preview-${el.id}`} startOffset="50%">{el.content}</textPath>
                    </text>
                  </svg>
                ) : el.textStyle === 'arcDown' ? (
                  <svg width={el.width} height={el.height} viewBox={`0 0 ${el.width} ${el.height}`} style={{ width: '100%', height: '100%' }}>
                    <defs>
                      <path id={`arcDown-preview-${el.id}`} d={`M20,20 Q${el.width/2},${el.height*1.2} ${el.width-20},20`} fill="none" />
                    </defs>
                    <text fill={el.color || textColor} fontWeight="700" fontSize={Math.max(10, Math.min(el.height * 0.4, el.width / el.content.length))} textAnchor="middle">
                      <textPath xlinkHref={`#arcDown-preview-${el.id}`} startOffset="50%">{el.content}</textPath>
                    </text>
                  </svg>
                ) : el.textStyle === 'wavy' ? (
                  <svg width={el.width} height={el.height} viewBox={`0 0 ${el.width} ${el.height}`} style={{ width: '100%', height: '100%' }}>
                    <defs>
                      <path id={`wavy-preview-${el.id}`} d={`M20,${el.height/2} Q${el.width/4},${el.height/2-20} ${el.width/2},${el.height/2} T${el.width-20},${el.height/2}`} fill="none" />
                    </defs>
                    <text fill={el.color || textColor} fontWeight="700" fontSize={Math.max(10, Math.min(el.height * 0.4, el.width / el.content.length))} textAnchor="middle">
                      <textPath xlinkHref={`#wavy-preview-${el.id}`} startOffset="50%">{el.content}</textPath>
                    </text>
                  </svg>
                ) : (
                  <Typography
                    sx={{
                      color: el.color || textColor,
                      fontWeight: 700,
                      textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      fontFamily: el.fontFamily || 'Arial, sans-serif',
                      fontSize: `${Math.max(10, el.height * 0.7)}px`,
                    }}
                  >
                    {el.content}
                  </Typography>
                )
              )}
              {el.type === 'sticker' && (
                <Typography sx={{ fontSize: `${Math.max(10, el.height * 0.8)}px`, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>{el.content}</Typography>
              )}
              {el.type === 'art' && (
                <Box
                  component="img"
                  src={el.content}
                  alt="art"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 2px 8px #FFD700)',
                    borderRadius: el.shape === 'circle' ? '50%' : 0,
                    clipPath:
                      el.shape === 'oval' ? `ellipse(${(el.shapeSize||100)/2}% ${(el.shapeSize||100)*0.4/1}% at 50% 50%)` :
                      el.shape === 'heart' ? `path('M 50 30 C 50 15, 90 15, 90 37.5 C 90 60, 50 80, 50 95 C 50 80, 10 60, 10 37.5 C 10 15, 50 15, 50 30 Z') scale(${(el.shapeSize||100)/100})` :
                      el.shape === 'star' ? `polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%) scale(${(el.shapeSize||100)/100})` :
                      undefined,
                  }}
                />
              )}
              {el.type === 'shape' && (
                el.content === 'rectangle' ? (
                  <Box sx={{ width: '100%', height: '100%', bgcolor: el.fill ? el.color : 'transparent', border: `2px solid ${el.borderColor}`, borderRadius: 1 }} />
                ) : el.content === 'circle' ? (
                  <Box sx={{ width: '100%', height: '100%', bgcolor: el.fill ? el.color : 'transparent', border: `2px solid ${el.borderColor}`, borderRadius: '50%' }} />
                ) : el.content === 'stripe' ? (
                  <Box sx={{ width: '100%', height: 20, bgcolor: el.color, border: `2px solid ${el.borderColor}` }} />
                ) : el.content === 'line-h' ? (
                  <Box sx={{ width: '100%', height: 6, bgcolor: 'transparent', borderBottom: `4px solid ${el.borderColor}` }} />
                ) : el.content === 'line-v' ? (
                  <Box sx={{ width: 6, height: '100%', bgcolor: 'transparent', borderRight: `4px solid ${el.borderColor}` }} />
                ) : el.content === 'line-d' ? (
                  <Box sx={{ width: '100%', height: 6, bgcolor: 'transparent', borderBottom: `4px solid ${el.borderColor}`, transform: 'rotate(-45deg)' }} />
                ) : el.content === 'triangle' ? (
                  <Box sx={{ width: 0, height: 0, borderLeft: '30px solid transparent', borderRight: '30px solid transparent', borderBottom: el.fill ? `60px solid ${el.color}` : 'none', borderTop: !el.fill ? `60px solid transparent` : 'none', borderBottomColor: el.fill ? el.color : 'transparent', borderTopColor: !el.fill ? el.borderColor : 'transparent', borderWidth: el.fill ? '0 30px 60px 30px' : '0 30px 0 30px' }} />
                ) : el.content === 'arrow' ? (
                  <Box sx={{ position: 'relative', width: 60, height: 40 }}>
                    <Box sx={{ width: 0, height: 0, borderTop: '15px solid transparent', borderBottom: '15px solid transparent', borderLeft: `40px solid ${el.color}`, position: 'absolute', left: 0, top: 5 }} />
                    <Box sx={{ width: 0, height: 0, borderTop: '30px solid transparent', borderBottom: '30px solid transparent', borderLeft: `20px solid ${el.color}`, position: 'absolute', left: 40, top: -10 }} />
                  </Box>
                ) : el.content === 'pentagon' ? (
                  <svg width="100%" height="100%" viewBox="0 0 100 100"><polygon points="50,10 90,40 73,90 27,90 10,40" fill={el.fill ? el.color : 'transparent'} stroke={el.borderColor} strokeWidth="4" /></svg>
                ) : el.content === 'hexagon' ? (
                  <svg width="100%" height="100%" viewBox="0 0 100 100"><polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill={el.fill ? el.color : 'transparent'} stroke={el.borderColor} strokeWidth="4" /></svg>
                ) : el.content === 'star' ? (
                  <svg width="100%" height="100%" viewBox="0 0 100 100"><polygon points="50,10 61,39 92,39 66,59 76,89 50,70 24,89 34,59 8,39 39,39" fill={el.fill ? el.color : 'transparent'} stroke={el.borderColor} strokeWidth="4" /></svg>
                ) : el.content === 'heart' ? (
                  <svg width="100%" height="100%" viewBox="0 0 100 100"><path d="M50 80 L20 50 A20 20 0 1 1 50 30 A20 20 0 1 1 80 50 Z" fill={el.fill ? el.color : 'transparent'} stroke={el.borderColor} strokeWidth="4" /></svg>
                ) : el.content === 'diamond' ? (
                  <svg width="100%" height="100%" viewBox="0 0 100 100"><polygon points="50,10 90,50 50,90 10,50" fill={el.fill ? el.color : 'transparent'} stroke={el.borderColor} strokeWidth="4" /></svg>
                ) : null
              )}
              <Button size="small" color="error" onClick={() => setElements(elements.filter(e => e.id !== el.id))} sx={{ position: 'absolute', top: -8, right: -8, minWidth: 24, width: 24, height: 24, borderRadius: '50%', p: 0, bgcolor: 'white', boxShadow: 1, '&:hover': { bgcolor: '#ffebee' } }}>×</Button>
              {(el.type === 'image' || el.type === 'art') && (
                <>
                  <IconButton
                    size="small"
                    sx={{ position: 'absolute', top: -32, left: '50%', transform: 'translateX(-50%)', zIndex: 10, bgcolor: 'white', boxShadow: 1 }}
                    onClick={e => { setShapeAnchorEl(e.currentTarget); setSelectedElementId(el.id); }}
                  >
                    <FormatShapesIcon fontSize="small" />
                  </IconButton>
                  <Popover
                    open={Boolean(shapeAnchorEl) && selectedElementId === el.id}
                    anchorEl={shapeAnchorEl}
                    onClose={() => setShapeAnchorEl(null)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                  >
                    <Box sx={{ p: 2, minWidth: 180 }}>
                      <ToggleButtonGroup
                        value={el.shape || 'rectangle'}
                        exclusive
                        onChange={(_, value) => { if (value) { updateElement(el.id, { shape: value }); } }}
                        size="small"
                        sx={{ mb: 2 }}
                      >
                        {shapeOptions.map(opt => (
                          <ToggleButton key={opt.value} value={opt.value}>{opt.label}</ToggleButton>
                        ))}
                      </ToggleButtonGroup>
                      {(el.shape && el.shape !== 'rectangle') && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>Shape Size</Typography>
                          <Slider
                            min={50}
                            max={100}
                            value={el.shapeSize || 100}
                            onChange={(_, value) => updateElement(el.id, { shapeSize: value as number })}
                            valueLabelDisplay="auto"
                          />
                        </Box>
                      )}
                    </Box>
                  </Popover>
                </>
              )}
              {selectedElementId === el.id && (
                <Box
                  sx={{
                    position: 'absolute',
                    left: '50%',
                    bottom: -36,
                    transform: 'translateX(-50%)',
                    zIndex: 20,
                    cursor: 'grab',
                    bgcolor: 'white',
                    borderRadius: '50%',
                    boxShadow: 2,
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #F46A6A',
                    p: 0,
                    userSelect: 'none',
                  }}
                  onMouseDown={e => {
                    e.stopPropagation();
                    const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                    const centerX = rect ? rect.left + rect.width / 2 : e.clientX;
                    const centerY = rect ? rect.top + rect.height / 2 : e.clientY;
                    function onMouseMove(ev: MouseEvent) {
                      const dx = ev.clientX - centerX;
                      const dy = ev.clientY - centerY;
                      let angle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
                      if (angle < 0) angle += 360;
                      updateElement(el.id, { rotation: angle });
                      console.log('Rotating', el.id, angle);
                    }
                    function onMouseUp() {
                      window.removeEventListener('mousemove', onMouseMove);
                      window.removeEventListener('mouseup', onMouseUp);
                    }
                    window.addEventListener('mousemove', onMouseMove);
                    window.addEventListener('mouseup', onMouseUp);
                  }}
                >
                  <RotateRightIcon fontSize="small" sx={{ color: '#F46A6A' }} />
                </Box>
              )}
            </Rnd>
          ))}
        </CanvasBox>

        {/* Floating toolbar for editing text */}
        {selectedElementId && (() => {
          const selectedEl = elements.find(el => el.id === selectedElementId);
          console.log('Selected element:', selectedEl);
          if (!selectedEl) return null;
          if (selectedEl.type === 'text') {
            return (
              <Box sx={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, bgcolor: 'white', boxShadow: 2, borderRadius: 2, p: 1, display: 'flex', gap: 1, alignItems: 'center', border: '2px solid #1976d2' }}>
                <TextField size="small" value={editText} onChange={e => setEditText(e.target.value)} onBlur={(e: React.FocusEvent<HTMLInputElement>) => updateElement(selectedElementId, { content: editText })} />
                <input type="color" value={selectedEl.color || '#000000'} onChange={e => updateElement(selectedElementId, { color: e.target.value })} style={{ width: 28, height: 28, border: 'none', background: 'none' }} />
                <Select
                  size="small"
                  value={selectedEl.textStyle || 'straight'}
                  onChange={e => updateElement(selectedElementId, { textStyle: e.target.value as 'straight' | 'arcUp' | 'arcDown' | 'wavy' })}
                  sx={{ minWidth: 100 }}
                >
                  <MenuItem value="straight">Straight</MenuItem>
                  <MenuItem value="arcUp">Arc Up</MenuItem>
                  <MenuItem value="arcDown">Arc Down</MenuItem>
                  <MenuItem value="wavy">Wavy</MenuItem>
                </Select>
                <Button size="small" color="error" onClick={() => setElements(elements.filter(e => e.id !== selectedElementId))}>Delete</Button>
              </Box>
            );
          } else if (selectedEl.type === 'image' || selectedEl.type === 'art') {
            console.log('Rendering shape picker for:', selectedEl.id, selectedEl.type);
            return (
              <Box sx={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, bgcolor: 'white', boxShadow: 2, borderRadius: 2, p: 1, display: 'flex', gap: 1, alignItems: 'center', border: '2px solid #d32f2f' }}>
                <div style={{ color: '#d32f2f', fontWeight: 700 }}>Shape Picker Toolbar</div>
                <Select
                  size="small"
                  value={selectedEl.shape || 'rectangle'}
                  onChange={e => updateElement(selectedElementId, { shape: e.target.value as 'rectangle' | 'circle' | 'oval' | 'heart' | 'star' })}
                  sx={{ minWidth: 100 }}
                >
                  <MenuItem value="rectangle">Rectangle</MenuItem>
                  <MenuItem value="circle">Circle</MenuItem>
                  <MenuItem value="oval">Oval</MenuItem>
                  <MenuItem value="heart">Heart</MenuItem>
                  <MenuItem value="star">Star</MenuItem>
                </Select>
                <Button size="small" color="error" onClick={() => setElements(elements.filter(e => e.id !== selectedElementId))}>Delete</Button>
              </Box>
            );
          }
          return null;
        })()}
        {/* Save Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Save />}
            onClick={handleSave}
            sx={{ borderRadius: 8, fontWeight: 700, px: 4 }}
          >
            Save
          </Button>
        </Box>

        {/* Customization Tabs */}
        <Tabs value={tab} onChange={(_, v) => setTab(v)} centered sx={{ mb: 2 }}>
          <Tab icon={<ColorLens />} label="Color" />
          <Tab icon={<TextFields />} label="Text" />
          <Tab icon={<EmojiEmotions />} label="Sticker" />
          <Tab icon={<AddPhotoAlternate />} label="Image" />
          <Tab icon={<Palette />} label="Art" />
          <Tab icon={<FormatShapes />} label="Shapes" />
          <Tab icon={<Brush />} label="Tools" />
        </Tabs>
        {tab === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            <Button
              onClick={handleColorClick}
              sx={{
                width: 40,
                height: 40,
                minWidth: 0,
                borderRadius: '50%',
                background: color,
                border: '2px solid #eee',
                boxShadow: 1,
                p: 0,
                '&:hover': { border: '2px solid #F46A6A' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Palette sx={{ color: color === '#ffffff' ? '#aaa' : '#fff', fontSize: 28 }} />
            </Button>
            <Popover
              open={colorPickerOpen}
              anchorEl={colorAnchorEl}
              onClose={handleColorClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <ChromePicker
                color={color}
                onChange={handleColorChange}
                disableAlpha
              />
            </Popover>
          </Box>
        )}
        {tab === 1 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <TextField
              label="Text"
              value={text}
              onChange={e => setText(e.target.value)}
              size="small"
              sx={{ minWidth: 180 }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <input
                type="color"
                value={textColor}
                onChange={e => setTextColor(e.target.value)}
                style={{ width: 28, height: 28, border: 'none', background: 'none' }}
              />
              <Select
                size="small"
                value={selectedFont}
                onChange={e => setSelectedFont(e.target.value)}
                sx={{ minWidth: 140 }}
              >
                <MenuItem value="Arial">Arial</MenuItem>
                <MenuItem value="Times New Roman">Times New Roman</MenuItem>
                <MenuItem value="Comic Sans MS">Comic Sans MS</MenuItem>
                <MenuItem value="Monospace">Monospace</MenuItem>
                <MenuItem value="Cursive">Cursive</MenuItem>
              </Select>
              <Select
                size="small"
                value={textStyle}
                onChange={e => setTextStyle(e.target.value as 'straight' | 'arcUp' | 'arcDown' | 'wavy')}
                sx={{ minWidth: 120 }}
              >
                <MenuItem value="straight">Straight</MenuItem>
                <MenuItem value="arcUp">Arc Up</MenuItem>
                <MenuItem value="arcDown">Arc Down</MenuItem>
                <MenuItem value="wavy">Wavy</MenuItem>
              </Select>
            </Box>
            <Button variant="contained" onClick={handleAddText} sx={{ ml: 1 }}>Add Text</Button>
          </Box>
        )}
        {tab === 2 && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', mb: 2 }}>
            {stickers.map((s, i) => (
              <Button key={i} onClick={() => handleAddSticker(s)} sx={{ fontSize: 28 }}>{s}</Button>
            ))}
          </Box>
        )}
        {tab === 3 && (
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<AddPhotoAlternate />}
            >
              Upload Image
              <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
            </Button>
            {uploadedImage && (
              <Button color="error" sx={{ ml: 2 }} onClick={() => setUploadedImage(null)}>Remove</Button>
            )}
          </Box>
        )}
        {tab === 4 && (
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', mb: 2 }}>
            {validAllArtImages.map((art, i) => (
              <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 64 }}>
                <Button onClick={() => handleAddArt(art.src)} sx={{ p: 0, minWidth: 60, minHeight: 60, border: '1px solid #eee', borderRadius: 2, bgcolor: '#fff' }}>
                  <Box component="img" src={art.src} alt={art.label} sx={{ width: 48, height: 48, objectFit: 'cover' }} />
                </Button>
                <Typography variant="caption" sx={{ mt: 0.5, textAlign: 'center', maxWidth: 60, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{art.label}</Typography>
              </Box>
            ))}
          </Box>
        )}
        {tab === 5 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Typography variant="body2">Fill:</Typography>
              <input type="color" value={shapeColor} onChange={e => setShapeColor(e.target.value)} style={{ width: 32, height: 32, border: 'none', background: 'none' }} />
              <Typography variant="body2">Border:</Typography>
              <input type="color" value={shapeBorderColor} onChange={e => setShapeBorderColor(e.target.value)} style={{ width: 32, height: 32, border: 'none', background: 'none' }} />
              <Button variant={shapeFill ? 'contained' : 'outlined'} size="small" onClick={() => setShapeFill(f => !f)}>{shapeFill ? 'Filled' : 'No Fill'}</Button>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 48px)', gap: 2, mb: 1 }}>
              {/* Rectangle */}
              <Button onClick={() => handleAddShape('rectangle', shapeFill, shapeColor, shapeBorderColor)} sx={{ p: 0, minWidth: 0, minHeight: 0, bgcolor: 'transparent' }}>
                <svg width="40" height="40">
                  <rect x="6" y="6" width="28" height="28" fill={shapeFill ? shapeColor : 'none'} stroke={shapeBorderColor} strokeWidth="3" rx="4" />
                </svg>
              </Button>
              {/* Circle */}
              <Button onClick={() => handleAddShape('circle', shapeFill, shapeColor, shapeBorderColor)} sx={{ p: 0, minWidth: 0, minHeight: 0, bgcolor: 'transparent' }}>
                <svg width="40" height="40">
                  <ellipse cx="20" cy="20" rx="14" ry="14" fill={shapeFill ? shapeColor : 'none'} stroke={shapeBorderColor} strokeWidth="3" />
                </svg>
              </Button>
              {/* Stripe */}
              <Button onClick={() => handleAddShape('stripe', shapeFill, shapeColor, shapeBorderColor)} sx={{ p: 0, minWidth: 0, minHeight: 0, bgcolor: 'transparent' }}>
                <svg width="40" height="40">
                  <rect x="6" y="18" width="28" height="8" fill={shapeFill ? shapeColor : 'none'} stroke={shapeBorderColor} strokeWidth="3" rx="2" />
                </svg>
              </Button>
              {/* Line H */}
              <Button onClick={() => handleAddShape('line-h', false, 'transparent', shapeBorderColor)} sx={{ p: 0, minWidth: 0, minHeight: 0, bgcolor: 'transparent' }}>
                <svg width="40" height="40">
                  <line x1="6" y1="20" x2="34" y2="20" stroke={shapeBorderColor} strokeWidth="3" />
                </svg>
              </Button>
              {/* Line V */}
              <Button onClick={() => handleAddShape('line-v', false, 'transparent', shapeBorderColor)} sx={{ p: 0, minWidth: 0, minHeight: 0, bgcolor: 'transparent' }}>
                <svg width="40" height="40">
                  <line x1="20" y1="6" x2="20" y2="34" stroke={shapeBorderColor} strokeWidth="3" />
                </svg>
              </Button>
              {/* Line D */}
              <Button onClick={() => handleAddShape('line-d', false, 'transparent', shapeBorderColor)} sx={{ p: 0, minWidth: 0, minHeight: 0, bgcolor: 'transparent' }}>
                <svg width="40" height="40">
                  <line x1="8" y1="32" x2="32" y2="8" stroke={shapeBorderColor} strokeWidth="3" />
                </svg>
              </Button>
              {/* Triangle */}
              <Button onClick={() => handleAddShape('triangle', shapeFill, shapeColor, shapeBorderColor)} sx={{ p: 0, minWidth: 0, minHeight: 0, bgcolor: 'transparent' }}>
                <svg width="40" height="40">
                  <polygon points="20,8 34,32 6,32" fill={shapeFill ? shapeColor : 'none'} stroke={shapeBorderColor} strokeWidth="3" />
                </svg>
              </Button>
              {/* Arrow */}
              <Button onClick={() => handleAddShape('arrow', shapeFill, shapeColor, shapeBorderColor)} sx={{ p: 0, minWidth: 0, minHeight: 0, bgcolor: 'transparent' }}>
                <svg width="40" height="40">
                  <polygon points="8,20 28,20 28,12 36,24 28,36 28,28 8,28" fill={shapeFill ? shapeColor : 'none'} stroke={shapeBorderColor} strokeWidth="3" />
                </svg>
              </Button>
              {/* Pentagon */}
              <Button onClick={() => handleAddShape('pentagon', shapeFill, shapeColor, shapeBorderColor)} sx={{ p: 0, minWidth: 0, minHeight: 0, bgcolor: 'transparent' }}>
                <svg width="40" height="40">
                  <polygon points="20,6 34,16 28,34 12,34 6,16" fill={shapeFill ? shapeColor : 'none'} stroke={shapeBorderColor} strokeWidth="3" />
                </svg>
              </Button>
              {/* Hexagon */}
              <Button onClick={() => handleAddShape('hexagon', shapeFill, shapeColor, shapeBorderColor)} sx={{ p: 0, minWidth: 0, minHeight: 0, bgcolor: 'transparent' }}>
                <svg width="40" height="40">
                  <polygon points="20,6 34,14 34,26 20,34 6,26 6,14" fill={shapeFill ? shapeColor : 'none'} stroke={shapeBorderColor} strokeWidth="3" />
                </svg>
              </Button>
              {/* Star */}
              <Button onClick={() => handleAddShape('star', shapeFill, shapeColor, shapeBorderColor)} sx={{ p: 0, minWidth: 0, minHeight: 0, bgcolor: 'transparent' }}>
                <svg width="40" height="40">
                  <polygon points="20,6 24,16 34,16 26,22 30,32 20,26 10,32 14,22 6,16 16,16" fill={shapeFill ? shapeColor : 'none'} stroke={shapeBorderColor} strokeWidth="3" />
                </svg>
              </Button>
              {/* Heart */}
              <Button onClick={() => handleAddShape('heart', shapeFill, shapeColor, shapeBorderColor)} sx={{ p: 0, minWidth: 0, minHeight: 0, bgcolor: 'transparent' }}>
                <svg width="40" height="40" viewBox="0 0 40 40">
                  <path d="M20 34 L8 22 A8 8 0 1 1 20 12 A8 8 0 1 1 32 22 Z" fill={shapeFill ? shapeColor : 'none'} stroke={shapeBorderColor} strokeWidth="3" />
                </svg>
              </Button>
              {/* Diamond */}
              <Button onClick={() => handleAddShape('diamond', shapeFill, shapeColor, shapeBorderColor)} sx={{ p: 0, minWidth: 0, minHeight: 0, bgcolor: 'transparent' }}>
                <svg width="40" height="40">
                  <polygon points="20,6 34,20 20,34 6,20" fill={shapeFill ? shapeColor : 'none'} stroke={shapeBorderColor} strokeWidth="3" />
                </svg>
              </Button>
            </Box>
          </Box>
        )}
        {tab === 6 && (
          <>
            <Box sx={{ mb: 2, textAlign: 'center' }}>
              <Typography variant="subtitle1" fontWeight={700} mb={1}>Draw on your product:</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 1, alignItems: 'center' }}>
                <Button startIcon={<Brush />} variant={drawingTool === 'paintbrush' ? 'contained' : 'outlined'} onClick={() => { setDrawingTool('paintbrush'); }}>Paint Brush</Button>
                <Button startIcon={<Create />} variant={drawingTool === 'pen' ? 'contained' : 'outlined'} onClick={() => { setDrawingTool('pen'); }}>Pen</Button>
                <Button startIcon={<Edit />} variant={drawingTool === 'pencil' ? 'contained' : 'outlined'} onClick={() => { setDrawingTool('pencil'); }}>Pencil</Button>
                <input type="color" value={drawingColor} onChange={e => setDrawingColor(e.target.value)} style={{ width: 36, height: 36, border: 'none', background: 'none', cursor: 'pointer' }} title="Pick color" />
                <Box sx={{ width: 120, mx: 2 }}>
                  <Slider
                    min={1}
                    max={30}
                    value={brushSize}
                    onChange={(_, v) => setBrushSize(Number(v))}
                    aria-labelledby="brush-size-slider"
                  />
                  <Typography variant="caption">Size: {brushSize}</Typography>
                </Box>
                <Button onClick={() => canvasRef && canvasRef.undo()}>Undo</Button>
                <Button onClick={() => canvasRef && canvasRef.clear()}>Clear</Button>
              </Box>
            </Box>
          </>
        )}

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ShoppingCart />}
            onClick={handleAddToCart}
            sx={{ borderRadius: 8, fontWeight: 700, px: 4 }}
          >
            Add to Cart
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Payment />}
            onClick={handleBuyNow}
            sx={{ borderRadius: 8, fontWeight: 700, px: 4 }}
          >
            Buy Now
          </Button>
        </Box>
      </Paper>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({...snackbar, open: false})}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductCustomize; 