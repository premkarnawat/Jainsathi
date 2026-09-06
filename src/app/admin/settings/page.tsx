'use client';

import React from 'react';
import { Settings, Save } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="p-8 space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#241A20]">Platform Settings</h1>
          <p className="text-sm font-semibold text-[#75666D] mt-1">Configure global platform rules and content.</p>
        </div>
      </div>

      <div className="bg-[#FFFDFB] border border-[#EBD9DC] rounded-[24px] shadow-sm p-8 text-center max-w-2xl mx-auto mt-10">
        <Settings className="w-16 h-16 text-[#C99A3D] mx-auto mb-4" />
        <h2 className="text-xl font-bold text-[#241A20] mb-2">Settings Module Pending Implementation</h2>
        <p className="text-[#75666D] mb-6">
          This area will allow you to edit Landing Page content, Privacy Policies, Terms & Conditions, and Pricing Plans.
        </p>
        <button disabled className="bg-gray-200 text-gray-500 font-bold py-3 px-8 rounded-xl flex items-center gap-2 mx-auto cursor-not-allowed">
          <Save className="w-5 h-5" />
          Save Configuration
        </button>
      </div>
    </div>
  );
}
