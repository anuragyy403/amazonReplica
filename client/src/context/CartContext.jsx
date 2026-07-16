import { createContext, useState, useContext } from 'react';
import API from '../api/axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);

  const fetchCart = async () => {
    try {
      const res = await API.get('/cart');
      setCart(res.data);
    } catch (err) {
      console.error('Failed to fetch cart:', err.message);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    const res = await API.post('/cart', { productId, quantity });
    setCart(res.data);
  };

  const updateCartItem = async (productId, quantity) => {
    const res = await API.put(`/cart/${productId}`, { quantity });
    setCart(res.data);
  };

  const removeFromCart = async (productId) => {
    const res = await API.delete(`/cart/${productId}`);
    setCart(res.data);
  };

  return (
    <CartContext.Provider value={{ cart, fetchCart, addToCart, updateCartItem, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);