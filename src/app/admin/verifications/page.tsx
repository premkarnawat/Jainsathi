'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function AdminVerificationsPage() {
  const [verifications, setVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('identity_verifications')
      .select(`
        id, status, submitted_at, document_path, selfie_path,
        candidate_profiles (
          id, first_name, last_name, current_city, current_state, gender,
          jain_identities ( sect, community )
        )
      `)
      .eq('status', 'pending');
    setVerifications(data || []);
    setLoading(false);
  };

  const handleApprove = async (id: string, candidateId: string) => {
    if (!confirm('Approve this profile?')) return;
    await supabase.from('identity_verifications').update({ status: 'approved' }).eq('id', id);
    await supabase.from('candidate_profiles').update({ verification_status: 'verified' }).eq('id', candidateId);
    fetchVerifications();
  };

  const handleReject = async (id: string, candidateId: string) => {
    if (!confirm('Reject this profile?')) return;
    await supabase.from('identity_verifications').update({ status: 'rejected' }).eq('id', id);
    await supabase.from('candidate_profiles').update({ verification_status: 'rejected' }).eq('id', candidateId);
    fetchVerifications();
  };

  const getSectStr = (cand: any) => {
    if (!cand || !cand.jain_identities) return 'N/A';
    const j = Array.isArray(cand.jain_identities) ? cand.jain_identities[0] : cand.jain_identities;
    if (!j) return 'N/A';
    return `${j.sect || ''} • ${j.community || ''}`;
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-[#241A20]">Verification Requests</h1>
        <p className="text-sm font-semibold text-[#75666D] mt-1">Review and approve pending identity verifications.</p>
      </div>

      <div className="bg-[#FFFDFB] border border-[#EBD9DC] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FDF9F4] text-[#8F0038] uppercase font-bold text-[10px] tracking-wider border-b border-[#EBD9DC]">
              <tr>
                <th className="p-4">Candidate</th>
                <th className="p-4">Gender</th>
                <th className="p-4">Sect / Community</th>
                <th className="p-4">Location</th>
                <th className="p-4">Photo & ID</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBD9DC]">
              {loading && <tr><td colSpan={6} className="p-6 text-center font-semibold text-gray-500">Loading requests...</td></tr>}
              {!loading && verifications.length === 0 && <tr><td colSpan={6} className="p-6 text-center font-semibold text-gray-500">No pending verifications at the moment.</td></tr>}
              
              {verifications.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50/50">
                  <td className="p-4 font-bold text-[#241A20]">
                    {v.candidate_profiles?.first_name} {v.candidate_profiles?.last_name}
                  </td>
                  <td className="p-4 text-[#75666D] capitalize">{v.candidate_profiles?.gender || 'N/A'}</td>
                  <td className="p-4 text-[#75666D]">{getSectStr(v.candidate_profiles)}</td>
                  <td className="p-4 text-[#75666D]">{v.candidate_profiles?.current_city}, {v.candidate_profiles?.current_state}</td>
                  <td className="p-4">
                    <div className="flex gap-3">
                      <a href={`https://hchxytnssymfobqohowk.supabase.co/storage/v1/object/public/verification-selfies/${v.selfie_path}`} target="_blank" className="text-[#8F0038] font-bold text-xs hover:underline bg-[#FDF9F4] px-2 py-1 rounded">View Selfie</a>
                      <a href={`https://hchxytnssymfobqohowk.supabase.co/storage/v1/object/public/verification-documents/${v.document_path}`} target="_blank" className="text-[#C99A3D] font-bold text-xs hover:underline bg-[#FDF9F4] px-2 py-1 rounded">View ID Doc</a>
                    </div>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => handleApprove(v.id, v.candidate_profiles?.id)} className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg font-bold text-xs hover:bg-emerald-700 shadow-sm transition-colors">Approve</button>
                    <button onClick={() => handleReject(v.id, v.candidate_profiles?.id)} className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded-lg font-bold text-xs hover:bg-gray-300 shadow-sm transition-colors">Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
