'use client';

import { forwardRef, ReactNode, ButtonHTMLAttributes } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
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

interface GlowButtonProps extends OmitFramerConflicts<ButtonHTMLAttributes<HTMLButtonElement>> {
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  magneticStrength?: number;
}

export const GlowButton = forwardRef<HTMLButtonElement, GlowButtonProps>(
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
        bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold
        shadow-[0_0_40px_rgba(139,92,246,0.4)]
        transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(139,92,246,0.7)]
        focus-visible:ring-violet-500/50
      `,
      variant === 'secondary' && `
        bg-white/5 border border-white/10 text-white
        backdrop-blur-md
        hover:bg-white/10 hover:border-white/20
        focus-visible:ring-white/30
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
        whileHover={{ scale: 1 }}
        whileTap={{ scale: 0.98 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { x.set(0); y.set(0); }}
        onClick={onClick}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
      </motion.button>
    );
  }
);

GlowButton.displayName = 'GlowButton';