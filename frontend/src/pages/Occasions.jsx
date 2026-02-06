import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { apiService } from '../utils/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { motion } from 'framer-motion';

const Occasions = () => {
  const { data: occasionsData, isLoading } = useQuery(
    'occasions',
    apiService.getOccasions
  );

  const occasions = occasionsData?.data?.occasions || [];

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-dancing text-4xl text-gold mb-4">Celebrate Life</p>
          <h1 className="font-cormorant text-5xl md:text-6xl font-light text-brown mb-6 italic">
            Shop by Occasion
          </h1>
          <p className="font-cormorant text-xl text-charcoal-light max-w-3xl mx-auto">
            Find the perfect gift for every special moment. Our handcrafted candles 
            and floral creations are designed to make your celebrations memorable.
          </p>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {occasions.map((occasion, index) => (
              <motion.div
                key={occasion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/occasions/${occasion.slug}`}
                  className="group block"
                >
                  <div className="relative overflow-hidden rounded-lg shadow-xl hover:shadow-2xl transition-all duration-500 aspect-[4/3]">
                    <img
                      src={occasion.image_url || `https://images.unsplash.com/photo-1602874801006-e24a9ea8f8a7?q=80&w=800&auto=format&fit=crop`}
                      alt={occasion.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brown/90 via-brown/40 to-transparent flex flex-col justify-end p-8">
                      <h2 className="font-cormorant text-3xl md:text-4xl font-light text-white mb-3 italic">
                        {occasion.name}
                      </h2>
                      {occasion.description && (
                        <p className="font-cormorant text-white/90 line-clamp-2 mb-4">
                          {occasion.description}
                        </p>
                      )}
                      <span className="inline-flex items-center gap-2 text-white font-montserrat text-sm tracking-wider uppercase group-hover:gap-4 transition-all">
                        Explore <span>→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-20 relative overflow-hidden rounded-lg p-16 text-center">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1200&auto=format&fit=crop"
              alt="Custom Candles"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-cream/95"></div>
          </div>
          <div className="relative z-10">
            <p className="font-dancing text-3xl text-gold mb-4">Make It Personal</p>
            <h2 className="font-cormorant text-4xl md:text-5xl font-light text-brown mb-6 italic">
              Can't Find What You're Looking For?
            </h2>
            <p className="font-cormorant text-lg text-charcoal-light mb-8 max-w-2xl mx-auto">
              Create a custom candle tailored to your special occasion. Choose your 
              fragrance, color, and design to make it truly unique.
            </p>
            <Link
              to="/customize"
              className="inline-block px-10 py-4 bg-brown text-white rounded-full hover:bg-brown-dark transition-all duration-300 font-montserrat text-sm tracking-wider uppercase shadow-lg hover:shadow-xl"
            >
              Customize Your Candle
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Occasions;
