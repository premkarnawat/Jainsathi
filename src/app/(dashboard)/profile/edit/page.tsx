'use client';

import React, { useState } from 'react';
import { 
  User, CheckCircle, ChevronDown, Save, MapPin, 
  GraduationCap, Briefcase, Heart, BookOpen, UserCheck, ShieldAlert
} from 'lucide-react';
import { useCandidateProfile } from '@/hooks/useCandidateProfile';
import { useProfileMutations } from '@/hooks/useProfileMutations';
import { useRouter } from 'next/navigation';

export default function EditProfilePage() {
  const router = useRouter();
  const { profile, loading, refetch } = useCandidateProfile();
  const [activeSection, setActiveSection] = useState<string>('basic');
  
  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-[#C99A3D] border-t-transparent rounded-full animate-spin" /></div>;
  }
  if (!profile) return null;

  const sections = [
    { id: 'basic', label: 'Basic Details', icon: User },
    { id: 'jain', label: 'Jain Identity', icon: Heart },
    { id: 'education', label: 'Education & Career', icon: GraduationCap },
    { id: 'family', label: 'Family Details', icon: UserCheck },
    { id: 'lifestyle', label: 'Lifestyle', icon: BookOpen },
    { id: 'location', label: 'Location Details', icon: MapPin },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="bg-[#FFFDFB] p-8 rounded-[32px] border border-[#EBD9DC] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#F7E5EA] to-transparent rounded-bl-full pointer-events-none" />
        <div className="relative z-10">
          <h1 className="font-serif text-3xl font-bold text-[#8F0038] tracking-tight">Edit Profile</h1>
          <p className="text-sm font-semibold text-[#75666D] mt-1">
            Complete your profile to increase your visibility and match quality.
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 relative z-10 bg-[#FFF8F7] p-4 rounded-2xl border border-[#EBD9DC]">
          <p className="text-[10px] font-bold uppercase text-[#75666D] tracking-wider">Completion</p>
          <p className="text-2xl font-serif font-bold text-[#8F0038]">{profile.completionPercentage}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className="bg-[#FFFDFB] border border-[#EBD9DC] rounded-[24px] overflow-hidden shadow-sm flex flex-col">
          {sections.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button 
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`w-full flex items-center justify-between p-4 text-left transition-colors border-l-4 ${
                  isActive 
                    ? 'border-[#8F0038] bg-[#F7E5EA]/40 text-[#8F0038]' 
                    : 'border-transparent text-[#75666D] hover:bg-[#F9F9F9]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-bold">{sec.label}</span>
                </div>
                <CheckCircle className={`w-4 h-4 ${isActive ? 'text-[#8F0038]' : 'text-gray-300'}`} />
              </button>
            );
          })}
        </div>

        {/* Form Content Area */}
        <div className="md:col-span-2 space-y-6">
          {activeSection === 'basic' && <BasicInfoForm profile={profile} onSaved={refetch} />}
          {activeSection === 'jain' && <JainIdentityForm profile={profile} onSaved={refetch} />}
          {activeSection === 'education' && <EducationCareerForm profile={profile} onSaved={refetch} />}
          {activeSection === 'family' && <FamilyDetailsForm profile={profile} onSaved={refetch} />}
          {activeSection === 'lifestyle' && <LifestyleForm profile={profile} onSaved={refetch} />}
          {activeSection === 'location' && <LocationForm profile={profile} onSaved={refetch} />}
        </div>
      </div>

    </div>
  );
}

// -------------------------------------------------------------
// CHILD FORM COMPONENTS 
// (For production, these would be separate files. Condensed here for rapid integration.)
// -------------------------------------------------------------

function FormWrapper({ title, description, children, onSave, saving, error }: any) {
  return (
    <div className="bg-[#FFFDFB] border border-[#EBD9DC] rounded-[24px] shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
      <div className="p-6 border-b border-[#EBD9DC]/50">
        <h2 className="font-serif text-xl font-bold text-[#8F0038]">{title}</h2>
        <p className="text-xs font-semibold text-[#75666D] mt-1">{description}</p>
      </div>
      
      {error && (
        <div className="mx-6 mt-6 p-4 bg-[#FFF1F1] text-[#8F0038] rounded-xl text-xs font-bold flex items-center gap-2 border border-[#8F0038]/20">
          <ShieldAlert className="w-4 h-4" /> {error}
        </div>
      )}

      <div className="p-6 space-y-5">
        {children}
      </div>
      
      <div className="p-4 bg-[#FFF8F7] border-t border-[#EBD9DC]/50 flex justify-end gap-3">
        <button className="px-6 py-2.5 text-[#75666D] font-bold text-xs hover:bg-[#F7E5EA]/50 rounded-xl transition-colors">
          Cancel
        </button>
        <button 
          onClick={onSave}
          disabled={saving}
          className="px-6 py-2.5 bg-[#8F0038] hover:bg-[#72002E] text-white font-bold text-xs rounded-xl shadow-sm transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Changes</>}
        </button>
      </div>
    </div>
  );
}

function BasicInfoForm({ profile, onSaved }: any) {
  const { updateCandidateProfile, saving, error } = useProfileMutations(profile.id);
  const [form, setForm] = useState({
    first_name: profile.first_name || '',
    last_name: profile.last_name || '',
    date_of_birth: profile.date_of_birth || '',
    birth_time: profile.birth_time || '',
    birth_place: profile.birth_place || '',
    blood_group: profile.blood_group || 'B+',
    mother_tongue: profile.mother_tongue || 'Hindi',
    languages_known: profile.languages_known?.join(', ') || '',
    height_cm: profile.height_cm || 160,
    marital_status: profile.marital_status || 'never_married',
    about_me: profile.about_me || ''
  });

  const handleSave = async () => {
    const success = await updateCandidateProfile({
      ...form,
      languages_known: form.languages_known.split(',').map((l: string) => l.trim()).filter(Boolean)
    });
    if (success) {
      alert("Basic Details Saved");
      onSaved();
    }
  };

  return (
    <FormWrapper title="Basic Details" description="Your core personal information." onSave={handleSave} saving={saving} error={error}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-[#75666D]">First Name</label>
          <input type="text" value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} className="w-full bg-[#FDF9F4] border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#241B20] focus:outline-none focus:border-[#8F0038]" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-[#75666D]">Last Name</label>
          <input type="text" value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} className="w-full bg-[#FDF9F4] border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#241B20] focus:outline-none focus:border-[#8F0038]" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-[#75666D]">Date of Birth</label>
          <input type="date" value={form.date_of_birth} onChange={e => setForm({...form, date_of_birth: e.target.value})} className="w-full bg-[#FDF9F4] border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#241B20] focus:outline-none focus:border-[#8F0038]" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-[#75666D]">Birth Time</label>
          <input type="time" value={form.birth_time} onChange={e => setForm({...form, birth_time: e.target.value})} className="w-full bg-[#FDF9F4] border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#241B20] focus:outline-none focus:border-[#8F0038]" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-[#75666D]">Birth Place</label>
          <input type="text" value={form.birth_place} onChange={e => setForm({...form, birth_place: e.target.value})} className="w-full bg-[#FDF9F4] border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#241B20] focus:outline-none focus:border-[#8F0038]" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-[#75666D]">Blood Group</label>
          <select value={form.blood_group} onChange={e => setForm({...form, blood_group: e.target.value})} className="w-full bg-[#FDF9F4] border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#241B20] focus:outline-none focus:border-[#8F0038]">
            <option value="A+">A+</option><option value="A-">A-</option>
            <option value="B+">B+</option><option value="B-">B-</option>
            <option value="AB+">AB+</option><option value="AB-">AB-</option>
            <option value="O+">O+</option><option value="O-">O-</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-[#75666D]">Height (cm)</label>
          <input type="number" value={form.height_cm} onChange={e => setForm({...form, height_cm: parseInt(e.target.value)})} className="w-full bg-[#FDF9F4] border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#241B20] focus:outline-none focus:border-[#8F0038]" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-[#75666D]">Marital Status</label>
          <select value={form.marital_status} onChange={e => setForm({...form, marital_status: e.target.value})} className="w-full bg-[#FDF9F4] border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#241B20] focus:outline-none focus:border-[#8F0038]">
            <option value="never_married">Never Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
            <option value="separated">Separated</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-[#75666D]">Mother Tongue</label>
          <input type="text" value={form.mother_tongue} onChange={e => setForm({...form, mother_tongue: e.target.value})} className="w-full bg-[#FDF9F4] border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#241B20] focus:outline-none focus:border-[#8F0038]" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-[#75666D]">Languages Known (comma separated)</label>
          <input type="text" placeholder="Hindi, English..." value={form.languages_known} onChange={e => setForm({...form, languages_known: e.target.value})} className="w-full bg-[#FDF9F4] border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#241B20] focus:outline-none focus:border-[#8F0038]" />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase text-[#75666D]">About Me</label>
        <textarea rows={4} value={form.about_me} onChange={e => setForm({...form, about_me: e.target.value})} placeholder="Write a brief introduction..." className="w-full bg-[#FDF9F4] border border-[#EBD9DC] rounded-xl px-4 py-3 text-sm font-semibold text-[#241B20] focus:outline-none focus:border-[#8F0038]" />
      </div>
    </FormWrapper>
  );
}

function JainIdentityForm({ profile, onSaved }: any) {
  const { upsertJainIdentity, saving, error } = useProfileMutations(profile.id);
  const jain = profile.jainIdentity || {};
  const [form, setForm] = useState({
    sect: jain.sect || '',
    community: jain.community || '',
    sub_community: jain.sub_community || '',
    saka_gotra: jain.saka_gotra || ''
  });

  const handleSave = async () => {
    const success = await upsertJainIdentity(form);
    if (success) {
      alert("Jain Identity Saved ✓");
      onSaved();
    }
  };

  return (
    <FormWrapper title="Jain Identity" description="Details about your sect, community and gotra." onSave={handleSave} saving={saving} error={error}>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-[#75666D]">Jain Sect</label>
          <select value={form.sect} onChange={e => setForm({...form, sect: e.target.value})} className="w-full bg-[#FDF9F4] border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#241B20] focus:outline-none focus:border-[#8F0038]">
            <option value="">Select Sect</option>
            <option value="Shwetambar">Shwetambar</option>
            <option value="Digambar">Digambar</option>
            <option value="Sthanakvasi">Sthanakvasi</option>
            <option value="Terapanthi">Terapanthi</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-[#75666D]">Community</label>
          <input type="text" placeholder="e.g. Oswal, Porwal..." value={form.community} onChange={e => setForm({...form, community: e.target.value})} className="w-full bg-[#FDF9F4] border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#241B20] focus:outline-none focus:border-[#8F0038]" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-[#75666D]">Sub-Community (Optional)</label>
          <input type="text" value={form.sub_community} onChange={e => setForm({...form, sub_community: e.target.value})} className="w-full bg-[#FDF9F4] border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#241B20] focus:outline-none focus:border-[#8F0038]" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-[#75666D]">Gotra / Sakha</label>
          <input type="text" value={form.saka_gotra} onChange={e => setForm({...form, saka_gotra: e.target.value})} className="w-full bg-[#FDF9F4] border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#241B20] focus:outline-none focus:border-[#8F0038]" />
        </div>
      </div>
    </FormWrapper>
  );
}

function EducationCareerForm({ profile, onSaved }: any) {
  const { upsertEmployment, saving, error } = useProfileMutations(profile.id);
  // Simulating the primary career form only for this MVP demonstration
  const [form, setForm] = useState({
    employment_type: 'Employed',
    company_name: '',
    designation: '',
    work_city: '',
    annual_income_lakhs: 0
  });

  const handleSave = async () => {
    const success = await upsertEmployment(form);
    if (success) {
      alert("Career Details Saved ✓");
      onSaved();
    }
  };

  return (
    <FormWrapper title="Education & Career" description="Your professional background." onSave={handleSave} saving={saving} error={error}>
      <div className="p-4 bg-[#F7E5EA]/30 border border-[#EBD9DC] rounded-xl text-xs font-semibold text-[#75666D] mb-4">
        Education capabilities are managed in a separate expanded component. Add your primary career details below.
      </div>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-[#75666D]">Working Status</label>
          <select value={form.employment_type} onChange={e => setForm({...form, employment_type: e.target.value})} className="w-full bg-[#FDF9F4] border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#241B20] focus:outline-none focus:border-[#8F0038]">
            <option value="Employed">Employed in Corporate</option>
            <option value="Business">Business / Entrepreneur</option>
            <option value="Self-Employed">Self-Employed Professional</option>
            <option value="Student">Student</option>
            <option value="Not Working">Not Working</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase text-[#75666D]">Designation</label>
            <input type="text" placeholder="e.g. Software Engineer" value={form.designation} onChange={e => setForm({...form, designation: e.target.value})} className="w-full bg-[#FDF9F4] border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#241B20] focus:outline-none focus:border-[#8F0038]" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase text-[#75666D]">Company / Firm Name</label>
            <input type="text" placeholder="e.g. Google, Own Business..." value={form.company_name} onChange={e => setForm({...form, company_name: e.target.value})} className="w-full bg-[#FDF9F4] border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#241B20] focus:outline-none focus:border-[#8F0038]" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-[#75666D]">Annual Income (Lakhs) - Private</label>
          <input type="number" placeholder="e.g. 15" value={form.annual_income_lakhs} onChange={e => setForm({...form, annual_income_lakhs: parseInt(e.target.value)})} className="w-full bg-[#FDF9F4] border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#241B20] focus:outline-none focus:border-[#8F0038]" />
        </div>
      </div>
    </FormWrapper>
  );
}

function FamilyDetailsForm({ profile, onSaved }: any) {
  return (
    <div className="bg-[#FFFDFB] border border-[#EBD9DC] rounded-[24px] shadow-sm overflow-hidden p-12 text-center space-y-3">
      <UserCheck className="w-10 h-10 text-[#C99A3D] mx-auto opacity-50" />
      <h3 className="font-serif font-bold text-lg text-[#241B20]">Family Lineage Management</h3>
      <p className="text-xs text-[#75666D] font-semibold max-w-sm mx-auto leading-relaxed">
        Family members and 4-Sakha detailed lineage input interface will be activated in the next schema update.
      </p>
    </div>
  );
}

function LifestyleForm({ profile, onSaved }: any) {
  const { upsertLifestyle, saving, error } = useProfileMutations(profile.id);
  const [form, setForm] = useState({
    diet: 'strict_jain',
    smoking: false,
    alcohol: false
  });

  const handleSave = async () => {
    const success = await upsertLifestyle(form);
    if (success) {
      alert("Lifestyle Details Saved ✓");
      onSaved();
    }
  };

  return (
    <FormWrapper title="Lifestyle" description="Dietary and lifestyle choices." onSave={handleSave} saving={saving} error={error}>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-[#75666D]">Dietary Preference</label>
          <select value={form.diet} onChange={e => setForm({...form, diet: e.target.value})} className="w-full bg-[#FDF9F4] border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#241B20] focus:outline-none focus:border-[#8F0038]">
            <option value="strict_jain">Strict Jain (No Root Veg)</option>
            <option value="jain_vegetarian">Jain Vegetarian</option>
            <option value="vegetarian">Vegetarian</option>
          </select>
        </div>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm font-bold text-[#241B20] bg-[#F7E5EA]/30 p-4 border border-[#EBD9DC] rounded-xl flex-1 cursor-pointer hover:bg-[#F7E5EA]/60 transition-colors">
            <input type="checkbox" checked={form.smoking} onChange={e => setForm({...form, smoking: e.target.checked})} className="accent-[#8F0038]" />
            Smoker
          </label>
          <label className="flex items-center gap-2 text-sm font-bold text-[#241B20] bg-[#F7E5EA]/30 p-4 border border-[#EBD9DC] rounded-xl flex-1 cursor-pointer hover:bg-[#F7E5EA]/60 transition-colors">
            <input type="checkbox" checked={form.alcohol} onChange={e => setForm({...form, alcohol: e.target.checked})} className="accent-[#8F0038]" />
            Drinks Alcohol
          </label>
        </div>
      </div>
    </FormWrapper>
  );
}

function LocationForm({ profile, onSaved }: any) {
  const { updateCandidateProfile, saving, error } = useProfileMutations(profile.id);
  const [form, setForm] = useState({
    current_city: profile.current_city || '',
    current_state: profile.current_state || '',
    native_city: profile.native_city || '',
    native_state: profile.native_state || ''
  });

  const handleSave = async () => {
    const success = await updateCandidateProfile(form);
    if (success) {
      alert("Location Details Saved ✓");
      onSaved();
    }
  };

  return (
    <FormWrapper title="Location Details" description="Current residency and native place." onSave={handleSave} saving={saving} error={error}>
      <h3 className="text-xs font-bold text-[#8F0038] mb-3 border-b border-[#EBD9DC]/50 pb-2">Current Residence</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-[#75666D]">City</label>
          <input type="text" value={form.current_city} onChange={e => setForm({...form, current_city: e.target.value})} className="w-full bg-[#FDF9F4] border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#241B20] focus:outline-none focus:border-[#8F0038]" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-[#75666D]">State</label>
          <input type="text" value={form.current_state} onChange={e => setForm({...form, current_state: e.target.value})} className="w-full bg-[#FDF9F4] border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#241B20] focus:outline-none focus:border-[#8F0038]" />
        </div>
      </div>

      <h3 className="text-xs font-bold text-[#8F0038] mb-3 border-b border-[#EBD9DC]/50 pb-2">Native Place</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-[#75666D]">Native City</label>
          <input type="text" value={form.native_city} onChange={e => setForm({...form, native_city: e.target.value})} className="w-full bg-[#FDF9F4] border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#241B20] focus:outline-none focus:border-[#8F0038]" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-[#75666D]">Native State</label>
          <input type="text" value={form.native_state} onChange={e => setForm({...form, native_state: e.target.value})} className="w-full bg-[#FDF9F4] border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#241B20] focus:outline-none focus:border-[#8F0038]" />
        </div>
      </div>
    </FormWrapper>
  );
}
