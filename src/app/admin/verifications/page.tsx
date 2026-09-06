'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { 
  ShieldCheck, CheckCircle, XCircle, Eye, AlertTriangle, 
  Search, ArrowLeft, Camera, FileText, UserCheck, ShieldAlert
} from 'lucide-react';

export default function AdminVerificationsPage() {
  const [verifications, setVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');

  // Inspection Modal
  const [inspectItem, setInspectItem] = useState<any | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  useEffect(() => {
    fetchQueue();
  }, [activeFilter]);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('identity_verifications')
        .select(`
          id, status, submitted_at, document_path, selfie_path, notes,
          candidate_profiles (
            id, first_name, last_name, current_city, current_state, gender,
            photos, jain_identities ( sect, community )
          )
        `)
        .eq('status', activeFilter)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setVerifications(data || []);
    } catch (err) {
      console.error('Failed to fetch verification queue:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (item: any) => {
    setActionLoading(true);
    try {
      await supabase
        .from('identity_verifications')
        .update({ status: 'approved', notes: 'Approved by administrator.' })
        .eq('id', item.id);

      if (item.candidate_profiles?.id) {
        await supabase
          .from('candidate_profiles')
          .update({ verification_status: 'verified' })
          .eq('id', item.candidate_profiles.id);
      }

      setInspectItem(null);
      fetchQueue();
    } catch (err: any) {
      alert('Approval failed: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (item: any) => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejecting the verification.');
      return;
    }

    setActionLoading(true);
    try {
      await supabase
        .from('identity_verifications')
        .update({ status: 'rejected', notes: rejectReason })
        .eq('id', item.id);

      if (item.candidate_profiles?.id) {
        await supabase
          .from('candidate_profiles')
          .update({ verification_status: 'rejected' })
          .eq('id', item.candidate_profiles.id);
      }

      setShowRejectInput(false);
      setRejectReason('');
      setInspectItem(null);
      fetchQueue();
    } catch (err: any) {
      alert('Rejection failed: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1A1822] tracking-tight">
            Verification Queue
          </h1>
          <p className="text-xs font-semibold text-gray-400 mt-0.5 uppercase tracking-wider">
            Review Government IDs & Live Selfie Photos
          </p>
        </div>

        {/* Filter Capsule */}
        <div className="inline-flex items-center gap-1.5 p-1.5 bg-gray-100 rounded-full border border-gray-200 text-xs font-bold">
          <button
            onClick={() => setActiveFilter('pending')}
            className={`px-4 py-1.5 rounded-full transition-all ${
              activeFilter === 'pending'
                ? 'bg-[#1E1B24] text-white shadow-md'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            Pending Review
          </button>
          <button
            onClick={() => setActiveFilter('approved')}
            className={`px-4 py-1.5 rounded-full transition-all ${
              activeFilter === 'approved'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setActiveFilter('rejected')}
            className={`px-4 py-1.5 rounded-full transition-all ${
              activeFilter === 'rejected'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            Rejected
          </button>
        </div>
      </div>

      {/* Verification Master Table */}
      <div className="bg-white rounded-[28px] sm:rounded-[32px] border border-gray-150 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-[#FAF8F5] text-gray-500 font-bold border-b border-gray-150">
              <tr>
                <th className="p-4 pl-6">Candidate</th>
                <th className="p-4">Gender</th>
                <th className="p-4">Sect / Community</th>
                <th className="p-4">Location</th>
                <th className="p-4">Submitted Date</th>
                <th className="p-4">Documents</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-gray-400 font-semibold">
                    <div className="w-8 h-8 border-3 border-[#C59A4E] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Loading verification queue...
                  </td>
                </tr>
              )}

              {!loading && verifications.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-gray-500 font-semibold">
                    No {activeFilter} verification requests found.
                  </td>
                </tr>
              )}

              {!loading && verifications.map((item) => {
                const cand = item.candidate_profiles;
                const jainInfo = Array.isArray(cand?.jain_identities) ? cand?.jain_identities[0] : cand?.jain_identities;

                return (
                  <tr key={item.id} className="hover:bg-[#FFFDF4] transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden font-bold text-xs flex items-center justify-center">
                          {cand?.photos?.[0] ? (
                            <img 
                              src={`https://hchxytnssymfobqohowk.supabase.co/storage/v1/object/public/profile-photos/${cand.photos[0]}`} 
                              alt="Profile" 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            (cand?.first_name?.[0] || '') + (cand?.last_name?.[0] || '')
                          )}
                        </div>
                        <div>
                          <p className="font-extrabold text-sm text-[#19191D]">
                            {cand?.first_name} {cand?.last_name}
                          </p>
                          <p className="text-[10px] font-mono text-gray-400">ID: {cand?.id?.split('-')[0].toUpperCase()}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-semibold capitalize text-gray-700">
                      {cand?.gender || '—'}
                    </td>

                    <td className="p-4 font-medium">
                      {jainInfo?.sect || 'Not specified'} {jainInfo?.community ? `• ${jainInfo.community}` : ''}
                    </td>

                    <td className="p-4 text-gray-600">
                      {cand?.current_city ? `${cand.current_city}, ${cand.current_state}` : '—'}
                    </td>

                    <td className="p-4 font-medium text-gray-500">
                      {new Date(item.submitted_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold flex items-center gap-1">
                          <Camera className="w-3 h-3" /> Live Selfie
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-[10px] font-bold flex items-center gap-1">
                          <FileText className="w-3 h-3" /> Gov ID
                        </span>
                      </div>
                    </td>

                    <td className="p-4 pr-6 text-right">
                      <button 
                        onClick={() => {
                          setInspectItem(item);
                          setShowRejectInput(false);
                          setRejectReason('');
                        }}
                        className="px-4 py-2 rounded-full bg-[#1E1B24] hover:bg-[#C59A4E] hover:text-[#121214] text-white font-bold text-xs shadow-sm transition-all inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Inspect & Verify
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side-by-Side Inspection Modal */}
      {inspectItem && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-[32px] max-w-4xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-150">
              <div>
                <h3 className="text-2xl font-extrabold text-[#1A1822]">
                  Verification Comparison
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Candidate: {inspectItem.candidate_profiles?.first_name} {inspectItem.candidate_profiles?.last_name} (ID: {inspectItem.candidate_profiles?.id})
                </p>
              </div>
              <button 
                onClick={() => setInspectItem(null)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
              >
                ✕
              </button>
            </div>

            {/* Side-by-Side Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Box 1: Captured Live Selfie */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 flex flex-col items-center text-center">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-[#C59A4E]" /> Live Captured Selfie
                </span>
                <div className="w-full h-64 rounded-xl bg-gray-200 overflow-hidden flex items-center justify-center relative shadow-inner">
                  {inspectItem.selfie_path ? (
                    <img 
                      src={`https://hchxytnssymfobqohowk.supabase.co/storage/v1/object/public/verification-selfies/${inspectItem.selfie_path}`} 
                      alt="Selfie"
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <span className="text-xs text-gray-400">No selfie file found</span>
                  )}
                </div>
              </div>

              {/* Box 2: Uploaded Government ID */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 flex flex-col items-center text-center">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#C59A4E]" /> Government ID Document
                </span>
                <div className="w-full h-64 rounded-xl bg-gray-200 overflow-hidden flex items-center justify-center relative shadow-inner">
                  {inspectItem.document_path ? (
                    <img 
                      src={`https://hchxytnssymfobqohowk.supabase.co/storage/v1/object/public/verification-documents/${inspectItem.document_path}`} 
                      alt="ID Document"
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <span className="text-xs text-gray-400">No document file found</span>
                  )}
                </div>
              </div>

            </div>

            {/* Rejection input when triggered */}
            {showRejectInput && (
              <div className="bg-red-50 p-4 rounded-2xl border border-red-200 space-y-2">
                <label className="text-xs font-bold text-red-900 block">
                  Rejection Reason (Required):
                </label>
                <input 
                  type="text"
                  placeholder="e.g., Selfie does not clearly match the document photo, or ID is blurred..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-red-300 text-xs focus:outline-none focus:border-red-500"
                />
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-150 flex-wrap">
              <Link 
                href={`/admin/users/${inspectItem.candidate_profiles?.id}`}
                target="_blank"
                className="text-xs font-bold text-[#C59A4E] hover:underline flex items-center gap-1"
              >
                View Full Candidate Profile ↗
              </Link>

              <div className="flex items-center gap-3">
                {!showRejectInput ? (
                  <button 
                    onClick={() => setShowRejectInput(true)}
                    className="px-5 py-2.5 rounded-full bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs transition-colors"
                  >
                    Reject with Reason...
                  </button>
                ) : (
                  <button 
                    onClick={() => handleReject(inspectItem)}
                    disabled={actionLoading}
                    className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors shadow-md"
                  >
                    Confirm Rejection
                  </button>
                )}

                <button 
                  onClick={() => handleApprove(inspectItem)}
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve Verification
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
