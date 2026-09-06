'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Receipt, TrendingUp, CheckCircle, XCircle } from 'lucide-react';

export default function AdminRevenuePage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('payments')
      .select(`
        *,
        users ( email, phone )
      `)
      .order('created_at', { ascending: false })
      .limit(100);
      
    if (data) setPayments(data);
    setLoading(false);
  };

  const totalRevenue = payments.filter(p => p.status === 'success').reduce((sum, p) => sum + (p.amount_inr || 0), 0);

  return (
    <div className="p-8 space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#241A20]">Revenue Management</h1>
          <p className="text-sm font-semibold text-[#75666D] mt-1">Track all platform transactions and income.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#FFFDFB] border border-[#EBD9DC] p-6 rounded-[24px] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#75666D] uppercase tracking-wider">Total Revenue</p>
            <p className="text-3xl font-serif font-bold text-[#241A20]">₹{totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#EBD9DC] rounded-[24px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-[#8F0038] uppercase font-bold text-[10px] tracking-wider border-b border-[#EBD9DC]">
              <tr>
                <th className="p-4 pl-6">Transaction ID</th>
                <th className="p-4">User</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBD9DC]/50">
              {loading && <tr><td colSpan={5} className="p-8 text-center text-gray-500 font-semibold">Loading transactions...</td></tr>}
              {!loading && payments.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-500 font-semibold">No transactions found.</td></tr>}
              
              {!loading && payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-[#FDF9F4] transition-colors">
                  <td className="p-4 pl-6">
                    <p className="font-mono text-xs text-[#241A20]">{payment.provider_payment_id || payment.id}</p>
                    <p className="text-[10px] text-[#75666D] mt-0.5">{payment.provider}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-[#241A20]">{payment.users?.email}</p>
                    <p className="text-[10px] text-[#75666D]">{payment.users?.phone}</p>
                  </td>
                  <td className="p-4 font-bold text-[#241A20]">
                    ₹{payment.amount_inr}
                  </td>
                  <td className="p-4">
                    {payment.status === 'success' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                        <CheckCircle className="w-3 h-3" /> Success
                      </span>
                    ) : payment.status === 'failed' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">
                        <XCircle className="w-3 h-3" /> Failed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold">
                        {payment.status}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-[#75666D] font-medium text-xs">
                    {new Date(payment.created_at).toLocaleString()}
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
