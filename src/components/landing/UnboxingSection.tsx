'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface UnboxingSectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  delay?: number;
}

export default function UnboxingSection({
  children,
  id,
  className = '',
  delay = 0,
}: UnboxingSectionProps) {
  return (
    <motion.div
      id={id}
      initial={{ 
        opacity: 0, 
        y: 40, 
        scale: 0.96,
        rotateX: 2.5
      }}
      whileInView={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        rotateX: 0
      }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ 
        duration: 0.85, 
        delay, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      className={`perspective-1200 transform-gpu ${className}`}
    >
      {children}
    </motion.div>
  );
}
