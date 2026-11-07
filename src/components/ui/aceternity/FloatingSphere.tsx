'use client';

import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';

interface FloatingSphereProps {
  className?: string;
  size?: number;
}

export function FloatingSphere({ className, size = 300 }: FloatingSphereProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const time = useMotionValue(0);

  // Animation loop for floating and rotation
  useEffect(() => {
    let frame: number;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      time.set(elapsed);
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [time]);

  // Parallax effect based on mouse position
  const parallaxX = useTransform(mouseX, [-1, 1], [-30, 30]);
  const parallaxY = useTransform(mouseY, [-1, 1], [-30, 30]);

  // Floating animation using time
  const floatY = useTransform(time, [0, 10], [0, -20]);
  const floatX = useTransform(time, [0, 15], [0, 15]);
  const rotation = useTransform(time, [0, 60], [0, 360]);

  // Smooth spring for parallax
  const smoothParallaxX = useSpring(parallaxX, { stiffness: 100, damping: 30 });
  const smoothParallaxY = useSpring(parallaxY, { stiffness: 100, damping: 30 });
  const smoothFloatY = useSpring(floatY, { stiffness: 50, damping: 20 });
  const smoothFloatX = useSpring(floatX, { stiffness: 50, damping: 20 });
  const smoothRotation = useSpring(rotation, { stiffness: 50, damping: 20 });

  // Combine motion values using useTransform for x and y
  const combinedX = useTransform(
    [smoothParallaxX, smoothFloatX],
    (values: number[]) => values[0] + values[1]
  );
  const combinedY = useTransform(
    [smoothParallaxY, smoothFloatY],
    (values: number[]) => values[0] + values[1]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position to -1 to 1
      const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
      const normalizedY = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(normalizedX);
      mouseY.set(normalizedY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const sphereStyle = {
    x: combinedX,
    y: combinedY,
    rotate: useMotionTemplate`${smoothRotation}deg`,
    transformOrigin: 'center center',
  } as unknown as React.CSSProperties;

  return (
    <motion.div
      className={`fixed pointer-events-none -z-10 ${className}`}
      style={sphereStyle}
      aria-hidden="true"
    >
      {/* Outer glow ring */}
      <div
        className="absolute -inset-4 rounded-full blur-[100px] opacity-30"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.6) 0%, rgba(6, 182, 212, 0.4) 50%, transparent 70%)',
          width: size,
          height: size,
        }}
      />

      {/* Main sphere with complex gradient */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          width: size,
          height: size,
          background: `
            radial-gradient(ellipse at 30% 30%, rgba(139, 92, 246, 0.4) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 70%, rgba(6, 182, 212, 0.35) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(236, 72, 153, 0.25) 0%, transparent 60%),
            conic-gradient(from 0deg, transparent 0%, rgba(139, 92, 246, 0.15) 25%, transparent 50%, rgba(6, 182, 212, 0.15) 75%, transparent 100%)
          `,
          filter: 'blur(1px)',
        }}
      />

      {/* Inner highlight */}
      <div
        className="absolute inset-8 rounded-full blur-[30px] opacity-40"
        style={{
          width: size - 16,
          height: size - 16,
          background: 'radial-gradient(ellipse at 30% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 60%)',
        }}
      />

      {/* Geometric accent lines */}
      <div className="absolute inset-0" style={{ width: size, height: size }}>
        {[0, 45, 90, 135].map((angle) => (
          <div
            key={angle}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-full opacity-10"
            style={{
              transformOrigin: 'center center',
              background: 'linear-gradient(to bottom, transparent, rgba(139, 92, 246, 0.5), transparent)',
              rotate: `${angle}deg`,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}