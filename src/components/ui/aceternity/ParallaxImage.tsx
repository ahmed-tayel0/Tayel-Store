'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { motion, useMotionValue, useTransform, useScroll, useSpring } from 'framer-motion';
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
  scrollSpeed?: number;
  mouseIntensity?: number;
  className?: string;
}

export const ParallaxImage = forwardRef<HTMLDivElement, ParallaxImageProps>(
  (
    { src, alt, fill = true, sizes, priority = false, scrollSpeed = 0.3, mouseIntensity = 20, className, ...props },
    ref
  ) => {
    const { scrollY } = useScroll();
    const scrollYProgress = useTransform(scrollY, [0, 1000], [0, scrollSpeed * 100]);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const translateX = useTransform(x, [-200, 0, 200], [`-${mouseIntensity}px`, '0px', `${mouseIntensity}px`]);
    const translateY = useTransform(y, [-200, 0, 200], [`-${mouseIntensity}px`, '0px', `${mouseIntensity}px`]);

    const scale = useSpring(useTransform(scrollYProgress, [0, 100], [1, 1.1]), { stiffness: 100, damping: 30 });

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
          y: scrollYProgress,
          transform: `translate(${translateX}, ${translateY}) scale(${scale})`,
        }}
        {...props}
      >
        <SafeImage
          src={src}
          alt={alt}
          fill={fill}
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-700 ease-out"
        />
      </motion.div>
    );
  }
);

ParallaxImage.displayName = 'ParallaxImage';