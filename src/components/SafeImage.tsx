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
  const resolveSrc = (url?: string | null): string => {
    if (!url || typeof url !== 'string' || !url.trim()) return fallbackSrc;
    const trimmed = url.trim();

    // Preserve local blob or data URLs directly
    if (trimmed.startsWith('blob:') || trimmed.startsWith('data:')) {
      return trimmed;
    }

    const apiBase = process.env.NEXT_PUBLIC_API_URL || '';

    // Replace localhost or 127.0.0.1 with live API URL if present
    if (apiBase && (trimmed.includes('localhost:8000') || trimmed.includes('127.0.0.1:8000'))) {
      return trimmed.replace(/https?:\/\/(localhost|127\.0\.0\.1):8000/, apiBase.replace(/\/$/, ''));
    }

    // Resolve relative /storage or /uploads paths to live API
    if (apiBase && (trimmed.startsWith('/storage') || trimmed.startsWith('/uploads') || trimmed.startsWith('storage/') || trimmed.startsWith('uploads/'))) {
      const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
      return `${apiBase.replace(/\/$/, '')}${cleanPath}`;
    }

    return trimmed;
  };

  const [imgSrc, setImgSrc] = useState<string>(() => resolveSrc(src));

  useEffect(() => {
    setImgSrc(resolveSrc(src));
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

