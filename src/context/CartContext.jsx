import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

import API_URL from '../config';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('luxegem_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('luxegem_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('luxegem_token'));
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    localStorage.setItem('luxegem_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('luxegem_token', token);
    } else {
      localStorage.removeItem('luxegem_token');
    }
    if (user) {
      localStorage.setItem('luxegem_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('luxegem_user');
    }
  }, [token, user]);

  const addToCart = (product, quantity = 1, ringSize = null) => {
    setCart((prev) => {
      const cartKey = ringSize ? `${product._id}-${ringSize}` : product._id;
      const existing = prev.find((item) => {
        const itemKey = item.ringSize ? `${item._id}-${item.ringSize}` : item._id;
        return itemKey === cartKey;
      });
      if (existing) {
        return prev.map((item) => {
          const itemKey = item.ringSize ? `${item._id}-${item.ringSize}` : item._id;
          return itemKey === cartKey ? { ...item, quantity: item.quantity + quantity } : item;
        });
      }
      return [...prev, { ...product, quantity, ringSize }];
    });
    showNotification(`${product.name} added to cart!`);
  };

  const removeFromCart = (productId, ringSize = null) => {
    setCart((prev) => prev.filter((item) => {
      const itemKey = item.ringSize ? `${item._id}-${item.ringSize}` : item._id;
      const removeKey = ringSize ? `${productId}-${ringSize}` : productId;
      return itemKey !== removeKey;
    }));
  };

  const updateQuantity = (productId, quantity, ringSize = null) => {
    if (quantity < 1) return removeFromCart(productId, ringSize);
    setCart((prev) =>
      prev.map((item) => {
        const itemKey = item.ringSize ? `${item._id}-${item.ringSize}` : item._id;
        const updateKey = ringSize ? `${productId}-${ringSize}` : productId;
        return itemKey === updateKey ? { ...item, quantity } : item;
      })
    );
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const getShipping = () => getCartTotal() >= 50 ? 0 : 9.99;

  const getGrandTotal = () => getCartTotal() + getShipping();

  const getCartCount = () =>
    cart.reduce((count, item) => count + item.quantity, 0);

  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/auth/login`, { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await axios.post(`${API_URL}/auth/register`, { name, email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('luxegem_token');
    localStorage.removeItem('luxegem_user');
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <CartContext.Provider
      value={{
        cart, addToCart, removeFromCart, updateQuantity, clearCart,
        getCartTotal, getCartCount, getShipping, getGrandTotal, user, token, login, register, logout,
        notification,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
