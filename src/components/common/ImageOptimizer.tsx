
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface ImageOptimizerProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  loading?: 'lazy' | 'eager';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  priority?: boolean;
  onLoad?: () => void;
  fallback?: React.ReactNode;
}

const ImageOptimizer: React.FC<ImageOptimizerProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  objectFit = 'cover',
  priority = false,
  onLoad,
  fallback,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Convert image URL to WebP if it's from lovable-uploads and not already WebP
  const optimizedSrc = () => {
    if (src.includes('lovable-uploads') && !src.endsWith('.webp')) {
      // For demonstration purposes - in a real app, you'd have a server endpoint
      // that converts images to WebP format
      return src;
    }
    return src;
  };

  const handleLoad = () => {
    setIsLoading(false);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError && fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="relative" style={{ width, height }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Loader2 className="h-6 w-6 animate-spin text-dawg-secondary" />
        </div>
      )}
      <img
        src={optimizedSrc()}
        alt={alt}
        width={typeof width === 'number' ? width : undefined}
        height={typeof height === 'number' ? height : undefined}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? 'eager' : loading}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        style={{ 
          objectFit, 
          width: width !== undefined ? width : '100%',
          height: height !== undefined ? height : '100%'
        }}
      />
    </div>
  );
};

export default ImageOptimizer;
