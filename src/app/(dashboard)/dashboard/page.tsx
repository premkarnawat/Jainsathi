'use client';

import React, { useState, useEffect } from 'react';
import { 
  Heart, Bookmark, MapPin, CheckCircle, ArrowRight, Sparkles, User, AlertCircle, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useCandidateProfile } from '@/hooks/useCandidateProfile';
import { useMatches } from '@/hooks/useMatches';
import { useInterests } from '@/hooks/useInterests';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';

const FallbackAvatar = () => (
  <div className="w-full h-full bg-[#F7E5EA] flex items-center justify-center text-[#75666D]">
    <User className="w-1/3 h-1/3 opacity-40" />
  </div>
);

export default function DashboardPage() {
  const { profile: loggedInUser, loading: profileLoading } = useCandidateProfile();
  const { matches: recommendations, loading: matchesLoading } = useMatches(loggedInUser?.id);
  const { sendInterest } = useInterests(loggedInUser?.id);
  
  // State for horizontal scrollable pills
  const [activeCategory, setActiveCategory] = useState('For You');

  // Swipe album indexes
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'up' | 'down' | null>(null);

  // Saved profiles state
  const [savedCandidateIds, setSavedCandidateIds] = useState<Set<string>>(new Set());

  // Modals / Action Sheet states
  const [showInterestSheet, setShowInterestSheet] = useState(false);
  const [interestStatus, setInterestStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  // Load saved profiles to populate bookmark state
  useEffect(() => {
    async function fetchSavedIds() {
      if (!loggedInUser?.id) return;
      try {
        const { data, error } = await supabase
          .from('saved_profiles')
          .select('saved_candidate_id')
          .eq('candidate_id', loggedInUser.id);
        
        if (data) {
          setSavedCandidateIds(new Set(data.map(item => item.saved_candidate_id)));
        }
      } catch (err) {
        console.error('Error fetching saved ids:', err);
      }
    }
    fetchSavedIds();
  }, [loggedInUser]);

  // Gestures for swipe album (Vertical Drag)
  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 80;
    if (info.offset.y < -swipeThreshold) {
      // Swiped Up -> Next Profile
      handleNext();
    } else if (info.offset.y > swipeThreshold) {
      // Swiped Down -> Previous Profile
      handlePrev();
    }
  };

  const handleNext = () => {
    if (recommendations && currentIndex < recommendations.length - 1) {
      setSwipeDirection('up');
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setSwipeDirection(null);
      }, 50);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setSwipeDirection('down');
      setTimeout(() => {
        setCurrentIndex(prev => prev - 1);
        setSwipeDirection(null);
      }, 50);
    }
  };

  const handleSaveToggle = async (candidateId: string) => {
    if (!loggedInUser?.id) return;

    const isCurrentlySaved = savedCandidateIds.has(candidateId);
    try {
      if (isCurrentlySaved) {
        // Unsave
        await supabase
          .from('saved_profiles')
          .delete()
          .eq('candidate_id', loggedInUser.id)
          .eq('saved_candidate_id', candidateId);

        setSavedCandidateIds(prev => {
          const next = new Set(prev);
          next.delete(candidateId);
          return next;
        });
      } else {
        // Save
        await supabase
          .from('saved_profiles')
          .insert({
            candidate_id: loggedInUser.id,
            saved_candidate_id: candidateId
          });

        setSavedCandidateIds(prev => {
          const next = new Set(prev);
          next.add(candidateId);
          return next;
        });
      }
    } catch (err) {
      console.error('Failed to toggle save status:', err);
    }
  };

  const handleSendInterestAction = async () => {
    const candidate = recommendations?.[currentIndex];
    if (!loggedInUser?.id || !candidate) return;

    setInterestStatus('sending');
    try {
      await sendInterest(loggedInUser.id, candidate.id);
      setInterestStatus('success');
      // Hide sheet after success notification
      setTimeout(() => {
        setShowInterestSheet(false);
        setInterestStatus('idle');
      }, 2000);
    } catch (err) {
      console.error('Error expressing interest:', err);
      setInterestStatus('idle');
    }
  };

  // Extract variables
  const userName = loggedInUser?.firstName || 'Priya';
  const profileComplete = loggedInUser?.completionPercentage || 92;
  const currentCandidate = recommendations?.[currentIndex];

  const categories = ['For You', 'Highly Compatible', 'New Profiles', 'Nearby', 'Featured'];

  // Book-page vertical slide motion variables
  const variants = {
    initial: (direction: 'up' | 'down') => ({
      opacity: 0,
      y: direction === 'up' ? 300 : -300,
      scale: 0.95
    }),
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 280,
        damping: 26
      }
    },
    exit: (direction: 'up' | 'down') => ({
      opacity: 0,
      y: direction === 'up' ? -300 : 300,
      scale: 0.95,
      transition: {
        duration: 0.3
      }
    })
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto pb-12 animate-in fade-in duration-500">
      
      {/* 1. Greeting */}
      <div className="space-y-1 text-left px-2">
        {profileLoading ? (
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        ) : (
          <h1 className="font-serif font-semibold text-3xl md:text-4xl text-[#241B20] tracking-tight">
            Good Morning, {userName} 👋
          </h1>
        )}
        <p className="text-sm font-semibold text-[#75666D]">
          Find meaningful connections within the Jain community.
        </p>
      </div>

      {/* 2. Profile Completion blush pink card */}
      <div className="bg-[#F7E5EA] border border-[#EBD9DC] p-5 rounded-[28px] space-y-4 shadow-sm">
        <div className="flex justify-between items-center text-sm font-bold text-[#8F0038]">
          <span>Profile Completion</span>
          <span>{profileComplete}%</span>
        </div>
        <div className="w-full bg-[#FFFDFB]/60 h-2.5 rounded-full overflow-hidden relative">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${profileComplete}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute top-0 left-0 bottom-0 bg-[#8F0038] rounded-full" 
          />
        </div>
        <div className="flex justify-between items-center pt-1">
          <p className="text-xs text-[#75666D] font-semibold max-w-[240px]">
            Complete your profile to unlock premium matches.
          </p>
          <Link href="/profile" className="text-[#8F0038] text-xs font-bold flex items-center gap-1 hover:underline shrink-0">
            <span>Complete Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 3. Category scrollable pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x px-2">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all shrink-0 snap-center ${
                isActive 
                  ? 'bg-[#8F0038] text-white shadow-sm' 
                  : 'bg-[#F7E5EA]/55 text-[#8F0038] border border-[#EBD9DC]/60 hover:bg-[#F7E5EA]/80'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 4. Matrimonial Swipe Album discovery deck */}
      <div className="relative min-h-[460px] flex flex-col justify-between">
        
        {matchesLoading ? (
          // Dynamic Loading Skeleton matching the screenshot specifications
          <div className="bg-[#FFFDFB] border border-[#EBD9DC] rounded-[32px] p-6 shadow-sm flex flex-col justify-between h-[420px] animate-pulse">
            <div className="space-y-4">
              <div className="w-full h-44 rounded-2xl bg-gray-200" />
              <div className="h-6 w-2/3 bg-gray-200 rounded" />
              <div className="h-4 w-1/2 bg-gray-200 rounded" />
            </div>
            <div className="flex gap-3 mt-4">
              <div className="flex-1 h-12 bg-gray-200 rounded-xl" />
              <div className="flex-grow h-12 bg-gray-200 rounded-xl" />
            </div>
          </div>
        ) : !currentCandidate ? (
          // Empty State matching instruction
          <div className="bg-[#FFFDFB] border border-[#EBD9DC] rounded-[32px] p-12 text-center shadow-sm space-y-6 flex flex-col justify-center items-center min-h-[380px]">
            <span className="p-4 bg-[#F7E5EA] rounded-full text-[#8F0038]">
              <Sparkles className="w-8 h-8" />
            </span>
            <h3 className="font-serif text-xl font-bold text-[#241B20]">No suitable matches right now</h3>
            <p className="text-xs text-[#75666D] font-semibold max-w-xs leading-relaxed">
              Try adjusting your partner preferences or complete more details to trigger recommendations.
            </p>
            <Link href="/preferences" className="bg-[#8F0038] text-white font-bold text-xs px-6 py-3 rounded-xl shadow hover:bg-[#72002E] transition-colors">
              Adjust Preferences
            </Link>
          </div>
        ) : (
          // Active swipe card
          <div className="relative">
            {/* Gesture Helper Hint shown once */}
            <div className="absolute -top-6 left-0 right-0 text-center text-[10px] text-[#75666D]/70 font-semibold uppercase tracking-wider animate-bounce pointer-events-none">
              ↑ Swipe up / down to explore ↑
            </div>

            <AnimatePresence initial={false} custom={swipeDirection}>
              <motion.div
                key={currentCandidate.id}
                custom={swipeDirection}
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                onDragEnd={handleDragEnd}
                className="bg-[#FFFDFB] border border-[#EBD9DC] rounded-[32px] overflow-hidden shadow-sm flex flex-col cursor-grab active:cursor-grabbing select-none"
              >
                
                {/* Photo browsing */}
                <div className="relative h-60 w-full bg-[#F7E5EA]">
                  {currentCandidate.photos?.[0]?.url ? (
                    <img 
                      src={currentCandidate.photos[0].url} 
                      alt="" 
                      className="w-full h-full object-cover pointer-events-none"
                    />
                  ) : (
                    <FallbackAvatar />
                  )}

                  {/* Compatibility Badge floating top right */}
                  <div className="absolute top-4 right-4 bg-[#FFFDFB]/90 backdrop-blur-sm border border-[#EBD9DC] text-[#8F0038] text-xs font-bold px-3.5 py-1.5 rounded-full shadow-sm">
                    {currentCandidate.compatibilityScore}% Match
                  </div>
                </div>

                {/* Candidate details */}
                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <h2 className="font-serif font-bold text-2xl text-[#241B20] flex items-center gap-2">
                      {currentCandidate.firstName} {currentCandidate.lastName}, {currentCandidate.age}
                    </h2>
                    <p className="text-xs font-bold text-[#75666D] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#8F0038]" />
                      {currentCandidate.currentCity} • {currentCandidate.jainIdentity?.sect}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 text-[10px] font-bold">
                    <span className="bg-[#F7E5EA] text-[#8F0038] border border-[#EBD9DC] px-2.5 py-1 rounded-lg">
                      {currentCandidate.jainIdentity?.community || 'Jain'}
                    </span>
                    {currentCandidate.isVerified && (
                      <span className="bg-[#FFFDFB] text-[#C99A3D] border border-[#C99A3D]/40 px-2.5 py-1 rounded-lg flex items-center gap-1">
                        ✓ Identity Verified
                      </span>
                    )}
                  </div>

                  {/* Why match details list */}
                  {currentCandidate.matchingReasons && currentCandidate.matchingReasons.length > 0 && (
                    <div className="bg-[#FFF8F7] border border-[#EBD9DC]/55 rounded-2xl p-4 space-y-2">
                      <p className="text-xs font-bold text-[#8F0038]">Why this is a good match:</p>
                      <ul className="space-y-1 text-[11px] font-semibold text-[#75666D]">
                        {currentCandidate.matchingReasons.slice(0, 3).map((r: string, index: number) => (
                          <li key={index} className="flex items-center gap-1.5">
                            <span className="text-[#8F0038]">✓</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* View Full Profile link */}
                  <div className="text-center pt-2">
                    <button className="text-xs font-bold text-[#8F0038] hover:underline">
                      View Full Profile
                    </button>
                  </div>

                </div>

              </motion.div>
            </AnimatePresence>
          </div>
        )}

      </div>

      {/* 5. Sticky actions bar right above mobile navigation */}
      {currentCandidate && (
        <div className="bg-[#FFFDFB] border border-[#EBD9DC] p-3.5 rounded-2xl shadow-sm flex items-center gap-3">
          <button 
            onClick={() => setShowInterestSheet(true)}
            className="flex-grow bg-[#8F0038] hover:bg-[#72002E] text-white text-xs font-bold py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            <Heart className="w-4 h-4" /> Interested
          </button>
          
          <button 
            onClick={() => handleSaveToggle(currentCandidate.id)}
            className="px-6 py-3.5 border border-[#EBD9DC] bg-[#FFFDFB] text-[#8F0038] hover:bg-[#F7E5EA]/20 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Bookmark className={`w-4 h-4 ${savedCandidateIds.has(currentCandidate.id) ? 'fill-[#8F0038]' : ''}`} />
            <span>{savedCandidateIds.has(currentCandidate.id) ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      )}

      {/* Interest expression Confirmation sheet (Bottom Sheet visual Modal) */}
      <AnimatePresence>
        {showInterestSheet && currentCandidate && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center">
            {/* Sheet backdrop */}
            <div className="absolute inset-0" onClick={() => setShowInterestSheet(false)} />
            
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md bg-[#FFFDFB] border-t border-[#EBD9DC] rounded-t-[32px] p-6 text-center space-y-6 shadow-2xl z-10"
            >
              {/* Grab handle bar */}
              <div className="w-12 h-1 bg-[#EBD9DC] rounded-full mx-auto" />

              {interestStatus !== 'success' ? (
                <>
                  <div className="flex justify-center">
                    <span className="text-4xl p-3.5 bg-[#F7E5EA] rounded-full text-[#8F0038]">💝</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif font-bold text-xl text-[#241B20]">Show Interest?</h3>
                    <p className="text-xs text-[#75666D] font-semibold leading-relaxed px-4">
                      You are about to express interest in {currentCandidate.firstName}'s profile. They will receive an instant notification.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 pt-2">
                    <button 
                      onClick={handleSendInterestAction}
                      disabled={interestStatus === 'sending'}
                      className="w-full bg-[#8F0038] hover:bg-[#72002E] text-white py-3.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                    >
                      {interestStatus === 'sending' ? 'Sending Request...' : 'Send Interest'}
                    </button>
                    <button 
                      onClick={() => setShowInterestSheet(false)}
                      className="w-full border border-[#EBD9DC] text-[#75666D] py-3.5 rounded-xl text-xs font-bold hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-5 py-4">
                  <div className="flex justify-center text-[#8F0038]">
                    <CheckCircle className="w-12 h-12 fill-current" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-serif font-bold text-xl text-[#241B20]">Interest Sent ✓</h3>
                    <p className="text-xs text-[#75666D] font-semibold leading-relaxed px-4">
                      Your matrimonial interest was delivered successfully.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
