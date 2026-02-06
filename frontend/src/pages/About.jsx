import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen pt-32 pb-16">
      {/* Hero */}
      <section className="relative py-40 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=2000&auto=format&fit=crop"
            alt="Our Story"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-cream/95 via-cream/90 to-cream/95"></div>
        </div>
        <div className="container-custom text-center relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-dancing text-4xl text-gold mb-4"
          >
            Welcome to
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-cormorant text-6xl md:text-7xl font-light text-brown mb-6 italic"
          >
            Our Story
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-cormorant text-2xl text-charcoal-light max-w-3xl mx-auto italic"
          >
            Created from a passion for fragrances and the warmth of a cozy home
          </motion.p>
        </div>
      </section>

      {/* Story Content */}
      <section className="container-custom py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1602874801006-e04b6bacd1e5?q=80&w=800&auto=format&fit=crop"
              alt="Handcrafted Candles"
              className="rounded-lg shadow-2xl"
            />
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gold/10 rounded-lg -z-10"></div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="font-dancing text-3xl text-gold mb-4">The Beginning</p>
            <h3 className="font-cormorant text-4xl font-light text-brown mb-6 italic">Born from Passion</h3>
            <p className="font-cormorant text-lg text-charcoal-light leading-relaxed mb-6">
              VELUNA by SKF was born from a love for calm evenings, warm light, and beautiful scents.
              What started as a personal passion for creating the perfect ambiance at home has blossomed
              into a brand dedicated to bringing that same warmth and beauty into your space.
            </p>
            <p className="font-cormorant text-lg text-charcoal-light leading-relaxed">
              Every candle we create is hand-poured with care, using premium soy wax and carefully
              selected fragrances that evoke emotion and create lasting memories.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="bg-beige/30 py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <p className="font-dancing text-3xl text-gold mb-4">Our Craft</p>
              <h3 className="font-cormorant text-4xl font-light text-brown mb-6 italic">Handcrafted Excellence</h3>
              <p className="font-cormorant text-lg text-charcoal-light leading-relaxed mb-6">
                Our floral creations are thoughtfully designed to complement our candles, creating a
                complete sensory experience that transforms any room into a sanctuary of elegance.
              </p>
              <p className="font-cormorant text-lg text-charcoal-light leading-relaxed">
                We believe that the small moments matter—the flicker of a candle, the scent that brings
                back memories, the beauty of fresh flowers. VELUNA is our way of helping you create those
                moments, every single day.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative order-1 lg:order-2"
            >
              <img
                src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop"
                alt="Handcrafted Excellence"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -top-6 -left-6 w-48 h-48 bg-brown/10 rounded-lg -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-20">
        <div className="container-custom">
          <div className="text-center mb-16">
            <p className="font-dancing text-3xl text-gold mb-2">What We Stand For</p>
            <h2 className="font-cormorant text-5xl font-light text-brown italic">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center p-8 bg-cream/50 rounded-lg border border-beige hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="font-cormorant text-2xl font-medium text-brown mb-4 italic">
                Premium Quality
              </h3>
              <p className="font-cormorant text-charcoal-light">
                We use only the finest ingredients and materials to create products that exceed expectations.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center p-8 bg-cream/50 rounded-lg border border-beige hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🌿</span>
              </div>
              <h3 className="font-cormorant text-2xl font-medium text-brown mb-4 italic">
                Sustainability
              </h3>
              <p className="font-cormorant text-charcoal-light">
                Our commitment to the environment is reflected in our eco-friendly practices and materials.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center p-8 bg-cream/50 rounded-lg border border-beige hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🎨</span>
              </div>
              <h3 className="font-cormorant text-2xl font-medium text-brown mb-4 italic">
                Artisan Craftsmanship
              </h3>
              <p className="font-cormorant text-charcoal-light">
                Every product is handcrafted with attention to detail and a dedication to excellence.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=2000&auto=format&fit=crop"
            alt="Join Us"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-brown/80"></div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container-custom text-center relative z-10"
        >
          <p className="font-dancing text-4xl text-gold mb-4">Begin Your Journey</p>
          <h2 className="font-cormorant text-5xl md:text-6xl font-light text-white mb-6 italic">
            Experience VELUNA
          </h2>
          <p className="font-cormorant text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Discover the warmth and beauty of handcrafted elegance. Explore our collection and find your perfect scent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/shop"
              className="inline-block px-10 py-4 bg-white text-brown rounded-full hover:bg-cream transition-all duration-300 font-montserrat text-sm tracking-wider uppercase shadow-xl"
            >
              Shop Collection
            </Link>
            <Link
              to="/contact"
              className="inline-block px-10 py-4 border-2 border-white text-white rounded-full hover:bg-white hover:text-brown transition-all duration-300 font-montserrat text-sm tracking-wider uppercase"
            >
              Get in Touch
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default About;
