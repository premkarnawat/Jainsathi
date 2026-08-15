'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, MapPin, Heart, Bookmark, AlertCircle, FileText, Download,
  Lock, ArrowLeft, MoreHorizontal, User, Briefcase, GraduationCap,
  Users, Coffee
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useCandidateProfile } from '@/hooks/useCandidateProfile';
import { useRouter } from 'next/navigation';

export default function CandidateProfileView({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { profile: loggedInUser, loading: authLoading } = useCandidateProfile();
  
  const [candidate, setCandidate] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Connection states
  const [relationshipStatus, setRelationshipStatus] = useState<'none' | 'interest_sent' | 'interest_received' | 'connected'>('none');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    async function fetchCandidate() {
      if (!loggedInUser || !params.id) return;

      try {
        setLoading(true);
        // 1. Fetch Candidate Profile Graph
        const { data: candData, error: candError } = await supabase
          .from('candidate_profiles')
          .select(`
            *,
            jain_identities(*),
            education_records(*),
            employment_records(*),
            lifestyle_profiles(*),
            family_members(*),
            photos(*)
          `)
          .eq('id', params.id)
          .single();
          
        if (candError) throw candError;
        setCandidate(candData);

        // 2. Fetch Relationship Status
        // Check mutual connection
        const { data: connData } = await supabase
          .from('connections')
          .select('*')
          .or(`and(candidate_a.eq.${loggedInUser.id},candidate_b.eq.${params.id}),and(candidate_a.eq.${params.id},candidate_b.eq.${loggedInUser.id})`)
          .single();

        if (connData) {
          setRelationshipStatus('connected');
        } else {
          // Check pending interests
          const { data: sentInt } = await supabase
            .from('interest_requests')
            .select('*')
            .eq('sender_id', loggedInUser.id)
            .eq('receiver_id', params.id)
            .eq('status', 'pending')
            .single();

          if (sentInt) {
            setRelationshipStatus('interest_sent');
          } else {
            const { data: recInt } = await supabase
              .from('interest_requests')
              .select('*')
              .eq('sender_id', params.id)
              .eq('receiver_id', loggedInUser.id)
              .eq('status', 'pending')
              .single();
            if (recInt) {
              setRelationshipStatus('interest_received');
            }
          }
        }

        // 3. Check if Saved
        const { data: savedData } = await supabase
          .from('saved_profiles')
          .select('id')
          .eq('candidate_id', loggedInUser.id)
          .eq('saved_candidate_id', params.id)
          .single();
        if (savedData) setIsSaved(true);

      } catch (err) {
        console.error('Error fetching candidate:', err);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchCandidate();
    }
  }, [loggedInUser, params.id, authLoading]);


  const calculateAge = (dob: string) => {
    if (!dob) return 'N/A';
    const diff = Date.now() - new Date(dob).getTime();
    return Math.abs(new Date(diff).getUTCFullYear() - 1970);
  };

  const handleInterest = async () => {
    if (!loggedInUser || relationshipStatus !== 'none') return;
    try {
      await supabase.from('interest_requests').insert({
        sender_id: loggedInUser.id,
        receiver_id: params.id,
        status: 'pending'
      });
      setRelationshipStatus('interest_sent');
    } catch(err) {}
  };

  const handleAccept = async () => {
    if (!loggedInUser) return;
    try {
      const { data: request } = await supabase
        .from('interest_requests')
        .select('id')
        .eq('sender_id', params.id)
        .eq('receiver_id', loggedInUser.id)
        .eq('status', 'pending')
        .single();

      if (request) {
        await supabase.from('interest_requests').update({ status: 'accepted' }).eq('id', request.id);
        await supabase.from('connections').insert({
          candidate_a: params.id,
          candidate_b: loggedInUser.id,
          interest_request_id: request.id
        });
        setRelationshipStatus('connected');
      }
    } catch(err) {}
  };

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center py-20 min-h-screen">
        <div className="w-8 h-8 border-4 border-[#C99A3D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-[#8F0038] mx-auto" />
        <h2 className="text-xl font-serif font-bold text-[#241B20]">Profile Not Found</h2>
        <p className="text-sm text-[#75666D]">This profile may have been removed or is currently private.</p>
        <button onClick={() => router.back()} className="text-xs font-bold text-[#8F0038] hover:underline">Go Back</button>
      </div>
    );
  }

  const isConnected = relationshipStatus === 'connected';
  const jain = candidate.jain_identities?.[0] || {};
  const edu = candidate.education_records || [];
  const emp = candidate.employment_records?.[0] || {};
  const lifestyle = candidate.lifestyle_profiles?.[0] || {};

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Top Nav Back button */}
      <button onClick={() => router.back()} className="flex items-center gap-2 text-xs font-bold text-[#75666D] hover:text-[#241B20] transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to matches
      </button>

      {/* Profile Header Card */}
      <div className="bg-[#FFFDFB] border border-[#EBD9DC] rounded-[32px] overflow-hidden shadow-sm relative">
        <div className="h-48 bg-gradient-to-r from-[#F7E5EA] to-[#FFF8F7] relative">
          <div className="absolute top-4 right-4 flex gap-2">
            <button className="w-10 h-10 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center text-[#8F0038] hover:bg-white transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-8 pb-8 relative">
          {/* Avatar floating */}
          <div className="absolute -top-20 left-8">
            <div className="w-40 h-40 rounded-full border-4 border-[#FFFDFB] bg-[#F7E5EA] shadow-md overflow-hidden relative">
              {candidate.photos?.[0]?.url ? (
                <img src={candidate.photos[0].url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-16 h-16 text-[#75666D] opacity-40" />
                </div>
              )}
            </div>
          </div>

          <div className="pt-24 space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-3xl text-[#241B20]">
                  {candidate.first_name} {candidate.last_name}, {calculateAge(candidate.date_of_birth)}
                </h1>
                {candidate.verification_status === 'verified' && (
                  <CheckCircle className="w-5 h-5 text-[#C99A3D] fill-current shrink-0" />
                )}
              </div>
              <p className="text-sm font-semibold text-[#75666D] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#8F0038]" />
                {candidate.current_city}, {candidate.current_state}
              </p>
              {candidate.managed_by && candidate.managed_by !== 'self' && (
                <p className="text-[10px] font-bold text-[#C99A3D] uppercase tracking-wider mt-2">
                  Profile managed by {candidate.managed_by}
                </p>
              )}
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-b border-[#EBD9DC]/50">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-[#75666D]">Height</p>
                <p className="text-sm font-bold text-[#241B20]">{candidate.height_cm} cm</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-[#75666D]">Marital Status</p>
                <p className="text-sm font-bold text-[#241B20] capitalize">{candidate.marital_status?.replace('_', ' ')}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-[#75666D]">Sect</p>
                <p className="text-sm font-bold text-[#241B20]">{jain.sect || 'Not specified'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-[#75666D]">Community</p>
                <p className="text-sm font-bold text-[#241B20]">{jain.community || 'Not specified'}</p>
              </div>
            </div>

            {/* Action Bar based on relationship status */}
            <div className="flex flex-wrap gap-3 pt-2">
              {relationshipStatus === 'none' && (
                <button onClick={handleInterest} className="px-8 py-3.5 bg-[#8F0038] hover:bg-[#72002E] text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-colors">
                  <Heart className="w-4 h-4" /> Interested
                </button>
              )}
              {relationshipStatus === 'interest_sent' && (
                <button className="px-8 py-3.5 bg-[#F7E5EA] text-[#8F0038] font-bold rounded-xl text-xs flex items-center gap-2 border border-[#8F0038]/20" disabled>
                  <CheckCircle className="w-4 h-4" /> Interest Sent
                </button>
              )}
              {relationshipStatus === 'interest_received' && (
                <>
                  <button onClick={handleAccept} className="px-8 py-3.5 bg-[#8F0038] hover:bg-[#72002E] text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-colors">
                    <CheckCircle className="w-4 h-4" /> Accept Interest
                  </button>
                  <button className="px-8 py-3.5 border border-[#EBD9DC] bg-white text-[#75666D] font-bold rounded-xl text-xs hover:bg-gray-50 transition-colors">
                    Decline
                  </button>
                </>
              )}
              {relationshipStatus === 'connected' && (
                <button className="px-8 py-3.5 bg-[#FDF9F4] border border-[#C99A3D] text-[#C99A3D] font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm">
                  <Users className="w-4 h-4" /> Connected
                </button>
              )}

              {/* Biodata PDF Download (Only if mutually accepted) */}
              <button 
                className={`px-8 py-3.5 font-bold rounded-xl text-xs flex items-center gap-2 transition-colors border ${
                  isConnected 
                    ? 'bg-[#FFFDFB] text-[#8F0038] border-[#8F0038] hover:bg-[#F7E5EA]/20' 
                    : 'bg-[#F9F9F9] text-[#A0A0A0] border-[#E0E0E0] cursor-not-allowed'
                }`}
                disabled={!isConnected}
              >
                {isConnected ? <Download className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                {isConnected ? 'Download Biodata PDF' : 'Biodata Locked'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Digital Matrimonial Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* About */}
        {candidate.about_me && (
          <div className="col-span-1 md:col-span-2 bg-[#FFFDFB] border border-[#EBD9DC] p-6 rounded-[24px] shadow-sm space-y-3">
            <h3 className="font-serif font-bold text-xl text-[#8F0038]">About {candidate.first_name}</h3>
            <p className="text-sm font-semibold text-[#75666D] leading-relaxed">
              {candidate.about_me}
            </p>
          </div>
        )}

        {/* Jain Identity */}
        <div className="bg-[#FFFDFB] border border-[#EBD9DC] p-6 rounded-[24px] shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-xl text-[#8F0038] flex items-center gap-2 border-b border-[#EBD9DC]/50 pb-3">
            <User className="w-5 h-5 text-[#C99A3D]" />
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

        {/* Education & Career */}
        <div className="bg-[#FFFDFB] border border-[#EBD9DC] p-6 rounded-[24px] shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-xl text-[#8F0038] flex items-center gap-2 border-b border-[#EBD9DC]/50 pb-3">
            <GraduationCap className="w-5 h-5 text-[#C99A3D]" />
            Education & Career
          </h3>
          <div className="space-y-4 text-sm">
            {edu.length > 0 ? edu.map((e: any, i: number) => (
              <div key={i} className="space-y-0.5">
                <span className="text-[#75666D] font-bold text-[10px] uppercase">Education</span>
                <p className="font-bold text-[#241B20]">{e.degree_name} ({e.specialization})</p>
                <p className="text-xs font-semibold text-[#75666D]">{e.institution}</p>
              </div>
            )) : (
              <p className="text-xs text-[#75666D] italic">Education details not specified</p>
            )}

            <div className="pt-2 border-t border-[#EBD9DC]/30">
              <span className="text-[#75666D] font-bold text-[10px] uppercase block mb-1">Career</span>
              {emp.company_name ? (
                <>
                  <p className="font-bold text-[#241B20]">{emp.designation}</p>
                  <p className="text-xs font-semibold text-[#75666D]">{emp.company_name} • {emp.work_city}</p>
                  {isConnected ? (
                     <p className="text-xs font-bold text-[#C99A3D] mt-1">{emp.annual_income_lakhs} LPA</p>
                  ) : (
                    <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-[#A0A0A0] bg-[#F9F9F9] inline-flex px-2 py-1 rounded">
                      <Lock className="w-3 h-3" /> Income Hidden
                    </div>
                  )}
                </>
              ) : (
                <p className="text-xs text-[#75666D] italic">Career details not specified</p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Details (Locked conditionally) */}
        <div className="col-span-1 md:col-span-2 bg-[#FFFDFB] border border-[#EBD9DC] p-6 rounded-[24px] shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-xl text-[#8F0038] flex items-center gap-2 border-b border-[#EBD9DC]/50 pb-3">
            <MapPin className="w-5 h-5 text-[#C99A3D]" />
            Contact & Location Details
          </h3>
          
          {isConnected ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#F7E5EA]/40 p-4 rounded-xl border border-[#EBD9DC]">
                <p className="text-[10px] uppercase font-bold text-[#75666D] mb-1">Mobile Number</p>
                <p className="text-sm font-bold text-[#241B20] font-mono">Not implemented (Auth)</p>
              </div>
              <div className="bg-[#F7E5EA]/40 p-4 rounded-xl border border-[#EBD9DC]">
                <p className="text-[10px] uppercase font-bold text-[#75666D] mb-1">Native Place</p>
                <p className="text-sm font-bold text-[#241B20]">{candidate.native_city}, {candidate.native_state}</p>
              </div>
            </div>
          ) : (
            <div className="bg-[#F9F9F9] border border-[#E0E0E0] rounded-2xl p-8 text-center space-y-3">
              <Lock className="w-8 h-8 text-[#A0A0A0] mx-auto" />
              <h4 className="font-bold text-sm text-[#241B20]">Contact Details Locked</h4>
              <p className="text-xs text-[#75666D] max-w-sm mx-auto font-semibold">
                Phone numbers, exact birth details, and family contacts become visible after mutual acceptance. Express interest to connect!
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
