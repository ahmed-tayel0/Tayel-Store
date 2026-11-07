'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

export const SafeImage = ({ src, alt, ...props }: ImageProps) => {
  const [imgSrc, setImgSrc] = useState<string | undefined>(typeof src === 'string' ? src : undefined);
  const [isError, setIsError] = useState(false);

  if (!imgSrc || isError) {
    return (
      <div className="relative w-full h-full bg-white/5 flex items-center justify-center border border-white/10">
        <span className="text-white/20 text-xs">No Image</span>
      </div>
    );
  }

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => setIsError(true)}
    />
  );
};