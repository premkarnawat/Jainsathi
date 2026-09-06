'use client';

import React from 'react';
import { Activity } from 'lucide-react';

export default function AdminLogsPage() {
  return (
    <div className="p-8 space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#241A20]">Audit Logs</h1>
          <p className="text-sm font-semibold text-[#75666D] mt-1">Review system activity and administrative actions.</p>
        </div>
      </div>

      <div className="bg-[#FFFDFB] border border-[#EBD9DC] rounded-[24px] shadow-sm p-8 text-center max-w-2xl mx-auto mt-10">
        <Activity className="w-16 h-16 text-[#C99A3D] mx-auto mb-4" />
        <h2 className="text-xl font-bold text-[#241A20] mb-2">Audit Logs Module Pending</h2>
        <p className="text-[#75666D]">
          Future updates will include tracking for all admin actions, data access patterns, and critical security events across the platform.
        </p>
      </div>
    </div>
  );
}
