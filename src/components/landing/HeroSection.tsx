'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  FileText, 
  Award,
  ChevronRight
} from 'lucide-react';

export default function HeroSection() {
  useEffect(() => {
    // Safely check if GSAP is loaded from the CDN
    const initGSAP = () => {
      const gsap = (window as any).gsap;
      const ScrollTrigger = (window as any).ScrollTrigger;
      
      if (gsap && ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);

        // Zoom wedding image slightly on scroll
        gsap.to('.hero-image-zoom', {
          scale: 1.08,
          ease: 'none',
          scrollTrigger: {
            trigger: '#home',
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          }
        });

        // Parallax effects on floating cards
        gsap.to('.parallax-card-1', {
          y: -50,
          x: -12,
          ease: 'none',
          scrollTrigger: {
            trigger: '#home',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
          }
        });

        gsap.to('.parallax-card-2', {
          y: -80,
          x: 18,
          ease: 'none',
          scrollTrigger: {
            trigger: '#home',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
          }
        });

        gsap.to('.parallax-card-3', {
          y: 45,
          x: -15,
          ease: 'none',
          scrollTrigger: {
            trigger: '#home',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.8,
          }
        });

        gsap.to('.parallax-card-4', {
          y: 35,
          x: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: '#home',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.4,
          }
        });
      }
    };

    const timer = setTimeout(initGSAP, 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="home" className="relative min-h-[92vh] flex items-center pt-28 pb-20 overflow-hidden bg-background">
      {/* Decorative Warm Ambient Glows */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[720px] h-[520px] bg-gradient-to-b from-softRose/30 via-champagneGold/10 to-transparent rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* =========================================================
              LEFT COLUMN: EDITORIAL TYPOGRAPHY & CALLS TO ACTION
              ========================================================= */}
          <div className="lg:col-span-6 text-center lg:text-left flex flex-col items-center lg:items-start">
            
            {/* Trust Pill */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-champagneGold/40 shadow-sm backdrop-blur-md mb-6"
            >
              <ShieldCheck className="w-4 h-4 text-deepBurgundy" />
              <span className="text-xs font-semibold uppercase tracking-wider text-deepBurgundy">
                VERIFIED PROFILES • PRIVACY-FIRST MATRIMONY
              </span>
            </motion.div>

            {/* Main Editorial Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
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
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg lg:text-xl text-muted max-w-xl mb-8 leading-relaxed font-sans"
            >
              A trusted Jain matrimony platform built for meaningful relationships, family involvement, authentic profiles and uncompromising privacy.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-10"
            >
              <Link
                href="/register"
                className="btn-ruby w-full sm:w-auto text-base sm:text-lg px-8 py-4 shadow-xl burgundy-glow hover:shadow-2xl transition-all"
              >
                <Sparkles className="w-5 h-5 text-champagneGold" />
                Create Your Profile
              </Link>
              
              <Link
                href="#how-it-works"
                className="btn-gold-outline w-full sm:w-auto text-base sm:text-lg px-8 py-4 bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm transition-all"
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
              RIGHT COLUMN: REFERENCE 1 LAYERED FLOATING COMPOSITION
              ========================================================= */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            
            {/* Reference 1 Style: Circular Geometric Backdrop with subtle rotation */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[440px] h-[440px] rounded-full border-2 border-dashed border-champagneGold/35 pointer-events-none -z-0"
            />
            <div className="absolute w-[380px] h-[380px] rounded-full bg-gradient-to-tr from-champagneGold/20 via-softRose/30 to-white/40 blur-xl pointer-events-none -z-0" />

            {/* Main Luxury Image Canvas Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[460px] aspect-[4/5] rounded-[36px] overflow-hidden p-2.5 bg-gradient-to-b from-[#FFFDF9] to-softRose/40 border-2 border-champagneGold/50 shadow-2xl shadow-deepBurgundy/15 z-10"
            >
              <div className="relative w-full h-full rounded-[28px] overflow-hidden bg-[#24191D]">
                <Image
                  src="/images/hero-wedding.jpg"
                  alt="JainSaathi Wedding Couple in Traditional Elegance"
                  fill
                  className="object-cover object-center hero-image-zoom transition-transform duration-700"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 460px"
                />
                
                {/* Subtle Luxury Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#24191D]/75 via-transparent to-transparent pointer-events-none" />
                
                {/* Bottom Badge Inside Canvas */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/60 shadow-lg text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[9.5px] font-bold uppercase tracking-widest text-champagneGold">
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
                4 FLOATING CONCEPT CARDS (Continuous 3D Floating Physics)
                ===================================================== */}
            
            {/* Card 1: 100% Identity Verified */}
            <motion.div
              initial={{ opacity: 0, x: -30, y: -20 }}
              animate={{ 
                opacity: 1, 
                x: 0, 
                y: [-3, 5, -3],
              }}
              transition={{ 
                opacity: { duration: 0.8, delay: 0.4 },
                x: { duration: 0.8, delay: 0.4 },
                y: { duration: 5, repeat: Infinity, ease: 'easeInOut' }
              }}
              className="absolute -top-4 -left-4 sm:-left-8 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border border-border shadow-xl shadow-deepBurgundy/10 flex items-center gap-3 parallax-card-1"
            >
              <div className="w-10 h-10 rounded-xl bg-success/10 border border-success/30 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-success" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-text">100% Identity Verified</div>
                <div className="text-[10px] text-muted font-medium">Aadhaar & Live Selfie</div>
              </div>
            </motion.div>

            {/* Card 2: Smart Match 92% */}
            <motion.div
              initial={{ opacity: 0, x: 30, y: -20 }}
              animate={{ 
                opacity: 1, 
                x: 0, 
                y: [4, -5, 4],
              }}
              transition={{ 
                opacity: { duration: 0.8, delay: 0.5 },
                x: { duration: 0.8, delay: 0.5 },
                y: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }
              }}
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

            {/* Card 3: Privacy Protected */}
            <motion.div
              initial={{ opacity: 0, x: -30, y: 30 }}
              animate={{ 
                opacity: 1, 
                x: 0, 
                y: [3, -5, 3],
              }}
              transition={{ 
                opacity: { duration: 0.8, delay: 0.6 },
                x: { duration: 0.8, delay: 0.6 },
                y: { duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }
              }}
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

            {/* Card 4: Digital Biodata */}
            <motion.div
              initial={{ opacity: 0, x: 30, y: 30 }}
              animate={{ 
                opacity: 1, 
                x: 0, 
                y: [-4, 4, -4],
              }}
              transition={{ 
                opacity: { duration: 0.8, delay: 0.7 },
                x: { duration: 0.8, delay: 0.7 },
                y: { duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }
              }}
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
