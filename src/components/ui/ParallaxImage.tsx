'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SafeImage } from '@/components/shared/SafeImage';

// Omit drag and animation-related props that conflict with Framer Motion
type OmitFramerConflicts<T> = Omit<T,
  | 'onDrag'
  | 'onDragStart'
  | 'onDragEnd'
  | 'onDragEnter'
  | 'onDragLeave'
  | 'onDragOver'
  | 'onDrop'
  | 'onAnimationStart'
  | 'onAnimationEnd'
  | 'onAnimationIteration'
  | 'onTransitionStart'
  | 'onTransitionEnd'
  | 'onTransitionCancel'
>;

interface ParallaxImageProps extends OmitFramerConflicts<HTMLAttributes<HTMLDivElement>> {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  intensity?: number;
  className?: string;
}

export const ParallaxImage = forwardRef<HTMLDivElement, ParallaxImageProps>(
  ({ src, alt, fill = true, sizes, priority = false, intensity = 20, className, ...props }, ref) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const translateX = useTransform(x, [-300, 0, 300], [`-${intensity}px`, '0px', `${intensity}px`]);
    const translateY = useTransform(y, [-300, 0, 300], [`-${intensity}px`, '0px', `${intensity}px`]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      x.set(e.clientX - rect.left - rect.width / 2);
      y.set(e.clientY - rect.top - rect.height / 2);
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    return (
      <motion.div
        ref={ref}
        className={cn('relative overflow-hidden', className)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `translate(${translateX}, ${translateY})`,
        }}
        {...props}
      >
        <SafeImage
          src={src}
          alt={alt}
          fill={fill}
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </motion.div>
    );
  }
);

ParallaxImage.displayName = 'ParallaxImage';