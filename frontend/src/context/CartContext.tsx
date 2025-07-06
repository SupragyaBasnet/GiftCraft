import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { products, Product } from '../data/products';

interface CartItem {
  customization: any;
  customizationId: any;
  id: string; // product id
  cartItemId: string; // cart item id
  name: string;
  price: number;
  quantity: number;
  image: string;
  category?: string;
  description?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  // Fetch cart from backend
  const fetchCart = async () => {
    if (!user) return setCartItems([]);
    const token = localStorage.getItem('giftcraftToken');
    const res = await fetch('/api/auth/cart', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      console.log('Raw cart data from backend:', data);
      setCartItems(
        data.map((item: any) => {
          // If item.product exists, it's a normal product; else, it's a custom item
          if (item.product) {
            // Try to get image from backend, else from products array by _id, else by name+category, else fallback
            let image = item.product.image;
            let price = item.product.price;
            let localProduct = products.find((p: Product) => String(p.id) === String(item.product._id));
            if ((!image || typeof image !== 'string') && !localProduct) {
              // Try by name+category
              localProduct = products.find((p: Product) => p.name === item.product.name && p.category === item.product.category);
            }
            if (!image && localProduct) {
              image = localProduct.image;
            }
            if ((typeof price !== 'number' || isNaN(price)) && localProduct) {
              price = localProduct.price;
            }
            if (!image) {
              image = '/placeholder.png';
            }
            if (typeof price !== 'number' || isNaN(price)) {
              price = 0;
              console.warn('Cart item has missing price:', item.product);
            }
            
            return {
              id: item.product._id,
              cartItemId: item._id || item.customizationId,
              name: item.product.name,
              price,
              image,
              quantity: typeof item.product.quantity === 'number' && item.product.quantity > 0 ? item.product.quantity : 1,
              category: item.product.category,
              description: item.product.description,
            };
          } else {
            // Customization item
            return {
              id: item.customizationId,
              cartItemId: item.customizationId,
              name: item.category ? `Custom ${item.category.charAt(0).toUpperCase() + item.category.slice(1)}` : 'Custom Product',
              price: item.price,
              image: item.image || '/placeholder.png',
              quantity: item.quantity,
              category: item.category,
              description: 'Customized product',
            };
          }
        })
      );
      console.log('Cart items after fetchCart:', data);
    } else {
      setCartItems([]);
    }
  };

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line
  }, [user]);

  const addToCart = async (item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    const token = localStorage.getItem('giftcraftToken');
    let productId = item.id;
    let cartItemId;
    // If not a valid ObjectId, treat as customization
    if (!/^[a-fA-F0-9]{24}$/.test(productId)) {
      // Customization: use customizationId as cartItemId
      cartItemId = item.customizationId;
    } else {
      // Normal product: use productId-Date.now()
      cartItemId = `${productId}-${Date.now()}`;
    }
    
    console.log('[addToCart] Adding item:', item, 'with quantity:', quantity);
    
    // If not a valid ObjectId, call add-or-get endpoint
    if (!/^[a-fA-F0-9]{24}$/.test(productId)) {
      console.log('[addToCart] Product ID is not a valid ObjectId, calling add-or-get endpoint');
      const res = await fetch('/api/products/add-or-get', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: item.name,
          price: item.price,
          image: item.image,
          category: item.category || '',
          description: item.description || '',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        productId = data._id;
        console.log('[addToCart] Got product ID from add-or-get:', productId);
      } else {
        console.error('[addToCart] Failed to add or get product');
        throw new Error('Failed to add or get product');
      }
    }
    
    console.log('[addToCart] Sending to cart with productId:', productId);
    
    const res = await fetch('/api/auth/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ product: productId, quantity }),
    });
    
    if (res.ok) {
      console.log('[addToCart] Successfully added to cart, fetching updated cart');
      await fetchCart();
    } else {
      const errorData = await res.json().catch(() => ({}));
      console.error('[addToCart] Failed to add to cart:', res.status, errorData);
      throw new Error('Failed to add to cart');
    }
  };

  const removeFromCart = async (id: string) => {
    const token = localStorage.getItem('giftcraftToken');
    const res = await fetch('/api/auth/cart', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ product: id }),
    });
    if (res.ok) {
      await fetchCart();
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    // Enforce min/max
    const newQuantity = Math.max(1, Math.min(10, quantity));
    console.log('Calling updateQuantity for id:', id, 'quantity:', newQuantity);
    const token = localStorage.getItem('giftcraftToken');
    const res = await fetch('/api/auth/cart', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ product: id, quantity: newQuantity }),
    });
    if (res.ok) {
      console.log('updateQuantity success, fetching cart...');
      await fetchCart();
    } else {
      const errorData = await res.json().catch(() => ({}));
      console.error('updateQuantity failed:', res.status, errorData);
    }
  };

  const clearCart = async () => {
    const token = localStorage.getItem('giftcraftToken');
    const res = await fetch('/api/auth/cart/clear', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
    setCartItems([]);
    }
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 