'use client';

import { forwardRef, ReactNode, HTMLAttributes } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
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

interface TiltCardProps extends OmitFramerConflicts<HTMLAttributes<HTMLDivElement>> {
  children: ReactNode;
  className?: string;
  tiltStrength?: number;
  glowColor?: 'primary' | 'accent';
}

export const TiltCard = forwardRef<HTMLDivElement, TiltCardProps>(
  ({ children, className, tiltStrength = 8, glowColor = 'primary', ...props }, ref) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useTransform(y, [-150, 0, 150], [`${tiltStrength}deg`, '0deg', `${-tiltStrength}deg`]);
    const rotateY = useTransform(x, [-150, 0, 150], [`${-tiltStrength}deg`, '0deg', `${tiltStrength}deg`]);

    const glowX = useTransform(x, [-150, 0, 150], [`${tiltStrength * 2}%`, '50%', `${-tiltStrength * 2}%`]);
    const glowY = useTransform(y, [-150, 0, 150], [`${tiltStrength * 2}%`, '50%', `${-tiltStrength * 2}%`]);

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
        className={cn(
          'relative rounded-2xl overflow-hidden glass transition-all duration-500',
          'hover:border-white/20',
          className
        )}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}) rotateY(${rotateY})`,
          transformStyle: 'preserve-3d',
        }}
        {...props}
      >
        {/* Dynamic glow that follows mouse */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background: `radial-gradient(
              300px circle at ${glowX} ${glowY},
              ${glowColor === 'primary' ? 'rgba(139, 92, 246, 0.25)' : 'rgba(6, 182, 212, 0.25)'} 0%,
              transparent 70%
            )`,
          }}
        />

        {/* Subtle border glow */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            boxShadow: `inset 0 0 0 1px ${glowColor === 'primary' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(6, 182, 212, 0.15)'}`,
          }}
        />

        <div className="relative z-10" style={{ transformStyle: 'preserve-3d' }}>
          {children}
        </div>
      </motion.div>
    );
  }
);

TiltCard.displayName = 'TiltCard';