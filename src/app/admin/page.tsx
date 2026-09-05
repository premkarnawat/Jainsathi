'use client';

import React, { useState, useEffect } from 'react';
import { JainSaathiLogo } from '@/components/ui/JainSaathiLogo';
import { ShieldCheck, Users, AlertTriangle, CreditCard, Settings, FileCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'verifications' | 'taxonomy' | 'reports'>('verifications');
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
          id, first_name, last_name, current_city, current_state,
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
    await supabase.from('candidate_profiles').update({ verification_status: 'unverified' }).eq('id', candidateId);
    fetchVerifications();
  };

  const getSectStr = (cand: any) => {
    const j = Array.isArray(cand.jain_identities) ? cand.jain_identities[0] : cand.jain_identities;
    if (!j) return 'N/A';
    return `${j.sect || ''} • ${j.community || ''}`;
  };

  return (
    <div className="min-h-screen bg-[#100A18] text-[#FFF9F1] flex flex-col md:flex-row">
      
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-[#100A18] border-r border-[#D6A24A]/20 p-5 space-y-6">
        <div className="flex items-center gap-2">
          <JainSaathiLogo variant="dark" size="sm" />
          <span className="bg-[#9E183A] text-white text-[10px] font-bold px-2 py-0.5 rounded">ADMIN</span>
        </div>

        <nav className="space-y-1 text-xs">
          <button
            onClick={() => setActiveTab('verifications')}
            className={`w-full text-left px-3 py-2.5 rounded-xl font-medium flex items-center gap-2 ${
              activeTab === 'verifications' ? 'bg-[#9E183A] text-white font-bold' : 'text-[#F3D59B]/70 hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Pending Verifications
          </button>
          
          <button
            onClick={() => setActiveTab('taxonomy')}
            className={`w-full text-left px-3 py-2.5 rounded-xl font-medium flex items-center gap-2 ${
              activeTab === 'taxonomy' ? 'bg-[#9E183A] text-white font-bold' : 'text-[#F3D59B]/70 hover:bg-white/5'
            }`}
          >
            <Settings className="w-4 h-4" /> Jain Taxonomy Manager
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`w-full text-left px-3 py-2.5 rounded-xl font-medium flex items-center gap-2 ${
              activeTab === 'reports' ? 'bg-[#9E183A] text-white font-bold' : 'text-[#F3D59B]/70 hover:bg-white/5'
            }`}
          >
            <AlertTriangle className="w-4 h-4" /> Profile Moderation & Reports
          </button>
        </nav>
      </aside>

      {/* Admin Main Body */}
      <main className="flex-1 p-6 space-y-6">
        <h1 className="font-serif font-bold text-3xl text-[#FFF9F1]">
          JainSaathi Secure Admin Portal
        </h1>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-[#6E1231]/30 border border-[#D6A24A]/30 p-4 rounded-2xl">
            <p className="text-xs text-[#F3D59B]">Pending Verifications</p>
            <p className="font-serif text-3xl font-bold text-[#D6A24A] mt-1">{verifications.length}</p>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'verifications' && (
          <div className="bg-[#100A18]/80 border border-[#D6A24A]/25 rounded-2xl p-6 space-y-4">
            <h2 className="font-serif font-bold text-xl text-[#F3D59B]">Verification Requests Queue</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-[#6E1231]/40 text-[#F3D59B] uppercase font-bold text-[10px]">
                  <tr>
                    <th className="p-3">Candidate</th>
                    <th className="p-3">Sect / Community</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Photo & ID</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {loading && <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr>}
                  {!loading && verifications.length === 0 && <tr><td colSpan={5} className="p-4 text-center text-gray-500">No pending verifications.</td></tr>}
                  {verifications.map((v) => (
                    <tr key={v.id}>
                      <td className="p-3 font-semibold text-white">
                        {v.candidate_profiles?.first_name} {v.candidate_profiles?.last_name}
                      </td>
                      <td className="p-3">{getSectStr(v.candidate_profiles)}</td>
                      <td className="p-3">{v.candidate_profiles?.current_city}, {v.candidate_profiles?.current_state}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <a href={`https://hchxytnssymfobqohowk.supabase.co/storage/v1/object/public/verification-selfies/${v.selfie_path}`} target="_blank" className="text-[#D6A24A] hover:underline">Selfie</a>
                          <a href={`https://hchxytnssymfobqohowk.supabase.co/storage/v1/object/public/verification-documents/${v.document_path}`} target="_blank" className="text-emerald-400 hover:underline">ID Doc</a>
                        </div>
                      </td>
                      <td className="p-3 flex gap-2">
                        <button onClick={() => handleApprove(v.id, v.candidate_profiles?.id)} className="bg-emerald-700 text-white px-3 py-1 rounded font-bold hover:bg-emerald-600">Approve</button>
                        <button onClick={() => handleReject(v.id, v.candidate_profiles?.id)} className="bg-red-800 text-white px-3 py-1 rounded hover:bg-red-700">Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
