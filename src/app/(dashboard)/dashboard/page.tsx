'use client';

import React, { useState } from 'react';
import { 
  Search, Bell, Mail, ShieldAlert, Award, Heart, Eye, Bookmark, 
  MapPin, CheckCircle, ArrowRight, Lock, Sparkles, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCandidateProfile } from '@/hooks/useCandidateProfile';
import { useMatches } from '@/hooks/useMatches';
import { useInterests } from '@/hooks/useInterests';
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications';

// High-quality photos matching the visual personas in the mockup
const MOCK_USER_PHOTO = 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?w=400&auto=format&fit=crop&q=80'; // Ananya Jain portrait
const MOCK_AARAV_PHOTO = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'; // Aarav Jain portrait
const MOCK_VIHAAN_PHOTO = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80'; // Vihaan Shah portrait
const MOCK_ISHAAN_PHOTO = 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80'; // Ishaan Doshi portrait

export default function DashboardPage() {
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);
  
  // Real-time hooks integration (with local seed state fallbacks for pixel-perfect preview)
  const { profile: loggedInUser } = useCandidateProfile();
  const { matches: recommendations } = useMatches(loggedInUser?.id);
  const { interestsReceived, sendInterest, acceptInterest, declineInterest, refetch: refetchInterests } = useInterests(loggedInUser?.id);
  
  useRealtimeNotifications(loggedInUser?.id, () => {
    refetchInterests();
  });

  const [interestModalCandidate, setInterestModalCandidate] = useState<any | null>(null);
  const [interestSentStatus, setInterestSentStatus] = useState<string | null>(null);

  // Accordion state for profile details
  const [accordionOpen, setAccordionOpen] = useState<Record<string, boolean>>({
    about: true,
    jain: false,
    education: false,
    family: false,
    lifestyle: false,
    preferences: false,
    biodata: false,
    contact: false,
  });

  const toggleAccordion = (section: string) => {
    setAccordionOpen(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const triggerInterestFlow = (candidate: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setInterestModalCandidate(candidate);
    setInterestSentStatus(null);
  };

  const handleSendInterest = async () => {
    setInterestSentStatus('sending');
    setTimeout(() => {
      setInterestSentStatus('success');
    }, 800);
  };

  // Local exact static definitions matching the mockup screenshot
  const exactPremiumMatches = [
    {
      id: 'aarav-exact',
      name: 'Aarav Jain, 28',
      location: 'Mumbai • Shwetambar Oswal',
      tags: ['MBA', 'Business Analyst', 'Vegetarian'],
      reasons: [
        'Matches your Age preference (27–31)',
        'Community match (Shwetambar)',
        'Education level aligns with preferences'
      ],
      photo: MOCK_AARAV_PHOTO,
      matchPct: 92,
      verified: true,
      hasReasons: true,
    },
    {
      id: 'vihaan-exact',
      name: 'Vihaan Shah, 30',
      location: 'Ahmedabad • MS Comp. Sci',
      tags: ['Software Engineer', 'Shwetambar'],
      reasons: [
        'Location match (Ahmedabad base)',
        'Highly compatible lifestyle scores',
        'Similar professional background'
      ],
      photo: MOCK_VIHAAN_PHOTO,
      matchPct: 88,
      verified: true,
      hasReasons: true,
    },
    {
      id: 'ishaan-exact',
      name: 'Ishaan Doshi, 29',
      location: 'Pune • CA • Digambar',
      tags: ['Finance', 'Non-Smoker'],
      reasons: [],
      photo: MOCK_ISHAAN_PHOTO,
      matchPct: 85,
      verified: false,
      hasReasons: false, // compact layout in image
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDF9F4] text-text font-sans">
      <div className="flex min-h-screen">
        
        {/* ==========================================
            EXACT SIDEBAR DESIGN
            ========================================== */}
        <aside className="w-[280px] bg-white border-r border-[#EDE1D7] p-8 flex flex-col justify-between shrink-0">
          <div className="space-y-8">
            {/* Elegant JainSaathi Logo */}
            <div className="py-2">
              <h1 className="font-serif font-bold text-3xl text-burgundy tracking-tight">
                JainSaathi
              </h1>
            </div>

            {/* User Profile Mini-Card */}
            <div className="flex items-center gap-4 py-2">
              <div className="relative">
                <img 
                  src={MOCK_USER_PHOTO} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-gold shadow-sm" 
                  alt="Ananya"
                />
                <span className="absolute -bottom-1 -right-1 bg-gold text-white p-0.5 rounded-full">
                  <Award className="w-3.5 h-3.5" />
                </span>
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-text leading-tight">
                  Ananya Jain
                </h3>
                <span className="text-[11px] font-bold text-gold flex items-center gap-1 mt-0.5">
                  Premium Member
                </span>
              </div>
            </div>

            {/* Sidebar Menu Links */}
            <nav className="space-y-2 text-[13px]">
              {[
                { label: 'Dashboard', icon: '📋' },
                { label: 'Matches', icon: '👥' },
                { label: 'Search', icon: '🔍' },
                { label: 'Interests', icon: '📩' },
                { label: 'Connections', icon: '🤝' },
                { label: 'Saved', icon: '🔖' },
                { label: 'Profile', icon: '👤' },
                { label: 'Preferences', icon: '⚙️' },
                { label: 'Settings', icon: '🛠️' },
              ].map((item) => {
                const isActive = activeMenu === item.label;
                return (
                  <button
                    key={item.label}
                    onClick={() => setActiveMenu(item.label)}
                    className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-xl font-bold transition-all ${
                      isActive 
                        ? 'bg-burgundy text-white shadow-md' 
                        : 'text-[#766B70] hover:bg-[#F8EFE5]/50 hover:text-text'
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Upgrade Plan Button */}
          <div className="pt-6">
            <button className="w-full bg-burgundy hover:bg-deepBurgundy text-white font-bold py-3.5 rounded-xl text-xs tracking-wider uppercase transition-all shadow-md">
              Upgrade Plan
            </button>
          </div>
        </aside>

        {/* ==========================================
            EXACT MAIN CONTENT AREA
            ========================================== */}
        <main className="flex-grow p-8 max-w-6xl mx-auto space-y-8 overflow-y-auto">
          
          {/* Top Explore bar + Header Utility Links */}
          <div className="flex justify-between items-center pb-4">
            <div className="flex gap-8 text-[13px] font-bold text-[#766B70]">
              <button className="text-burgundy border-b-2 border-burgundy pb-1 px-1">Explore</button>
              <button className="hover:text-text pb-1 px-1">Community</button>
              <button className="hover:text-text pb-1 px-1">Help</button>
            </div>
            
            <div className="flex items-center gap-5 text-burgundy">
              <button className="p-2 hover:bg-[#F8EFE5]/60 rounded-full transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-burgundy" />
              </button>
              <button className="p-2 hover:bg-[#F8EFE5]/60 rounded-full transition-colors">
                <Mail className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Alert Notification strip */}
          <div className="bg-[#FFF9F2] border border-gold/30 rounded-2xl px-6 py-4 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-3 text-text text-sm font-semibold">
              <ShieldAlert className="w-5 h-5 text-gold" />
              <span>Identity Verification Pending</span>
            </div>
            <button className="text-burgundy text-xs font-bold flex items-center gap-1 hover:underline">
              <span>Complete Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Main Search Bar */}
          <div className="flex gap-3 w-full bg-white border border-[#EDE1D7] p-2 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 pl-4 flex-grow">
              <Search className="w-5 h-5 text-[#766B70]" />
              <input 
                type="text" 
                placeholder="Search by name, location, or community..."
                className="w-full text-sm text-text bg-transparent outline-none placeholder-[#766B70]/70"
              />
            </div>
            <button className="bg-burgundy hover:bg-deepBurgundy text-white text-xs font-bold px-8 py-3.5 rounded-xl transition-all shadow-sm">
              Find Matches
            </button>
          </div>

          {/* User Overview Profile Card */}
          <div className="bg-white border border-[#EDE1D7] p-8 rounded-3xl shadow-sm flex items-center gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gold/10 to-transparent rounded-bl-full pointer-events-none" />
            
            <img 
              src={MOCK_USER_PHOTO} 
              className="w-24 h-24 rounded-full object-cover border-4 border-[#FFF9F2] shadow-md shrink-0" 
              alt="Ananya Jain"
            />
            
            <div className="flex-grow space-y-3">
              <div className="flex items-center gap-3">
                <h2 className="font-serif font-bold text-2.5xl text-text leading-tight">
                  Ananya Jain
                </h2>
                <span className="border border-gold text-gold text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Verified
                </span>
              </div>
              <p className="text-xs text-[#766B70] font-semibold">Super Member</p>
              
              {/* Profile Completion bar */}
              <div className="space-y-1.5 pt-1 max-w-lg">
                <div className="flex justify-between text-[11px] font-bold text-text">
                  <span>Profile Completion</span>
                  <span className="text-burgundy">92%</span>
                </div>
                <div className="w-full bg-[#F8EFE5] h-2 rounded-full overflow-hidden">
                  <div className="bg-burgundy h-full w-[92%]" />
                </div>
              </div>
            </div>
          </div>

          {/* 4 Stats Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { count: '124', label: 'Recommended', icon: <Heart className="w-5 h-5 text-burgundy" /> },
              { count: '18', label: 'Interests', icon: <Mail className="w-5 h-5 text-burgundy" /> },
              { count: '450', label: 'Views', icon: <Eye className="w-5 h-5 text-burgundy" /> },
              { count: '12', label: 'Saved', icon: <Bookmark className="w-5 h-5 text-burgundy" /> },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white border border-[#EDE1D7] p-6 rounded-2xl flex flex-col items-center text-center space-y-2.5 shadow-sm hover:shadow transition-all duration-200">
                <span className="p-2.5 bg-[#FFF9F2] rounded-full border border-gold/15">{stat.icon}</span>
                <p className="text-3xl font-serif font-bold text-text">{stat.count}</p>
                <p className="text-[10px] font-bold text-[#766B70] uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Premium Matches Section */}
          <div className="text-center space-y-3 pt-4">
            <div className="flex justify-center">
              <span className="p-2 bg-[#FFF9F2] border border-gold/20 rounded-full text-gold">
                <Sparkles className="w-5 h-5" />
              </span>
            </div>
            <h2 className="font-serif text-3xl font-bold text-burgundy">Premium Matches</h2>
            <div className="w-20 h-0.5 bg-gold mx-auto" />
          </div>

          {/* Premium Match Cards Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {exactPremiumMatches.map((cand) => (
              <div 
                key={cand.id}
                className="bg-white border border-[#EDE1D7] rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative flex flex-col justify-between"
              >
                <div>
                  {/* Top Details & Avatar */}
                  <div className="flex gap-5 pb-5 border-b border-[#F8EFE5]/40">
                    <img 
                      src={cand.photo} 
                      className="w-20 h-20 rounded-full object-cover border-3 border-[#FFF9F2] shadow shrink-0" 
                      alt=""
                    />
                    <div className="space-y-1.5 flex-grow">
                      <div className="flex justify-between items-start">
                        <h3 className="font-serif font-bold text-lg text-text flex items-center gap-1.5">
                          <span>{cand.name}</span>
                          {cand.verified && <CheckCircle className="w-4 h-4 text-gold fill-current" />}
                        </h3>
                        <span className="bg-[#FFF1F1] text-burgundy text-[11px] font-bold px-2.5 py-1 rounded-full border border-burgundy/10">
                          {cand.matchPct}% Match
                        </span>
                      </div>
                      <p className="text-xs text-[#766B70] font-semibold flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#766B70]/80" />
                        <span>{cand.location}</span>
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {cand.tags.map((tag, idx) => (
                          <span key={idx} className="bg-[#FFF1F1] text-burgundy text-[10px] font-bold px-2.5 py-1 rounded-lg">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Match Reason Box */}
                  {cand.hasReasons && cand.reasons.length > 0 && (
                    <div className="bg-[#FFF9F2]/50 border border-gold/15 rounded-2xl p-4 my-5 space-y-2.5 text-xs text-text">
                      <p className="font-bold text-burgundy flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-burgundy" />
                        <span>Why this is a match:</span>
                      </p>
                      <ul className="space-y-1.5 pl-3 list-disc text-[#766B70] font-semibold">
                        {cand.reasons.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Card CTA Actions */}
                <div className="flex gap-3 pt-4">
                  {cand.hasReasons ? (
                    <>
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
                    </>
                  ) : (
                    // compact single View Profile CTA as per third card
                    <button 
                      onClick={() => setSelectedCandidate(cand)}
                      className="w-full bg-white hover:bg-[#F8EFE5]/25 border border-burgundy text-burgundy text-xs font-bold py-3.5 rounded-xl transition-all"
                    >
                      View Profile
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>

      {/* ==========================================
          INTEREST FLOW CONFIRMATION MODAL
          ========================================== */}
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
                    <span className="text-4xl p-3 bg-blush rounded-full text-burgundy">💝</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif font-bold text-lg text-text">Interested in {interestModalCandidate.name.split(',')[0]}?</h3>
                    <p className="text-xs text-[#766B70] leading-relaxed px-4">
                      Send your interest request and let {interestModalCandidate.name.split(',')[0]} know you are looking forward to a family-centered connection.
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
