'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  FileText, 
  HeartHandshake, 
  Award,
  ChevronRight
} from 'lucide-react';
import FloatingPetals from './FloatingPetals';

export default function HeroSection() {
  React.useEffect(() => {
    // Safely check if GSAP is loaded from the CDN
    const initGSAP = () => {
      const gsap = (window as any).gsap;
      const ScrollTrigger = (window as any).ScrollTrigger;
      
      if (gsap && ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);

        // Zoom wedding image on scroll
        gsap.to('.hero-image-zoom', {
          scale: 1.12,
          ease: 'none',
          scrollTrigger: {
            trigger: '#home',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          }
        });

        // Parallax effects on floating cards
        gsap.to('.parallax-card-1', {
          y: -60,
          x: -15,
          ease: 'none',
          scrollTrigger: {
            trigger: '#home',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          }
        });

        gsap.to('.parallax-card-2', {
          y: -100,
          x: 25,
          ease: 'none',
          scrollTrigger: {
            trigger: '#home',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          }
        });

        gsap.to('.parallax-card-3', {
          y: 60,
          x: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: '#home',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          }
        });

        gsap.to('.parallax-card-4', {
          y: 40,
          x: 15,
          ease: 'none',
          scrollTrigger: {
            trigger: '#home',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          }
        });
      }
    };

    // If script isn't fully loaded, retry briefly
    const timer = setTimeout(initGSAP, 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="home" className="relative min-h-[92vh] flex items-center pt-28 pb-16 overflow-hidden bg-background">
      {/* Decorative Warm Ambient Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-softRose/40 via-champagneGold/10 to-transparent rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* =========================================================
              LEFT COLUMN: LUXURY EDITORIAL TYPOGRAPHY & CTAs
              ========================================================= */}
          <div className="lg:col-span-6 text-center lg:text-left flex flex-col items-center lg:items-start">
            
            {/* Trust Pill */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-champagneGold/40 shadow-sm backdrop-blur-md mb-6"
            >
              <ShieldCheck className="w-4 h-4 text-deepBurgundy" />
              <span className="text-xs font-semibold uppercase tracking-wider text-deepBurgundy">
                Verified Profiles • Privacy-First Matrimony
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
              className="font-serif text-5xl sm:text-6xl xl:text-7xl font-bold text-text leading-[1.08] tracking-tight mb-6"
            >
              Find Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-deepBurgundy via-darkBurgundy to-champagneGold italic font-normal">
                Jain Saathi
              </span>
            </motion.h1>

            {/* Supporting Statement */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="text-base sm:text-lg lg:text-xl text-muted max-w-xl mb-8 leading-relaxed font-sans"
            >
              A trusted Jain matrimony platform built for meaningful relationships, family involvement, and uncompromising privacy.
            </motion.p>

            {/* CTA Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-10"
            >
              <Link
                href="/register"
                className="btn-ruby w-full sm:w-auto text-base sm:text-lg px-8 py-4 shadow-xl shadow-deepBurgundy/20 hover:shadow-2xl transition-all"
              >
                <Sparkles className="w-5 h-5 text-champagneGold" />
                Create Your Profile
              </Link>
              
              <Link
                href="#how-it-works"
                className="btn-gold-outline w-full sm:w-auto text-base sm:text-lg px-8 py-4 bg-white/70 backdrop-blur-sm hover:bg-white shadow-sm transition-all"
              >
                Find Your Match
                <ChevronRight className="w-4 h-4 text-deepBurgundy" />
              </Link>
            </motion.div>

            {/* Trust Line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex items-center gap-3 text-xs sm:text-sm font-medium text-muted/90 border-t border-border/80 pt-6 w-full lg:w-auto"
            >
              <Award className="w-4 h-4 text-champagneGold shrink-0" />
              <span>Built for Jain families. Designed for meaningful connections.</span>
            </motion.div>
          </div>

          {/* =========================================================
              RIGHT COLUMN: EDITORIAL CANVAS WITH WEDDING IMAGE & CARDS
              ========================================================= */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            
            {/* Main Luxury Image Canvas Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
              className="relative w-full max-w-[460px] aspect-[4/5] rounded-[32px] overflow-hidden p-2.5 bg-gradient-to-b from-[#FFFDF9] to-softRose/40 border-2 border-champagneGold/40 shadow-2xl shadow-deepBurgundy/15"
            >
              <div className="relative w-full h-full rounded-[24px] overflow-hidden bg-[#24191D]">
                <Image
                  src="/images/hero-wedding.jpg"
                  alt="JainSaathi Wedding Couple in Traditional Elegance"
                  fill
                  className="object-cover object-center hero-image-zoom transition-transform duration-700"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 460px"
                />
                
                {/* Subtle Luxury Gradient Overlay (Keeps couple sharp) */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#24191D]/75 via-transparent to-transparent pointer-events-none" />
                
                {/* Bottom Card Inside Canvas */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white/40 shadow-lg text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-champagneGold">
                        Traditional Linchpin
                      </span>
                      <h4 className="font-serif font-bold text-base text-deepBurgundy">
                        Rooted in Jain Sanskaar
                      </h4>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-deepBurgundy text-champagneGold flex items-center justify-center font-serif text-sm font-bold shadow-md">
                      JS
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* =====================================================
                FLOATING PRODUCT CONCEPT CARDS (With subtle parallax)
                ===================================================== */}
            
            {/* Top-Left Floating Card: Verified Status */}
            <motion.div
              initial={{ opacity: 0, x: -30, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
              className="absolute -top-4 -left-4 sm:-left-8 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border border-border shadow-xl shadow-deepBurgundy/10 flex items-center gap-3 parallax-card-1"
            >
              <div className="w-10 h-10 rounded-xl bg-success/10 border border-success/30 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-success" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-text">100% ID Verified</div>
                <div className="text-[10px] text-muted font-medium">Aadhaar & Live Selfie</div>
              </div>
            </motion.div>

            {/* Top-Right Floating Card: 92% Compatibility */}
            <motion.div
              initial={{ opacity: 0, x: 30, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
              className="absolute top-12 -right-4 sm:-right-8 z-20 bg-gradient-to-br from-deepBurgundy to-[#5C0D28] text-white rounded-2xl p-4 border border-champagneGold/40 shadow-xl shadow-deepBurgundy/20 text-left parallax-card-2"
            >
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-champagneGold" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-champagneGold">
                  Smart Match
                </span>
              </div>
              <div className="font-serif text-2xl font-bold leading-none">
                92% <span className="text-xs font-sans font-normal text-white/80">Compatibility</span>
              </div>
              <div className="text-[10px] text-white/70 mt-1">Sect • Gotra • Lifestyle</div>
            </motion.div>

            {/* Bottom-Left Floating Card: Privacy Protected */}
            <motion.div
              initial={{ opacity: 0, x: -30, y: 30 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
              className="absolute -bottom-6 -left-4 sm:-left-6 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border border-border shadow-xl shadow-deepBurgundy/10 flex items-center gap-3 parallax-card-3"
            >
              <div className="w-10 h-10 rounded-xl bg-softRose border border-champagneGold/30 flex items-center justify-center">
                <Lock className="w-5 h-5 text-deepBurgundy" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-text">Privacy Protected</div>
                <div className="text-[10px] text-muted">Photos & Contacts Locked</div>
              </div>
            </motion.div>

            {/* Bottom-Right Floating Card: Digital Biodata */}
            <motion.div
              initial={{ opacity: 0, x: 30, y: 30 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
              className="hidden sm:flex absolute -bottom-4 -right-6 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border border-border shadow-xl shadow-deepBurgundy/10 items-center gap-3 parallax-card-4"
            >
              <div className="w-10 h-10 rounded-xl bg-champagneGold/15 border border-champagneGold/40 flex items-center justify-center">
                <FileText className="w-5 h-5 text-champagneGold" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-text">Digital Biodata</div>
                <div className="text-[10px] text-muted">4-Gotra Lineage Verified</div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
