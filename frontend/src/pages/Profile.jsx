import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuery } from 'react-query';
import { apiService } from '../utils/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import Button from '../components/UI/Button';
import { FiUser, FiPackage, FiHeart, FiSettings } from 'react-icons/fi';

const Profile = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');

  const { data: ordersData, isLoading: loadingOrders } = useQuery(
    'userOrders',
    apiService.getOrders,
    { enabled: activeTab === 'orders' }
  );

  const { data: customCandlesData, isLoading: loadingCustom } = useQuery(
    'customCandles',
    apiService.getCustomCandles,
    { enabled: activeTab === 'custom' }
  );

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return <LoadingSpinner fullScreen />;

  const orders = ordersData?.data?.orders || [];
  const customRequests = customCandlesData?.data?.requests || [];

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'orders', label: 'Orders', icon: FiPackage },
    { id: 'custom', label: 'Custom Requests', icon: FiHeart },
    { id: 'settings', label: 'Settings', icon: FiSettings },
  ];

  return (
    <div className="min-h-screen pt-32 pb-16 bg-cream">
      <div className="container-custom">
        <div className="text-center mb-12">
          <p className="font-dancing text-3xl text-gold mb-2">Welcome Back</p>
          <h1 className="font-cormorant text-5xl font-light text-brown italic">
            My Account
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 border border-beige">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-gold/20 to-brown/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiUser className="w-12 h-12 text-brown" />
                </div>
                <h2 className="font-cormorant text-xl font-medium text-charcoal">
                  {user.user_metadata?.full_name || user.email}
                </h2>
                <p className="text-sm text-charcoal-light font-montserrat">{user.email}</p>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-montserrat text-sm ${
                        activeTab === tab.id
                          ? 'bg-brown text-white shadow-md'
                          : 'text-charcoal hover:bg-cream border border-transparent hover:border-beige'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-6 pt-6 border-t border-beige">
                <button
                  onClick={signOut}
                  className="w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-montserrat text-sm font-medium"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-lg p-8 border border-beige">
                <h2 className="font-cormorant text-3xl font-light text-brown mb-8 italic">
                  Profile Information
                </h2>
                <div className="space-y-6">
                  <div className="pb-4 border-b border-beige">
                    <label className="block text-sm font-montserrat font-medium text-charcoal-light mb-2">
                      Full Name
                    </label>
                    <p className="font-cormorant text-lg text-charcoal">
                      {user.user_metadata?.full_name || 'Not provided'}
                    </p>
                  </div>
                  <div className="pb-4 border-b border-beige">
                    <label className="block text-sm font-montserrat font-medium text-charcoal-light mb-2">
                      Email
                    </label>
                    <p className="font-cormorant text-lg text-charcoal">{user.email}</p>
                  </div>
                  <div className="pb-4 border-b border-beige">
                    <label className="block text-sm font-montserrat font-medium text-charcoal-light mb-2">
                      Phone
                    </label>
                    <p className="font-cormorant text-lg text-charcoal">
                      {user.user_metadata?.phone || 'Not provided'}
                    </p>
                  </div>
                  <div className="pb-4">
                    <label className="block text-sm font-montserrat font-medium text-charcoal-light mb-2">
                      Member Since
                    </label>
                    <p className="font-cormorant text-lg text-charcoal">
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg shadow-lg p-8 border border-beige">
                <h2 className="font-cormorant text-3xl font-light text-brown mb-8 italic">
                  Order History
                </h2>
                {loadingOrders ? (
                  <LoadingSpinner />
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <FiPackage className="w-16 h-16 text-beige mx-auto mb-4" />
                    <p className="text-charcoal-light mb-4">No orders yet</p>
                    <Button onClick={() => navigate('/shop')}>
                      Start Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-beige rounded-lg p-6 hover:shadow-veluna transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-charcoal mb-1">
                              Order #{order.order_number}
                            </h3>
                            <p className="text-sm text-charcoal-light">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            order.status === 'delivered'
                              ? 'bg-green-100 text-green-700'
                              : order.status === 'shipped'
                              ? 'bg-blue-100 text-blue-700'
                              : order.status === 'cancelled'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-charcoal-light">
                              {order.items?.length || 0} items
                            </p>
                            <p className="text-lg font-bold text-brown">
                              ₹{order.total_amount}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/order-confirmation/${order.order_number}`)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Custom Requests Tab */}
            {activeTab === 'custom' && (
              <div className="bg-white rounded-veluna shadow-veluna p-8">
                <h2 className="font-playfair text-2xl font-semibold text-brown mb-6">
                  Custom Candle Requests
                </h2>
                {loadingCustom ? (
                  <LoadingSpinner />
                ) : customRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <FiHeart className="w-16 h-16 text-beige mx-auto mb-4" />
                    <p className="text-charcoal-light mb-4">No custom requests yet</p>
                    <Button onClick={() => navigate('/customize')}>
                      Create Custom Candle
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {customRequests.map((request) => (
                      <div
                        key={request.id}
                        className="border border-beige rounded-lg p-6"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-charcoal mb-1">
                              Request #{request.request_number}
                            </h3>
                            <p className="text-sm text-charcoal-light">
                              {new Date(request.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            request.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : request.status === 'in_production'
                              ? 'bg-blue-100 text-blue-700'
                              : request.status === 'cancelled'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {request.status.replace('_', ' ').charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-charcoal-light">Jar Size</p>
                            <p className="font-medium text-charcoal">{request.jar_size}</p>
                          </div>
                          <div>
                            <p className="text-charcoal-light">Jar Type</p>
                            <p className="font-medium text-charcoal">{request.jar_type}</p>
                          </div>
                          <div>
                            <p className="text-charcoal-light">Fragrance</p>
                            <p className="font-medium text-charcoal">{request.fragrance || 'Unscented'}</p>
                          </div>
                          <div>
                            <p className="text-charcoal-light">Quantity</p>
                            <p className="font-medium text-charcoal">{request.quantity}</p>
                          </div>
                        </div>
                        {request.estimated_price && (
                          <p className="mt-4 text-lg font-bold text-brown">
                            Estimated: ₹{request.estimated_price}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-veluna shadow-veluna p-8">
                <h2 className="font-playfair text-2xl font-semibold text-brown mb-6">
                  Account Settings
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-charcoal mb-4">Change Password</h3>
                    <Button variant="outline">
                      Update Password
                    </Button>
                  </div>
                  <div className="pt-6 border-t border-beige">
                    <h3 className="font-semibold text-charcoal mb-4">Email Preferences</h3>
                    <label className="flex items-center gap-3 mb-3">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-charcoal-light">
                        Receive order updates and notifications
                      </span>
                    </label>
                    <label className="flex items-center gap-3 mb-3">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-charcoal-light">
                        Receive promotional emails and special offers
                      </span>
                    </label>
                  </div>
                  <div className="pt-6 border-t border-beige">
                    <h3 className="font-semibold text-red-600 mb-4">Danger Zone</h3>
                    <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
