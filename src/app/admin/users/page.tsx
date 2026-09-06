'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Search, Filter, MoreVertical, Eye, Ban, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'male' | 'female'>('all');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    
    let query = supabase
      .from('candidate_profiles')
      .select(\
        id, first_name, last_name, gender, current_city, current_state, verification_status, created_at,
        users ( email, phone )
      \)
      .order('created_at', { ascending: false })
      .limit(50);
      
    if (activeTab !== 'all') {
      query = query.eq('gender', activeTab);
    }
    
    const { data, error } = await query;
    if (data) setUsers(data);
    setLoading(false);
  };

  const filteredUsers = users.filter(u => {
    const term = search.toLowerCase();
    const name = \\ \\.toLowerCase();
    return name.includes(term) || u.users?.email?.toLowerCase().includes(term) || u.users?.phone?.includes(term);
  });

  return (
    <div className="p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#241A20]">People Directory</h1>
          <p className="text-sm font-semibold text-[#75666D] mt-1">Manage and monitor all registered candidates.</p>
        </div>
      </div>

      {/* Controls: Tabs & Search */}
      <div className="flex flex-col md:flex-row justify-between gap-4 items-center bg-[#FDF9F4] p-3 rounded-2xl border border-[#EBD9DC] shadow-sm">
        
        {/* Tabs */}
        <div className="flex bg-white rounded-xl p-1 shadow-sm border border-[#EBD9DC]">
          <button 
            onClick={() => setActiveTab('all')}
            className={\px-6 py-2 rounded-lg text-sm font-bold transition-colors \\}
          >
            All Candidates
          </button>
          <button 
            onClick={() => setActiveTab('male')}
            className={\px-6 py-2 rounded-lg text-sm font-bold transition-colors \\}
          >
            Male
          </button>
          <button 
            onClick={() => setActiveTab('female')}
            className={\px-6 py-2 rounded-lg text-sm font-bold transition-colors \\}
          >
            Female
          </button>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name, email, or phone..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EBD9DC] bg-white text-sm focus:outline-none focus:border-[#C99A3D] transition-colors shadow-sm"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-[#EBD9DC] rounded-[24px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-[#8F0038] uppercase font-bold text-[10px] tracking-wider border-b border-[#EBD9DC]">
              <tr>
                <th className="p-4 pl-6">Candidate Profile</th>
                <th className="p-4">Gender</th>
                <th className="p-4">Location</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBD9DC]/50">
              {loading && <tr><td colSpan={6} className="p-8 text-center text-gray-500 font-semibold">Loading candidates...</td></tr>}
              {!loading && filteredUsers.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-500 font-semibold">No candidates found matching your criteria.</td></tr>}
              
              {!loading && filteredUsers.map((user, idx) => (
                <tr key={user.id} className="hover:bg-[#FDF9F4] transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#EBD9DC] flex items-center justify-center font-bold text-[#8F0038]">
                        {(user.first_name?.[0] || '') + (user.last_name?.[0] || '')}
                      </div>
                      <div>
                        <p className="font-bold text-[#241A20]">{user.first_name} {user.last_name}</p>
                        <p className="text-[10px] text-[#75666D] font-mono mt-0.5">ID: {user.id.split('-')[0]}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-[#75666D] capitalize font-medium">{user.gender || 'N/A'}</td>
                  <td className="p-4 text-[#75666D] font-medium">{user.current_city ? \\, \\ : 'Not specified'}</td>
                  <td className="p-4">
                    <p className="text-xs font-semibold text-[#241A20]">{user.users?.phone || 'No phone'}</p>
                    <p className="text-[10px] text-[#75666D] truncate max-w-[150px]">{user.users?.email || 'No email'}</p>
                  </td>
                  <td className="p-4">
                    {user.verification_status === 'verified' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                        <CheckCircle className="w-3 h-3" /> Verified
                      </span>
                    ) : user.verification_status === 'pending' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold">
                        Pending
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold">
                        Unverified
                      </span>
                    )}
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link 
                        href={\/admin/users/\\}
                        className="p-2 text-gray-400 hover:text-[#8F0038] hover:bg-[#F7E5EA] rounded-lg transition-colors"
                        title="View Full Profile"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                    </div>
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
