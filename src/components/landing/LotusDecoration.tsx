'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LotusProps {
  className?: string;
  size?: number;
  rotation?: number;
  opacity?: number;
}

export function LotusBlossom({ className = '', size = 120, rotation = 0, opacity = 0.9 }: LotusProps) {
  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      whileInView={{ scale: 1, opacity }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`pointer-events-none select-none ${className}`}
      style={{ width: size, height: size, transform: `rotate(${rotation}deg)` }}
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          <linearGradient id="lotusPinkGrad" x1="100" y1="20" x2="100" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F5B4C4" />
            <stop offset="40%" stopColor="#E6738F" />
            <stop offset="85%" stopColor="#C43B60" />
            <stop offset="100%" stopColor="#8A1839" />
          </linearGradient>
          <linearGradient id="lotusInnerGrad" x1="100" y1="40" x2="100" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFF0F3" />
            <stop offset="50%" stopColor="#F7B2C5" />
            <stop offset="100%" stopColor="#D94E73" />
          </linearGradient>
          <linearGradient id="lotusGoldCenter" x1="100" y1="120" x2="100" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFDE8A" />
            <stop offset="100%" stopColor="#D4A64A" />
          </linearGradient>
        </defs>

        {/* Outer Back Petals */}
        <path
          d="M100 25 C70 65, 30 110, 45 150 C60 185, 140 185, 155 150 C170 110, 130 65, 100 25 Z"
          fill="url(#lotusPinkGrad)"
          opacity="0.8"
        />
        <path
          d="M100 35 C50 70, 10 115, 25 155 C40 190, 85 190, 100 170 C115 190, 160 190, 175 155 C190 115, 150 70, 100 35 Z"
          fill="url(#lotusPinkGrad)"
          opacity="0.75"
        />

        {/* Left Spreading Petal */}
        <path
          d="M100 80 C60 85, 15 110, 10 145 C5 175, 55 185, 80 170 C95 160, 100 130, 100 80 Z"
          fill="url(#lotusInnerGrad)"
          opacity="0.9"
        />

        {/* Right Spreading Petal */}
        <path
          d="M100 80 C140 85, 185 110, 190 145 C195 175, 145 185, 120 170 C105 160, 100 130, 100 80 Z"
          fill="url(#lotusInnerGrad)"
          opacity="0.9"
        />

        {/* Center Main Petal */}
        <path
          d="M100 45 C80 85, 60 130, 75 165 C85 185, 115 185, 125 165 C140 130, 120 85, 100 45 Z"
          fill="url(#lotusInnerGrad)"
        />

        {/* Inner Front Left Petal */}
        <path
          d="M100 95 C75 105, 45 130, 55 165 C65 190, 95 185, 100 175 Z"
          fill="url(#lotusPinkGrad)"
          opacity="0.95"
        />

        {/* Inner Front Right Petal */}
        <path
          d="M100 95 C125 105, 155 130, 145 165 C135 190, 105 185, 100 175 Z"
          fill="url(#lotusPinkGrad)"
          opacity="0.95"
        />

        {/* Golden Core Seed Pod */}
        <ellipse cx="100" cy="155" rx="16" ry="9" fill="url(#lotusGoldCenter)" />
        <circle cx="95" cy="154" r="1.5" fill="#8A5A12" />
        <circle cx="100" cy="153" r="1.5" fill="#8A5A12" />
        <circle cx="105" cy="154" r="1.5" fill="#8A5A12" />
      </svg>
    </motion.div>
  );
}

export function SingleLotusPetal({ className = '', size = 50, rotation = 0 }: LotusProps) {
  return (
    <motion.div
      animate={{ 
        y: [-4, 5, -4],
        rotate: [rotation - 3, rotation + 3, rotation - 3]
      }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      className={`pointer-events-none select-none ${className}`}
      style={{ width: size, height: size * 1.5 }}
    >
      <svg viewBox="0 0 60 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
        <path
          d="M30 0 C10 30, 0 60, 10 80 C20 95, 40 95, 50 80 C60 60, 50 30, 30 0 Z"
          fill="url(#singlePetalGrad)"
        />
        <defs>
          <linearGradient id="singlePetalGrad" x1="30" y1="0" x2="30" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FAD2DC" />
            <stop offset="50%" stopColor="#E87693" />
            <stop offset="100%" stopColor="#9C1C3E" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}
