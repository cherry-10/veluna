import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { apiService } from '../utils/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { FiCheckCircle, FiPackage, FiTruck } from 'react-icons/fi';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

const OrderConfirmation = () => {
  const { orderNumber } = useParams();

  const { data: orderData, isLoading } = useQuery(
    ['order', orderNumber],
    () => apiService.getOrder(orderNumber)
  );

  useEffect(() => {
    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  if (isLoading) return <LoadingSpinner fullScreen />;

  const order = orderData?.data?.order;

  if (!order) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container-custom text-center">
          <h1 className="font-playfair text-4xl font-bold text-brown mb-4">
            Order Not Found
          </h1>
          <Link to="/shop" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-cream">
      <div className="container-custom max-w-4xl">
        {/* Success Header */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center mb-12"
        >
          <FiCheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
          <h1 className="font-playfair text-5xl font-bold text-brown mb-4">
            Order Confirmed!
          </h1>
          <p className="text-xl text-charcoal-light mb-2">
            Thank you for your order
          </p>
          <p className="text-lg text-charcoal-light">
            Order Number: <span className="font-semibold text-brown">{order.order_number}</span>
          </p>
        </motion.div>

        {/* Order Details */}
        <div className="bg-white rounded-veluna shadow-veluna p-8 mb-8">
          <h2 className="font-playfair text-2xl font-semibold text-brown mb-6">
            Order Details
          </h2>

          {/* Order Items */}
          <div className="space-y-4 mb-6">
            {order.items?.map((item) => (
              <div key={item.id} className="flex gap-4 pb-4 border-b border-beige last:border-0">
                <div className="flex-grow">
                  <p className="font-medium text-charcoal">{item.product_name}</p>
                  <p className="text-sm text-charcoal-light">
                    Quantity: {item.quantity} × ₹{item.unit_price}
                  </p>
                </div>
                <p className="font-semibold text-brown">
                  ₹{item.total_price}
                </p>
              </div>
            ))}
          </div>

          {/* Price Summary */}
          <div className="space-y-2 pt-4 border-t border-beige">
            <div className="flex justify-between text-charcoal-light">
              <span>Subtotal</span>
              <span>₹{order.subtotal}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{order.discount_amount}</span>
              </div>
            )}
            <div className="flex justify-between text-charcoal-light">
              <span>Shipping</span>
              <span>₹{order.shipping_cost}</span>
            </div>
            <div className="flex justify-between text-charcoal-light">
              <span>Tax</span>
              <span>₹{order.tax_amount}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-brown pt-2 border-t border-beige">
              <span>Total</span>
              <span>₹{order.total_amount}</span>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="bg-white rounded-veluna shadow-veluna p-8 mb-8">
          <h2 className="font-playfair text-2xl font-semibold text-brown mb-6">
            Shipping Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-charcoal mb-2">Shipping Address</h3>
              <p className="text-charcoal-light">
                {order.shipping_address.full_name}<br />
                {order.shipping_address.address_line1}<br />
                {order.shipping_address.address_line2 && (
                  <>{order.shipping_address.address_line2}<br /></>
                )}
                {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}<br />
                {order.shipping_address.country}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-charcoal mb-2">Shipping Method</h3>
              <p className="text-charcoal-light capitalize">
                {order.shipping_method?.replace('_', ' ')} Shipping
              </p>
              {order.estimated_delivery_date && (
                <p className="text-sm text-charcoal-light mt-2">
                  Estimated Delivery: {new Date(order.estimated_delivery_date).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-beige rounded-veluna p-8 mb-8">
          <h2 className="font-playfair text-2xl font-semibold text-brown mb-6">
            What's Next?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <FiCheckCircle className="w-12 h-12 text-brown mx-auto mb-3" />
              <h3 className="font-semibold text-charcoal mb-2">Order Confirmed</h3>
              <p className="text-sm text-charcoal-light">
                You'll receive a confirmation email shortly
              </p>
            </div>
            <div className="text-center">
              <FiPackage className="w-12 h-12 text-brown mx-auto mb-3" />
              <h3 className="font-semibold text-charcoal mb-2">Preparing Your Order</h3>
              <p className="text-sm text-charcoal-light">
                We're handcrafting your items with love
              </p>
            </div>
            <div className="text-center">
              <FiTruck className="w-12 h-12 text-brown mx-auto mb-3" />
              <h3 className="font-semibold text-charcoal mb-2">On Its Way</h3>
              <p className="text-sm text-charcoal-light">
                Track your order from your profile
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/profile?tab=orders" className="btn-primary text-center">
            View Order Status
          </Link>
          <Link to="/shop" className="btn-outline text-center">
            Continue Shopping
          </Link>
        </div>

        {/* Email Confirmation Note */}
        <p className="text-center text-charcoal-light mt-8">
          A confirmation email has been sent to{' '}
          <span className="font-medium text-charcoal">
            {order.guest_email || 'your email'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default OrderConfirmation;
