import React from 'react';
import { ShieldCheck, Sparkles, Lock, Building2, ArrowRight, Play, Star } from 'lucide-react';
import { PremiumButton } from '@/components/ui/PremiumButton';

interface HeroSectionProps {
  onSendOtp?: (phone: string, lookingFor: string, name: string) => void;
  onExploreMatches?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSendOtp,
  onExploreMatches,
}) => {
  return (
    <section className="relative min-h-[85vh] bg-[#FFF9F1] pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Subtle background overlay and lighting */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#6E1231]/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* LEFT COLUMN: Hero Copy (7 Cols) */}
        <div className="lg:col-span-7 space-y-8 text-left">
          <div className="space-y-4">
            <span className="text-xs font-bold tracking-widest text-[#9E183A] uppercase bg-[#F8E8EA] px-3.5 py-1.5 rounded-full border border-[#9E183A]/25">
              Jain Community Matrimony
            </span>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#100A18] leading-[1.15]">
              Find Your <br />
              <span className="text-[#6E1231]">Jain Saathi</span>
            </h1>
            <p className="text-base sm:text-lg text-[#756B70] max-w-xl font-medium leading-relaxed">
              A trusted matrimonial platform designed for meaningful relationships, family involvement and complete privacy.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={onExploreMatches}
              className="bg-[#9E183A] text-[#FFF9F1] font-semibold text-sm px-8 py-3.5 rounded-md hover:bg-[#80122E] transition-all flex items-center gap-2 shadow-lg"
            >
              <span>Create Your Profile</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <button
              onClick={onExploreMatches}
              className="bg-transparent border border-[#6E1231]/40 text-[#6E1231] font-semibold text-sm px-8 py-3.5 rounded-md hover:bg-[#6E1231]/5 transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current text-[#6E1231]" />
              <span>Explore Matches</span>
            </button>
          </div>

          {/* 4 Trust Badges Horizontal Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#D6A24A]/20">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#3E8B68]/10 flex items-center justify-center text-[#3E8B68]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#100A18]">100%</p>
                <p className="text-[10px] text-[#756B70]">Verified Profiles</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#6E1231]/10 flex items-center justify-center text-[#6E1231]">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#100A18]">Privacy</p>
                <p className="text-[10px] text-[#756B70]">Protected</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#D6A24A]/10 flex items-center justify-center text-[#D6A24A]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#100A18]">Smart</p>
                <p className="text-[10px] text-[#756B70]">Matching</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#100A18]">Jain Community</p>
                <p className="text-[10px] text-[#756B70]">Focused</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Premium Indian Couple Portrait (5 Cols) */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          <div className="relative w-full max-w-md rounded-3xl overflow-hidden border border-[#D6A24A]/30 shadow-2xl bg-[#FFF9F1]">
            <img
              src="/mock.jpg"
              alt="Jain Couple in Indian Wedding Attire"
              className="w-full h-[500px] object-cover object-top transition-transform duration-700 hover:scale-[1.02]"
            />
            {/* Soft Gradient Bottom Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>

          {/* Gold Statistics Badge Overlaid */}
          <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md border border-[#D6A24A]/40 p-4 rounded-2xl shadow-xl flex items-center gap-3">
            <div>
              <p className="text-sm font-bold text-[#6E1231]">2,500+</p>
              <p className="text-[10px] text-[#756B70] font-medium">Jain Profiles</p>
              <div className="flex -space-x-1.5 overflow-hidden mt-1.5">
                <img className="inline-block h-5 w-5 rounded-full ring-1 ring-white" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80" alt="" />
                <img className="inline-block h-5 w-5 rounded-full ring-1 ring-white" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80" alt="" />
                <img className="inline-block h-5 w-5 rounded-full ring-1 ring-white" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80" alt="" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
