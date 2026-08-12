import React from 'react';
import { ShieldCheck, CheckCircle } from 'lucide-react';

interface VerificationBadgeProps {
  status: 'verified' | 'pending' | 'not_verified' | 'rejected';
  type?: 'identity' | 'jain' | 'all';
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  status = 'verified',
  type = 'identity',
}) => {
  if (status !== 'verified') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
        Pending Verification
      </span>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5">
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#3E8B68]/10 text-[#3E8B68] border border-[#3E8B68]/30">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Verified Profile</span>
      </span>
      {type === 'all' && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#D6A24A]/15 text-[#6E1231] border border-[#D6A24A]/40">
          <CheckCircle className="w-3.5 h-3.5 text-[#D6A24A]" />
          <span>Jain Identity Verified</span>
        </span>
      )}
    </div>
  );
};
