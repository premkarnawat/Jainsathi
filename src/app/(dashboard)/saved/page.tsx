'use client';

import React, { useState, useEffect } from 'react';
import { Bookmark, User, MapPin } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useCandidateProfile } from '@/hooks/useCandidateProfile';

const FallbackAvatar = () => (
  <div className="w-full h-full bg-[#EDE1D7] flex items-center justify-center text-[#766B70]">
    <User className="w-1/2 h-1/2 opacity-50" />
  </div>
);

export default function SavedProfilesPage() {
  const { profile: loggedInUser } = useCandidateProfile();
  const [savedProfiles, setSavedProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSaved() {
      if (!loggedInUser) return;
      try {
        setLoading(true);
        // Assuming saved_profiles links `candidate_id` (the saver) and `saved_candidate_id` (the saved profile)
        const { data, error } = await supabase
          .from('saved_profiles')
          .select(`
            id,
            created_at,
            profile:saved_candidate_id (id, first_name, last_name, current_city, age, photos(url))
          `)
          .eq('candidate_id', loggedInUser.id);

        if (error) throw error;
        setSavedProfiles(data || []);
      } catch (err) {
        console.error('Error fetching saved profiles:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchSaved();
  }, [loggedInUser]);

  const handleUnsave = async (savedId: string) => {
    try {
      await supabase.from('saved_profiles').delete().eq('id', savedId);
      setSavedProfiles(prev => prev.filter(p => p.id !== savedId));
    } catch (err) {
      console.error('Failed to unsave', err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-3xl border border-[#EDE1D7] shadow-sm">
        <h1 className="font-serif text-3xl font-bold text-burgundy mb-2 flex items-center gap-2">
          <Bookmark className="w-6 h-6" />
          Saved Profiles
        </h1>
        <p className="text-sm text-[#766B70] font-semibold">Profiles you have bookmarked for later consideration.</p>
      </div>

      <div className="pt-4">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-white border border-[#EDE1D7] rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : savedProfiles.length === 0 ? (
          <div className="bg-white border border-[#EDE1D7] rounded-3xl p-12 text-center shadow-sm">
            <Bookmark className="w-12 h-12 text-[#EDE1D7] mx-auto mb-4" />
            <h3 className="font-serif text-xl font-bold text-text mb-2">No saved profiles</h3>
            <p className="text-sm text-[#766B70]">
              Click the bookmark icon on any candidate's profile to save them here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProfiles.map((saved) => {
              const profile = saved.profile;
              if (!profile) return null;

              return (
                <div key={saved.id} className="bg-white border border-[#EDE1D7] rounded-3xl p-6 flex flex-col gap-5 shadow-sm hover:shadow transition-shadow">
                  <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-[#F8EFE5] border-3 border-[#FFF9F2] shadow-sm">
                    {profile.photos?.[0]?.url ? (
                      <img src={profile.photos[0].url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <FallbackAvatar />
                    )}
                  </div>
                  <div className="text-center space-y-1">
                    <h3 className="font-serif font-bold text-lg text-text">{profile.first_name} {profile.last_name}, {profile.age}</h3>
                    <p className="text-xs text-[#766B70] font-semibold flex items-center justify-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {profile.current_city}
                    </p>
                  </div>
                  
                  <div className="flex gap-2 border-t border-[#F8EFE5]/50 pt-4">
                    <button className="flex-1 bg-white border border-burgundy text-burgundy px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#F8EFE5]/30">
                      View Profile
                    </button>
                    <button 
                      onClick={() => handleUnsave(saved.id)}
                      className="px-4 py-2 border border-[#EDE1D7] rounded-xl text-xs font-bold text-[#766B70] hover:bg-gray-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
