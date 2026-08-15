'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, MapPin, Heart, Bookmark, AlertCircle, FileText, Download,
  Lock, ArrowLeft, MoreHorizontal, User, Users
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useCandidateProfile } from '@/hooks/useCandidateProfile';
import { useRouter } from 'next/navigation';
import { 
  PersonalDetails, 
  JainIdentity, 
  EducationSection, 
  CareerSection, 
  FamilySection, 
  LocationSection, 
  LifestyleSection, 
  ContactSection, 
  BiodataSection 
} from '@/components/profile/ProfileSections';

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
            users (email, phone),
            jain_identities(*),
            education_records(*),
            employment_records(*),
            lifestyle_profiles(*),
            family_members(*),
            profile_privacies(*),
            biodatas(*),
            photos(*)
          `)
          .eq('id', params.id)
          .single();
          
        if (candError) throw candError;
        setCandidate(candData);

        // 2. Fetch Relationship Status
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

  const handleInterest = async () => {
    if (!loggedInUser) return;
    try {
      await supabase.from('interest_requests').insert({
        sender_id: loggedInUser.id,
        receiver_id: params.id,
        status: 'pending'
      });
      setRelationshipStatus('interest_sent');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAccept = async () => {
    if (!loggedInUser) return;
    try {
      await supabase.from('interest_requests')
        .update({ status: 'accepted' })
        .eq('sender_id', params.id)
        .eq('receiver_id', loggedInUser.id);
        
      // Connection row creates via DB trigger or insert manually
      await supabase.from('connections').insert({
        candidate_a: params.id,
        candidate_b: loggedInUser.id
      });
      
      setRelationshipStatus('connected');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    if (!loggedInUser) return;
    try {
      if (isSaved) {
        await supabase.from('saved_profiles').delete()
          .eq('candidate_id', loggedInUser.id)
          .eq('saved_candidate_id', params.id);
        setIsSaved(false);
      } else {
        await supabase.from('saved_profiles').insert({
          candidate_id: loggedInUser.id,
          saved_candidate_id: params.id
        });
        setIsSaved(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const calculateAge = (dob: string) => {
    if (!dob) return 'N/A';
    const diff = Date.now() - new Date(dob).getTime();
    return Math.abs(new Date(diff).getUTCFullYear() - 1970);
  };

  if (loading || authLoading) {
    return (
      <div className="flex justify-center py-20">
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

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Top Nav Back button */}
      <button onClick={() => router.back()} className="flex items-center gap-2 text-xs font-bold text-[#75666D] hover:text-[#241B20] transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to matches
      </button>

      {/* Profile Header Card */}
      <div className="bg-[#FFFDFB] border border-[#EBD9DC] rounded-[32px] overflow-hidden shadow-sm relative">
        <div className="h-48 bg-gradient-to-r from-[#F7E5EA] via-[#FFF8F7] to-[#FDF9F4] relative">
          <div className="absolute top-4 right-4 flex gap-2">
            <button onClick={handleSave} className={`w-10 h-10 backdrop-blur-md rounded-full flex items-center justify-center transition-colors ${isSaved ? 'bg-[#8F0038] text-white border border-[#8F0038]' : 'bg-white/50 text-[#8F0038] hover:bg-white'}`}>
              <Bookmark className="w-5 h-5" fill={isSaved ? "currentColor" : "none"} />
            </button>
            <button className="w-10 h-10 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center text-[#8F0038] hover:bg-white transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-6 md:px-10 pb-10 relative">
          <div className="absolute -top-24 left-6 md:left-10">
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-[32px] border-4 border-[#FFFDFB] bg-[#F7E5EA] shadow-xl overflow-hidden relative group">
              {candidate.photos?.[0]?.url ? (
                <img src={candidate.photos[0].url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-16 h-16 md:w-20 md:h-20 text-[#75666D] opacity-40" />
                </div>
              )}
            </div>
          </div>

          <div className="pt-24 md:pt-28 flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-3xl md:text-4xl text-[#241B20]">
                  {candidate.first_name} {candidate.last_name}
                </h1>
                {candidate.verification_status === 'verified' && (
                  <CheckCircle className="w-7 h-7 text-[#C99A3D] fill-current shrink-0" />
                )}
              </div>
              <p className="text-sm md:text-base font-semibold text-[#75666D] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#8F0038]" />
                {candidate.current_city}, {candidate.current_state}
              </p>
              
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {candidate.date_of_birth && (
                  <span className="text-xs font-bold text-[#8F0038] bg-[#F7E5EA]/60 px-3 py-1.5 rounded-lg border border-[#EBD9DC]/50">
                    {calculateAge(candidate.date_of_birth)} Years
                  </span>
                )}
                {candidate.height_cm && (
                  <span className="text-xs font-bold text-[#75666D] bg-[#FFFDFB] px-3 py-1.5 rounded-lg border border-[#EBD9DC] tracking-wide">
                    {candidate.height_cm} cm
                  </span>
                )}
                {candidate.jain_identities?.[0]?.sect && (
                  <span className="text-xs font-bold text-[#75666D] bg-[#FFFDFB] px-3 py-1.5 rounded-lg border border-[#EBD9DC] uppercase tracking-wide">
                    {candidate.jain_identities[0].sect}
                  </span>
                )}
              </div>
            </div>

            {/* Action Bar based on relationship status */}
            <div className="flex flex-col gap-3 min-w-[200px]">
              {relationshipStatus === 'none' && (
                <button onClick={handleInterest} className="px-8 py-3.5 bg-[#8F0038] hover:bg-[#72002E] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-colors">
                  <Heart className="w-4 h-4" /> Interested
                </button>
              )}
              {relationshipStatus === 'interest_sent' && (
                <button className="px-8 py-3.5 bg-[#F7E5EA] text-[#8F0038] font-bold rounded-xl text-xs flex items-center justify-center gap-2 border border-[#8F0038]/20" disabled>
                  <CheckCircle className="w-4 h-4" /> Interest Sent
                </button>
              )}
              {relationshipStatus === 'interest_received' && (
                <>
                  <button onClick={handleAccept} className="px-8 py-3.5 bg-[#8F0038] hover:bg-[#72002E] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-colors">
                    <CheckCircle className="w-4 h-4" /> Accept Interest
                  </button>
                  <button className="px-8 py-3.5 border border-[#EBD9DC] bg-white text-[#75666D] font-bold rounded-xl text-xs hover:bg-gray-50 transition-colors">
                    Decline
                  </button>
                </>
              )}
              {relationshipStatus === 'connected' && (
                <button className="px-8 py-3.5 bg-[#FDF9F4] border border-[#C99A3D] text-[#C99A3D] font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm">
                  <Users className="w-4 h-4" /> Connected
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Core Info */}
        <div className="lg:col-span-2 space-y-6">
          <PersonalDetails profile={candidate} onEdit={undefined as any} />
          <JainIdentity identity={candidate.jain_identities?.[0]} onEdit={undefined as any} />
          
          {candidate.education_records?.length > 0 && (
            <EducationSection 
              educationRecords={candidate.education_records} 
              onAdd={undefined as any} onEdit={undefined as any} onRemove={undefined as any}
            />
          )}
          
          {candidate.employment_records?.length > 0 && (
            <CareerSection 
              employmentRecords={candidate.employment_records} 
              onAdd={undefined as any} onEdit={undefined as any} onRemove={undefined as any}
            />
          )}

          {candidate.family_members?.length > 0 && (
            <FamilySection 
              familyMembers={candidate.family_members} 
              onAdd={undefined as any} onEdit={undefined as any} onRemove={undefined as any}
            />
          )}

          <LifestyleSection lifestyle={candidate.lifestyle_profiles?.[0]} onEdit={undefined as any} />
        </div>

        {/* Right Column - Privacy & Contact */}
        <div className="space-y-6">
          
          {/* Contact Details with Privacy Lock */}
          <div className="bg-[#FFFDFB] border border-[#EBD9DC] rounded-[24px] p-6 shadow-sm mb-6">
            <h2 className="font-serif text-2xl font-bold text-[#8F0038] mb-6 pb-4 border-b border-[#EBD9DC] flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#C99A3D]" /> Contact Details
            </h2>
            {isConnected ? (
              <div className="space-y-4">
                <div className="p-4 bg-[#FDF9F4] rounded-xl border border-[#C99A3D]/30">
                  <p className="text-xs font-bold text-[#75666D] mb-1">Mobile Number</p>
                  <p className="text-[15px] font-bold text-[#241B20]">{candidate.users?.phone || '+91 XXXXX XXXXX'}</p>
                </div>
                <div className="p-4 bg-[#FDF9F4] rounded-xl border border-[#C99A3D]/30">
                  <p className="text-xs font-bold text-[#75666D] mb-1">Email Address</p>
                  <p className="text-[15px] font-bold text-[#241B20]">{candidate.users?.email || 'Not provided'}</p>
                </div>
                <p className="text-xs font-bold text-[#C99A3D] mt-2 flex items-center gap-1.5 justify-center">
                  <CheckCircle className="w-3.5 h-3.5" /> Unlocked via Mutual Connection
                </p>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-[#F7E5EA] flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-5 h-5 text-[#8F0038]" />
                </div>
                <h3 className="text-sm font-bold text-[#241B20] mb-1">Contact Protected</h3>
                <p className="text-xs text-[#75666D] mb-4">Phone and email are hidden until an interest request is mutually accepted.</p>
                {relationshipStatus === 'none' && (
                  <button onClick={handleInterest} className="px-6 py-2.5 bg-[#8F0038] text-white font-bold rounded-xl text-xs hover:bg-[#72002E] transition-colors w-full">
                    Send Interest to Unlock
                  </button>
                )}
              </div>
            )}
          </div>

          <LocationSection profile={candidate} onEdit={undefined as any} />
        </div>
      </div>

    </div>
  );
}
