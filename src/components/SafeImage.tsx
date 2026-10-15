'use client';

import React, { useState, useEffect } from 'react';

interface SafeImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  fallbackSrc?: string;
}

export default function SafeImage({
  src,
  alt = '',
  fallbackSrc = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80',
  className,
  ...props
}: SafeImageProps) {
  const initial = typeof src === 'string' && src.trim().length > 0 ? src : fallbackSrc;
  const [imgSrc, setImgSrc] = useState<string>(initial);

  useEffect(() => {
    if (typeof src === 'string' && src.trim().length > 0) {
      setImgSrc(src);
    }
  }, [src]);

  return (
    <img
      src={imgSrc || fallbackSrc}
      alt={alt}
      onError={() => {
        if (imgSrc !== fallbackSrc) {
          setImgSrc(fallbackSrc);
        }
      }}
      className={className}
      {...props}
    />
  );
}
