import React from 'react';
import { Heart, X, Bookmark, CheckCircle, ShieldCheck, Download, Share2, PhoneCall } from 'lucide-react';

export const MatchingBiodataSection: React.FC = () => {
  return (
    <section className="py-20 bg-[#FFF9F1] px-4 sm:px-6 lg:px-8 border-b border-[#D6A24A]/20 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#9E183A] bg-[#F8E8EA] px-3 py-1 rounded-full border border-[#9E183A]/20">
            THE JAINSAATHI EXPERIENCE
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#241A20]">
            After Profile Completed – <span className="text-[#6E1231]">Find Your Perfect Match</span>
          </h2>
          <p className="text-sm text-[#756B70] max-w-xl mx-auto">
            Experience seamless compatibility recommendations, digital biodata generation, private contact reveals, and family-approved connections.
          </p>
        </div>

        {/* Horizontal Mobile App Experience Carousel matching reference design image */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 pt-4">
          
          {/* SCREEN 1: Dashboard Home */}
          <div className="bg-[#FFF9F1] border border-[#D6A24A]/40 rounded-3xl p-3 shadow-xl space-y-3 text-xs flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-[#D6A24A]/20">
                <span className="font-serif font-bold text-sm text-[#6E1231]">JainSaathi</span>
                <span className="text-gray-400">🔔</span>
              </div>

              <div>
                <p className="font-bold text-sm text-[#241A20]">Hi, Priya 👋</p>
                <p className="text-[10px] text-[#756B70]">Welcome Back!</p>
              </div>

              <div className="bg-[#D6A24A]/15 border border-[#D6A24A]/40 rounded-xl p-2 text-[10px] flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#6E1231]">Premium Member</p>
                  <p className="text-[9px] text-[#756B70]">Valid till 25 May 2026</p>
                </div>
                <span>✨</span>
              </div>

              <div className="grid grid-cols-3 gap-1 text-center py-1 bg-white rounded-xl border border-gray-200">
                <div>
                  <p className="font-bold text-[#6E1231]">24</p>
                  <p className="text-[8px] text-gray-500">Matches</p>
                </div>
                <div>
                  <p className="font-bold text-[#6E1231]">12</p>
                  <p className="text-[8px] text-gray-500">Interests</p>
                </div>
                <div>
                  <p className="font-bold text-[#6E1231]">05</p>
                  <p className="text-[8px] text-gray-500">Shortlisted</p>
                </div>
              </div>

              <div className="space-y-1 pt-1 text-[10px]">
                <div className="bg-white p-2 rounded-lg border border-gray-100 flex items-center justify-between">
                  <span className="font-semibold text-gray-700">Recommended Matches</span>
                  <span className="text-[#9E183A]">›</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-gray-100 flex items-center justify-between">
                  <span className="font-semibold text-gray-700">Who Viewed You</span>
                  <span className="text-[#9E183A]">›</span>
                </div>
              </div>
            </div>

            {/* Bottom Nav Bar */}
            <div className="bg-[#100A18] text-[#F3D59B] p-2 rounded-2xl flex justify-around text-[9px] text-center pt-2">
              <div className="text-[#D6A24A] font-bold">🏠<br/>Home</div>
              <div>💕<br/>Matches</div>
              <div>📩<br/>Interests</div>
              <div>👤<br/>Profile</div>
            </div>
          </div>

          {/* SCREEN 2: Matches Card Stack */}
          <div className="bg-[#FFF9F1] border border-[#D6A24A]/40 rounded-3xl p-3 shadow-xl space-y-2 text-xs">
            <div className="flex justify-between items-center pb-1 font-bold text-[#241A20] text-xs">
              <span>Matches</span>
              <span className="text-[10px] text-[#9E183A]">For You</span>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-[#D6A24A]/30 bg-[#100A18] h-48">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
                alt="Ritika Shah"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-[#6E1231] text-[#F3D59B] text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#D6A24A]/40">
                92% Match
              </div>
              <div className="absolute bottom-2 left-2 text-white">
                <p className="font-serif font-bold text-sm">Ritika Shah</p>
                <p className="text-[9px] text-[#F3D59B]">26 · 5'4" · Mumbai</p>
              </div>
            </div>

            <div className="text-[10px] space-y-0.5 text-gray-700 bg-white p-2 rounded-xl border border-gray-100">
              <p className="font-semibold text-[#6E1231]">Oswal · Shwetambar</p>
              <p>MBA · Business Analyst</p>
            </div>

            <div className="flex justify-around pt-1">
              <button className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 shadow-sm">
                <X className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-full bg-white border border-[#D6A24A] flex items-center justify-center text-[#D6A24A] shadow-sm">
                <Bookmark className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-full bg-[#9E183A] text-white flex items-center justify-center shadow-md">
                <Heart className="w-4 h-4 fill-current text-[#F3D59B]" />
              </button>
            </div>
          </div>

          {/* SCREEN 3: Match Details */}
          <div className="bg-[#FFF9F1] border border-[#D6A24A]/40 rounded-3xl p-3 shadow-xl space-y-2 text-xs">
            <div className="font-bold text-[#241A20] text-xs">Match Details</div>
            
            <div className="relative rounded-xl overflow-hidden h-28 bg-gray-900">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
                alt="Ritika Shah"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-serif font-bold text-sm text-[#241A20]">Ritika Shah</span>
                <span className="bg-[#6E1231] text-[#F3D59B] text-[8px] px-1.5 py-0.5 rounded-full font-bold">92%</span>
              </div>
              <p className="text-[9px] text-gray-500">26 · 5'4" · Mumbai</p>
            </div>

            <div className="flex gap-1 text-[8px]">
              <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200">✓ Verified Profile</span>
              <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200">✓ ID Verified</span>
            </div>

            <div className="bg-white p-2 rounded-xl border border-gray-100 space-y-1 text-[9px]">
              <p className="font-bold text-[#6E1231]">Why You Match</p>
              <p className="text-gray-600">✓ Community preferences match</p>
              <p className="text-gray-600">✓ Education preferences match</p>
              <p className="text-gray-600">✓ Lifestyle preferences match</p>
            </div>

            <div className="flex gap-1 pt-1">
              <button className="btn-ruby py-1.5 text-[10px] flex-1 rounded-lg">Interested</button>
              <button className="btn-gold-outline py-1.5 text-[10px] px-2 rounded-lg text-[#6E1231]">Shortlist</button>
            </div>
          </div>

          {/* SCREEN 4: Interests Tab */}
          <div className="bg-[#FFF9F1] border border-[#D6A24A]/40 rounded-3xl p-3 shadow-xl space-y-2 text-xs">
            <div className="font-bold text-[#241A20] text-xs">Interests</div>
            <div className="flex border-b border-gray-200 text-[10px] font-semibold">
              <span className="text-[#9E183A] border-b-2 border-[#9E183A] pb-1 px-1">Received (12)</span>
              <span className="text-gray-400 px-2">Sent (08)</span>
            </div>

            <div className="space-y-2 text-[10px]">
              <div className="bg-white p-2 rounded-xl border border-gray-100 space-y-1.5">
                <div className="flex items-center gap-2">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80" className="w-7 h-7 rounded-full object-cover" alt="" />
                  <div>
                    <p className="font-bold text-[#241A20]">Aarav Jain</p>
                    <p className="text-[8px] text-gray-500">28 · Mumbai</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="bg-[#3E8B68] text-white py-0.5 px-2 rounded text-[9px] font-bold flex-1">Accept</button>
                  <button className="bg-gray-100 text-gray-600 py-0.5 px-2 rounded text-[9px] flex-1">Decline</button>
                </div>
              </div>

              <div className="bg-white p-2 rounded-xl border border-gray-100 space-y-1.5">
                <div className="flex items-center gap-2">
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80" className="w-7 h-7 rounded-full object-cover" alt="" />
                  <div>
                    <p className="font-bold text-[#241A20]">Mehul Shah</p>
                    <p className="text-[8px] text-gray-500">29 · Pune</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="bg-[#3E8B68] text-white py-0.5 px-2 rounded text-[9px] font-bold flex-1">Accept</button>
                  <button className="bg-gray-100 text-gray-600 py-0.5 px-2 rounded text-[9px] flex-1">Decline</button>
                </div>
              </div>
            </div>
          </div>

          {/* SCREEN 5: Connections Tab */}
          <div className="bg-[#FFF9F1] border border-[#D6A24A]/40 rounded-3xl p-3 shadow-xl space-y-2 text-xs">
            <div className="font-bold text-[#241A20] text-xs">Connections</div>
            <div className="flex text-[9px] text-gray-500 gap-1 pb-1">
              <span className="font-bold text-[#6E1231]">All (8)</span>
              <span>• Accepted (6)</span>
            </div>

            <div className="space-y-2 text-[10px]">
              <div className="bg-white p-2 rounded-xl border border-gray-100 space-y-1">
                <div className="flex items-center gap-2">
                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80" className="w-7 h-7 rounded-full object-cover" alt="" />
                  <div>
                    <p className="font-bold text-[#241A20]">Ritika Shah</p>
                    <p className="text-[8px] text-emerald-600 font-semibold">Connected 20 May</p>
                  </div>
                </div>
                <button className="w-full bg-[#F8E8EA] text-[#6E1231] py-1 rounded text-[9px] font-bold border border-[#9E183A]/20">
                  View Contact
                </button>
              </div>

              <div className="bg-white p-2 rounded-xl border border-gray-100 space-y-1">
                <div className="flex items-center gap-2">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80" className="w-7 h-7 rounded-full object-cover" alt="" />
                  <div>
                    <p className="font-bold text-[#241A20]">Aarav Jain</p>
                    <p className="text-[8px] text-emerald-600 font-semibold">Connected 18 May</p>
                  </div>
                </div>
                <button className="w-full bg-[#F8E8EA] text-[#6E1231] py-1 rounded text-[9px] font-bold border border-[#9E183A]/20">
                  View Contact
                </button>
              </div>
            </div>
          </div>

          {/* SCREEN 6: Digital Biodata Preview */}
          <div className="bg-[#FFF9F1] border border-[#D6A24A]/40 rounded-3xl p-3 shadow-xl space-y-2 text-xs flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex justify-between items-center border-b border-[#D6A24A]/30 pb-1">
                <span className="font-serif font-bold text-xs text-[#6E1231]">JainSaathi</span>
                <span className="text-[8px] font-bold text-[#D6A24A] uppercase tracking-wider">Digital Biodata</span>
              </div>

              <div className="bg-white p-2 rounded-xl border border-gray-200 space-y-2 text-[9px]">
                <div className="flex items-center gap-2">
                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80" className="w-8 h-8 rounded-full object-cover" alt="" />
                  <div>
                    <p className="font-bold text-[#241A20]">Ritika Shah</p>
                    <p className="text-gray-500 text-[8px]">MBA · Business Analyst</p>
                  </div>
                </div>
                <div className="space-y-1 text-gray-600 border-t border-gray-100 pt-1 text-[8px]">
                  <p><strong>DOB:</strong> 15 Oct 1999</p>
                  <p><strong>Height:</strong> 5'4"</p>
                  <p><strong>Sect:</strong> Shwetambar</p>
                  <p><strong>Community:</strong> Oswal</p>
                  <p><strong>Gotra:</strong> Self (Shah) Mama (Mehta)</p>
                  <p><strong>Father:</strong> Businessman (Mumbai)</p>
                </div>
              </div>
            </div>

            <div className="space-y-1 pt-2">
              <button className="w-full btn-ruby py-1.5 text-[10px] rounded-lg font-bold flex items-center justify-center gap-1">
                <Download className="w-3 h-3" /> Download PDF
              </button>
              <button className="w-full bg-white border border-[#D6A24A]/40 text-[#6E1231] py-1 text-[10px] rounded-lg font-semibold flex items-center justify-center gap-1">
                <Share2 className="w-3 h-3" /> Share Biodata
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
