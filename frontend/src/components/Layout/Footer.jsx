import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiMail } from 'react-icons/fi';
import { useState } from 'react';
import { apiService } from '../../utils/api';
import toast from 'react-hot-toast';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      await apiService.subscribeNewsletter({ email });
      toast.success('Successfully subscribed to newsletter!');
      setEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Subscription failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-white border-t border-beige mt-20">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-playfair text-2xl font-bold text-brown mb-4">
              VELUNA <span className="text-gold">by SKF</span>
            </h3>
            <p className="text-charcoal-light mb-4">
              Handcrafted candles & floral creations made with love, warmth, and soul.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com/velunaskf"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-beige hover:bg-brown hover:text-white rounded-full transition-colors"
                aria-label="Instagram"
              >
                <FiInstagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com/velunaskf"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-beige hover:bg-brown hover:text-white rounded-full transition-colors"
                aria-label="Facebook"
              >
                <FiFacebook className="w-5 h-5" />
              </a>
              <a
                href="mailto:hello@velunaskf.com"
                className="p-2 bg-beige hover:bg-brown hover:text-white rounded-full transition-colors"
                aria-label="Email"
              >
                <FiMail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-playfair text-lg font-semibold text-brown mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="text-charcoal-light hover:text-brown transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/occasions" className="text-charcoal-light hover:text-brown transition-colors">
                  Occasions
                </Link>
              </li>
              <li>
                <Link to="/customize" className="text-charcoal-light hover:text-brown transition-colors">
                  Customize Candle
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-charcoal-light hover:text-brown transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-charcoal-light hover:text-brown transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-playfair text-lg font-semibold text-brown mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/shipping" className="text-charcoal-light hover:text-brown transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-charcoal-light hover:text-brown transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-charcoal-light hover:text-brown transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-charcoal-light hover:text-brown transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-charcoal-light hover:text-brown transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-playfair text-lg font-semibold text-brown mb-4">Stay Connected</h4>
            <p className="text-charcoal-light mb-4">
              Subscribe to receive updates, special offers, and inspiration.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full px-4 py-2 border border-beige rounded-veluna focus:outline-none focus:ring-2 focus:ring-brown"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-beige text-center text-charcoal-light">
          <p>&copy; {new Date().getFullYear()} VELUNA by SKF. All rights reserved.</p>
          <p className="mt-2 text-sm">
            Made with ❤️ for creating warmth and beauty in every home
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
