import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { apiService } from '../utils/api';
import ProductCard from '../components/Product/ProductCard';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const OccasionProducts = () => {
  const { slug } = useParams();

  const { data: occasionData, isLoading } = useQuery(
    ['occasion', slug],
    () => apiService.getOccasion(slug)
  );

  const occasion = occasionData?.data?.occasion;
  const products = occasion?.products || [];

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (!occasion) return <div className="pt-24 text-center">Occasion not found</div>;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container-custom">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <Link to="/" className="text-charcoal-light hover:text-brown">Home</Link>
          <span className="mx-2 text-charcoal-light">/</span>
          <Link to="/occasions" className="text-charcoal-light hover:text-brown">Occasions</Link>
          <span className="mx-2 text-charcoal-light">/</span>
          <span className="text-brown">{occasion.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="font-playfair text-5xl font-bold text-brown mb-4">
            {occasion.name}
          </h1>
          {occasion.description && (
            <p className="text-xl text-charcoal-light max-w-3xl">
              {occasion.description}
            </p>
          )}
        </div>

        {/* Products */}
        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-charcoal-light mb-6">
              No products available for this occasion yet.
            </p>
            <Link to="/shop" className="btn-primary">
              Browse All Products
            </Link>
          </div>
        ) : (
          <>
            <p className="text-charcoal-light mb-6">
              {products.length} products found
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OccasionProducts;
