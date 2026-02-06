import axios from 'axios';
import { supabase } from '../config/supabase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      supabase.auth.signOut();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API methods
export const apiService = {
  // Products
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (slug) => api.get(`/products/${slug}`),
  getFeaturedProducts: () => api.get('/products/featured/list'),
  getBestsellers: () => api.get('/products/bestsellers/list'),
  getRelatedProducts: (id) => api.get(`/products/${id}/related`),

  // Categories
  getCategories: () => api.get('/categories'),
  getCategory: (slug) => api.get(`/categories/${slug}`),
  getSubcategories: (categoryId) => api.get(`/categories/${categoryId}/subcategories`),

  // Occasions
  getOccasions: () => api.get('/occasions'),
  getOccasion: (slug) => api.get(`/occasions/${slug}`),

  // Cart
  getCart: (sessionId) => api.get('/cart', { params: { session_id: sessionId } }),
  addToCart: (data) => api.post('/cart', data),
  updateCartItem: (id, data) => api.put(`/cart/${id}`, data),
  removeFromCart: (id) => api.delete(`/cart/${id}`),
  clearCart: (sessionId) => api.delete('/cart', { params: { session_id: sessionId } }),

  // Orders
  createOrder: (data) => api.post('/orders', data),
  getOrders: () => api.get('/orders'),
  getOrder: (orderNumber) => api.get(`/orders/${orderNumber}`),

  // Custom Candles
  createCustomCandle: (data) => api.post('/custom-candles', data),
  getCustomCandles: () => api.get('/custom-candles'),
  getCustomCandle: (requestNumber) => api.get(`/custom-candles/${requestNumber}`),

  // Reviews
  getProductReviews: (productId, params) => api.get(`/reviews/product/${productId}`, { params }),
  createReview: (data) => api.post('/reviews', data),
  markReviewHelpful: (id) => api.post(`/reviews/${id}/helpful`),

  // Contact
  submitContactForm: (data) => api.post('/contact', data),

  // Wishlist
  getWishlist: () => api.get('/wishlist'),
  addToWishlist: (productId) => api.post('/wishlist', { product_id: productId }),
  removeFromWishlist: (id) => api.delete(`/wishlist/${id}`),
  removeFromWishlistByProduct: (productId) => api.delete(`/wishlist/product/${productId}`),

  // Discounts
  validateDiscount: (code, orderAmount) => api.post('/discounts/validate', { code, order_amount: orderAmount }),
  getActiveDiscounts: () => api.get('/discounts/active'),

  // Newsletter
  subscribeNewsletter: (data) => api.post('/newsletter/subscribe', data),
  unsubscribeNewsletter: (email) => api.post('/newsletter/unsubscribe', { email }),

  // Payment
  createPaymentIntent: (data) => api.post('/payment/create-intent', data),
  confirmPayment: (data) => api.post('/payment/confirm', data),
};

export default api;
