import React from 'react';
import { CandidateProfile } from '@/types';
import { Heart, X, Bookmark, CheckCircle2, ShieldCheck, MapPin, Briefcase, GraduationCap } from 'lucide-[#6E1231]' ? 'lucide-react' : 'lucide-react';

interface ProfileCardProps {
  profile: CandidateProfile;
  onInterest?: (profile: CandidateProfile) => void;
  onDecline?: (profile: CandidateProfile) => void;
  onBookmark?: (profile: CandidateProfile) => void;
  onOpenDetails?: (profile: CandidateProfile) => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onInterest,
  onDecline,
  onBookmark,
  onOpenDetails,
}) => {
  const primaryPhoto =
    profile.photos?.find((p) => p.isPrimary)?.url ||
    profile.photos?.[0]?.url ||
    (profile.gender === 'female'
      ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80'
      : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80');

  const jainSect = profile.jainIdentity?.sect || 'Shwetambar';
  const jainCommunity = profile.jainIdentity?.community || 'Oswal';
  const education = profile.education?.[0]?.degreeName || 'Graduate';
  const occupation = profile.employment?.[0]?.designation || 'Business Analyst';
  const heightFt = Math.floor(profile.heightCm / 30.48);
  const heightIn = Math.round((profile.heightCm % 30.48) / 2.54);

  return (
    <div className="group relative bg-[#FFF9F1] border border-[#D6A24A]/25 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-[#D6A24A]/50 flex flex-col">
      {/* Profile Photo Header */}
      <div 
        className="relative h-72 w-full bg-[#100A18] overflow-hidden cursor-pointer"
        onClick={() => onOpenDetails?.(profile)}
      >
        <img
          src={primaryPhoto}
          alt={`${profile.firstName} ${profile.lastName}`}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Subtle Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#100A18] via-transparent to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Compatibility Score */}
          <div className="bg-[#6E1231]/90 backdrop-blur-md text-[#F3D59B] border border-[#D6A24A]/40 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-md">
            <span>{profile.compatibilityScore || 92}% Match</span>
          </div>

          {/* Featured Badge if applicable */}
          {profile.isFeatured && (
            <div className="bg-[#D6A24A] text-[#100A18] px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase shadow">
              ★ Featured
            </div>
          )}
        </div>

        {/* Bottom Floating Info over photo */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="font-serif font-bold text-2xl tracking-tight text-[#FFF9F1] drop-shadow-md">
            {profile.firstName} {profile.lastName}
          </h3>
          <p className="text-xs text-[#F3D59B] font-medium flex items-center gap-1.5 mt-0.5">
            <span>{profile.age || 26} Yrs</span>
            <span>•</span>
            <span>{heightFt}'{heightIn}"</span>
            <span>•</span>
            <span className="inline-flex items-center gap-0.5"><MapPin className="w-3 h-3 text-[#D6A24A]" /> {profile.currentCity}</span>
          </p>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-[#FFF9F1]">
        <div className="space-y-2 text-xs text-[#241A20]">
          {/* Jain Identity */}
          <div className="flex items-center gap-1.5 text-[#6E1231] font-semibold bg-[#F8E8EA] px-2.5 py-1 rounded-lg border border-[#9E183A]/15">
            <span>🛕</span>
            <span>{jainCommunity}</span>
            <span>•</span>
            <span>{jainSect}</span>
          </div>

          {/* Education & Profession */}
          <div className="space-y-1 text-[#756B70] pt-1">
            <div className="flex items-center gap-1.5 truncate">
              <GraduationCap className="w-3.5 h-3.5 text-[#D6A24A] shrink-0" />
              <span className="truncate">{education}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Briefcase className="w-3.5 h-3.5 text-[#D6A24A] shrink-0" />
              <span className="truncate">{occupation}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-[#D6A24A]/15 flex items-center justify-between gap-2">
          {/* Not Interested Button */}
          <button
            onClick={() => onDecline?.(profile)}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all flex items-center justify-center shadow-sm"
            title="Not Interested"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Bookmark Button */}
          <button
            onClick={() => onBookmark?.(profile)}
            className="w-10 h-10 rounded-full bg-white border border-[#D6A24A]/30 text-[#D6A24A] hover:bg-[#FFF9F1] transition-all flex items-center justify-center shadow-sm"
            title="Save Profile"
          >
            <Bookmark className="w-4 h-4" />
          </button>

          {/* Interested Primary Button */}
          <button
            onClick={() => onInterest?.(profile)}
            className="flex-1 btn-ruby py-2.5 text-xs rounded-full flex items-center justify-center gap-1.5 shadow-md"
          >
            <Heart className="w-4 h-4 fill-current text-[#F3D59B]" />
            <span>Interested</span>
          </button>
        </div>
      </div>
    </div>
  );
};
