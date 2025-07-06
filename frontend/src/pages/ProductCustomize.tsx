import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import {
  AddPhotoAlternate,
  Brush,
  ColorLens,
  Create,
  Edit,
  EmojiEmotions, FormatAlignCenter, FormatAlignJustify, FormatAlignLeft, FormatAlignRight, FormatShapes, Height, Palette, Save,
  ShoppingCart,
  TextFields
} from "@mui/icons-material";
import FormatShapesIcon from "@mui/icons-material/FormatShapes";
import {
  Alert,
  Box,
  Button,
  Container, Grid, IconButton,
  MenuItem,
  Paper,
  Popover,
  Select,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup, Tooltip, Typography
} from "@mui/material";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import CanvasDraw from "react-canvas-draw";
import { ChromePicker, ColorResult } from "react-color";
import { Rnd } from "react-rnd";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from '../context/CartContext';
import { products } from '../data/products';

// Import product images from products directory
import frame1 from "../assets/products/frame1.jpg";
import frame2 from "../assets/products/frame2.jpg";
import frame3 from "../assets/products/frame3.jpg";
import frame4 from "../assets/products/frame4.jpg";
import mugFrontImage from "../assets/products/front-mug.png";
import notebookFront from "../assets/products/notebook.jpg";
import notebookBack from "../assets/products/notebookback.jpeg";
import penFront from "../assets/products/planepen.png";
import planepen1 from "../assets/products/planepen1.jpg";
import mugSideImage from "../assets/products/side-mug.png";
import tshirtBack from "../assets/products/whitetshirt-back.png";
import tshirtFront from "../assets/products/whitetshirt-front.jpg";

// Import the three new water bottle images
import bottle1White from "../assets/products/bottle-white1.png";
import bottleWhite2 from "../assets/products/bottle-white2.jpg";
import bottleWhite3 from "../assets/products/bottle-white3.jpg";

// Import the three new keychain images
import circleKeychain from "../assets/products/circle-keychain.jpg";
import keychainLeather from "../assets/products/keychain-leather.jpg";

// Import requested images from ../assets/

import heartshapedFront from "../assets/products/heartshaped-front.jpg";
import squareFront from "../assets/products/whitepillow-front.webp";


import circleshapedFront from "../assets/products/circleshaped-front.jpg";
import starshapedBack from "../assets/products/starshaped-back.jpg";





import phonecaseiphone13promax from "../assets/products/phonecaseiphone13promax and 12 pro max.jpg";
import phonecaseiphone14 from "../assets/products/phonecaseiphone14.jpg";
import phonecaseiphone8plus from "../assets/products/phonecaseiphone 8 plus.jpg";
import phonecases21ultra from "../assets/products/phonecases21ultra.jpg";
import phonecases23ultra from "../assets/products/phonecases23 ultra.jpg";

import keychainJpg from "../assets/products/keychain.jpg";
import planemetalkeychain from "../assets/products/planemetalkeychain.jpg";
import planemetalkeychain1 from "../assets/products/planemetalkeychain1.jpg";
import planewhitecap from "../assets/products/planewhitecap.jpg";
import planewhitekeychain from "../assets/products/planewhitekeychain.jpg";

// At the top of the file, add:

// Assuming this is the correct filename

// Define product types
type ProductType =
  | "mug"
  | "tshirt"
  | "phonecase"
  | "frame"
  | "keychain"
  | "pillowcase"
  | "waterbottle"
  | "pen"
  | "notebook"
  | "cap";
type ViewType = "front" | "back" | "side";

interface ProductView {
  front: string;
  back?: string;
  side?: string;
}

// Define types for elements (should match the type in CustomizedProductImage.tsx)
interface Element {
}

// Map product type to images
const productImages: Record<ProductType, ProductView | string[]> = {
  tshirt: {
    front: tshirtFront,
    back: tshirtBack,
  },
  notebook: {
    front: notebookFront,
    back: notebookBack, // use the new image for the back
  },
  pen: [
    penFront,
    planepen1,
  ],
  mug: {
    front: mugFrontImage,
    side: mugSideImage,
  },
  frame: [
    // Use array for multiple frame options
    frame1,
    frame2,
    frame3,
    frame4, // Add frame4 as the fourth option
  ],
  phonecase: [
    phonecaseiphone8plus,
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
  waterbottle: [
    // Use array for multiple water bottle views
    bottle1White,
    bottleWhite2,
    bottleWhite3,
  ],
  cap: {
    front: planewhitecap,
  },
  pillowcase: [
    circleshapedFront, // 0: Circle
    heartshapedFront,  // 1: Heart
    starshapedBack,    // 2: Star
    squareFront,       // 3: Square
  ],
  
};

const stickers = ["🎉", "❤️", "🌟", "🎁", "😊", "🔥", "🥳", "💐", "👑", "🍰"];

// Removed productAspectRatios map based on simplification request

const CanvasBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "enableRotating",
})<{ enableRotating?: boolean }>(({ theme, enableRotating }) => ({
  position: "relative",
  width: "100%",
  maxWidth: 350, // Revert to fixed width
  height: 350, // Revert to fixed height
  margin: "0 auto",
  background: "#fff",
  borderRadius: 16,
  boxShadow: theme.shadows[3],
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  "& img": {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
  },
}));

// Add type declaration for react-color
declare module "react-color" {
  export interface ColorResult {
    hex: string;
    rgb: { r: number; g: number; b: number; a?: number };
    hsl: { h: number; s: number; l: number; a?: number };
  }
}

// Helper function to convert Hex to HSL and extract Hue
const hexToHsl = (hex: string) => {
  // Remove # if it exists
  const cleanHex = hex.replace("#", "");

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
    label: "Teamwork",
    content: `data:image/svg+xml;utf8,<svg width='160' height='80' xmlns='http://www.w3.org/2000/svg'><text x='0' y='35' font-size='32' font-family='Arial' fill='%23555' font-style='italic'>t</text><text x='25' y='35' font-size='32' font-family='Arial' fill='%2348a9e6'>e</text><text x='55' y='35' font-size='32' font-family='Arial' fill='%2366bb6a'>a</text><text x='85' y='35' font-size='32' font-family='Arial' fill='%237e57c2'>m</text><text x='0' y='70' font-size='32' font-family='Arial' fill='%2348a9e6'>w</text><text x='40' y='70' font-size='32' font-family='Arial' fill='%23222' font-weight='bold'>o</text><text x='70' y='70' font-size='32' font-family='Arial' fill='%2366bb6a' font-weight='bold'>r</text><text x='95' y='70' font-size='32' font-family='Arial' fill='%237e57c2' font-weight='bold'>k</text></svg>`,
  },
  {
    label: "Congrats",
    content: `data:image/svg+xml;utf8,<svg width='180' height='60' xmlns='http://www.w3.org/2000/svg'><text x='0' y='35' font-size='32' font-family='Arial' fill='%23fbc02d' font-weight='bold'>CONGRATS</text><text x='0' y='55' font-size='16' font-family='Arial' fill='%23e57373'>I'M PROUD OF YOU!</text></svg>`,
  },
  {
    label: "Strategy",
    content: `data:image/svg+xml;utf8,<svg width='180' height='60' xmlns='http://www.w3.org/2000/svg'><text x='0' y='30' font-size='18' font-family='Georgia' fill='%23222'>financial</text><text x='0' y='55' font-size='32' font-family='Arial' fill='%2348a9e6' font-weight='bold'>STRATEGY</text></svg>`,
  },
  {
    label: "Content that Clicks",
    content: `data:image/svg+xml;utf8,<svg width='200' height='60' xmlns='http://www.w3.org/2000/svg'><text x='0' y='30' font-size='22' font-family='Brush Script MT' fill='%23999'>Content that</text><text x='0' y='55' font-size='32' font-family='Arial' fill='%2300b894' font-weight='bold'>CLICKS</text></svg>`,
  },
  {
    label: "Moving Parts",
    content: `data:image/svg+xml;utf8,<svg width='200' height='60' xmlns='http://www.w3.org/2000/svg'><text x='0' y='40' font-size='32' font-family='Monoton' fill='%23296fa8'>MOVING</text><text x='0' y='58' font-size='32' font-family='Monoton' fill='%23296fa8'>PARTS</text></svg>`,
  },
  // Add more creative SVGs as you like
];

// Remove effectsLibrary and add toolsLibrary
const toolsLibrary = [
  {
    label: "Pencil",
    content: `data:image/svg+xml;utf8,<svg width='48' height='48' xmlns='http://www.w3.org/2000/svg'><rect x='10' y='32' width='28' height='6' rx='2' fill='%23bdbdbd'/><rect x='20' y='8' width='8' height='28' rx='2' fill='%23fbc02d'/><polygon points='24,4 28,8 20,8' fill='%23ff7043'/></svg>`,
  },
  {
    label: "Pen",
    content: `data:image/svg+xml;utf8,<svg width='48' height='48' xmlns='http://www.w3.org/2000/svg'><rect x='20' y='8' width='8' height='28' rx='2' fill='%2348a9e6'/><rect x='22' y='36' width='4' height='8' rx='1' fill='%23296fa8'/><polygon points='24,4 28,8 20,8' fill='%23007bff'/></svg>`,
  },
  {
    label: "Paintbrush",
    content: `data:image/svg+xml;utf8,<svg width='48' height='48' xmlns='http://www.w3.org/2000/svg'><rect x='22' y='8' width='4' height='24' rx='2' fill='%238d6e63'/><ellipse cx='24' cy='36' rx='8' ry='6' fill='%23ffb300'/><ellipse cx='24' cy='40' rx='4' ry='2' fill='%23ffd54f'/></svg>`,
  },
];

// Dynamically import all PNG, JPG, JPEG, and WEBP images from the art folder (Vite way)
const artModules = import.meta.glob("../assets/art/*.{png,jpg,jpeg,webp}", {
  eager: true,
});
const artImages = Object.entries(artModules).map(([path, mod]) => ({
  src: (mod as any).default,
  label:
    path
      .split("/")
      .pop()
      ?.replace(/\.[^/.]+$/, "")
      .replace(/-/g, " ")
      .toUpperCase() || "",
}));

// Add a few example art images from Unsplash/Pexels as demo art (remote URLs)
const exampleArtImages = [
  {
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    label: "COLORFUL ABSTRACT",
  },
  {
    src: "https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&w=400",
    label: "PAINT SPLASH",
  },
  {
    src: "https://images.pexels.com/photos/370799/pexels-photo-370799.jpeg?auto=compress&w=400",
    label: "MODERN ART",
  },
  {
    src: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    label: "MOUNTAIN ART",
  },
  {
    src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80",
    label: "VIBRANT SPLASH",
  },
  {
    src: "https://images.pexels.com/photos/459225/pexels-photo-459225.jpeg?auto=compress&w=400",
    label: "WATERCOLOR",
  },
  {
    src: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    label: "ABSTRACT FACE",
  },
  {
    src: "https://images.pexels.com/photos/1103971/pexels-photo-1103971.jpeg?auto=compress&w=400",
    label: "COLORFUL LINES",
  },
  {
    src: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80",
    label: "PASTEL ART",
  },
  {
    src: "https://images.pexels.com/photos/355465/pexels-photo-355465.jpeg?auto=compress&w=400",
    label: "CANVAS PAINT",
  },
  // New galaxy, moon, glitter, and cosmic themed images
  {
    src: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80",
    label: "GALAXY SKY",
  },
  {
    src: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=400&q=80",
    label: "MOON NIGHT",
  },
  {
    src: "https://images.pexels.com/photos/355465/pexels-photo-355465.jpeg?auto=compress&w=400",
    label: "GLITTER CANVAS",
  },
  {
    src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80",
    label: "COSMIC DREAM",
  },
  {
    src: "https://images.unsplash.com/photo-1468421870903-4df1664ac249?auto=format&fit=crop&w=400&q=80",
    label: "PURPLE GALAXY",
  },
  {
    src: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    label: "MOONLIT NIGHT",
  },
  {
    src: "https://images.pexels.com/photos/355465/pexels-photo-355465.jpeg?auto=compress&w=400",
    label: "SPARKLE ART",
  },
];

// Filter out all art images whose label contains 'ABSTRA'
const validArtImages = artImages.filter(
  (img) =>
    img.src && !img.src.includes("undefined") && !img.label.includes("ABSTRA")
);
const allArtImages = [...exampleArtImages, ...validArtImages];

// Helper to check if an image URL is valid (for remote and local images)
function isImageUrlValid(url: string) {
  // Exclude undefined, empty, or broken images
  return (
    url &&
    !url.includes("undefined") &&
    !url.includes("sample") &&
    !url.includes("broken") &&
    !url.endsWith(".svg")
  );
}
const validAllArtImages = allArtImages.filter((img) =>
  isImageUrlValid(img.src)
);

// Phonecase model labels for the new images
const phonecaseLabels = [
  "iPhone 8 Plus",
  "iPhone 13 Pro Max / 12 Pro Max",
  "iPhone 14",
  "Samsung S21 Ultra",
  "Samsung S23 Ultra",
];

// Move this to the top level, before the ProductCustomize component:
export function getAutoFitFontSize({
  text,
  fontFamily = 'Arial',
  boxWidth,
  boxHeight,
  textStyle = 'straight',
  lineHeight = 1.2,
  minFontSize = 10,
  maxFontSize = 200,
}: {
  text: string;
  fontFamily?: string;
  boxWidth: number;
  boxHeight: number;
  textStyle?: string;
  lineHeight?: number;
  minFontSize?: number;
  maxFontSize?: number;
}) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return minFontSize ?? 10;
  function measureStraight(fontSize: number) {
    if (!ctx) return { width: 0, height: 0 };
    ctx.font = `${fontSize}px ${fontFamily}`;
    const lines = text.split('\n');
    const widths = lines.map((line: string) => ctx.measureText(line).width);
    const maxWidth = Math.max(...widths, 1);
    const totalHeight = lines.length * fontSize * lineHeight;
    return { width: maxWidth, height: totalHeight };
  }
  function measureArc(fontSize: number) {
    if (!ctx) return 0;
    ctx.font = `${fontSize}px ${fontFamily}`;
    return ctx.measureText(text).width;
  }
  function getPathLength() {
    const a = boxWidth / 2;
    const b = boxHeight / 2;
    return Math.PI * (3*(a+b) - Math.sqrt((3*a+b)*(a+3*b))) / 2;
  }
  let low = minFontSize, high = maxFontSize, best = minFontSize;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (textStyle === 'straight') {
      const { width, height } = measureStraight(mid);
      if (width <= boxWidth && height <= boxHeight) {
        best = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    } else {
      const textLen = measureArc(mid);
      const pathLen = getPathLength();
      if (textLen <= pathLen) {
        best = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
  }
  return best;
}

// Add this function below the imports or near the other helpers:
function calculateCustomizationPrice(basePrice: number, type: string, customization: any) {
  let extra = 0;
  if (!customization) return basePrice;
  // Count elements by type
  let textCount = 0, imageCount = 0, artCount = 0, stickerCount = 0, shapeCount = 0, toolCount = 0;
  if (customization.elements && Array.isArray(customization.elements)) {
    for (const el of customization.elements) {
      if (el.type === 'text') textCount++;
      if (el.type === 'image') imageCount++;
      if (el.type === 'art') artCount++;
      if (el.type === 'sticker') stickerCount++;
      if (el.type === 'shape') shapeCount++;
      if (el.type === 'tool') toolCount++;
    }
  }
  const t = type.toLowerCase();
  if (t === 'tshirt' || t === 't-shirt') {
    if (customization.color && customization.color !== '#ffffff') extra += 100;
    extra += textCount * 150;
    extra += imageCount * 300;
    extra += artCount * 220;
    extra += stickerCount * 180;
    extra += shapeCount * 120;
    extra += toolCount * 120;
  } else if (t === 'mug') {
    if (customization.color && customization.color !== '#ffffff') extra += 60;
    extra += textCount * 120;
    extra += imageCount * 220;
    extra += artCount * 180;
    extra += stickerCount * 150;
    extra += shapeCount * 90;
    extra += toolCount * 90;
  } else if (t === 'notebook') {
    if (customization.color && customization.color !== '#ffffff') extra += 40;
    extra += textCount * 80;
    extra += imageCount * 150;
    extra += artCount * 100;
    extra += stickerCount * 100;
    extra += shapeCount * 60;
    extra += toolCount * 60;
  } else if (t === 'frame') {
    if (customization.color && customization.color !== '#ffffff') extra += 80;
    extra += textCount * 140;
    extra += imageCount * 250;
    extra += artCount * 200;
    extra += stickerCount * 160;
    extra += shapeCount * 100;
    extra += toolCount * 100;
  } else if (t === 'keychain') {
    if (customization.color && customization.color !== '#ffffff') extra += 30;
    extra += textCount * 60;
    extra += imageCount * 120;
    extra += artCount * 80;
    extra += stickerCount * 80;
    extra += shapeCount * 40;
    extra += toolCount * 40;
  } else if (t === 'waterbottle') {
    if (customization.color && customization.color !== '#ffffff') extra += 50;
    extra += textCount * 100;
    extra += imageCount * 180;
    extra += artCount * 120;
    extra += stickerCount * 120;
    extra += shapeCount * 70;
    extra += toolCount * 70;
  } else if (t === 'cap') {
    if (customization.color && customization.color !== '#ffffff') extra += 50;
    extra += textCount * 100;
    extra += imageCount * 180;
    extra += artCount * 120;
    extra += stickerCount * 120;
    extra += shapeCount * 70;
    extra += toolCount * 70;
  } else if (t === 'pen') {
    if (customization.color && customization.color !== '#ffffff') extra += 20;
    extra += textCount * 40;
    extra += imageCount * 80;
    extra += artCount * 60;
    extra += stickerCount * 60;
    extra += shapeCount * 30;
    extra += toolCount * 30;
  } else if (t === 'phonecase') {
    if (customization.color && customization.color !== '#ffffff') extra += 70;
    extra += textCount * 130;
    extra += imageCount * 240;
    extra += artCount * 180;
    extra += stickerCount * 160;
    extra += shapeCount * 90;
    extra += toolCount * 90;
  } else if (t === 'pillowcase') {
    if (customization.color && customization.color !== '#ffffff') extra += 60;
    extra += textCount * 120;
    extra += imageCount * 220;
    extra += artCount * 180;
    extra += stickerCount * 150;
    extra += shapeCount * 90;
    extra += toolCount * 90;
  } else {
    if (customization.color && customization.color !== '#ffffff') extra += 50;
    extra += textCount * 100;
    extra += imageCount * 200;
    extra += artCount * 150;
    extra += stickerCount * 120;
    extra += shapeCount * 80;
    extra += toolCount * 80;
  }
  return basePrice + extra;
}

// Helper to fetch product by category and name from backend
async function fetchProductId(category: string, name: string) {
  const res = await fetch(`/api/products/find?category=${category}&name=${encodeURIComponent(name)}`);
  if (res.ok) {
    const product = await res.json();
    return product._id;
  }
  return null;
}

// Add this helper function near the top of the file:
function getStarPoints(width: number, height: number, spikes: number, cx: number, cy: number, outerRadius: number, innerRadius: number) {
  const step = Math.PI / spikes;
  let points = '';
  let rotation = Math.PI / 2 * 3;
  let x = cx;
  let y = cy;
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rotation) * outerRadius;
    y = cy + Math.sin(rotation) * outerRadius;
    points += `${x},${y} `;
    rotation += step;

    x = cx + Math.cos(rotation) * innerRadius;
    y = cy + Math.sin(rotation) * innerRadius;
    points += `${x},${y} `;
    rotation += step;
  }
  return points.trim();
}

interface ProductCustomizeProps {
  categoryOverride?: string;
  typeOverride?: string | null;
}

const ProductCustomize: React.FC<ProductCustomizeProps> = ({ categoryOverride, typeOverride }) => {
  // Use categoryOverride if provided, else useParams
  const { category: urlCategory, type: urlType } = useParams<{ category: string, type?: string }>();
  const category = categoryOverride || urlCategory;
  const selectedType = typeOverride || urlType || null;
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Generate a unique customizationId for this session
  const [customizationId] = useState(() => `${category}-${Date.now()}-${Math.floor(Math.random() * 100000)}`);

  // Determine product type and base price from category
  const productType = category.replace(/s$/, '');
  // For products with variants, use selectedType to pick the correct image/label/price
  let baseProduct = products.find((p) => p.category === category);
  let basePrice = baseProduct ? baseProduct.price : 1000;
  let baseImage = baseProduct ? baseProduct.image : '';

  // For keychains, phonecases, etc., override image/label/price by type
  if (selectedType && productType === 'keychain') {
    // Map type to image and label
    
    
    const typeInfo = keychainTypeMap[selectedType];
    if (typeInfo) {
      baseImage = typeInfo.image;
      basePrice = typeInfo.price || basePrice;
      baseProduct = { ...baseProduct, name: typeInfo.name, price: typeInfo.price || basePrice, image: typeInfo.image };
    }
  }
  // Add similar logic for phonecases, etc. as needed

  // --- Add state to track if customization is saved ---
  const [isSaved, setIsSaved] = useState(false);

  // Add authentication check on page load
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("giftcraftUser");
    if (!isLoggedIn) {
      // Save the current product type to restore after login
      localStorage.setItem("giftcraftPendingProduct", productType);
      navigate("/login");
    }
  }, [navigate, productType]);

  const [currentView, setCurrentView] = useState<ViewType>("front");
  const [currentArrayIndex, setCurrentArrayIndex] = useState(0);

  // Add state for selected notebook size
  const [selectedNotebookSize, setSelectedNotebookSize] =
    useState<string>("A5"); // Default size

  // Add state for selected t-shirt size
  const [selectedTshirtSize, setSelectedTshirtSize] = useState<string>("M"); // Default size

  // Add state for selected water bottle size
  const [selectedWaterBottleSize, setSelectedWaterBottleSize] =
    useState<string>("1 Liter"); // Default size

  // Add state for color picker anchor element
  const [colorAnchorEl, setColorAnchorEl] = useState<null | HTMLElement>(null);

  // Add state for cart items
  const [cartItems, setCartItems] = useState<any[]>(() => {
    const savedCart = localStorage.getItem("giftcraftCart");
    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch (e) {
        console.error(
          "Failed to parse cart data from localStorage during initialization",
          e
        );
        localStorage.removeItem("giftcraftCart"); // Clear invalid data
        return []; // Return empty array on error
      }
    }
    return []; // Return empty array if no data found
  }); // Initialize state by reading from localStorage

  // Update localStorage whenever cartItems state changes - KEEP this useEffect
  React.useEffect(() => {
    localStorage.setItem("giftcraftCart", JSON.stringify(cartItems));
  }, [cartItems]); // Dependency array ensures this runs when cartItems changes

  // Clear elements and reset view when selectedProduct changes (now only via URL)
  React.useEffect(() => {
    setElements([]);
    setCurrentView("front");
    setCurrentArrayIndex(0); // Reset array index when product changes
  }, [productType]);

  // Removed useEffect for updating selectedProduct from URL as it's handled on initial render
  // Removed handleGalleryProductClick function based on simplification request
  // Removed handleProductChange function (used for dropdown) based on simplification request

  // Revert to fixed canvas height
  const canvasHeight = 350;

  // Get product-specific styling - Simplified switch cases to basic types
  const getProductStyle = (productType: ProductType) => {
    switch (productType) {
      case "tshirt":
      case "pillowcase":
      case "notebook":
        return {
          padding: "10px",
          borderRadius: "8px",
        };
      case "phonecase":
        return {
          padding: "15px",
          borderRadius: "20px",
        };
      case "keychain":
        return {
          padding: "5px",
          borderRadius: "4px",
        };
      case "mug":
        return {
          padding: "5px",
          borderRadius: "4px",
        };
      case "waterbottle":
        return {
          padding: "10px",
          borderRadius: "8px",
        };
      case "pen":
        return {
          padding: "5px",
          borderRadius: "4px",
        };
      default:
        return {
          padding: "10px",
          borderRadius: "8px",
        };
    }
  };

  // Check if the current product has back or side views defined (for object type)
  const isProductViewObject = typeof productImages[productType as keyof typeof productImages] === "object" && !Array.isArray(productImages[productType as keyof typeof productImages]);

  const hasBackView =
    isProductViewObject &&
    (productImages[productType as keyof typeof productImages] as ProductView)?.back !== undefined;
  const hasSideView =
    isProductViewObject &&
    (productImages[productType as keyof typeof productImages] as ProductView)?.side !== undefined;
  const hasMultipleViews = hasBackView || hasSideView;
  const hasArrayViews = Array.isArray(productImages[productType as keyof typeof productImages]);

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
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (f) => {
      const url = f.target?.result as string;
    if (url) {
      const newElement: Element = {
        id: Date.now().toString(),
        type: "image",
          content: url, // Store as data URL
        x: 50,
        y: 50,
        width: 120,
        height: 120,
        shape: "rectangle",
        imageOffsetX: 0,
        imageOffsetY: 0,
        imageScale: 1,
      };
      setElements([...elements, newElement]);
      setSnackbar({
        open: true,
        message: "Image uploaded successfully!",
        severity: "success",
      });
    }
    };
    reader.readAsDataURL(file);
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
        fontSize: fontSize !== 'auto' ? fontSize : undefined,
        fontWeight,
        isBold,
        isItalic,
        lineHeight,
        textAlign,
        imageOffsetX: 0,
        imageOffsetY: 0,
        imageScale: 1,
      };
      setElements([...elements, newElement]);
      setText("");
      setSnackbar({
        open: true,
        message: "Text added successfully!",
        severity: "success",
      });
    }
  };

  const handleAddSticker = (stickerContent: string) => {
    const newElement: {
      id: string;
      type: "image" | "text" | "sticker";
      content: string;
      x: number;
      y: number;
      width: number;
      height: number;
    } = {
      id: Date.now().toString(),
      type: "sticker",
      content: stickerContent,
      x: 50,
      y: 50,
      width: 50,
      height: 50,
    };
    setElements([...elements, newElement]);
    setSnackbar({
      open: true,
      message: "Sticker added successfully!",
      severity: "success",
    });
  };

  const handleDeleteElement = (id: string) => {
    setElements(elements.filter((el) => el.id !== id));
    setSnackbar({
      open: true,
      message: "Element deleted successfully!",
      severity: "success",
    });
  };

  const handleSave = () => {
    try {
      setIsSaved(true);
      setSnackbar({ open: true, message: 'Customization saved successfully!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to save customization.', severity: 'error' });
    }
  };

  // --- Get the correct product name for the selected variant (for backend lookup) ---
  function getSelectedProductName() {
    // For products with multiple variants (array views), use the productImageInfo name
    if (hasArrayViews && productImageInfo[productType] && productImageInfo[productType][currentArrayIndex]) {
      return productImageInfo[productType][currentArrayIndex].name;
    }
    // For single-variant products, fallback to productData?.name
    return baseProduct?.name || '';
  }

  // Dedicated add-to-cart for custom products
  const handleAddToCartCustom = async () => {
    if (!isSaved) {
      setSnackbar({ open: true, message: 'Please save your customization before adding to cart.', severity: 'error' });
      return;
    }
    // Build the customization object from current state
    const customization = {
      customizationId,
      category,
      productType,
      type: selectedType,
      viewIndex: hasArrayViews ? currentArrayIndex : currentView,
      size:
        productType === 'notebook'
          ? selectedNotebookSize
          : productType === 'tshirt'
          ? selectedTshirtSize
          : productType === 'waterbottle'
          ? selectedWaterBottleSize
          : undefined,
      color: color,
      elements: elements,
      image: currentImage,
    };
    const token = localStorage.getItem('giftcraftToken');
    const customPrice = calculateCustomizationPrice(basePrice, productType, customization);
    const payload = {
      customizationId,
      category,
      type: selectedType,
      customization,
      price: customPrice,
      image: currentImage,
      quantity: 1,
    };
    try {
      const res = await fetch('/api/auth/customization/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSnackbar({ open: true, message: 'Added to cart!', severity: 'success' });
        setTimeout(() => {
          navigate('/cart');
        }, 1500);
      } else {
        setSnackbar({ open: true, message: 'Failed to add to cart.', severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to add to cart.', severity: 'error' });
    }
  };

  const handleBuyNow = async () => {
    if (!isSaved) {
      setSnackbar({ open: true, message: 'Please save your customization before buying.', severity: 'error' });
      return;
    }
    // Build the customization object from current state
    const customization = {
      customizationId,
      category,
      productType,
      type: selectedType,
      viewIndex: hasArrayViews ? currentArrayIndex : currentView,
      size:
        productType === 'notebook'
          ? selectedNotebookSize
          : productType === 'tshirt'
          ? selectedTshirtSize
          : productType === 'waterbottle'
          ? selectedWaterBottleSize
          : undefined,
      color: color,
      elements: elements,
      image: currentImage,
    };
    const token = localStorage.getItem('giftcraftToken');
    const customPrice = calculateCustomizationPrice(basePrice, productType, customization);
    const payload = {
      customizationId,
      category,
      type: selectedType,
      customization,
      price: customPrice,
      image: currentImage,
      quantity: 1,
    };
    try {
      const res = await fetch('/api/auth/customization/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSnackbar({ open: true, message: 'Added to cart! Proceeding to checkout...', severity: 'success' });
        setTimeout(() => {
          navigate('/checkout');
        }, 1200);
      } else {
        setSnackbar({ open: true, message: 'Failed to add to cart.', severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to add to cart.', severity: 'error' });
    }
  };

  // Add useEffect to restore customization after login
  useEffect(() => {
    const pendingCustomization = localStorage.getItem(
      "giftcraftPendingCustomization"
    );
    const pendingProduct = localStorage.getItem("giftcraftPendingProduct");

    if (pendingProduct) {
      // Navigate to the correct product page
      navigate(`/customize/${pendingProduct}`);
      localStorage.removeItem("giftcraftPendingProduct");
    }

    if (pendingCustomization) {
      try {
        const customization = JSON.parse(pendingCustomization);
        // Restore customization state
        setColor(customization.color);
        setElements(customization.elements);
        if (customization.size) {
          if (productType === "notebook") {
            setSelectedNotebookSize(customization.size);
          } else if (productType === "tshirt") {
            setSelectedTshirtSize(customization.size);
          } else if (productType === "waterbottle") {
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
        localStorage.removeItem("giftcraftPendingCustomization");
      } catch (e) {
        console.error("Failed to restore customization:", e);
        localStorage.removeItem("giftcraftPendingCustomization");
      }
    } else if (pendingProduct) {
      // Handle case where only product was pending
      // No customization to restore, but make sure view is reset if needed
      setCurrentView("front");
      setCurrentArrayIndex(0);
    }
  }, [productType, navigate, hasArrayViews]); // Added hasArrayViews to dependencies

  // Determine the current image based on selected product and view
  let currentImage = baseImage;
  if (hasArrayViews) {
    currentImage = Array.isArray(productImages[productType as keyof typeof productImages]) && productImages[productType as keyof typeof productImages][currentArrayIndex]
      ? productImages[productType as keyof typeof productImages][currentArrayIndex]
      : productImages[productType as keyof typeof productImages][0];
  } else if (currentView === "back" && isProductViewObject && (productImages[productType as keyof typeof productImages] as ProductView)?.back) {
    currentImage = (productImages[productType as keyof typeof productImages] as ProductView)?.back;
  } else if (currentView === "side" && isProductViewObject && (productImages[productType as keyof typeof productImages] as ProductView)?.side) {
    currentImage = (productImages[productType as keyof typeof productImages] as ProductView)?.side;
  } else if (isProductViewObject) {
    currentImage = (productImages[productType as keyof typeof productImages] as ProductView)?.front;
  }

  const [color, setColor] = useState("#ffffff");
  const [text, setText] = useState("");
  const [textColor, setTextColor] = useState("#F46A6A");
  const [sticker, setSticker] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [tab, setTab] = useState(0);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });
  const [elements, setElements] = useState<Element[]>([]);
  const [shapeColor, setShapeColor] = useState("#F46A6A");
  const [shapeBorderColor, setShapeBorderColor] = useState("#222222");
  const [shapeFill, setShapeFill] = useState(true);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  );
  const [editText, setEditText] = useState("");
  const [drawingTool, setDrawingTool] = useState<
    "paintbrush" | "pen" | "pencil"
  >("paintbrush");
  const [drawingColor, setDrawingColor] = useState("#222");
  const [canvasRef, setCanvasRef] = useState<any>(null);
  const [brushSize, setBrushSize] = useState(6);
  const [textStyle, setTextStyle] = useState<
    "straight" | "arcUp" | "arcDown" | "wavy"
  >("straight");

  // Tool settings
  const toolSettings = {
    paintbrush: { brushRadius: brushSize, color: drawingColor },
    pen: { brushRadius: brushSize, color: drawingColor },
    pencil: { brushRadius: brushSize, color: drawingColor },
  };

  const updateElement = (id: string, changes: Partial<Element>) => {
    setElements((els) =>
      els.map((el) => (el.id === id ? { ...el, ...changes } : el))
    );
  };

  const handleAddArt = (artContent: string) => {
    const newElement: Element = {
      id: Date.now().toString(),
      type: "art",
      content: artContent,
      x: 60,
      y: 60,
      width: 60,
      height: 60,
      shape: "rectangle",
      imageOffsetX: 0,
      imageOffsetY: 0,
      imageScale: 1,
    };
    setElements([...elements, newElement]);
    setSnackbar({ open: true, message: "Art added!", severity: "success" });
  };

  const handleAddShape = (
    shape:
      | "rectangle"
      | "circle"
      | "stripe"
      | "line-h"
      | "line-v"
      | "line-d"
      | "triangle"
      | "arrow"
      | "pentagon"
      | "hexagon"
      | "star"
      | "heart"
      | "diamond"
      | "square",
    fill: boolean,
    fillColor: string,
    borderColor: string
  ) => {
    let width = 60,
      height = 60;
    if (shape === "stripe") {
      width = 120;
      height = 20;
    }
    if (shape === "line-h") {
      width = 100;
      height = 6;
    }
    if (shape === "line-v") {
      width = 6;
      height = 100;
    }
    if (shape === "line-d") {
      width = 100;
      height = 6;
    }
    if (shape === "arrow") {
      width = 80;
      height = 30;
    }
    if (shape === "triangle") {
      width = 60;
      height = 60;
    }
    if (
      shape === "pentagon" ||
      shape === "hexagon" ||
      shape === "star" ||
      shape === "heart" ||
      shape === "diamond"
    ) {
      width = 60;
      height = 60;
    }
    const newElement: Element = {
      id: Date.now().toString(),
      type: "shape",
      content: shape,
      x: 70,
      y: 70,
      width,
      height,
      color: fillColor,
      borderColor,
      fill,
      imageOffsetX: 0,
      imageOffsetY: 0,
      imageScale: 1,
    } as any;
    setElements([...elements, newElement]);
    setSnackbar({
      open: true,
      message: `${shape.charAt(0).toUpperCase() + shape.slice(1)} added!`,
      severity: "success",
    });
  };

  const handleAddEffect = (effectContent: string) => {
    const newElement: Element = {
      id: Date.now().toString(),
      type: "art",
      content: effectContent,
      x: 0,
      y: 0,
      width: 350,
      height: canvasHeight,
      imageOffsetX: 0,
      imageOffsetY: 0,
      imageScale: 1,
    };
    setElements([...elements, newElement]);
    setSnackbar({ open: true, message: "Effect added!", severity: "success" });
  };

  // Add state for font selection
  const [selectedFont, setSelectedFont] = useState("Arial");
  const fontOptions = [
    { label: "Arial", value: "Arial, sans-serif" },
    { label: "Times New Roman", value: '"Times New Roman", Times, serif' },
    { label: "Courier New", value: '"Courier New", Courier, monospace' },
    { label: "Comic Sans MS", value: '"Comic Sans MS", cursive, sans-serif' },
    { label: "Georgia", value: "Georgia, serif" },
    { label: "Verdana", value: "Verdana, Geneva, sans-serif" },
    { label: "Monospace", value: "monospace" },
  ];

  const [selectedPhonecaseIndex, setSelectedPhonecaseIndex] = useState(0);

  const shapeOptions = [
    { value: "rectangle", label: "Rectangle" },
    { value: "circle", label: "Circle" },
    { value: "oval", label: "Oval" },
    { value: "heart", label: "Heart" },
    { value: "star", label: "Star" },
    { value: "square", label: "Square" },
  ];

  const [shapeAnchorEl, setShapeAnchorEl] = useState<null | HTMLElement>(null);

  // Add state for selected frame index
  const [selectedFrameIndex, setSelectedFrameIndex] = useState(0);

  // Fix pan handler types
  function startPanImage(e: React.MouseEvent<HTMLDivElement>, id: string) {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const el = elements.find(el => el.id === id);
    const origX = el?.imageOffsetX || 0;
    const origY = el?.imageOffsetY || 0;
    function onMove(moveEvent: MouseEvent) {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      updateElement(id, {
        imageOffsetX: origX + dx,
        imageOffsetY: origY + dy,
      });
    }
    function onUp() {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }

  // Add state for alignment and line height
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right' | 'justify'>('center');
  const [lineHeight, setLineHeight] = useState(1.1);

  // Add these inside the ProductCustomize component, near the other useState hooks:
  const [fontSize, setFontSize] = useState<'auto' | number>('auto');
  const [fontWeight, setFontWeight] = useState<number | 400 | 600 | 700>(400);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  // 1. When a text element is selected, load its content into the input box
  useEffect(() => {
    if (selectedElementId) {
      const el = elements.find(e => e.id === selectedElementId && e.type === 'text');
      if (el) {
        setText(el.content);
      }
    } else {
      setText('');
    }
  }, [selectedElementId, elements]);

  // 2. When the input changes and a text element is selected, update the element's content
  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    if (selectedElementId) updateElement(selectedElementId, { content: e.target.value });
  };

  // 1. When a text element is selected, update controls to match its style
  useEffect(() => {
    if (selectedElementId) {
      const el = elements.find(e => e.id === selectedElementId && e.type === 'text');
      if (el) {
        setFontSize(el.fontSize ?? 'auto');
        setFontWeight(el.fontWeight ?? 400);
        setIsBold(!!el.isBold);
        setIsItalic(!!el.isItalic);
        setSelectedFont(el.fontFamily ?? 'Arial');
        setTextStyle(el.textStyle ?? 'straight');
        setLineHeight(el.lineHeight ?? 1.1);
        setTextAlign(el.textAlign ?? 'center');
      }
    }
  }, [selectedElementId, elements]);

  // 2. When a control is changed and a text element is selected, update the element's style
  const handleFontSizeChange = (value: number) => {
    setFontSize(value);
    if (selectedElementId) updateElement(selectedElementId, { fontSize: value });
  };
  const handleFontWeightChange = (value: number) => {
    setFontWeight(value);
    if (selectedElementId) updateElement(selectedElementId, { fontWeight: value });
  };
  const handleBoldChange = (value: boolean) => {
    setIsBold(value);
    if (selectedElementId) updateElement(selectedElementId, { isBold: value });
  };
  const handleItalicChange = (value: boolean) => {
    setIsItalic(value);
    if (selectedElementId) updateElement(selectedElementId, { isItalic: value });
  };
  const handleFontChange = (value: string) => {
    setSelectedFont(value);
    if (selectedElementId) updateElement(selectedElementId, { fontFamily: value });
  };
  const handleTextStyleChange = (value: 'straight' | 'arcUp' | 'arcDown' | 'wavy') => {
    setTextStyle(value);
    if (selectedElementId) updateElement(selectedElementId, { textStyle: value });
  };
  const handleLineHeightChange = (value: number) => {
    setLineHeight(value);
    if (selectedElementId) updateElement(selectedElementId, { lineHeight: value });
  };
  const handleTextAlignChange = (value: 'left' | 'center' | 'right' | 'justify') => {
    setTextAlign(value);
    if (selectedElementId) updateElement(selectedElementId, { textAlign: value });
  };
  // Use these handlers in your controls instead of setState directly.

  // Add this near the top of the ProductCustomize component:
  const shapes = [
    {
      label: 'Square',
      value: 'rectangle',
      icon: <Box sx={{ width: 28, height: 28, bgcolor: shapeFill ? shapeColor : 'transparent', border: `2px solid ${shapeBorderColor}`, borderRadius: 2 }} />,
    },
    {
      label: 'Circle',
      value: 'circle',
      icon: <Box sx={{ width: 28, height: 28, bgcolor: shapeFill ? shapeColor : 'transparent', border: `2px solid ${shapeBorderColor}`, borderRadius: '50%' }} />,
    },
    {
      label: 'Line',
      value: 'line-h',
      icon: <Box sx={{ width: 28, height: 4, bgcolor: shapeBorderColor, borderRadius: 1 }} />,
    },
    {
      label: 'Vertical Line',
      value: 'line-v',
      icon: <Box sx={{ width: 4, height: 28, bgcolor: shapeBorderColor, borderRadius: 1 }} />,
    },
    {
      label: 'Triangle',
      value: 'triangle',
      icon: (
        <Box sx={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width={24} height={24} viewBox="0 0 24 24">
            <polygon points="12,4 22,20 2,20" fill={shapeFill ? shapeColor : 'transparent'} stroke={shapeBorderColor} strokeWidth={2} />
          </svg>
        </Box>
      ),
    },
    {
      label: 'Arrow',
      value: 'arrow',
      icon: (
        <Box sx={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width={24} height={24} viewBox="0 0 24 24">
            <line x1="4" y1="12" x2="20" y2="12" stroke={shapeBorderColor} strokeWidth={2} />
            <polygon points="16,8 20,12 16,16" fill={shapeBorderColor} />
          </svg>
        </Box>
      ),
    },
    {
      label: 'Star',
      value: 'star',
      icon: (
        <Box sx={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width={24} height={24} viewBox="0 0 24 24">
            <polygon points="12,2 15,9 22,9 17,14 18,21 12,17 6,21 7,14 2,9 9,9" fill={shapeFill ? shapeColor : 'transparent'} stroke={shapeBorderColor} strokeWidth={2} />
          </svg>
        </Box>
      ),
    },
    {
      label: 'Heart',
      value: 'heart',
      icon: (
        <Box sx={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width={24} height={24} viewBox="0 0 24 24">
            <path d="M12 21s-6-4.35-9-8.5C-1.5 7.5 4.5 3 12 10.5 19.5 3 25.5 7.5 21 12.5c-3 4.15-9 8.5-9 8.5z" fill={shapeFill ? shapeColor : 'transparent'} stroke={shapeBorderColor} strokeWidth={2} />
          </svg>
        </Box>
      ),
    },
    {
      label: 'Diamond',
      value: 'diamond',
      icon: (
        <Box sx={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width={24} height={24} viewBox="0 0 24 24">
            <polygon points="12,2 22,12 12,22 2,12" fill={shapeFill ? shapeColor : 'transparent'} stroke={shapeBorderColor} strokeWidth={2} />
          </svg>
        </Box>
      ),
    },
    {
      label: 'Pentagon',
      value: 'pentagon',
      icon: (
        <Box sx={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width={24} height={24} viewBox="0 0 24 24">
            <polygon points="12,2 22,9 18,22 6,22 2,9" fill={shapeFill ? shapeColor : 'transparent'} stroke={shapeBorderColor} strokeWidth={2} />
          </svg>
        </Box>
      ),
    },
    {
      label: 'Hexagon',
      value: 'hexagon',
      icon: (
        <Box sx={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width={24} height={24} viewBox="0 0 24 24">
            <polygon points="6,2 18,2 22,12 18,22 6,22 2,12" fill={shapeFill ? shapeColor : 'transparent'} stroke={shapeBorderColor} strokeWidth={2} />
          </svg>
        </Box>
      ),
    },
  ];

  // Pillowcase shape info
  const pillowcaseShapeInfo = [
    {
      name: 'Circle Pillow',
      description: 'A soft, round pillow for cozy comfort.'
    },
    {
      name: 'Heart Pillow',
      description: 'A lovely heart-shaped pillow for special moments.'
    },
    {
      name: 'Star Pillow',
      description: 'A star-shaped pillow to brighten any room.'
    },
    {
      name: 'Square Pillow',
      description: 'A classic square pillow for everyday use.'
    }
  ];

  // Product image info for each product type with multiple images
  const productImageInfo: Record<string, { name: string; description: string }[]> = {
    pen: [
      { name: 'Classic Pen', description: 'A sleek, classic pen for everyday writing.' },
      { name: 'Modern Pen', description: 'A modern pen with a stylish design.' },
    ],
    frame: [
      { name: 'Golden Frame', description: 'A luxurious golden frame for your cherished memories.' },
      { name: 'Black Frame', description: 'A bold black frame for a modern look.' },
      { name: 'Wooden Frame', description: 'A warm wooden frame for a natural touch.' },
      { name: 'Classic Frame', description: 'A timeless classic frame for any photo.' },
    ],
    phonecase: [
      { name: 'iPhone 8 Plus Phone Case', description: 'Premium case for iPhone 8 Plus.' },
      { name: 'iPhone 10 Phone Case', description: 'Premium case for iPhone 10.' },
      { name: 'iPhone 11 Phone Case', description: 'Premium case for iPhone 11.' },
      { name: 'iPhone 12 Phone Case', description: 'Premium case for iPhone 12.' },
      { name: 'iPhone 13 Pro Max / 12 Pro Max Phone Case', description: 'Premium case for iPhone 13 Pro Max or 12 Pro Max.' },
      { name: 'iPhone 14 Phone Case', description: 'Premium case for iPhone 14.' },
      { name: 'Samsung S21 Ultra Phone Case', description: 'Premium case for Samsung S21 Ultra.' },
      { name: 'Samsung S23 Ultra Phone Case', description: 'Premium case for Samsung S23 Ultra.' },
    ],
    keychain: [
      { name: 'Classic Keychain', description: 'A simple and classic keychain.' },
      { name: 'White Keychain', description: 'A stylish white keychain.' },
      { name: 'Metal Keychain', description: 'A durable metal keychain.' },
      { name: 'Metal Keychain 2', description: 'A second style of metal keychain.' },
      { name: 'Circle Keychain', description: 'A round keychain for a unique look.' },
      { name: 'Leather Keychain', description: 'A premium leather keychain.' },
    ],
    waterbottle: [
      { name: 'White Bottle 1', description: 'A classic white water bottle.' },
      { name: 'White Bottle 2', description: 'A modern white water bottle.' },
      { name: 'White Bottle 3', description: 'A stylish white water bottle.' },
    ],
    pillowcase: [
      { name: 'Circle Pillow', description: 'A soft, round pillow for cozy comfort.' },
      { name: 'Heart Pillow', description: 'A lovely heart-shaped pillow for special moments.' },
      { name: 'Star Pillow', description: 'A star-shaped pillow to brighten any room.' },
      { name: 'Square Pillow', description: 'A classic square pillow for everyday use.' },
    ],
    notebook: [
      { name: 'Notebook Front', description: 'Notebook with customizable front cover.' },
      { name: 'Notebook Back', description: 'Notebook with customizable back cover.' },
    ],
  };

  // Defensive: If productType or baseProduct is missing, show a friendly error
  if (!productType || !baseProduct || !productImages[productType as keyof typeof productImages]) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mt: 4 }}>
          Sorry, this product category is not available for customization. Please go back and choose another category.
        </Alert>
      </Container>
    );
  }

  const keychainTypeInfo: Record<string, { image: string; name: string; description: string }> = {
    CircleKeychain: {
      image: circleKeychain,
      name: 'Circle Keychain',
      description: 'Classic round keychain for your custom design.'
    },
    RectangleKeychain: {
      image: squareFront,
      name: 'Rectangle Keychain',
      description: 'Sleek rectangle keychain for photos or text.'
    },
    StarKeychain: {
      image: starshapedBack,
      name: 'Star Keychain',
      description: 'Fun star-shaped keychain for a unique look.'
    },
    RectangleMetalKeychain: {
      image: planemetalkeychain,
      name: 'Rectangle Metal Keychain',
      description: 'Premium metal keychain for durability.'
    },
    OvalKeychain: {
      image: planewhitekeychain,
      name: 'Oval Keychain',
      description: 'Elegant oval keychain for your design.'
    },
    LeatherKeychain: {
      image: keychainLeather,
      name: 'Leather Keychain',
      description: 'Luxurious leather keychain for a classic touch.'
    },
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={4} sx={{ p: { xs: 2, md: 4 }, mb: 4, borderRadius: 4 }}>
        <Typography variant="h4" fontWeight={900} gutterBottom align="center" sx={{ fontSize: { xs: '1.7rem', md: '2.1rem' }, fontWeight: 800, letterSpacing: 0.5 }}>
          Customize Your {selectedType ? selectedType.replace(/([A-Z])/g, ' $1').trim() : (productType ? productType.charAt(0).toUpperCase() + productType.slice(1).replace("-", " ") : "Product")}
        </Typography>
        <Box sx={{ width: 60, height: 3, bgcolor: '#F46A6A', borderRadius: 2, mx: 'auto', mb: 3 }} />

        {/* View Options */}
        {hasArrayViews && productType !== "pen" ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              mb: 3,
            }}
          />
        ) : hasArrayViews && productType === "pen" ? null : hasMultipleViews ? (
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <ToggleButtonGroup
              value={currentView}
              exclusive
              onChange={(_, newValue) => setCurrentView(newValue as ViewType)}
              aria-label="view mode"
              sx={{
                mb: 2,
                "& .MuiToggleButton-root": {
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  "&.Mui-selected": {
                    backgroundColor: "#F46A6A",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#e05555",
                    },
                  },
                },
              }}
            >
              <ToggleButton value="front">Front</ToggleButton>
              {(productImages[productType as keyof typeof productImages] as ProductView)?.back && (
                <ToggleButton value="back">Back</ToggleButton>
              )}
              {(productImages[productType as keyof typeof productImages] as ProductView)?.side && (
                <ToggleButton value="side">Side</ToggleButton>
              )}
            </ToggleButtonGroup>
          </Box>
        ) : null}

        {/* Size, Frame Type, and Keychain Type Selection - Now inline */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2, gap: 2 }}>
          {productType === "notebook" && (
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
          {productType === "tshirt" && (
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
          {productType === "pen" && (
            <TextField
              select
              label="Pen Type"
              value={currentArrayIndex}
              onChange={e => setCurrentArrayIndex(Number(e.target.value))}
              sx={{ minWidth: 150 }}
            >
              {productImageInfo.pen.map((info, idx) => (
                <MenuItem key={info.name} value={idx}>
                  {info.name}
                </MenuItem>
              ))}
            </TextField>
          )}
          {productType === "waterbottle" && hasArrayViews && (
            <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>

              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <TextField
                  select
                  label="Bottle Type"
                  value={currentArrayIndex}
                  onChange={e => setCurrentArrayIndex(Number(e.target.value))}
                  sx={{ minWidth: 180 }}
                >
                  {productImageInfo.waterbottle.map((info, idx) => (
                    <MenuItem key={info.name} value={idx}>
                      {info.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
         
              {/* Size dropdown for waterbottle */}
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', mb: 2, mt:2}}>
                <TextField
                  select
                  label="Size"
                  value={selectedWaterBottleSize}
                  onChange={e => setSelectedWaterBottleSize(e.target.value)}
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value="1 Liter">1 Liter</MenuItem>
                  <MenuItem value="0.5 Liter">0.5 Liter</MenuItem>
                </TextField>
              </Box>
            </Box>
          )}
          {productType === "frame" && (
            <TextField
              select
              label="Frame Type"
              value={selectedFrameIndex}
              onChange={e => {
                setSelectedFrameIndex(Number(e.target.value));
                setCurrentArrayIndex(Number(e.target.value));
              }}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value={0}>Golden Frame</MenuItem>
              <MenuItem value={1}>Black Frame</MenuItem>
              <MenuItem value={2}>Wooden Frame</MenuItem>
              <MenuItem value={3}>Classic Frame</MenuItem>
            </TextField>
          )}
          {productType === "keychain" && (
            <TextField
              select
              label="Keychain Type"
              value={currentArrayIndex}
              onChange={e => setCurrentArrayIndex(Number(e.target.value))}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value={0}>Circle Keychain</MenuItem>
              <MenuItem value={1}>Rectangle Keychain</MenuItem>
              <MenuItem value={2}>Star Keychain</MenuItem>
              <MenuItem value={3}>Rectangle Metal Keychain</MenuItem>
              <MenuItem value={4}>Oval Keychain</MenuItem>
              <MenuItem value={5}>Leather Keychain</MenuItem>
            </TextField>
          )}
        </Box>

        {/* Pillowcase shape dropdown (right-aligned below current view) */}
        {productType === 'pillowcase' && hasArrayViews && (
          <>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <TextField
                select
                label="Pillowcase Shape"
                value={currentArrayIndex}
                onChange={e => setCurrentArrayIndex(Number(e.target.value))}
                sx={{ minWidth: 200 }}
              >
                <MenuItem value={0}>Circle</MenuItem>
                <MenuItem value={1}>Heart</MenuItem>
                <MenuItem value={2}>Star</MenuItem>
                <MenuItem value={3}>Square</MenuItem>
              </TextField>
            </Box>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
                {pillowcaseShapeInfo[currentArrayIndex]?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {pillowcaseShapeInfo[currentArrayIndex]?.description}
              </Typography>
            </Box>
          </>
        )}

        {/* Customization Canvas */}
        <CanvasBox
          sx={{
            mb: 3,
            height: canvasHeight,
            maxWidth: 350,
            position: "relative",
          }}
        >
          {/* Product image */}
          <Box
            component="img"
            src={currentImage}
            alt="product"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 1,
              pointerEvents: "none",
              p: 2,
              ...getProductStyle(productType),
            }}
          />
          {/* Color overlay as tint for all products, but mask for phonecase */}
          {color !== "#ffffff" && (
            productType === "phonecase" ? (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  zIndex: 2,
                  pointerEvents: "none",
                  background: color,
                  opacity: 0.32,
                  WebkitMaskImage: `url(${currentImage})`,
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskSize: 'contain',
                  maskImage: `url(${currentImage})`,
                  maskRepeat: 'no-repeat',
                  maskSize: 'contain',
                  borderRadius: 'inherit',
                }}
              />
            ) : (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  zIndex: 2,
                  pointerEvents: "none",
                  background: color,
                  opacity: 0.32,
                  mixBlendMode: "multiply",
                  borderRadius: "inherit",
                }}
              />
            )
          )}
          {tab === 6 && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 2,
              }}
            >
              <CanvasDraw
                ref={setCanvasRef}
                brushRadius={toolSettings[drawingTool].brushRadius}
                brushColor={toolSettings[drawingTool].color}
                canvasWidth={350}
                canvasHeight={canvasHeight}
                hideGrid={true}
                lazyRadius={0}
                style={{
                  width: "100%",
                  height: "100%",
                  background: "transparent",
                }}
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
              onResizeStop={(e, direction, ref, delta, position) =>
                updateElement(el.id, {
                  width: parseInt(ref.style.width),
                  height: parseInt(ref.style.height),
                  ...position,
                })
              }
              style={{
                zIndex: 3,
                border:
                  selectedElementId === el.id
                    ? "2px solid #F46A6A"
                    : el.__hovered
                    ? "2px dashed orange"
                    : "none",
                boxShadow:
                  selectedElementId === el.id ? "0 0 8px #F46A6A55" : "none",
                background: "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "move",
                transform: `rotate(${el.rotation || 0}deg)`,
              }}
              onMouseEnter={() => updateElement(el.id, { __hovered: true })}
              onMouseLeave={() => updateElement(el.id, { __hovered: false })}
              onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                e.stopPropagation();
                setSelectedElementId(el.id);
                if (el.type === "text") setEditText(el.content);
              }}
            >
              {el.type === "image" && (
                el.shape === "heart" || el.shape === "star" || el.shape === "circle" || el.shape === "oval" || el.shape === "square" ? (
                  <svg
                    width={el.width}
                    height={el.height}
                    viewBox={`0 0 ${el.width} ${el.height}`}
                    style={{ width: "100%", height: "100%", display: "block" }}
                  >
                    <defs>
                      {el.shape === "heart" && (
                        <clipPath id={`heart-clip-${el.id}`}>
                          <path d={`M ${el.width/2},${el.height*0.3} C ${el.width*0.35},${el.height*0.0} ${el.width*0.0},${el.height*0.25} ${el.width/2},${el.height*0.8} C ${el.width},${el.height*0.25} ${el.width*0.65},${el.height*0.0} ${el.width/2},${el.height*0.3} Z`} />
                        </clipPath>
                      )}
                      {el.shape === "star" && (
                        <clipPath id={`star-clip-${el.id}`}>
                          <polygon points={getStarPoints(el.width, el.height, 5, el.width/2, el.height/2, Math.min(el.width,el.height)/2, Math.min(el.width,el.height)/4)} />
                        </clipPath>
                      )}
                      {el.shape === "circle" && (
                        <clipPath id={`circle-clip-${el.id}`}>
                          <circle cx={el.width/2} cy={el.height/2} r={Math.min(el.width,el.height)/2} />
                        </clipPath>
                      )}
                      {el.shape === "oval" && (
                        <clipPath id={`oval-clip-${el.id}`}>
                          <ellipse cx={el.width/2} cy={el.height/2} rx={el.width/2} ry={el.height/2} />
                        </clipPath>
                      )}
                      {el.shape === "square" && (
                        <clipPath id={`square-clip-${el.id}`}>
                          <rect x={0} y={0} width={el.width} height={el.height} />
                        </clipPath>
                      )}
                    </defs>
                    <image
                      href={el.content}
                      x={0}
                      y={0}
                      width={el.width}
                      height={el.height}
                      clipPath={`url(#${el.shape}-clip-${el.id})`}
                      preserveAspectRatio="xMidYMid slice"
                    />
                  </svg>
                ) : (
                  <Box
                    component="img"
                    src={el.content}
                    alt="uploaded"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                      borderRadius: el.shape === "circle" ? "50%" : 0,
                      clipPath:
                        el.shape === "oval"
                          ? `ellipse(${(el.shapeSize || 100) / 2}% ${(el.shapeSize || 100) * 0.4 / 1}% at 50% 50%)`
                          : undefined,
                    }}
                  />
                )
              )}
              {el.type === "text" && (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  {el.textStyle === 'arcUp' ? (
                    <svg width={el.width} height={el.height} viewBox={`0 0 ${el.width} ${el.height}`} style={{ width: '100%', height: '100%' }}>
                      <defs>
                        <path id={`arcUp-preview-${el.id}`} d={`M20,${el.height - 20} Q${el.width / 2},${-el.height / 2} ${el.width - 20},${el.height - 20}`} fill="none" />
                      </defs>
                      <text
                        fill={el.color || textColor}
                        fontWeight="700"
                        fontSize={getAutoFitFontSize({ text: el.content, fontFamily: el.fontFamily, boxWidth: el.width, boxHeight: el.height, textStyle: 'straight', lineHeight })}
                        textAnchor="middle"
                      >
                        <textPath xlinkHref={`#arcUp-preview-${el.id}`} startOffset="50%">{el.content}</textPath>
                      </text>
                    </svg>
                  ) : el.textStyle === 'arcDown' ? (
                    <svg width={el.width} height={el.height} viewBox={`0 0 ${el.width} ${el.height}`} style={{ width: '100%', height: '100%' }}>
                      <defs>
                        <path id={`arcDown-preview-${el.id}`} d={`M20,20 Q${el.width / 2},${el.height * 1.2} ${el.width - 20},20`} fill="none" />
                      </defs>
                      <text
                        fill={el.color || textColor}
                        fontWeight="700"
                        fontSize={getAutoFitFontSize({ text: el.content, fontFamily: el.fontFamily, boxWidth: el.width, boxHeight: el.height, textStyle: el.textStyle, lineHeight })}
                        textAnchor="middle"
                      >
                        <textPath xlinkHref={`#arcDown-preview-${el.id}`} startOffset="50%">{el.content}</textPath>
                      </text>
                    </svg>
                  ) : el.textStyle === 'wavy' ? (
                    <svg width={el.width} height={el.height} viewBox={`0 0 ${el.width} ${el.height}`} style={{ width: '100%', height: '100%' }}>
                      <defs>
                        <path id={`wavy-preview-${el.id}`} d={`M20,${el.height / 2} Q${el.width / 4},${el.height / 2 - 20} ${el.width / 2},${el.height / 2} T${el.width - 20},${el.height / 2}`} fill="none" />
                      </defs>
                      <text
                        fill={el.color || textColor}
                        fontWeight="700"
                        fontSize={getAutoFitFontSize({ text: el.content, fontFamily: el.fontFamily, boxWidth: el.width, boxHeight: el.height, textStyle: el.textStyle, lineHeight })}
                        textAnchor="middle"
                      >
                        <textPath xlinkHref={`#wavy-preview-${el.id}`} startOffset="50%">{el.content}</textPath>
                      </text>
                    </svg>
                  ) : (
                    <Typography
                      sx={{
                        color: el.color || textColor,
                        fontWeight: 700,
                        textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: textAlign,
                        fontFamily: el.fontFamily || "Arial, sans-serif",
                        fontSize: getAutoFitFontSize({ text: el.content, fontFamily: el.fontFamily, boxWidth: el.width, boxHeight: el.height, textStyle: el.textStyle, lineHeight }),
                        wordBreak: 'break-word',
                        whiteSpace: 'pre-line',
                        lineHeight: lineHeight,
                        overflow: 'hidden',
                        fontStyle: isItalic ? 'italic' : 'normal',
                      }}
                    >
                      {el.content}
                    </Typography>
                  )}
                </Box>
              )}
              {el.type === "sticker" && (
                <Typography
                  sx={{
                    fontSize: `${Math.max(10, el.height * 0.8)}px`,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                  }}
                >
                  {el.content}
                </Typography>
              )}
              {el.type === "art" && (
                el.shape === "heart" || el.shape === "star" || el.shape === "circle" || el.shape === "oval" || el.shape === "square" ? (
                  <svg
                    width={el.width}
                    height={el.height}
                    viewBox={`0 0 ${el.width} ${el.height}`}
                    style={{ width: "100%", height: "100%", display: "block" }}
                  >
                    <defs>
                      {el.shape === "heart" && (
                        <clipPath id={`heart-clip-${el.id}`}>
                          <path d={`M ${el.width/2},${el.height*0.3} C ${el.width*0.35},${el.height*0.0} ${el.width*0.0},${el.height*0.25} ${el.width/2},${el.height*0.8} C ${el.width},${el.height*0.25} ${el.width*0.65},${el.height*0.0} ${el.width/2},${el.height*0.3} Z`} />
                        </clipPath>
                      )}
                      {el.shape === "star" && (
                        <clipPath id={`star-clip-${el.id}`}>
                          <polygon points={getStarPoints(el.width, el.height, 5, el.width/2, el.height/2, Math.min(el.width,el.height)/2, Math.min(el.width,el.height)/4)} />
                        </clipPath>
                      )}
                      {el.shape === "circle" && (
                        <clipPath id={`circle-clip-${el.id}`}>
                          <circle cx={el.width/2} cy={el.height/2} r={Math.min(el.width,el.height)/2} />
                        </clipPath>
                      )}
                      {el.shape === "oval" && (
                        <clipPath id={`oval-clip-${el.id}`}>
                          <ellipse cx={el.width/2} cy={el.height/2} rx={el.width/2} ry={el.height/2} />
                        </clipPath>
                      )}
                      {el.shape === "square" && (
                        <clipPath id={`square-clip-${el.id}`}>
                          <rect x={0} y={0} width={el.width} height={el.height} />
                        </clipPath>
                      )}
                    </defs>
                    <image
                      href={el.content}
                      x={0}
                      y={0}
                      width={el.width}
                      height={el.height}
                      clipPath={`url(#${el.shape}-clip-${el.id})`}
                      preserveAspectRatio="xMidYMid slice"
                    />
                  </svg>
                ) : (
                  <Box
                    component="img"
                    src={el.content}
                    alt="art"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      filter: "drop-shadow(0 2px 8px #FFD700)",
                      borderRadius: el.shape === "circle" ? "50%" : 0,
                      clipPath:
                        el.shape === "oval"
                          ? `ellipse(${(el.shapeSize || 100) / 2}% ${(el.shapeSize || 100) * 0.4 / 1}% at 50% 50%)`
                          : undefined,
                    }}
                  />
                )
              )}
              {el.type === "shape" && (
                el.content === "rectangle" ? (
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      bgcolor: el.fill ? el.color : "transparent",
                      border: `2px solid ${el.borderColor}`,
                      borderRadius: 1,
                    }}
                  />
                ) : el.content === "circle" ? (
                  <svg width="100%" height="100%" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill={el.fill ? el.color : "transparent"}
                      stroke={el.borderColor}
                      strokeWidth="4"
                    />
                  </svg>
                ) : el.content === "triangle" ? (
                  <svg width="100%" height="100%" viewBox="0 0 100 100">
                    <polygon
                      points="50,10 90,90 10,90"
                      fill={el.fill ? el.color : "transparent"}
                      stroke={el.borderColor}
                      strokeWidth="4"
                    />
                  </svg>
                ) : el.content === "stripe" ? (
                  <Box
                    sx={{
                      width: "100%",
                      height: 20,
                      bgcolor: el.color,
                      border: `2px solid ${el.borderColor}`,
                    }}
                  />
                ) : el.content === "line-h" ? (
                  <Box
                    sx={{
                      width: "100%",
                      height: 6,
                      bgcolor: "transparent",
                      borderBottom: `4px solid ${el.borderColor}`,
                    }}
                  />
                ) : el.content === "line-v" ? (
                  <Box
                    sx={{
                      width: 6,
                      height: "100%",
                      bgcolor: "transparent",
                      borderRight: `4px solid ${el.borderColor}`,
                    }}
                  />
                ) : el.content === "line-d" ? (
                  <Box
                    sx={{
                      width: "100%",
                      height: 6,
                      bgcolor: "transparent",
                      borderBottom: `4px solid ${el.borderColor}`,
                      transform: "rotate(-45deg)",
                    }}
                  />
                ) : el.content === "arrow" ? (
                  <svg width="100%" height="100%" viewBox="0 0 100 100">
                    <line x1="10" y1="50" x2="70" y2="50" stroke={el.borderColor} strokeWidth="8" />
                    <polygon points="70,35 95,50 70,65" fill={el.fill ? el.color : el.borderColor} stroke={el.borderColor} strokeWidth="4" />
                  </svg>
                ) : el.content === "pentagon" ? (
                  <svg width="100%" height="100%" viewBox="0 0 100 100">
                    <polygon
                      points="50,10 90,40 73,90 27,90 10,40"
                      fill={el.fill ? el.color : "transparent"}
                      stroke={el.borderColor}
                      strokeWidth="4"
                    />
                  </svg>
                ) : el.content === "hexagon" ? (
                  <svg width="100%" height="100%" viewBox="0 0 100 100">
                    <polygon
                      points="50,10 90,30 90,70 50,90 10,70 10,30"
                      fill={el.fill ? el.color : "transparent"}
                      stroke={el.borderColor}
                      strokeWidth="4"
                    />
                  </svg>
                ) : el.content === "star" ? (
                  <svg width="100%" height="100%" viewBox="0 0 100 100">
                    <polygon
                      points="50,10 61,39 92,39 66,59 76,89 50,70 24,89 34,59 8,39 39,39"
                      fill={el.fill ? el.color : "transparent"}
                      stroke={el.borderColor}
                      strokeWidth="4"
                    />
                  </svg>
                ) : el.content === "heart" ? (
                  <svg width="100%" height="100%" viewBox="0 0 100 100">
                    <path
                      d="M50 80 L20 50 A20 20 0 1 1 50 30 A20 20 0 1 1 80 50 Z"
                      fill={el.fill ? el.color : "transparent"}
                      stroke={el.borderColor}
                      strokeWidth="4"
                    />
                  </svg>
                ) : el.content === "diamond" ? (
                  <svg width="100%" height="100%" viewBox="0 0 100 100">
                    <polygon
                      points="50,10 90,50 50,90 10,50"
                      fill={el.fill ? el.color : "transparent"}
                      stroke={el.borderColor}
                      strokeWidth="4"
                    />
                  </svg>
                ) : el.content === "square" ? (
                  <svg width="100%" height="100%" viewBox="0 0 100 100">
                    <rect x={0} y={0} width={100} height={100} fill={el.fill ? el.color : "transparent"} />
                  </svg>
                ) : null)}
              <Button
                size="small"
                color="error"
                onClick={() => setElements(elements.filter((e) => e.id !== el.id))}
                sx={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  minWidth: 24,
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  p: 0,
                  bgcolor: "white",
                  boxShadow: 1,
                  zIndex: 1000,
                  cursor: "pointer",
                  "&:hover": { bgcolor: "#ffebee" },
                }}
              >
                ×
              </Button>
              {(el.type === "image" || el.type === "art") && (
                <>
                  <IconButton
                    size="small"
                    sx={{
                      position: "absolute",
                      top: -32,
                      left: "50%",
                      transform: "translateX(-50%)",
                      zIndex: 10,
                      bgcolor: "white",
                      boxShadow: 1,
                    }}
                    onClick={(e) => {
                      setShapeAnchorEl(e.currentTarget);
                      setSelectedElementId(el.id);
                    }}
                  >
                    <FormatShapesIcon fontSize="small" />
                  </IconButton>
                  <Popover
                    open={Boolean(shapeAnchorEl) && selectedElementId === el.id}
                    anchorEl={shapeAnchorEl}
                    onClose={() => setShapeAnchorEl(null)}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    transformOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                  >
                    <Box sx={{ p: 2, minWidth: 180 }}>
                      <ToggleButtonGroup
                        value={el.shape || "rectangle"}
                        exclusive
                        onChange={(_, value) => {
                          if (value) {
                            updateElement(el.id, { shape: value });
                          }
                        }}
                        size="small"
                        sx={{ mb: 2 }}
                      >
                        {shapeOptions.map((opt) => (
                          <ToggleButton key={opt.value} value={opt.value}>
                            {opt.label}
                          </ToggleButton>
                        ))}
                      </ToggleButtonGroup>
                      {el.shape && el.shape !== "rectangle" && (
                        <Box sx={{ mt: 1 }}>
                          <Typography
                            variant="caption"
                            sx={{ mb: 1, display: "block" }}
                          >
                            Shape Size
                          </Typography>
                          <Slider
                            min={50}
                            max={100}
                            value={el.shapeSize || 100}
                            onChange={(_, value) =>
                              updateElement(el.id, {
                                shapeSize: value as number,
                              })
                            }
                            valueLabelDisplay="auto"
                          />
                        </Box>
                      )}
                    </Box>
                  </Popover>
                </>
              )}
              {selectedElementId === el.id && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    cursor: 'grab',
                    zIndex: 10,
                  }}
                  onMouseDown={e => startPanImage(e, el.id)}
                />
              )}
            </Rnd>
          ))}
        </CanvasBox>

        {/* Floating toolbar for editing text */}
        {selectedElementId &&
          (() => {
            const selectedEl = elements.find(
              (el) => el.id === selectedElementId
            );
            console.log("Selected element:", selectedEl);
            if (!selectedEl) return null;
            if (selectedEl.type === "text") {
              return (
                <Box
                  sx={{
                    position: "absolute",
                    top: 10,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 1000,
                    bgcolor: "white",
                    boxShadow: 2,
                    borderRadius: 2,
                    p: 1,
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                    border: "2px solid #1976d2",
                  }}
                >
                  <TextField
                    size="small"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                      updateElement(selectedElementId, { content: editText })
                    }
                  />
                  <input
                    type="color"
                    value={selectedEl.color || "#000000"}
                    onChange={(e) =>
                      updateElement(selectedElementId, {
                        color: e.target.value,
                      })
                    }
                    style={{
                      width: 28,
                      height: 28,
                      border: "none",
                      background: "none",
                    }}
                  />
                  <Select
                    size="small"
                    value={selectedEl.textStyle || "straight"}
                    onChange={(e) =>
                      updateElement(selectedElementId, {
                        textStyle: e.target.value as
                          | "straight"
                          | "arcUp"
                          | "arcDown"
                          | "wavy",
                      })
                    }
                    sx={{ minWidth: 100 }}
                  >
                    <MenuItem value="straight">Straight</MenuItem>
                    <MenuItem value="arcUp">Arc Up</MenuItem>
                    <MenuItem value="arcDown">Arc Down</MenuItem>
                    <MenuItem value="wavy">Wavy</MenuItem>
                  </Select>
                  <Button
                    size="small"
                    color="error"
                    onClick={() =>
                      setElements(
                        elements.filter((e) => e.id !== selectedElementId)
                      )
                    }
                  >
                    Delete
                  </Button>
                </Box>
              );
            } else if (
              selectedEl.type === "image" ||
              selectedEl.type === "art"
            ) {
              console.log(
                "Rendering shape picker for:",
                selectedEl.id,
                selectedEl.type
              );
              return (
                <Box
                  sx={{
                    position: "absolute",
                    top: 10,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 1000,
                    bgcolor: "white",
                    boxShadow: 2,
                    borderRadius: 2,
                    p: 1,
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                    border: "2px solid #d32f2f",
                  }}
                >
                  <div style={{ color: "#d32f2f", fontWeight: 700 }}>
                    Shape Picker Toolbar
                  </div>
                  <Select
                    size="small"
                    value={selectedEl.shape || "rectangle"}
                    onChange={(e) =>
                      updateElement(selectedElementId, {
                        shape: e.target.value as
                          | "rectangle"
                          | "circle"
                          | "oval"
                          | "heart"
                          | "star"
                          | "square",
                      })
                    }
                    sx={{ minWidth: 100 }}
                  >
                    <MenuItem value="rectangle">Rectangle</MenuItem>
                    <MenuItem value="circle">Circle</MenuItem>
                    <MenuItem value="oval">Oval</MenuItem>
                    <MenuItem value="heart">Heart</MenuItem>
                    <MenuItem value="star">Star</MenuItem>
                    <MenuItem value="square">Square</MenuItem>
                  </Select>
                  <Button
                    size="small"
                    color="error"
                    onClick={() =>
                      setElements(
                        elements.filter((e) => e.id !== selectedElementId)
                      )
                    }
                  >
                    Delete
                  </Button>
                </Box>
              );
            }
            return null;
          })()}
        {/* Save Button */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
            sx={{
              borderRadius: 8,
              fontWeight: 700,
              px: 4,
              bgcolor: '#e05555',
              color: 'white',
              boxShadow: 2,
              mb: 2,
              '&:hover': {
                bgcolor: '#c94444',
                boxShadow: 3,
              },
            }}
          >
            Save
          </Button>
        </Box>

        {/* Customization Tabs */}
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          centered
          sx={{
            mb: 2,
            '& .MuiTabs-indicator': {
              backgroundColor: '#222', // black underline
            },
            '& .Mui-selected': {
              color: '#222 !important', // black text for selected tab
            },
          }}
        >
          <Tab icon={<ColorLens />} label="Color" />
          <Tab icon={<TextFields />} label="Text" />
          <Tab icon={<EmojiEmotions />} label="Sticker" />
          <Tab icon={<AddPhotoAlternate />} label="Image" />
          <Tab icon={<Palette />} label="Art" />
          <Tab icon={<FormatShapes />} label="Shapes" />
          <Tab icon={<Brush />} label="Tools" />
        </Tabs>
        {tab === 0 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Button
              onClick={handleColorClick}
              sx={{
                width: 40,
                height: 40,
                minWidth: 0,
                borderRadius: "50%",
                background: color,
                border: "2px solid #eee",
                boxShadow: 1,
                p: 0,
                "&:hover": { border: "2px solid #F46A6A" },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Palette
                sx={{
                  color: color === "#ffffff" ? "#aaa" : "#fff",
                  fontSize: 28,
                }}
              />
            </Button>
            <Popover
              open={colorPickerOpen}
              anchorEl={colorAnchorEl}
              onClose={handleColorClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              transformOrigin={{ vertical: "top", horizontal: "center" }}
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
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Paper elevation={6} sx={{
              p: { xs: 2, sm: 3 }, // reduce padding
              borderRadius: 5,
              minWidth: { xs: '100%', sm: 400 },
              maxWidth: 650,
              width: '100%',
              minHeight: 200, // reduce minHeight
              pb: 6, // less bottom padding
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: '#fff',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              border: '1.5px solid #f3f3f3',
              gap: 0,
            }}>
              {/* Live Preview */}
              {text && (
                <Box sx={{ mb: 3, width: '100%', textAlign: 'center', p: 2, borderRadius: 3, background: '#f8fafd', border: '1px solid #f0f0f0', minHeight: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(244,106,106,0.04)' }}>
                  <Typography
                    sx={{
                      color: textColor,
                      fontFamily: selectedFont,
                      fontWeight: isBold ? 700 : fontWeight,
                      fontStyle: isItalic ? 'italic' : 'normal',
                      fontSize: fontSize !== 'auto' ? fontSize : getAutoFitFontSize({ text, fontFamily: selectedFont, boxWidth: 500, boxHeight: 60, textStyle, lineHeight }),
                      textShadow: '0 1px 2px rgba(0,0,0,0.08)',
                    }}
                  >
                    {text}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Preview
                  </Typography>
                </Box>
              )}
              {/* Top row: font, style, alignment, line height (all in one line) */}
              <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 1 }}> {/* reduce mb */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, width: '100%', mb: 1 }}> {/* reduce mb */}
                  {/* Font Family */}
                  <Select size="small" value={selectedFont} onChange={e => setSelectedFont(e.target.value)} sx={{ minWidth: 140, height: 44 }}>
                    <MenuItem value="Arial">Arial</MenuItem>
                    <MenuItem value="Times New Roman">Times New Roman</MenuItem>
                    <MenuItem value="Comic Sans MS">Comic Sans MS</MenuItem>
                    <MenuItem value="Monospace">Monospace</MenuItem>
                    <MenuItem value="Cursive">Cursive</MenuItem>
                  </Select>
                  {/* Style */}
                  <Select size="small" value={textStyle} onChange={e => setTextStyle(e.target.value as any)} sx={{ minWidth: 120, height: 44 }}>
                    <MenuItem value="straight">Straight</MenuItem>
                    <MenuItem value="arcUp">Arc Up</MenuItem>
                    <MenuItem value="arcDown">Arc Down</MenuItem>
                    <MenuItem value="wavy">Wavy</MenuItem>
                  </Select>
                  {/* Alignment */}
                  <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#fafbfc', borderRadius: 2, p: 0.5, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                    <IconButton size="small" color={textAlign === 'left' ? 'primary' : 'default'} onClick={() => setTextAlign('left')}><FormatAlignLeft /></IconButton>
                    <IconButton size="small" color={textAlign === 'center' ? 'primary' : 'default'} onClick={() => setTextAlign('center')}><FormatAlignCenter /></IconButton>
                    <IconButton size="small" color={textAlign === 'right' ? 'primary' : 'default'} onClick={() => setTextAlign('right')}><FormatAlignRight /></IconButton>
                    <IconButton size="small" color={textAlign === 'justify' ? 'primary' : 'default'} onClick={() => setTextAlign('justify')}><FormatAlignJustify /></IconButton>
                  </Box>
                  {/* Bold */}
                  <Button variant={isBold ? 'contained' : 'outlined'} onClick={() => setIsBold(b => !b)} sx={{ minWidth: 36, height: 44, fontWeight: 700 }}>B</Button>
                  {/* Italic */}
                  <Button variant={isItalic ? 'contained' : 'outlined'} onClick={() => setIsItalic(i => !i)} sx={{ minWidth: 36, height: 44, fontStyle: 'italic', fontWeight: 500 }}>/</Button>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, width: '100%' }}> {/* reduce mb */}
                  {/* Line Height */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Height sx={{ color: '#bdbdbd' }} />
                    <Select size="small" value={lineHeight} onChange={e => setLineHeight(Number(e.target.value))} sx={{ minWidth: 70, height: 44 }}>
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={1.2}>1.2</MenuItem>
                      <MenuItem value={1.5}>1.5</MenuItem>
                      <MenuItem value={2}>2</MenuItem>
                    </Select>
                  </Box>
                  {/* Font Size */}
                  <Select size="small" value={fontSize} onChange={e => setFontSize(e.target.value === 'auto' ? 'auto' : Number(e.target.value))} sx={{ minWidth: 70, height: 44 }}>
                    <MenuItem value="auto">Auto</MenuItem>
                    {[8, 10, 12, 14, 16, 18, 20, 24, 28, 36, 48, 72].map(size => (
                      <MenuItem key={size} value={size}>{size}</MenuItem>
                    ))}
                  </Select>
                  {/* Font Weight */}
                  <Select size="small" value={fontWeight} onChange={e => setFontWeight(Number(e.target.value) as 400 | 600 | 700)} sx={{ minWidth: 90, height: 44 }}>
                    <MenuItem value={400}>Regular</MenuItem>
                    <MenuItem value={600}>Semi-Bold</MenuItem>
                    <MenuItem value={700}>Bold</MenuItem>
                  </Select>
                </Box>
              </Box>
              {/* Middle row: text input and color palette */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, width: '100%', mb: 2 }}>
                <TextField
                  placeholder="Enter your text"
                  value={text}
                  onChange={handleTextInputChange}
                  size="small"
                  variant="outlined"
                  sx={{ minWidth: { xs: '100%', sm: 200 }, flex: 2, background: '#fafbfc', borderRadius: 2, input: { textAlign: 'center', fontWeight: 500 } }}
                  InputProps={{ style: { height: 40 } }}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: '2px solid #eee',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#fafbfc',
                      boxShadow: '0 2px 6px rgba(244,106,106,0.08)',
                      cursor: 'pointer',
                      position: 'relative',
                      color: '#bdbdbd',
                      transition: 'box-shadow 0.2s',
                      '&:hover': { boxShadow: '0 4px 12px rgba(244,106,106,0.15)' },
                    }}
                    onClick={() => document.getElementById('text-color-input')?.click()}
                  >
                    <Palette sx={{ fontSize: 28 }} />
                    <input
                      id="text-color-input"
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      style={{ width: 32, height: 32, border: 'none', background: 'none', cursor: 'pointer', padding: 0, position: 'absolute', top: 0, left: 0, opacity: 0 }}
                    />
                  </Box>
                </Box>
              </Box>
              {/* Add Text button at the bottom */}
              <Button
                variant="contained"
                disabled={!text.trim()}
                onClick={handleAddText}
                sx={{
                  mt: 1,
                  bgcolor: '#e0e0e0',
                  color: '#888',
                  fontWeight: 400,
                  boxShadow: 0,
                  cursor: !text.trim() ? 'not-allowed' : 'pointer',
                  '&:hover': {
                    bgcolor: '#e0e0e0',
                    color: '#888',
                  },
                  width: 180,
                  mx: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  
                }}
              >
                <TextFields sx={{ fontSize: 24, mr: 1 }} />
                ADD TEXT
              </Button>
            </Paper>
          </Box>
        )}
        {tab === 2 && (
         <Box sx={{ flexGrow: 1, width: '150%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'auto' }}>
         <Box sx={{ maxWidth: 700, minWidth: 400, width: '100%' }}>
           <Picker data={data} onEmojiSelect={emoji => handleAddSticker(emoji.native)} style={{ width: '100%' }} />
         </Box>
          </Box>
        )}
        {tab === 3 && (
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<AddPhotoAlternate />}
              sx={{
                borderColor: 'rgb(0, 0, 0, 0.26)',
                color: 'rgb(0, 0, 0, 0.26)',
                fontWeight: 700,
                borderRadius: 2,
                px: 3,
                py: 1.2,
                boxShadow: 1,
                '&:hover': {
                  bgcolor: 'rgb(0, 0, 0, 0.08)',
                  borderColor: 'rgb(0, 0, 0, 0.26)',
                },
              }}
            >
              Upload Image
              <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
            </Button>
            {uploadedImage && (
              <Button
                color="error"
                sx={{ ml: 2 }}
                onClick={() => setUploadedImage(null)}
              >
                Remove
              </Button>
            )}
          </Box>
        )}
        {tab === 4 && (
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              justifyContent: "center",
              mb: 2,
            }}
          >
            {validAllArtImages.map((art, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minWidth: 64,
                }}
              >
                <Button
                  onClick={() => handleAddArt(art.src)}
                  sx={{
                    p: 0,
                    minWidth: 60,
                    minHeight: 60,
                    border: "1px solid #eee",
                    borderRadius: 2,
                    bgcolor: "#fff",
                  }}
                >
                  <Box
                    component="img"
                    src={art.src}
                    alt={art.label}
                    sx={{ width: 48, height: 48, objectFit: "cover" }}
                  />
                </Button>
                <Typography
                  variant="caption"
                  sx={{
                    mt: 0.5,
                    textAlign: "center",
                    maxWidth: 60,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {art.label}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
        {tab === 5 && (
          <Box sx={{ width: '100%', mt: 2 }}>
            {/* Color pickers and toggle row */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span style={{ fontWeight: 600 }}>Fill:</span>
                <input type="color" value={shapeColor} onChange={e => setShapeColor(e.target.value)} style={{ width: 32, height: 32, border: 'none', borderRadius: 6, background: 'none', cursor: 'pointer' }} />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span style={{ fontWeight: 600 }}>Border:</span>
                <input type="color" value={shapeBorderColor} onChange={e => setShapeBorderColor(e.target.value)} style={{ width: 32, height: 32, border: 'none', borderRadius: 6, background: 'none', cursor: 'pointer' }} />
              </Box>
              <ToggleButton
                value="filled"
                selected={shapeFill}
                onChange={() => setShapeFill(f => !f)}
                sx={{
                  bgcolor: shapeFill ? 'rgb(244,106,106)' : '#f3f3f3',
                  color: '#888 !important', // force grey text
                  fontWeight: 700,
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  boxShadow: 1,
                  '&:hover': { bgcolor: shapeFill ? 'rgb(224,85,85)' : '#f3f3f3' },
                }}
              >
                <span style={{ color: '#888' }}>{shapeFill ? "Filled" : "No Fill"}</span>
              </ToggleButton>
            </Box>
            {/* Shapes grid */}
            <Grid container spacing={2} justifyContent="center" alignItems="center">
              {shapes.map((shape, i) => (
                <Grid item key={i}>
                  <Tooltip title={shape.label} arrow>
                    <Box
                      onClick={() => handleAddShape(shape.value, shapeFill, shapeColor, shapeBorderColor)}
                      sx={{
                        width: 48,
                        height: 48,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 2,
                        boxShadow: 1,
                        bgcolor: '#fff',
                        cursor: 'pointer',
                        transition: 'transform 0.18s, box-shadow 0.18s',
                        '&:hover': {
                          transform: 'scale(1.13)',
                          boxShadow: 4,
                          bgcolor: '#f8f8f8',
                        },
                        border: '1.5px solid #eee',
                      }}
                    >
                      {shape.icon}
                    </Box>
                  </Tooltip>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
        {tab === 6 && (
          <Box sx={{ width: '100%', mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Paper elevation={2} sx={{ p: 2, borderRadius: 3, mb: 2, minWidth: 320, maxWidth: 420, width: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} mb={1} sx={{ textAlign: 'center', color: '#444' }}>
                Draw on your product
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 1.5, width: '100%' }}>
                <Button
                  startIcon={<Brush />}
                  variant="contained"
                  sx={{
                    minWidth: 100,
                    fontWeight: 600,
                    borderRadius: 2,
                    bgcolor: '#e0e0e0',
                    color: '#888',
                    boxShadow: 0,
                    '&:hover': { bgcolor: '#e0e0e0', color: '#888' },
                  }}
                >
                  Paint Brush
                </Button>
                <Button
                  startIcon={<Create />}
                  variant="contained"
                  sx={{
                    minWidth: 70,
                    fontWeight: 600,
                    borderRadius: 2,
                    bgcolor: '#e0e0e0',
                    color: '#888',
                    boxShadow: 0,
                    '&:hover': { bgcolor: '#e0e0e0', color: '#888' },
                  }}
                >
                  Pen
                </Button>
                <Button
                  startIcon={<Edit />}
                  variant="contained"
                  sx={{
                    minWidth: 80,
                    fontWeight: 600,
                    borderRadius: 2,
                    bgcolor: '#e0e0e0',
                    color: '#888',
                    boxShadow: 0,
                    '&:hover': { bgcolor: '#e0e0e0', color: '#888' },
                  }}
                >
                  Pencil
                </Button>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
                  <Typography variant="body2" sx={{ color: '#888', fontWeight: 600 }}>Color:</Typography>
                  <input
                    type="color"
                    value={drawingColor}
                    onChange={(e) => setDrawingColor(e.target.value)}
                    style={{ width: 28, height: 28, border: 'none', background: 'none', cursor: 'pointer', borderRadius: 6 }}
                    title="Pick color"
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
                  <Typography variant="body2" sx={{ color: '#888', fontWeight: 600 }}>Size:</Typography>
                  <Slider
                    min={1}
                    max={30}
                    value={brushSize}
                    onChange={(_, value) => setBrushSize(value as number)}
                    valueLabelDisplay="auto"
                    sx={{ width: 80, mx: 1 }}
                  />
                  <Typography variant="caption" sx={{ color: '#888', minWidth: 20 }}> {brushSize}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
                  <Button variant="outlined" size="small" sx={{ fontWeight: 600, borderRadius: 2, color: '#888', borderColor: '#888', bgcolor: 'transparent', boxShadow: 0, '&:hover': { bgcolor: 'transparent', color: '#888', borderColor: '#888' } }} onClick={() => canvasRef?.undo()}>UNDO</Button>
                  <Button variant="outlined" size="small" sx={{ fontWeight: 600, borderRadius: 2, color: '#888', borderColor: '#888', bgcolor: 'transparent', boxShadow: 0, '&:hover': { bgcolor: 'transparent', color: '#888', borderColor: '#888' } }} onClick={() => canvasRef?.clear()}>CLEAR</Button>
                </Box>
              </Box>
            </Paper>
          </Box>
        )}
        {/* Add to Cart and Buy Now buttons at the bottom */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ShoppingCart />}
            onClick={handleAddToCartCustom}
            disabled={!isSaved}
            sx={{
              minWidth: 180,
              height: 48,
              fontWeight: 700,
              bgcolor: '#e16a6a',
              color: 'white',
              boxShadow: 2,
              '&:hover': {
                bgcolor: '#c94b4b',
              },
              borderRadius: 2,
              fontSize: '1rem',
            }}
            title={!isSaved ? 'Please save your customization first' : ''}
          >
            Add to Cart
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleBuyNow}
            disabled={!isSaved}
            sx={{
              minWidth: 180,
              height: 48,
              fontWeight: 700,
              color: '#e16a6a',
              borderColor: '#e16a6a',
              background: 'white',
              '&:hover': {
                color: 'white',
                background: '#e16a6a',
                borderColor: '#c94b4b',
              },
              borderRadius: 2,
              fontSize: '1rem',
            }}
            title={!isSaved ? 'Please save your customization first' : ''}
          >
            PROCEED TO CHECKOUT
            
          </Button>
        </Box>
      </Paper>
      {/* Snackbar for success/error messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductCustomize;