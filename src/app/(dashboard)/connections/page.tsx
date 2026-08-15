'use client';

import React, { useEffect, useState } from 'react';
import { UserCheck, User, MapPin, Mail, Phone, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useCandidateProfile } from '@/hooks/useCandidateProfile';
import Link from 'next/link';

export default function ConnectionsPage() {
  const { profile: loggedInUser } = useCandidateProfile();
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConnections = async () => {
      if (!loggedInUser?.id) return;
      try {
        setLoading(true);
        // A connection has candidate_a and candidate_b. We need to fetch where loggedInUser is either A or B.
        const { data, error } = await supabase
          .from('connections')
          .select(`
            id,
            candidate_a:candidate_profiles!candidate_a (
              id, first_name, last_name, gender, current_city, current_state, date_of_birth,
              photos (url), jain_identities (sect, community), users!user_id (phone, email)
            ),
            candidate_b:candidate_profiles!candidate_b (
              id, first_name, last_name, gender, current_city, current_state, date_of_birth,
              photos (url), jain_identities (sect, community), users!user_id (phone, email)
            )
          `)
          .or(`candidate_a.eq.${loggedInUser.id},candidate_b.eq.${loggedInUser.id}`)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        if (data) {
          const formatted = data.map((conn: any) => {
            // Determine which one is the OTHER person
            const otherCandidate = conn.candidate_a.id === loggedInUser.id ? conn.candidate_b : conn.candidate_a;
            return {
              id: conn.id,
              ...otherCandidate,
              age: otherCandidate.date_of_birth ? new Date().getFullYear() - new Date(otherCandidate.date_of_birth).getFullYear() : null,
              photoUrl: otherCandidate.photos?.[0]?.url,
              sect: otherCandidate.jain_identities?.[0]?.sect,
              community: otherCandidate.jain_identities?.[0]?.community,
              phone: otherCandidate.users?.phone,
              email: otherCandidate.users?.email
            };
          });
          setConnections(formatted);
        }
      } catch (err) {
        console.error('Failed to fetch connections', err);
      } finally {
        setLoading(false);
      }
    };
    fetchConnections();
  }, [loggedInUser?.id]);

  return (
    <div className="space-y-6 animate-in fade-in max-w-5xl mx-auto">
      <div className="bg-[#FFFDFB] p-6 rounded-[24px] border border-[#EBD9DC] shadow-sm flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#8F0038] flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-[#C99A3D]" />
            Mutual Connections
          </h1>
          <p className="text-[#75666D] text-sm font-semibold mt-1">
            Profiles with mutually accepted interests. Contact details are now unlocked.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-[#C99A3D] border-t-transparent rounded-full animate-spin" /></div>
      ) : connections.length === 0 ? (
        <div className="bg-[#FFFDFB] border border-[#EBD9DC] rounded-[24px] p-12 text-center shadow-sm">
          <UserCheck className="w-12 h-12 text-[#EBD9DC] mx-auto mb-4" />
          <h3 className="font-serif text-xl font-bold text-[#241B20] mb-2">No Connections Yet</h3>
          <p className="text-sm text-[#75666D] mb-6">
            Connections are formed when an interest request is mutually accepted.
          </p>
          <Link href="/interests" className="px-6 py-3 bg-[#8F0038] text-white font-bold rounded-xl text-xs hover:bg-[#72002E] transition-colors inline-flex items-center gap-2">
            View Interests
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {connections.map(profile => (
            <div key={profile.id} className="bg-[#FFFDFB] border border-[#C99A3D]/30 rounded-[24px] p-6 shadow-sm flex flex-col items-center text-center">
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
              
              <div className="w-full mt-6 bg-[#FDF9F4] border border-[#EBD9DC] rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3 justify-center text-sm font-bold text-[#241B20]">
                  <Phone className="w-4 h-4 text-[#8F0038]" />
                  {profile.phone || 'Phone not available'}
                </div>
                {profile.email && (
                  <div className="flex items-center gap-3 justify-center text-sm font-bold text-[#241B20]">
                    <Mail className="w-4 h-4 text-[#8F0038]" />
                    {profile.email}
                  </div>
                )}
                <div className="pt-2 flex justify-center text-[10px] text-[#C99A3D] font-bold uppercase tracking-widest flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Contact Info Unlocked
                </div>
              </div>

              <div className="w-full mt-4">
                <Link href={`/profile/${profile.id}`} className="block w-full py-2.5 bg-[#8F0038] text-white font-bold rounded-xl text-xs hover:bg-[#72002E] transition-colors">
                  View Full Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
