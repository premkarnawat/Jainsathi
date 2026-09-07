'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, Eye, CheckCircle2, XCircle, 
  Download, MapPin, Check, ShieldCheck
} from 'lucide-react';

export default function AdminCandidatesPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Filters
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sectFilter, setSectFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Proportions for metric pill bar
  const [metrics, setMetrics] = useState({
    total: 0,
    malePct: 50,
    femalePct: 50,
    verifiedPct: 0,
    paidPct: 20,
  });

  useEffect(() => {
    fetchCandidates();
  }, [genderFilter, statusFilter, sectFilter]);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (genderFilter !== 'all') params.append('gender', genderFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await fetch(`/api/admin/candidates?${params.toString()}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.candidates)) {
        let filtered = data.candidates;
        if (sectFilter !== 'all') {
          filtered = filtered.filter((c: any) => {
            const sect = c.jain_identities?.sect || '';
            return sect.toLowerCase().includes(sectFilter.toLowerCase());
          });
        }
        setCandidates(filtered);

        const total = filtered.length;
        if (total > 0) {
          const maleCount = filtered.filter((c: any) => c.gender?.toLowerCase() === 'male').length;
          const verifiedCount = filtered.filter((c: any) => c.verification_status?.toLowerCase() === 'verified').length;
          setMetrics({
            total,
            malePct: Math.round((maleCount / total) * 100) || 0,
            femalePct: Math.round(((total - maleCount) / total) * 100) || 0,
            verifiedPct: Math.round((verifiedCount / total) * 100) || 0,
            paidPct: 25,
          });
        } else {
          setMetrics({ total: 0, malePct: 0, femalePct: 0, verifiedPct: 0, paidPct: 0 });
        }
      }
    } catch (err: any) {
      console.error('Error fetching candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (candidateId: string, newStatus: 'verified' | 'rejected' | 'pending') => {
    try {
      const res = await fetch('/api/admin/candidates', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId, verificationStatus: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, verification_status: newStatus } : c));
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const calculateAge = (dobString?: string) => {
    if (!dobString) return null;
    const dob = new Date(dobString);
    const diffMs = Date.now() - dob.getTime();
    const ageDt = new Date(diffMs);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  };

  const filteredCandidates = candidates.filter((cand) => {
    const term = searchQuery.toLowerCase().trim();
    if (!term) return true;
    const fullName = `${cand.first_name || ''} ${cand.last_name || ''}`.toLowerCase();
    const email = (cand.users?.email || '').toLowerCase();
    const phone = (cand.users?.phone || '').toLowerCase();
    const city = (cand.current_city || '').toLowerCase();
    const id = (cand.id || '').toLowerCase();
    return fullName.includes(term) || email.includes(term) || phone.includes(term) || city.includes(term) || id.includes(term);
  });

  return (
    <div className="space-y-5 relative select-none">
      
      {/* 1. Filter Capsules & Quick Links */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200/50 pb-3">
        {/* Gender Filter Buttons */}
        <div className="inline-flex items-center gap-1 p-1 bg-black/5 rounded-full border border-black/5 text-xs font-bold w-fit">
          <button 
            type="button"
            onClick={() => setGenderFilter('all')}
            className={`px-3 py-1 rounded-full transition-all ${
              genderFilter === 'all' 
                ? 'bg-[#8F173D] text-white shadow-xs' 
                : 'text-gray-600 hover:text-black hover:bg-white/60'
            }`}
          >
            All Candidates
          </button>
          <button 
            type="button"
            onClick={() => setGenderFilter('male')}
            className={`px-3 py-1 rounded-full transition-all ${
              genderFilter === 'male' 
                ? 'bg-[#8F173D] text-white shadow-xs' 
                : 'text-gray-600 hover:text-black hover:bg-white/60'
            }`}
          >
            Male
          </button>
          <button 
            type="button"
            onClick={() => setGenderFilter('female')}
            className={`px-3 py-1 rounded-full transition-all ${
              genderFilter === 'female' 
                ? 'bg-[#8F173D] text-white shadow-xs' 
                : 'text-gray-600 hover:text-black hover:bg-white/60'
            }`}
          >
            Female
          </button>
          <button 
            type="button"
            onClick={() => setStatusFilter(statusFilter === 'verified' ? 'all' : 'verified')}
            className={`px-3 py-1 rounded-full transition-all ${
              statusFilter === 'verified' 
                ? 'bg-[#D4AF37] text-[#121214] font-extrabold shadow-xs' 
                : 'text-gray-600 hover:text-black hover:bg-white/60'
            }`}
          >
            Verified Only
          </button>
        </div>

        {/* Quick Links */}
        <div className="flex items-center gap-2">
          <Link 
            href="/admin/verifications"
            className="px-3 py-1 rounded-full bg-white/80 border border-gray-200 text-xs font-bold text-gray-700 hover:border-[#D4AF37] hover:text-[#8F173D] transition-all shadow-xs"
          >
            Verification Queue
          </Link>
          <button 
            type="button"
            onClick={() => {
              const csvData = candidates.map(c => `"${c.id}","${c.first_name} ${c.last_name}","${c.gender}","${c.users?.email || ''}","${c.verification_status}"`).join('\n');
              const blob = new Blob([`"ID","Name","Gender","Email","Status"\n${csvData}`], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `candidates-${new Date().toISOString().slice(0,10)}.csv`;
              a.click();
            }}
            className="px-3 py-1 bg-white/80 border border-gray-200 text-gray-700 text-xs font-bold rounded-full hover:bg-gray-50 flex items-center gap-1 shadow-xs transition-all"
          >
            <Download className="w-3 h-3" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 2. Page Header & Segmented Metrics */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Registered Candidates
            </h1>
            <p className="text-xs font-semibold text-gray-500 mt-0.5">
              {candidates.length} profiles synchronized from database
            </p>
          </div>
        </div>

        {/* Segmented Metric Pills */}
        <div className="flex items-center gap-2 flex-wrap text-xs font-bold">
          <div className="bg-[#8F173D] text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs">
            <span>Male</span>
            <span className="bg-white/20 px-1.5 py-0.2 rounded-full text-[10px]">{metrics.malePct}%</span>
          </div>

          <div className="bg-[#D4AF37] text-[#1E1B24] px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs">
            <span>Female</span>
            <span className="bg-black/15 px-1.5 py-0.2 rounded-full text-[10px]">{metrics.femalePct}%</span>
          </div>

          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs">
            <span>Verified</span>
            <span className="bg-emerald-200/60 text-emerald-900 px-1.5 py-0.2 rounded-full text-[10px]">{metrics.verifiedPct}%</span>
          </div>

          <div className="bg-black/5 text-gray-700 px-3 py-1.5 rounded-full flex items-center gap-1">
            <span>Total Candidates:</span>
            <span className="font-extrabold">{candidates.length}</span>
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-2.5 shadow-xs border border-gray-200/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <select 
            value={sectFilter}
            onChange={(e: any) => setSectFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-bold focus:outline-none"
          >
            <option value="all">Sect: All</option>
            <option value="shwetambar">Shwetambar</option>
            <option value="digambar">Digambar</option>
            <option value="sthanakvasi">Sthanakvasi</option>
            <option value="terapanthi">Terapanthi</option>
          </select>

          <select 
            value={statusFilter}
            onChange={(e: any) => setStatusFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-bold focus:outline-none"
          >
            <option value="all">Status: All</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Live Search */}
        <div className="relative flex-1 md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input 
            type="text"
            placeholder="Search name, email, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-3 py-1.5 text-xs font-medium focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* ============================================================
          4. CANDIDATES DATA DISPLAY:
             - Mobile Cards View (Below sm/md)
             - High-Density Table (Desktop)
          ============================================================ */}

      {/* MOBILE CARDS VIEW */}
      <div className="block lg:hidden space-y-3">
        {loading && (
          <div className="p-8 text-center text-gray-400 font-semibold bg-white/50 rounded-2xl border border-gray-200/60">
            <div className="w-6 h-6 border-2 border-[#8F173D] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading candidates...
          </div>
        )}

        {!loading && filteredCandidates.length === 0 && (
          <div className="p-8 text-center text-gray-500 font-semibold bg-white/50 rounded-2xl border border-gray-200/60">
            No candidates found matching the selected filters.
          </div>
        )}

        {!loading && filteredCandidates.map((cand) => {
          const age = calculateAge(cand.date_of_birth);
          const jainInfo = cand.jain_identities;

          return (
            <div 
              key={cand.id}
              className="bg-white/90 rounded-2xl p-4 border border-gray-200 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#8F173D]/10 text-[#8F173D] border border-[#8F173D]/20 flex items-center justify-center font-bold text-xs uppercase overflow-hidden shrink-0">
                    {(cand.first_name?.[0] || '') + (cand.last_name?.[0] || '')}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-[#19191D] leading-tight">
                      {cand.first_name} {cand.last_name}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-mono">
                      {cand.gender?.toUpperCase()} {age ? `• ${age} YRS` : ''} • {cand.users?.email}
                    </p>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                  cand.verification_status === 'verified'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : cand.verification_status === 'pending'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-red-50 text-red-800 border-red-200'
                }`}>
                  {cand.verification_status || 'Pending'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-gray-100">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">Sect</span>
                  <span className="font-semibold">{jainInfo?.sect || 'Shwetambar'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">Location</span>
                  <span className="font-semibold truncate block">
                    {cand.current_city ? `${cand.current_city}, ${cand.current_state}` : 'Pending location'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <Link
                  href={`/admin/users/${cand.id}`}
                  className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </Link>

                <div className="flex items-center gap-1.5">
                  {cand.verification_status !== 'verified' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(cand.id, 'verified')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Verify</span>
                    </button>
                  )}
                  {cand.verification_status !== 'rejected' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(cand.id, 'rejected')}
                      className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DESKTOP MASTER TABLE VIEW */}
      <div className="hidden lg:block bg-white/90 rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-[#FAF8F5] text-gray-500 font-bold border-b border-gray-200">
              <tr>
                <th className="p-3 pl-5 w-10 text-center">#</th>
                <th className="p-3">Candidate</th>
                <th className="p-3">Gender / Age</th>
                <th className="p-3">Sect & Community</th>
                <th className="p-3">Location</th>
                <th className="p-3">Verification</th>
                <th className="p-3 pr-5 text-right">Quick Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading && (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-gray-400 font-semibold">
                    <div className="w-6 h-6 border-2 border-[#8F173D] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Loading candidates...
                  </td>
                </tr>
              )}

              {!loading && filteredCandidates.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-gray-500 font-semibold">
                    No candidates found matching the selected filters.
                  </td>
                </tr>
              )}

              {!loading && filteredCandidates.map((cand, idx) => {
                const isSelected = selectedId === cand.id;
                const age = calculateAge(cand.date_of_birth);
                const jainInfo = cand.jain_identities;

                return (
                  <tr 
                    key={cand.id}
                    onClick={() => setSelectedId(isSelected ? null : cand.id)}
                    className={`transition-colors cursor-pointer ${
                      isSelected 
                        ? 'bg-amber-50/80 font-medium' 
                        : 'hover:bg-gray-50/80'
                    }`}
                  >
                    <td className="p-3 pl-5 text-center text-gray-400 font-mono">
                      {idx + 1}
                    </td>

                    {/* Candidate */}
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#8F173D]/10 text-[#8F173D] border border-[#8F173D]/20 flex items-center justify-center font-bold text-xs uppercase overflow-hidden shrink-0">
                          {(cand.first_name?.[0] || '') + (cand.last_name?.[0] || '')}
                        </div>
                        <div className="min-w-0">
                          <p className="font-extrabold text-xs text-[#19191D] truncate leading-tight">
                            {cand.first_name} {cand.last_name}
                          </p>
                          <p className="text-[10px] text-gray-400 font-mono truncate">
                            {cand.users?.email || 'No email'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Gender & Age */}
                    <td className="p-3 font-semibold">
                      <span className="capitalize">{cand.gender}</span>
                      {age && <span className="text-gray-500 ml-1">({age}y)</span>}
                    </td>

                    {/* Sect */}
                    <td className="p-3">
                      <p className="font-bold text-[#19191D]">{jainInfo?.sect || 'Shwetambar'}</p>
                      <p className="text-[10px] text-gray-400">{jainInfo?.community || 'Deravasi'}</p>
                    </td>

                    {/* Location */}
                    <td className="p-3">
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                        <span className="truncate">
                          {cand.current_city ? `${cand.current_city}, ${cand.current_state}` : 'Pending'}
                        </span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                        cand.verification_status === 'verified'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : cand.verification_status === 'pending'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-red-50 text-red-800 border-red-200'
                      }`}>
                        {cand.verification_status || 'Pending'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3 pr-5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        {cand.verification_status !== 'verified' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(cand.id, 'verified')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1 transition-all"
                            title="Approve verification"
                          >
                            <Check className="w-3 h-3" />
                            <span>Verify</span>
                          </button>
                        )}
                        <Link 
                          href={`/admin/users/${cand.id}`}
                          className="p-1.5 rounded-lg bg-gray-100 hover:bg-[#8F173D] hover:text-white text-gray-600 transition-all"
                          title="Open Full Profile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-3 px-5 border-t border-gray-200 bg-[#FAF8F5] flex items-center justify-between text-xs text-gray-500 font-semibold">
          <span>Showing {filteredCandidates.length} of {candidates.length} candidates</span>
          <span>Database Direct Connected</span>
        </div>
      </div>

    </div>
  );
}
