'use client';

import React, { useState } from 'react';
import { CandidateProfile } from '@/types';
import { JainSaathiLogo } from '@/components/ui/JainSaathiLogo';
import { 
  Search, Filter, Bell, User, Heart, MessageSquare, ShieldCheck, 
  Download, Award, Settings, LogOut, CheckCircle2, Bookmark, X, ArrowLeft,
  ChevronDown, ChevronUp, Lock, Send, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCandidateProfile } from '@/hooks/useCandidateProfile';
import { useMatches } from '@/hooks/useMatches';
import { useInterests } from '@/hooks/useInterests';
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications';

export default function DashboardPage() {
  const [activeMenu, setActiveMenu] = useState('Home');
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);
  
  // Real-time hooks integration
  const { profile: loggedInUser, loading: profileLoading } = useCandidateProfile();
  const { matches: recommendations, loading: matchesLoading } = useMatches(loggedInUser?.id);
  const { interestsReceived, sendInterest, acceptInterest, declineInterest, refetch: refetchInterests } = useInterests(loggedInUser?.id);
  
  // Real-time notification listener
  useRealtimeNotifications(loggedInUser?.id, () => {
    // When a new interest is received, refetch the interests list
    refetchInterests();
  });

  // Mobile navigation state
  const [mobileTab, setMobileTab] = useState<'home' | 'matches' | 'interests' | 'messages' | 'profile'>('home');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [interestModalCandidate, setInterestModalCandidate] = useState<any | null>(null);
  const [interestSentStatus, setInterestSentStatus] = useState<string | null>(null); // 'sending' | 'success'

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
    if (!loggedInUser || !interestModalCandidate) return;
    setInterestSentStatus('sending');
    try {
      await sendInterest(loggedInUser.id, interestModalCandidate.id);
      setInterestSentStatus('success');
    } catch (err) {
      console.error('Failed to send interest:', err);
      // fallback handling here
    }
  };

  const handleAcceptInterest = async (interestId: string, senderId: string) => {
    if (!loggedInUser) return;
    try {
      await acceptInterest(interestId, senderId, loggedInUser.id);
    } catch (err) {
      console.error('Failed to accept interest', err);
    }
  };

  // Safe fallbacks for UI while loading or if data missing
  const userName = loggedInUser?.firstName || 'User';
  const profileComplete = loggedInUser?.completionPercentage || 50;
  const recommendedList = recommendations || [];
  
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-burgundy animate-pulse font-serif text-2xl font-bold">Loading JainSaathi...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text">

      {/* ==========================================
          DESKTOP / TABLET VISUAL COMPOSITION
          ========================================== */}
      <div className="hidden md:flex min-h-screen">
        {/* LIGHT WARM SIDEBAR */}
        <aside className="w-64 bg-surfaceWarm border-r border-border p-6 flex flex-col justify-between shrink-0">
          <div className="space-y-6">
            <div className="pb-4 border-b border-border">
              <JainSaathiLogo variant="light" size="sm" />
            </div>

            {/* Profile Mini Card */}
            <div className="bg-surface border border-border p-4 rounded-2xl space-y-3 shadow-sm">
              <div className="flex items-center gap-3">
                <img 
                  src={loggedInUser?.photos?.[0]?.url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80"} 
                  className="w-10 h-10 rounded-full object-cover border border-gold" 
                  alt={userName}
                />
                <div>
                  <p className="font-serif font-bold text-sm text-text">{loggedInUser?.firstName} {loggedInUser?.lastName}</p>
                  <span className="text-[9px] font-bold text-gold uppercase tracking-wider">Super Member</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-muted">
                  <span>Profile Complete</span>
                  <span className="font-bold text-burgundy">{profileComplete}%</span>
                </div>
                <div className="w-full bg-cream h-1.5 rounded-full overflow-hidden">
                  <div className="bg-burgundy h-full transition-all" style={{ width: `${profileComplete}%` }} />
                </div>
              </div>
              <button className="w-full bg-burgundy text-white text-[11px] font-bold py-2 rounded-xl hover:bg-deepBurgundy transition-all border border-gold/45 shadow-sm">
                Complete Profile
              </button>
            </div>

            {/* Sidebar Navigation */}
            <nav className="space-y-1 text-xs max-h-[50vh] overflow-y-auto pr-1">
              {[
                { label: 'Home', icon: '🏠' },
                { label: 'Recommended', icon: '💕' },
                { label: 'Search Matches', icon: '🔍' },
                { label: 'Featured Profiles', icon: '⭐' },
              ].map((link) => (
                <button
                  key={link.label}
                  onClick={() => { setActiveMenu(link.label); setSelectedCandidate(null); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold transition-all ${
                    activeMenu === link.label
                      ? 'bg-blush text-burgundy shadow-sm'
                      : 'text-muted hover:bg-cream/40'
                  }`}
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </button>
              ))}

              {/* Interests Submenu */}
              <div className="space-y-1 py-1">
                <div className="flex items-center gap-3 px-4 py-1 text-text font-bold">
                  <span>📩</span>
                  <span>Interests</span>
                </div>
                <div className="pl-8 space-y-1 text-[11px]">
                  <button
                    onClick={() => setActiveMenu('Received')}
                    className={`w-full flex items-center justify-between py-1.5 px-3 rounded-lg ${
                      activeMenu === 'Received' ? 'text-burgundy font-bold bg-blush' : 'text-muted hover:text-text'
                    }`}
                  >
                    <span>Received</span>
                    <span className="bg-burgundy text-white text-[9px] font-bold px-1.5 rounded-full">{interestsReceived.length}</span>
                  </button>
                  <button
                    onClick={() => setActiveMenu('Sent')}
                    className={`w-full flex items-center justify-between py-1.5 px-3 rounded-lg ${
                      activeMenu === 'Sent' ? 'text-burgundy font-bold bg-blush' : 'text-muted hover:text-text'
                    }`}
                  >
                    <span>Sent</span>
                    <span className="bg-gold text-white text-[9px] font-bold px-1.5 rounded-full">0</span>
                  </button>
                  <button
                    onClick={() => setActiveMenu('Accepted')}
                    className={`w-full flex items-center justify-between py-1.5 px-3 rounded-lg ${
                      activeMenu === 'Accepted' ? 'text-burgundy font-bold bg-blush' : 'text-muted hover:text-text'
                    }`}
                  >
                    <span>Accepted</span>
                    <span className="bg-success text-white text-[9px] font-bold px-1.5 rounded-full">0</span>
                  </button>
                </div>
              </div>

              {[
                { label: 'Saved Profiles', icon: '🔖' },
                { label: 'Messages', icon: '💬', badge: 5 },
                { label: 'My Profile', icon: '👤' },
                { label: 'Partner Preferences', icon: '⚙️' },
                { label: 'Biodata', icon: '📄' },
                { label: 'Subscription', icon: '👑' },
                { label: 'Notifications', icon: '🔔', badge: 3 },
                { label: 'Privacy Center', icon: '🔒' },
                { label: 'Settings', icon: '🛠️' },
              ].map((link) => (
                <button
                  key={link.label}
                  onClick={() => { setActiveMenu(link.label); setSelectedCandidate(null); }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-semibold transition-all ${
                    activeMenu === link.label
                      ? 'bg-blush text-burgundy shadow-sm'
                      : 'text-muted hover:bg-cream/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span>{link.icon}</span>
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="bg-burgundy text-white text-[9px] font-bold px-1.5 rounded-full">{link.badge}</span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-burgundy hover:bg-blush/40 text-xs border-t border-border mt-4">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </aside>

        {/* MAIN DESKTOP CONTENT */}
        <main className="flex-1 p-8 space-y-8 overflow-y-auto">
          
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-6 border-b border-border">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted" />
              <input
                type="text"
                placeholder="Search profiles, city, profession..."
                className="w-full bg-surface border border-border rounded-xl pl-9 pr-4 py-2.5 text-xs text-text focus:outline-none focus:border-burgundy shadow-sm"
              />
            </div>

            <div className="flex items-center gap-4">
              <button className="relative w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-burgundy shadow-sm">
                <Bell className="w-4 h-4" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-burgundy" />
              </button>
              <div className="bg-surfaceWarm border border-gold px-3.5 py-1.5 rounded-xl flex items-center gap-2 shadow-sm">
                <Award className="w-4 h-4 text-gold" />
                <span className="text-[10px] font-bold text-burgundy tracking-wider uppercase">SUPER MEMBER</span>
              </div>
              <img 
                src={loggedInUser?.photos?.[0]?.url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80"} 
                className="w-10 h-10 rounded-full object-cover border border-border cursor-pointer shadow"
                alt=""
              />
            </div>
          </div>

          {!selectedCandidate ? (
            <>
              {/* Greeting & Stats */}
              <div className="space-y-6">
                <div>
                  <h1 className="font-serif font-bold text-3.5xl text-text">
                    Good Morning, {userName} 👋
                  </h1>
                  <p className="text-xs text-muted mt-1 font-medium">
                    Here are some profiles selected for you based on your preferences.
                  </p>
                </div>

                {/* 4 Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { count: recommendedList.length, label: 'Recommended Matches', icon: '💕' },
                    { count: interestsReceived.length, label: 'Interests Received', icon: '📩' },
                    { count: '0', label: 'Interests Sent', icon: '📤' },
                    { count: '0', label: 'Saved Profiles', icon: '🔖' },
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-surface border border-border p-4 rounded-2xl flex items-center justify-between shadow-sm hover:shadow transition-all">
                      <div>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-wider">{stat.label}</p>
                        <p className="font-serif text-2xl font-bold text-burgundy mt-1">{stat.count}</p>
                      </div>
                      <span className="text-xl p-2 bg-surfaceWarm rounded-full">{stat.icon}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Matches Section */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="font-serif text-xl font-bold text-text">Recommended For You</h2>
                  <button className="text-xs font-bold text-burgundy hover:underline flex items-center gap-1">
                    <span>View All</span>
                    <span>➔</span>
                  </button>
                </div>

                {matchesLoading ? (
                   <div className="text-xs text-muted">Analyzing compatibility and finding matches...</div>
                ) : recommendedList.length === 0 ? (
                  <div className="text-xs text-muted bg-surface p-6 rounded-xl border border-border">
                    No recommendations yet. Complete your profile and preferences to improve your matches.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                    {recommendedList.map((cand: any) => (
                      <div 
                        key={cand.id}
                        onClick={() => setSelectedCandidate(cand)}
                        className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-gold/50 cursor-pointer flex flex-col group transition-all duration-300"
                      >
                        <div className="relative h-64 w-full bg-gray-100 overflow-hidden">
                          <img
                            src={cand.photos?.[0]?.url}
                            alt=""
                            className="w-full h-full object-cover object-top group-hover:scale-102 transition-transform duration-300"
                          />
                          <div className="absolute top-3 right-3 bg-burgundy/95 text-[#FFF9F1] text-[9px] font-bold px-2 py-0.5 rounded-full border border-gold/40">
                            {cand.compatibilityScore}% Match
                          </div>
                        </div>
                        <div className="p-4 space-y-2">
                          <h3 className="font-serif font-bold text-base text-text">
                            {cand.firstName} {cand.lastName}
                          </h3>
                          <p className="text-[10px] text-muted font-medium">
                            {cand.age} Yrs • {cand.currentCity}
                          </p>
                          <p className="text-[10px] text-burgundy font-semibold">
                            {cand.jainIdentity?.sect} • {cand.jainIdentity?.community}
                          </p>
                          <div className="flex flex-col gap-1 pt-1 text-[9px] text-success font-semibold border-t border-gray-100 mt-2">
                            <p>✓ Identity Verified</p>
                            <p>✓ Jain Details Verified</p>
                          </div>

                          <div className="flex gap-2 pt-2 border-t border-gray-100">
                            <button
                              onClick={(e) => triggerInterestFlow(cand, e)}
                              className="flex-1 bg-burgundy text-white text-[10px] font-bold py-2 rounded-lg hover:bg-deepBurgundy transition-colors"
                            >
                              Interested
                            </button>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="p-2 border border-border rounded-lg hover:bg-cream/30 text-muted"
                            >
                              <Bookmark className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Interests & Activity Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Interests Received */}
                <div className="lg:col-span-7 bg-surface border border-border rounded-2xl p-6 space-y-4 shadow-sm">
                  <div className="flex justify-between items-center pb-2 border-b border-border">
                    <h3 className="font-serif font-bold text-base text-text">Interests Received</h3>
                    <button className="text-xs text-burgundy font-bold hover:underline">View All ➔</button>
                  </div>
                  
                  <div className="space-y-3">
                    {interestsReceived.length === 0 ? (
                      <p className="text-xs text-muted">No interests received yet.</p>
                    ) : (
                      interestsReceived.slice(0, 3).map((req: any) => (
                        <div key={req.id} className="flex items-center justify-between p-3 rounded-xl bg-surfaceWarm border border-border">
                          <div className="flex items-center gap-3">
                            <img src={req.senderProfile.photoUrl} className="w-10 h-10 rounded-full object-cover border border-gold" alt="" />
                            <div>
                              <p className="font-bold text-xs text-text">{req.senderProfile.first_name} {req.senderProfile.last_name}</p>
                              <p className="text-[10px] text-muted">{req.senderProfile.age} Yrs • {req.senderProfile.current_city} • Interested in you</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => handleAcceptInterest(req.id, req.sender_id)} className="bg-burgundy text-white text-[10px] font-bold px-4 py-1.5 rounded-lg hover:bg-deepBurgundy transition-colors shadow-sm">Accept</button>
                            <button onClick={() => declineInterest(req.id)} className="bg-white border border-border text-muted text-[10px] px-4 py-1.5 rounded-lg hover:bg-cream/20 transition-colors">Decline</button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="lg:col-span-5 bg-surface border border-border rounded-2xl p-6 space-y-4 shadow-sm">
                  <div className="flex justify-between items-center pb-2 border-b border-border">
                    <h3 className="font-serif font-bold text-base text-text">Recent Activity</h3>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="flex gap-3">
                      <span className="p-1 bg-cream rounded-full text-gold">📊</span>
                      <div>
                        <p className="text-text font-semibold">Your profile is <span className="font-bold text-burgundy">{profileComplete}% complete</span></p>
                        <p className="text-[10px] text-muted mt-0.5">Complete to get better matches</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Desktop Candidate Detail View */
            <div className="space-y-6">
              <button 
                onClick={() => setSelectedCandidate(null)}
                className="flex items-center gap-2 text-xs font-bold text-burgundy hover:underline"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Matches
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Photo & Accordions (4 Cols) */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-surface border border-border rounded-3xl p-4 shadow-sm text-center space-y-4">
                    <div className="rounded-2xl overflow-hidden h-96 w-full bg-gray-50">
                      <img src={selectedCandidate.photos?.[0]?.url} className="w-full h-full object-cover object-top" alt="" />
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => triggerInterestFlow(selectedCandidate)}
                        className="flex-1 bg-burgundy text-white py-3 rounded-xl text-xs font-bold shadow-md hover:bg-deepBurgundy flex items-center justify-center gap-2"
                      >
                        <Heart className="w-4 h-4" /> Interested
                      </button>
                      <button className="p-3 border border-border rounded-xl hover:bg-cream/20 text-muted">
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Details Panel (8 Cols) */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                    <div className="flex justify-between items-start gap-4 border-b border-border pb-6">
                      <div>
                        <h2 className="font-serif font-bold text-3xl text-text">
                          {selectedCandidate.firstName} {selectedCandidate.lastName}
                        </h2>
                        <p className="text-xs text-burgundy font-bold mt-1">
                          {selectedCandidate.jainIdentity?.sect} • {selectedCandidate.jainIdentity?.community}
                        </p>
                        <p className="text-xs text-muted mt-0.5">
                          {selectedCandidate.age} Yrs • {selectedCandidate.currentCity}
                        </p>
                      </div>
                      <div className="bg-surfaceWarm border border-gold p-4 rounded-2xl text-center shrink-0">
                        <p className="text-2xl font-serif font-bold text-burgundy">{selectedCandidate.compatibilityScore}%</p>
                        <p className="text-[9px] text-muted font-bold uppercase tracking-wider">Preference Compatibility</p>
                      </div>
                    </div>
                    
                    {/* Compatibility Reasons */}
                    {selectedCandidate.matchingReasons && selectedCandidate.matchingReasons.length > 0 && (
                      <div className="bg-blush/30 border border-border rounded-xl p-4 space-y-2">
                        <p className="text-xs font-bold text-burgundy">Why this is a good match:</p>
                        <ul className="text-xs text-text space-y-1">
                          {selectedCandidate.matchingReasons.map((reason: string, idx: number) => (
                            <li key={idx}>{reason}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Accordions */}
                    <div className="space-y-3">
                      {[
                        { id: 'about', label: 'About', content: selectedCandidate.aboutMe || 'Details provided upon connection.' },
                        { id: 'jain', label: 'Jain Details', content: `${selectedCandidate.jainIdentity?.sect} • ${selectedCandidate.jainIdentity?.community}` },
                        { id: 'biodata', label: 'Biodata 🔒', content: 'Available after mutual acceptance', locked: true },
                        { id: 'contact', label: 'Contact Details 🔒', content: 'Available after mutual acceptance', locked: true },
                      ].map((sec) => (
                        <div key={sec.id} className="border-b border-border pb-2">
                          <button
                            onClick={() => toggleAccordion(sec.id)}
                            className="w-full flex justify-between items-center py-2 text-sm font-semibold text-text text-left hover:text-burgundy"
                          >
                            <span>{sec.label}</span>
                            {accordionOpen[sec.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                          
                          {accordionOpen[sec.id] && (
                            <div className="text-xs text-muted leading-relaxed py-2 pl-2">
                              {sec.locked ? (
                                <div className="flex items-center gap-2 text-burgundy font-semibold">
                                  <Lock className="w-3.5 h-3.5" />
                                  <span>{sec.content}</span>
                                </div>
                              ) : (
                                <span>{sec.content}</span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ==========================================
          MOBILE PORTRAIT APPLICATION VISUALS
          ========================================== */}
      <div className="flex md:hidden flex-col min-h-screen bg-background pb-20">
        
        {/* Mobile Header Bar */}
        <header className="sticky top-0 z-40 bg-surface border-b border-border px-4 py-3.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button className="text-text font-bold text-lg">☰</button>
            <div className="font-serif font-bold text-lg text-burgundy">JainSaathi</div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-8 h-8 rounded-full bg-surfaceWarm flex items-center justify-center text-burgundy">
              <span>🔔</span>
              <span className="absolute top-1 right-1 bg-burgundy text-white text-[8px] font-bold px-1 rounded-full">3</span>
            </button>
            <img 
              src={loggedInUser?.photos?.[0]?.url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80"} 
              className="w-8 h-8 rounded-full object-cover border border-gold" 
              alt=""
            />
          </div>
        </header>

        {/* TAB 1: Home View */}
        {mobileTab === 'home' && (
          <div className="p-4 space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-text">Good Morning, {userName} 👋</h2>
              <p className="text-xs text-muted mt-0.5">Find your perfect Jain Saathi</p>
            </div>

            {/* Profile complete card */}
            <div className="bg-surface border border-border p-4 rounded-2xl space-y-3 shadow-sm flex items-center gap-4">
              <img 
                src={loggedInUser?.photos?.[0]?.url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80"} 
                className="w-12 h-12 rounded-full object-cover border border-gold"
                alt=""
              />
              <div className="flex-1 space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold text-text">
                  <span>Profile Complete</span>
                  <span className="text-burgundy">{profileComplete}%</span>
                </div>
                <div className="w-full bg-cream h-1.5 rounded-full overflow-hidden">
                  <div className="bg-burgundy h-full" style={{ width: `${profileComplete}%` }} />
                </div>
                <button className="bg-burgundy text-white text-[10px] font-bold px-4 py-1.5 rounded-lg">
                  Complete Profile
                </button>
              </div>
            </div>

            {/* Recommended For You - Portrait layout */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-serif font-bold text-lg text-text">Recommended For You</h3>
                <button 
                  onClick={() => setMobileTab('matches')} 
                  className="text-xs font-bold text-burgundy hover:underline"
                >
                  View All ➔
                </button>
              </div>

              {recommendedList.slice(0, 1).map((cand: any) => (
                <div 
                  key={cand.id}
                  onClick={() => setSelectedCandidate(cand)}
                  className="bg-surface border border-border rounded-2xl overflow-hidden shadow-md relative"
                >
                  <div className="relative h-[320px] bg-gray-50">
                    <img src={cand.photos?.[0]?.url} className="w-full h-full object-cover object-top" alt="" />
                    <div className="absolute top-3 right-3 bg-burgundy/90 text-[#FFF9F1] text-[9px] font-bold px-2 py-0.5 rounded-full">
                      {cand.compatibilityScore}%
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <h4 className="font-serif font-bold text-lg text-text">{cand.firstName} {cand.lastName}</h4>
                    <p className="text-xs text-muted">{cand.age} • {cand.currentCity}</p>
                    <p className="text-xs text-burgundy font-semibold">{cand.jainIdentity?.sect} • {cand.jainIdentity?.community}</p>
                    <div className="flex gap-2 pt-1 text-[9px] text-success">
                      <span>✓ Identity Verified</span>
                      <span>✓ Jain Details Verified</span>
                    </div>

                    <div className="flex gap-2 pt-3">
                      <button 
                        onClick={(e) => triggerInterestFlow(cand, e)}
                        className="flex-1 bg-burgundy text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                      >
                        <Heart className="w-3.5 h-3.5" /> Interested
                      </button>
                      <button className="p-2.5 border border-border rounded-xl text-muted">
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Interests Received */}
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg text-text">Interests Received</h3>
              <div className="bg-surface border border-border rounded-2xl p-4 space-y-3">
                {interestsReceived.length === 0 ? (
                  <p className="text-xs text-muted text-center py-4">No interests yet.</p>
                ) : (
                  interestsReceived.slice(0, 1).map((req: any) => (
                    <div key={req.id}>
                      <div className="flex items-center justify-between pb-2 border-b border-border mb-3">
                        <div className="flex items-center gap-3">
                          <img src={req.senderProfile.photoUrl} className="w-10 h-10 rounded-full object-cover border border-gold" alt="" />
                          <div>
                            <p className="font-bold text-xs text-text">{req.senderProfile.first_name} {req.senderProfile.last_name}</p>
                            <p className="text-[10px] text-muted">{req.senderProfile.age} Yrs • {req.senderProfile.current_city}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleAcceptInterest(req.id, req.sender_id)} className="flex-1 bg-burgundy text-white py-2 rounded-xl text-xs font-bold">Accept</button>
                        <button onClick={() => declineInterest(req.id)} className="flex-1 bg-white border border-border text-muted py-2 rounded-xl text-xs">Decline</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Matches list */}
        {mobileTab === 'matches' && (
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <h2 className="font-serif text-xl font-bold text-text">Matches</h2>
              <button 
                onClick={() => setMobileFilterOpen(true)} 
                className="p-2 border border-border rounded-xl bg-surface text-burgundy shadow-sm"
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>

            {/* Horizontal sub-tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none text-xs font-bold text-muted">
              {['For You', 'Compatible', 'New', 'Nearby', 'Featured'].map((tab, idx) => (
                <span 
                  key={tab} 
                  className={`px-4 py-1.5 rounded-full shrink-0 border transition-all ${
                    idx === 0 ? 'bg-burgundy text-white border-burgundy' : 'bg-surface border-border hover:border-gold'
                  }`}
                >
                  {tab}
                </span>
              ))}
            </div>

            {/* Vertical list of candidates */}
            <div className="space-y-4">
              {recommendedList.map((cand: any) => (
                <div 
                  key={cand.id} 
                  onClick={() => setSelectedCandidate(cand)}
                  className="bg-surface border border-border rounded-2xl p-3 flex gap-3 shadow-sm relative cursor-pointer"
                >
                  <img src={cand.photos?.[0]?.url} className="w-20 h-24 rounded-xl object-cover shrink-0" alt="" />
                  <div className="flex-1 space-y-1">
                    <h3 className="font-serif font-bold text-base text-text">{cand.firstName} {cand.lastName}</h3>
                    <p className="text-[10px] text-muted">{cand.age} Yrs • {cand.currentCity}</p>
                    <p className="text-[10px] text-burgundy font-semibold">{cand.jainIdentity?.sect} • {cand.jainIdentity?.community}</p>
                    <span className="text-[8px] font-bold text-success bg-success/10 px-1.5 py-0.5 rounded border border-success/20">{cand.compatibilityScore}% Match</span>
                  </div>
                  <div className="flex flex-col gap-1 justify-center">
                    <button 
                      onClick={(e) => triggerInterestFlow(cand, e)}
                      className="p-2 bg-burgundy text-white rounded-full hover:bg-deepBurgundy transition-colors"
                    >
                      <Heart className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 border border-border rounded-full hover:bg-cream/20 text-muted"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3, 4, 5 placeholder list */}
        {['interests', 'messages', 'profile'].includes(mobileTab) && (
          <div className="p-4 space-y-6 text-center py-20">
            <span className="text-4xl">🪷</span>
            <h3 className="font-serif text-lg font-bold text-text capitalize">{mobileTab}</h3>
            <p className="text-xs text-muted max-w-xs mx-auto leading-relaxed">
              Your matrimonial connections and messages are private and secured using Supabase Row Level Security.
            </p>
          </div>
        )}

        {/* MOBILE BOTTOM NAVIGATION BAR */}
        <nav className="fixed bottom-0 inset-x-0 bg-surface border-t border-border px-4 py-2 flex justify-around items-center z-40 shadow-lg pb-4">
          {[
            { id: 'home', label: 'Home', icon: '🏠' },
            { id: 'matches', label: 'Matches', icon: '💕' },
            { id: 'interests', label: 'Interests', icon: '📩', badge: interestsReceived.length > 0 ? interestsReceived.length : undefined },
            { id: 'messages', label: 'Messages', icon: '💬', badge: 5 },
            { id: 'profile', label: 'Profile', icon: '👤' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setMobileTab(tab.id as any); setSelectedCandidate(null); }}
              className="flex flex-col items-center gap-1 flex-1 relative"
            >
              <span className="text-lg">{tab.icon}</span>
              <span className={`text-[9px] font-bold ${mobileTab === tab.id ? 'text-burgundy' : 'text-muted'}`}>
                {tab.label}
              </span>
              {mobileTab === tab.id && (
                <span className="w-1.5 h-1.5 rounded-full bg-burgundy mt-0.5" />
              )}
              {tab.badge && (
                <span className="absolute -top-1.5 right-3 bg-burgundy text-white text-[8px] font-bold px-1 rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* MOBILE FULL SCREEN FILTER DRAWER */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 bg-background flex flex-col p-4">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <button onClick={() => setMobileFilterOpen(false)} className="text-xs font-bold text-burgundy">← Back</button>
              <h2 className="font-serif text-lg font-bold text-text">Filters</h2>
              <button className="text-xs text-muted hover:text-text">Clear All</button>
            </div>

            <div className="flex-grow overflow-y-auto py-4 space-y-6">
              {/* Age slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>Age Range</span>
                  <span className="text-burgundy">22 - 30</span>
                </div>
                <div className="w-full bg-cream h-2 rounded-full relative">
                  <div className="absolute left-[10%] right-[30%] h-full bg-burgundy rounded-full" />
                  <div className="absolute left-[10%] -top-1.5 w-5 h-5 rounded-full bg-white border-2 border-burgundy shadow" />
                  <div className="absolute right-[30%] -top-1.5 w-5 h-5 rounded-full bg-white border-2 border-burgundy shadow" />
                </div>
              </div>

              {/* Height slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>Height Range</span>
                  <span className="text-burgundy">5'0" - 6'5"</span>
                </div>
                <div className="w-full bg-cream h-2 rounded-full relative">
                  <div className="absolute left-[5%] right-[15%] h-full bg-burgundy rounded-full" />
                </div>
              </div>

              <div className="space-y-4 text-xs font-semibold text-text">
                <div className="flex justify-between py-2 border-b border-border">
                  <span>Location</span>
                  <span className="text-muted">Maharashtra, Mumbai ➔</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span>Jain Sect</span>
                  <span className="text-muted">All ➔</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span>Community</span>
                  <span className="text-muted">All ➔</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span>Education</span>
                  <span className="text-muted">All ➔</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span>Profession</span>
                  <span className="text-muted">All ➔</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setMobileFilterOpen(false)}
              className="w-full bg-burgundy text-white py-3.5 rounded-xl text-xs font-bold shadow-md"
            >
              Show Matches
            </button>
          </div>
        )}

        {/* MOBILE DETAILED CANDIDATE PROFILE */}
        {selectedCandidate && (
          <div className="fixed inset-0 z-50 bg-background flex flex-col pb-16 overflow-y-auto">
            <div className="relative h-[380px] bg-gray-900 shrink-0">
              <img src={selectedCandidate.photos?.[0]?.url} className="w-full h-full object-cover object-top" alt="" />
              <button 
                onClick={() => setSelectedCandidate(null)}
                className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/70 flex items-center justify-center text-text font-bold"
              >
                ←
              </button>

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 text-white">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <h2 className="font-serif font-bold text-2xl flex items-center gap-1.5">
                      <span>{selectedCandidate.firstName}</span>
                      <span className="text-gold text-sm">✓</span>
                    </h2>
                    <p className="text-xs text-[#FFF9F1]/80">{selectedCandidate.age} • {selectedCandidate.currentCity}</p>
                    <p className="text-xs text-gold font-semibold">{selectedCandidate.jainIdentity?.sect} • {selectedCandidate.jainIdentity?.community}</p>
                  </div>
                  <div className="bg-burgundy border border-gold p-2 rounded-xl text-center">
                    <p className="text-lg font-serif font-bold text-white">{selectedCandidate.compatibilityScore}%</p>
                    <p className="text-[7px] text-gray-200 uppercase font-bold tracking-wider">Compatibility</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <div className="flex gap-3">
                <button 
                  onClick={() => triggerInterestFlow(selectedCandidate)}
                  className="flex-1 bg-burgundy text-white py-3 rounded-xl text-xs font-bold shadow-md hover:bg-deepBurgundy flex items-center justify-center gap-1.5"
                >
                  <Heart className="w-4 h-4" /> Interested
                </button>
                <button className="p-3 border border-border rounded-xl text-muted bg-white">
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>

              {selectedCandidate.matchingReasons && selectedCandidate.matchingReasons.length > 0 && (
                <div className="bg-blush/30 border border-border rounded-xl p-4 space-y-1">
                  <p className="text-xs font-bold text-burgundy">Why this is a good match:</p>
                  {selectedCandidate.matchingReasons.map((r: string, i: number) => (
                     <p key={i} className="text-xs text-text">{r}</p>
                  ))}
                </div>
              )}

              {/* Accordions */}
              <div className="space-y-2.5 pt-2">
                {[
                  { id: 'about', label: 'About', content: selectedCandidate.aboutMe || 'Details provided upon connection' },
                  { id: 'jain', label: 'Jain Details', content: `${selectedCandidate.jainIdentity?.sect} • ${selectedCandidate.jainIdentity?.community}` },
                  { id: 'biodata', label: 'Biodata 🔒', content: 'Available after mutual acceptance', locked: true },
                  { id: 'contact', label: 'Contact Details 🔒', content: 'Available after mutual acceptance', locked: true },
                ].map((sec) => (
                  <div key={sec.id} className="border-b border-border pb-2">
                    <button
                      onClick={() => toggleAccordion(sec.id)}
                      className="w-full flex justify-between items-center py-2.5 text-xs font-semibold text-text text-left hover:text-burgundy"
                    >
                      <span>{sec.label}</span>
                      {accordionOpen[sec.id] ? <ChevronUp className="w-4 h-4 text-burgundy" /> : <ChevronDown className="w-4 h-4 text-muted" />}
                    </button>
                    
                    {accordionOpen[sec.id] && (
                      <div className="text-xs text-muted leading-relaxed py-2 pl-1">
                        {sec.locked ? (
                          <div className="flex items-center gap-1.5 text-burgundy font-semibold bg-blush/25 p-2.5 rounded-lg border border-border w-fit">
                            <Lock className="w-3.5 h-3.5" />
                            <span>{sec.content}</span>
                          </div>
                        ) : (
                          <span>{sec.content}</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ==========================================
          INTEREST FLOW MODAL / BOTTOM SHEET
          ========================================== */}
      <AnimatePresence>
        {interestModalCandidate && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-border p-6 rounded-3xl max-w-sm w-full text-center space-y-6 shadow-2xl relative"
            >
              <button 
                onClick={() => setInterestModalCandidate(null)}
                className="absolute top-4 right-4 text-muted hover:text-text font-bold text-sm"
              >
                ✕
              </button>

              {interestSentStatus !== 'success' ? (
                <>
                  <div className="flex justify-center">
                    <span className="text-4xl p-3 bg-blush rounded-full text-burgundy">💝</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif font-bold text-lg text-text">Interested in {interestModalCandidate.firstName}?</h3>
                    <p className="text-xs text-muted leading-relaxed px-4">
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
                      className="w-full border border-border text-muted py-3 rounded-xl text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-5 py-2">
                  <div className="flex justify-center text-success">
                    <CheckCircle className="w-12 h-12 fill-current" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-serif font-bold text-lg text-text">Interest Sent ✓</h3>
                    <p className="text-xs text-muted leading-relaxed px-4">
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
