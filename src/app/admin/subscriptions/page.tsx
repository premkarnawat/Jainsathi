'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { CreditCard, CheckCircle, Clock, Search, Download, AlertCircle } from 'lucide-react';

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchSubscriptions();
  }, [statusFilter]);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('subscriptions')
        .select(`
          id, plan_id, status, starts_at, expires_at, created_at,
          users ( email, phone ),
          plans ( code, name, price_inr, duration_days )
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setSubscriptions(data || []);
    } catch (err) {
      console.error('Failed to load subscriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeCount = subscriptions.filter(s => s.status === 'active').length;
  const expiredCount = subscriptions.filter(s => s.status === 'expired').length;

  const filteredSubs = subscriptions.filter((s) => {
    const term = searchQuery.toLowerCase();
    const email = (s.users?.email || '').toLowerCase();
    const phone = (s.users?.phone || '').toLowerCase();
    const planName = (s.plans?.name || '').toLowerCase();
    return email.includes(term) || phone.includes(term) || planName.includes(term);
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1A1822] tracking-tight">
            Subscriptions & Memberships
          </h1>
          <p className="text-xs font-semibold text-gray-400 mt-0.5 uppercase tracking-wider">
            Manage Active Plans, Renewals & Expirations
          </p>
        </div>

        <button 
          onClick={() => {
            const csv = subscriptions.map(s => `"${s.id}","${s.users?.email || ''}","${s.plans?.name || s.plan_id}","${s.status}","${s.starts_at}","${s.expires_at || ''}"`).join('\n');
            const blob = new Blob([`"Subscription ID","User","Plan","Status","Start Date","Expiry Date"\n${csv}`], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `subscriptions-${new Date().toISOString().slice(0,10)}.csv`;
            a.click();
          }}
          className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-full hover:bg-gray-50 flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Subscriptions</span>
        </button>
      </div>

      {/* Metric Cards (PBD Aesthetic) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-150 rounded-[22px] p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-[#1A1822]">{subscriptions.length}</p>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-0.5">Total Subscriptions</p>
          </div>
        </div>

        <div className="bg-white border border-gray-150 rounded-[22px] p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-[#1A1822]">{activeCount}</p>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-0.5">Active Paid Users</p>
          </div>
        </div>

        <div className="bg-white border border-gray-150 rounded-[22px] p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-600 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-[#1A1822]">{expiredCount}</p>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-0.5">Expired Plans</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-full p-2 pl-5 shadow-sm border border-gray-200 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 text-xs font-bold text-gray-700 focus:outline-none focus:border-[#C59A4E]"
          >
            <option value="all">Status: All</option>
            <option value="active">Active Only</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Search subscriber email, phone, or plan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-full pl-10 pr-4 py-1.5 text-xs font-medium focus:outline-none focus:border-[#C59A4E]"
          />
        </div>
      </div>

      {/* Master Subscriptions Table */}
      <div className="bg-white rounded-[28px] sm:rounded-[32px] border border-gray-150 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-[#FAF8F5] text-gray-500 font-bold border-b border-gray-150">
              <tr>
                <th className="p-4 pl-6">Subscription ID</th>
                <th className="p-4">Subscriber</th>
                <th className="p-4">Plan Name</th>
                <th className="p-4">Status</th>
                <th className="p-4">Start Date</th>
                <th className="p-4 pr-6">Expiry Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-400 font-semibold">
                    <div className="w-8 h-8 border-3 border-[#C59A4E] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Loading subscriptions...
                  </td>
                </tr>
              )}

              {!loading && filteredSubs.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-500 font-semibold">
                    No subscriptions found.
                  </td>
                </tr>
              )}

              {!loading && filteredSubs.map((sub) => (
                <tr key={sub.id} className="hover:bg-[#FFFDF4] transition-colors">
                  <td className="p-4 pl-6 font-mono font-bold text-xs text-[#1A1822]">
                    SUB-{sub.id.split('-')[0].toUpperCase()}
                  </td>

                  <td className="p-4">
                    <p className="font-bold text-[#1A1822]">{sub.users?.email || 'Unknown User'}</p>
                    <p className="text-[10px] text-gray-400">{sub.users?.phone || 'No phone'}</p>
                  </td>

                  <td className="p-4 font-semibold text-gray-800">
                    {sub.plans?.name || `Plan #${sub.plan_id}`}
                  </td>

                  <td className="p-4">
                    {sub.status === 'active' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-[10px] font-extrabold">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                        {sub.status}
                      </span>
                    )}
                  </td>

                  <td className="p-4 font-medium text-gray-500">
                    {new Date(sub.starts_at || sub.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>

                  <td className="p-4 pr-6 font-medium text-gray-500">
                    {sub.expires_at 
                      ? new Date(sub.expires_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                      : 'Lifetime / Open'}
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
