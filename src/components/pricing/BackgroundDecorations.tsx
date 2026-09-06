'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function BackgroundDecorations() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* 1. Warm Ivory Base with Subtle Luxury Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFF9F3] via-[#FDF5EE] to-[#F8EFE8]" />

      {/* 2. Soft Burgundy Ambient Radial Glow (Top Right) */}
      <div 
        className="absolute -top-32 -right-32 w-[380px] h-[380px] sm:w-[520px] sm:h-[520px] rounded-full opacity-[0.14] blur-[90px]"
        style={{ background: 'radial-gradient(circle, #8F173D 0%, #6E1735 40%, transparent 70%)' }}
      />

      {/* 3. Warm Champagne Gold Radial Glow (Bottom Left) */}
      <div 
        className="absolute -bottom-28 -left-28 w-[360px] h-[360px] sm:w-[500px] sm:h-[500px] rounded-full opacity-[0.16] blur-[80px]"
        style={{ background: 'radial-gradient(circle, #D9A441 0%, #E9C77B 40%, transparent 70%)' }}
      />

      {/* 4. Center Gentle Plum Sheen */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full opacity-[0.06] blur-[70px]"
        style={{ background: 'radial-gradient(circle, #24131D 0%, transparent 70%)' }}
      />

      {/* 5. Subtle Indian Lotus Geometric Curve Lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.04] stroke-[#8F173D]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 800 1200"
        preserveAspectRatio="xMidYMid slice"
      >
        <circle cx="400" cy="600" r="320" strokeWidth="1" strokeDasharray="4 6" />
        <circle cx="400" cy="600" r="460" strokeWidth="0.8" />
        <path
          d="M 400,280 C 460,380 460,520 400,600 C 340,520 340,380 400,280 Z"
          strokeWidth="1.2"
        />
        <path
          d="M 400,600 C 460,680 460,820 400,920 C 340,820 340,680 400,600 Z"
          strokeWidth="1.2"
        />
        <path
          d="M 280,400 C 380,460 520,460 600,400 C 520,340 380,340 280,400 Z"
          strokeWidth="1.2"
        />
        <path
          d="M 280,800 C 380,740 520,740 600,800 C 520,860 380,860 280,800 Z"
          strokeWidth="1.2"
        />
      </svg>

      {/* 6. Slow Floating Rose / Lotus Petals (Motion-Restrained) */}
      {[
        { id: 1, x: '12%', y: '18%', duration: 18, delay: 0, scale: 0.8 },
        { id: 2, x: '82%', y: '28%', duration: 22, delay: 4, scale: 1.1 },
        { id: 3, x: '24%', y: '72%', duration: 20, delay: 2, scale: 0.9 },
        { id: 4, x: '78%', y: '82%', duration: 24, delay: 7, scale: 1.0 },
      ].map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute"
          style={{ left: petal.x, top: petal.y }}
          animate={{
            y: [0, -25, 0],
            x: [0, 12, 0],
            rotate: [0, 15, -10, 0],
          }}
          transition={{
            duration: petal.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: petal.delay,
          }}
        >
          <svg
            width="26"
            height="38"
            viewBox="0 0 26 38"
            fill="none"
            className="opacity-[0.16]"
            style={{ transform: `scale(${petal.scale})` }}
          >
            <path
              d="M13 0C13 0 26 12 26 25C26 32.1797 20.1797 38 13 38C5.8203 38 0 32.1797 0 25C0 12 13 0 13 0Z"
              fill="url(#petalGrad)"
            />
            <defs>
              <linearGradient id="petalGrad" x1="13" y1="0" x2="13" y2="38" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F4DDE1" />
                <stop offset="1" stopColor="#8F173D" stopOpacity="0.6" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
