import React from 'react';
import { ChevronRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  return (
    <section id="howitworks" className="py-20 bg-[#F8F1E8] px-4 sm:px-6 lg:px-8 border-b border-[#D6A24A]/20">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#9E183A] bg-[#F8E8EA] px-3 py-1 rounded-full border border-[#9E183A]/20">
            SIMPLE & GUIDED PROCESS
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#241A20]">
            Create Your Profile in <span className="text-[#6E1231]">Simple Steps</span>
          </h2>
          <p className="text-sm text-[#756B70] max-w-xl mx-auto">
            Our step-by-step profile wizard makes it easy for candidates and parents to share essential Jain identity, family values, and partner criteria.
          </p>
        </div>

        {/* 6 Step Cards Grid matching reference UI */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          
          {/* STEP 1: Basic Details */}
          <div className="bg-[#FFF9F1] border border-[#D6A24A]/30 rounded-2xl p-4 shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-2 right-3 font-serif font-bold text-3xl text-[#6E1231]/10">01</div>
            <div>
              <div className="w-7 h-7 rounded-full bg-[#9E183A] text-white flex items-center justify-center text-xs font-bold mb-2">1</div>
              <h3 className="font-serif font-bold text-base text-[#241A20]">Basic Details</h3>
              <p className="text-[11px] text-[#756B70] mb-3">Tell us about yourself</p>
              
              <div className="space-y-2 text-[11px]">
                <div>
                  <span className="block text-[10px] text-gray-500 mb-0.5">Full Name</span>
                  <div className="bg-white border border-gray-200 rounded px-2 py-1 text-gray-700">Enter your name</div>
                </div>
                <div>
                  <span className="block text-[10px] text-gray-500 mb-0.5">Gender</span>
                  <div className="grid grid-cols-2 gap-1">
                    <span className="bg-gray-100 text-gray-600 rounded px-1 py-0.5 text-center text-[10px]">Male</span>
                    <span className="bg-[#9E183A] text-white rounded px-1 py-0.5 text-center text-[10px] font-bold">Female</span>
                  </div>
                </div>
              </div>
            </div>
            <button className="btn-ruby py-1.5 px-3 text-[11px] w-full rounded-lg mt-4 flex items-center justify-center gap-1">
              <span>Next</span> <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* STEP 2: Religion & Community */}
          <div className="bg-[#FFF9F1] border border-[#D6A24A]/30 rounded-2xl p-4 shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-2 right-3 font-serif font-bold text-3xl text-[#6E1231]/10">02</div>
            <div>
              <div className="w-7 h-7 rounded-full bg-[#9E183A] text-white flex items-center justify-center text-xs font-bold mb-2">2</div>
              <h3 className="font-serif font-bold text-base text-[#241A20]">Religion & Community</h3>
              <p className="text-[11px] text-[#756B70] mb-3">Your Jain identity</p>

              <div className="space-y-2 text-[11px]">
                <div>
                  <span className="block text-[10px] text-gray-500 mb-0.5">Sect</span>
                  <div className="bg-white border border-gray-200 rounded px-2 py-1 text-gray-700 font-medium">Shwetambar</div>
                </div>
                <div>
                  <span className="block text-[10px] text-gray-500 mb-0.5">Community</span>
                  <div className="bg-white border border-gray-200 rounded px-2 py-1 text-gray-700 font-medium">Oswal</div>
                </div>
              </div>
            </div>
            <button className="btn-ruby py-1.5 px-3 text-[11px] w-full rounded-lg mt-4 flex items-center justify-center gap-1">
              <span>Next</span> <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* STEP 3: Education & Career */}
          <div className="bg-[#FFF9F1] border border-[#D6A24A]/30 rounded-2xl p-4 shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-2 right-3 font-serif font-bold text-3xl text-[#6E1231]/10">03</div>
            <div>
              <div className="w-7 h-7 rounded-full bg-[#9E183A] text-white flex items-center justify-center text-xs font-bold mb-2">3</div>
              <h3 className="font-serif font-bold text-base text-[#241A20]">Education & Career</h3>
              <p className="text-[11px] text-[#756B70] mb-3">Tell us about education</p>

              <div className="space-y-2 text-[11px]">
                <div>
                  <span className="block text-[10px] text-gray-500 mb-0.5">Education</span>
                  <div className="bg-white border border-gray-200 rounded px-2 py-1 text-gray-700 truncate">Select education</div>
                </div>
                <div>
                  <span className="block text-[10px] text-gray-500 mb-0.5">Profession</span>
                  <div className="bg-white border border-gray-200 rounded px-2 py-1 text-gray-700 truncate">Select profession</div>
                </div>
              </div>
            </div>
            <button className="btn-ruby py-1.5 px-3 text-[11px] w-full rounded-lg mt-4 flex items-center justify-center gap-1">
              <span>Next</span> <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* STEP 4: Family Details */}
          <div className="bg-[#FFF9F1] border border-[#D6A24A]/30 rounded-2xl p-4 shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-2 right-3 font-serif font-bold text-3xl text-[#6E1231]/10">04</div>
            <div>
              <div className="w-7 h-7 rounded-full bg-[#9E183A] text-white flex items-center justify-center text-xs font-bold mb-2">4</div>
              <h3 className="font-serif font-bold text-base text-[#241A20]">Family Details</h3>
              <p className="text-[11px] text-[#756B70] mb-3">Tell us about family</p>

              <div className="space-y-2 text-[11px]">
                <div>
                  <span className="block text-[10px] text-gray-500 mb-0.5">Father's Occupation</span>
                  <div className="bg-white border border-gray-200 rounded px-2 py-1 text-gray-700">Select occupation</div>
                </div>
                <div>
                  <span className="block text-[10px] text-gray-500 mb-0.5">Family Type</span>
                  <div className="bg-white border border-gray-200 rounded px-2 py-1 text-gray-700">Select type</div>
                </div>
              </div>
            </div>
            <button className="btn-ruby py-1.5 px-3 text-[11px] w-full rounded-lg mt-4 flex items-center justify-center gap-1">
              <span>Next</span> <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* STEP 5: Lifestyle */}
          <div className="bg-[#FFF9F1] border border-[#D6A24A]/30 rounded-2xl p-4 shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-2 right-3 font-serif font-bold text-3xl text-[#6E1231]/10">05</div>
            <div>
              <div className="w-7 h-7 rounded-full bg-[#9E183A] text-white flex items-center justify-center text-xs font-bold mb-2">5</div>
              <h3 className="font-serif font-bold text-base text-[#241A20]">Lifestyle</h3>
              <p className="text-[11px] text-[#756B70] mb-3">Your preferences</p>

              <div className="space-y-2 text-[11px]">
                <div>
                  <span className="block text-[10px] text-gray-500 mb-0.5">Eating Habits</span>
                  <div className="bg-white border border-gray-200 rounded px-2 py-1 text-gray-700">Strict Jain</div>
                </div>
                <div>
                  <span className="block text-[10px] text-gray-500 mb-0.5">Manglik</span>
                  <div className="bg-white border border-gray-200 rounded px-2 py-1 text-gray-700">Non-Manglik</div>
                </div>
              </div>
            </div>
            <button className="btn-ruby py-1.5 px-3 text-[11px] w-full rounded-lg mt-4 flex items-center justify-center gap-1">
              <span>Next</span> <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* STEP 6: Partner Preferences */}
          <div className="bg-[#FFF9F1] border border-[#D6A24A]/30 rounded-2xl p-4 shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-2 right-3 font-serif font-bold text-3xl text-[#6E1231]/10">06</div>
            <div>
              <div className="w-7 h-7 rounded-full bg-[#9E183A] text-white flex items-center justify-center text-xs font-bold mb-2">6</div>
              <h3 className="font-serif font-bold text-base text-[#241A20]">Partner Preferences</h3>
              <p className="text-[11px] text-[#756B70] mb-3">Tell us expectations</p>

              <div className="space-y-2 text-[11px]">
                <div>
                  <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                    <span>Age Range</span>
                    <span className="font-bold text-[#6E1231]">22 - 30</span>
                  </div>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#9E183A] h-full w-2/3 ml-4"></div>
                  </div>
                </div>
                <div>
                  <span className="block text-[10px] text-gray-500 mb-0.5">Community</span>
                  <div className="bg-white border border-gray-200 rounded px-2 py-1 text-gray-700">Select community</div>
                </div>
              </div>
            </div>
            <button className="btn-ruby py-1.5 px-3 text-[11px] w-full rounded-lg mt-4 flex items-center justify-center gap-1 font-bold">
              <span>Finish</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
