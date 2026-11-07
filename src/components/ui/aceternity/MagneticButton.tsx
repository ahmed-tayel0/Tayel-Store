'use client';

import { forwardRef, ReactNode, ButtonHTMLAttributes } from 'react';
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

interface MagneticButtonProps extends OmitFramerConflicts<ButtonHTMLAttributes<HTMLButtonElement>> {
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  magneticStrength?: number;
}

export const MagneticButton = forwardRef<HTMLButtonElement, MagneticButtonProps>(
  ({
    children,
    className,
    variant = 'primary',
    size = 'md',
    magneticStrength = 15,
    disabled,
    onClick,
    ...props
  }, ref) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const isHovering = useMotionValue(0);

    const springX = useSpring(x, { stiffness: 300, damping: 30, mass: 0.5 });
    const springY = useSpring(y, { stiffness: 300, damping: 30, mass: 0.5 });

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * (magneticStrength / 100);
      const deltaY = (e.clientY - centerY) * (magneticStrength / 100);
      x.set(deltaX);
      y.set(deltaY);
    };

    const handleMouseEnter = () => {
      isHovering.set(1);
    };

    const handleMouseLeave = () => {
      isHovering.set(0);
      x.set(0);
      y.set(0);
    };

    const baseStyles = cn(
      'relative inline-flex items-center justify-center font-semibold rounded-xl',
      'overflow-hidden isolation',
      'transition-all duration-300 ease-out',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      'disabled:opacity-50 disabled:pointer-events-none',
      size === 'sm' && 'px-4 py-2 text-sm gap-2',
      size === 'md' && 'px-6 py-3 text-base gap-2.5',
      size === 'lg' && 'px-8 py-4 text-lg gap-3',
      size === 'xl' && 'px-10 py-5 text-xl gap-4'
    );

    const variantStyles = cn(
      variant === 'primary' && `
        bg-gradient-to-r from-violet-600 via-violet-500 to-cyan-600
        text-white
        hover:from-violet-500 hover:via-violet-400 hover:to-cyan-500
        focus-visible:ring-violet-500/50
        shadow-xl shadow-violet-500/30
        hover:shadow-2xl hover:shadow-violet-500/40
      `,
      variant === 'glass' && `
        bg-white/5
        border border-white/10
        text-white
        backdrop-blur-xl
        hover:bg-white/10
        hover:border-white/20
        focus-visible:ring-white/30
        shadow-lg shadow-black/20
      `
    );

    return (
      <motion.button
        ref={ref}
        className={cn(baseStyles, variantStyles, className)}
        disabled={disabled}
        style={{
          x: springX,
          y: springY,
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>

        {/* Subtle glow ring */}
        <span
          className={cn(
            'absolute inset-[-2px] rounded-[inherit] opacity-0 transition-opacity duration-300',
            'pointer-events-none',
            variant === 'primary' && 'bg-gradient-to-r from-violet-500/50 to-cyan-500/10',
            variant === 'glass' && 'bg-gradient-to-r from-white/30 to-transparent',
            'group-hover:opacity-100'
          )}
          aria-hidden="true"
        />
      </motion.button>
    );
  }
);

MagneticButton.displayName = 'MagneticButton';