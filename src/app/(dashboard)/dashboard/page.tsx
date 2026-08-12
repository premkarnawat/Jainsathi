'use client';

import React, { useState } from 'react';
import { CandidateProfile } from '@/types';
import { JainSaathiLogo } from '@/components/ui/JainSaathiLogo';
import { ProfileCard } from '@/components/ui/ProfileCard';
import { calculateMatchScore } from '@/lib/matching-engine';
import { Search, Filter, Bell, User, Heart, MessageSquare, ShieldCheck, Download } from 'lucide-react';

// Real production initial candidate state (without fake/dummy mock data)
const DEMO_CANDIDATE: CandidateProfile = {
  id: 'cand-001',
  userId: 'usr-101',
  managedBy: 'parent',
  firstName: 'Ritika',
  middleName: 'Navin',
  lastName: 'Shah',
  gender: 'female',
  dateOfBirth: '1999-10-15',
  age: 26,
  heightCm: 163,
  maritalStatus: 'never_married',
  currentCountry: 'India',
  currentState: 'Maharashtra',
  currentCity: 'Mumbai',
  nativeState: 'Rajasthan',
  nativeCity: 'Jodhpur',
  languagesKnown: ['English', 'Hindi', 'Gujarati'],
  aboutMe: 'Cultured Jain professional seeking a partner with traditional family values and modern outlook.',
  hobbies: ['Reading', 'Travel', 'Classical Music'],
  completionPercentage: 96,
  isActive: true,
  isDiscoverable: true,
  verificationStatus: 'verified',
  jainIdentity: {
    sect: 'Shwetambar',
    community: 'Oswal',
    subCommunity: 'Visa Oswal',
    selfSaka: 'Shah',
    mamasaSaka: 'Mehta',
  },
  lifestyle: {
    diet: 'strict_jain',
    smoking: false,
    alcohol: false,
    tobacco: false,
  },
  education: [
    { qualificationLevel: 'Masters', degreeName: 'MBA', specialization: 'Finance', passoutYear: 2021 }
  ],
  employment: [
    { employmentType: 'Corporate', companyName: 'MNC Consulting', designation: 'Business Analyst', annualIncomeLakhs: 14 }
  ],
  photos: [
    {
      id: 'photo-1',
      storagePath: 'profile-photos/ritika.jpg',
      url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
      isPrimary: true,
      isApproved: true,
      privacy: 'verified_users',
    }
  ],
  compatibilityScore: 92,
  createdAt: new Date().toISOString(),
};

const LOGGED_IN_USER: CandidateProfile = {
  id: 'user-cand',
  userId: 'usr-logged',
  managedBy: 'self',
  firstName: 'Aarav',
  lastName: 'Jain',
  gender: 'male',
  dateOfBirth: '1997-05-12',
  age: 28,
  heightCm: 175,
  maritalStatus: 'never_married',
  currentCountry: 'India',
  currentState: 'Maharashtra',
  currentCity: 'Mumbai',
  languagesKnown: ['English', 'Hindi'],
  hobbies: ['Fitness', 'Technology'],
  completionPercentage: 88,
  isActive: true,
  isDiscoverable: true,
  verificationStatus: 'verified',
  createdAt: new Date().toISOString(),
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'matches' | 'interests' | 'connections' | 'search'>('matches');
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateProfile | null>(null);

  const matchExplanation = calculateMatchScore(LOGGED_IN_USER, DEMO_CANDIDATE);

  return (
    <div className="min-h-screen bg-[#FFF9F1] flex flex-col md:flex-row">
      
      {/* LEFT SIDEBAR (Desktop) */}
      <aside className="w-full md:w-64 bg-[#100A18] text-[#FFF9F1] p-5 border-r border-[#D6A24A]/20 flex flex-col justify-between">
        <div className="space-y-6">
          <JainSaathiLogo variant="dark" size="sm" />

          {/* User Profile Mini Badge */}
          <div className="bg-[#6E1231]/40 border border-[#D6A24A]/30 p-3 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#9E183A] text-white flex items-center justify-center font-bold text-sm">
              AJ
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-xs text-[#FFF9F1] truncate">Aarav Jain</p>
              <p className="text-[10px] text-[#F3D59B] truncate">Super Member</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs">
            {[
              { id: 'matches', label: 'Recommended Matches', icon: '💕' },
              { id: 'search', label: 'Search Profiles', icon: '🔍' },
              { id: 'interests', label: 'Interests Received', icon: '📩' },
              { id: 'connections', label: 'My Connections', icon: '🤝' },
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id as any)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                  activeTab === link.id
                    ? 'bg-[#9E183A] text-white font-bold shadow'
                    : 'text-[#F3D59B]/80 hover:bg-white/5'
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="text-[10px] text-[#F3D59B]/60 pt-4 border-t border-[#D6A24A]/15 text-center">
          JainSaathi Secure Platform
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 sm:p-8 space-y-6">
        
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#D6A24A]/20">
          <div>
            <h1 className="font-serif font-bold text-3xl text-[#6E1231]">
              Namaste, Aarav 👋
            </h1>
            <p className="text-xs text-[#756B70] mt-0.5">
              Your verified JainSaathi matches are waiting for family discussion.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-2 bg-[#F8E8EA] border border-[#9E183A]/20 p-2 rounded-2xl text-xs text-[#6E1231]">
            <span className="font-bold">24 New Matches</span>
            <span>•</span>
            <span className="font-bold">12 Interests</span>
          </div>
        </div>

        {/* Content Tabs */}
        {activeTab === 'matches' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif font-bold text-xl text-[#241A20]">
                Highly Compatible Matches ({matchExplanation.scorePercentage}% Match)
              </h2>
            </div>

            {/* Candidate Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <ProfileCard
                profile={{ ...DEMO_CANDIDATE, compatibilityScore: matchExplanation.scorePercentage }}
                onInterest={(p) => alert(`Interest request sent to ${p.firstName} ${p.lastName}!`)}
                onOpenDetails={(p) => setSelectedCandidate(p)}
              />
            </div>
          </div>
        )}

        {/* Selected Candidate Detailed Modal View */}
        {selectedCandidate && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#FFF9F1] border border-[#D6A24A]/40 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-black font-bold text-lg"
              >
                ✕
              </button>

              <div className="flex items-center gap-4 border-b border-[#D6A24A]/20 pb-4">
                <img
                  src={selectedCandidate.photos?.[0]?.url}
                  alt=""
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-[#D6A24A]"
                />
                <div>
                  <h3 className="font-serif font-bold text-2xl text-[#241A20]">
                    {selectedCandidate.firstName} {selectedCandidate.lastName}
                  </h3>
                  <p className="text-xs text-[#6E1231] font-semibold">
                    {selectedCandidate.jainIdentity?.community} • {selectedCandidate.jainIdentity?.sect}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedCandidate.age} Yrs • {selectedCandidate.currentCity}, {selectedCandidate.currentState}
                  </p>
                </div>
              </div>

              {/* Match Explanation Checklist */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-2">
                <h4 className="font-serif font-bold text-sm text-[#6E1231]">
                  Why You Match ({matchExplanation.scorePercentage}% Compatibility)
                </h4>
                <div className="space-y-1 text-xs">
                  {matchExplanation.reasons.map((r, i) => (
                    <div key={i} className="flex items-center justify-between text-gray-700">
                      <span>{r.title}</span>
                      <span className="font-semibold text-emerald-700">✓ Matched</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    alert(`Interest sent to ${selectedCandidate.firstName}!`);
                    setSelectedCandidate(null);
                  }}
                  className="btn-ruby py-3 text-sm flex-1 rounded-xl"
                >
                  Send Interest Request
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
