'use client';

import React, { useState } from 'react';
import { Sparkles, Heart, CheckCircle, MapPin, Bookmark, User, SlidersHorizontal } from 'lucide-react';
import { useCandidateProfile } from '@/hooks/useCandidateProfile';
import { useMatches } from '@/hooks/useMatches';
import { useInterests } from '@/hooks/useInterests';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

const FallbackAvatar = () => (
  <div className="w-full h-full bg-[#EDE1D7] flex items-center justify-center text-[#766B70]">
    <User className="w-1/2 h-1/2 opacity-50" />
  </div>
);

export default function MatchesPage() {
  const { profile: loggedInUser } = useCandidateProfile();
  const { matches: recommendations, loading: matchesLoading } = useMatches(loggedInUser?.id);
  const { sendInterest } = useInterests(loggedInUser?.id);
  const [activeTab, setActiveTab] = useState('Recommended');

  const handleSendInterest = async (candidateId: string) => {
    if (!loggedInUser) return;
    try {
      await sendInterest(loggedInUser.id, candidateId);
      alert('Interest sent successfully!'); // In a real app, replace with toast
    } catch (err) {
      console.error('Failed to send interest:', err);
    }
  };

  const handleSaveProfile = async (candidateId: string) => {
    if (!loggedInUser) return;
    try {
      const { error } = await supabase.from('saved_profiles').insert({
        candidate_id: loggedInUser.id,
        saved_candidate_id: candidateId,
      });
      if (error) {
        if (error.code === '23505') {
          alert('Profile is already saved.');
        } else {
          throw error;
        }
      } else {
        alert('Profile saved to your bookmarks!');
      }
    } catch (err) {
      console.error('Failed to save profile:', err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-[#EDE1D7] shadow-sm">
        <div>
          <h1 className="font-serif text-3xl font-bold text-burgundy flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-gold" />
            Your Matches
          </h1>
          <p className="text-sm text-[#766B70] mt-1 font-semibold">
            Based on your partner preferences and Jain identity
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#FFF9F2] text-burgundy border border-gold/30 rounded-xl font-bold text-xs hover:bg-[#F8EFE5] transition-colors">
          <SlidersHorizontal className="w-4 h-4" />
          Advanced Filters
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-[#EDE1D7] pb-px">
        {['Recommended', 'Highly Compatible', 'New', 'Nearby'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 px-2 text-sm font-bold border-b-2 transition-colors ${
              activeTab === tab 
                ? 'border-burgundy text-burgundy' 
                : 'border-transparent text-[#766B70] hover:text-text'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matchesLoading ? (
          [1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white border border-[#EDE1D7] rounded-3xl p-6 shadow-sm animate-pulse h-[350px]">
              <div className="w-20 h-20 rounded-full bg-gray-200 mb-4" />
              <div className="h-6 w-3/4 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-1/2 bg-gray-200 rounded" />
            </div>
          ))
        ) : recommendations.length === 0 ? (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white border border-[#EDE1D7] rounded-3xl p-12 text-center shadow-sm">
            <Heart className="w-12 h-12 text-[#EDE1D7] mx-auto mb-4" />
            <h3 className="font-serif text-xl font-bold text-text mb-2">No suitable matches yet</h3>
            <p className="text-sm text-[#766B70] max-w-md mx-auto mb-6">
              We couldn't find matches that fit all your criteria.
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
                <div className="w-24 h-24 rounded-full border-3 border-[#FFF9F2] shadow-md overflow-hidden relative bg-[#F8EFE5] mb-4 mx-auto">
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
                
                <div className="text-center space-y-1 mb-4">
                  <h3 className="font-serif font-bold text-lg text-text flex items-center justify-center gap-1.5">
                    <span className="truncate">{cand.firstName} {cand.lastName}, {cand.age}</span>
                    {cand.isVerified && <CheckCircle className="w-4 h-4 text-gold fill-current shrink-0" />}
                  </h3>
                  <p className="text-xs text-[#766B70] font-semibold flex items-center justify-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{cand.currentCity} • {cand.jainIdentity?.sect}</span>
                  </p>
                </div>

                <div className="flex justify-center mb-4">
                  <span className="bg-[#FFF1F1] text-burgundy text-[11px] font-bold px-3 py-1.5 rounded-full border border-burgundy/10">
                    {cand.compatibilityScore}% Match
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-[#F8EFE5]/50">
                <button 
                  onClick={() => handleSendInterest(cand.id)}
                  className="flex-1 bg-burgundy hover:bg-deepBurgundy text-white text-xs font-bold py-3 rounded-xl transition-all shadow-sm"
                >
                  Interested
                </button>
                <Link href={`/profile/${cand.id}`} className="flex-1 bg-white hover:bg-[#F8EFE5]/25 border border-burgundy text-burgundy text-center text-xs font-bold py-3 rounded-xl transition-all">
                  View Profile
                </Link>
                <button 
                  onClick={() => handleSaveProfile(cand.id)}
                  className="p-3 border border-[#EDE1D7] rounded-xl hover:bg-[#F8EFE5]/20 text-[#766B70]"
                >
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
