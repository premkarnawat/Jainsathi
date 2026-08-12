import React, { useState } from 'react';
import { ShieldCheck, Sparkles, Lock, FileText, ArrowRight, Play, Star, Phone, User } from 'lucide-react';
import { PremiumButton } from '@/components/ui/PremiumButton';

interface HeroSectionProps {
  onSendOtp?: (phone: string, lookingFor: string, name: string) => void;
  onExploreMatches?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSendOtp,
  onExploreMatches,
}) => {
  const [lookingFor, setLookingFor] = useState<'bride' | 'groom'>('bride');
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileNumber || mobileNumber.length < 10) return;
    setOtpSent(true);
    if (onSendOtp) onSendOtp(mobileNumber, lookingFor, fullName);
  };

  return (
    <section className="relative min-h-[90vh] bg-gradient-to-b from-[#100A18] via-[#6E1231]/30 to-[#100A18] pt-8 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Subtle Mandala Radial Blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-r from-[#9E183A]/20 via-[#D6A24A]/10 to-[#6E1231]/20 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* LEFT COLUMN: Hero Copy & Value Proposition (5 Cols) */}
        <div className="lg:col-span-5 space-y-6 text-left">
          <div className="space-y-2">
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#FFF9F1] leading-[1.1]">
              Find Your <br />
              <span className="gold-gradient-text">Jain Saathi</span>
            </h1>
            <p className="text-lg sm:text-xl text-[#F3D59B] font-light max-w-lg mt-3">
              Trusted Jain Matrimony Platform for Meaningful Relationships
            </p>
          </div>

          {/* 4 Feature Pills Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
            <div className="flex flex-col items-center p-2.5 rounded-xl bg-white/5 border border-[#D6A24A]/20 text-center">
              <ShieldCheck className="w-5 h-5 text-[#D6A24A] mb-1" />
              <span className="text-xs font-semibold text-[#FFF9F1]">100%</span>
              <span className="text-[10px] text-[#F3D59B]/80">Verified Profiles</span>
            </div>
            <div className="flex flex-col items-center p-2.5 rounded-xl bg-white/5 border border-[#D6A24A]/20 text-center">
              <Sparkles className="w-5 h-5 text-[#D6A24A] mb-1" />
              <span className="text-xs font-semibold text-[#FFF9F1]">Smart</span>
              <span className="text-[10px] text-[#F3D59B]/80">Matching</span>
            </div>
            <div className="flex flex-col items-center p-2.5 rounded-xl bg-white/5 border border-[#D6A24A]/20 text-center">
              <Lock className="w-5 h-5 text-[#D6A24A] mb-1" />
              <span className="text-xs font-semibold text-[#FFF9F1]">Privacy</span>
              <span className="text-[10px] text-[#F3D59B]/80">Protected</span>
            </div>
            <div className="flex flex-col items-center p-2.5 rounded-xl bg-white/5 border border-[#D6A24A]/20 text-center">
              <FileText className="w-5 h-5 text-[#D6A24A] mb-1" />
              <span className="text-xs font-semibold text-[#FFF9F1]">Digital</span>
              <span className="text-[10px] text-[#F3D59B]/80">Biodata</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <PremiumButton variant="ruby" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
              Create Your Profile
            </PremiumButton>
            
            <button
              onClick={onExploreMatches}
              className="btn-gold-outline py-3 px-6 text-sm flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current text-[#D6A24A]" />
              <span>Explore Matches</span>
            </button>
          </div>

          {/* Social Proof Avatars */}
          <div className="pt-4 flex items-center gap-3">
            <div className="flex -space-x-2 overflow-hidden">
              <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#D6A24A]" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="User" />
              <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#D6A24A]" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="User" />
              <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#D6A24A]" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="User" />
              <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#D6A24A]" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="User" />
            </div>
            <div className="text-xs text-[#F3D59B]">
              <div className="flex items-center gap-1 font-bold text-[#FFF9F1]">
                <span>4.8</span>
                <div className="flex text-[#D6A24A]">
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                </div>
              </div>
              <p className="text-[11px] text-[#F3D59B]/70">Trusted by Thousands of Jain Families</p>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Indian Jain Couple Visual (3.5 Cols) */}
        <div className="lg:col-span-3 relative flex items-center justify-center py-4">
          <div className="relative w-full max-w-sm rounded-3xl overflow-hidden border-2 border-[#D6A24A]/40 shadow-2xl bg-gradient-to-b from-[#6E1231] to-[#100A18]">
            <img
              src="/mock.jpg"
              alt="Jain Couple in Indian Wedding Attire"
              className="w-full h-[420px] object-cover object-center transform hover:scale-105 transition-transform duration-700"
            />
            {/* Soft Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#100A18] via-transparent to-transparent opacity-60" />
          </div>

          {/* Overlaid Glass Stat Card */}
          <div className="absolute bottom-6 right-0 sm:-right-4 bg-[#100A18]/85 backdrop-blur-md border border-[#D6A24A]/40 p-3 rounded-2xl shadow-xl flex items-center gap-3">
            <div className="flex -space-x-1.5 overflow-hidden">
              <img className="inline-block h-6 w-6 rounded-full ring-1 ring-[#D6A24A]" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100" alt="" />
              <img className="inline-block h-6 w-6 rounded-full ring-1 ring-[#D6A24A]" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100" alt="" />
              <img className="inline-block h-6 w-6 rounded-full ring-1 ring-[#D6A24A]" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" alt="" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#FFF9F1]">2,500+</p>
              <p className="text-[10px] text-[#F3D59B]">Verified Jain Profiles</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Frosted Glass Join Form Card (3.5 Cols) */}
        <div className="lg:col-span-4">
          <div className="glass-card-dark p-6 sm:p-7 border border-[#D6A24A]/35 shadow-2xl relative">
            <h2 className="font-serif text-2xl font-bold text-[#FFF9F1] text-center">
              Join JainSaathi
            </h2>
            <p className="text-xs text-[#F3D59B] text-center mt-1 mb-5">
              Create your account and find meaningful Jain matches.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Looking For Switcher */}
              <div>
                <label className="block text-xs font-medium text-[#F3D59B] mb-1.5">
                  I'm looking for
                </label>
                <div className="grid grid-cols-2 gap-2 bg-[#100A18]/60 p-1 rounded-xl border border-[#D6A24A]/20">
                  <button
                    type="button"
                    onClick={() => setLookingFor('bride')}
                    className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                      lookingFor === 'bride'
                        ? 'bg-[#9E183A] text-white shadow'
                        : 'text-[#F3D59B]/70 hover:text-white'
                    }`}
                  >
                    <span>👰</span> Bride
                  </button>
                  <button
                    type="button"
                    onClick={() => setLookingFor('groom')}
                    className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                      lookingFor === 'groom'
                        ? 'bg-[#9E183A] text-white shadow'
                        : 'text-[#F3D59B]/70 hover:text-white'
                    }`}
                  >
                    <span>🤵</span> Groom
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-medium text-[#F3D59B] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-[#D6A24A]" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-[#100A18]/70 border border-[#D6A24A]/30 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#D6A24A]"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-medium text-[#F3D59B] mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-[#D6A24A]" />
                  <input
                    type="tel"
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="+91 · 98765 43210"
                    className="w-full bg-[#100A18]/70 border border-[#D6A24A]/30 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#D6A24A]"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full btn-ruby py-3 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg mt-2"
              >
                <span>{otpSent ? 'OTP Sent!' : 'Send OTP'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Or Continue With Separator */}
              <div className="flex items-center my-3">
                <div className="flex-grow border-t border-[#D6A24A]/20"></div>
                <span className="px-3 text-[10px] text-[#F3D59B]/60 uppercase tracking-wider">or continue with</span>
                <div className="flex-grow border-t border-[#D6A24A]/20"></div>
              </div>

              {/* Social Login Buttons */}
              <div className="flex justify-center gap-4">
                <button type="button" className="w-10 h-10 rounded-full bg-white/5 border border-[#D6A24A]/20 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <span className="text-[#FFF9F1] font-bold text-sm">G</span>
                </button>
                <button type="button" className="w-10 h-10 rounded-full bg-white/5 border border-[#D6A24A]/20 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <span className="text-[#FFF9F1] font-bold text-sm">A</span>
                </button>
                <button type="button" className="w-10 h-10 rounded-full bg-white/5 border border-[#D6A24A]/20 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <span className="text-[#FFF9F1] text-xs">✉</span>
                </button>
              </div>

              {/* Already a member */}
              <p className="text-center text-xs text-[#F3D59B]/80 pt-2">
                Already a member?{' '}
                <a href="#login" className="text-[#D6A24A] font-bold hover:underline">
                  Login
                </a>
              </p>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
};
