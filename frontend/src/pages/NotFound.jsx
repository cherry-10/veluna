import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="text-center">
        <h1 className="font-playfair text-9xl font-bold text-brown mb-4">404</h1>
        <h2 className="font-playfair text-3xl font-semibold text-charcoal mb-4">
          Page Not Found
        </h2>
        <p className="text-charcoal-light mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brown text-white rounded-veluna hover:bg-brown-dark transition-colors"
        >
          <FiHome />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
