import React from 'react';
import { ShieldCheck, Lock, Sparkles, HeartHandshake } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  return (
    <section className="bg-[#FFF9F1] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#D6A24A]/25">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Title */}
        <div className="text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#100A18] tracking-tight">
            Built Around Trust, Family & Jain Values
          </h2>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white border border-[#D6A24A]/25 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#D6A24A]/55">
            <div className="w-10 h-10 rounded-full bg-[#3E8B68]/10 text-[#3E8B68] flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#100A18] mb-2">Verified Profiles</h3>
            <p className="text-xs text-[#756B70] leading-relaxed font-medium">
              Every profile is verified for authenticity and trust.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-[#D6A24A]/25 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#D6A24A]/55">
            <div className="w-10 h-10 rounded-full bg-[#6E1231]/10 text-[#6E1231] flex items-center justify-center mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#100A18] mb-2">Privacy Protected</h3>
            <p className="text-xs text-[#756B70] leading-relaxed font-medium">
              Your information is safe and always in your control.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-[#D6A24A]/25 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#D6A24A]/55">
            <div className="w-10 h-10 rounded-full bg-[#D6A24A]/10 text-[#D6A24A] flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#100A18] mb-2">Smart Compatibility</h3>
            <p className="text-xs text-[#756B70] leading-relaxed font-medium">
              Matches based on preferences, values and lifestyle.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-[#D6A24A]/25 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#D6A24A]/55">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#100A18] mb-2">Family Friendly</h3>
            <p className="text-xs text-[#756B70] leading-relaxed font-medium">
              Designed for individuals, parents and guardians.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
