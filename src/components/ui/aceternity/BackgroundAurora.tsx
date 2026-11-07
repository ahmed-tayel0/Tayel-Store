'use client';

import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function BackgroundAurora() {
  const time = useMotionValue(0);

  // Blob 1 - Violet (top-left area offset from center)
  const blob1X = useMotionValue(0);
  const blob1Y = useMotionValue(0);
  const blob1Scale = useMotionValue(1);

  // Blob 2 - Cyan (bottom-right area offset from center)
  const blob2X = useMotionValue(0);
  const blob2Y = useMotionValue(0);
  const blob2Scale = useMotionValue(1);

  // Blob 3 - Deep Pink (center)
  const blob3X = useMotionValue(0);
  const blob3Y = useMotionValue(0);
  const blob3Scale = useMotionValue(1);

  // Smooth springs for organic feel
  const blob1XSpring = useSpring(blob1X, { stiffness: 5, damping: 10 });
  const blob1YSpring = useSpring(blob1Y, { stiffness: 5, damping: 10 });
  const blob1ScaleSpring = useSpring(blob1Scale, { stiffness: 5, damping: 10 });

  const blob2XSpring = useSpring(blob2X, { stiffness: 5, damping: 10 });
  const blob2YSpring = useSpring(blob2Y, { stiffness: 5, damping: 10 });
  const blob2ScaleSpring = useSpring(blob2Scale, { stiffness: 5, damping: 10 });

  const blob3XSpring = useSpring(blob3X, { stiffness: 5, damping: 10 });
  const blob3YSpring = useSpring(blob3Y, { stiffness: 5, damping: 10 });
  const blob3ScaleSpring = useSpring(blob3Scale, { stiffness: 5, damping: 10 });

  // Animation loop for slow moving blobs
  useEffect(() => {
    let frame: number;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;

      // Blob 1 - Violet (20s cycle) - offset from center: left/up
      blob1X.set(Math.sin(elapsed / 20) * 150 - 300);
      blob1Y.set(Math.cos(elapsed / 18) * 100 - 200);
      blob1Scale.set(1 + Math.sin(elapsed / 22) * 0.2);

      // Blob 2 - Cyan (25s cycle) - offset from center: right/down
      blob2X.set(Math.cos(elapsed / 25 + 2) * 180 + 300);
      blob2Y.set(Math.sin(elapsed / 23 + 1) * 150 + 200);
      blob2Scale.set(1 + Math.cos(elapsed / 27 + 0.5) * 0.15);

      // Blob 3 - Deep Pink (30s cycle) - center area
      blob3X.set(Math.sin(elapsed / 30 + 4) * 100);
      blob3Y.set(Math.cos(elapsed / 28 + 3) * 120);
      blob3Scale.set(1 + Math.sin(elapsed / 32 + 1) * 0.1);

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [blob1X, blob1Y, blob1Scale, blob2X, blob2Y, blob2Scale, blob3X, blob3Y, blob3Scale]);

  return (
    <div className="fixed inset-0 -z-30 pointer-events-none overflow-hidden bg-zinc-950" aria-hidden="true">
      {/* Base dark background - not pitch black */}
      <div className="absolute inset-0 bg-zinc-950" />

      {/* Aurora Blob 1 - Violet (Top-Left area) - Centered with translate offsets */}
      <motion.div
        className="absolute rounded-full blur-[100px] opacity-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: '700px',
          height: '700px',
          background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.8) 0%, rgba(139, 92, 246, 0.3) 40%, transparent 70%)',
          transformOrigin: 'center center',
          x: blob1XSpring,
          y: blob1YSpring,
          scale: blob1ScaleSpring,
        }}
      />

      {/* Aurora Blob 2 - Cyan (Bottom-Right area) - Centered with translate offsets */}
      <motion.div
        className="absolute rounded-full blur-[100px] opacity-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: '800px',
          height: '800px',
          background: 'radial-gradient(ellipse at center, rgba(6, 182, 212, 0.7) 0%, rgba(6, 182, 212, 0.2) 40%, transparent 70%)',
          transformOrigin: 'center center',
          x: blob2XSpring,
          y: blob2YSpring,
          scale: blob2ScaleSpring,
        }}
      />

      {/* Aurora Blob 3 - Deep Pink (Center) - Centered with translate offsets */}
      <motion.div
        className="absolute rounded-full blur-[100px] opacity-35 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: '600px',
          height: '600px',
          background: 'radial-gradient(ellipse at center, rgba(236, 72, 153, 0.6) 0%, rgba(236, 72, 153, 0.2) 40%, transparent 70%)',
          transformOrigin: 'center center',
          x: blob3XSpring,
          y: blob3YSpring,
          scale: blob3ScaleSpring,
        }}
      />

      {/* Grid Pattern Overlay - More visible (10% opacity) */}
      <div
        className="absolute inset-0 -z-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse 80% 60% at center, transparent 0%, black 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at center, transparent 0%, black 70%)',
        }}
      />

      {/* Subtle vignette */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 200px 100px rgba(0, 0, 0, 0.5)',
        }}
      />

      {/* Noise Texture Overlay */}
      <div
        className="absolute inset-0 -z-5 pointer-events-none"
        style={{
          opacity: 0.02,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '256px 256px',
        }}
      />
    </div>
  );
}