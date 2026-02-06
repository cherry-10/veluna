import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { apiService } from '../utils/api';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

const CartContext = createContext({});

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  // Get or create session ID for guest users
  useEffect(() => {
    if (!user) {
      let guestSessionId = localStorage.getItem('guestSessionId');
      if (!guestSessionId) {
        guestSessionId = uuidv4();
        localStorage.setItem('guestSessionId', guestSessionId);
      }
      setSessionId(guestSessionId);
    }
  }, [user]);

  // Fetch cart on mount and when user changes
  useEffect(() => {
    if (user || sessionId) {
      fetchCart();
    }
  }, [user, sessionId]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await apiService.getCart(sessionId);
      setCart(data.cart || []);
    } catch (error) {
      console.error('Fetch cart error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1, customization = null) => {
    try {
      const cartData = {
        product_id: product.id,
        quantity,
        customization_details: customization,
        session_id: sessionId,
      };

      await apiService.addToCart(cartData);
      await fetchCart();
      toast.success('Added to cart!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
      return false;
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      await apiService.updateCartItem(cartItemId, { quantity });
      await fetchCart();
      return true;
    } catch (error) {
      toast.error('Failed to update quantity');
      return false;
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      await apiService.removeFromCart(cartItemId);
      await fetchCart();
      toast.success('Removed from cart');
      return true;
    } catch (error) {
      toast.error('Failed to remove item');
      return false;
    }
  };

  const clearCart = async () => {
    try {
      await apiService.clearCart(sessionId);
      setCart([]);
      toast.success('Cart cleared');
      return true;
    } catch (error) {
      toast.error('Failed to clear cart');
      return false;
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCart,
    getCartTotal,
    getCartCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
