import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import Layout from './components/Layout/Layout';
import LoadingSpinner from './components/UI/LoadingSpinner';
import ScrollToTop from './components/UI/ScrollToTop';

// Lazy load pages
const SplashScreen = lazy(() => import('./pages/SplashScreen'));
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Occasions = lazy(() => import('./pages/Occasions'));
const OccasionProducts = lazy(() => import('./pages/OccasionProducts'));
const CustomizeCandle = lazy(() => import('./pages/CustomizeCandle'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Admin = lazy(() => import('./pages/Admin'));

function App() {
  useEffect(() => {
    // Check if splash screen has been shown
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    if (!hasSeenSplash) {
      sessionStorage.setItem('hasSeenSplash', 'true');
    }
  }, []);

  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <Routes>
          {/* Splash Screen */}
          <Route path="/splash" element={<SplashScreen />} />

          {/* Main Layout Routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:category" element={<Shop />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/occasions" element={<Occasions />} />
            <Route path="/occasions/:slug" element={<OccasionProducts />} />
            <Route path="/customize" element={<CustomizeCandle />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmation />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
