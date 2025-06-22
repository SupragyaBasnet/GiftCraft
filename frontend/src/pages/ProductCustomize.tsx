import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, Grid, Button, Paper, Tabs, Tab, TextField, InputAdornment, IconButton, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, ToggleButton, ToggleButtonGroup, Select
} from '@mui/material';
import { AddPhotoAlternate, ColorLens, TextFields, EmojiEmotions, ShoppingCart, Payment, Palette, FlipCameraIos, CompareArrows, Save, Visibility, VisibilityOff, Add, Remove } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Rnd } from 'react-rnd';
import { ChromePicker, ColorResult } from 'react-color';
import Popover from '@mui/material/Popover';
import { products } from "../data/products";

// Import product images from products directory
import tshirtFront from '../assets/products/whitetshirt-front.jpg';
import tshirtBack from '../assets/products/whitetshirt-back.jpg';
import penFront from '../assets/products/planepen.png';
import planepen1 from '../assets/products/planepen1.jpg';
import notebookFront from '../assets/products/notebook.jpg';
import notebookBack from '../assets/products/notebook.jpg'; // Assuming back is same as front
import mugFrontImage from '../assets/products/front-mug.png';
import mugSideImage from '../assets/products/side-mug.png';
import iphone11Plane from '../assets/products/iphone11-plane.jpg';
import iphone13Plane from '../assets/products/iphone13-plane.jpg';
import frame1 from '../assets/products/frame1.jpeg';
import frame2 from '../assets/products/frame2.jpg';
import frame3 from '../assets/products/frame3.jpg';

// Import the three new water bottle images
import bottle1White from '../assets/products/bottle-white1.jpg';
import bottleWhite2 from '../assets/products/bottle-white2.jpg';
import bottleWhite3 from '../assets/products/bottle-white3.jpg';

// Import the three new keychain images
import circleKeychain from '../assets/products/circle-keychain.jpg';
import squareKeychain from '../assets/products/square-keychain.jpg';
import keychainLeather from '../assets/products/keychain-leather.jpg';

// Import requested images from ../assets/
import cap1 from '../assets/products/whitecap1.jpg';
import pillowcase1 from '../assets/pillowcase1.jpg';
import pillowcase2 from '../assets/pillowcase2.webp';
import pillowcase3 from '../assets/pillowcase3.jpg';
import whitepillowFront from '../assets/products/whitepillow-front.webp';
import whitepillowBack from '../assets/products/whitepillow-back.webp';

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
  type: 'image' | 'text' | 'sticker';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string; // Add optional color property for text elements
}

// Map product type to images
const productImages: Record<ProductType, ProductView | string[]> = {
  tshirt: {
    front: tshirtFront,
    back: tshirtBack
  },
  notebook: {
    front: notebookFront,
    back: notebookBack
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
  phonecase: [ // Use array for multiple phonecase options
    iphone11Plane,
    iphone13Plane,
  ],
  keychain: [ // Use array for multiple keychain images
    circleKeychain,
    squareKeychain,
    keychainLeather,
  ],
  waterbottle: [ // Use array for multiple water bottle views
    bottle1White,
    bottleWhite2,
    bottleWhite3,
  ],
  cap: { // Use single image object for cap
    front: cap1
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
        const newElement: { id: string; type: 'image' | 'text' | 'sticker'; content: string; x: number; y: number; width: number; height: number } = {
          id: Date.now().toString(),
          type: 'image',
          content: ev.target?.result as string,
          x: 50,
          y: 50,
          width: 120,
          height: 120
        };
        setElements([...elements, newElement]);
        setSnackbar({open: true, message: 'Image uploaded successfully!', severity: 'success'});
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleAddText = () => {
    if (text) {
      const newElement: { id: string; type: 'image' | 'text' | 'sticker'; content: string; x: number; y: number; width: number; height: number } = {
        id: Date.now().toString(),
        type: 'text',
        content: text,
        x: 50,
        y: 50,
        width: 200,
        height: 50
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
          color: (el.type === 'text' && el.color) ? el.color : undefined // Include color only for text elements if present
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
            color: (el.type === 'text' && el.color) ? el.color : undefined // Include color only for text elements if present
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
  const [elements, setElements] = useState<Array<{ id: string; type: 'image' | 'text' | 'sticker'; content: string; x: number; y: number; width: number; height: number; color?: string; }>>([]);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={4} sx={{ p: { xs: 2, md: 4 }, mb: 4, borderRadius: 4 }}>
        <Typography variant="h4" fontWeight={900} gutterBottom align="center">
          Customize Your {selectedProduct.charAt(0).toUpperCase() + selectedProduct.slice(1).replace('-', ' ')}
        </Typography>
        
        {/* View Options */}
        {hasArrayViews ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} mb={1}>Select View:</Typography>
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
                onClick={() => setCurrentArrayIndex(index)}
              />
            ))}
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
            maxWidth: 350, // Revert to fixed maxWidth
          }}
        >
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
              // Apply hue-rotate filter based on selected color
              filter: color === '#ffffff' ? 'none' : `sepia(1) saturate(500%) hue-rotate(${(hexToHsl(color).h - hexToHsl('#808080').h)}deg)`, // Use sepia and lower saturation, calculate difference from gray hue
            }}
          />
          {elements.map((el) => (
            <Rnd
              key={el.id}
              default={{ x: el.x, y: el.y, width: el.width, height: el.height }}
              bounds={'parent'} // Revert bounds to parent
              enableResizing={{ top: true, right: true, bottom: true, left: true, topRight: true, bottomRight: true, bottomLeft: true, topLeft: true }}
              enableRotating={true}
              onDragStop={(e, d) => {
                const updatedElements = elements.map(elem => 
                  elem.id === el.id ? { ...elem, x: d.x, y: d.y } : elem
                );
                setElements(updatedElements);
              }}
              onResizeStop={(e, direction, ref, delta, position) => {
                const updatedElements = elements.map(elem => 
                  elem.id === el.id ? { ...elem, width: parseInt(ref.style.width), height: parseInt(ref.style.height), ...position } : elem
                );
                setElements(updatedElements);
              }}
              style={{
                zIndex: 2,
                background: 'transparent',
                display: 'flex', // Center content within Rnd
                alignItems: 'center', // Center content within Rnd
                justifyContent: 'center', // Center content within Rnd
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
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                  }} />
              )}
              {el.type === 'text' && (
                <Typography
                  sx={{
                    color: textColor,
                    fontWeight: 700,
                    textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                  }}
                >
                  {el.content}
                </Typography>
              )}
              {el.type === 'sticker' && (
                <Typography
                  sx={{
                    fontSize: 40,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                  }}
                >
                  {el.content}
                </Typography>
              )}
              <Button
                size="small"
                color="error"
                onClick={() => handleDeleteElement(el.id)}
                sx={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  minWidth: 24,
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  p: 0,
                  bgcolor: 'white',
                  boxShadow: 1,
                  '&:hover': {
                    bgcolor: '#ffebee'
                  }
                }}
              >
                ×
              </Button>
            </Rnd>
          ))}
        </CanvasBox>

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
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 2 }}>
            <TextField
              label="Text"
              value={text}
              onChange={e => setText(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} style={{ width: 24, height: 24, border: 'none', background: 'none' }} />
                  </InputAdornment>
                )
              }}
              sx={{ minWidth: 200 }}
            />
            <Button variant="contained" onClick={handleAddText}>Add Text</Button>
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