import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import Button from '../components/UI/Button';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { motion } from 'framer-motion';

const Cart = () => {
  const { cart, loading, updateQuantity, removeFromCart, getCartTotal, getCartCount } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateQuantity(itemId, newQuantity);
  };

  const handleRemove = async (itemId) => {
    if (window.confirm('Remove this item from cart?')) {
      await removeFromCart(itemId);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) return <LoadingSpinner fullScreen />;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-16">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center py-16">
            <FiShoppingBag className="w-24 h-24 mx-auto text-beige mb-6" />
            <h1 className="font-playfair text-4xl font-bold text-brown mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-charcoal-light mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link to="/shop" className="btn-primary">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const shipping = subtotal > 1000 ? 0 : 50;
  const tax = (subtotal + shipping) * 0.18;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen pt-32 pb-16 bg-cream">
      <div className="container-custom">
        <h1 className="font-playfair text-4xl font-bold text-brown mb-8">
          Shopping Cart ({getCartCount()} items)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="bg-white rounded-veluna shadow-veluna p-6"
              >
                <div className="flex gap-6">
                  {/* Image */}
                  <Link
                    to={`/product/${item.product?.slug}`}
                    className="flex-shrink-0"
                  >
                    <img
                      src={item.product?.product_images?.[0]?.image_url || 'https://placehold.co/200x200/F7F3EE/8B5E3C?text=Product'}
                      alt={item.product?.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-grow">
                    <Link
                      to={`/product/${item.product?.slug}`}
                      className="font-semibold text-charcoal hover:text-brown transition-colors mb-2 block"
                    >
                      {item.product?.name}
                    </Link>

                    {item.customization_details && (
                      <p className="text-sm text-charcoal-light mb-2">
                        Custom: {JSON.stringify(item.customization_details)}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-beige rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-beige transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <FiMinus className="w-4 h-4" />
                        </button>
                        <span className="px-4 font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-beige transition-colors"
                          disabled={item.quantity >= item.product?.stock_quantity}
                        >
                          <FiPlus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-lg font-bold text-brown">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-charcoal-light">
                          ₹{item.price} each
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Remove item"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-veluna shadow-veluna p-6 sticky top-24">
              <h2 className="font-playfair text-2xl font-semibold text-brown mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-charcoal-light">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-charcoal-light">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
                </div>
                {shipping === 0 && (
                  <p className="text-sm text-green-600">
                    🎉 You've qualified for free shipping!
                  </p>
                )}
                {subtotal < 1000 && (
                  <p className="text-sm text-charcoal-light">
                    Add ₹{(1000 - subtotal).toFixed(2)} more for free shipping
                  </p>
                )}
                <div className="flex justify-between text-charcoal-light">
                  <span>Tax (18% GST)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-beige pt-4">
                  <div className="flex justify-between text-xl font-bold text-brown">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                fullWidth
                size="lg"
                className="mb-4"
              >
                Proceed to Checkout
              </Button>

              <Link
                to="/shop"
                className="block text-center text-brown hover:text-brown-dark transition-colors"
              >
                Continue Shopping
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-beige">
                <div className="flex items-center gap-2 text-sm text-charcoal-light mb-2">
                  <span>✓</span>
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-charcoal-light mb-2">
                  <span>✓</span>
                  <span>Free Shipping on orders over ₹1000</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-charcoal-light">
                  <span>✓</span>
                  <span>Handcrafted with Love</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
