'use client';

import { forwardRef, ReactNode, HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MagicCard } from '@/components/ui/magicui/MagicCard';

interface GlassIconCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  glowColor?: 'primary' | 'accent';
  icon?: ReactNode;
  title: string;
  description: string;
}

export const GlassIconCard = forwardRef<HTMLDivElement, GlassIconCardProps>(
  ({ children, className, glowColor = 'primary', icon, title, description, ...props }, ref) => {
    return (
      <MagicCard
        ref={ref}
        glowColor={glowColor}
        intensity={0.5}
        className={cn(
          'group p-6 flex flex-col gap-4 transition-all duration-500',
          'hover:border-primary/30 hover:bg-white/5',
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-4">
          {icon && (
            <div className="flex-shrink-0 w-14 h-14 rounded-2xl glass flex items-center justify-center border border-white/10 bg-primary/10 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all duration-300">
              {icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-foreground-muted text-sm mt-1">{description}</p>
          </div>
        </div>
        <div className="relative z-10">
          {children}
        </div>
      </MagicCard>
    );
  }
);

GlassIconCard.displayName = 'GlassIconCard';