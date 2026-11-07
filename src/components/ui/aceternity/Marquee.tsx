'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MarqueeProps {
  className?: string;
  speed?: number;
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  children: React.ReactNode;
}

export function Marquee({
  className,
  speed = 50,
  direction = 'left',
  pauseOnHover = true,
  children
}: MarqueeProps) {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div
      className={cn('overflow-hidden w-full', className)}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      aria-hidden="true"
    >
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: direction === 'left' ? '-50%' : '0%',
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          animationPlayState: isPaused ? 'paused' : 'running',
        }}
      >
        <div className="flex gap-12 md:gap-20 lg:gap-32 items-center min-w-[200%]">
          {children}
          {children}
        </div>
      </motion.div>
    </div>
  );
}