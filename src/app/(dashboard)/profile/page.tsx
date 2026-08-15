'use client';

import React from 'react';
import { User, CheckCircle, Edit3, Settings, Shield, MapPin, GraduationCap, Briefcase, Heart, Download, Info } from 'lucide-react';
import { useCandidateProfile } from '@/hooks/useCandidateProfile';
import Link from 'next/link';

export default function ProfilePage() {
  const { profile: loggedInUser, loading } = useCandidateProfile();

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-[#C99A3D] border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!loggedInUser) return null;

  const calculateAge = (dob: string) => {
    if (!dob) return 'N/A';
    const diff = Date.now() - new Date(dob).getTime();
    return Math.abs(new Date(diff).getUTCFullYear() - 1970);
  };

  const jain = loggedInUser.jainIdentity || {};

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header Profile Card */}
      <div className="bg-[#FFFDFB] border border-[#EBD9DC] rounded-[32px] overflow-hidden shadow-sm relative">
        <div className="h-40 bg-gradient-to-r from-[#F7E5EA] to-[#FFF8F7] relative" />
        
        <div className="px-8 pb-8 relative">
          <div className="absolute -top-20 left-8">
            <div className="w-40 h-40 rounded-full border-4 border-[#FFFDFB] bg-[#F7E5EA] shadow-md overflow-hidden relative">
              {loggedInUser.photos?.[0]?.url ? (
                <img src={loggedInUser.photos[0].url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-16 h-16 text-[#75666D] opacity-40" />
                </div>
              )}
            </div>
          </div>

          <div className="pt-24 space-y-4">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-1">
                <h1 className="font-serif font-bold text-3xl text-[#241B20] flex items-center gap-2">
                  {loggedInUser.first_name} {loggedInUser.last_name}
                  {loggedInUser.verificationStatus === 'verified' && (
                    <CheckCircle className="w-6 h-6 text-[#C99A3D] fill-current shrink-0" />
                  )}
                </h1>
                <p className="text-sm font-semibold text-[#75666D] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#8F0038]" />
                  {loggedInUser.current_city || 'City not set'}, {loggedInUser.current_state || 'State not set'}
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <span className="text-xs font-bold text-[#8F0038] bg-[#F7E5EA]/60 px-3 py-1 rounded-full">
                    {calculateAge(loggedInUser.date_of_birth)} Years
                  </span>
                  <span className="text-xs font-bold text-[#C99A3D] bg-[#FDF9F4] px-3 py-1 rounded-full border border-[#C99A3D]/20">
                    {loggedInUser.membershipTier}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Link 
                  href="/profile/edit" 
                  className="px-6 py-3 bg-[#8F0038] hover:bg-[#72002E] text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-colors"
                >
                  <Edit3 className="w-4 h-4" /> Edit Profile
                </Link>
                <Link 
                  href="/preferences" 
                  className="px-6 py-3 bg-[#FFFDFB] border border-[#EBD9DC] text-[#75666D] hover:text-[#241B20] font-bold rounded-xl text-xs flex items-center gap-2 transition-colors"
                >
                  <Settings className="w-4 h-4" /> Preferences
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Completion Banner */}
      {loggedInUser.completionPercentage < 100 && (
        <div className="bg-[#FDF9F4] border border-[#C99A3D]/40 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-[#C99A3D]" />
            <div>
              <p className="text-sm font-bold text-[#241B20]">Your profile is {loggedInUser.completionPercentage}% complete</p>
              <p className="text-xs font-semibold text-[#75666D]">Profiles with 100% completion get 3x more matches.</p>
            </div>
          </div>
          <Link href="/profile/edit" className="text-xs font-bold text-[#8F0038] hover:underline">
            Complete Now
          </Link>
        </div>
      )}

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Basic & Jain Identity */}
        <div className="space-y-6">
          <div className="bg-[#FFFDFB] border border-[#EBD9DC] p-6 rounded-[24px] shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-xl text-[#8F0038] flex items-center gap-2 border-b border-[#EBD9DC]/50 pb-3">
              <User className="w-5 h-5 text-[#C99A3D]" />
              Basic Details
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#75666D] font-bold">Gender</span>
                <span className="font-bold text-[#241B20] capitalize">{loggedInUser.gender || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#75666D] font-bold">Height</span>
                <span className="font-bold text-[#241B20]">{loggedInUser.height_cm ? `${loggedInUser.height_cm} cm` : '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#75666D] font-bold">Marital Status</span>
                <span className="font-bold text-[#241B20] capitalize">{loggedInUser.marital_status?.replace('_', ' ') || '-'}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#FFFDFB] border border-[#EBD9DC] p-6 rounded-[24px] shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-xl text-[#8F0038] flex items-center gap-2 border-b border-[#EBD9DC]/50 pb-3">
              <Heart className="w-5 h-5 text-[#C99A3D]" />
              Jain Identity
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#75666D] font-bold">Sect</span>
                <span className="font-bold text-[#241B20]">{jain.sect || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#75666D] font-bold">Community</span>
                <span className="font-bold text-[#241B20]">{jain.community || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#75666D] font-bold">Sub-Community</span>
                <span className="font-bold text-[#241B20]">{jain.sub_community || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#75666D] font-bold">Gotra / Sakha</span>
                <span className="font-bold text-[#241B20]">{jain.saka_gotra || '-'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Education, Location, Bio */}
        <div className="space-y-6">
          
          <div className="bg-[#FFFDFB] border border-[#EBD9DC] p-6 rounded-[24px] shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-xl text-[#8F0038] flex items-center gap-2 border-b border-[#EBD9DC]/50 pb-3">
              <MapPin className="w-5 h-5 text-[#C99A3D]" />
              Location Details
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#75666D] font-bold">Current City</span>
                <span className="font-bold text-[#241B20]">{loggedInUser.current_city || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#75666D] font-bold">Native Place</span>
                <span className="font-bold text-[#241B20]">{loggedInUser.native_city ? `${loggedInUser.native_city}, ${loggedInUser.native_state}` : '-'}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#FFFDFB] border border-[#EBD9DC] p-6 rounded-[24px] shadow-sm space-y-3">
            <h3 className="font-serif font-bold text-xl text-[#8F0038] border-b border-[#EBD9DC]/50 pb-3">About Me</h3>
            {loggedInUser.about_me ? (
              <p className="text-sm font-semibold text-[#75666D] leading-relaxed">
                {loggedInUser.about_me}
              </p>
            ) : (
              <div className="text-center py-4">
                <p className="text-xs text-[#75666D] italic mb-2">No bio written yet.</p>
                <Link href="/profile/edit" className="text-xs font-bold text-[#8F0038]">Add Bio</Link>
              </div>
            )}
          </div>
          
        </div>

      </div>
    </div>
  );
}
