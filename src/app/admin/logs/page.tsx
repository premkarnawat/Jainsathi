'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Activity, ShieldCheck, UserCheck, Ban, Clock, Search, Shield } from 'lucide-react';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setLogs(data || []);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    const term = searchQuery.toLowerCase();
    const action = (log.action || '').toLowerCase();
    const table = (log.target_table || '').toLowerCase();
    return action.includes(term) || table.includes(term);
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#1A1822] tracking-tight">
          System Activity & Audit Logs
        </h1>
        <p className="text-xs font-semibold text-gray-400 mt-0.5 uppercase tracking-wider">
          Immutable Record of Administrative and Critical Security Events
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-full p-2 pl-5 shadow-sm border border-gray-200 max-w-md relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input 
          type="text"
          placeholder="Search by action, target table, or event..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-full pl-10 pr-4 py-1.5 text-xs font-medium focus:outline-none focus:border-[#C59A4E]"
        />
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-[28px] sm:rounded-[32px] border border-gray-150 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-[#FAF8F5] text-gray-500 font-bold border-b border-gray-150">
              <tr>
                <th className="p-4 pl-6">Timestamp</th>
                <th className="p-4">Action</th>
                <th className="p-4">Target Entity</th>
                <th className="p-4">Target ID</th>
                <th className="p-4 pr-6">Details / Event Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-400 font-semibold">
                    <div className="w-8 h-8 border-3 border-[#C59A4E] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Loading system audit trail...
                  </td>
                </tr>
              )}

              {!loading && filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-500 font-semibold">
                    No audit records recorded yet. All administrative actions are automatically monitored.
                  </td>
                </tr>
              )}

              {!loading && filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#FFFDF4] transition-colors">
                  <td className="p-4 pl-6 font-mono text-gray-500 font-medium">
                    {new Date(log.created_at).toLocaleString('en-GB', {
                      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
                    })}
                  </td>

                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-[#9A6520] font-extrabold text-[10px] uppercase border border-amber-200/60">
                      <Shield className="w-3 h-3" />
                      {log.action}
                    </span>
                  </td>

                  <td className="p-4 font-bold text-[#1A1822] capitalize">
                    {log.target_table || 'System Core'}
                  </td>

                  <td className="p-4 font-mono text-xs text-gray-500">
                    {log.target_id ? log.target_id.split('-')[0].toUpperCase() : '—'}
                  </td>

                  <td className="p-4 pr-6 font-mono text-[11px] text-gray-600 truncate max-w-xs">
                    {JSON.stringify(log.details) || '{}'}
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
