import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { apiService } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ProductCard from '../components/Product/ProductCard';
import Button from '../components/UI/Button';
import { FiHeart, FiMinus, FiPlus, FiStar, FiShare2 } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('details');

  const { data: productData, isLoading } = useQuery(
    ['product', slug],
    () => apiService.getProduct(slug)
  );

  const product = productData?.data?.product;

  const { data: relatedData } = useQuery(
    ['relatedProducts', product?.id],
    () => apiService.getRelatedProducts(product?.id),
    { enabled: !!product?.id }
  );

  const { data: reviewsData } = useQuery(
    ['reviews', product?.id],
    () => apiService.getProductReviews(product?.id, { limit: 10 }),
    { enabled: !!product?.id }
  );

  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product, quantity);
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      toast.error('Please login to add to wishlist');
      return;
    }
    try {
      await apiService.addToWishlist(product.id);
      toast.success('Added to wishlist');
    } catch (error) {
      toast.error('Failed to add to wishlist');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.short_description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (!product) return <div className="pt-24 text-center">Product not found</div>;

  const images = product.images || [];
  const reviews = reviewsData?.data?.reviews || [];
  const relatedProducts = relatedData?.data?.products || [];

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container-custom">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <Link to="/" className="text-charcoal-light hover:text-brown">Home</Link>
          <span className="mx-2 text-charcoal-light">/</span>
          <Link to="/shop" className="text-charcoal-light hover:text-brown">Shop</Link>
          <span className="mx-2 text-charcoal-light">/</span>
          <span className="text-brown">{product.name}</span>
        </nav>

        {/* Product Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div>
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square bg-beige rounded-veluna overflow-hidden mb-4"
            >
              <img
                src={images[selectedImage]?.image_url || 'https://placehold.co/800x800/F7F3EE/8B5E3C?text=Product'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-brown' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image.image_url}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="font-playfair text-4xl font-bold text-brown mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            {product.avg_rating > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.avg_rating)
                          ? 'fill-gold text-gold'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-charcoal-light">
                  {product.avg_rating} ({product.review_count} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-6">
              {product.original_price && product.original_price > product.price && (
                <span className="text-2xl text-gray-400 line-through">
                  ₹{product.original_price}
                </span>
              )}
              <span className="text-4xl font-bold text-brown">
                ₹{product.price}
              </span>
              {product.is_on_sale && (
                <span className="badge-sale">
                  Save {Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-lg text-charcoal-light mb-6">
              {product.short_description}
            </p>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock_quantity > 0 ? (
                <p className="text-green-600 font-medium">
                  In Stock ({product.stock_quantity} available)
                </p>
              ) : (
                <p className="text-red-600 font-medium">Out of Stock</p>
              )}
            </div>

            {/* Quantity Selector */}
            {product.stock_quantity > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-beige rounded-veluna">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-beige transition-colors"
                    >
                      <FiMinus />
                    </button>
                    <span className="px-6 font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                      className="p-3 hover:bg-beige transition-colors"
                    >
                      <FiPlus />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
                fullWidth
                size="lg"
              >
                Add to Cart
              </Button>
              <button
                onClick={handleWishlistToggle}
                className="p-4 border-2 border-brown text-brown rounded-veluna hover:bg-brown hover:text-white transition-colors"
                aria-label="Add to wishlist"
              >
                <FiHeart className="w-6 h-6" />
              </button>
              <button
                onClick={handleShare}
                className="p-4 border-2 border-brown text-brown rounded-veluna hover:bg-brown hover:text-white transition-colors"
                aria-label="Share"
              >
                <FiShare2 className="w-6 h-6" />
              </button>
            </div>

            {/* Key Features */}
            {product.fragrance_notes && (
              <div className="bg-beige rounded-veluna p-4 mb-6">
                <h3 className="font-semibold text-charcoal mb-2">Fragrance Notes</h3>
                <p className="text-charcoal-light">{product.fragrance_notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-16">
          <div className="border-b border-beige mb-6">
            <div className="flex gap-8">
              {['details', 'ingredients', 'care', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? 'text-brown border-b-2 border-brown'
                      : 'text-charcoal-light hover:text-brown'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="prose max-w-none">
            {activeTab === 'details' && (
              <div>
                <h3 className="font-playfair text-2xl font-semibold text-brown mb-4">
                  Product Details
                </h3>
                <p className="text-charcoal-light whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div>
                <h3 className="font-playfair text-2xl font-semibold text-brown mb-4">
                  Ingredients
                </h3>
                <p className="text-charcoal-light whitespace-pre-line">
                  {product.ingredients || 'Natural soy wax, premium fragrances, cotton wick'}
                </p>
              </div>
            )}

            {activeTab === 'care' && (
              <div>
                <h3 className="font-playfair text-2xl font-semibold text-brown mb-4">
                  Care Instructions
                </h3>
                <p className="text-charcoal-light whitespace-pre-line">
                  {product.care_instructions || 'Trim wick to 1/4 inch before each use. Burn for 2-3 hours at a time. Keep away from drafts.'}
                </p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className="font-playfair text-2xl font-semibold text-brown mb-4">
                  Customer Reviews
                </h3>
                {reviews.length === 0 ? (
                  <p className="text-charcoal-light">No reviews yet. Be the first to review!</p>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-beige pb-6">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <FiStar
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? 'fill-gold text-gold' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-medium">{review.reviewer_name}</span>
                          {review.is_verified_purchase && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        {review.title && (
                          <h4 className="font-semibold mb-2">{review.title}</h4>
                        )}
                        <p className="text-charcoal-light">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="section-title">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
