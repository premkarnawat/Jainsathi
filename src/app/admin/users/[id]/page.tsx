'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { 
  ArrowLeft, User, ShieldCheck, MapPin, Briefcase, 
  GraduationCap, Heart, Users, FileText, CheckCircle, 
  XCircle, AlertTriangle, Download, Phone, Mail, 
  Calendar, Clock, ShieldAlert, Sparkles, Ban
} from 'lucide-react';

export default function AdminCandidateProfileView() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Block modal state
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [blockReason, setBlockReason] = useState('');

  useEffect(() => {
    fetchCompleteProfile();
  }, [id]);

  const fetchCompleteProfile = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('candidate_profiles')
        .select(`
          *,
          users ( id, email, phone, role, created_at ),
          jain_identities (*),
          lifestyle_profiles (*),
          education_records (*),
          employment_records (*),
          family_members (*),
          partner_preferences (*),
          biodatas (*),
          photos (*),
          subscriptions (*),
          identity_verifications (*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err: any) {
      setError(err.message || 'Profile could not be loaded.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (status: 'verified' | 'rejected') => {
    if (!confirm(`Are you sure you want to mark this candidate as ${status}?`)) return;
    setActionLoading(true);
    try {
      await supabase
        .from('candidate_profiles')
        .update({ verification_status: status })
        .eq('id', id);

      // Update any pending verification records
      await supabase
        .from('identity_verifications')
        .update({ status: status === 'verified' ? 'approved' : 'rejected' })
        .eq('candidate_id', id);

      fetchCompleteProfile();
    } catch (err: any) {
      alert('Action failed: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleBlock = async () => {
    setActionLoading(true);
    try {
      const newActiveState = !profile.is_active;
      await supabase
        .from('candidate_profiles')
        .update({ is_active: newActiveState })
        .eq('id', id);

      setIsBlockModalOpen(false);
      fetchCompleteProfile();
    } catch (err: any) {
      alert('Block action failed: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center min-h-[500px]">
        <div className="w-12 h-12 border-4 border-[#C59A4E] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-semibold text-gray-500 text-sm">Loading complete candidate record...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-12 text-center max-w-lg mx-auto">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Profile Not Found</h2>
        <p className="text-gray-500 mt-2">{error || 'This candidate does not exist.'}</p>
        <Link 
          href="/admin/users" 
          className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1E1B24] text-white font-bold text-xs shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Candidates Directory
        </Link>
      </div>
    );
  }

  const getSingle = (rel: any) => (Array.isArray(rel) ? rel[0] : rel) || {};
  const jain = getSingle(profile.jain_identities);
  const lifestyle = getSingle(profile.lifestyle_profiles);
  const preferences = getSingle(profile.partner_preferences);
  const biodata = getSingle(profile.biodatas);
  const activeSub = getSingle(profile.subscriptions);

  const eduRecords = Array.isArray(profile.education_records) ? profile.education_records : (profile.education_records ? [profile.education_records] : []);
  const empRecords = Array.isArray(profile.employment_records) ? profile.employment_records : (profile.employment_records ? [profile.employment_records] : []);
  const famRecords = Array.isArray(profile.family_members) ? profile.family_members : (profile.family_members ? [profile.family_members] : []);
  const photoRecords = Array.isArray(profile.photos) ? profile.photos : (profile.photos ? [profile.photos] : []);

  const calculateAge = (dobString?: string) => {
    if (!dobString) return null;
    const dob = new Date(dobString);
    const diffMs = Date.now() - dob.getTime();
    const ageDt = new Date(diffMs);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  };

  const age = calculateAge(profile.date_of_birth);

  const SectionCard = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
    <div className="bg-white rounded-[24px] border border-gray-150 shadow-sm p-6 space-y-4">
      <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
        <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#C59A4E] flex items-center justify-center">
          <Icon className="w-4 h-4" />
        </div>
        <h3 className="font-extrabold text-base text-[#1A1822] tracking-tight">{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );

  const DataRow = ({ label, value }: { label: string; value: any }) => (
    <div className="py-2.5 flex flex-col sm:flex-row sm:items-start justify-between border-b border-gray-50 last:border-0 gap-1">
      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider w-full sm:w-1/3">{label}</span>
      <span className="text-sm font-semibold text-gray-800 flex-1">{value || '—'}</span>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link 
            href="/admin/users" 
            className="p-2.5 rounded-2xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1822] tracking-tight">
                {profile.first_name} {profile.last_name}
              </h1>
              {profile.verification_status === 'verified' && (
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              )}
            </div>
            <p className="text-xs font-mono text-gray-400 mt-0.5">
              Matrimonial Profile ID: <strong className="text-gray-700">{profile.id}</strong>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {profile.verification_status !== 'verified' ? (
            <button 
              onClick={() => handleVerify('verified')}
              disabled={actionLoading}
              className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              Approve Verification
            </button>
          ) : (
            <button 
              onClick={() => handleVerify('rejected')}
              disabled={actionLoading}
              className="px-4 py-2 rounded-full bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-700 font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <XCircle className="w-4 h-4" />
              Revoke Verification
            </button>
          )}

          <button 
            onClick={() => setIsBlockModalOpen(true)}
            className={`px-4 py-2 rounded-full font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all ${
              profile.is_active === false 
                ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                : 'bg-red-50 text-red-600 hover:bg-red-100'
            }`}
          >
            <Ban className="w-4 h-4" />
            {profile.is_active === false ? 'Unblock Candidate' : 'Block Candidate'}
          </button>
        </div>
      </div>

      {/* Main Grid: Left Profile Card (4 cols) + Right Relational Details (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Quick Profile Card */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white rounded-[28px] border border-gray-150 shadow-sm p-6 flex flex-col items-center text-center">
            <div className="w-28 h-28 rounded-full bg-gray-100 border-4 border-white shadow-lg overflow-hidden mb-4 relative">
              {profile.photos?.[0] ? (
                <img 
                  src={`https://hchxytnssymfobqohowk.supabase.co/storage/v1/object/public/profile-photos/${profile.photos[0]}`} 
                  alt="Candidate" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <User className="w-12 h-12 text-gray-300 m-auto mt-6" />
              )}
            </div>

            <h2 className="text-xl font-extrabold text-[#1A1822]">{profile.first_name} {profile.last_name}</h2>
            <p className="text-xs font-bold text-[#C59A4E] uppercase tracking-wider mt-0.5">
              {profile.gender} {age ? `• ${age} years` : ''}
            </p>

            {/* Badges */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                profile.verification_status === 'verified'
                  ? 'bg-emerald-100 text-emerald-800'
                  : profile.verification_status === 'pending'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {profile.verification_status?.toUpperCase()}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#1E1B24] text-white text-xs font-extrabold">
                {profile.completion_percentage || 0}% Complete
              </span>
              {profile.is_active === false && (
                <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-extrabold">
                  Blocked
                </span>
              )}
            </div>

            {/* Contact & Account Info */}
            <div className="w-full mt-6 pt-6 border-t border-gray-100 text-left space-y-3">
              <DataRow label="Phone" value={profile.users?.phone} />
              <DataRow label="Email" value={profile.users?.email} />
              <DataRow label="City / State" value={`${profile.current_city || '—'}, ${profile.current_state || '—'}`} />
              <DataRow label="Native Place" value={profile.native_city ? `${profile.native_city}, ${profile.native_state}` : '—'} />
              <DataRow label="Registered" value={new Date(profile.created_at).toLocaleDateString()} />
            </div>
          </div>

          {/* Jain Identity Card */}
          <SectionCard title="Jain Identity & Sect" icon={Sparkles}>
            <DataRow label="Sect" value={jain.sect} />
            <DataRow label="Community" value={jain.community} />
            <DataRow label="Sub Community" value={jain.sub_community} />
            <DataRow label="Self Gotra" value={jain.self_saka || jain.saka_gotra} />
            <DataRow label="Mama Gotra" value={jain.mamasa_saka} />
            <DataRow label="Dadi Gotra" value={jain.dadisa_saka} />
            <DataRow label="Nani Gotra" value={jain.nanisa_saka} />
          </SectionCard>

          {/* Lifestyle & Food Card */}
          <SectionCard title="Lifestyle & Dietary Habits" icon={Heart}>
            <DataRow label="Diet Preference" value={lifestyle.diet?.replace('_', ' ').toUpperCase()} />
            <DataRow label="Manglik Status" value={lifestyle.manglik_status?.replace('_', ' ').toUpperCase()} />
            <DataRow label="Smoking" value={lifestyle.smoking ? 'Yes' : 'No'} />
            <DataRow label="Alcohol" value={lifestyle.alcohol ? 'Yes' : 'No'} />
            <DataRow label="Rashi" value={lifestyle.rashi} />
            <DataRow label="Nakshatra" value={lifestyle.nakshatra} />
          </SectionCard>

        </div>

        {/* Right Column: Detailed Sections (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Personal Details */}
          <SectionCard title="Personal & Astrological Details" icon={User}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
              <DataRow label="Date of Birth" value={profile.date_of_birth} />
              <DataRow label="Birth Time" value={profile.birth_time} />
              <DataRow label="Birth Place" value={profile.birth_place} />
              <DataRow label="Marital Status" value={profile.marital_status?.replace('_', ' ').toUpperCase()} />
              <DataRow label="Height" value={profile.height_cm ? `${profile.height_cm} cm` : '—'} />
              <DataRow label="Weight" value={profile.weight_kg ? `${profile.weight_kg} kg` : '—'} />
              <DataRow label="Mother Tongue" value={profile.mother_tongue} />
              <DataRow label="Languages" value={profile.languages_known?.join(', ')} />
            </div>
          </SectionCard>

          {/* Education & Career Records */}
          <SectionCard title="Education & Qualifications" icon={GraduationCap}>
            {eduRecords.length === 0 ? (
              <p className="text-xs text-gray-400 italic py-2">No education records provided.</p>
            ) : (
              <div className="space-y-3">
                {eduRecords.map((edu: any) => (
                  <div key={edu.id} className="bg-gray-50/80 p-3.5 rounded-2xl border border-gray-150">
                    <p className="font-extrabold text-sm text-[#1A1822]">
                      {edu.degree_name || edu.degree} {edu.specialization ? `in ${edu.specialization}` : ''}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {edu.institution || edu.university} • Year: {edu.passout_year || '—'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard title="Employment & Career Information" icon={Briefcase}>
            {empRecords.length === 0 ? (
              <p className="text-xs text-gray-400 italic py-2">No employment records provided.</p>
            ) : (
              <div className="space-y-3">
                {empRecords.map((emp: any) => (
                  <div key={emp.id} className="bg-gray-50/80 p-3.5 rounded-2xl border border-gray-150">
                    <p className="font-extrabold text-sm text-[#1A1822]">
                      {emp.designation} at {emp.company_name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Type: {emp.employment_type} • Annual Income: {emp.annual_income_lakhs ? `₹${emp.annual_income_lakhs} Lakhs` : 'Undisclosed'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          {/* Family Details */}
          <SectionCard title="Family Structure & Members" icon={Users}>
            {famRecords.length === 0 ? (
              <p className="text-xs text-gray-400 italic py-2">No family members registered.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {famRecords.map((fam: any) => (
                  <div key={fam.id} className="bg-gray-50/80 p-3.5 rounded-2xl border border-gray-150">
                    <span className="text-[10px] font-black uppercase text-[#C59A4E] tracking-wider block">
                      {fam.relation_type}
                    </span>
                    <p className="font-bold text-sm text-[#1A1822] mt-0.5">{fam.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {fam.occupation || 'Occupation pending'} {fam.city ? `• ${fam.city}` : ''}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          {/* Partner Preferences */}
          <SectionCard title="Partner Preferences" icon={Heart}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
              <DataRow label="Age Range" value={`${preferences.min_age || 18} - ${preferences.max_age || 70} years`} />
              <DataRow label="Height Range" value={`${preferences.min_height_cm || 140} - ${preferences.max_height_cm || 210} cm`} />
              <DataRow label="Allowed Marital" value={preferences.allowed_marital_statuses?.join(', ')} />
              <DataRow label="Preferred Diet" value={preferences.preferred_diet?.replace('_', ' ').toUpperCase()} />
              <DataRow label="Preferred Sects" value={preferences.preferred_sects?.join(', ')} />
              <DataRow label="Preferred Cities" value={preferences.preferred_cities?.join(', ')} />
            </div>
          </SectionCard>

          {/* Uploaded Biodata */}
          <SectionCard title="Biodata PDF & Documents" icon={FileText}>
            {biodata?.file_path ? (
              <div className="flex items-center justify-between p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80">
                <div>
                  <p className="font-bold text-sm text-[#1A1822]">Candidate Biodata PDF</p>
                  <p className="text-xs text-gray-500">Stored in Supabase Secure Storage</p>
                </div>
                <a 
                  href={`https://hchxytnssymfobqohowk.supabase.co/storage/v1/object/public/biodatas/${biodata.file_path}`} 
                  target="_blank"
                  className="px-5 py-2 rounded-full bg-[#1E1B24] text-white font-bold text-xs flex items-center gap-1.5 shadow-md hover:bg-black transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  View / Download PDF
                </a>
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic py-2">No biodata PDF uploaded.</p>
            )}
          </SectionCard>

        </div>

      </div>

      {/* Block Confirmation Modal */}
      {isBlockModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[28px] max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900">
                {profile.is_active === false ? 'Unblock Candidate' : 'Block Candidate'}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {profile.is_active === false
                  ? 'Candidate will regain full access to discoverability and logins.'
                  : 'Blocked candidates will immediately be prevented from logging in or appearing in search results.'}
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setIsBlockModalOpen(false)}
                className="flex-1 py-2.5 rounded-full border border-gray-200 font-bold text-xs text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleToggleBlock}
                className="flex-1 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md"
              >
                Confirm {profile.is_active === false ? 'Unblock' : 'Block'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
