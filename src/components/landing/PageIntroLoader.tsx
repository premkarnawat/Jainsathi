'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageIntroLoaderProps {
  onComplete?: () => void;
}

export default function PageIntroLoader({ onComplete }: PageIntroLoaderProps) {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // Check if user already saw the intro in this session to prevent repetitive blocking
    const hasSeenIntro = sessionStorage.getItem('js_intro_seen');
    if (hasSeenIntro) {
      setShowLoader(false);
      onComplete?.();
      return;
    }

    const timer = setTimeout(() => {
      setShowLoader(false);
      sessionStorage.setItem('js_intro_seen', 'true');
      onComplete?.();
    }, 2200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {showLoader && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
          }}
          className="fixed inset-0 z-[100] bg-[#F7EEE7] flex flex-col items-center justify-center pointer-events-none"
        >
          {/* Subtle Ambient Gold Radiance */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 0.6 }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
            className="absolute w-80 h-80 rounded-full bg-gradient-to-tr from-champagneGold/20 via-softRose to-transparent blur-2xl"
          />

          {/* Logo Container with 0.92 -> 1 Scale & Gold Glow */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center z-10"
          >
            {/* Monogram Emblem */}
            <motion.div 
              animate={{ 
                boxShadow: [
                  '0 0 0px rgba(212, 166, 74, 0)',
                  '0 0 35px rgba(212, 166, 74, 0.45)',
                  '0 0 15px rgba(212, 166, 74, 0.2)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-deepBurgundy via-[#5E0D28] to-darkBurgundy border-2 border-champagneGold flex items-center justify-center shadow-2xl mb-5"
            >
              <span className="text-champagneGold font-serif italic text-3xl font-bold tracking-tighter">
                JS
              </span>
            </motion.div>

            {/* Brand Typography */}
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
              className="font-serif text-3xl sm:text-4xl font-bold text-deepBurgundy tracking-tight"
            >
              JainSaathi
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-[10px] uppercase tracking-[0.3em] text-champagneGold font-semibold mt-1"
            >
              Find Your Jain Saathi
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
