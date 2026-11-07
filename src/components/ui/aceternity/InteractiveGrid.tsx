"use client";
import React, { useEffect } from "react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";

interface InteractiveGridProps {
  className?: string;
}

export const InteractiveGrid = ({ className }: InteractiveGridProps) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Use clientX and clientY directly. Because we force dir="ltr" below,
      // this will ALWAYS map correctly to the CSS left/top, regardless of RTL.
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div
      className={className}
      dir="ltr"
      style={{ direction: "ltr" }}
    >
      {/* The Grid Background - EXACT same classes as before */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* The Mouse Glow - Using a standard div with radial-gradient instead of mask-image */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              rgba(139, 92, 246, 0.15),
              transparent 80%
            )
          `,
        }}
      />
    </div>
  );
};