import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

interface ProfileWizardProps {
  onComplete: (profileData: any, selectedPlan: string) => void;
}

export const ProfileWizard: React.FC<ProfileWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(1);
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [profileFor, setProfileFor] = useState('self');
  const [selectedPlan, setSelectedPlan] = useState('super');
  const [paymentMethod, setPaymentMethod] = useState('upi');

  const handleNext = () => {
    if (step < 5) {
      setStep((prev) => prev + 1);
    } else {
      onComplete(
        {
          mobileNumber,
          profileFor,
          firstName: 'Priya',
          lastName: 'Jain',
        },
        selectedPlan
      );
    }
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);
    // Auto focus next field
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white border border-[#D6A24A]/25 rounded-3xl shadow-lg space-y-6">
      
      {/* Step Indicator dots */}
      <div className="flex justify-between items-center px-4">
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Step {step} of 5</span>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                s === step ? 'bg-[#9E183A] w-4' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* STEP 1: Welcome Back (Login) */}
      {step === 1 && (
        <div className="space-y-5">
          <div className="text-center space-y-1">
            <h2 className="font-serif text-2xl font-bold text-[#100A18]">Welcome Back</h2>
            <p className="text-xs text-gray-500">Login to continue your journey</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Mobile Number</label>
              <div className="flex rounded-xl border border-gray-300 overflow-hidden focus-within:border-[#9E183A]">
                <span className="bg-gray-50 text-xs text-gray-500 font-semibold px-3.5 py-3 border-r border-gray-300 flex items-center">+91</span>
                <input
                  type="tel"
                  required
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="Enter 10 digit mobile number"
                  className="flex-1 px-3.5 py-3 text-xs focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleNext}
              disabled={!mobileNumber}
              className="w-full bg-[#9E183A] text-white py-3 rounded-xl text-xs font-bold shadow-md hover:bg-[#80122E] transition-all disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Verify OTP */}
      {step === 2 && (
        <div className="space-y-5">
          <div className="text-center space-y-1">
            <h2 className="font-serif text-2xl font-bold text-[#100A18]">Verify OTP</h2>
            <p className="text-xs text-gray-500">Enter the 4 digit code sent to +91 {mobileNumber || 'XXXXXXXXXX'}</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-center gap-3">
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="w-12 h-12 text-center bg-gray-50 border border-gray-300 rounded-xl font-bold text-sm focus:outline-none focus:border-[#9E183A]"
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-full bg-[#9E183A] text-white py-3 rounded-xl text-xs font-bold shadow-md hover:bg-[#80122E] transition-all"
            >
              Verify & Continue
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Who is this profile for? */}
      {step === 3 && (
        <div className="space-y-5">
          <div className="text-center space-y-1">
            <h2 className="font-serif text-2xl font-bold text-[#100A18]">Who is this profile for?</h2>
            <p className="text-xs text-gray-500">Select the candidate profile type</p>
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

          <button
            onClick={handleNext}
            className="w-full bg-[#9E183A] text-white py-3 rounded-xl text-xs font-bold shadow-md hover:bg-[#80122E] transition-all"
          >
            Save & Continue
          </button>
        </div>
      )}

      {/* STEP 4: Choose a Plan */}
      {step === 4 && (
        <div className="space-y-5">
          <div className="text-center space-y-1">
            <h2 className="font-serif text-2xl font-bold text-[#100A18]">Choose a Plan</h2>
            <p className="text-xs text-gray-500">Select the plan that suits you best</p>
          </div>

          <div className="space-y-3">
            {[
              { id: 'free', name: 'Free Plan', price: '₹0', duration: '3 Months', desc: 'Basic match browsing' },
              { id: 'pro', name: 'Pro Plan', price: '₹1,999', duration: '3 Months', desc: '10 contact reveals & messaging' },
              { id: 'super', name: 'Super Plan', price: '₹3,499', duration: '12 Months', desc: '25 contact reveals & highlighted profile', highlight: 'Best Value' },
              { id: 'deluxe', name: 'Deluxe Plan', price: '₹5,999', duration: '6 Months', desc: '60 contact reveals & personal manager' },
            ].map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedPlan(p.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between relative ${
                  selectedPlan === p.id
                    ? 'border-[#9E183A] bg-[#F8E8EA] ring-2 ring-[#9E183A]/30 shadow'
                    : 'border-gray-200 bg-white hover:border-[#D6A24A]'
                }`}
              >
                {p.highlight && (
                  <span className="absolute -top-2.5 right-4 bg-[#D6A24A] text-[#100A18] text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {p.highlight}
                  </span>
                )}
                <div>
                  <h3 className="font-serif font-bold text-sm text-gray-800">{p.name}</h3>
                  <p className="text-[10px] text-gray-500 mt-0.5">{p.desc}</p>
                </div>
                <div className="text-right">
                  <p className="font-serif font-bold text-sm text-[#6E1231]">{p.price}</p>
                  <p className="text-[8px] text-gray-400 font-bold">{p.duration}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-full bg-[#9E183A] text-white py-3 rounded-xl text-xs font-bold shadow-md hover:bg-[#80122E] transition-all"
          >
            Choose Plan
          </button>
        </div>
      )}

      {/* STEP 5: Payment */}
      {step === 5 && (
        <div className="space-y-5">
          <div className="text-center space-y-1">
            <h2 className="font-serif text-2xl font-bold text-[#100A18]">Payment</h2>
            <p className="text-xs text-gray-500">Secure checkout powered by Razorpay</p>
          </div>

          <div className="bg-[#FFF9F1] border border-[#D6A24A]/30 p-4 rounded-2xl space-y-1">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Selected Plan</p>
            <div className="flex justify-between items-center">
              <p className="font-serif font-bold text-base text-[#6E1231] capitalize">{selectedPlan} Plan [12 Months]</p>
              <p className="font-serif font-bold text-lg text-[#100A18]">
                {selectedPlan === 'super' ? '₹3,499' : selectedPlan === 'pro' ? '₹1,999' : selectedPlan === 'deluxe' ? '₹5,999' : '₹0'}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Payment Method</p>
            
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'upi', label: 'UPI', desc: 'Pay using any UPI App' },
                { id: 'card', label: 'Card', desc: 'Visa, MasterCard' },
                { id: 'net', label: 'Net Banking', desc: 'All Indian Banks' },
                { id: 'wallet', label: 'Wallet', desc: 'Paytm, PhonePe' },
              ].map((method) => (
                <div
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    paymentMethod === method.id
                      ? 'border-[#9E183A] bg-[#F8E8EA]'
                      : 'border-gray-200 bg-white hover:border-[#D6A24A]'
                  }`}
                >
                  <p className="text-xs font-bold text-gray-800">{method.label}</p>
                  <p className="text-[8px] text-gray-500 mt-0.5">{method.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleNext}
            className="w-full bg-[#9E183A] text-white py-3 rounded-xl text-xs font-bold shadow-md hover:bg-[#80122E] transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-[#F3D59B]" />
            <span>Pay Now</span>
          </button>
        </div>
      )}

      {/* Back button */}
      {step > 1 && (
        <button
          onClick={handleBack}
          className="w-full text-center text-[10px] font-bold text-[#6E1231] hover:underline pt-2"
        >
          ← Back to previous step
        </button>
      )}

    </div>
  );
};
