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

    const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'https://api.apnabikaner.com/public').replace(/\/$/, '');

    // 1. If pointing to main frontend domain instead of api backend
    if (trimmed.includes('://apnabikaner.com/') && !trimmed.includes('://api.apnabikaner.com/')) {
      return trimmed.replace('://apnabikaner.com/', '://api.apnabikaner.com/');
    }

    // 2. Replace localhost or 127.0.0.1 with live API URL if present
    if (trimmed.includes('localhost') || trimmed.includes('127.0.0.1')) {
      return trimmed.replace(/https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/, apiBase);
    }

    // 3. Resolve relative /storage or /uploads paths to live API
    if (trimmed.startsWith('/storage') || trimmed.startsWith('/uploads') || trimmed.startsWith('storage/') || trimmed.startsWith('uploads/') || trimmed.startsWith('/public/uploads')) {
      const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
      // Prevent /public/public/
      if (apiBase.endsWith('/public') && cleanPath.startsWith('/public/')) {
        return `${apiBase}${cleanPath.substring(7)}`;
      }
      return `${apiBase}${cleanPath}`;
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

