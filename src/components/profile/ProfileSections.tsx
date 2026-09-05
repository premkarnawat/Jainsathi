'use client';

import React from 'react';
import { Edit3, MapPin, CheckCircle, Plus, Trash2, Shield, Lock, Eye, Download, FileText } from 'lucide-react';
import Link from 'next/link';

// Helper component for Section Header
const SectionHeader = ({ title, onAdd, onEdit }: { title: string, onAdd?: () => void, onEdit?: () => void }) => (
  <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#EBD9DC]">
    <h2 className="font-serif text-2xl font-bold text-[#8F0038]">{title}</h2>
    <div className="flex gap-2">
      {onAdd && (
        <button onClick={onAdd} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFFDFB] border border-[#EBD9DC] text-[#75666D] hover:text-[#241B20] hover:bg-[#FDF9F4] font-bold rounded-lg text-xs transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      )}
      {onEdit && (
        <button onClick={onEdit} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFFDFB] border border-[#EBD9DC] text-[#75666D] hover:text-[#241B20] hover:bg-[#FDF9F4] font-bold rounded-lg text-xs transition-colors">
          <Edit3 className="w-3.5 h-3.5" /> Edit
        </button>
      )}
    </div>
  </div>
);

// Helper component for Data Row
const DataRow = ({ label, value, isPrivate = false }: { label: string, value: any, isPrivate?: boolean }) => (
  <div className="flex flex-col md:flex-row md:items-start py-2 border-b border-[#FDF9F4] last:border-0">
    <span className="w-full md:w-1/3 text-xs font-semibold text-[#75666D] mb-1 md:mb-0">{label}</span>
    <div className="w-full md:w-2/3 text-[15px] font-medium text-[#241B20] flex items-center gap-2">
      {isPrivate && <Lock className="w-3.5 h-3.5 text-[#C99A3D]" />}
      {value || <span className="text-[#EBD9DC] italic">Not provided</span>}
    </div>
  </div>
);

export const PersonalDetails = ({ profile, onEdit }: { profile: any, onEdit: () => void }) => {
  const calculateAge = (dob: string) => {
    if (!dob) return null;
    const diff = Date.now() - new Date(dob).getTime();
    return Math.abs(new Date(diff).getUTCFullYear() - 1970);
  };

  return (
    <div className="bg-[#FFFDFB] border border-[#EBD9DC] rounded-[24px] p-6 shadow-sm mb-6">
      <SectionHeader title="Personal Details" onEdit={onEdit} />
      <div className="space-y-1">
        <DataRow label="Full Name" value={`${profile.first_name} ${profile.middle_name || ''} ${profile.last_name}`.trim()} />
        <DataRow label="Gender" value={profile.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : ''} />
        <DataRow label="Date of Birth" value={profile.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString('en-GB') : ''} />
        <DataRow label="Age" value={calculateAge(profile.date_of_birth)} />
        <DataRow label="Birth Time" value={profile.birth_time} />
        <DataRow label="Birth Place" value={profile.birth_place} />
        <DataRow label="Height" value={profile.height_cm ? `${profile.height_cm} cm` : ''} />
        <DataRow label="Weight" value={profile.weight_kg ? `${profile.weight_kg} kg` : ''} />
        <DataRow label="Marital Status" value={profile.marital_status?.replace('_', ' ')} />
        <DataRow label="Mother Tongue" value={profile.mother_tongue} />
        <DataRow label="Languages Known" value={profile.languages_known?.join(', ')} />
      </div>
    </div>
  );
};

export const JainIdentity = ({ identity, onEdit }: { identity: any, onEdit: () => void }) => {
  if (!identity) return (
    <div className="bg-[#FFFDFB] border border-[#EBD9DC] rounded-[24px] p-6 shadow-sm mb-6">
      <SectionHeader title="Jain Identity" onAdd={onEdit} />
      <p className="text-sm text-[#75666D] italic">Jain identity details not added yet.</p>
    </div>
  );

  return (
    <div className="bg-[#FFFDFB] border border-[#EBD9DC] rounded-[24px] p-6 shadow-sm mb-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#F7E5EA] rounded-bl-full opacity-50 pointer-events-none" />
      <SectionHeader title="Jain Identity" onEdit={onEdit} />
      <div className="space-y-1 relative z-10">
        <DataRow label="Sect" value={identity.sect} />
        <DataRow label="Community" value={identity.community} />
        {identity.sub_community && <DataRow label="Sub-Community" value={identity.sub_community} />}
        
        <div className="mt-6 pt-4 border-t border-[#FDF9F4]">
          <h3 className="text-sm font-bold text-[#8F0038] mb-3">Family Lineage (Sakha/Gotra)</h3>
          <DataRow label="Self / Father's Gotra" value={identity.self_saka || identity.saka_gotra} />
          <DataRow label="Mother's (Mamasa)" value={identity.mamasa_saka} />
          <DataRow label="Dadi's (Dadisa)" value={identity.dadisa_saka} />
          <DataRow label="Nani's (Nanisa)" value={identity.nanisa_saka} />
        </div>
      </div>
    </div>
  );
};

export const EducationSection = ({ educationRecords, onAdd, onEdit, onRemove }: { educationRecords: any[], onAdd: () => void, onEdit: (id: string) => void, onRemove: (id: string) => void }) => {
  return (
    <div className="bg-[#FFFDFB] border border-[#EBD9DC] rounded-[24px] p-6 shadow-sm mb-6">
      <SectionHeader title="Education & Qualifications" onAdd={onAdd} />
      
      {educationRecords.length === 0 ? (
        <p className="text-sm text-[#75666D] italic">No education records added.</p>
      ) : (
        <div className="space-y-4">
          {educationRecords.map((edu: any) => (
            <div key={edu.id} className="p-4 bg-[#FDF9F4] rounded-xl border border-[#EBD9DC] flex justify-between items-start">
              <div>
                <h3 className="font-bold text-[#241B20] text-[15px]">{edu.degree_name} {edu.specialization ? `in ${edu.specialization}` : ''}</h3>
                <p className="text-sm text-[#75666D] font-medium">{edu.institution || edu.university}</p>
                <p className="text-xs text-[#75666D] mt-1">{edu.qualification_level} • Graduated {edu.passout_year || 'N/A'}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => onEdit(edu.id)} className="p-1.5 text-[#75666D] hover:text-[#8F0038] transition-colors"><Edit3 className="w-4 h-4" /></button>
                <button onClick={() => onRemove(edu.id)} className="p-1.5 text-[#75666D] hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const CareerSection = ({ employmentRecords, onAdd, onEdit, onRemove }: { employmentRecords: any[], onAdd: () => void, onEdit: (id: string) => void, onRemove: (id: string) => void }) => {
  const formatEmploymentType = (type: string) => {
    if (!type) return 'Professional';
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  const isNotWorking = (type: string) => {
    const t = (type || '').toLowerCase().replace(/[_\s]/g, '');
    return t === 'notworking' || t === 'unemployed' || t === 'homemaker' || t === 'retired';
  };

  return (
    <div className="bg-[#FFFDFB] border border-[#EBD9DC] rounded-[24px] p-6 shadow-sm mb-6">
      <SectionHeader title="Career & Professional" onAdd={onAdd} />
      
      {employmentRecords.length === 0 ? (
        <p className="text-sm text-[#75666D] italic">No professional records added.</p>
      ) : (
        <div className="space-y-4">
          {employmentRecords.map((emp: any) => (
            <div key={emp.id} className="p-4 bg-[#FDF9F4] rounded-xl border border-[#EBD9DC] flex justify-between items-start">
              <div>
                <div className="inline-block px-2 py-0.5 rounded bg-[#F7E5EA] text-[#8F0038] text-[10px] font-bold uppercase tracking-wider mb-2">
                  {formatEmploymentType(emp.employment_type)}
                </div>
                {isNotWorking(emp.employment_type) ? (
                  <p className="text-sm text-[#75666D] font-medium">Currently not employed</p>
                ) : emp.employment_type === 'business' || emp.employment_type === 'family_business' ? (
                  <>
                    {emp.company_name && <h3 className="font-bold text-[#241B20] text-[15px]">{emp.company_name}</h3>}
                    <p className="text-sm text-[#75666D] font-medium">
                      {[emp.designation || 'Owner / Partner', emp.industry].filter(Boolean).join(' • ')}
                    </p>
                  </>
                ) : (
                  <>
                    {emp.designation && <h3 className="font-bold text-[#241B20] text-[15px]">{emp.designation}</h3>}
                    {emp.company_name && <p className="text-sm text-[#75666D] font-medium">{emp.company_name}</p>}
                  </>
                )}
                {!isNotWorking(emp.employment_type) && (emp.work_city || emp.work_state) && (
                  <p className="text-xs text-[#75666D] mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {[emp.work_city, emp.work_state].filter(Boolean).join(', ')}
                  </p>
                )}
                {emp.annual_income_lakhs != null && emp.annual_income_lakhs > 0 && (
                  <p className="text-xs font-semibold text-[#241B20] mt-2 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-[#C99A3D]" /> Income: ₹{emp.annual_income_lakhs} Lakhs/yr
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => onEdit(emp.id)} className="p-1.5 text-[#75666D] hover:text-[#8F0038] transition-colors"><Edit3 className="w-4 h-4" /></button>
                <button onClick={() => onRemove(emp.id)} className="p-1.5 text-[#75666D] hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const FamilySection = ({ familyMembers, onAdd, onEdit, onRemove }: { familyMembers: any[], onAdd: () => void, onEdit: (id: string) => void, onRemove: (id: string) => void }) => {
  return (
    <div className="bg-[#FFFDFB] border border-[#EBD9DC] rounded-[24px] p-6 shadow-sm mb-6">
      <SectionHeader title="Family Details" onAdd={onAdd} />
      
      {familyMembers.length === 0 ? (
        <p className="text-sm text-[#75666D] italic">No family members added.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {familyMembers.map((member: any) => (
            <div key={member.id} className="p-4 bg-[#FDF9F4] rounded-xl border border-[#EBD9DC] relative group">
              <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onEdit(member.id)} className="p-1 bg-white rounded shadow-sm text-[#75666D] hover:text-[#8F0038]"><Edit3 className="w-3.5 h-3.5" /></button>
                <button onClick={() => onRemove(member.id)} className="p-1 bg-white rounded shadow-sm text-[#75666D] hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
              
              <p className="text-xs font-bold text-[#8F0038] uppercase tracking-wider mb-1">{member.relation_type}</p>
              <h3 className="font-bold text-[#241B20] text-sm">{member.name}</h3>
              {member.occupation && <p className="text-xs text-[#75666D] mt-1">{member.occupation}</p>}
              {member.business_details && <p className="text-xs text-[#75666D] mt-0.5 italic">{member.business_details}</p>}
              {member.city && (
                <p className="text-xs text-[#75666D] mt-1.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#C99A3D]" /> {member.city}{member.state ? `, ${member.state}` : ''}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const LocationSection = ({ profile, onEdit }: { profile: any, onEdit: () => void }) => {
  return (
    <div className="bg-[#FFFDFB] border border-[#EBD9DC] rounded-[24px] p-6 shadow-sm mb-6">
      <SectionHeader title="Location & Address" onEdit={onEdit} />
      <div className="space-y-1">
        <DataRow label="Current City" value={profile.current_city} />
        <DataRow label="Current State" value={profile.current_state} />
        <DataRow label="Country" value={profile.current_country} />
        <DataRow label="Native Place" value={profile.native_city ? `${profile.native_city}, ${profile.native_state}` : profile.native_state} />
      </div>
    </div>
  );
};

export const LifestyleSection = ({ lifestyle, onEdit }: { lifestyle: any, onEdit: () => void }) => {
  return (
    <div className="bg-[#FFFDFB] border border-[#EBD9DC] rounded-[24px] p-6 shadow-sm mb-6">
      <SectionHeader title="Lifestyle & Interests" onAdd={!lifestyle ? onEdit : undefined} onEdit={lifestyle ? onEdit : undefined} />
      {lifestyle ? (
        <div className="space-y-1">
          <DataRow label="Diet" value={lifestyle.diet?.replace('_', ' ')} />
          <DataRow label="Smoking" value={lifestyle.smoking ? 'Yes' : 'No'} />
          <DataRow label="Alcohol" value={lifestyle.alcohol ? 'Yes' : 'No'} />
          <DataRow label="Manglik Status" value={lifestyle.manglik_status?.replace('_', ' ')} />
          {lifestyle.rashi && <DataRow label="Rashi" value={lifestyle.rashi} />}
          {lifestyle.nakshatra && <DataRow label="Nakshatra" value={lifestyle.nakshatra} />}
        </div>
      ) : (
        <p className="text-sm text-[#75666D] italic">Lifestyle details not added yet.</p>
      )}
    </div>
  );
};

export const ContactSection = ({ email, phone, onEdit }: { email: string, phone: string, onEdit: () => void }) => {
  return (
    <div className="bg-[#FFFDFB] border border-[#EBD9DC] rounded-[24px] p-6 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#EBD9DC]">
        <h2 className="font-serif text-2xl font-bold text-[#8F0038] flex items-center gap-2">
          <Lock className="w-5 h-5 text-[#C99A3D]" /> Contact Details
        </h2>
        <button onClick={onEdit} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFFDFB] border border-[#EBD9DC] text-[#75666D] hover:text-[#241B20] hover:bg-[#FDF9F4] font-bold rounded-lg text-xs transition-colors">
          <Edit3 className="w-3.5 h-3.5" /> Edit
        </button>
      </div>
      <div className="space-y-1">
        <DataRow label="Mobile Number" value={phone} isPrivate />
        <DataRow label="Email Address" value={email} isPrivate />
      </div>
      <p className="text-xs text-[#75666D] mt-4 font-medium flex items-center gap-1.5">
        <Shield className="w-3.5 h-3.5 text-[#C99A3D]" /> Your contact details are hidden from public view by default.
      </p>
    </div>
  );
};

export const BiodataSection = ({ biodata, onUpload, onGenerate }: { biodata: any, onUpload: () => void, onGenerate: () => void }) => {
  return (
    <div className="bg-[#8F0038] border border-[#72002E] rounded-[24px] p-6 shadow-md mb-6 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-5 rounded-bl-full pointer-events-none" />
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h2 className="font-serif text-2xl font-bold flex items-center gap-2">
          <FileText className="w-6 h-6 text-[#E9C77B]" /> Digital Biodata
        </h2>
      </div>
      
      <div className="relative z-10">
        {biodata?.id ? (
          <div className="bg-white/10 border border-white/20 rounded-xl p-4 flex items-center justify-between backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#E9C77B]" />
              </div>
              <div>
                <p className="text-sm font-bold">Uploaded Biodata</p>
                <p className="text-xs text-white/70">Securely stored</p>
              </div>
            </div>
            <div className="flex gap-2">
              <a href={`/api/biodata/${biodata.id}`} target="_blank" rel="noreferrer" className="p-2 bg-white text-[#8F0038] rounded-lg hover:bg-[#FDF9F4] transition-colors">
                <Eye className="w-4 h-4" />
              </a>
              <button onClick={onUpload} className="p-2 border border-white/30 rounded-lg hover:bg-white/10 transition-colors">
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-white/80 mb-6">Upload your traditional PDF biodata or generate a new digital one.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={onUpload} className="px-6 py-3 bg-[#E9C77B] text-[#241B20] font-bold rounded-xl text-sm hover:bg-[#D9A441] transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4 rotate-180" /> Upload PDF
              </button>
              <button onClick={onGenerate} className="px-6 py-3 bg-white/10 border border-white/30 text-white font-bold rounded-xl text-sm hover:bg-white/20 transition-colors flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" /> Generate Digital Biodata
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const PrivacySection = ({ privacy, onEdit }: { privacy: any, onEdit: () => void }) => {
  return (
    <div className="bg-[#FFFDFB] border border-[#EBD9DC] rounded-[24px] p-6 shadow-sm mb-6">
      <SectionHeader title="Profile Visibility & Privacy" onEdit={onEdit} />
      {privacy ? (
        <div className="space-y-1">
          <DataRow label="Photo Privacy" value={privacy.photo_privacy?.replace('_', ' ')} />
          <DataRow label="Biodata Privacy" value={privacy.biodata_privacy?.replace('_', ' ')} />
          <DataRow label="Contact Privacy" value={privacy.contact_privacy?.replace('_', ' ')} />
          <DataRow label="Income Visibility" value={privacy.income_privacy?.replace('_', ' ')} />
        </div>
      ) : (
        <p className="text-sm text-[#75666D] italic">Default privacy settings applied. Edit to customize.</p>
      )}
    </div>
  );
};
