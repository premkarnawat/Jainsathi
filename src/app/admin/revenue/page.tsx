'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { 
  Receipt, TrendingUp, CheckCircle, XCircle, Clock, 
  Search, Download, ArrowUpRight, DollarSign, CreditCard
} from 'lucide-react';

export default function AdminRevenuePage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchPayments();
  }, [statusFilter]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('payments')
        .select(`
          id, amount_inr, currency, status, provider, provider_payment_id, created_at, plan_id,
          users ( email, phone )
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setPayments(data || []);
    } catch (err) {
      console.error('Failed to load revenue:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = payments
    .filter(p => p.status === 'success')
    .reduce((sum, p) => sum + (Number(p.amount_inr) || 0), 0);

  const successfulCount = payments.filter(p => p.status === 'success').length;
  const pendingCount = payments.filter(p => p.status === 'pending').length;

  const filteredPayments = payments.filter((p) => {
    const term = searchQuery.toLowerCase();
    const email = (p.users?.email || '').toLowerCase();
    const phone = (p.users?.phone || '').toLowerCase();
    const id = (p.provider_payment_id || p.id || '').toLowerCase();
    return email.includes(term) || phone.includes(term) || id.includes(term);
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1A1822] tracking-tight">
            Revenue & Transactions
          </h1>
          <p className="text-xs font-semibold text-gray-400 mt-0.5 uppercase tracking-wider">
            Real-time Payment Tracking & Financial Reconciliation
          </p>
        </div>

        {/* Action button */}
        <button 
          onClick={() => {
            const csv = payments.map(p => `"${p.id}","${p.users?.email || ''}","${p.amount_inr}","${p.status}","${p.created_at}"`).join('\n');
            const blob = new Blob([`"Payment ID","User","Amount INR","Status","Date"\n${csv}`], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `revenue-${new Date().toISOString().slice(0,10)}.csv`;
            a.click();
          }}
          className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-full hover:bg-gray-50 flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Financial Report</span>
        </button>
      </div>

      {/* Floating Metric Cards (PBD Aesthetic) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-150 rounded-[22px] p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-[#1A1822]">₹{totalRevenue.toLocaleString()}</p>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-0.5">Total Success Revenue</p>
          </div>
        </div>

        <div className="bg-white border border-gray-150 rounded-[22px] p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-[#1A1822]">{successfulCount}</p>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-0.5">Paid Orders</p>
          </div>
        </div>

        <div className="bg-white border border-gray-150 rounded-[22px] p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-[#1A1822]">{pendingCount}</p>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-0.5">Pending Orders</p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar (Crextio Aesthetic) */}
      <div className="bg-white rounded-full p-2 pl-5 shadow-sm border border-gray-200 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 text-xs font-bold text-gray-700 focus:outline-none focus:border-[#C59A4E]"
          >
            <option value="all">Status: All</option>
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by payment ID, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-full pl-10 pr-4 py-1.5 text-xs font-medium focus:outline-none focus:border-[#C59A4E]"
          />
        </div>
      </div>

      {/* Master Transactions Table (Crextio Aesthetic) */}
      <div className="bg-white rounded-[28px] sm:rounded-[32px] border border-gray-150 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-[#FAF8F5] text-gray-500 font-bold border-b border-gray-150">
              <tr>
                <th className="p-4 pl-6">Transaction ID</th>
                <th className="p-4">Customer Account</th>
                <th className="p-4">Plan</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-400 font-semibold">
                    <div className="w-8 h-8 border-3 border-[#C59A4E] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Loading transactions...
                  </td>
                </tr>
              )}

              {!loading && filteredPayments.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-500 font-semibold">
                    No transactions found.
                  </td>
                </tr>
              )}

              {!loading && filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-[#FFFDF4] transition-colors">
                  <td className="p-4 pl-6">
                    <p className="font-mono font-bold text-xs text-[#1A1822]">
                      {payment.provider_payment_id || payment.id.split('-')[0].toUpperCase()}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">
                      {payment.provider || 'Razorpay'}
                    </p>
                  </td>

                  <td className="p-4">
                    <p className="font-bold text-[#1A1822]">{payment.users?.email || 'Unknown User'}</p>
                    <p className="text-[10px] text-gray-400">{payment.users?.phone || 'No phone'}</p>
                  </td>

                  <td className="p-4 font-semibold text-gray-700">
                    Plan #{payment.plan_id || 'Standard'}
                  </td>

                  <td className="p-4 font-extrabold text-sm text-[#1A1822]">
                    ₹{payment.amount_inr}
                  </td>

                  <td className="p-4">
                    {payment.status === 'success' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        Success
                      </span>
                    ) : payment.status === 'pending' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                        Pending
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 text-[10px] font-extrabold">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                        Failed
                      </span>
                    )}
                  </td>

                  <td className="p-4 pr-6 text-gray-500 font-medium">
                    {new Date(payment.created_at).toLocaleString('en-GB', { 
                      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                    })}
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
