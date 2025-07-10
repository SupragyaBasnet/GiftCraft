import { Add, Remove } from "@mui/icons-material";
import BrushIcon from '@mui/icons-material/Brush';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import FormatShapesIcon from '@mui/icons-material/FormatShapes';
import ImageIcon from '@mui/icons-material/Image';
import RedoIcon from '@mui/icons-material/Redo';
import SaveIcon from '@mui/icons-material/Save';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import UndoIcon from '@mui/icons-material/Undo';
import {
  Box, Button, Container, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, Slider, Tooltip, Typography
} from '@mui/material';
import { fabric } from 'fabric';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import planewhiteframe from '../assets/planewhiteframe.jpg';
import planewhitemug from '../assets/planewhitemug.jpg';
import planewhiteshirt from '../assets/planewhiteshirt.webp';
import { products } from '../data/products';

const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
type Tool = 'brush' | 'text' | 'image' | 'shape' | 'delete' | 'select' | '';

const CustomizeProduct: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool>('');
  const [brushColor, setBrushColor] = useState<string>('#F46A6A');
  const [brushSize, setBrushSize] = useState<number>(8);
  const [productColor, setProductColor] = useState<string>('#fff');
  const [shirtSize, setShirtSize] = useState<string>('M');
  const [productType, setProductType] = useState<'tshirt' | 'mug' | 'frame'>('tshirt');
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === Number(id));
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const productImages: Record<string, string> = {
    tshirt: planewhiteshirt,
    mug: planewhitemug,
    frame: planewhiteframe,
  };

  useEffect(() => {
    if (canvasRef.current) {
      fabricRef.current = new fabric.Canvas(canvasRef.current, {
        width: 400,
        height: 500,
        backgroundColor: 'transparent',
        selection: true,
      });
    }
    return () => {
      fabricRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (!fabricRef.current) return;
    const overlay = fabricRef.current.getObjects('rect').find((obj: fabric.Object) => obj.get('data') === 'productColor');
    if (overlay) fabricRef.current.remove(overlay);
    const rect = new fabric.Rect({
      left: 0, top: 0, width: 400, height: 500,
      fill: productColor,
      opacity: 0.25,
      selectable: false,
      evented: false,
      excludeFromExport: true
    });
    rect.set('data', 'productColor');
    fabricRef.current.insertAt(rect as fabric.Object, 0);
    fabricRef.current.renderAll();
  }, [productColor]);

  useEffect(() => {
    if (!fabricRef.current) return;
    fabricRef.current.isDrawingMode = selectedTool === 'brush';
    if (fabricRef.current.freeDrawingBrush) {
      fabricRef.current.freeDrawingBrush.color = brushColor;
      fabricRef.current.freeDrawingBrush.width = brushSize;
    }
  }, [selectedTool, brushColor, brushSize]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !fabricRef.current) return;
    const reader = new FileReader();
    reader.onload = (f) => {
      fabric.Image.fromURL(f.target?.result as string, (img: fabric.Image) => {
        img.set({ left: 100, top: 100, scaleX: 0.3, scaleY: 0.3 });
        fabricRef.current?.add(img);
        fabricRef.current?.setActiveObject(img);
      });
    };
    reader.readAsDataURL(file);
  };

  const handleAddToCart = () => {
    console.log("Added to cart:", { id, text, image, quantity });
    navigate('/cart');
  };

  const handleBuyNow = () => {
    // Build the customized item object for any customize product
    const customItem = {
      customizationId: customizationId || Date.now().toString(),
      category,
      productType,
      type: selectedType,
      size: productType === 'notebook'
        ? selectedNotebookSize
        : productType === 'tshirt'
        ? selectedTshirtSize
        : productType === 'waterbottle'
        ? selectedWaterBottleSize
        : undefined,
      color,
      elements,
      image: currentImage,
      quantity,
      price: calculateCustomizationPrice(basePrice, productType, {
        customizationId,
        category,
        productType,
        type: selectedType,
        size: productType === 'notebook'
          ? selectedNotebookSize
          : productType === 'tshirt'
          ? selectedTshirtSize
          : productType === 'waterbottle'
          ? selectedWaterBottleSize
          : undefined,
        color,
        elements,
        image: currentImage,
      }),
      total: calculateCustomizationPrice(basePrice, productType, {
        customizationId,
        category,
        productType,
        type: selectedType,
        size: productType === 'notebook'
          ? selectedNotebookSize
          : productType === 'tshirt'
          ? selectedTshirtSize
          : productType === 'waterbottle'
          ? selectedWaterBottleSize
          : undefined,
        color,
        elements,
        image: currentImage,
      }) * quantity,
    };
    navigate(`/checkout?singleItemId=${customItem.customizationId}`, {
      state: { items: [customItem] }
    });
  };

  const handleQuantityChange = (amount: number) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Typography variant="h3" align="center" fontWeight={900} gutterBottom>
        Customize Your Product
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Size</InputLabel>
              <Select value={shirtSize} label="Size" onChange={e => setShirtSize(e.target.value)}>
                {sizes.map((size) => (
                  <MenuItem key={size} value={size}>{size}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Product</InputLabel>
              <Select value={productType} label="Product" onChange={e => setProductType(e.target.value as 'tshirt' | 'mug' | 'frame')}>
                <MenuItem value="tshirt">T-Shirt</MenuItem>
                <MenuItem value="mug">Mug</MenuItem>
                <MenuItem value="frame">Frame</MenuItem>
              </Select>
            </FormControl>
            <Box>
              <Typography variant="subtitle1" gutterBottom>Quantity</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton onClick={() => handleQuantityChange(-1)} size="small">
                  <Remove />
                </IconButton>
                <Typography variant="h6">{quantity}</Typography>
                <IconButton onClick={() => handleQuantityChange(1)} size="small">
                  <Add />
                </IconButton>
              </Box>
            </Box>
            <Box>
              <Typography variant="body2" gutterBottom>Product Color</Typography>
              <input type="color" value={productColor} onChange={e => setProductColor(e.target.value)} style={{ width: 36, height: 36, border: 'none', background: 'none' }} />
            </Box>
            <Button variant="outlined" component="label">
              Upload Image
              <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
            </Button>
            {selectedTool === 'brush' && (
              <>
                <Typography variant="body2">Brush</Typography>
                <input type="color" value={brushColor} onChange={e => setBrushColor(e.target.value)} style={{ width: 36, height: 36 }} />
                <Slider min={1} max={40} value={brushSize} onChange={(_, v) => setBrushSize(Number(v))} />
              </>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'relative', width: '100%', height: 500, mx: 'auto' }}>
            <img
              src={productImages[productType]}
              alt="product"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: 500,
                zIndex: 1,
                pointerEvents: 'none',
                borderRadius: 8,
              }}
            />
            <canvas
              ref={canvasRef}
              width={400}
              height={500}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: 500,
                zIndex: 2,
                borderRadius: 8,
                border: '2px solid #eee',
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Tooltip title="Brush"><IconButton color={selectedTool === 'brush' ? 'primary' : 'default'} onClick={() => setSelectedTool('brush')}><BrushIcon /></IconButton></Tooltip>
            <Tooltip title="Text"><IconButton color={selectedTool === 'text' ? 'primary' : 'default'} onClick={() => setSelectedTool('text')}><TextFieldsIcon /></IconButton></Tooltip>
            <Tooltip title="Image"><IconButton color={selectedTool === 'image' ? 'primary' : 'default'} onClick={() => setSelectedTool('image')}><ImageIcon /></IconButton></Tooltip>
            <Tooltip title="Shape"><IconButton color={selectedTool === 'shape' ? 'primary' : 'default'} onClick={() => setSelectedTool('shape')}><FormatShapesIcon /></IconButton></Tooltip>
            <Tooltip title="Delete"><IconButton color={selectedTool === 'delete' ? 'primary' : 'default'} onClick={() => setSelectedTool('delete')}><DeleteIcon /></IconButton></Tooltip>
            <Tooltip title="Undo"><IconButton><UndoIcon /></IconButton></Tooltip>
            <Tooltip title="Redo"><IconButton><RedoIcon /></IconButton></Tooltip>
            <Tooltip title="Clear"><IconButton><ClearIcon /></IconButton></Tooltip>
            <Tooltip title="Save"><IconButton><SaveIcon /></IconButton></Tooltip>
          </Paper>
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleAddToCart}
            sx={{ mt: 2, fontWeight: 700, px: 3, py: 1.35, borderRadius: 7, width: 200, borderColor: 'rgb(255,106,106)', color: 'rgb(255,106,106)', '&:hover': { borderColor: 'rgb(255,100,100)', backgroundColor: 'rgba(220,80,80,0.04)' } }}
          >
            Add to Cart
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleBuyNow}
            sx={{ mt: 2, fontWeight: 700, borderRadius: 7, px: 3, py: 1.35, width: 200, backgroundColor: 'rgb(255,106,106)', '&:hover': { backgroundColor: 'rgb(220,80,80)' } }}
          >
            Buy Now
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CustomizeProduct;
