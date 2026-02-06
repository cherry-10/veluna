import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../utils/api';
import toast from 'react-hot-toast';
import { useState } from 'react';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    setAddingToCart(true);
    const success = await addToCart(product, 1);
    setAddingToCart(false);
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to add to wishlist');
      return;
    }

    try {
      if (isInWishlist) {
        await apiService.removeFromWishlistByProduct(product.id);
        setIsInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        await apiService.addToWishlist(product.id);
        setIsInWishlist(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  const primaryImage = product.images?.find(img => img.is_primary)?.image_url || 
                       product.product_images?.[0]?.image_url ||
                       product.image_url ||
                       'https://placehold.co/400x400/F7F3EE/8B5E3C?text=Product';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="product-card group"
    >
      <Link to={`/product/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-beige">
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.is_on_sale && (
              <span className="badge-sale">Sale</span>
            )}
            {product.is_new && (
              <span className="badge-new">New</span>
            )}
            {product.is_featured && (
              <span className="badge-featured">Featured</span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleWishlistToggle}
              className="p-2 bg-white rounded-full shadow-veluna hover:bg-brown hover:text-white transition-colors"
              aria-label="Add to wishlist"
            >
              <FiHeart className={isInWishlist ? 'fill-current' : ''} />
            </button>
          </div>

          {/* Stock Status */}
          {product.stock_quantity === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white px-4 py-2 rounded-veluna font-semibold text-charcoal">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-charcoal mb-2 line-clamp-2 group-hover:text-brown transition-colors">
            {product.name}
          </h3>
          
          {product.short_description && (
            <p className="text-sm text-charcoal-light mb-3 line-clamp-2">
              {product.short_description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              {product.original_price && product.original_price > product.price && (
                <span className="text-sm text-gray-400 line-through">
                  ₹{product.original_price}
                </span>
              )}
              <span className="text-lg font-bold text-brown">
                ₹{product.price}
              </span>
            </div>

            {product.stock_quantity > 0 && (
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="p-2 bg-brown text-white rounded-full hover:bg-brown-dark transition-colors disabled:opacity-50"
                aria-label="Add to cart"
              >
                <FiShoppingCart className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
