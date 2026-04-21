import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCart as fetchCart } from '../services/api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartSummary, setCartSummary] = useState({
    itemCount: 0,
    subtotal: '0.00',
    discount: '0.00',
    deliveryCharges: '0.00',
    totalAmount: '0.00',
  });
  const [loading, setLoading] = useState(false);

  const loadCart = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchCart();
      setCartItems(response.data.items);
      setCartSummary(response.data.summary);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  return (
    <CartContext.Provider
      value={{ cartItems, cartSummary, loading, refreshCart: loadCart }}
    >
      {children}
    </CartContext.Provider>
  );
};