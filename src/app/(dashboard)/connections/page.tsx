'use client';

import React, { useState, useEffect } from 'react';
import { UserCheck, MessageCircle, Phone, Lock, User } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useCandidateProfile } from '@/hooks/useCandidateProfile';

const FallbackAvatar = () => (
  <div className="w-full h-full bg-[#EDE1D7] flex items-center justify-center text-[#766B70]">
    <User className="w-1/2 h-1/2 opacity-50" />
  </div>
);

export default function ConnectionsPage() {
  const { profile: loggedInUser, subscription } = useCandidateProfile();
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConnections() {
      if (!loggedInUser) return;
      try {
        setLoading(true);
        // Connections are stored in `connections` table, but let's assume it's created when interest is accepted.
        // Wait, looking at schema, we don't have a distinct `connections` table in 01_initial_schema.sql.
        // Wait, `01_initial_schema.sql` might have it. Let's query `interest_requests` where status = 'accepted'.
        
        const { data, error } = await supabase
          .from('interest_requests')
          .select(`
            id,
            created_at,
            sender:sender_id (id, first_name, last_name, current_city, photos(url)),
            receiver:receiver_id (id, first_name, last_name, current_city, photos(url))
          `)
          .eq('status', 'accepted')
          .or(`sender_id.eq.${loggedInUser.id},receiver_id.eq.${loggedInUser.id}`);

        if (error) throw error;
        setConnections(data || []);
      } catch (err) {
        console.error('Error fetching connections:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchConnections();
  }, [loggedInUser]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-3xl border border-[#EDE1D7] shadow-sm">
        <h1 className="font-serif text-3xl font-bold text-burgundy mb-2 flex items-center gap-2">
          <UserCheck className="w-6 h-6" />
          My Connections
        </h1>
        <p className="text-sm text-[#766B70] font-semibold">Mutually accepted interests ready for conversation.</p>
      </div>

      <div className="pt-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="h-32 bg-white border border-[#EDE1D7] rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : connections.length === 0 ? (
          <div className="bg-white border border-[#EDE1D7] rounded-3xl p-12 text-center shadow-sm">
            <UserCheck className="w-12 h-12 text-[#EDE1D7] mx-auto mb-4" />
            <h3 className="font-serif text-xl font-bold text-text mb-2">No connections yet</h3>
            <p className="text-sm text-[#766B70]">
              When someone accepts your interest or you accept theirs, they will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {connections.map((conn) => {
              // Extract the OTHER person
              const profile = conn.sender.id === loggedInUser?.id ? conn.receiver : conn.sender;
              const hasPremium = subscription?.plan?.code === 'pro' || subscription?.plan?.code === 'super' || subscription?.plan?.code === 'deluxe_6m';
              
              return (
                <div key={conn.id} className="bg-white border border-[#EDE1D7] rounded-3xl p-6 flex flex-col gap-5 shadow-sm">
                  <div className="flex items-center gap-4 border-b border-[#F8EFE5] pb-5">
                    <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 bg-[#F8EFE5] border-2 border-[#FFF9F2]">
                      {profile.photos?.[0]?.url ? (
                        <img src={profile.photos[0].url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <FallbackAvatar />
                      )}
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-serif font-bold text-lg text-text">{profile.first_name} {profile.last_name}</h3>
                      <p className="text-xs text-[#766B70] font-semibold">{profile.current_city}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="flex-1 bg-burgundy text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-deepBurgundy">
                      <MessageCircle className="w-4 h-4" /> Message
                    </button>
                    <button className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border ${
                      hasPremium 
                        ? 'border-burgundy text-burgundy hover:bg-[#F8EFE5]/30' 
                        : 'border-[#EDE1D7] text-[#766B70] bg-gray-50 opacity-70'
                    }`}>
                      {hasPremium ? <Phone className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      View Contact
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
