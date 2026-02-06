import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../utils/api';
import Button from '../components/UI/Button';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiLock } from 'react-icons/fi';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discount, setDiscount] = useState(null);
  const [validatingDiscount, setValidatingDiscount] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: {
      email: user?.email || '',
      full_name: user?.user_metadata?.full_name || '',
      phone: user?.user_metadata?.phone || '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'India',
      shipping_method: 'standard',
      payment_method: 'stripe',
    }
  });

  const subtotal = getCartTotal();
  const discountAmount = discount?.discount_amount || 0;
  const shippingMethod = watch('shipping_method');
  const shipping = shippingMethod === 'express' ? 150 : (subtotal > 1000 ? 0 : 50);
  const tax = ((subtotal - discountAmount + shipping) * 0.18);
  const total = subtotal - discountAmount + shipping + tax;

  const handleValidateDiscount = async () => {
    if (!discountCode.trim()) {
      toast.error('Please enter a discount code');
      return;
    }

    setValidatingDiscount(true);
    try {
      const { data } = await apiService.validateDiscount(discountCode, subtotal);
      if (data.valid) {
        setDiscount(data.discount);
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid discount code');
      setDiscount(null);
    } finally {
      setValidatingDiscount(false);
    }
  };

  const onSubmit = async (data) => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          customization_details: item.customization_details,
        })),
        shipping_address: {
          full_name: data.full_name,
          phone: data.phone,
          address_line1: data.address_line1,
          address_line2: data.address_line2,
          city: data.city,
          state: data.state,
          postal_code: data.postal_code,
          country: data.country,
        },
        shipping_method: data.shipping_method,
        payment_method: data.payment_method,
        discount_code: discountCode || undefined,
        guest_email: !user ? data.email : undefined,
        guest_name: !user ? data.full_name : undefined,
        guest_phone: !user ? data.phone : undefined,
      };

      const response = await apiService.createOrder(orderData);
      const order = response.data.order;

      // Clear cart
      await clearCart();

      // Redirect to order confirmation
      navigate(`/order-confirmation/${order.order_number}`);
      toast.success('Order placed successfully!');
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container-custom text-center">
          <h1 className="font-playfair text-4xl font-bold text-brown mb-4">
            Your cart is empty
          </h1>
          <Button onClick={() => navigate('/shop')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-cream">
      <div className="container-custom">
        <h1 className="font-playfair text-4xl font-bold text-brown mb-8">
          Checkout
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-veluna shadow-veluna p-6">
                <h2 className="font-playfair text-2xl font-semibold text-brown mb-6">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      {...register('email', { required: 'Email is required' })}
                      className="input-field"
                      disabled={!!user}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-veluna shadow-veluna p-6">
                <h2 className="font-playfair text-2xl font-semibold text-brown mb-6">
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      {...register('full_name', { required: 'Full name is required' })}
                      className="input-field"
                    />
                    {errors.full_name && (
                      <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      {...register('phone', { required: 'Phone number is required' })}
                      className="input-field"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      {...register('address_line1', { required: 'Address is required' })}
                      className="input-field"
                      placeholder="Street address, P.O. box"
                    />
                    {errors.address_line1 && (
                      <p className="text-red-500 text-sm mt-1">{errors.address_line1.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      {...register('address_line2')}
                      className="input-field"
                      placeholder="Apartment, suite, unit, building, floor, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      {...register('city', { required: 'City is required' })}
                      className="input-field"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      {...register('state', { required: 'State is required' })}
                      className="input-field"
                    />
                    {errors.state && (
                      <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      {...register('postal_code', { required: 'Postal code is required' })}
                      className="input-field"
                    />
                    {errors.postal_code && (
                      <p className="text-red-500 text-sm mt-1">{errors.postal_code.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Country *
                    </label>
                    <input
                      type="text"
                      {...register('country', { required: 'Country is required' })}
                      className="input-field"
                    />
                    {errors.country && (
                      <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Method */}
              <div className="bg-white rounded-veluna shadow-veluna p-6">
                <h2 className="font-playfair text-2xl font-semibold text-brown mb-6">
                  Shipping Method
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-beige rounded-lg cursor-pointer hover:border-brown transition-colors">
                    <input
                      type="radio"
                      value="standard"
                      {...register('shipping_method')}
                      className="mr-3"
                    />
                    <div className="flex-grow">
                      <p className="font-medium text-charcoal">Standard Shipping</p>
                      <p className="text-sm text-charcoal-light">5-7 business days</p>
                    </div>
                    <p className="font-semibold text-brown">
                      {subtotal > 1000 ? 'FREE' : '₹50'}
                    </p>
                  </label>

                  <label className="flex items-center p-4 border-2 border-beige rounded-lg cursor-pointer hover:border-brown transition-colors">
                    <input
                      type="radio"
                      value="express"
                      {...register('shipping_method')}
                      className="mr-3"
                    />
                    <div className="flex-grow">
                      <p className="font-medium text-charcoal">Express Shipping</p>
                      <p className="text-sm text-charcoal-light">2-3 business days</p>
                    </div>
                    <p className="font-semibold text-brown">₹150</p>
                  </label>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-veluna shadow-veluna p-6">
                <h2 className="font-playfair text-2xl font-semibold text-brown mb-6">
                  Payment Method
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-beige rounded-lg cursor-pointer hover:border-brown transition-colors">
                    <input
                      type="radio"
                      value="stripe"
                      {...register('payment_method')}
                      className="mr-3"
                    />
                    <div className="flex-grow">
                      <p className="font-medium text-charcoal">Credit/Debit Card</p>
                      <p className="text-sm text-charcoal-light">Secure payment via Stripe</p>
                    </div>
                    <FiLock className="text-green-600" />
                  </label>

                  <label className="flex items-center p-4 border-2 border-beige rounded-lg cursor-pointer hover:border-brown transition-colors">
                    <input
                      type="radio"
                      value="cod"
                      {...register('payment_method')}
                      className="mr-3"
                    />
                    <div className="flex-grow">
                      <p className="font-medium text-charcoal">Cash on Delivery</p>
                      <p className="text-sm text-charcoal-light">Pay when you receive</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-veluna shadow-veluna p-6 sticky top-24">
                <h2 className="font-playfair text-2xl font-semibold text-brown mb-6">
                  Order Summary
                </h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.product?.product_images?.[0]?.image_url || 'https://placehold.co/80x80'}
                        alt={item.product?.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-grow">
                        <p className="text-sm font-medium text-charcoal line-clamp-2">
                          {item.product?.name}
                        </p>
                        <p className="text-sm text-charcoal-light">
                          Qty: {item.quantity} × ₹{item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Discount Code */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Discount Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      className="input-field flex-grow"
                      disabled={!!discount}
                    />
                    <Button
                      type="button"
                      onClick={handleValidateDiscount}
                      loading={validatingDiscount}
                      disabled={!!discount}
                      variant="outline"
                    >
                      Apply
                    </Button>
                  </div>
                  {discount && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ Discount applied: {discount.description}
                    </p>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-charcoal-light">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-charcoal-light">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-charcoal-light">
                    <span>Tax (18% GST)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-beige pt-3">
                    <div className="flex justify-between text-xl font-bold text-brown">
                      <span>Total</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  loading={loading}
                  fullWidth
                  size="lg"
                >
                  Place Order
                </Button>

                <p className="text-xs text-charcoal-light text-center mt-4">
                  By placing your order, you agree to our Terms & Conditions
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
