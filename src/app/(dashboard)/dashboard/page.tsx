'use client';

import React, { useState } from 'react';
import { 
  Search, ShieldAlert, Award, Heart, Eye, Bookmark, 
  MapPin, CheckCircle, ArrowRight, Sparkles, User, Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCandidateProfile } from '@/hooks/useCandidateProfile';
import { useMatches } from '@/hooks/useMatches';
import { useInterests } from '@/hooks/useInterests';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import Link from 'next/link';

// Helper for displaying fallback avatar
const FallbackAvatar = () => (
  <div className="w-full h-full bg-[#EDE1D7] flex items-center justify-center text-[#766B70]">
    <User className="w-1/2 h-1/2 opacity-50" />
  </div>
);

export default function DashboardPage() {
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);
  
  // Real-time dynamic hooks
  const { profile: loggedInUser, loading: profileLoading } = useCandidateProfile();
  const { matches: recommendations, loading: matchesLoading } = useMatches(loggedInUser?.id);
  const { sendInterest } = useInterests(loggedInUser?.id);
  const { stats, loading: statsLoading } = useDashboardStats(loggedInUser?.id);
  
  const [interestModalCandidate, setInterestModalCandidate] = useState<any | null>(null);
  const [interestSentStatus, setInterestSentStatus] = useState<string | null>(null);

  const triggerInterestFlow = (candidate: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setInterestModalCandidate(candidate);
    setInterestSentStatus(null);
  };

  const handleSendInterest = async () => {
    if (!loggedInUser || !interestModalCandidate) return;
    setInterestSentStatus('sending');
    try {
      await sendInterest(loggedInUser.id, interestModalCandidate.id);
      setInterestSentStatus('success');
    } catch (err) {
      console.error('Failed to send interest:', err);
    }
  };

  // Safe variables
  const userPhotoUrl = loggedInUser?.photos?.[0]?.url;
  const userName = loggedInUser ? `${loggedInUser.firstName} ${loggedInUser.lastName}` : '';
  const profileComplete = loggedInUser?.completionPercentage || 0;
  const isVerified = loggedInUser?.isVerified || false;
  const verificationStatus = loggedInUser?.verificationStatus || 'pending';
  const membershipTier = loggedInUser?.membershipTier || 'Free Member';

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Dynamic Alert Notification strip */}
      {!isVerified && !profileLoading && (
        <div className="bg-[#FFF9F2] border border-gold/30 rounded-2xl px-6 py-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3 text-text text-sm font-semibold">
            <ShieldAlert className="w-5 h-5 text-gold" />
            <span>
              {verificationStatus === 'pending' ? 'Identity Verification Pending' : 'Identity Verification Required'}
            </span>
          </div>
          <button className="text-burgundy text-xs font-bold flex items-center gap-1 hover:underline">
            <span>{verificationStatus === 'pending' ? 'View Status' : 'Complete Now'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Global Search Bar quick access */}
      <div className="flex gap-3 w-full bg-white border border-[#EDE1D7] p-2 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3 pl-4 flex-grow">
          <Search className="w-5 h-5 text-[#766B70]" />
          <input 
            type="text" 
            placeholder="Search by name, location, or community..."
            className="w-full text-sm text-text bg-transparent outline-none placeholder-[#766B70]/70"
          />
        </div>
        <Link href="/search" className="bg-burgundy hover:bg-deepBurgundy text-white text-xs font-bold px-8 py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center">
          Find Matches
        </Link>
      </div>

      {/* User Overview Profile Card */}
      <div className="bg-white border border-[#EDE1D7] p-8 rounded-3xl shadow-sm flex items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gold/10 to-transparent rounded-bl-full pointer-events-none" />
        
        <div className="relative w-24 h-24 shrink-0">
          {profileLoading ? (
             <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse border-4 border-[#FFF9F2] shadow-md" />
          ) : userPhotoUrl ? (
            <img 
              src={userPhotoUrl} 
              className="w-24 h-24 rounded-full object-cover border-4 border-[#FFF9F2] shadow-md" 
              alt={userName}
            />
          ) : (
            <div className="w-24 h-24 rounded-full border-4 border-[#FFF9F2] shadow-md overflow-hidden">
              <FallbackAvatar />
            </div>
          )}
        </div>
        
        <div className="flex-grow space-y-3">
          <div className="flex items-center gap-3">
            {profileLoading ? (
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
            ) : (
              <>
                <h2 className="font-serif font-bold text-2.5xl text-text leading-tight">
                  {userName}
                </h2>
                {isVerified && (
                  <span className="border border-gold text-gold text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Verified
                  </span>
                )}
              </>
            )}
          </div>
          
          {profileLoading ? (
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          ) : (
            <p className="text-xs text-[#766B70] font-semibold">{membershipTier}</p>
          )}
          
          <div className="space-y-1.5 pt-1 max-w-lg">
            <div className="flex justify-between text-[11px] font-bold text-text">
              <span>Profile Completion</span>
              <span className="text-burgundy">{profileComplete}%</span>
            </div>
            <div className="w-full bg-[#F8EFE5] h-2 rounded-full overflow-hidden relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${profileComplete}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute top-0 left-0 bottom-0 bg-burgundy rounded-full" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { count: statsLoading ? '-' : stats.recommended, label: 'Recommended', icon: <Heart className="w-5 h-5 text-burgundy" />, link: '/matches' },
          { count: statsLoading ? '-' : stats.interests, label: 'Interests', icon: <Mail className="w-5 h-5 text-burgundy" />, link: '/interests' },
          { count: statsLoading ? '-' : stats.views, label: 'Views', icon: <Eye className="w-5 h-5 text-burgundy" />, link: '/dashboard' },
          { count: statsLoading ? '-' : stats.saved, label: 'Saved', icon: <Bookmark className="w-5 h-5 text-burgundy" />, link: '/saved' },
        ].map((stat, idx) => (
          <Link key={idx} href={stat.link} className="bg-white border border-[#EDE1D7] p-6 rounded-2xl flex flex-col items-center text-center space-y-2.5 shadow-sm hover:shadow transition-all duration-200 group">
            <span className="p-2.5 bg-[#FFF9F2] rounded-full border border-gold/15 group-hover:scale-110 transition-transform">{stat.icon}</span>
            <p className="text-3xl font-serif font-bold text-text">
              {statsLoading ? <span className="animate-pulse opacity-50">...</span> : stat.count}
            </p>
            <p className="text-[10px] font-bold text-[#766B70] uppercase tracking-wider">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="text-center space-y-3 pt-4">
        <div className="flex justify-center">
          <span className="p-2 bg-[#FFF9F2] border border-gold/20 rounded-full text-gold">
            <Sparkles className="w-5 h-5" />
          </span>
        </div>
        <h2 className="font-serif text-3xl font-bold text-burgundy">Premium Matches</h2>
        <div className="w-20 h-0.5 bg-gold mx-auto" />
      </div>

      {/* Premium Match Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {matchesLoading ? (
          // Skeletons
          [1, 2].map((i) => (
            <div key={i} className="bg-white border border-[#EDE1D7] rounded-3xl p-6 shadow-sm relative flex flex-col justify-between animate-pulse">
              <div className="flex gap-5 pb-5 border-b border-[#F8EFE5]/40">
                <div className="w-20 h-20 rounded-full bg-gray-200 shrink-0" />
                <div className="space-y-3 flex-grow">
                  <div className="h-6 w-3/4 bg-gray-200 rounded" />
                  <div className="h-4 w-1/2 bg-gray-200 rounded" />
                  <div className="flex gap-2 pt-2">
                    <div className="h-5 w-16 bg-gray-200 rounded-lg" />
                    <div className="h-5 w-20 bg-gray-200 rounded-lg" />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-4 mt-5">
                <div className="flex-1 h-12 bg-gray-200 rounded-xl" />
                <div className="flex-grow h-12 bg-gray-200 rounded-xl" />
              </div>
            </div>
          ))
        ) : recommendations.length === 0 ? (
          <div className="col-span-1 md:col-span-2 bg-white border border-[#EDE1D7] rounded-3xl p-12 text-center shadow-sm">
            <Heart className="w-12 h-12 text-[#EDE1D7] mx-auto mb-4" />
            <h3 className="font-serif text-xl font-bold text-text mb-2">No suitable matches yet</h3>
            <p className="text-sm text-[#766B70] max-w-md mx-auto mb-6">
              We couldn't find matches that fit all your criteria. Try broadening your partner preferences or completing more of your profile.
            </p>
            <Link href="/preferences" className="bg-white hover:bg-[#F8EFE5]/25 border border-burgundy text-burgundy text-xs font-bold py-3 px-8 rounded-xl transition-all inline-block">
              Adjust Preferences
            </Link>
          </div>
        ) : (
          recommendations.map((cand) => (
            <div 
              key={cand.id}
              className="bg-white border border-[#EDE1D7] rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-5 pb-5 border-b border-[#F8EFE5]/40">
                  <div className="w-20 h-20 shrink-0 rounded-full border-3 border-[#FFF9F2] shadow overflow-hidden relative bg-[#F8EFE5]">
                    {cand.photos?.[0]?.url ? (
                      <img 
                        src={cand.photos[0].url} 
                        className="w-full h-full object-cover" 
                        alt=""
                      />
                    ) : (
                      <FallbackAvatar />
                    )}
                  </div>
                  <div className="space-y-1.5 flex-grow">
                    <div className="flex justify-between items-start">
                      <h3 className="font-serif font-bold text-lg text-text flex items-center gap-1.5">
                        <span className="truncate max-w-[150px]">{cand.firstName} {cand.lastName}, {cand.age}</span>
                        {cand.isVerified && <CheckCircle className="w-4 h-4 text-gold fill-current shrink-0" />}
                      </h3>
                      <span className="bg-[#FFF1F1] text-burgundy text-[11px] font-bold px-2.5 py-1 rounded-full border border-burgundy/10 shrink-0">
                        {cand.compatibilityScore}% Match
                      </span>
                    </div>
                    <p className="text-xs text-[#766B70] font-semibold flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#766B70]/80 shrink-0" />
                      <span className="truncate">{cand.currentCity} • {cand.jainIdentity?.sect} {cand.jainIdentity?.community}</span>
                    </p>
                    
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {cand.jainIdentity?.community && (
                         <span className="bg-[#FFF1F1] text-burgundy text-[10px] font-bold px-2.5 py-1 rounded-lg">
                           {cand.jainIdentity.community}
                         </span>
                      )}
                    </div>
                  </div>
                </div>

                {cand.matchingReasons && cand.matchingReasons.length > 0 && (
                  <div className="bg-[#FFF9F2]/50 border border-gold/15 rounded-2xl p-4 my-5 space-y-2.5 text-xs text-text">
                    <p className="font-bold text-burgundy flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-burgundy" />
                      <span>Why this is a match:</span>
                    </p>
                    <ul className="space-y-1.5 pl-3 text-[#766B70] font-semibold">
                      {cand.matchingReasons.map((r: string, i: number) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  onClick={(e) => triggerInterestFlow(cand, e)}
                  className="flex-1 bg-burgundy hover:bg-deepBurgundy text-white text-xs font-bold py-3.5 rounded-xl transition-all shadow-sm"
                >
                  Interested
                </button>
                <button 
                  onClick={() => setSelectedCandidate(cand)}
                  className="flex-grow bg-white hover:bg-[#F8EFE5]/25 border border-burgundy text-burgundy text-xs font-bold py-3.5 px-6 rounded-xl transition-all"
                >
                  View Profile
                </button>
                <button className="p-3 border border-[#EDE1D7] rounded-xl hover:bg-[#F8EFE5]/20 text-[#766B70]">
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* INTEREST FLOW CONFIRMATION MODAL */}
      <AnimatePresence>
        {interestModalCandidate && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-[#EDE1D7] p-6 rounded-3xl max-w-sm w-full text-center space-y-6 shadow-2xl relative"
            >
              <button 
                onClick={() => setInterestModalCandidate(null)}
                className="absolute top-4 right-4 text-[#766B70] hover:text-text font-bold text-sm"
              >
                ✕
              </button>

              {interestSentStatus !== 'success' ? (
                <>
                  <div className="flex justify-center">
                    <span className="text-4xl p-3 bg-[#FFF1F1] rounded-full text-burgundy">💝</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif font-bold text-lg text-text">Interested in {interestModalCandidate.firstName}?</h3>
                    <p className="text-xs text-[#766B70] leading-relaxed px-4">
                      Send your interest request and let {interestModalCandidate.firstName} know you are looking forward to a family-centered connection.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={handleSendInterest}
                      disabled={interestSentStatus === 'sending'}
                      className="w-full bg-burgundy text-white py-3 rounded-xl text-xs font-bold hover:bg-deepBurgundy transition-all disabled:opacity-50"
                    >
                      {interestSentStatus === 'sending' ? 'Sending Request...' : 'Send Interest'}
                    </button>
                    <button 
                      onClick={() => setInterestModalCandidate(null)}
                      className="w-full border border-[#EDE1D7] text-[#766B70] py-3 rounded-xl text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-5 py-2">
                  <div className="flex justify-center text-success">
                    <CheckCircle className="w-12 h-12 fill-current text-green-600" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-serif font-bold text-lg text-text">Interest Sent ✓</h3>
                    <p className="text-xs text-[#766B70] leading-relaxed px-4">
                      Your matrimonial interest was delivered safely. We will notify you when their family accepts your connection.
                    </p>
                  </div>
                  <button 
                    onClick={() => setInterestModalCandidate(null)}
                    className="w-full bg-burgundy text-white py-3 rounded-xl text-xs font-bold"
                  >
                    Close Preview
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
