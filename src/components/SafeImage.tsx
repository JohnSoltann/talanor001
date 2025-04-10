'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FaExclamationTriangle } from 'react-icons/fa';

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
}

const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  fill = false,
  priority = false,
  className = '',
  style = {},
  width,
  height
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [error, setError] = useState<boolean>(false);

  // Default fallback image - now using our new SVG images
  const DEFAULT_FALLBACK = '/images/gold-hero.svg';

  const handleError = () => {
    // If the image failed to load, log the error and use fallback
    if (!error) {
      console.error(`Failed to load image: ${src}`);
      
      // Don't try to load from blog directory as fallback since those images were deleted
      // Use a generic fallback instead
      setImgSrc(DEFAULT_FALLBACK);
      setError(true);
    }
  };

  if (error && (!imgSrc || imgSrc === src)) {
    // Placeholder when image can't be loaded
    return (
      <div className={`flex flex-col items-center justify-center bg-gray-100 rounded overflow-hidden ${className}`}
           style={{ width: width || '100%', height: height || (fill ? '100%' : '300px'), ...style }}>
        <FaExclamationTriangle size={24} className="mb-2 text-amber-500" />
        <span className="text-sm text-center text-gray-600">تصویر در دسترس نیست</span>
      </div>
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      priority={priority}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      className={`${className} ${error ? 'opacity-90' : ''}`}
      style={style}
      unoptimized
      onError={handleError}
    />
  );
};

export default SafeImage; 