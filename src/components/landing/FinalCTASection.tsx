import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, ChevronRight, Heart } from 'lucide-react';

export default function FinalCTASection() {
  React.useEffect(() => {
    // Parallax background zoom on scroll
    const gsap = (window as any).gsap;
    const ScrollTrigger = (window as any).ScrollTrigger;
    if (gsap && ScrollTrigger) {
      gsap.to('.cta-bg-zoom', {
        scale: 1.1,
        ease: 'none',
        scrollTrigger: {
          trigger: '#final-cta',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });
    }
  }, []);

  return (
    <section id="final-cta" className="relative py-36 overflow-hidden text-center bg-[#5E0D28]">
      {/* Matrimonial Wedding Image Parallax Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-wedding.jpg"
          alt="JainSaathi Matrimony Union"
          fill
          className="object-cover object-center opacity-25 cta-bg-zoom transition-transform duration-700"
          sizes="100vw"
        />
        {/* Dark Burgundy Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#5E0D28]/90 via-[#5E0D28]/95 to-[#5E0D28]" />
      </div>

      {/* Decorative Golden Ring / Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-gradient-to-tr from-champagneGold/20 via-softRose/10 to-transparent rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center">
          {/* Logo Badge */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-deepBurgundy to-[#5E0D28] border-2 border-champagneGold flex items-center justify-center mb-8 shadow-xl shadow-black/20">
            <span className="text-champagneGold font-serif italic text-2xl font-bold">JS</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Your Jain Saathi Could Be <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-champagneGold via-softGold to-champagneGold italic font-normal">
              Closer Than You Think.
            </span>
          </h2>

          <p className="text-base sm:text-lg lg:text-xl text-white/80 max-w-2xl mb-10 leading-relaxed">
            Create a trusted profile and begin your journey toward a meaningful Jain connection.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              href="/register"
              className="btn-ruby w-full sm:w-auto text-base sm:text-lg px-9 py-4 bg-champagneGold text-deepBurgundy border-champagneGold hover:bg-white hover:text-deepBurgundy shadow-xl shadow-black/25 transition-all"
            >
              <Sparkles className="w-5 h-5 text-deepBurgundy" />
              Create Your Profile
            </Link>

            <Link
              href="/login"
              className="btn-gold-outline w-full sm:w-auto text-base sm:text-lg px-8 py-4 border-white/40 text-white hover:bg-white/10 shadow-sm transition-all"
            >
              Login
              <ChevronRight className="w-4 h-4 text-white" />
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-2 text-xs font-semibold text-champagneGold">
            <Heart className="w-3.5 h-3.5 fill-champagneGold" />
            <span>Built with devotion for the global Jain community</span>
          </div>
        </div>
      </div>
    </section>
  );
}
