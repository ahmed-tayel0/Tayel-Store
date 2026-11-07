'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLocale } from 'next-intl';

interface TextGenerateEffectProps {
  words: string;
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
}

export function TextGenerateEffect({
  words,
  className,
  delay = 0,
  duration = 0.8,
  stagger = 0.12,
}: TextGenerateEffectProps) {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  // For RTL (Arabic), animate the whole line with a smooth fade-up
  // to avoid breaking ligatures and RTL flow with word-by-word splitting
  if (isRTL) {
    return (
      <motion.span
        className={cn('inline-block', className)}
        initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{
          delay,
          duration,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        style={{ willChange: 'opacity, transform, filter' }}
        aria-live="polite"
      >
        {words}
      </motion.span>
    );
  }

  // For LTR (English), use word-by-word staggered animation
  const wordArray = words.split(' ');

  return (
    <div className={cn('inline-flex flex-wrap items-center gap-1', className)} aria-live="polite">
      {wordArray.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block whitespace-nowrap"
          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            delay: delay + index * stagger,
            duration,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          style={{ willChange: 'opacity, transform, filter' }}
        >
          {word}
          {index < wordArray.length - 1 && <span className="inline-block w-1" aria-hidden="true" />}
        </motion.span>
      ))}
    </div>
  );
}