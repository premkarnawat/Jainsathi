'use client';

import React from 'react';
import { User, CheckCircle, Edit3, Settings, Shield } from 'lucide-react';
import { useCandidateProfile } from '@/hooks/useCandidateProfile';
import Link from 'next/link';

export default function ProfilePage() {
  const { profile: loggedInUser, loading } = useCandidateProfile();

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!loggedInUser) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      <div className="bg-white p-8 rounded-3xl border border-[#EDE1D7] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-gold/10 to-transparent rounded-bl-full pointer-events-none" />
        
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
          <div className="w-32 h-32 rounded-full border-4 border-[#FFF9F2] shadow-md overflow-hidden shrink-0 bg-[#F8EFE5]">
            {loggedInUser.photos?.[0]?.url ? (
              <img src={loggedInUser.photos[0].url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#766B70]">
                <User className="w-12 h-12 opacity-50" />
              </div>
            )}
          </div>
          
          <div className="flex-grow space-y-2">
            <h1 className="font-serif text-3xl font-bold text-text flex items-center gap-2">
              {loggedInUser.firstName} {loggedInUser.lastName}
              {loggedInUser.isVerified && <CheckCircle className="w-6 h-6 text-gold fill-current" />}
            </h1>
            <p className="text-sm font-semibold text-[#766B70]">
              {loggedInUser.currentCity} • {loggedInUser.age} yrs • {loggedInUser.membershipTier}
            </p>
            
            <div className="flex gap-3 pt-4">
              <button className="flex items-center gap-2 px-6 py-2.5 bg-burgundy text-white font-bold rounded-xl text-xs hover:bg-deepBurgundy transition-colors shadow-sm">
                <Edit3 className="w-4 h-4" /> Edit Profile
              </button>
              <Link href="/preferences" className="flex items-center gap-2 px-6 py-2.5 bg-white border border-burgundy text-burgundy font-bold rounded-xl text-xs hover:bg-[#F8EFE5]/30 transition-colors">
                <Settings className="w-4 h-4" /> Partner Preferences
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-[#EDE1D7] shadow-sm space-y-4">
          <h2 className="font-serif text-xl font-bold text-burgundy border-b border-[#F8EFE5] pb-3">Basic Details</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#766B70] font-semibold">Gender</span>
              <span className="font-bold text-text capitalize">{loggedInUser.gender || 'Not specified'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#766B70] font-semibold">Date of Birth</span>
              <span className="font-bold text-text">{loggedInUser.dateOfBirth ? new Date(loggedInUser.dateOfBirth).toLocaleDateString() : 'Not specified'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#766B70] font-semibold">Height</span>
              <span className="font-bold text-text">{loggedInUser.heightCm ? `${loggedInUser.heightCm} cm` : 'Not specified'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#EDE1D7] shadow-sm space-y-4">
          <h2 className="font-serif text-xl font-bold text-burgundy border-b border-[#F8EFE5] pb-3">Jain Identity</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#766B70] font-semibold">Sect</span>
              <span className="font-bold text-text">{loggedInUser.jainIdentity?.sect || 'Not specified'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#766B70] font-semibold">Community</span>
              <span className="font-bold text-text">{loggedInUser.jainIdentity?.community || 'Not specified'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
