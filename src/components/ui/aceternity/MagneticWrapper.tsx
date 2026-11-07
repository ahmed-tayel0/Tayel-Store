'use client';

import { forwardRef, ReactNode, HTMLAttributes } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

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

interface MagneticWrapperProps extends OmitFramerConflicts<HTMLAttributes<HTMLDivElement>> {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export const MagneticWrapper = forwardRef<HTMLDivElement, MagneticWrapperProps>(
  ({ children, className, strength = 15, ...props }, ref) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springX = useSpring(x, { stiffness: 300, damping: 30 });
    const springY = useSpring(y, { stiffness: 300, damping: 30 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      x.set((e.clientX - centerX) * 0.3);
      y.set((e.clientY - centerY) * 0.3);
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    const transformX = useTransform(springX, [-strength, strength], [-strength, strength]);
    const transformY = useTransform(springY, [-strength, strength], [-strength, strength]);

    return (
      <motion.div
        ref={ref}
        className={cn('inline-flex', className)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          x: transformX,
          y: transformY,
        }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

MagneticWrapper.displayName = 'MagneticWrapper';