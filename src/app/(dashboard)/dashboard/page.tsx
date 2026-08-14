'use client';

import React, { useState } from 'react';
import { CandidateProfile } from '@/types';
import { JainSaathiLogo } from '@/components/ui/JainSaathiLogo';
import { calculateMatchScore } from '@/lib/matching-engine';
import { 
  Search, Filter, Bell, User, Heart, MessageSquare, ShieldCheck, 
  Download, Award, Settings, LogOut, CheckCircle2, Bookmark, X, ArrowLeft
} from 'lucide-react';

const RECOMMENDATIONS: CandidateProfile[] = [
  {
    id: 'cand-001',
    userId: 'usr-101',
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
    aboutMe: 'Aarav is a grounded, family-oriented person with a positive outlook towards life. He is currently working as a Business Analyst at Deloitte.',
    hobbies: ['Fitness', 'Technology'],
    completionPercentage: 92,
    isActive: true,
    isDiscoverable: true,
    verificationStatus: 'verified',
    jainIdentity: {
      sect: 'Shwetambar',
      community: 'Oswal',
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
      { qualificationLevel: 'Masters', degreeName: 'MBA', specialization: 'Finance', passoutYear: 2020 }
    ],
    employment: [
      { employmentType: 'Corporate', companyName: 'Deloitte', designation: 'Business Analyst', annualIncomeLakhs: 18 }
    ],
    photos: [
      {
        id: 'p-1',
        storagePath: 'profile-photos/aarav.jpg',
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
        isPrimary: true,
        isApproved: true,
        privacy: 'verified_users',
      }
    ],
    compatibilityScore: 92,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cand-002',
    userId: 'usr-102',
    managedBy: 'parent',
    firstName: 'Rahul',
    lastName: 'Jain',
    gender: 'male',
    dateOfBirth: '1996-08-20',
    age: 29,
    heightCm: 180,
    maritalStatus: 'never_married',
    currentCountry: 'India',
    currentState: 'Maharashtra',
    currentCity: 'Pune',
    languagesKnown: ['English', 'Hindi', 'Marathi'],
    hobbies: ['Coding', 'Cycling'],
    completionPercentage: 88,
    isActive: true,
    isDiscoverable: true,
    verificationStatus: 'verified',
    jainIdentity: {
      sect: 'Digambar',
      community: 'Murtipujak',
    },
    education: [
      { qualificationLevel: 'Bachelors', degreeName: 'MS', specialization: 'Software Engineering' }
    ],
    employment: [
      { employmentType: 'Corporate', companyName: 'Tech Corp', designation: 'Software Engineer', annualIncomeLakhs: 22 }
    ],
    photos: [
      {
        id: 'p-2',
        storagePath: 'profile-photos/rahul.jpg',
        url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600',
        isPrimary: true,
        isApproved: true,
        privacy: 'verified_users',
      }
    ],
    compatibilityScore: 86,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cand-003',
    userId: 'usr-103',
    managedBy: 'self',
    firstName: 'Mehul',
    lastName: 'Shah',
    gender: 'male',
    dateOfBirth: '1998-11-05',
    age: 27,
    heightCm: 172,
    maritalStatus: 'never_married',
    currentCountry: 'India',
    currentState: 'Gujarat',
    currentCity: 'Ahmedabad',
    languagesKnown: ['English', 'Gujarati'],
    hobbies: ['Finance', 'Reading'],
    completionPercentage: 85,
    isActive: true,
    isDiscoverable: true,
    verificationStatus: 'verified',
    jainIdentity: {
      sect: 'Shwetambar',
      community: 'Oswal',
    },
    education: [
      { qualificationLevel: 'Bachelors', degreeName: 'CA', specialization: 'Chartered Accountant' }
    ],
    employment: [
      { employmentType: 'Corporate', companyName: 'KPMG', designation: 'Chartered Accountant', annualIncomeLakhs: 15 }
    ],
    photos: [
      {
        id: 'p-3',
        storagePath: 'profile-photos/mehul.jpg',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600',
        isPrimary: true,
        isApproved: true,
        privacy: 'verified_users',
      }
    ],
    compatibilityScore: 87,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cand-004',
    userId: 'usr-104',
    managedBy: 'parent',
    firstName: 'Harsh',
    lastName: 'Jain',
    gender: 'male',
    dateOfBirth: '1995-04-15',
    age: 30,
    heightCm: 178,
    maritalStatus: 'never_married',
    currentCountry: 'India',
    currentState: 'Karnataka',
    currentCity: 'Bengaluru',
    languagesKnown: ['English', 'Hindi', 'Kannada'],
    hobbies: ['Product Design', 'Hiking'],
    completionPercentage: 90,
    isActive: true,
    isDiscoverable: true,
    verificationStatus: 'verified',
    jainIdentity: {
      sect: 'Digambar',
      community: 'Sthanakvasi',
    },
    education: [
      { qualificationLevel: 'Bachelors', degreeName: 'B.Tech', specialization: 'Computer Science' }
    ],
    employment: [
      { employmentType: 'Corporate', companyName: 'Startup', designation: 'Product Manager', annualIncomeLakhs: 25 }
    ],
    photos: [
      {
        id: 'p-4',
        storagePath: 'profile-photos/harsh.jpg',
        url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600',
        isPrimary: true,
        isApproved: true,
        privacy: 'verified_users',
      }
    ],
    compatibilityScore: 85,
    createdAt: new Date().toISOString(),
  }
];

export default function DashboardPage() {
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateProfile | null>(null);
  const [activeMenu, setActiveMenu] = useState('Home');

  return (
    <div className="min-h-screen bg-[#FFF9F1] flex flex-col lg:flex-row">
      
      {/* LEFT SIDEBAR (Desktop) */}
      <aside className="w-full lg:w-72 bg-[#100A18] text-[#FFF9F1] p-6 border-r border-[#D6A24A]/25 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="pb-4 border-b border-[#D6A24A]/15">
            <JainSaathiLogo variant="dark" size="sm" />
          </div>

          {/* User Profile Progress Card */}
          <div className="bg-[#6E1231]/40 border border-[#D6A24A]/25 p-4 rounded-2xl space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D6A24A] text-[#100A18] flex items-center justify-center font-bold text-sm">
                PJ
              </div>
              <div>
                <p className="font-bold text-xs text-[#FFF9F1]">Priya Jain</p>
                <span className="bg-[#D6A24A]/20 text-[#D6A24A] text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#D6A24A]/30">
                  Super Member
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-[#F3D59B]">
                <span>Profile Complete</span>
                <span className="font-bold">92%</span>
              </div>
              <div className="w-full bg-[#100A18]/60 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#9E183A] h-full w-[92%]" />
              </div>
            </div>
            <button className="w-full bg-[#9E183A] text-white text-[11px] font-bold py-2 rounded-xl hover:bg-[#80122E] transition-all">
              Complete Profile
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs max-h-[50vh] overflow-y-auto pr-1">
            <button
              onClick={() => { setActiveMenu('Home'); setSelectedCandidate(null); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-semibold transition-all ${
                activeMenu === 'Home' ? 'bg-[#9E183A] text-white shadow-md' : 'text-[#F3D59B]/85 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <span>🏠</span>
                <span>Home</span>
              </div>
            </button>

            <button
              onClick={() => { setActiveMenu('Recommended'); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-semibold transition-all ${
                activeMenu === 'Recommended' ? 'bg-[#9E183A] text-white shadow-md' : 'text-[#F3D59B]/85 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <span>💕</span>
                <span>Recommended</span>
              </div>
            </button>

            <button
              onClick={() => { setActiveMenu('Search Matches'); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-semibold transition-all ${
                activeMenu === 'Search Matches' ? 'bg-[#9E183A] text-white shadow-md' : 'text-[#F3D59B]/85 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <span>🔍</span>
                <span>Search Matches</span>
              </div>
            </button>

            <button
              onClick={() => { setActiveMenu('Featured Profiles'); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-semibold transition-all ${
                activeMenu === 'Featured Profiles' ? 'bg-[#9E183A] text-white shadow-md' : 'text-[#F3D59B]/85 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <span>⭐</span>
                <span>Featured Profiles</span>
              </div>
            </button>

            {/* Interests Section with Submenu */}
            <div className="space-y-1">
              <div className="flex items-center gap-3 px-4 py-2 text-[#FFF9F1] font-semibold">
                <span>📩</span>
                <span>Interests</span>
              </div>
              <div className="pl-8 space-y-1 text-[11px]">
                <button
                  onClick={() => { setActiveMenu('Received'); }}
                  className={`w-full flex items-center justify-between py-1.5 px-3 rounded-lg ${
                    activeMenu === 'Received' ? 'text-white font-bold bg-white/10' : 'text-[#F3D59B]/70 hover:text-white'
                  }`}
                >
                  <span>Received</span>
                  <span className="bg-[#9E183A] text-white text-[9px] font-bold px-1.5 rounded-full">12</span>
                </button>
                <button
                  onClick={() => { setActiveMenu('Sent'); }}
                  className={`w-full flex items-center justify-between py-1.5 px-3 rounded-lg ${
                    activeMenu === 'Sent' ? 'text-white font-bold bg-white/10' : 'text-[#F3D59B]/70 hover:text-white'
                  }`}
                >
                  <span>Sent</span>
                  <span className="bg-[#D6A24A] text-[#100A18] text-[9px] font-bold px-1.5 rounded-full">8</span>
                </button>
                <button
                  onClick={() => { setActiveMenu('Accepted'); }}
                  className={`w-full flex items-center justify-between py-1.5 px-3 rounded-lg ${
                    activeMenu === 'Accepted' ? 'text-white font-bold bg-white/10' : 'text-[#F3D59B]/70 hover:text-white'
                  }`}
                >
                  <span>Accepted</span>
                  <span className="bg-emerald-600 text-white text-[9px] font-bold px-1.5 rounded-full">6</span>
                </button>
              </div>
            </div>

            <button
              onClick={() => { setActiveMenu('Saved Profiles'); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-semibold transition-all ${
                activeMenu === 'Saved Profiles' ? 'bg-[#9E183A] text-white shadow-md' : 'text-[#F3D59B]/85 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <span>🔖</span>
                <span>Saved Profiles</span>
              </div>
            </button>

            <button
              onClick={() => { setActiveMenu('Messages'); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-semibold transition-all ${
                activeMenu === 'Messages' ? 'bg-[#9E183A] text-white shadow-md' : 'text-[#F3D59B]/85 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <span>💬</span>
                <span>Messages</span>
              </div>
              <span className="bg-[#9E183A] text-white text-[9px] font-bold px-1.5 rounded-full">5</span>
            </button>

            <button
              onClick={() => { setActiveMenu('My Profile'); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-semibold transition-all ${
                activeMenu === 'My Profile' ? 'bg-[#9E183A] text-white shadow-md' : 'text-[#F3D59B]/85 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <span>👤</span>
                <span>My Profile</span>
              </div>
            </button>

            <button
              onClick={() => { setActiveMenu('Partner Preferences'); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-semibold transition-all ${
                activeMenu === 'Partner Preferences' ? 'bg-[#9E183A] text-white shadow-md' : 'text-[#F3D59B]/85 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <span>⚙️</span>
                <span>Partner Preferences</span>
              </div>
            </button>

            <button
              onClick={() => { setActiveMenu('Biodata'); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-semibold transition-all ${
                activeMenu === 'Biodata' ? 'bg-[#9E183A] text-white shadow-md' : 'text-[#F3D59B]/85 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <span>📄</span>
                <span>Biodata</span>
              </div>
            </button>

            <button
              onClick={() => { setActiveMenu('Subscription'); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-semibold transition-all ${
                activeMenu === 'Subscription' ? 'bg-[#9E183A] text-white shadow-md' : 'text-[#F3D59B]/85 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <span>👑</span>
                <span>Subscription</span>
              </div>
            </button>

            <button
              onClick={() => { setActiveMenu('Notifications'); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-semibold transition-all ${
                activeMenu === 'Notifications' ? 'bg-[#9E183A] text-white shadow-md' : 'text-[#F3D59B]/85 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <span>🔔</span>
                <span>Notifications</span>
              </div>
              <span className="bg-[#9E183A] text-white text-[9px] font-bold px-1.5 rounded-full">3</span>
            </button>

            <button
              onClick={() => { setActiveMenu('Privacy Center'); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-semibold transition-all ${
                activeMenu === 'Privacy Center' ? 'bg-[#9E183A] text-white shadow-md' : 'text-[#F3D59B]/85 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <span>🔒</span>
                <span>Privacy Center</span>
              </div>
            </button>

            <button
              onClick={() => { setActiveMenu('Settings'); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-semibold transition-all ${
                activeMenu === 'Settings' ? 'bg-[#9E183A] text-white shadow-md' : 'text-[#F3D59B]/85 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <span>🛠️</span>
                <span>Settings</span>
              </div>
            </button>
          </nav>
        </div>

        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-red-400 hover:bg-red-950/20 text-xs pt-4 border-t border-[#D6A24A]/15 mt-4">
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 sm:p-8 space-y-8 overflow-y-auto">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-6 border-b border-[#D6A24A]/25">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 w-4 h-4 text-[#756B70]" />
            <input
              type="text"
              placeholder="Search profiles, city, profession..."
              className="w-full bg-white border border-[#D6A24A]/30 rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#241A20] focus:outline-none focus:border-[#9E183A]"
            />
          </div>

          <div className="flex items-center gap-4 justify-end">
            <button className="relative w-10 h-10 rounded-full bg-white border border-[#D6A24A]/30 flex items-center justify-center text-[#6E1231]">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#9E183A]" />
            </button>
            <div className="flex items-center gap-2 bg-white border border-[#D6A24A]/30 px-3 py-1.5 rounded-xl">
              <Award className="w-4 h-4 text-[#D6A24A]" />
              <span className="text-[10px] font-bold text-[#6E1231] tracking-wider uppercase">Super Member</span>
            </div>
          </div>
        </div>

        {!selectedCandidate ? (
          <>
            {/* Greeting & Stats Summary Bar */}
            <div className="space-y-6">
              <div>
                <h1 className="font-serif font-bold text-3xl text-[#100A18]">
                  Good Morning, Priya 👋
                </h1>
                <p className="text-xs text-[#756B70] mt-1 font-medium">
                  Here are some profiles selected for you.
                </p>
              </div>

              {/* 4 Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-[#D6A24A]/25 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-[10px] font-bold text-[#756B70] uppercase">Recommended Matches</p>
                    <p className="font-serif text-2xl font-bold text-[#6E1231] mt-1">24</p>
                  </div>
                  <span className="text-xl">💕</span>
                </div>
                <div className="bg-white border border-[#D6A24A]/25 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-[10px] font-bold text-[#756B70] uppercase">Interests Received</p>
                    <p className="font-serif text-2xl font-bold text-[#6E1231] mt-1">12</p>
                  </div>
                  <span className="text-xl">📩</span>
                </div>
                <div className="bg-white border border-[#D6A24A]/25 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-[10px] font-bold text-[#756B70] uppercase">Interests Sent</p>
                    <p className="font-serif text-2xl font-bold text-[#6E1231] mt-1">8</p>
                  </div>
                  <span className="text-xl">📤</span>
                </div>
                <div className="bg-white border border-[#D6A24A]/25 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-[10px] font-bold text-[#756B70] uppercase">Saved Profiles</p>
                    <p className="font-serif text-2xl font-bold text-[#6E1231] mt-1">15</p>
                  </div>
                  <span className="text-xl">🔖</span>
                </div>
              </div>
            </div>

            {/* Recommended For You Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl font-bold text-[#100A18]">Recommended For You</h2>
                <button className="text-xs font-bold text-[#9E183A] hover:underline">View All</button>
              </div>

              {/* Profile Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {RECOMMENDATIONS.map((cand) => (
                  <div 
                    key={cand.id}
                    onClick={() => setSelectedCandidate(cand)}
                    className="bg-white border border-[#D6A24A]/25 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-[#D6A24A]/55 cursor-pointer flex flex-col group transition-all duration-300"
                  >
                    <div className="relative h-64 w-full bg-gray-900 overflow-hidden">
                      <img
                        src={cand.photos?.[0]?.url}
                        alt=""
                        className="w-full h-full object-cover object-top group-hover:scale-102 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3 bg-[#6E1231]/95 text-[#F3D59B] text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#D6A24A]/30">
                        {cand.compatibilityScore}% Match
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-serif font-bold text-base text-[#100A18]">
                        {cand.firstName} {cand.lastName}
                      </h3>
                      <p className="text-[10px] text-[#756B70] font-medium">
                        {cand.age} Yrs • {cand.currentCity}, {cand.currentState}
                      </p>
                      <p className="text-[10px] text-[#6E1231] font-semibold">
                        {cand.jainIdentity?.sect} • {cand.jainIdentity?.community}
                      </p>
                      <div className="flex items-center gap-1 text-[9px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 w-fit">
                        <CheckCircle2 className="w-3 h-3" /> Identity & Jain Verified
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interests & Activity split layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
              {/* Interests Widget (7 Cols) */}
              <div className="lg:col-span-7 bg-white border border-[#D6A24A]/25 rounded-2xl p-6 space-y-4 shadow-sm">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <h3 className="font-serif font-bold text-base text-[#100A18]">Interests Received</h3>
                  <button className="text-xs text-[#9E183A] font-bold hover:underline">View All</button>
                </div>
                
                <div className="space-y-3">
                  {[
                    { name: 'Priya Shah', age: 26, city: 'Delhi', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100' },
                    { name: 'Neha Jain', age: 25, city: 'Jaipur', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
                    { name: 'Ritika Jain', age: 27, city: 'Indore', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="flex items-center gap-3">
                        <img src={item.img} className="w-10 h-10 rounded-full object-cover" alt="" />
                        <div>
                          <p className="font-bold text-xs text-[#100A18]">{item.name}</p>
                          <p className="text-[10px] text-[#756B70]">{item.age} Yrs • {item.city}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="bg-[#3E8B68] text-white text-[10px] font-bold px-4 py-1.5 rounded-lg">Accept</button>
                        <button className="bg-white border border-gray-200 text-gray-600 text-[10px] px-4 py-1.5 rounded-lg">Decline</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity Feed (5 Cols) */}
              <div className="lg:col-span-5 bg-white border border-[#D6A24A]/25 rounded-2xl p-6 space-y-4 shadow-sm">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <h3 className="font-serif font-bold text-base text-[#100A18]">Recent Activity</h3>
                </div>
                
                <div className="space-y-4 text-xs">
                  <div className="flex gap-3">
                    <span className="text-lg">✔️</span>
                    <div>
                      <p className="text-[#100A18] font-semibold"><span className="text-[#9E183A]">Aarav Jain</span> accepted your interest request</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-lg">👀</span>
                    <div>
                      <p className="text-[#100A18] font-semibold"><span className="text-[#9E183A]">Neha Jain</span> viewed your profile</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">5 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Web Profile Detail View (Middle Column Bottom Mockup) */
          <div className="space-y-6">
            <button 
              onClick={() => setSelectedCandidate(null)}
              className="flex items-center gap-2 text-xs font-bold text-[#6E1231] hover:underline"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Matches
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column Panel (4 Cols) */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white border border-[#D6A24A]/25 rounded-3xl p-4 shadow-md text-center space-y-4">
                  <div className="rounded-2xl overflow-hidden h-96 w-full bg-gray-900">
                    <img 
                      src={selectedCandidate.photos?.[0]?.url} 
                      className="w-full h-full object-cover object-top" 
                      alt="" 
                    />
                  </div>
                  <div className="flex justify-center gap-3 pt-2">
                    <button className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 shadow hover:text-[#B4233C]">
                      <X className="w-5 h-5" />
                    </button>
                    <button className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 shadow hover:text-[#D6A24A]">
                      <Bookmark className="w-5 h-5" />
                    </button>
                    <button className="flex-grow btn-ruby py-3 text-sm rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg">
                      <Heart className="w-4 h-4 fill-current text-[#F3D59B]" /> Interested
                    </button>
                  </div>
                </div>

                {/* Left Tabs Bar */}
                <div className="bg-white border border-[#D6A24A]/25 rounded-2xl p-2 space-y-1 shadow-sm">
                  {['Jain Details', 'Education & Career', 'Family', 'Lifestyle', 'Partner Preferences', 'Biodata', 'Contact'].map((tab, idx) => (
                    <button
                      key={tab}
                      className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold ${
                        idx === 0 ? 'bg-[#F8E8EA] text-[#6E1231]' : 'text-[#756B70] hover:bg-gray-50'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Details Panel (8 Cols) */}
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-white border border-[#D6A24A]/25 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                  
                  {/* Header details */}
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-[#D6A24A]/15 pb-6">
                    <div className="space-y-1.5">
                      <h2 className="font-serif font-bold text-3xl text-[#100A18]">
                        {selectedCandidate.firstName} {selectedCandidate.lastName}
                      </h2>
                      <p className="text-xs text-[#6E1231] font-bold">
                        {selectedCandidate.jainIdentity?.sect} • {selectedCandidate.jainIdentity?.community}
                      </p>
                      <p className="text-xs text-gray-500">
                        {selectedCandidate.age} Yrs • {selectedCandidate.currentCity}, {selectedCandidate.currentState}
                      </p>
                    </div>

                    {/* Compatibility Score Circle Badge */}
                    <div className="bg-[#6E1231]/10 border border-[#D6A24A]/30 p-4 rounded-2xl text-center shrink-0">
                      <p className="text-2xl font-serif font-bold text-[#6E1231]">{selectedCandidate.compatibilityScore}%</p>
                      <p className="text-[9px] text-[#756B70] font-bold uppercase tracking-wider">Compatibility</p>
                    </div>
                  </div>

                  {/* Why match details list */}
                  <div className="bg-emerald-50/50 border border-emerald-500/20 p-5 rounded-2xl space-y-3">
                    <h4 className="font-serif font-bold text-sm text-emerald-800">Why this is a good match</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-emerald-700">
                      <p>✓ Age preference matches</p>
                      <p>✓ Jain community preference matches</p>
                      <p>✓ Location preference matches</p>
                      <p>✓ Education preference matches</p>
                      <p>✓ Lifestyle preference matches</p>
                    </div>
                  </div>

                  {/* About Him details */}
                  <div className="space-y-3">
                    <h4 className="font-serif font-bold text-lg text-[#100A18]">About Him</h4>
                    <p className="text-xs text-[#756B70] leading-relaxed font-medium">
                      {selectedCandidate.aboutMe}
                    </p>
                  </div>

                  {/* Details stats grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Age</p>
                      <p className="text-xs font-bold text-[#100A18] mt-0.5">{selectedCandidate.age} Years</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Height</p>
                      <p className="text-xs font-bold text-[#100A18] mt-0.5">5'9"</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Marital Status</p>
                      <p className="text-xs font-bold text-[#100A18] mt-0.5">Never Married</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Mother Tongue</p>
                      <p className="text-xs font-bold text-[#100A18] mt-0.5">Hindi</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Income Range</p>
                      <p className="text-xs font-bold text-[#100A18] mt-0.5">₹15 - 20 Lakhs</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}
