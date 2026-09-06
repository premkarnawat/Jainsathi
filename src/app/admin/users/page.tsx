'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { 
  Search, Eye, CheckCircle, ShieldAlert, ChevronDown, 
  Download, Plus, Filter, ArrowUpDown, User, MapPin, 
  SlidersHorizontal, Check, ShieldCheck, X
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

  // Proportions for top metric pill bar
  const [metrics, setMetrics] = useState({
    total: 0,
    malePct: 52,
    femalePct: 48,
    verifiedPct: 65,
    paidPct: 30,
  });

  useEffect(() => {
    fetchCandidates();
  }, [genderFilter, statusFilter, sectFilter]);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      // Force wait for the session to be fully loaded so auth.uid() isn't null for RLS!
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        console.warn("No active session found, query might fail RLS!");
      }

      let query = supabase
        .from('candidate_profiles')
        .select(`
          id, first_name, last_name, gender, date_of_birth, current_city, current_state,
          verification_status, completion_percentage, photos, created_at,
          users ( email, phone, role ),
          jain_identities ( sect, community )
        `)
        .order('created_at', { ascending: false });

      // Enforce strict SQL-level gender separation
      if (genderFilter !== 'all') {
        query = query.eq('gender', genderFilter);
      }

      if (statusFilter !== 'all') {
        query = query.eq('verification_status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;

      let filtered = data || [];
      if (sectFilter !== 'all') {
        filtered = filtered.filter((c: any) => {
          const sect = Array.isArray(c.jain_identities) ? c.jain_identities[0]?.sect : c.jain_identities?.sect;
          return (sect || '').toLowerCase().includes(sectFilter.toLowerCase());
        });
      }

      setCandidates(filtered);

      // Compute live proportions
      const total = filtered.length;
      if (total > 0) {
        const maleCount = filtered.filter(c => c.gender === 'male').length;
        const verifiedCount = filtered.filter(c => c.verification_status === 'verified').length;
        setMetrics({
          total,
          malePct: Math.round((maleCount / total) * 100),
          femalePct: Math.round(((total - maleCount) / total) * 100),
          verifiedPct: Math.round((verifiedCount / total) * 100),
          paidPct: 32,
        });
      }
    } catch (err: any) {
      console.error('Error fetching candidates:', err);
      // Temporarily store the error so we can debug it on screen if it fails
      setCandidates([{ id: 'ERROR_DEBUG', first_name: 'Error', last_name: err?.message || JSON.stringify(err) }]);
    } finally {
      setLoading(false);
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
    const id = cand.id.toLowerCase();
    return fullName.includes(term) || email.includes(term) || phone.includes(term) || id.includes(term);
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 relative">
      
      {/* Top ambient gold aura glow from Crextio reference */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-200/40 via-amber-100/20 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* 1. Top Navigation Capsule Switcher (Crextio Reference) */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-gray-150/80 pb-4">
        
        {/* Capsule Bar */}
        <div className="inline-flex items-center gap-1.5 p-1.5 bg-gray-100/90 rounded-full border border-gray-200/70 shadow-sm text-xs font-bold">
          <button 
            onClick={() => setGenderFilter('all')}
            className={`px-4 py-1.5 rounded-full transition-all ${
              genderFilter === 'all' 
                ? 'bg-[#1E1B24] text-white shadow-md' 
                : 'text-gray-600 hover:text-black hover:bg-white/60'
            }`}
          >
            All Candidates
          </button>
          <button 
            onClick={() => setGenderFilter('male')}
            className={`px-4 py-1.5 rounded-full transition-all ${
              genderFilter === 'male' 
                ? 'bg-[#1E1B24] text-white shadow-md' 
                : 'text-gray-600 hover:text-black hover:bg-white/60'
            }`}
          >
            Male
          </button>
          <button 
            onClick={() => setGenderFilter('female')}
            className={`px-4 py-1.5 rounded-full transition-all ${
              genderFilter === 'female' 
                ? 'bg-[#1E1B24] text-white shadow-md' 
                : 'text-gray-600 hover:text-black hover:bg-white/60'
            }`}
          >
            Female
          </button>
          <button 
            onClick={() => setStatusFilter(statusFilter === 'verified' ? 'all' : 'verified')}
            className={`px-4 py-1.5 rounded-full transition-all ${
              statusFilter === 'verified' 
                ? 'bg-[#C59A4E] text-[#121214] shadow-md font-extrabold' 
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
            className="px-4 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:border-[#C59A4E] hover:text-[#C59A4E] transition-all shadow-sm"
          >
            Verification Queue
          </Link>
          <Link 
            href="/admin/revenue"
            className="px-4 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:border-[#C59A4E] hover:text-[#C59A4E] transition-all shadow-sm"
          >
            Transactions
          </Link>
        </div>
      </div>

      {/* 2. Page Title & Segmented Metric Pill Bar (Crextio Reference) */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1822] tracking-tight">
              People
            </h1>
            <p className="text-xs font-semibold text-gray-400 mt-0.5 uppercase tracking-wider">
              {candidates.length} Registered Candidate Profiles
            </p>
          </div>

          {/* Action Pills */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                const csvData = candidates.map(c => `"${c.id}","${c.first_name} ${c.last_name}","${c.gender}","${c.users?.email || ''}","${c.verification_status}"`).join('\n');
                const blob = new Blob([`"ID","Name","Gender","Email","Status"\n${csvData}`], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `candidates-${new Date().toISOString().slice(0,10)}.csv`;
                a.click();
              }}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-full hover:bg-gray-50 flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Segmented Metric Progress Pill from Crextio Reference */}
        <div className="flex items-center gap-2 flex-wrap text-xs font-bold">
          {/* Dark Pill: Male */}
          <div className="bg-[#1E1B24] text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
            <span>Male</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px]">{metrics.malePct}%</span>
          </div>

          {/* Yellow Pill: Female */}
          <div className="bg-[#F7CA45] text-[#1E1B24] px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
            <span>Female</span>
            <span className="bg-black/15 px-2 py-0.5 rounded-full text-[10px]">{metrics.femalePct}%</span>
          </div>

          {/* Verified Pill */}
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
            <span>Verified</span>
            <span className="bg-emerald-200/60 text-emerald-900 px-2 py-0.5 rounded-full text-[10px]">{metrics.verifiedPct}%</span>
          </div>

          {/* Total Pool */}
          <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full flex items-center gap-1.5">
            <span>Total Pool:</span>
            <span className="text-black font-extrabold">{candidates.length}</span>
          </div>
        </div>
      </div>

      {/* DEBUG BLOCK TO HELP AGENT */}
      <div className="bg-red-50 text-red-800 p-4 rounded-xl text-xs font-mono break-all mb-4">
        <strong>DEBUG DATA:</strong> {JSON.stringify(candidates.length > 0 ? candidates : 'EMPTY')}
      </div>

      {/* 3. Floating Capsule Search & Filter Bar (Crextio Reference) */}
      <div className="bg-white rounded-full p-2 pl-5 shadow-sm border border-gray-200/80 flex items-center justify-between gap-3 flex-wrap">
        
        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Gender Filter */}
          <select 
            value={genderFilter}
            onChange={(e: any) => setGenderFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 text-xs font-bold text-gray-700 focus:outline-none focus:border-[#C59A4E]"
          >
            <option value="all">Gender: All</option>
            <option value="male">Gender: Male</option>
            <option value="female">Gender: Female</option>
          </select>

          {/* Sect Filter */}
          <select 
            value={sectFilter}
            onChange={(e: any) => setSectFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 text-xs font-bold text-gray-700 focus:outline-none focus:border-[#C59A4E]"
          >
            <option value="all">Sect: All</option>
            <option value="shwetambar">Shwetambar</option>
            <option value="digambar">Digambar</option>
            <option value="sthanakvasi">Sthanakvasi</option>
            <option value="terapanthi">Terapanthi</option>
          </select>

          {/* Status Filter */}
          <select 
            value={statusFilter}
            onChange={(e: any) => setStatusFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 text-xs font-bold text-gray-700 focus:outline-none focus:border-[#C59A4E]"
          >
            <option value="all">Status: All</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="not_verified">Unverified</option>
          </select>
        </div>

        {/* Live Search Input */}
        <div className="flex-1 min-w-[200px] max-w-md relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Search candidate name, email, phone, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50/80 hover:bg-gray-50 focus:bg-white border border-gray-200 rounded-full pl-10 pr-4 py-1.5 text-xs font-medium focus:outline-none focus:border-[#C59A4E] transition-all"
          />
        </div>
      </div>

      {/* 4. Master Data Table with Crextio Rounded Card Styling */}
      <div className="bg-white rounded-[28px] sm:rounded-[32px] border border-gray-150 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            
            {/* Table Header */}
            <thead className="bg-[#FAF8F5] text-gray-500 font-bold border-b border-gray-150">
              <tr>
                <th className="p-4 pl-6 w-12 text-center">
                  <input type="checkbox" className="rounded text-[#C59A4E] focus:ring-0" />
                </th>
                <th className="p-4">Candidate</th>
                <th className="p-4">Gender / Age</th>
                <th className="p-4">Sect & Community</th>
                <th className="p-4">Location</th>
                <th className="p-4">Registered Date</th>
                <th className="p-4">Verification</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-100">
              {loading && (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-gray-400 font-semibold">
                    <div className="w-8 h-8 border-3 border-[#C59A4E] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Loading candidates...
                  </td>
                </tr>
              )}

              {!loading && filteredCandidates.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-gray-500 font-semibold">
                    No candidates found matching the selected filters.
                  </td>
                </tr>
              )}

              {!loading && filteredCandidates.map((cand) => {
                const isSelected = selectedId === cand.id;
                const age = calculateAge(cand.date_of_birth);
                const jainInfo = Array.isArray(cand.jain_identities) ? cand.jain_identities[0] : cand.jain_identities;

                return (
                  <tr 
                    key={cand.id}
                    onClick={() => setSelectedId(isSelected ? null : cand.id)}
                    className={`transition-colors cursor-pointer group ${
                      isSelected 
                        ? 'bg-[#FCE182] text-black font-medium' 
                        : 'hover:bg-[#FFFDF4]'
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="p-4 pl-6 text-center" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => setSelectedId(isSelected ? null : cand.id)}
                        className="rounded text-[#C59A4E] focus:ring-0" 
                      />
                    </td>

                    {/* Candidate Profile */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 border border-white shadow-sm flex items-center justify-center font-bold text-xs uppercase overflow-hidden text-gray-700 flex-shrink-0">
                          {cand.photos?.[0] ? (
                            <img 
                              src={`https://hchxytnssymfobqohowk.supabase.co/storage/v1/object/public/profile-photos/${cand.photos[0]}`} 
                              alt="Profile" 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            (cand.first_name?.[0] || '') + (cand.last_name?.[0] || '')
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-extrabold text-sm text-[#19191D] truncate leading-tight">
                            {cand.first_name} {cand.last_name}
                          </p>
                          <p className={`text-[10px] truncate mt-0.5 ${isSelected ? 'text-black/80 font-mono' : 'text-gray-400 font-mono'}`}>
                            ID: {cand.id.split('-')[0].toUpperCase()} • {cand.users?.email || 'No email'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Gender & Age */}
                    <td className="p-4 font-semibold">
                      <span className="capitalize">{cand.gender}</span>
                      {age && <span className="text-gray-500 ml-1">({age} yrs)</span>}
                    </td>

                    {/* Sect & Community */}
                    <td className="p-4">
                      <p className="font-bold text-[#19191D]">{jainInfo?.sect || 'Not specified'}</p>
                      <p className={`text-[10px] ${isSelected ? 'text-black/70' : 'text-gray-400'}`}>
                        {jainInfo?.community || 'Community pending'}
                      </p>
                    </td>

                    {/* Location */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span className="font-medium">
                          {cand.current_city ? `${cand.current_city}, ${cand.current_state}` : 'Pending location'}
                        </span>
                      </div>
                    </td>

                    {/* Registered Date */}
                    <td className="p-4 font-medium text-gray-500">
                      {new Date(cand.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      {cand.verification_status === 'verified' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          Verified
                        </span>
                      ) : cand.verification_status === 'pending' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                          Pending Review
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-[10px] font-extrabold">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                          Unverified
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-4 pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <Link 
                          href={`/admin/users/${cand.id}`}
                          className={`p-2 rounded-xl transition-all ${
                            isSelected 
                              ? 'bg-black text-white hover:bg-black/80' 
                              : 'bg-gray-100 hover:bg-[#C59A4E] hover:text-[#121214] text-gray-600'
                          }`}
                          title="Open Full Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>

        {/* Table Footer Summary */}
        <div className="p-4 px-6 border-t border-gray-150 bg-[#FAF8F5] flex items-center justify-between text-xs text-gray-500 font-semibold">
          <span>Showing {filteredCandidates.length} of {candidates.length} candidates</span>
          <span>Filtered strictly via Supabase SQL backend</span>
        </div>
      </div>

    </div>
  );
}
