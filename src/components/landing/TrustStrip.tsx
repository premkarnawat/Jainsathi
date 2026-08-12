import React from 'react';
import { UserCheck, Sparkles, HeartHandshake, Building2, Headset } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  return (
    <section className="bg-[#FFF9F1] border-y border-[#D6A24A]/25 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
        
        <div className="flex flex-col items-center space-y-1.5 p-3 rounded-2xl transition-all hover:bg-white/60">
          <div className="w-12 h-12 rounded-full bg-[#F8E8EA] border border-[#9E183A]/20 flex items-center justify-center text-[#9E183A] shadow-sm">
            <UserCheck className="w-6 h-6" />
          </div>
          <span className="font-serif text-2xl font-bold text-[#6E1231]">50K+</span>
          <span className="text-xs text-[#756B70] font-medium">Profiles Created</span>
        </div>

        <div className="flex flex-col items-center space-y-1.5 p-3 rounded-2xl transition-all hover:bg-white/60">
          <div className="w-12 h-12 rounded-full bg-[#F8E8EA] border border-[#9E183A]/20 flex items-center justify-center text-[#9E183A] shadow-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="font-serif text-2xl font-bold text-[#6E1231]">10K+</span>
          <span className="text-xs text-[#756B70] font-medium">Successful Matches</span>
        </div>

        <div className="flex flex-col items-center space-y-1.5 p-3 rounded-2xl transition-all hover:bg-white/60">
          <div className="w-12 h-12 rounded-full bg-[#F8E8EA] border border-[#9E183A]/20 flex items-center justify-center text-[#9E183A] shadow-sm">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <span className="font-serif text-2xl font-bold text-[#6E1231]">25K+</span>
          <span className="text-xs text-[#756B70] font-medium">Happy Families</span>
        </div>

        <div className="flex flex-col items-center space-y-1.5 p-3 rounded-2xl transition-all hover:bg-white/60">
          <div className="w-12 h-12 rounded-full bg-[#F8E8EA] border border-[#9E183A]/20 flex items-center justify-center text-[#9E183A] shadow-sm">
            <Building2 className="w-6 h-6" />
          </div>
          <span className="font-serif text-2xl font-bold text-[#6E1231]">15+</span>
          <span className="text-xs text-[#756B70] font-medium">Jain Communities</span>
        </div>

        <div className="col-span-2 md:col-span-1 flex flex-col items-center space-y-1.5 p-3 rounded-2xl transition-all hover:bg-white/60">
          <div className="w-12 h-12 rounded-full bg-[#F8E8EA] border border-[#9E183A]/20 flex items-center justify-center text-[#9E183A] shadow-sm">
            <Headset className="w-6 h-6" />
          </div>
          <span className="font-serif text-2xl font-bold text-[#6E1231]">24/7</span>
          <span className="text-xs text-[#756B70] font-medium">Dedicated Support</span>
        </div>

      </div>
    </section>
  );
};
