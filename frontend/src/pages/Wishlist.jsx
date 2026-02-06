import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../utils/api';
import ProductCard from '../components/Product/ProductCard';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import Button from '../components/UI/Button';
import { FiHeart } from 'react-icons/fi';
import { useEffect } from 'react';

const Wishlist = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: wishlistData, isLoading } = useQuery(
    'wishlist',
    apiService.getWishlist,
    { enabled: !!user }
  );

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return <LoadingSpinner fullScreen />;

  const wishlist = wishlistData?.data?.wishlist || [];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-cream">
      <div className="container-custom">
        <h1 className="font-playfair text-4xl font-bold text-brown mb-8">
          My Wishlist
        </h1>

        {isLoading ? (
          <LoadingSpinner />
        ) : wishlist.length === 0 ? (
          <div className="bg-white rounded-veluna shadow-veluna p-12 text-center">
            <FiHeart className="w-24 h-24 text-beige mx-auto mb-6" />
            <h2 className="font-playfair text-3xl font-semibold text-brown mb-4">
              Your Wishlist is Empty
            </h2>
            <p className="text-charcoal-light mb-8 max-w-md mx-auto">
              Save your favorite products to your wishlist and shop them later!
            </p>
            <Button onClick={() => navigate('/shop')}>
              Start Shopping
            </Button>
          </div>
        ) : (
          <>
            <p className="text-charcoal-light mb-6">
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} in your wishlist
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlist.map((item) => (
                <ProductCard key={item.id} product={item.product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
