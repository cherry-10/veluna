import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { apiService } from '../utils/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { FiArrowRight } from 'react-icons/fi';

const Home = () => {
  const { data: featuredProducts, isLoading: loadingFeatured } = useQuery(
    'featuredProducts',
    apiService.getFeaturedProducts
  );

  const { data: bestsellers, isLoading: loadingBestsellers } = useQuery(
    'bestsellers',
    apiService.getBestsellers
  );

  const { data: categories } = useQuery('categories', apiService.getCategories);

  useEffect(() => {
    // Check if user should see splash screen
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    if (!hasSeenSplash) {
      window.location.href = '/splash';
    }
  }, []);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://static.vecteezy.com/system/resources/thumbnails/037/348/916/small/ai-generated-two-candles-with-blossom-flower-on-table-with-bokeh-free-photo.jpg"
            alt="Luxury handcrafted candles with flowers"
            className="w-full h-full object-cover object-center"
            loading="eager"
            onError={(e) => {e.target.src='https://images.unsplash.com/photo-1602874801006-e24a9ea8f8a7?w=2000&h=1200&fit=crop&auto=format&q=95'}}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/35 to-black/20"></div>
        </div>

        <div className="container-custom relative z-10 text-left md:text-center px-6 md:px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="font-dancing text-3xl md:text-4xl text-gold mb-4 drop-shadow-lg">
              Discover Luxury
            </p>
            <h1 className="font-cormorant text-5xl md:text-7xl lg:text-8xl font-light text-white mb-4 tracking-wide italic drop-shadow-2xl">
              Handcrafted Elegance
            </h1>
            <h2 className="font-playfair text-xl md:text-2xl lg:text-3xl font-light text-cream mb-6 tracking-widest uppercase drop-shadow-lg">
              Candles & Floral Creations
            </h2>
            <p className="font-cormorant text-xl md:text-2xl text-white/90 mb-10 italic max-w-3xl mx-auto drop-shadow-lg">
              Where artistry meets fragrance, crafted with love, warmth, and soul
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link
                to="/shop"
                className="inline-block px-12 py-5 bg-brown text-white rounded-full hover:bg-brown-dark hover:scale-105 transition-all duration-300 font-montserrat text-sm tracking-wider uppercase shadow-2xl hover:shadow-3xl"
              >
                Explore Collection
              </Link>
              <Link
                to="/customize"
                className="inline-block px-12 py-5 border-2 border-white text-white rounded-full hover:bg-white hover:text-brown transition-all duration-300 font-montserrat text-sm tracking-wider uppercase shadow-xl"
              >
                Custom Orders
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Entry Buttons */}
      <section className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/shop?category=candles" className="group relative overflow-hidden rounded-veluna shadow-veluna hover:shadow-veluna-lg transition-all duration-300 h-56">
            <img
              src="/images/card1.png"
              alt="Handcrafted Candles"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {e.target.src='https://images.unsplash.com/photo-1602874801006-e24a9ea8f8a7?w=1400&h=600&fit=crop&auto=format&q=95'}}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col items-center justify-center">
              <h3 className="font-playfair text-3xl font-semibold text-white mb-2">Handcrafted Candles</h3>
              <p className="text-white/90">Explore our collection</p>
            </div>
          </Link>
          <Link to="/shop?category=flowers" className="group relative overflow-hidden rounded-veluna shadow-veluna hover:shadow-veluna-lg transition-all duration-300 h-56">
            <img
              src="/images/card2.png"
              alt="Floral Creations"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {e.target.src='https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1400&h=600&fit=crop&auto=format&q=95'}}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col items-center justify-center">
              <h3 className="font-playfair text-3xl font-semibold text-white mb-2">Floral Creations</h3>
              <p className="text-white/90">Beautiful arrangements</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container-custom py-12">
        <div className="text-center mb-8">
          <p className="font-dancing text-3xl text-gold mb-2">Explore</p>
          <h2 className="font-cormorant text-4xl md:text-5xl font-light text-brown italic">Our Collections</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Link to="/shop?category=jar-candles" className="group">
            <div className="relative overflow-hidden rounded-veluna shadow-veluna hover:shadow-veluna-lg transition-all duration-300 aspect-square">
              <img
                src="/images/jar.png"
                alt="Luxury Jar Candles"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {e.target.src='https://images.unsplash.com/photo-1602874801006-e24a9ea8f8a7?w=600&h=600&fit=crop&auto=format&q=90'}}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center p-4">
                <h3 className="font-playfair text-xl font-semibold text-white">Jar Candles</h3>
              </div>
            </div>
          </Link>

          <Link to="/shop?category=flower-candles" className="group">
            <div className="relative overflow-hidden rounded-veluna shadow-veluna hover:shadow-veluna-lg transition-all duration-300 aspect-square">
              <img
                src="/images/Flowercandles.png"
                alt="Floral Decorated Candles"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {e.target.src='https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=600&fit=crop&auto=format&q=90'}}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center p-4">
                <h3 className="font-playfair text-xl font-semibold text-white">Flower Candles</h3>
              </div>
            </div>
          </Link>

          <Link to="/shop?category=pillar-candles" className="group">
            <div className="relative overflow-hidden rounded-veluna shadow-veluna hover:shadow-veluna-lg transition-all duration-300 aspect-square">
              <img
                src="/images/Pillarcandles.png"
                alt="Elegant Pillar Candles"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {e.target.src='https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&h=600&fit=crop&auto=format&q=90'}}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center p-4">
                <h3 className="font-playfair text-xl font-semibold text-white">Pillar Candles</h3>
              </div>
            </div>
          </Link>

          <Link to="/shop?category=gift-sets" className="group">
            <div className="relative overflow-hidden rounded-veluna shadow-veluna hover:shadow-veluna-lg transition-all duration-300 aspect-square">
              <img
                src="/images/giftsets.png"
                alt="Luxury Candle Gift Sets"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {e.target.src='https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&h=600&fit=crop&auto=format&q=90'}}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center p-4">
                <h3 className="font-playfair text-xl font-semibold text-white">Gift Sets</h3>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="bg-white py-12">
        <div className="container-custom">
          <div className="text-center mb-8">
            <p className="font-dancing text-3xl text-gold mb-2">Bestsellers</p>
            <h2 className="font-cormorant text-4xl md:text-5xl font-light text-brown italic">Customer Favorites</h2>
          </div>
          {loadingBestsellers ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestsellers?.data?.slice(0, 4).map((product) => (
                <Link key={product.id} to={`/product/${product.slug}`} className="product-card">
                  <div className="aspect-square overflow-hidden bg-cream">
                    <img
                      src={product.primary_image || 'https://images.unsplash.com/photo-1602874801006-e04b6bacd1e5?w=500&h=500&fit=crop&auto=format&q=90'}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      onError={(e) => {e.target.src='https://images.unsplash.com/photo-1602874801006-e04b6bacd1e5?w=500&h=500&fit=crop&auto=format&q=90'}}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-charcoal mb-2">{product.name}</h3>
                    <p className="text-xs text-charcoal-light mb-2">{product.short_description || 'Handcrafted with care'}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        {product.original_price && (
                          <span className="text-sm text-gray-400 line-through mr-2">₹{product.original_price}</span>
                        )}
                        <span className="text-lg font-bold text-brown">₹{product.price}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Brand Story Teaser */}
      <section className="bg-beige py-16">
        <div className="container-custom text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-brown mb-6">
              Our Story
            </h2>
            <p className="text-lg text-charcoal-light mb-8 leading-relaxed">
              Created from a passion for fragrances and the warmth of a cozy home. 
              Every candle and floral creation is handcrafted with love, bringing 
              beauty and comfort to your special moments.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-brown font-medium hover:text-gold transition-colors group"
            >
              Discover Veluna
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
