'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface LotusProps {
  className?: string;
  size?: number;
  rotation?: number;
  opacity?: number;
}

export function LotusBlossom({ className = '', size = 150, rotation = 0, opacity = 0.95 }: LotusProps) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      whileInView={{ scale: 1, opacity }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`pointer-events-none select-none relative ${className}`}
      style={{ 
        width: size, 
        height: size, 
        transform: `rotate(${rotation}deg)` 
      }}
    >
      <Image
        src="/images/real-lotus.png"
        alt="Sacred Lotus Flower"
        fill
        className="object-contain drop-shadow-xl"
        sizes={`${size}px`}
      />
    </motion.div>
  );
}

export function SingleLotusPetal({ className = '', size = 60, rotation = 0 }: LotusProps) {
  return (
    <motion.div
      animate={{ 
        y: [-4, 5, -4],
        rotate: [rotation - 2, rotation + 2, rotation - 2]
      }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      className={`pointer-events-none select-none relative ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/images/real-lotus.png"
        alt="Lotus Petal"
        fill
        className="object-contain drop-shadow-md"
        sizes={`${size}px`}
      />
    </motion.div>
  );
}
