import React from 'react';
import { Heart, X, Bookmark, CheckCircle, ShieldCheck, Download, Share2 } from 'lucide-react';

export const MatchingBiodataSection: React.FC = () => {
  return (
    <section className="py-20 bg-[#FFF9F1] px-4 sm:px-6 lg:px-8 border-b border-[#D6A24A]/25 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#100A18]">
            After Profile Completed – <span className="text-[#6E1231]">Find Your Perfect Match</span>
          </h2>
          <p className="text-sm text-[#756B70] max-w-xl mx-auto">
            Experience seamless compatibility recommendations, digital biodata generation, private contact reveals, and family-approved connections.
          </p>
        </div>

        {/* 6 App Screen Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 pt-4">
          
          {/* SCREEN 1: Dashboard Home */}
          <div className="bg-white border border-[#D6A24A]/30 rounded-3xl p-4 shadow-md flex flex-col justify-between space-y-3 text-xs">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between pb-1 border-b border-gray-100">
                <span className="font-serif font-bold text-[#6E1231] text-xs">JainSaathi</span>
                <span className="text-gray-400">🔔</span>
              </div>

              <div className="flex items-center gap-2">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80" className="w-8 h-8 rounded-full object-cover" alt="" />
                <div>
                  <p className="font-bold text-[#100A18]">Priya Jain</p>
                  <p className="text-[9px] text-[#756B70]">Super Member</p>
                </div>
              </div>

              <div className="bg-[#F8E8EA] border border-[#9E183A]/10 rounded-xl p-2 text-[10px]">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-[#6E1231]">Profile Complete</span>
                  <span className="font-bold text-[#9E183A]">92%</span>
                </div>
                <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                  <div className="bg-[#9E183A] h-full w-[92%]"></div>
                </div>
              </div>

              <button className="w-full bg-[#9E183A] text-white py-1.5 rounded-lg text-[10px] font-bold shadow-sm">
                Complete Profile
              </button>
            </div>

            {/* Bottom Nav Bar */}
            <div className="bg-[#100A18] text-[#F3D59B] p-2 rounded-2xl flex justify-around text-[9px] text-center">
              <div className="text-[#D6A24A] font-bold">🏠<br/>Home</div>
              <div>💕<br/>Matches</div>
              <div>📩<br/>Interests</div>
              <div>👤<br/>Profile</div>
            </div>
          </div>

          {/* SCREEN 2: Matches Card */}
          <div className="bg-white border border-[#D6A24A]/30 rounded-3xl p-3 shadow-md space-y-2 text-xs">
            <div className="flex justify-between items-center pb-1 border-b border-gray-100 font-bold text-xs text-[#100A18]">
              <span>Matches</span>
              <span className="text-[10px] text-[#9E183A]">For You</span>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="bg-gray-50 p-2 rounded-xl border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-800">Rahul Jain</p>
                  <p className="text-[9px] text-gray-500">28 • Software Engineer</p>
                </div>
                <span className="text-emerald-600 font-bold text-[9px]">92% Match</span>
              </div>

              <div className="bg-gray-50 p-2 rounded-xl border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-800">Mehul Shah</p>
                  <p className="text-[9px] text-gray-500">27 • Chartered Accountant</p>
                </div>
                <span className="text-emerald-600 font-bold text-[9px]">89% Match</span>
              </div>

              <div className="bg-gray-50 p-2 rounded-xl border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-800">Harsh Jain</p>
                  <p className="text-[9px] text-gray-500">30 • Product Manager</p>
                </div>
                <span className="text-emerald-600 font-bold text-[9px]">85% Match</span>
              </div>
            </div>
          </div>

          {/* SCREEN 3: Match Details */}
          <div className="bg-white border border-[#D6A24A]/30 rounded-3xl p-3 shadow-md space-y-2 text-xs flex flex-col justify-between">
            <div className="space-y-2">
              <div className="relative rounded-xl overflow-hidden h-24 bg-gray-900">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
                  alt="Aarav Jain"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1.5 right-1.5 bg-[#6E1231]/90 text-[#F3D59B] text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                  92% Match
                </div>
              </div>

              <div>
                <p className="font-serif font-bold text-sm text-[#100A18]">Aarav Jain</p>
                <p className="text-[9px] text-gray-500">28 • Business Analyst • Mumbai</p>
              </div>

              <div className="bg-gray-50 p-1.5 rounded-lg border border-gray-100 space-y-0.5 text-[8px] text-gray-600">
                <p>✓ Shwetambar Oswal</p>
                <p>✓ Education preferences match</p>
                <p>✓ Diet preferences match</p>
              </div>
            </div>

            <button className="w-full btn-ruby py-1.5 text-[9px] rounded-lg font-bold">
              Send Interest
            </button>
          </div>

          {/* SCREEN 4: Interests Received */}
          <div className="bg-white border border-[#D6A24A]/30 rounded-3xl p-3 shadow-md space-y-2 text-xs">
            <div className="font-bold text-[#100A18] text-xs pb-1 border-b border-gray-100">Interests</div>
            
            <div className="space-y-1.5 pt-1 text-[9px]">
              <div className="bg-gray-50 p-1.5 rounded-xl border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-800">Priya Shah</p>
                  <p className="text-[8px] text-gray-500">26 • Delhi</p>
                </div>
                <div className="flex gap-1 scale-90">
                  <button className="bg-emerald-600 text-white px-2 py-0.5 rounded">✓</button>
                  <button className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded">✕</button>
                </div>
              </div>

              <div className="bg-gray-50 p-1.5 rounded-xl border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-800">Neha Jain</p>
                  <p className="text-[8px] text-gray-500">25 • Jaipur</p>
                </div>
                <div className="flex gap-1 scale-90">
                  <button className="bg-emerald-600 text-white px-2 py-0.5 rounded">✓</button>
                  <button className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded">✕</button>
                </div>
              </div>

              <div className="bg-gray-50 p-1.5 rounded-xl border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-800">Ritika Jain</p>
                  <p className="text-[8px] text-gray-500">27 • Indore</p>
                </div>
                <div className="flex gap-1 scale-90">
                  <button className="bg-emerald-600 text-white px-2 py-0.5 rounded">✓</button>
                  <button className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded">✕</button>
                </div>
              </div>
            </div>
          </div>

          {/* SCREEN 5: Connections */}
          <div className="bg-white border border-[#D6A24A]/30 rounded-3xl p-3 shadow-md space-y-2 text-xs">
            <div className="font-bold text-[#100A18] text-xs pb-1 border-b border-gray-100">Connections</div>

            <div className="space-y-1.5 pt-1 text-[9px]">
              <div className="bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                <p className="font-bold text-gray-800">Ritika Shah</p>
                <p className="text-[8px] text-emerald-600 font-semibold mb-1">Connected 20 May</p>
                <button className="w-full bg-[#F8E8EA] text-[#6E1231] py-0.5 rounded text-[8px] font-bold border border-[#9E183A]/10">
                  View Contact
                </button>
              </div>

              <div className="bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                <p className="font-bold text-gray-800">Aarav Jain</p>
                <p className="text-[8px] text-emerald-600 font-semibold mb-1">Connected 18 May</p>
                <button className="w-full bg-[#F8E8EA] text-[#6E1231] py-0.5 rounded text-[8px] font-bold border border-[#9E183A]/10">
                  View Contact
                </button>
              </div>
            </div>
          </div>

          {/* SCREEN 6: Digital Biodata Preview */}
          <div className="bg-white border border-[#D6A24A]/30 rounded-3xl p-3 shadow-md space-y-2 text-xs flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center border-b border-gray-100 pb-1">
                <span className="font-serif font-bold text-xs text-[#6E1231]">Digital Biodata</span>
              </div>

              <div className="bg-gray-50 p-2 rounded-xl border border-gray-100 space-y-1.5 text-[8px] text-gray-600">
                <p><strong>Name:</strong> Aarav Jain</p>
                <p><strong>DOB:</strong> 12 May 1997</p>
                <p><strong>Height:</strong> 5'9"</p>
                <p><strong>Sect:</strong> Shwetambar</p>
                <p><strong>Community:</strong> Oswal</p>
                <p><strong>Father:</strong> Businessman</p>
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <button className="w-full btn-ruby py-1.5 text-[9px] rounded-lg font-bold flex items-center justify-center gap-1">
                <Download className="w-3 h-3" /> Download PDF
              </button>
              <button className="w-full bg-white border border-[#D6A24A]/35 text-[#6E1231] py-1 text-[9px] rounded-lg font-semibold flex items-center justify-center gap-1">
                <Share2 className="w-3 h-3" /> Share Biodata
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
