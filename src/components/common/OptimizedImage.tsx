
import React, { useState, useEffect, memo } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  loading?: 'lazy' | 'eager';
  placeholder?: string;
  sizes?: string;
  onClick?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  loading = 'lazy',
  placeholder = '',
  sizes,
  onClick
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  // Notify service worker to cache this image
  useEffect(() => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_NEW_IMAGE',
        url: src
      });
    }
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
  };

  // Create srcSet for responsive images if it's a local image
  const isLocalImage = src.startsWith('/');
  
  return (
    <div 
      className={`relative overflow-hidden ${isLoaded ? '' : 'bg-gray-200 animate-pulse'}`} 
      style={{ width, height }}
      onClick={onClick}
    >
      {!isLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-dawg border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      <img
        src={error ? placeholder || '/placeholder.svg' : src}
        alt={alt}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        width={typeof width === 'number' ? width : undefined}
        height={typeof height === 'number' ? height : undefined}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        sizes={sizes}
        style={{
          objectFit: 'cover',
          width: width !== undefined ? '100%' : undefined,
          height: height !== undefined ? '100%' : undefined,
        }}
      />
    </div>
  );
};

// Using memo to prevent unnecessary re-renders
export default memo(OptimizedImage);
