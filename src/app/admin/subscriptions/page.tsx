'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { CreditCard, CheckCircle, Clock } from 'lucide-react';

export default function AdminSubscriptionsPage() {
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubs();
  }, []);

  const fetchSubs = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('subscriptions')
      .select(\
        *,
        users ( email, phone )
      \)
      .order('created_at', { ascending: false })
      .limit(100);
      
    if (data) setSubs(data);
    setLoading(false);
  };

  const activeSubsCount = subs.filter(s => s.status === 'active').length;

  return (
    <div className="p-8 space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#241A20]">Subscriptions</h1>
          <p className="text-sm font-semibold text-[#75666D] mt-1">Manage user subscription plans.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#FFFDFB] border border-[#EBD9DC] p-6 rounded-[24px] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#75666D] uppercase tracking-wider">Active Subscriptions</p>
            <p className="text-3xl font-serif font-bold text-[#241A20]">{activeSubsCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#EBD9DC] rounded-[24px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-[#8F0038] uppercase font-bold text-[10px] tracking-wider border-b border-[#EBD9DC]">
              <tr>
                <th className="p-4 pl-6">Subscription ID</th>
                <th className="p-4">User</th>
                <th className="p-4">Plan ID</th>
                <th className="p-4">Status</th>
                <th className="p-4">Starts</th>
                <th className="p-4">Ends</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBD9DC]/50">
              {loading && <tr><td colSpan={6} className="p-8 text-center text-gray-500 font-semibold">Loading subscriptions...</td></tr>}
              {!loading && subs.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-500 font-semibold">No subscriptions found.</td></tr>}
              
              {!loading && subs.map((sub) => (
                <tr key={sub.id} className="hover:bg-[#FDF9F4] transition-colors">
                  <td className="p-4 pl-6">
                    <p className="font-mono text-xs text-[#241A20]">{sub.id.split('-')[0]}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-[#241A20]">{sub.users?.email}</p>
                    <p className="text-[10px] text-[#75666D]">{sub.users?.phone}</p>
                  </td>
                  <td className="p-4 font-bold text-[#241A20]">
                    Plan #{sub.plan_id}
                  </td>
                  <td className="p-4">
                    {sub.status === 'active' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                        <CheckCircle className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold">
                        <Clock className="w-3 h-3" /> {sub.status}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-[#75666D] font-medium text-xs">
                    {new Date(sub.start_date).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-[#75666D] font-medium text-xs">
                    {new Date(sub.end_date).toLocaleDateString()}
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
