const LoadingSpinner = ({ fullScreen = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-cream/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-center">
          <div className={`spinner mx-auto ${sizeClasses.lg}`}></div>
          <p className="mt-4 text-brown font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center p-8">
      <div className={`spinner ${sizeClasses[size]}`}></div>
    </div>
  );
};

export default LoadingSpinner;
