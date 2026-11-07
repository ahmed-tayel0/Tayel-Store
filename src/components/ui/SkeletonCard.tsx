'use client';

import { cn } from '@/lib/utils';

interface SkeletonCardProps {
  className?: string;
  variant?: 'default' | 'product' | 'category' | 'hero';
}

export function SkeletonCard({ className, variant = 'default' }: SkeletonCardProps) {
  const baseStyles = cn(
    'relative overflow-hidden rounded-2xl glass',
    'bg-gradient-to-br from-white/5 via-white/10 to-white/5',
    'animate-pulse',
    className
  );

  switch (variant) {
    case 'hero':
      return (
        <div className={cn(baseStyles, 'aspect-[4/3] md:aspect-[3/2]')}>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-purple-700/10 to-transparent" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)] animate-[shimmer_2s_infinite]" />
        </div>
      );

    case 'product':
      return (
        <div className={cn(baseStyles, 'flex flex-col h-full')}>
          <div className="aspect-square w-full" />
          <div className="p-4 space-y-3 flex-1 flex flex-col justify-end">
            <div className="h-4 w-3/4 rounded bg-white/10" />
            <div className="h-3 w-1/2 rounded bg-white/10" />
            <div className="h-10 w-full rounded-lg bg-white/10 mt-auto" />
          </div>
        </div>
      );

    case 'category':
      return (
        <div className={cn(baseStyles, 'aspect-square flex flex-col items-center justify-center gap-3 p-4')}>
          <div className="w-20 h-20 rounded-full bg-white/10" />
          <div className="h-4 w-24 rounded bg-white/10" />
          <div className="h-3 w-16 rounded bg-white/10" />
        </div>
      );

    default:
      return (
        <div className={cn(baseStyles, 'aspect-video')}>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)] animate-[shimmer_2s_infinite]" />
        </div>
      );
  }
}