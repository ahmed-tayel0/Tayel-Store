'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface BackgroundBeamsProps {
  className?: string;
}

export function BackgroundBeams({ className }: BackgroundBeamsProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // Create the beams as SVG paths
    const beams = [
      {
        id: 'beam-1',
        d: 'M-200,300 Q200,100 600,300 Q1000,500 1400,300 Q1800,100 2200,300',
        color: 'rgba(139, 92, 246, 0.6)',
        duration: 20,
        delay: 0,
      },
      {
        id: 'beam-2',
        d: 'M-200,500 Q200,700 600,500 Q1000,300 1400,500 Q1800,700 2200,500',
        color: 'rgba(6, 182, 212, 0.5)',
        duration: 25,
        delay: 2,
      },
      {
        id: 'beam-3',
        d: 'M-200,700 Q200,500 600,700 Q1000,900 1400,700 Q1800,500 2200,700',
        color: 'rgba(139, 92, 246, 0.4)',
        duration: 30,
        delay: 4,
      },
      {
        id: 'beam-4',
        d: 'M-200,100 Q200,300 600,100 Q1000,-100 1400,100 Q1800,300 2200,100',
        color: 'rgba(6, 182, 212, 0.35)',
        duration: 22,
        delay: 1,
      },
    ];

    // Animate each beam
    beams.forEach((beam) => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('id', beam.id);
      path.setAttribute('d', beam.d);
      path.setAttribute('stroke', beam.color);
      path.setAttribute('stroke-width', '2.5');
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('filter', 'url(#glow)');
      path.style.opacity = '0';
      svg.appendChild(path);

      // Animate the path
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length} ${length}`;
      path.style.strokeDashoffset = `${length}`;

      const animation = path.animate(
        [
          { strokeDashoffset: length, opacity: 0 },
          { strokeDashoffset: 0, opacity: 1, offset: 0.1 },
          { strokeDashoffset: -length, opacity: 0, offset: 0.9 },
          { strokeDashoffset: -length, opacity: 0 },
        ],
        {
          duration: beam.duration * 1000,
          delay: beam.delay * 1000,
          iterations: Infinity,
          easing: 'linear',
        }
      );
    });

    return () => {
      // Cleanup
      while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
      }
    };
  }, []);

  return (
    <motion.svg
      ref={svgRef}
      className={`fixed inset-0 w-full h-full -z-10 pointer-events-none ${className || ''}`}
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="beamGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0" />
          <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="beamGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06B6D4" stopOpacity="0" />
          <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
}