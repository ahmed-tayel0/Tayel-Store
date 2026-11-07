'use client';

import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function MouseFollower() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const smoothX = useSpring(x, { stiffness: 100, damping: 30 });
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [x, y]);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none -z-20 w-full h-full"
      style={{
        x: smoothX,
        y: smoothY,
        transformOrigin: 'center center',
      }}
      aria-hidden="true"
    >
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-[200px] opacity-60"
        style={{
          width: '400px',
          height: '400px',
          background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.5) 0%, rgba(6, 182, 212, 0.4) 40%, transparent 70%)',
        }}
      />
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-[150px] opacity-40"
        style={{
          width: '300px',
          height: '300px',
          background: 'radial-gradient(ellipse at center, rgba(236, 72, 153, 0.4) 0%, transparent 70%)',
        }}
      />
    </motion.div>
  );
}