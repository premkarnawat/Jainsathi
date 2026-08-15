import React, { useState } from 'react';
import { ShieldCheck, Phone, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface ProfileWizardProps {
  onComplete: (profileData: any, selectedPlan: string) => void;
}

export const ProfileWizard: React.FC<ProfileWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(1); // 1: Mobile Input, 2: OTP Input, 3: Success Screen, 4: Profile For, 5: Basic Details, 6: Jain Identity, 7: Review & Plan
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']); // 6-digit code as shown in mobile screen mockup
  const [profileFor, setProfileFor] = useState('self');
  const [selectedPlan, setSelectedPlan] = useState('super');
  const [paymentMethod, setPaymentMethod] = useState('upi');

  // Basic Details
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('female');
  const [dob, setDob] = useState('');
  const [heightCm, setHeightCm] = useState('163');
  const [maritalStatus, setMaritalStatus] = useState('never_married');

  // Jain Identity
  const [sect, setSect] = useState('Shwetambar');
  const [community, setCommunity] = useState('Oswal');
  const [selfSaka, setSelfSaka] = useState('');
  const [mamaSaka, setMamaSaka] = useState('');

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);
    // Auto focus next field
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleSendOtp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: '+91' + mobileNumber,
      });
      if (error) throw error;
      setStep(2);
    } catch (err: any) {
      alert(`Error sending OTP: ${err.message}`);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const code = otpDigits.join('');
      const { data: { session }, error } = await supabase.auth.verifyOtp({
        phone: '+91' + mobileNumber,
        token: code,
        type: 'sms',
      });
      if (error) throw error;
      if (session) {
        setStep(3);
      } else {
        throw new Error('Session not created');
      }
    } catch (err: any) {
      alert(`Invalid OTP: ${err.message}`);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      handleSendOtp();
      return;
    }
    if (step === 2) {
      handleVerifyOtp();
      return;
    }
    if (step < 7) {
      setStep((prev) => prev + 1);
    } else {
      onComplete(
        {
          mobileNumber,
          profileFor,
          firstName,
          lastName,
          gender,
          dateOfBirth: dob,
          heightCm: parseInt(heightCm),
          maritalStatus,
          jainIdentity: { sect, community, selfSaka, mamasaSaka: mamaSaka },
        },
        selectedPlan
      );
    }
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  // Maps logical stepper circles (1 to 5) to wizard steps
  const getStepperActiveCircle = () => {
    if (step <= 3) return 1; // Mobile Verification
    if (step === 4) return 2; // Profile For
    if (step === 5) return 3; // Basic Details
    if (step === 6) return 4; // Jain Identity
    return 5; // Review & Plan
  };

  const activeCircle = getStepperActiveCircle();

  return (
    <div className="min-h-screen bg-[#FFF9F1] flex justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Beautiful Journey Brand Panel (4 Cols) */}
        <div className="lg:col-span-4 bg-[#FFF9F1] border border-[#D6A24A]/30 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center space-y-8 relative overflow-hidden shadow-sm self-stretch justify-between">
          <div className="space-y-6 w-full">
            <div className="flex justify-center">
              <img src="/logo.png" alt="JainSaathi" className="h-16 w-auto object-contain rounded-lg" />
            </div>

            <div className="space-y-3">
              <h1 className="font-serif text-3xl font-bold text-[#100A18] tracking-tight">
                A Beautiful Journey <br />
                <span className="text-[#6E1231]">Begins Here</span>
              </h1>
              <p className="text-xs text-[#756B70] leading-relaxed max-w-xs mx-auto font-medium">
                Create your profile in a few simple steps and connect with the right Jain Saathi for a meaningful future.
              </p>
            </div>

            {/* 4 Badges */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-[10px] font-bold text-[#100A18]">
              <div className="flex flex-col items-center space-y-1 p-2 rounded-xl bg-white/50 border border-[#D6A24A]/15">
                <span className="text-base">✓</span>
                <span>Verified Profiles</span>
              </div>
              <div className="flex flex-col items-center space-y-1 p-2 rounded-xl bg-white/50 border border-[#D6A24A]/15">
                <span className="text-base">🔒</span>
                <span>Privacy Protected</span>
              </div>
              <div className="flex flex-col items-center space-y-1 p-2 rounded-xl bg-white/50 border border-[#D6A24A]/15">
                <span className="text-base">🤝</span>
                <span>Jain Community Focused</span>
              </div>
              <div className="flex flex-col items-center space-y-1 p-2 rounded-xl bg-white/50 border border-[#D6A24A]/15">
                <span className="text-base">👪</span>
                <span>Family Friendly</span>
              </div>
            </div>
          </div>

          {/* Couple Image at Bottom */}
          <div className="w-full relative mt-6 rounded-2xl overflow-hidden border border-[#D6A24A]/30 bg-[#F7E5EA]">
             <div className="w-full h-64 flex items-center justify-center text-[#8F0038] font-serif font-bold opacity-30 text-2xl">
              JainSaathi
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-black/40 p-3 text-left flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-white leading-tight">Trusted by thousands of Jain families</p>
                <p className="text-[9px] text-[#F3D59B]">for meaningful connections</p>
              </div>
              <span className="text-xs font-bold text-[#F3D59B] shrink-0">2.5K+ Happy Families</span>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Create Account Form Card (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-[#D6A24A]/35 rounded-3xl p-6 sm:p-8 shadow-md relative">
          
          <div className="text-center space-y-4">
            <h2 className="font-serif text-2xl font-bold text-[#100A18]">Create Your Account</h2>
            <div className="flex justify-center text-[#D6A24A]">🪷</div>

            {/* Stepper */}
            <div className="flex justify-between items-center max-w-xs mx-auto pt-2 relative">
              {/* Stepper bar line */}
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 -z-10" />

              {[
                { label: 'Mobile Verification', stepNum: 1 },
                { label: 'Profile For', stepNum: 2 },
                { label: 'Basic Details', stepNum: 3 },
                { label: 'Jain Identity', stepNum: 4 },
                { label: 'Review & Plan', stepNum: 5 },
              ].map((circle) => (
                <div key={circle.stepNum} className="flex flex-col items-center text-center space-y-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      activeCircle === circle.stepNum
                        ? 'bg-[#9E183A] text-white ring-2 ring-[#9E183A]/30'
                        : 'bg-white border-2 border-gray-200 text-gray-400'
                    }`}
                  >
                    {circle.stepNum === 1 && activeCircle === 1 ? '📱' : circle.stepNum}
                  </div>
                  <span className="text-[8px] font-bold text-gray-400 max-w-[50px] leading-tight">
                    {circle.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 space-y-6">
            {/* STEP 1: Mobile Number Input */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="font-serif text-lg font-bold text-[#100A18]">Let's start with your mobile number</h3>
                  <p className="text-xs text-[#756B70]">We will send you a verification code (OTP) to verify your number</p>
                </div>

                <div className="space-y-4">
                  <div className="flex rounded-xl border border-[#D6A24A]/30 overflow-hidden focus-within:border-[#9E183A]">
                    <div className="flex items-center gap-1.5 bg-[#FFF9F1] px-4 border-r border-[#D6A24A]/30 text-xs font-bold text-gray-700">
                      <span>🇮🇳</span>
                      <span>+91</span>
                      <span className="text-[10px]">▼</span>
                    </div>
                    <input
                      type="tel"
                      required
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="Enter your mobile number"
                      className="flex-1 px-4 py-3.5 text-xs focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={handleNext}
                    disabled={mobileNumber.length < 10}
                    className="w-full bg-[#9E183A] text-white py-3.5 rounded-xl text-xs font-bold shadow-md hover:bg-[#80122E] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>Send OTP</span>
                    <span className="text-xs">➔</span>
                  </button>

                  <div className="flex items-center my-3">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="px-3 text-[10px] text-gray-400 font-bold uppercase tracking-wider">OR</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                  </div>

                  {/* Social buttons */}
                  <div className="space-y-2">
                    <button className="w-full border border-[#D6A24A]/30 rounded-xl py-3 text-xs font-semibold text-gray-700 hover:bg-[#FFF9F1] transition-all flex items-center justify-center gap-2">
                      <span className="text-red-500 font-bold">G</span>
                      <span>Continue with Google</span>
                    </button>
                    <button className="w-full border border-[#D6A24A]/30 rounded-xl py-3 text-xs font-semibold text-gray-700 hover:bg-[#FFF9F1] transition-all flex items-center justify-center gap-2">
                      <span className="font-bold text-black"></span>
                      <span>Continue with Apple</span>
                    </button>
                  </div>
                </div>

                <div className="bg-[#FFF9F1] border border-[#D6A24A]/20 p-4 rounded-2xl flex gap-3 text-[10px] text-[#756B70]">
                  <span className="text-sm">🔒</span>
                  <div>
                    <p className="font-bold text-[#100A18]">Your number is safe with us and will never be shared publicly.</p>
                    <p className="mt-0.5">We respect your privacy.</p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Verify OTP */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-1 text-center">
                  <h3 className="font-serif text-lg font-bold text-[#100A18]">Verify Your Mobile</h3>
                  <p className="text-xs text-[#756B70]">Enter the 6-digit code sent to +91 {mobileNumber}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-center gap-2">
                    {otpDigits.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        className="w-10 h-12 text-center bg-gray-50 border border-gray-300 rounded-xl font-bold text-sm focus:outline-none focus:border-[#9E183A]"
                      />
                    ))}
                  </div>

                  <p className="text-center text-xs font-bold text-[#6E1231]">Resend OTP in 00:25</p>

                  <button
                    onClick={handleNext}
                    className="w-full bg-[#9E183A] text-white py-3.5 rounded-xl text-xs font-bold shadow-md hover:bg-[#80122E] transition-all"
                  >
                    Verify & Continue
                  </button>

                  <p className="text-center text-[10px] text-gray-500 font-semibold flex items-center justify-center gap-1">
                    <span>🛡️</span> Secure • Encrypted • Private
                  </p>
                </div>
              </div>
            )}

            {/* STEP 3: OTP Success */}
            {step === 3 && (
              <div className="space-y-6 text-center">
                <div className="flex justify-center py-4">
                  <div className="w-16 h-16 rounded-full bg-[#D6A24A]/10 border-2 border-[#D6A24A] flex items-center justify-center text-[#D6A24A] text-2xl font-bold shadow-sm">
                    ✓
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-bold text-[#100A18]">Mobile Verified!</h3>
                  <p className="text-xs text-[#756B70] max-w-xs mx-auto">
                    Your number has been verified successfully. Let's create your JainSaathi profile.
                  </p>
                </div>

                <button
                  onClick={handleNext}
                  className="w-full bg-[#9E183A] text-white py-3.5 rounded-xl text-xs font-bold shadow-md hover:bg-[#80122E] transition-all flex items-center justify-center gap-2"
                >
                  <span>Continue</span>
                  <span>➔</span>
                </button>
              </div>
            )}

            {/* STEP 4: Profile For */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="space-y-1 text-center">
                  <h3 className="font-serif text-lg font-bold text-[#100A18]">Who is this profile for?</h3>
                  <p className="text-xs text-[#756B70]">Select the candidate profile type</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'self', label: 'Myself', icon: '👤' },
                    { id: 'son', label: 'My Son', icon: '👦' },
                    { id: 'daughter', label: 'My Daughter', icon: '👧' },
                    { id: 'brother', label: 'My Brother', icon: '👨' },
                    { id: 'sister', label: 'My Sister', icon: '👩' },
                    { id: 'friend', label: 'Friend', icon: '🤝' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setProfileFor(item.id)}
                      className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                        profileFor === item.id
                          ? 'border-[#9E183A] bg-[#F8E8EA] text-[#6E1231] font-bold shadow'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-[#D6A24A]'
                      }`}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-xs font-bold">{item.label}</span>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={handleBack} className="flex-1 bg-transparent border border-gray-300 py-3 rounded-xl text-xs font-bold text-gray-600">Back</button>
                  <button onClick={handleNext} className="flex-1 bg-[#9E183A] text-white py-3 rounded-xl text-xs font-bold shadow-md">Save & Continue</button>
                </div>
              </div>
            )}

            {/* STEP 5: Basic Details */}
            {step === 5 && (
              <div className="space-y-6">
                <div className="space-y-1 text-center">
                  <h3 className="font-serif text-lg font-bold text-[#100A18]">Basic Details</h3>
                  <p className="text-xs text-[#756B70]">Enter essential details about the candidate</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">First Name *</label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First Name"
                        className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Last Name *</label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last Name"
                        className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Date of Birth *</label>
                    <input
                      type="date"
                      required
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Gender</label>
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

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Height (Cm)</label>
                      <input
                        type="number"
                        value={heightCm}
                        onChange={(e) => setHeightCm(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Marital Status</label>
                      <select
                        value={maritalStatus}
                        onChange={(e) => setMaritalStatus(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none"
                      >
                        <option value="never_married">Never Married</option>
                        <option value="divorced">Divorced</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={handleBack} className="flex-1 bg-transparent border border-gray-300 py-3 rounded-xl text-xs font-bold text-gray-600">Back</button>
                  <button onClick={handleNext} className="flex-1 bg-[#9E183A] text-white py-3 rounded-xl text-xs font-bold shadow-md">Continue</button>
                </div>
              </div>
            )}

            {/* STEP 6: Jain Identity */}
            {step === 6 && (
              <div className="space-y-6">
                <div className="space-y-1 text-center">
                  <h3 className="font-serif text-lg font-bold text-[#100A18]">Jain Identity</h3>
                  <p className="text-xs text-[#756B70]">Database taxonomy for Jain sects & communities</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Jain Sect</label>
                      <select
                        value={sect}
                        onChange={(e) => setSect(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none"
                      >
                        <option value="Shwetambar">Shwetambar</option>
                        <option value="Digambar">Digambar</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Community</label>
                      <select
                        value={community}
                        onChange={(e) => setCommunity(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none"
                      >
                        <option value="Oswal">Oswal</option>
                        <option value="Porwal">Porwal</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Self Saka (Gotra)</label>
                      <input
                        type="text"
                        value={selfSaka}
                        onChange={(e) => setSelfSaka(e.target.value)}
                        placeholder="e.g. Shah"
                        className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Mama Saka (Gotra)</label>
                      <input
                        type="text"
                        value={mamaSaka}
                        onChange={(e) => setMamaSaka(e.target.value)}
                        placeholder="e.g. Mehta"
                        className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={handleBack} className="flex-1 bg-transparent border border-gray-300 py-3 rounded-xl text-xs font-bold text-gray-600">Back</button>
                  <button onClick={handleNext} className="flex-1 bg-[#9E183A] text-white py-3 rounded-xl text-xs font-bold shadow-md">Continue</button>
                </div>
              </div>
            )}

            {/* STEP 7: Review & Plan */}
            {step === 7 && (
              <div className="space-y-6">
                <div className="space-y-1 text-center">
                  <h3 className="font-serif text-lg font-bold text-[#100A18]">Choose Your Plan</h3>
                  <p className="text-xs text-[#756B70]">Select a membership plan to activate contact reveals</p>
                </div>

                <div className="space-y-3">
                  {[
                    { id: 'free', name: 'Free Plan', price: '₹0', duration: '3 Months' },
                    { id: 'pro', name: 'Pro Plan', price: '₹1,999', duration: '3 Months' },
                    { id: 'super', name: 'Super Plan', price: '₹3,499', duration: '12 Months', highlight: 'Best Value' },
                  ].map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPlan(p.id)}
                      className={`p-3 rounded-xl border cursor-pointer flex justify-between items-center ${
                        selectedPlan === p.id ? 'border-[#9E183A] bg-[#F8E8EA]' : 'border-gray-200'
                      }`}
                    >
                      <div>
                        <h4 className="font-serif font-bold text-sm text-gray-800">{p.name}</h4>
                        <p className="text-[10px] text-gray-400">{p.duration}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-serif font-bold text-sm text-[#6E1231]">{p.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={handleBack} className="flex-1 bg-transparent border border-gray-300 py-3 rounded-xl text-xs font-bold text-gray-600">Back</button>
                  <button onClick={handleNext} className="flex-1 bg-[#9E183A] text-white py-3 rounded-xl text-xs font-bold shadow-md">Pay & Activate</button>
                </div>
              </div>
            )}
          </div>

          {/* Card footer */}
          <div className="mt-8 pt-4 border-t border-gray-100 text-center text-xs text-gray-500 font-semibold">
            Already have an account? <span className="text-[#9E183A] hover:underline cursor-pointer">Login</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Why Number Panel & Help Info (3 Cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-[#D6A24A]/30 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-[#D6A24A]">
              <span>🪷</span>
              <h4 className="font-serif text-sm font-bold text-[#100A18]">Why do we need your number?</h4>
            </div>

            <ul className="space-y-3 text-xs text-[#756B70] font-semibold">
              <li className="flex items-start gap-2">
                <span className="text-[#D6A24A] font-bold">✓</span>
                <span>Secure login to your account</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D6A24A] font-bold">✓</span>
                <span>Important updates about your profile</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D6A24A] font-bold">✓</span>
                <span>Stay connected for verified matches</span>
              </li>
            </ul>

            <div className="pt-2 text-[10px] text-gray-400 border-t border-gray-100 font-bold">
              We never share your number.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
