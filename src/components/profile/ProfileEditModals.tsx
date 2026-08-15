'use client';

import React, { useState } from 'react';
import { ShieldAlert, Save, X } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

const ModalWrapper = ({ title, isOpen, onClose, children }: { title: string, isOpen: boolean, onClose: () => void, children: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#241B20]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FFFDFB] rounded-[24px] shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-[#EBD9DC] flex items-center justify-between bg-[#FDF9F4]">
          <h2 className="font-serif text-lg font-bold text-[#8F0038]">{title}</h2>
          <button onClick={onClose} className="p-1.5 text-[#75666D] hover:bg-white rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export const AddEducationModal = ({ isOpen, onClose, profileId, onSaved }: { isOpen: boolean, onClose: () => void, profileId: string, onSaved: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    qualification_level: 'Bachelors',
    degree_name: '',
    specialization: '',
    institution: '',
    passout_year: new Date().getFullYear()
  });

  const handleSave = async () => {
    try {
      setLoading(true);
      await supabase.from('education_records').insert({
        candidate_id: profileId,
        ...form
      });
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to save education record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper title="Add Education" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#241B20] mb-1">Qualification Level</label>
          <select value={form.qualification_level} onChange={e => setForm({...form, qualification_level: e.target.value})} className="w-full p-2.5 bg-[#FFFDFB] border border-[#EBD9DC] rounded-xl text-sm focus:outline-none focus:border-[#C99A3D]">
            <option value="High School">High School</option>
            <option value="Bachelors">Bachelors</option>
            <option value="Masters">Masters</option>
            <option value="Doctorate">Doctorate</option>
            <option value="Diploma">Diploma</option>
            <option value="Certification">Certification</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-[#241B20] mb-1">Degree Name</label>
          <input type="text" placeholder="e.g. B.Tech, MBA" value={form.degree_name} onChange={e => setForm({...form, degree_name: e.target.value})} className="w-full p-2.5 bg-[#FFFDFB] border border-[#EBD9DC] rounded-xl text-sm focus:outline-none focus:border-[#C99A3D]" />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#241B20] mb-1">Specialization</label>
          <input type="text" placeholder="e.g. Computer Science" value={form.specialization} onChange={e => setForm({...form, specialization: e.target.value})} className="w-full p-2.5 bg-[#FFFDFB] border border-[#EBD9DC] rounded-xl text-sm focus:outline-none focus:border-[#C99A3D]" />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#241B20] mb-1">Institution</label>
          <input type="text" placeholder="e.g. IIT Bombay" value={form.institution} onChange={e => setForm({...form, institution: e.target.value})} className="w-full p-2.5 bg-[#FFFDFB] border border-[#EBD9DC] rounded-xl text-sm focus:outline-none focus:border-[#C99A3D]" />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#241B20] mb-1">Graduation Year</label>
          <input type="number" value={form.passout_year} onChange={e => setForm({...form, passout_year: parseInt(e.target.value)})} className="w-full p-2.5 bg-[#FFFDFB] border border-[#EBD9DC] rounded-xl text-sm focus:outline-none focus:border-[#C99A3D]" />
        </div>
        <button onClick={handleSave} disabled={loading || !form.degree_name} className="w-full py-3 bg-[#8F0038] text-white font-bold rounded-xl text-sm disabled:opacity-50">
          {loading ? 'Saving...' : 'Save Education'}
        </button>
      </div>
    </ModalWrapper>
  );
};

export const AddCareerModal = ({ isOpen, onClose, profileId, onSaved }: { isOpen: boolean, onClose: () => void, profileId: string, onSaved: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    employment_type: 'employed',
    company_name: '',
    designation: '',
    industry: '',
    work_city: '',
    work_state: '',
    annual_income_lakhs: ''
  });

  const handleSave = async () => {
    try {
      setLoading(true);
      await supabase.from('employment_records').insert({
        candidate_id: profileId,
        ...form,
        annual_income_lakhs: form.annual_income_lakhs ? parseFloat(form.annual_income_lakhs) : null
      });
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to save career record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper title="Add Career Record" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#241B20] mb-1">Working Status</label>
          <select value={form.employment_type} onChange={e => setForm({...form, employment_type: e.target.value})} className="w-full p-2.5 bg-[#FFFDFB] border border-[#EBD9DC] rounded-xl text-sm focus:outline-none focus:border-[#C99A3D]">
            <option value="employed">Employed (Corporate)</option>
            <option value="business">Business</option>
            <option value="self_employed">Self Employed</option>
            <option value="family_business">Family Business</option>
            <option value="student">Student</option>
            <option value="not_working">Not Working</option>
          </select>
        </div>
        
        {['employed', 'business', 'self_employed', 'family_business'].includes(form.employment_type) && (
          <>
            <div>
              <label className="block text-xs font-bold text-[#241B20] mb-1">{form.employment_type.includes('business') ? 'Business Name' : 'Company Name'}</label>
              <input type="text" value={form.company_name} onChange={e => setForm({...form, company_name: e.target.value})} className="w-full p-2.5 bg-[#FFFDFB] border border-[#EBD9DC] rounded-xl text-sm focus:outline-none focus:border-[#C99A3D]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#241B20] mb-1">{form.employment_type.includes('business') ? 'Your Role / Ownership' : 'Designation'}</label>
              <input type="text" value={form.designation} onChange={e => setForm({...form, designation: e.target.value})} className="w-full p-2.5 bg-[#FFFDFB] border border-[#EBD9DC] rounded-xl text-sm focus:outline-none focus:border-[#C99A3D]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#241B20] mb-1">Industry</label>
              <input type="text" placeholder="e.g. IT, Textile, Healthcare" value={form.industry} onChange={e => setForm({...form, industry: e.target.value})} className="w-full p-2.5 bg-[#FFFDFB] border border-[#EBD9DC] rounded-xl text-sm focus:outline-none focus:border-[#C99A3D]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#241B20] mb-1">Work City</label>
                <input type="text" value={form.work_city} onChange={e => setForm({...form, work_city: e.target.value})} className="w-full p-2.5 bg-[#FFFDFB] border border-[#EBD9DC] rounded-xl text-sm focus:outline-none focus:border-[#C99A3D]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#241B20] mb-1">Work State</label>
                <input type="text" value={form.work_state} onChange={e => setForm({...form, work_state: e.target.value})} className="w-full p-2.5 bg-[#FFFDFB] border border-[#EBD9DC] rounded-xl text-sm focus:outline-none focus:border-[#C99A3D]" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#241B20] mb-1">Annual Income (Lakhs)</label>
              <input type="number" step="0.1" placeholder="e.g. 12.5" value={form.annual_income_lakhs} onChange={e => setForm({...form, annual_income_lakhs: e.target.value})} className="w-full p-2.5 bg-[#FFFDFB] border border-[#EBD9DC] rounded-xl text-sm focus:outline-none focus:border-[#C99A3D]" />
            </div>
          </>
        )}
        
        <button onClick={handleSave} disabled={loading} className="w-full py-3 bg-[#8F0038] text-white font-bold rounded-xl text-sm disabled:opacity-50 mt-4">
          {loading ? 'Saving...' : 'Save Career Details'}
        </button>
      </div>
    </ModalWrapper>
  );
};

export const AddFamilyModal = ({ isOpen, onClose, profileId, onSaved }: { isOpen: boolean, onClose: () => void, profileId: string, onSaved: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    relation_type: 'Father',
    name: '',
    occupation: '',
    business_details: '',
    city: '',
    state: ''
  });

  const handleSave = async () => {
    try {
      setLoading(true);
      await supabase.from('family_members').insert({
        candidate_id: profileId,
        ...form
      });
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to save family member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper title="Add Family Member" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#241B20] mb-1">Relation</label>
          <select value={form.relation_type} onChange={e => setForm({...form, relation_type: e.target.value})} className="w-full p-2.5 bg-[#FFFDFB] border border-[#EBD9DC] rounded-xl text-sm focus:outline-none focus:border-[#C99A3D]">
            <option value="Father">Father</option>
            <option value="Mother">Mother</option>
            <option value="Brother">Brother</option>
            <option value="Sister">Sister</option>
            <option value="Grandfather (Dadasa)">Grandfather (Dadasa)</option>
            <option value="Grandmother (Dadisa)">Grandmother (Dadisa)</option>
            <option value="Uncle (Kakasa)">Uncle (Kakasa)</option>
            <option value="Aunt (Kakisa)">Aunt (Kakisa)</option>
            <option value="Uncle (Mamasa)">Uncle (Mamasa)</option>
            <option value="Brother-in-law (Jiju)">Brother-in-law (Jiju)</option>
            <option value="Sister-in-law (Bhabhi)">Sister-in-law (Bhabhi)</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-[#241B20] mb-1">Name</label>
          <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-2.5 bg-[#FFFDFB] border border-[#EBD9DC] rounded-xl text-sm focus:outline-none focus:border-[#C99A3D]" />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#241B20] mb-1">Occupation (Optional)</label>
          <input type="text" placeholder="e.g. Business, Housewife" value={form.occupation} onChange={e => setForm({...form, occupation: e.target.value})} className="w-full p-2.5 bg-[#FFFDFB] border border-[#EBD9DC] rounded-xl text-sm focus:outline-none focus:border-[#C99A3D]" />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#241B20] mb-1">Business/Company Details (Optional)</label>
          <input type="text" placeholder="e.g. Arihant Traders" value={form.business_details} onChange={e => setForm({...form, business_details: e.target.value})} className="w-full p-2.5 bg-[#FFFDFB] border border-[#EBD9DC] rounded-xl text-sm focus:outline-none focus:border-[#C99A3D]" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#241B20] mb-1">City</label>
            <input type="text" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="w-full p-2.5 bg-[#FFFDFB] border border-[#EBD9DC] rounded-xl text-sm focus:outline-none focus:border-[#C99A3D]" />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#241B20] mb-1">State</label>
            <input type="text" value={form.state} onChange={e => setForm({...form, state: e.target.value})} className="w-full p-2.5 bg-[#FFFDFB] border border-[#EBD9DC] rounded-xl text-sm focus:outline-none focus:border-[#C99A3D]" />
          </div>
        </div>
        
        <button onClick={handleSave} disabled={loading || !form.name} className="w-full py-3 bg-[#8F0038] text-white font-bold rounded-xl text-sm disabled:opacity-50 mt-4">
          {loading ? 'Saving...' : 'Save Family Member'}
        </button>
      </div>
    </ModalWrapper>
  );
};
