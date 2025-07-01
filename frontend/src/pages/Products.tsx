import { DesignServices, Star, Visibility } from '@mui/icons-material';
import {
  Box, Button, Card, CardActions, CardContent,
  CardMedia, Container,
  Grid, Typography, Rating, Stack, Drawer, IconButton, InputBase, Slider, FormControl, InputLabel, Select, MenuItem, Checkbox, FormGroup, FormControlLabel
} from '@mui/material';
import React, { useState } from 'react';
import { Link as RouterLink, useSearchParams, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { products, Product } from '../data/products';

// Only use products with a defined price for filtering, sorting, and min/max calculations
const baseProducts = products.filter(
  (product: any) => typeof product.price === 'number' && product.category !== 'calendars' && product.category !== 'bags'
) as Product[];

const allCategories = [
  { label: 'T-Shirts', value: 'tshirts' },
  { label: 'Mugs', value: 'mugs' },
  { label: 'Phone Cases', value: 'phonecases' },
  { label: 'Water Bottles', value: 'waterbottles' },
  { label: 'Cap', value: 'caps' },
  { label: 'Notebook', value: 'notebooks' },
  { label: 'Pen', value: 'pens' },
  { label: 'Keychain', value: 'keychains' },
  { label: 'Photo Frames', value: 'frames' },
  { label: 'Pillow Cases', value: 'pillowcases' },
];

const minProductPrice = Math.min(...baseProducts.map(p => p.price));
const maxProductPrice = Math.max(...baseProducts.map(p => p.price));

const Products: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const navigate = useNavigate();

  // Filter state
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categoryParam ? [categoryParam] : []);
  const [priceRange, setPriceRange] = useState<number[]>([minProductPrice, maxProductPrice]);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Responsive
  const isMobile = window.innerWidth < 900;

  // Filtering logic
  let filteredProducts = baseProducts.filter(product => {
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesRating = product.rating >= minRating;
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesPrice && matchesRating && matchesSearch;
  });

  // Sorting logic
  if (sortBy === 'priceLowHigh') filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
  if (sortBy === 'priceHighLow') filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
  if (sortBy === 'rating') filteredProducts = filteredProducts.sort((a, b) => b.rating - a.rating);

  // Sidebar content
  const sidebar = (
    <Box sx={{ width: 260, p: 2 }}>
      <Typography variant="h6" fontWeight={700} mb={2}>Filters</Typography>
      {/* Category Filter */}
      <Typography variant="subtitle2" fontWeight={600} mb={1}>Category</Typography>
      <FormGroup>
        {allCategories.map(cat => (
          <FormControlLabel
            key={cat.value}
            control={
              <Checkbox
                checked={selectedCategories.includes(cat.value)}
                onChange={e => {
                  if (e.target.checked) setSelectedCategories([...selectedCategories, cat.value]);
                  else setSelectedCategories(selectedCategories.filter(c => c !== cat.value));
                }}
              />
            }
            label={cat.label}
          />
        ))}
      </FormGroup>
      {/* Price Range Filter */}
      <Typography variant="subtitle2" fontWeight={600} mt={3} mb={1}>Price Range</Typography>
      <Slider
        value={priceRange}
        min={minProductPrice}
        max={maxProductPrice}
        onChange={(_, val) => setPriceRange(val as number[])}
        valueLabelDisplay="auto"
        sx={{ mb: 2 }}
      />
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="body2">Rs. {priceRange[0]}</Typography>
        <Typography variant="body2">Rs. {priceRange[1]}</Typography>
      </Box>
      {/* Rating Filter */}
      <Typography variant="subtitle2" fontWeight={600} mt={2} mb={1}>Minimum Rating</Typography>
      <Slider
        value={minRating}
        min={0}
        max={5}
        step={0.5}
        onChange={(_, val) => setMinRating(val as number)}
        valueLabelDisplay="auto"
        sx={{ mb: 2 }}
      />
    </Box>
  );

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh'}}>
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          align="center"
          sx={{ fontWeight: 900, color: '#111', mb: 6, letterSpacing: '-1px', fontSize: { xs: '2.2rem', md: '2.8rem' } }}
        >
          Browse Products
        </Typography>
        <Grid container spacing={4}>
          {/* Sidebar (desktop) */}
          {!isMobile && (
            <Grid item md={3}>
              {sidebar}
            </Grid>
          )}
          {/* Main content */}
          <Grid item xs={12} md={9}>
            {/* Top bar: search and sort */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3, alignItems: { sm: 'center' }, justifyContent: 'center' }}>
              {isMobile && (
                <IconButton onClick={() => setSidebarOpen(true)} sx={{ mb: { xs: 1, sm: 0 } }}>
                  <MenuIcon />
                </IconButton>
              )}
              <InputBase
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                sx={{ flex: 1, bgcolor: 'grey.100', borderRadius: 2, px: 2, py: 1, fontSize: '1rem', boxShadow: 1 }}
              />
              <FormControl sx={{ minWidth: 160, mx: 'auto' }}>
      
                <Select
                  value={sortBy}
                  displayEmpty
                  onChange={e => setSortBy(e.target.value)}
                  size="small"
                  sx={{
                    minWidth: 160,
                    height: 48,
                    bgcolor: 'grey.100',
                    borderRadius: 2,
                    fontSize: '1rem',
                    boxShadow: 1,
                    border: '1px solid #ccc',
                    '.MuiSelect-select': {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      pl: 2,
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: { textAlign: 'center' }
                    }
                  }}
                >
                  <MenuItem value="" disabled>
                    <span style={{ color: '#888' }}>Sort By</span>
                  </MenuItem>
                  <MenuItem value="priceLowHigh">Price: Low to High</MenuItem>
                  <MenuItem value="priceHighLow">Price: High to Low</MenuItem>
                  <MenuItem value="rating">Rating</MenuItem>
                </Select>
              </FormControl>
            </Box>
            {/* Sidebar drawer (mobile) */}
            <Drawer anchor="left" open={sidebarOpen} onClose={() => setSidebarOpen(false)}>
              {sidebar}
            </Drawer>
            {/* Products grid */}
            <Grid container spacing={4}>
              {filteredProducts.length === 0 ? (
                <Grid item xs={12}>
                  <Typography variant="h6" align="center" color="text.secondary" sx={{ mt: 6 }}>
                    No products found.
                  </Typography>
                </Grid>
              ) : (
                filteredProducts.map((product) => {
                  const mainIdx = 0;
                  return (
                    <Grid item key={product.id} xs={12} sm={6} md={4} lg={4}>
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
                          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ mb: 0.5 }}>
                            <Rating value={product.rating} precision={0.5} readOnly size="small" />
                            <Typography variant="body2" color="text.secondary">
                              ({product.reviews})
                            </Typography>
                          </Stack>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#111', mb: 0.5 }}>
                            Rs. {typeof product.price === 'number' ? product.price.toLocaleString('en-IN') : 'N/A'}
                          </Typography>
                        </CardContent>
                        <CardActions
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 1,
                            width: '100%',
                            px: 0,
                            pb: 2,
                            mt: 'auto',
                          }}
                        >
                          <Button
                            component={RouterLink}
                            to={`/customize/${product.category}`}
                            variant="contained"
                            size="large"
                            onClick={(e) => {
                              const isLoggedIn = localStorage.getItem('giftcraftUser');
                              if (!isLoggedIn) {
                                e.preventDefault();
                                localStorage.setItem('giftcraftPendingProduct', product.category);
                                navigate('/login');
                              }
                            }}
                            sx={{
                              borderRadius: 8,
                              fontWeight: 700,
                              backgroundColor: '#F46A6A',
                              color: 'white',
                              flex: 1,
                              minWidth: 0,
                              minHeight: 44,
                              px: 0,
                              fontSize: { xs: '0.95rem', sm: '0.7rem' },
                              justifyContent: 'center',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              '& .MuiButton-startIcon': {
                                marginRight: 1,
                                '& svg': { fontSize: 22 },
                              },
                              '&:hover': { backgroundColor: '#e05555' },
                            }}
                            startIcon={<DesignServices />}
                          >
                            Customize
                          </Button>
                          <Button
                            component={RouterLink}
                            to={`/products/${product.id}`}
                            variant="outlined"
                            size="large"
                            sx={{
                              borderRadius: 8,
                              fontWeight: 700,
                              borderColor: '#F46A6A',
                              flex: 1,
                              minWidth: 0,
                              minHeight: 44,
                              px: 0,
                              fontSize: { xs: '0.95rem', sm: '0.7rem' },
                              justifyContent: 'center',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              color: '#F46A6A',
                              '& .MuiButton-startIcon': {
                                marginRight: 1,
                                '& svg': { fontSize: 22 },
                              },
                              '&:hover': { borderColor: '#e05555', backgroundColor: 'rgba(244,106,106,0.04)' },
                            }}
                            startIcon={<Visibility />}
                          >
                            View
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  );
                })
              )}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Products; 