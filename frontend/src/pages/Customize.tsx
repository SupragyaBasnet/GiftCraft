import { Checkroom, DesignServices, Edit, EmojiEmotions, LocalCafe, MenuBook, Opacity, PhoneIphone, Photo, SportsBaseball, VpnKey } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Container, Grid, Typography } from '@mui/material';
import React, { useState } from 'react';
import circleKeychain from '../assets/products/circle-keychain.png';
import keychainLeather from '../assets/products/keychain-leather.png';
import planemetalkeychain from '../assets/products/planemetalkeychain.png';
import planewhitekeychain from '../assets/products/planewhitekeychain.png';
import squareFront from '../assets/products/square-keychain.png';
import starshapedBack from '../assets/products/starshaped-back.png';
import { products } from '../data/products';
import ProductCustomize from './ProductCustomize';

const categoryIcons = {
  mugs: <LocalCafe sx={{ fontSize: 64, color: '#F46A6A' }} />,
  tshirts: <Checkroom sx={{ fontSize: 64, color: '#F46A6A' }} />,
  phonecases: <PhoneIphone sx={{ fontSize: 64, color: '#F46A6A' }} />,
  frames: <Photo sx={{ fontSize: 64, color: '#F46A6A' }} />,
  waterbottles: <Opacity sx={{ fontSize: 64, color: '#F46A6A' }} />,
  notebooks: <MenuBook sx={{ fontSize: 64, color: '#F46A6A' }} />,
  pens: <Edit sx={{ fontSize: 64, color: '#F46A6A' }} />,
  pillowcases: <EmojiEmotions sx={{ fontSize: 64, color: '#F46A6A' }} />,
  caps: <SportsBaseball sx={{ fontSize: 64, color: '#F46A6A' }} />,
  keychains: <VpnKey sx={{ fontSize: 64, color: '#F46A6A' }} />,
};

const categories = [
  { name: 'Mugs', key: 'mugs', link: '/customize/mugs', description: 'Design your own mug for a perfect gift or daily use.' },
  { name: 'T-Shirts', key: 'tshirts', link: '/customize/tshirts', description: 'Create custom t-shirts with your favorite text or art.' },
  { name: 'Phone Cases', key: 'phonecases', link: '/customize/phonecases', description: 'Personalize a phone case to match your style.' },
  { name: 'Photo Frames', key: 'frames', link: '/customize/frames', description: 'Frame your memories with a custom photo frame.' },
  { name: 'Water Bottles', key: 'waterbottles', link: '/customize/waterbottles', description: 'Stay hydrated with a bottle designed by you.' },
  { name: 'Notebook', key: 'notebooks', link: '/customize/notebooks', description: 'Make note-taking fun with a personalized notebook.' },
  { name: 'Pen', key: 'pens', link: '/customize/pens', description: 'Add your name or logo to a stylish pen.' },
  { name: 'Pillow Cases', key: 'pillowcases', link: '/customize/pillowcases', description: 'Cozy up with a pillow case made just for you.' },
  { name: 'Cap', key: 'caps', link: '/customize/caps', description: 'Top off your look with a custom cap.' },
  { name: 'Keychain', key: 'keychains', link: '/customize/keychains', description: 'Carry your keys in style with a unique keychain.' },
];

// Map of category to available types/variants
const categoryTypes: Record<string, string[]> = {
  keychains: [
    'CircleKeychain',
    'RectangleKeychain',
    'StarKeychain',
    'RectangleMetalKeychain',
    'OvalKeychain',
    'LeatherKeychain',
  ],
  phonecases: [
    'iPhone8Plus',
    'iPhone13ProMax',
    'iPhone14',
    'S21Ultra',
    'S23Ultra',
  ],
  // Add more categories with types as needed
};

// Keychain type info for cards
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

const Customize: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleCategoryClick = (key: string) => {
    setSelectedCategory(key);
    setSelectedType(null);
  };
  const handleBack = () => {
    setSelectedCategory(null);
    setSelectedType(null);
  };

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : [];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* <Typography variant="h3" align="center" fontWeight={800} gutterBottom sx={{ color: '#111', fontSize: { xs: '2rem', md: '2.2rem' } }}>
        Customize Any Product
      </Typography> */}
      {/* <Box sx={{ width: 120, height: 4, bgcolor: '#F46A6A', borderRadius: 2, mx: 'auto', mb: 4 }} /> */}
      {!selectedCategory ? (
        <Grid container spacing={4} justifyContent="center">
          {categories.map((cat) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={cat.key}>
              <Card
                sx={{
                  width: 260,
                  height: 320,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'white',
                  borderRadius: 4,
                  boxShadow: '0 2px 12px 0 rgba(0,0,0,0.04)',
                  p: { xs: 1, sm: 2 },
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 6px 24px 0 rgba(244,106,106,0.10)',
                  },
                  mx: 'auto',
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
                onClick={() => handleCategoryClick(cat.key)}
              >
                <Box sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {categoryIcons[cat.key as keyof typeof categoryIcons] as React.ReactNode}
                </Box>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 0, width: '100%', minHeight: 60, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#111', fontSize: '1.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {cat.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, minHeight: 36 }}>
                    {cat.description}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<DesignServices />}
                    sx={{ mt: 2, borderRadius: 8, fontWeight: 700, px: 3, backgroundColor: '#F46A6A', '&:hover': { backgroundColor: '#e05555' } }}
                  >
                    Customize
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <>
          <Box sx={{ mb: 3 }}>
            {/* Removed back arrow and phonecase label */}
          </Box>
          {/* If keychains, show grid of cards for each type */}
          {selectedCategory === 'keychains' && !selectedType && (
            <Box sx={{ mb: 4 }}>
             
              <ProductCustomize categoryOverride={selectedCategory} />
            </Box>
          )}
          {/* For other categories with types, show button picker */}
          {selectedCategory === 'phonecases' && !selectedType && (
            <ProductCustomize categoryOverride={selectedCategory} />
          )}
          {selectedCategory !== 'keychains' && selectedCategory !== 'phonecases' && categoryTypes[selectedCategory] && !selectedType && (
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Select Type</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
                {categoryTypes[selectedCategory].map((type) => (
                  <Button
                    key={type}
                    variant="outlined"
                    sx={{ minWidth: 180, fontWeight: 700, borderRadius: 3, fontSize: '1rem', py: 2 }}
                    onClick={() => setSelectedType(type)}
                  >
                    {type.replace(/([A-Z])/g, ' $1').trim()}
                  </Button>
                ))}
              </Box>
            </Box>
          )}
          {/* Show customization UI only after type is selected (if needed) */}
          {(selectedType || !categoryTypes[selectedCategory]) && (
            <ProductCustomize categoryOverride={selectedCategory} typeOverride={selectedType} />
          )}
        </>
      )}
    </Container>
  );
};

export default Customize; 