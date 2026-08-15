'use client';

import React, { useState } from 'react';
import { HeartHandshake, CheckCircle, XCircle, Clock, User } from 'lucide-react';
import { useInterests } from '@/hooks/useInterests';
import { useCandidateProfile } from '@/hooks/useCandidateProfile';

const FallbackAvatar = () => (
  <div className="w-full h-full bg-[#EDE1D7] flex items-center justify-center text-[#766B70]">
    <User className="w-1/2 h-1/2 opacity-50" />
  </div>
);

export default function InterestsPage() {
  const { profile: loggedInUser } = useCandidateProfile();
  const { 
    interestsReceived, 
    interestsSent, 
    acceptInterest, 
    declineInterest, 
    loading 
  } = useInterests(loggedInUser?.id);
  
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');

  const handleAccept = async (interestId: string, senderId: string) => {
    if (!loggedInUser) return;
    await acceptInterest(interestId, senderId, loggedInUser.id);
  };

  const handleDecline = async (interestId: string) => {
    await declineInterest(interestId);
  };

  const displayList = activeTab === 'received' ? interestsReceived : interestsSent;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-3xl border border-[#EDE1D7] shadow-sm">
        <h1 className="font-serif text-3xl font-bold text-burgundy mb-2 flex items-center gap-2">
          <HeartHandshake className="w-6 h-6" />
          Interests
        </h1>
        <p className="text-sm text-[#766B70] font-semibold">Manage your incoming and outgoing connection requests.</p>
      </div>

      <div className="flex gap-4 border-b border-[#EDE1D7] pb-px">
        <button 
          onClick={() => setActiveTab('received')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'received' ? 'border-burgundy text-burgundy' : 'border-transparent text-[#766B70] hover:text-text'
          }`}
        >
          Received
          {interestsReceived.length > 0 && (
            <span className="bg-burgundy text-white text-[10px] px-2 py-0.5 rounded-full">{interestsReceived.length}</span>
          )}
        </button>
        <button 
          onClick={() => setActiveTab('sent')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'sent' ? 'border-burgundy text-burgundy' : 'border-transparent text-[#766B70] hover:text-text'
          }`}
        >
          Sent
          {interestsSent.length > 0 && (
            <span className="bg-[#F8EFE5] text-[#766B70] text-[10px] px-2 py-0.5 rounded-full">{interestsSent.length}</span>
          )}
        </button>
      </div>

      <div className="pt-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="h-24 bg-white border border-[#EDE1D7] rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : displayList.length === 0 ? (
          <div className="bg-white border border-[#EDE1D7] rounded-3xl p-12 text-center shadow-sm">
            <HeartHandshake className="w-12 h-12 text-[#EDE1D7] mx-auto mb-4" />
            <h3 className="font-serif text-xl font-bold text-text mb-2">No {activeTab} interests</h3>
            <p className="text-sm text-[#766B70]">
              {activeTab === 'received' 
                ? "You don't have any pending incoming requests right now." 
                : "You haven't sent any interest requests yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayList.map((interest: any) => {
              // Depending on tab, we show the OTHER person
              const profile = activeTab === 'received' ? interest.sender : interest.receiver;
              
              if (!profile) return null;

              return (
                <div key={interest.id} className="bg-white border border-[#EDE1D7] rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                  <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 bg-[#F8EFE5] border-2 border-[#FFF9F2]">
                    {profile.photos?.[0]?.url ? (
                      <img src={profile.photos[0].url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <FallbackAvatar />
                    )}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-serif font-bold text-text">{profile.first_name} {profile.last_name}</h3>
                    <p className="text-xs text-[#766B70] flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {new Date(interest.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  {activeTab === 'received' ? (
                    <div className="flex flex-col gap-2 shrink-0">
                      <button 
                        onClick={() => handleAccept(interest.id, profile.id)}
                        className="bg-burgundy text-white px-4 py-1.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 hover:bg-deepBurgundy"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Accept
                      </button>
                      <button 
                        onClick={() => handleDecline(interest.id)}
                        className="bg-[#FFF1F1] text-burgundy px-4 py-1.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 hover:bg-[#F8E8EA]"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Decline
                      </button>
                    </div>
                  ) : (
                    <div className="shrink-0 bg-[#F8EFE5] px-3 py-1.5 rounded-lg text-[11px] font-bold text-[#766B70]">
                      Pending Reply
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
