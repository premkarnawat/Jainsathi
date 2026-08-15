'use client';

import React, { useEffect, useState } from 'react';
import { Bookmark, User, MapPin } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useCandidateProfile } from '@/hooks/useCandidateProfile';
import Link from 'next/link';

export default function SavedProfilesPage() {
  const { profile: loggedInUser } = useCandidateProfile();
  const [savedProfiles, setSavedProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      if (!loggedInUser?.id) return;
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('saved_profiles')
          .select(`
            id,
            candidate:candidate_profiles!saved_candidate_id (
              id,
              first_name,
              last_name,
              age:date_of_birth,
              current_city,
              current_state,
              gender,
              photos (url),
              jain_identities (
                sect,
                community
              )
            )
          `)
          .eq('candidate_id', loggedInUser.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        if (data) {
          const formatted = data.map(saveRecord => ({
            id: saveRecord.id,
            ...saveRecord.candidate,
            age: saveRecord.candidate?.age ? new Date().getFullYear() - new Date(saveRecord.candidate.age).getFullYear() : null,
            photoUrl: saveRecord.candidate?.photos?.[0]?.url,
            sect: saveRecord.candidate?.jain_identities?.[0]?.sect,
            community: saveRecord.candidate?.jain_identities?.[0]?.community,
          }));
          setSavedProfiles(formatted);
        }
      } catch (err) {
        console.error('Failed to fetch saved profiles', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, [loggedInUser?.id]);

  const removeSaved = async (saveRecordId: string) => {
    try {
      await supabase.from('saved_profiles').delete().eq('id', saveRecordId);
      setSavedProfiles(prev => prev.filter(p => p.id !== saveRecordId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-5xl mx-auto">
      <div className="bg-[#FFFDFB] p-6 rounded-[24px] border border-[#EBD9DC] shadow-sm flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#8F0038] flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-[#C99A3D]" />
            Saved Profiles
          </h1>
          <p className="text-[#75666D] text-sm font-semibold mt-1">
            Profiles you've bookmarked for later consideration.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-[#C99A3D] border-t-transparent rounded-full animate-spin" /></div>
      ) : savedProfiles.length === 0 ? (
        <div className="bg-[#FFFDFB] border border-[#EBD9DC] rounded-[24px] p-12 text-center shadow-sm">
          <Bookmark className="w-12 h-12 text-[#EBD9DC] mx-auto mb-4" />
          <h3 className="font-serif text-xl font-bold text-[#241B20] mb-2">No Saved Profiles</h3>
          <p className="text-sm text-[#75666D] mb-6">
            When you see a profile you like but aren't ready to send an interest, bookmark it!
          </p>
          <Link href="/matches" className="px-6 py-3 bg-[#8F0038] text-white font-bold rounded-xl text-xs hover:bg-[#72002E] transition-colors inline-flex items-center gap-2">
            Explore Matches
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedProfiles.map(profile => (
            <div key={profile.id} className="bg-[#FFFDFB] border border-[#EBD9DC] rounded-[24px] p-6 shadow-sm flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full border-4 border-[#FDF9F4] shadow-md overflow-hidden relative bg-[#F7E5EA] mb-4">
                {profile.photoUrl ? (
                  <img src={profile.photoUrl} className="w-full h-full object-cover" alt="" />
                ) : (
                  <User className="w-12 h-12 absolute top-6 left-6 text-[#75666D] opacity-40" />
                )}
              </div>
              <h3 className="font-serif text-xl font-bold text-[#241B20]">
                {profile.first_name} {profile.last_name}
              </h3>
              <p className="text-xs font-semibold text-[#75666D] flex items-center gap-1 justify-center mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#8F0038]" />
                {profile.current_city}, {profile.current_state}
              </p>
              <div className="mt-3 text-xs font-bold text-[#241B20] bg-[#F7E5EA] px-3 py-1 rounded-full border border-[#EBD9DC]">
                {profile.age} yrs • {profile.sect}
              </div>
              <div className="flex gap-2 w-full mt-6">
                <Link href={`/profile/${profile.candidate?.id}`} className="flex-1 py-2.5 bg-[#8F0038] text-white font-bold rounded-xl text-xs hover:bg-[#72002E] transition-colors">
                  View Profile
                </Link>
                <button onClick={() => removeSaved(profile.id)} className="px-4 py-2.5 bg-[#FFFDFB] border border-[#EBD9DC] text-[#75666D] font-bold rounded-xl text-xs hover:bg-[#FDF9F4] transition-colors">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
