import React, { useState } from 'react';
import { Container, Grid, Card, CardContent, Typography, Button, Box, CardMedia, IconButton } from '@mui/material';
import { DesignServices, LocalCafe, Checkroom, PhoneIphone, Photo, Opacity, MenuBook, Edit, EmojiEmotions, SportsBaseball, VpnKey, ArrowBack } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { products } from '../data/products';

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

const Customize: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (key: string) => setSelectedCategory(key);
  const handleBack = () => setSelectedCategory(null);

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : [];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" align="center" fontWeight={800} gutterBottom sx={{ color: '#111', fontSize: { xs: '2rem', md: '2.2rem' } }}>
        Customize Any Product
      </Typography>
      <Box sx={{ width: 120, height: 4, bgcolor: '#F46A6A', borderRadius: 2, mx: 'auto', mb: 4 }} />
      {!selectedCategory ? (
        <Grid container spacing={4} justifyContent="center">
          {categories.map((cat) => {
            const firstProduct = products.find((p) => p.category === cat.key);
            return (
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
                    cursor: firstProduct ? 'pointer' : 'not-allowed',
                  }}
                >
                  <Box sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {categoryIcons[cat.key] as React.ReactNode}
                  </Box>
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 0, width: '100%', minHeight: 60, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#111', fontSize: '1.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {cat.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, minHeight: 36 }}>
                      {cat.description}
                    </Typography>
                    <Button
                      component={firstProduct ? RouterLink : 'button'}
                      to={firstProduct ? `/customize/${cat.key}/${firstProduct.id}` : undefined}
                      variant="contained"
                      startIcon={<DesignServices />}
                      sx={{ mt: 2, borderRadius: 8, fontWeight: 700, px: 3, backgroundColor: '#F46A6A', '&:hover': { backgroundColor: '#e05555' } }}
                      disabled={!firstProduct}
                    >
                      Customize
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <>
          <Box sx={{ mb: 3 }}>
            <IconButton onClick={handleBack} sx={{ mb: 1 }}><ArrowBack /></IconButton>
            <Typography variant="h5" fontWeight={700} sx={{ display: 'inline', ml: 1 }}>
              {categories.find((c) => c.key === selectedCategory)?.name}
            </Typography>
          </Box>
          <Grid container spacing={4} justifyContent="center">
            {filteredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <Card
                  sx={{
                    width: 260,
                    height: 420,
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
                  }}
                >
                  <CardMedia
                    component="img"
                    image={product.image}
                    alt={product.name}
                    sx={{ width: 180, height: 180, objectFit: 'contain', mx: 'auto', bgcolor: 'white', borderRadius: 2, mt: 2, mb: 1 }}
                  />
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 0, width: '100%', minHeight: 140, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#111', fontSize: '1.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" paragraph sx={{ mb: 0.5, color: '#111', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', minHeight: 36 }}>
                      {product.description}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#111', mb: 0.5 }}>
                      Rs. {typeof product.price === 'number' ? product.price.toLocaleString('en-IN') : 'N/A'}
                    </Typography>
                    <Button
                      component={RouterLink}
                      to={`/customize/${product.category}/${product.id}`}
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
        </>
      )}
    </Container>
  );
};

export default Customize; 