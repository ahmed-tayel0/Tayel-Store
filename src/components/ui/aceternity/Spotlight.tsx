'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SpotlightProps {
  className?: string;
  color?: 'primary' | 'accent' | 'mixed';
  size?: number;
}

export function Spotlight({ className, color = 'mixed', size = 600 }: SpotlightProps) {
  const gradientStyles = {
    primary: `radial-gradient(ellipse at center, rgba(139, 92, 246, 0.25) 0%, rgba(139, 92, 246, 0.1) 40%, transparent 70%)`,
    accent: `radial-gradient(ellipse at center, rgba(6, 182, 212, 0.25) 0%, rgba(6, 182, 212, 0.1) 40%, transparent 70%)`,
    mixed: `radial-gradient(ellipse at center, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.15) 35%, rgba(139, 92, 246, 0.1) 60%, transparent 80%)`,
  };

  return (
    <motion.div
      className={cn(
        'fixed inset-0 pointer-events-none -z-10',
        className
      )}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: [0, 0.6, 0.8, 0.6, 0.8],
        scale: [0.8, 1.05, 1.1, 1.05, 1.1],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{
        background: gradientStyles[color],
        width: size,
        height: size,
        borderRadius: '9999px',
        filter: 'blur(120px)',
      }}
      aria-hidden="true"
    />
  );
}