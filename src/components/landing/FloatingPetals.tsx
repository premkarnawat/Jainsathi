'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface PetalConfig {
  id: number;
  left: number; // percentage from 0 to 100
  size: number; // in pixels
  duration: number; // in seconds
  delay: number; // in seconds
  initialRotation: number;
  opacity: number;
}

export default function FloatingPetals() {
  const [petals, setPetals] = useState<PetalConfig[]>([]);

  useEffect(() => {
    // Generate medium amount of petals (14 petals) distributed across the screen
    const mediumPetals: PetalConfig[] = [
      { id: 1, left: 6, size: 48, duration: 18, delay: 0, initialRotation: 15, opacity: 0.8 },
      { id: 2, left: 16, size: 36, duration: 22, delay: 3, initialRotation: -25, opacity: 0.65 },
      { id: 3, left: 24, size: 52, duration: 16, delay: 7, initialRotation: 40, opacity: 0.85 },
      { id: 4, left: 34, size: 40, duration: 24, delay: 1, initialRotation: -10, opacity: 0.7 },
      { id: 5, left: 45, size: 44, duration: 20, delay: 9, initialRotation: 30, opacity: 0.75 },
      { id: 6, left: 54, size: 38, duration: 23, delay: 4, initialRotation: -35, opacity: 0.65 },
      { id: 7, left: 63, size: 50, duration: 17, delay: 11, initialRotation: 20, opacity: 0.8 },
      { id: 8, left: 72, size: 42, duration: 21, delay: 2, initialRotation: -15, opacity: 0.75 },
      { id: 9, left: 81, size: 46, duration: 19, delay: 8, initialRotation: 45, opacity: 0.8 },
      { id: 10, left: 91, size: 36, duration: 25, delay: 5, initialRotation: -30, opacity: 0.6 },
      { id: 11, left: 12, size: 44, duration: 20, delay: 12, initialRotation: 10, opacity: 0.7 },
      { id: 12, left: 38, size: 48, duration: 18, delay: 14, initialRotation: -20, opacity: 0.75 },
      { id: 13, left: 68, size: 38, duration: 22, delay: 16, initialRotation: 35, opacity: 0.65 },
      { id: 14, left: 86, size: 52, duration: 17, delay: 10, initialRotation: -40, opacity: 0.8 },
    ];
    setPetals(mediumPetals);
  }, []);

  if (petals.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-20 select-none">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          initial={{
            y: '-10vh',
            x: 0,
            rotate: petal.initialRotation,
            opacity: 0,
          }}
          animate={{
            y: '110vh',
            x: [-25, 30, -20, 25, 0],
            rotate: [petal.initialRotation, petal.initialRotation + 160, petal.initialRotation + 340],
            opacity: [0, petal.opacity, petal.opacity, 0],
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            left: `${petal.left}%`,
            width: petal.size,
            height: Math.round(petal.size * 0.72),
          }}
          className="will-change-transform drop-shadow-sm"
        >
          <div className="relative w-full h-full">
            <Image
              src="/images/lotus-petal.png"
              alt="Lotus Petal"
              fill
              className="object-contain"
              sizes={`${petal.size}px`}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
