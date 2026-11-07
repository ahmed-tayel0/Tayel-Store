'use client';

import { forwardRef, ReactNode, HTMLAttributes } from 'react';
import { motion, useMotionValue, useTransform, useSpring, useMotionTemplate } from 'framer-motion';
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

interface Card3DProps extends OmitFramerConflicts<HTMLAttributes<HTMLDivElement>> {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  perspective?: number;
  scaleOnHover?: number;
}

export const Card3D = forwardRef<HTMLDivElement, Card3DProps>(
  ({ children, className, maxTilt = 5, perspective = 1000, scaleOnHover = 1.01, ...props }, ref) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const isHovering = useMotionValue(0);

    const rotateX = useTransform(y, [-maxTilt, maxTilt], [maxTilt, -maxTilt]);
    const rotateY = useTransform(x, [-maxTilt, maxTilt], [-maxTilt, maxTilt]);

    const springRotateX = useSpring(rotateX, { stiffness: 400, damping: 40, mass: 0.5 });
    const springRotateY = useSpring(rotateY, { stiffness: 400, damping: 40, mass: 0.5 });

    const scale = useTransform(isHovering, [0, 1], [1, scaleOnHover]);
    const springScale = useSpring(scale, { stiffness: 400, damping: 30 });

    // Create transform string using useMotionTemplate
    const transform = useMotionTemplate`perspective(${perspective}px) rotateX(${springRotateX}deg) rotateY(${springRotateY}deg) scale(${springScale})`;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      x.set((e.clientX - centerX) / (rect.width / 2) * maxTilt);
      y.set((e.clientY - centerY) / (rect.height / 2) * maxTilt);
    };

    const handleMouseEnter = () => {
      isHovering.set(1);
    };

    const handleMouseLeave = () => {
      isHovering.set(0);
      x.set(0);
      y.set(0);
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          'relative transform-style-preserve-3d',
          className
        )}
        style={{
          perspective: perspective,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <motion.div
          className="relative transform-style-preserve-3d backdrop-blur-2xl bg-white/5 border border-white/10"
          style={{
            transformStyle: 'preserve-3d',
            transform,
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    );
  }
);

Card3D.displayName = 'Card3D';