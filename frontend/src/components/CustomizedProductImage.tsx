import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Rnd } from 'react-rnd';

// Define types for elements (should match the type in ProductCustomize.tsx)
interface Element {
  id: string;
  type: 'image' | 'text' | 'sticker';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string; // Add optional color property for text elements
  textStyle?: string; // Add optional textStyle property
  shape?: string; // Add optional shape property
}

interface CustomizedProductImageProps {
  baseImage: string;
  elements: Element[];
  color: string; // Assuming color is a hex string
  productType: string; // To apply product-specific styling
}

// Replicate CanvasBox styling if needed, or just use a basic Box
const CanvasBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  margin: '0 auto',
  background: '#fff',
  borderRadius: 8, // Smaller border radius for thumbnails
  boxShadow: theme.shadows[1], // Lighter shadow
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '10px', // Smaller padding
  '& img': {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
  }
}));

// Helper function to convert Hex to HSL and extract Hue (copied from ProductCustomize.tsx)
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

// Helper function to get product-specific styling (copied from ProductCustomize.tsx)
const getProductStyle = (productType: string) => {
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


const CustomizedProductImage: React.FC<CustomizedProductImageProps> = ({ baseImage, elements, color, productType }) => {
  // Determine the hue difference for color filtering
  const hueDifference = hexToHsl(color).h - hexToHsl('#808080').h;

  return (
    <CanvasBox>
      <Box
        component="img"
        src={baseImage}
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
          p: 2, // Keep padding consistent with customize page
          ...getProductStyle(productType),
          // Apply color filter (same logic as customize page)
          filter: color === '#ffffff' ? 'none' : `sepia(1) saturate(500%) hue-rotate(${hueDifference}deg)`,
        }}
      />
      {elements.map((el) => (
        // Render elements. Use basic Box/Typography as Rnd is for dragging/resizing
        // We just need to position and size them according to saved values
        <Box
          key={el.id}
          sx={{
            position: 'absolute',
            top: el.y,
            left: el.x,
            width: el.width,
            height: el.height,
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden', // Hide overflow for elements
          }}
        >
          {el.type === 'image' && (
            (el.shape === 'heart' || el.shape === 'star') ? (
              <svg
                width={el.width}
                height={el.height}
                viewBox={`0 0 ${el.width} ${el.height}`}
                style={{ width: '100%', height: '100%', display: 'block' }}
              >
                <defs>
                  {el.shape === 'heart' ? (
                    <clipPath id={`heart-clip-${el.id}`}> 
                      <path d={`M${el.width/2} ${el.height*0.8} L${el.width*0.2} ${el.height*0.5} A${el.width*0.3} ${el.height*0.3} 0 1 1 ${el.width/2} ${el.height*0.3} A${el.width*0.3} ${el.height*0.3} 0 1 1 ${el.width*0.8} ${el.height*0.5} Z`} />
                    </clipPath>
                  ) : (
                    <clipPath id={`star-clip-${el.id}`}> 
                      <polygon points={getStarPoints(el.width, el.height, 5, el.width/2, el.height/2, el.width/2.2, el.width/5)} />
                    </clipPath>
                  )}
                </defs>
                <image
                  href={el.content}
                  width={el.width}
                  height={el.height}
                  clipPath={`url(#${el.shape}-clip-${el.id})`}
                  style={{ objectFit: 'contain' }}
                />
              </svg>
            ) : (
              <Box
                component="img"
                src={el.content}
                alt="customization element"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.05))'
                }}
              />
            )
          )}
          {el.type === 'text' && (
            el.textStyle === 'arcUp' ? (
              <svg width={el.width} height={el.height} viewBox={`0 0 ${el.width} ${el.height}`} style={{ width: '100%', height: '100%' }}>
                <defs>
                  <path id={`arcUp-${el.id}`} d={`M10,${el.height-10} Q${el.width/2},${-el.height/1.5} ${el.width-10},${el.height-10}`} fill="none" />
                </defs>
                <text fill={el.color || '#F46A6A'} fontWeight="700" fontSize={Math.max(10, el.height * 0.5)} textAnchor="start">
                  <textPath xlinkHref={`#arcUp-${el.id}`} startOffset="0%">{el.content}</textPath>
                </text>
              </svg>
            ) : el.textStyle === 'arcDown' ? (
              <svg width={el.width} height={el.height} viewBox={`0 0 ${el.width} ${el.height}`} style={{ width: '100%', height: '100%' }}>
                <defs>
                  <path id={`arcDown-${el.id}`} d={`M10,10 Q${el.width/2},${el.height*1.5} ${el.width-10},10`} fill="none" />
                </defs>
                <text fill={el.color || '#F46A6A'} fontWeight="700" fontSize={Math.max(10, el.height * 0.5)} textAnchor="start">
                  <textPath xlinkHref={`#arcDown-${el.id}`} startOffset="0%">{el.content}</textPath>
                </text>
              </svg>
            ) : el.textStyle === 'wavy' ? (
              <svg width={el.width} height={el.height} viewBox={`0 0 ${el.width} ${el.height}`} style={{ width: '100%', height: '100%' }}>
                <defs>
                  <path id={`wavy-${el.id}`} d={`M10,${el.height/2} Q${el.width/6},${el.height/2-30} ${el.width/3},${el.height/2} T${el.width-10},${el.height/2}`} fill="none" />
                </defs>
                <text fill={el.color || '#F46A6A'} fontWeight="700" fontSize={Math.max(10, el.height * 0.5)} textAnchor="start">
                  <textPath xlinkHref={`#wavy-${el.id}`} startOffset="0%">{el.content}</textPath>
                </text>
              </svg>
            ) : (
              <Typography
                sx={{
                  color: el.color || '#F46A6A',
                  fontWeight: 700,
                  textShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  fontSize: Math.min(el.width / el.content.length * 1.2, el.height * 0.8)
                }}
              >
                {el.content}
              </Typography>
            )
          )}
          {el.type === 'sticker' && (
            <Typography
              sx={{
                fontSize: Math.min(el.width, el.height) * 0.8, // Scale sticker size
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.05))', // Lighter shadow
              }}
            >
              {el.content}
            </Typography>
          )}
        </Box>
      ))}
    </CanvasBox>
  );
};

// Helper function for star points (add at the bottom of the file)
function getStarPoints(width: number, height: number, arms: number, cx: number, cy: number, outerRadius: number, innerRadius: number) {
  let results = "";
  let angle = Math.PI / arms;
  for (let i = 0; i < 2 * arms; i++) {
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    const currX = cx + Math.cos(i * angle - Math.PI / 2) * r;
    const currY = cy + Math.sin(i * angle - Math.PI / 2) * r;
    results += `${currX},${currY} `;
  }
  return results.trim();
}

export default CustomizedProductImage; 