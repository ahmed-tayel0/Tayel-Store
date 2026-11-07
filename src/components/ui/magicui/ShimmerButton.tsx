'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
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

interface ShimmerButtonProps extends OmitFramerConflicts<ButtonHTMLAttributes<HTMLButtonElement>> {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'accent' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const ShimmerButton = forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  ({ children, className, variant = 'primary', size = 'md', disabled, ...props }, ref) => {
    const baseStyles = cn(
      'relative inline-flex items-center justify-center font-semibold rounded-xl',
      'overflow-hidden isolation',
      'transition-all duration-300 ease-out',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      'disabled:opacity-50 disabled:pointer-events-none',
      'active:scale-[0.98]',
      size === 'sm' && 'px-4 py-2 text-sm gap-2',
      size === 'md' && 'px-6 py-3 text-base gap-2.5',
      size === 'lg' && 'px-8 py-4 text-lg gap-3',
      size === 'xl' && 'px-10 py-5 text-xl gap-4'
    );

    const variantStyles = cn(
      variant === 'primary' && `
        bg-gradient-to-r from-primary via-primary-hover to-primary
        text-background
        hover:from-primary-hover hover:via-primary hover:to-primary-light
        focus-visible:ring-primary/50
        shadow-lg shadow-primary/25
        hover:shadow-xl hover:shadow-primary/40
      `,
      variant === 'accent' && `
        bg-gradient-to-r from-accent via-accent-hover to-accent
        text-background
        hover:from-accent-hover hover:via-accent hover:to-accent-light
        focus-visible:ring-accent/50
        shadow-lg shadow-accent/25
        hover:shadow-xl hover:shadow-accent/40
      `,
      variant === 'outline' && `
        bg-transparent
        border border-white/10
        text-foreground
        hover:bg-white/5
        hover:border-primary/50
        focus-visible:ring-primary/50
      `
    );

    const shimmerColor = variant === 'accent'
      ? 'from-transparent via-accent/30 to-transparent'
      : 'from-transparent via-primary/30 to-transparent';

    return (
      <motion.button
        ref={ref}
        className={cn(baseStyles, variantStyles, className)}
        disabled={disabled}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {/* Shimmer effect */}
        <span
          className={cn(
            'absolute inset-0 -translate-x-full',
            'bg-gradient-to-r',
            shimmerColor,
            'animate-[shimmer_2s_infinite]',
            'pointer-events-none'
          )}
          aria-hidden="true"
        />

        {/* Content */}
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>

        {/* Subtle glow ring */}
        <span
          className={cn(
            'absolute inset-[-2px] rounded-[inherit] opacity-0 transition-opacity duration-300',
            'pointer-events-none',
            variant === 'primary' && 'bg-gradient-to-r from-primary/50 to-primary/10',
            variant === 'accent' && 'bg-gradient-to-r from-accent/50 to-accent/10',
            variant === 'outline' && 'bg-gradient-to-r from-primary/30 to-transparent',
            'group-hover:opacity-100'
          )}
          aria-hidden="true"
        />
      </motion.button>
    );
  }
);

ShimmerButton.displayName = 'ShimmerButton';