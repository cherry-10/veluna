import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1602874801006-e24a9ea8f8a7?q=80&w=2000&auto=format&fit=crop"
          alt="Veluna Candles"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-cream/90"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center relative z-10"
      >
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="font-playfair text-5xl md:text-7xl font-bold text-brown mb-4"
        >
          VELUNA
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="font-playfair text-2xl md:text-3xl text-gold mb-8"
        >
          by SKF
        </motion.p>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-charcoal-light font-montserrat text-lg"
        >
          Handcrafted candles & floral creations
        </motion.p>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="text-charcoal-light font-montserrat"
        >
          Made with love, warmth, and soul
        </motion.p>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          onClick={() => navigate('/')}
          className="mt-12 px-8 py-3 bg-brown text-white rounded-veluna hover:bg-brown-dark transition-all duration-300 font-medium"
        >
          Explore Veluna
        </motion.button>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
