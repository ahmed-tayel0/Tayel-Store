'use client';

import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';

interface FloatingElementsProps {
  className?: string;
}

export function FloatingElements({ className }: FloatingElementsProps) {
  const time = useMotionValue(0);

  // Animation loop
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

  // Element 1 - Large Torus (Top: Left in LTR, Right in RTL)
  const el1Rotate = useTransform(time, [0, 60], [0, 360]);
  const el1FloatY = useTransform(time, [0, 8], [0, -30]);
  const el1FloatX = useTransform(time, [0, 12], [0, 20]);
  const el1RotateSpring = useSpring(el1Rotate, { stiffness: 30, damping: 15 });
  const el1FloatYSpring = useSpring(el1FloatY, { stiffness: 20, damping: 12 });
  const el1FloatXSpring = useSpring(el1FloatX, { stiffness: 20, damping: 12 });

  // Element 2 - Crystal/Geometric (Bottom: Right in LTR, Left in RTL)
  const el2Rotate = useTransform(time, [0, -45], [0, 360]);
  const el2FloatY = useTransform(time, [0, 10], [0, 25]);
  const el2FloatX = useTransform(time, [0, 15], [0, -15]);
  const el2RotateSpring = useSpring(el2Rotate, { stiffness: 30, damping: 15 });
  const el2FloatYSpring = useSpring(el2FloatY, { stiffness: 20, damping: 12 });
  const el2FloatXSpring = useSpring(el2FloatX, { stiffness: 20, damping: 12 });

  // Element 3 - Small Glowing Orb (Center Right: Left in LTR, Right in RTL)
  const el3Rotate = useTransform(time, [0, 30], [0, 360]);
  const el3FloatY = useTransform(time, [0, 6], [0, -20]);
  const el3FloatX = useTransform(time, [0, 10], [0, 10]);
  const el3Pulse = useTransform(time, [0, 4], [0.8, 1.2]);
  const el3RotateSpring = useSpring(el3Rotate, { stiffness: 30, damping: 15 });
  const el3FloatYSpring = useSpring(el3FloatY, { stiffness: 20, damping: 12 });
  const el3FloatXSpring = useSpring(el3FloatX, { stiffness: 20, damping: 12 });
  const el3PulseSpring = useSpring(el3Pulse, { stiffness: 20, damping: 12 });

  return (
    <div className={`fixed pointer-events-none -z-10 ${className}`} aria-hidden="true">
      {/* Element 1: Large Torus - Top (Left in LTR, Right in RTL) */}
      <motion.div
        className="absolute top-[10%] right-[5%] rtl:right-auto rtl:left-[5%] z-0 pointer-events-none"
        style={{
          width: '320px',
          height: '320px',
          transformOrigin: 'center center',
          x: el1FloatXSpring,
          y: el1FloatYSpring,
          rotate: useMotionTemplate`${el1RotateSpring}deg`,
        }}
      >
        {/* Torus Ring */}
        <div
          className="absolute inset-0"
          style={{
            borderRadius: '50%',
            border: '2px solid transparent',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(6, 182, 212, 0.3), rgba(236, 72, 153, 0.2)) border-box',
            mask: 'radial-gradient(ellipse at center, transparent 60%, black 61%)',
            WebkitMask: 'radial-gradient(ellipse at center, transparent 60%, black 61%)',
            boxShadow: '0 0 60px rgba(139, 92, 246, 0.3), inset 0 0 60px rgba(139, 92, 246, 0.1)',
            backdropFilter: 'blur(2px)',
          }}
        />
        {/* Inner Glow */}
        <div
          className="absolute inset-10"
          style={{
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
            filter: 'blur(20px)',
          }}
        />
        {/* Accent Lines */}
        {[0, 60, 120].map((angle) => (
          <motion.div
            key={angle}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full"
            style={{
              transformOrigin: 'center center',
            }}
            animate={{
              rotate: `${angle}deg`,
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                width: '280px',
                height: '280px',
                borderRadius: '50%',
                border: '1px solid rgba(139, 92, 246, 0.15)',
                mask: 'radial-gradient(ellipse at center, transparent 80%, black 81%)',
                WebkitMask: 'radial-gradient(ellipse at center, transparent 80%, black 81%)',
              }}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Element 2: Crystal/Geometric - Bottom (Right in LTR, Left in RTL) */}
      <motion.div
        className="absolute bottom-[10%] left-[5%] rtl:left-auto rtl:right-[5%] z-0 pointer-events-none"
        style={{
          width: '200px',
          height: '200px',
          transformOrigin: 'center center',
          x: el2FloatXSpring,
          y: el2FloatYSpring,
          rotate: useMotionTemplate`${el2RotateSpring}deg`,
        }}
      >
        {/* Crystal Shape - Octagon with inner geometry */}
        <div
          className="absolute inset-0"
          style={{
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            background: `
              linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(6, 182, 212, 0.2) 50%, rgba(236, 72, 153, 0.15) 100%),
              radial-gradient(ellipse at 30% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
            `,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 0 40px rgba(6, 182, 212, 0.2), inset 0 0 40px rgba(139, 92, 246, 0.1)',
          }}
        />
        {/* Inner Facets */}
        <div
          className="absolute inset-6"
          style={{
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.2) 0%, transparent 60%)',
            filter: 'blur(10px)',
          }}
        />
        {/* Center Core */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-12"
          style={{
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(6, 182, 212, 0.6) 0%, transparent 70%)',
            filter: 'blur(8px)',
            boxShadow: '0 0 30px rgba(6, 182, 212, 0.5)',
          }}
        />
      </motion.div>

      {/* Element 3: Pulsing Orb - Center (Right in LTR, Left in RTL) */}
      <motion.div
        className="absolute top-1/2 right-[5%] rtl:right-auto rtl:left-[5%] z-0 pointer-events-none"
        style={{
          width: '120px',
          height: '120px',
          transformOrigin: 'center center',
          x: el3FloatXSpring,
          y: el3FloatYSpring,
          rotate: useMotionTemplate`${el3RotateSpring}deg`,
          scale: el3PulseSpring,
        }}
      >
        {/* Outer Glow Ring */}
        <div
          className="absolute -inset-4 rounded-full"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
            filter: 'blur(30px)',
          }}
        />
        {/* Core Sphere */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `
              radial-gradient(ellipse at 30% 30%, rgba(139, 92, 246, 0.5) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 70%, rgba(6, 182, 212, 0.4) 0%, transparent 50%),
              conic-gradient(from 0deg, transparent 0%, rgba(236, 72, 153, 0.2) 25%, transparent 50%, rgba(139, 92, 246, 0.2) 75%, transparent 100%)
            `,
            filter: 'blur(1px)',
            boxShadow: 'inset 0 0 30px rgba(139, 92, 246, 0.3), 0 0 40px rgba(6, 182, 212, 0.2)',
          }}
        />
        {/* Highlight */}
        <div
          className="absolute inset-4 rounded-full"
          style={{
            background: 'radial-gradient(ellipse at 25% 25%, rgba(255, 255, 255, 0.3) 0%, transparent 50%)',
            filter: 'blur(5px)',
          }}
        />
      </motion.div>

      {/* Element 4: Thin Line Accents - Scattered */}
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={`line-${i}`}
          className="absolute"
          style={{
            width: '100px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent)',
            top: `${15 + i * 18}%`,
            left: `${5 + (i % 2) * 85}%`,
            transformOrigin: 'center center',
            opacity: 0.3,
          }}
          animate={{
            rotate: [0, 5, -5, 0],
            scaleX: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: 12 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 1.5,
          }}
        />
      ))}
    </div>
  );
}