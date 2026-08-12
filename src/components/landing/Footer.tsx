import React from 'react';
import { Lock, ShieldCheck, Sparkles, HeartHandshake } from 'lucide-react';
import { JainSaathiLogo } from '@/components/ui/JainSaathiLogo';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

interface FooterProps {
  currentLang?: 'en' | 'hi';
  onLanguageChange?: (lang: 'en' | 'hi') => void;
}

export const Footer: React.FC<FooterProps> = ({ currentLang = 'en', onLanguageChange }) => {
  return (
    <footer className="bg-[#100A18] text-[#FFF9F1] border-t border-[#D6A24A]/20">
      
      {/* Top 4 Trust Icons Strip matching reference image */}
      <div className="border-b border-[#D6A24A]/15 py-8 px-4 sm:px-6 lg:px-8 bg-[#6E1231]/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-[#D6A24A]/20">
            <div className="w-10 h-10 rounded-full bg-[#9E183A]/30 text-[#F3D59B] border border-[#D6A24A]/30 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#FFF9F1]">Secure & Private</h4>
              <p className="text-xs text-[#F3D59B]/70">Your data is 100% safe</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-[#D6A24A]/20">
            <div className="w-10 h-10 rounded-full bg-[#9E183A]/30 text-[#F3D59B] border border-[#D6A24A]/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#FFF9F1]">Manual Verification</h4>
              <p className="text-xs text-[#F3D59B]/70">Every profile verified</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-[#D6A24A]/20">
            <div className="w-10 h-10 rounded-full bg-[#9E183A]/30 text-[#F3D59B] border border-[#D6A24A]/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#FFF9F1]">Smart Matching</h4>
              <p className="text-xs text-[#F3D59B]/70">Technology with tradition</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-[#D6A24A]/20">
            <div className="w-10 h-10 rounded-full bg-[#9E183A]/30 text-[#F3D59B] border border-[#D6A24A]/30 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#FFF9F1]">Trusted by Families</h4>
              <p className="text-xs text-[#F3D59B]/70">Backed by Jain values</p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Footer Links & Copyright */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div className="space-y-4">
          <JainSaathiLogo variant="dark" size="md" />
          <p className="text-xs text-[#F3D59B]/70 leading-relaxed">
            JainSaathi is a verified, Jain-only matrimony platform designed to simplify traditional Jain matchmaking with modern technology, privacy safeguards, and family-centered respect.
          </p>
          <LanguageSwitcher currentLang={currentLang} onLanguageChange={onLanguageChange} variant="dark" />
        </div>

        <div>
          <h4 className="font-serif font-bold text-base text-[#F3D59B] mb-3">Explore</h4>
          <ul className="space-y-2 text-xs text-[#FFF9F1]/80">
            <li><a href="#about" className="hover:text-[#D6A24A] transition-colors">About JainSaathi</a></li>
            <li><a href="#features" className="hover:text-[#D6A24A] transition-colors">Verified Jain Profiles</a></li>
            <li><a href="#howitworks" className="hover:text-[#D6A24A] transition-colors">Digital Biodata Generator</a></li>
            <li><a href="#pricing" className="hover:text-[#D6A24A] transition-colors">Membership Plans</a></li>
            <li><a href="#stories" className="hover:text-[#D6A24A] transition-colors">Success Stories</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif font-bold text-base text-[#F3D59B] mb-3">Trust & Safety</h4>
          <ul className="space-y-2 text-xs text-[#FFF9F1]/80">
            <li><a href="#privacy" className="hover:text-[#D6A24A] transition-colors">Privacy Controls</a></li>
            <li><a href="#terms" className="hover:text-[#D6A24A] transition-colors">Terms of Service</a></li>
            <li><a href="#community" className="hover:text-[#D6A24A] transition-colors">Community Guidelines</a></li>
            <li><a href="#refunds" className="hover:text-[#D6A24A] transition-colors">Refund Policy</a></li>
            <li><a href="#safety" className="hover:text-[#D6A24A] transition-colors">Family Safety Tips</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif font-bold text-base text-[#F3D59B] mb-3">Contact Support</h4>
          <p className="text-xs text-[#F3D59B]/70 mb-3">
            Our family support desk is available to assist you in creating and managing your Jain matrimonial profile.
          </p>
          <div className="space-y-1.5 text-xs text-[#FFF9F1]">
            <p>📧 support@jainsaathi.com</p>
            <p>📞 +91 98765 43210 (Mon-Sat, 9AM-7PM)</p>
          </div>
        </div>

      </div>

      <div className="border-t border-[#D6A24A]/15 py-4 px-4 text-center text-xs text-[#F3D59B]/60">
        © 2026 JainSaathi Matrimony Platform. All rights reserved. "Find Your Jain Saathi."
      </div>
    </footer>
  );
};
