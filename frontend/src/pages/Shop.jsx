import { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { apiService } from '../utils/api';
import ProductCard from '../components/Product/ProductCard';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { FiFilter, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { category } = useParams();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: category || searchParams.get('category') || '',
    subcategory: searchParams.get('subcategory') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    sort: searchParams.get('sort') || 'created_at',
    order: searchParams.get('order') || 'desc',
    search: searchParams.get('search') || '',
  });

  const { data: categories } = useQuery('categories', apiService.getCategories);

  const { data: productsData, isLoading } = useQuery(
    ['products', filters],
    () => apiService.getProducts(filters),
    { keepPreviousData: true }
  );

  useEffect(() => {
    const params = {};
    Object.keys(filters).forEach(key => {
      if (filters[key]) params[key] = filters[key];
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      subcategory: '',
      min_price: '',
      max_price: '',
      sort: 'created_at',
      order: 'desc',
      search: '',
    });
  };

  const products = productsData?.data?.products || [];

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-playfair text-4xl font-bold text-brown mb-4">
            {category ? category.replace('-', ' ').toUpperCase() : 'All Products'}
          </h1>
          <p className="text-charcoal-light">
            Discover our handcrafted candles and floral creations
          </p>
        </div>

        <div className="flex gap-8">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden fixed bottom-6 right-6 z-40 p-4 bg-brown text-white rounded-full shadow-veluna-lg"
          >
            {showFilters ? <FiX className="w-6 h-6" /> : <FiFilter className="w-6 h-6" />}
          </button>

          {/* Filters Sidebar */}
          <AnimatePresence>
            {(showFilters || window.innerWidth >= 1024) && (
              <motion.aside
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                className="fixed lg:sticky top-24 left-0 h-[calc(100vh-6rem)] w-80 bg-white p-6 shadow-veluna-lg lg:shadow-none overflow-y-auto z-30 lg:z-0"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-playfair text-2xl font-semibold text-brown">Filters</h2>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-brown hover:text-brown-dark"
                  >
                    Clear All
                  </button>
                </div>

                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Search
                  </label>
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    placeholder="Search products..."
                    className="input-field"
                  />
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="input-field"
                  >
                    <option value="">All Categories</option>
                    {categories?.data?.categories?.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Price Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={filters.min_price}
                      onChange={(e) => handleFilterChange('min_price', e.target.value)}
                      placeholder="Min"
                      className="input-field"
                    />
                    <input
                      type="number"
                      value={filters.max_price}
                      onChange={(e) => handleFilterChange('max_price', e.target.value)}
                      placeholder="Max"
                      className="input-field"
                    />
                  </div>
                </div>

                {/* Sort */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Sort By
                  </label>
                  <select
                    value={`${filters.sort}-${filters.order}`}
                    onChange={(e) => {
                      const [sort, order] = e.target.value.split('-');
                      setFilters(prev => ({ ...prev, sort, order }));
                    }}
                    className="input-field"
                  >
                    <option value="created_at-desc">Newest First</option>
                    <option value="created_at-asc">Oldest First</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                  </select>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Results Info */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-charcoal-light">
                {isLoading ? 'Loading...' : `${products.length} products found`}
              </p>
            </div>

            {/* Products */}
            {isLoading ? (
              <LoadingSpinner />
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl text-charcoal-light mb-4">No products found</p>
                <button
                  onClick={clearFilters}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
