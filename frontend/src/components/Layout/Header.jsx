import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiShoppingCart, FiUser, FiHeart, FiSearch } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Occasions', path: '/occasions' },
    { name: 'Customize', path: '/customize' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-sm py-4' : 'bg-white py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between">
          {/* Left Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 flex-1">
            <Link to="/" className="text-charcoal hover:text-brown transition-colors text-sm">
              Home
            </Link>
            <Link to="/shop" className="text-charcoal hover:text-brown transition-colors text-sm">
              Shop
            </Link>
            <Link to="/occasions" className="text-charcoal hover:text-brown transition-colors text-sm">
              Occasions
            </Link>
          </nav>

          {/* Center Logo */}
          <Link to="/" className="flex flex-col items-center">
            <h1 className="font-playfair text-3xl font-normal text-brown tracking-wide">
              Veluna
            </h1>
            <span className="text-xs text-gold tracking-[0.2em]">by SKF</span>
          </Link>

          {/* Right Navigation + Icons */}
          <div className="hidden lg:flex items-center space-x-8 flex-1 justify-end">
            <Link to="/customize" className="text-charcoal hover:text-brown transition-colors text-sm">
              Customize
            </Link>
            <Link to="/about" className="text-charcoal hover:text-brown transition-colors text-sm">
              About
            </Link>
            <Link to="/contact" className="text-charcoal hover:text-brown transition-colors text-sm">
              Contact
            </Link>
            
            <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-beige">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-charcoal hover:text-brown transition-colors"
                aria-label="Search"
              >
                <FiSearch className="w-[18px] h-[18px]" />
              </button>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative text-charcoal hover:text-brown transition-colors"
                aria-label="Cart"
              >
                <FiShoppingCart className="w-[18px] h-[18px]" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brown text-white text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </Link>

              {/* User/Login */}
              {user ? (
                <div className="relative group">
                  <button className="text-charcoal hover:text-brown transition-colors">
                    <FiUser className="w-[18px] h-[18px]" />
                  </button>
                  <div className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-beige">
                    <Link
                      to="/profile"
                      className="block px-4 py-2.5 text-sm text-charcoal hover:bg-cream transition-colors"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/profile?tab=orders"
                      className="block px-4 py-2.5 text-sm text-charcoal hover:bg-cream transition-colors"
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/wishlist"
                      className="block px-4 py-2.5 text-sm text-charcoal hover:bg-cream transition-colors"
                    >
                      Wishlist
                    </Link>
                    <div className="border-t border-beige my-1"></div>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2.5 text-sm text-charcoal hover:bg-cream transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-5 py-2 bg-brown text-white text-sm rounded-full hover:bg-brown-dark transition-colors"
                >
                  <FiUser className="w-3.5 h-3.5" />
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-charcoal hover:text-brown transition-colors"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-6 overflow-hidden"
            >
              <input
                type="search"
                placeholder="Search products..."
                className="w-full px-4 py-3 border border-beige rounded-lg focus:outline-none focus:ring-1 focus:ring-brown text-sm"
                autoFocus
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden mt-6 py-4 border-t border-beige"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 text-charcoal hover:text-brown transition-colors text-sm"
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center gap-4 mt-6 pt-4 border-t border-beige">
                <Link
                  to="/cart"
                  className="flex items-center gap-2 text-charcoal hover:text-brown transition-colors text-sm"
                >
                  <FiShoppingCart className="w-4 h-4" />
                  Cart {getCartCount() > 0 && `(${getCartCount()})`}
                </Link>
                {!user && (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="ml-auto px-5 py-2 bg-brown text-white text-sm rounded-full hover:bg-brown-dark transition-colors"
                  >
                    Login
                  </Link>
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
