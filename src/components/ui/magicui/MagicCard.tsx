'use client';

import { forwardRef, ReactNode, HTMLAttributes } from 'react';
import { motion, useMotionValue, useMotionTemplate, useTransform } from 'framer-motion';
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

interface MagicCardProps extends OmitFramerConflicts<HTMLAttributes<HTMLDivElement>> {
  children: ReactNode;
  className?: string;
  glowColor?: 'primary' | 'accent';
  intensity?: number;
}

export const MagicCard = forwardRef<HTMLDivElement, MagicCardProps>(
  ({ children, className, glowColor = 'primary', intensity = 1, ...props }, ref) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const isHovering = useMotionValue(0);

    const gradientX = useTransform(x, [-200, 0, 200], [`-${intensity * 100}%`, '50%', `${intensity * 100}%`]);
    const gradientY = useTransform(y, [-200, 0, 200], [`-${intensity * 100}%`, '50%', `${intensity * 100}%`]);
    const gradientOpacity = useTransform(isHovering, [0, 1], [0, 0.6]);

    const gradient = useMotionTemplate`
      radial-gradient(
        600px circle at ${gradientX} ${gradientY},
        ${glowColor === 'primary' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(6, 182, 212, 0.3)'} 0%,
        transparent 70%
      )
    `;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      x.set(e.clientX - rect.left - rect.width / 2);
      y.set(e.clientY - rect.top - rect.height / 2);
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
          'relative rounded-2xl overflow-hidden glass',
          'transition-all duration-500',
          'hover:border-white/10',
          className
        )}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          background: gradient,
        }}
        {...props}
      >
        {/* Inner content wrapper to keep content above gradient */}
        <div className="relative z-10 p-6">
          {children}
        </div>

        {/* Subtle border glow */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            boxShadow: `inset 0 0 0 1px ${glowColor === 'primary' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(6, 182, 212, 0.2)'}`,
          }}
        />

        {/* Animated border highlight */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background: `linear-gradient(
              135deg,
              ${glowColor === 'primary' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(6, 182, 212, 0.1)'} 0%,
              transparent 50%,
              ${glowColor === 'primary' ? 'rgba(139, 92, 246, 0.05)' : 'rgba(6, 182, 212, 0.05)'} 100%
            )`,
          }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    );
  }
);

MagicCard.displayName = 'MagicCard';