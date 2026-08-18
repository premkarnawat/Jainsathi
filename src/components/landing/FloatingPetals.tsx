'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function FloatingPetals() {
  // Pre-configured petals with varying sizes, positions, and animation delays
  const petals = [
    { id: 1, left: '5%', top: '15%', size: 14, delay: 0, duration: 12, rotate: 45, opacity: 0.35 },
    { id: 2, left: '90%', top: '25%', size: 18, delay: 2, duration: 14, rotate: -30, opacity: 0.3 },
    { id: 3, left: '15%', top: '65%', size: 12, delay: 4, duration: 16, rotate: 60, opacity: 0.25 },
    { id: 4, left: '82%', top: '75%', size: 16, delay: 1, duration: 13, rotate: -45, opacity: 0.35 },
    { id: 5, left: '48%', top: '8%', size: 10, delay: 3, duration: 18, rotate: 15, opacity: 0.2 },
    { id: 6, left: '70%', top: '45%', size: 15, delay: 5, duration: 15, rotate: 75, opacity: 0.3 },
  ];

  // Gold dust particles
  const goldParticles = [
    { id: 1, left: '12%', top: '30%', size: 4, delay: 0.5, duration: 8 },
    { id: 2, left: '85%', top: '18%', size: 5, delay: 1.5, duration: 10 },
    { id: 3, left: '25%', top: '85%', size: 3, delay: 2.5, duration: 7 },
    { id: 4, left: '78%', top: '90%', size: 4, delay: 3.5, duration: 9 },
    { id: 5, left: '52%', top: '50%', size: 3, delay: 0, duration: 11 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Rose & Lotus Petal Silhouettes */}
      {petals.map((petal) => (
        <motion.div
          key={`petal-${petal.id}`}
          className="absolute"
          style={{
            left: petal.left,
            top: petal.top,
            width: petal.size,
            height: petal.size * 1.5,
          }}
          initial={{ y: 0, rotate: petal.rotate, opacity: petal.opacity }}
          animate={{
            y: [-15, 20, -15],
            x: [-8, 8, -8],
            rotate: [petal.rotate, petal.rotate + 25, petal.rotate],
            opacity: [petal.opacity * 0.7, petal.opacity, petal.opacity * 0.7],
          }}
          transition={{
            duration: petal.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: petal.delay,
          }}
        >
          {/* Stylized Rose / Lotus Petal Shape */}
          <svg
            viewBox="0 0 30 45"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-sm"
          >
            <path
              d="M15 0C6.71573 0 0 10.0736 0 22.5C0 34.9264 6.71573 45 15 45C23.2843 45 30 34.9264 30 22.5C30 10.0736 23.2843 0 15 0Z"
              fill="url(#petal-gradient)"
            />
            <defs>
              <linearGradient id="petal-gradient" x1="0" y1="0" x2="30" y2="45" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F3E0E3" stopOpacity="0.8" />
                <stop offset="1" stopColor="#C99A45" stopOpacity="0.4" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      ))}

      {/* Champagne Gold Glimmer Particles */}
      {goldParticles.map((p) => (
        <motion.div
          key={`gold-${p.id}`}
          className="absolute rounded-full bg-champagneGold/40 blur-[0.5px]"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
          }}
          animate={{
            scale: [1, 1.6, 1],
            opacity: [0.2, 0.6, 0.2],
            y: [-10, 10, -10],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}
