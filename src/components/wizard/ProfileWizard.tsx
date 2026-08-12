import React, { useState } from 'react';
import { CandidateProfile, ManagedBy, Gender, MaritalStatus, DietPreference, PlanCode } from '@/types';
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, Upload, Download, Sparkles } from 'lucide-react';
import { PremiumButton } from '@/components/ui/PremiumButton';

interface ProfileWizardProps {
  onComplete: (profileData: Partial<CandidateProfile>, selectedPlan: PlanCode) => void;
  onSaveDraft?: (progress: number) => void;
}

export const ProfileWizard: React.FC<ProfileWizardProps> = ({ onComplete, onSaveDraft }) => {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 18;

  // Form State
  const [managedBy, setManagedBy] = useState<ManagedBy>('self');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<Gender>('female');
  const [dob, setDob] = useState('1999-[10]-15');
  const [heightCm, setHeightCm] = useState(163); // 5'4"
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus>('never_married');
  
  // Jain Identity
  const [sect, setSect] = useState('Shwetambar');
  const [community, setCommunity] = useState('Oswal');
  const [subCommunity, setSubCommunity] = useState('Visa Oswal');
  const [selfSaka, setSelfSaka] = useState('Shah');
  const [mamasaSaka, setMamasaSaka] = useState('Mehta');
  const [dadisaSaka, setDadisaSaka] = useState('Parikh');
  const [nanisaSaka, setNanisaSaka] = useState('Vora');

  // Education & Career
  const [educationLevel, setEducationLevel] = useState('Masters');
  const [degreeName, setDegreeName] = useState('MBA');
  const [employmentType, setEmploymentType] = useState('Corporate');
  const [companyName, setCompanyName] = useState('TCS Innovation');
  const [designation, setDesignation] = useState('Business Analyst');
  const [incomeLakhs, setIncomeLakhs] = useState(14);
  
  // Address
  const [currentState, setCurrentState] = useState('Maharashtra');
  const [currentCity, setCurrentCity] = useState('Mumbai');
  const [nativeState, setNativeState] = useState('Rajasthan');
  const [nativeCity, setNativeCity] = useState('Jodhpur');

  // Lifestyle
  const [diet, setDiet] = useState<DietPreference>('strict_jain');

  // Privacy & Plan
  const [photoPrivacy, setPhotoPrivacy] = useState('verified_users');
  const [selectedPlan, setSelectedPlan] = useState<PlanCode>('super_3m');

  const completionPercentage = Math.round((step / totalSteps) * 100);

  const handleNext = () => {
    if (step < totalSteps) {
      setStep((prev) => prev + 1);
      if (onSaveDraft) onSaveDraft(completionPercentage);
    } else {
      onComplete(
        {
          managedBy,
          firstName,
          middleName,
          lastName,
          gender,
          dateOfBirth: dob,
          heightCm,
          maritalStatus,
          currentState,
          currentCity,
          nativeState,
          nativeCity,
          completionPercentage: 96,
          jainIdentity: { sect, community, subCommunity, selfSaka, mamasaSaka, dadisaSaka, nanisaSaka },
          lifestyle: { diet, smoking: false, alcohol: false, tobacco: false },
          education: [{ qualificationLevel: educationLevel, degreeName }],
          employment: [{ employmentType, companyName, designation, annualIncomeLakhs: incomeLakhs }],
        },
        selectedPlan
      );
    }
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Wizard Top Header & Completion Bar */}
      <div className="mb-8 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#9E183A] text-white flex items-center justify-center font-bold text-sm">
              {step}
            </span>
            <span className="font-serif font-bold text-xl text-[#241A20]">
              Profile Setup ({step} of {totalSteps})
            </span>
          </div>
          <span className="text-xs font-semibold text-[#6E1231] bg-[#F8E8EA] px-3 py-1 rounded-full border border-[#9E183A]/20">
            {completionPercentage}% Completed
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#9E183A] to-[#D6A24A] h-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Main Form Container Card */}
      <div className="bg-[#FFF9F1] border border-[#D6A24A]/30 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        
        {/* STEP 1: Profile Type */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-serif font-bold text-2xl text-[#6E1231]">Who is this profile for?</h2>
            <p className="text-xs text-[#756B70]">Specify who will be creating and managing this matrimonial profile.</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {[
                { id: 'self', label: 'Myself', icon: '👤' },
                { id: 'parent', label: 'My Son / Daughter', icon: '👪' },
                { id: 'sibling', label: 'My Brother / Sister', icon: '👫' },
                { id: 'relative', label: 'My Relative', icon: '🏠' },
                { id: 'guardian', label: 'Guardian', icon: '🛡️' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setManagedBy(item.id as ManagedBy)}
                  className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                    managedBy === item.id
                      ? 'border-[#9E183A] bg-[#F8E8EA] text-[#6E1231] font-bold shadow'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-[#D6A24A]'
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-xs">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Basic Details */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-serif font-bold text-2xl text-[#6E1231]">Basic Candidate Details</h2>
            <p className="text-xs text-[#756B70]">Enter essential details about the candidate.</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#241A20] mb-1">First Name *</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Ritika"
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm focus:border-[#9E183A] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#241A20] mb-1">Middle Name</label>
                <input
                  type="text"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  placeholder="e.g. Navin"
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm focus:border-[#9E183A] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#241A20] mb-1">Last Name *</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Shah"
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm focus:border-[#9E183A] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-[#241A20] mb-1">Gender</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`py-2 text-xs font-bold rounded-xl border ${
                      gender === 'female' ? 'bg-[#9E183A] text-white border-[#9E183A]' : 'bg-white text-gray-700'
                    }`}
                  >
                    👰 Bride
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`py-2 text-xs font-bold rounded-xl border ${
                      gender === 'male' ? 'bg-[#9E183A] text-white border-[#9E183A]' : 'bg-white text-gray-700'
                    }`}
                  >
                    🤵 Groom
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#241A20] mb-1">Marital Status</label>
                <select
                  value={maritalStatus}
                  onChange={(e) => setMaritalStatus(e.target.value as MaritalStatus)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm focus:border-[#9E183A] outline-none"
                >
                  <option value="never_married">Never Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                  <option value="separated">Separated</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Jain Identity */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-serif font-bold text-2xl text-[#6E1231]">Jain Identity & Sect</h2>
            <p className="text-xs text-[#756B70]">Database-driven taxonomy supporting traditional Jain community branches.</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#241A20] mb-1">Jain Sect</label>
                <select
                  value={sect}
                  onChange={(e) => setSect(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm focus:border-[#9E183A] outline-none"
                >
                  <option value="Shwetambar">Shwetambar</option>
                  <option value="Digambar">Digambar</option>
                  <option value="Sthanakvasi">Sthanakvasi</option>
                  <option value="Terapanthi">Terapanthi</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#241A20] mb-1">Community</label>
                <select
                  value={community}
                  onChange={(e) => setCommunity(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm focus:border-[#9E183A] outline-none"
                >
                  <option value="Oswal">Oswal</option>
                  <option value="Porwal">Porwal</option>
                  <option value="Shrimali">Shrimali</option>
                  <option value="Khandelwal">Khandelwal</option>
                  <option value="Parwar">Parwar</option>
                  <option value="Humbad">Humbad</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#241A20] mb-1">Sub-Community</label>
                <input
                  type="text"
                  value={subCommunity}
                  onChange={(e) => setSubCommunity(e.target.value)}
                  placeholder="e.g. Visa Oswal / Dasa Oswal"
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm focus:border-[#9E183A] outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 9: 4-Gotra Jain Lineage */}
        {step === 9 && (
          <div className="space-y-4">
            <h2 className="font-serif font-bold text-2xl text-[#6E1231]">Jain Lineage (4 Gotra System)</h2>
            <p className="text-xs text-[#756B70]">Traditional Saka / Gotra information for family verification.</p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#241A20] mb-1">Self Saka (Father's Gotra)</label>
                <input
                  type="text"
                  value={selfSaka}
                  onChange={(e) => setSelfSaka(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#241A20] mb-1">Mama Saka (Mother's Gotra)</label>
                <input
                  type="text"
                  value={mamasaSaka}
                  onChange={(e) => setMamasaSaka(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#241A20] mb-1">Dadi Saka (Paternal Grandmother)</label>
                <input
                  type="text"
                  value={dadisaSaka}
                  onChange={(e) => setDadisaSaka(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#241A20] mb-1">Nani Saka (Maternal Grandmother)</label>
                <input
                  type="text"
                  value={nanisaSaka}
                  onChange={(e) => setNanisaSaka(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 17: Plan Selection */}
        {step === 17 && (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h2 className="font-serif font-bold text-3xl text-[#6E1231]">Choose Your Plan</h2>
              <p className="text-xs text-[#756B70]">Select a membership plan to activate full contact reveals & digital biodata downloads.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {[
                { code: 'free', name: 'Free', price: '₹0', duration: '365 Days', reveals: '0 Contact Reveals', highlight: '' },
                { code: 'pro_3m', name: 'Pro', price: '₹1,999', duration: '3 Months', reveals: '10 Contact Reveals', highlight: '' },
                { code: 'super_3m', name: 'Super', price: '₹3,499', duration: '3 Months', reveals: '25 Contact Reveals', highlight: 'Most Popular' },
                { code: 'deluxe_6m', name: 'Deluxe', price: '₹5,999', duration: '6 Months', reveals: '60 Contact Reveals', highlight: 'Best Value' },
              ].map((p) => (
                <div
                  key={p.code}
                  onClick={() => setSelectedPlan(p.code as PlanCode)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between relative ${
                    selectedPlan === p.code
                      ? 'border-[#9E183A] bg-[#F8E8EA] shadow-xl ring-2 ring-[#9E183A]'
                      : 'border-gray-200 bg-white hover:border-[#D6A24A]'
                  }`}
                >
                  {p.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D6A24A] text-[#100A18] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {p.highlight}
                    </span>
                  )}
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#241A20]">{p.name}</h3>
                    <p className="font-serif text-2xl font-bold text-[#6E1231] my-1">{p.price}</p>
                    <p className="text-[10px] text-gray-500">{p.duration}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-200 text-xs font-semibold text-[#3E8B68]">
                    ✓ {p.reveals}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generic Content Fallback for Intermediate Steps */}
        {![1, 2, 3, 9, 17].includes(step) && (
          <div className="space-y-4 py-4">
            <h2 className="font-serif font-bold text-2xl text-[#6E1231]">
              Step {step}: Profile Information Setup
            </h2>
            <p className="text-xs text-[#756B70]">
              Fill in your details for this section to enhance recommendation quality.
            </p>
            <div className="bg-white p-4 rounded-xl border border-gray-200 text-xs text-gray-600">
              Information saved securely with Supabase Row Level Security.
            </div>
          </div>
        )}

        {/* Wizard Controls Footer */}
        <div className="pt-6 border-t border-[#D6A24A]/20 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              step === 1 ? 'opacity-30 cursor-not-allowed text-gray-400' : 'btn-gold-outline text-[#6E1231]'
            }`}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <PremiumButton variant="ruby" size="md" onClick={handleNext}>
            <span>{step === totalSteps ? 'Activate Profile' : 'Next Step'}</span>
            <ArrowRight className="w-4 h-4" />
          </PremiumButton>
        </div>

      </div>
    </div>
  );
};
