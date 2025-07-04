import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface CartItem {
  id: string; // product id
  cartItemId: string; // cart item id
  name: string;
  price: number;
  quantity: number;
  image: string;
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
        data.map((item: any) => ({
          id: item.product._id,
          cartItemId: item._id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.image,
          quantity: item.quantity,
        }))
      );
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
    // If not a valid ObjectId, call add-or-get endpoint
    if (!/^[a-fA-F0-9]{24}$/.test(productId)) {
      const res = await fetch('/api/products/add-or-get', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: item.name,
          price: item.price,
          image: item.image,
          category: (item as any).category || '',
          description: (item as any).description || '',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        productId = data._id;
      } else {
        throw new Error('Failed to add or get product');
      }
    }
    const res = await fetch('/api/auth/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ product: productId, quantity }),
    });
    if (res.ok) {
      await fetchCart();
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
    const token = localStorage.getItem('giftcraftToken');
    const res = await fetch('/api/auth/cart', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ product: id, quantity }),
    });
    if (res.ok) {
      await fetchCart();
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