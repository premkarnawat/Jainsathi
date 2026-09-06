'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { ArrowLeft, User, ShieldCheck, MapPin, Briefcase, GraduationCap, Heart, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function AdminUserProfileView() {
  const params = useParams();
  const id = params.id as string;
  
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('candidate_profiles')
        .select(`
          *,
          users ( email, phone, role, created_at ),
          personal_details (*),
          jain_identities (*),
          education_records (*),
          employment_records (*),
          family_members (*),
          lifestyle_profiles (*),
          partner_preferences (*),
          biodatas (*)
        `)
        .eq('id', id)
        .single();
        
      if (error) throw error;
      setProfile(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-12 flex justify-center"><div className="w-10 h-10 border-4 border-[#C99A3D] border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (error || !profile) {
    return (
      <div className="p-12 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-800">Profile Not Found</h2>
        <p className="text-gray-500 mt-2">{error}</p>
        <Link href="/admin/users" className="text-[#8F0038] font-bold mt-4 inline-block hover:underline">← Back to Directory</Link>
      </div>
    );
  }

  const getSingleRel = (rel: any) => Array.isArray(rel) ? rel[0] : rel;
  const personal = getSingleRel(profile.personal_details) || {};
  const jain = getSingleRel(profile.jain_identities) || {};
  const lifestyle = getSingleRel(profile.lifestyle_profiles) || {};
  const prefs = getSingleRel(profile.partner_preferences) || {};
  const biodata = getSingleRel(profile.biodatas);
  
  const eduRecords = Array.isArray(profile.education_records) ? profile.education_records : (profile.education_records ? [profile.education_records] : []);
  const empRecords = Array.isArray(profile.employment_records) ? profile.employment_records : (profile.employment_records ? [profile.employment_records] : []);
  const famRecords = Array.isArray(profile.family_members) ? profile.family_members : (profile.family_members ? [profile.family_members] : []);

  const SectionTitle = ({ title, icon: Icon }: any) => (
    <h3 className="font-serif font-bold text-lg text-[#8F0038] border-b border-[#EBD9DC]/50 pb-2 mb-4 flex items-center gap-2">
      <Icon className="w-5 h-5 text-[#C99A3D]" />
      {title}
    </h3>
  );

  const DataRow = ({ label, value }: { label: string, value: any }) => (
    <div className="py-2 flex flex-col sm:flex-row sm:items-start justify-between border-b border-gray-100 last:border-0 gap-1">
      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider w-1/3">{label}</span>
      <span className="text-sm font-semibold text-gray-800 flex-1">{value || '-'}</span>
    </div>
  );

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-6xl mx-auto">
      
      <div className="flex items-center gap-4">
        <Link href="/admin/users" className="p-2 bg-white rounded-xl shadow-sm border border-[#EBD9DC] hover:bg-gray-50 text-gray-500 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#241A20]">Candidate Profile</h1>
          <p className="text-sm font-semibold text-[#75666D] mt-1">ID: {profile.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="space-y-6">
          <div className="bg-[#FFFDFB] rounded-[24px] border border-[#EBD9DC] shadow-sm p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 border-4 border-white shadow-lg overflow-hidden mb-4">
              {profile.photos?.[0] ? (
                <img src={`https://hchxytnssymfobqohowk.supabase.co/storage/v1/object/public/profile-photos/${profile.photos[0]}`} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-gray-300 m-auto mt-5" />
              )}
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#241A20]">{profile.first_name} {profile.last_name}</h2>
            <p className="text-sm font-bold text-[#C99A3D] uppercase tracking-widest mt-1">{profile.gender}</p>
            
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {profile.verification_status === 'verified' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </span>
              )}
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#F7E5EA] text-[#8F0038] text-xs font-bold rounded-full border border-[#EBD9DC]">
                {Math.round(profile.completion_percentage || 0)}% Complete
              </span>
            </div>

            <div className="w-full mt-6 space-y-3 pt-6 border-t border-[#EBD9DC]/50 text-left">
              <DataRow label="Phone" value={profile.users?.phone} />
              <DataRow label="Email" value={profile.users?.email} />
              <DataRow label="Registered" value={new Date(profile.users?.created_at).toLocaleDateString()} />
            </div>
          </div>

          <div className="bg-[#FFFDFB] rounded-[24px] border border-[#EBD9DC] shadow-sm p-6">
            <SectionTitle title="Jain Identity" icon={User} />
            <DataRow label="Sect" value={jain.sect} />
            <DataRow label="Community" value={jain.community} />
            <DataRow label="Sub Community" value={jain.sub_community} />
            <DataRow label="Gotra" value={jain.saka_gotra} />
          </div>

          <div className="bg-[#FFFDFB] rounded-[24px] border border-[#EBD9DC] shadow-sm p-6">
            <SectionTitle title="Location & Lifestyle" icon={MapPin} />
            <DataRow label="Current City" value={`${profile.current_city || '-'}, ${profile.current_state || '-'}`} />
            <DataRow label="Diet" value={lifestyle.diet?.replace('_', ' ')} />
            <DataRow label="Smoker" value={lifestyle.smoking ? 'Yes' : 'No'} />
            <DataRow label="Alcohol" value={lifestyle.alcohol ? 'Yes' : 'No'} />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-[#FFFDFB] rounded-[24px] border border-[#EBD9DC] shadow-sm p-6">
            <SectionTitle title="Personal Details" icon={User} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <DataRow label="Date of Birth" value={personal.date_of_birth} />
              <DataRow label="Birth Time" value={personal.birth_time} />
              <DataRow label="Birth Place" value={personal.birth_place} />
              <DataRow label="Marital Status" value={personal.marital_status} />
              <DataRow label="Height" value={personal.height_cm ? `${personal.height_cm} cm` : '-'} />
              <DataRow label="Blood Group" value={personal.blood_group} />
              <DataRow label="Mother Tongue" value={personal.mother_tongue} />
              <DataRow label="Languages" value={personal.languages_known?.join(', ')} />
            </div>
          </div>

          <div className="bg-[#FFFDFB] rounded-[24px] border border-[#EBD9DC] shadow-sm p-6">
            <SectionTitle title="Education & Career" icon={GraduationCap} />
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Education</h4>
                {eduRecords.length === 0 ? <p className="text-sm text-gray-500 italic">No records</p> : (
                  eduRecords.map((edu: any) => (
                    <div key={edu.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-2">
                      <p className="font-bold text-[#241A20]">{edu.degree} in {edu.field_of_study}</p>
                      <p className="text-xs text-gray-500 mt-1">{edu.institution_name}</p>
                    </div>
                  ))
                )}
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Employment</h4>
                {empRecords.length === 0 ? <p className="text-sm text-gray-500 italic">No records</p> : (
                  empRecords.map((emp: any) => (
                    <div key={emp.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-2">
                      <p className="font-bold text-[#241A20]">{emp.designation} at {emp.company_name}</p>
                      <p className="text-xs text-gray-500 mt-1">{emp.income_range}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="bg-[#FFFDFB] rounded-[24px] border border-[#EBD9DC] shadow-sm p-6">
            <SectionTitle title="Partner Preferences" icon={Heart} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <DataRow label="Age Range" value={`${prefs.min_age || '-'} to ${prefs.max_age || '-'} yrs`} />
              <DataRow label="Min Height" value={prefs.min_height_cm ? `${prefs.min_height_cm} cm` : '-'} />
              <DataRow label="Allowed Marital" value={prefs.allowed_marital_statuses?.join(', ')} />
              <DataRow label="Preferred Diet" value={prefs.preferred_diet?.replace('_', ' ')} />
              <DataRow label="Pref. Sects" value={prefs.preferred_sects?.join(', ')} />
              <DataRow label="Pref. Cities" value={prefs.preferred_cities?.join(', ')} />
            </div>
          </div>

          <div className="bg-[#FFFDFB] rounded-[24px] border border-[#EBD9DC] shadow-sm p-6">
            <SectionTitle title="Uploaded Documents" icon={Briefcase} />
            {biodata?.file_path ? (
              <a 
                href={`https://hchxytnssymfobqohowk.supabase.co/storage/v1/object/public/biodatas/${biodata.file_path}`} 
                target="_blank"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#8F0038] text-white font-bold text-sm rounded-xl shadow-sm hover:bg-[#A30040] transition-colors"
              >
                View Biodata PDF
              </a>
            ) : (
              <p className="text-sm text-gray-500 italic">No biodata uploaded.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
