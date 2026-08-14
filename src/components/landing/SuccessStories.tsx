import React from 'react';

export const SuccessStories: React.FC = () => {
  return (
    <section id="stories" className="bg-[#F8F1E8] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#D6A24A]/25">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Title */}
        <div className="text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#100A18]">
            Beautiful Beginnings
          </h2>
          <p className="text-xs font-semibold tracking-wider text-[#9E183A] uppercase mt-2">
            Real stories. Real connections.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Testimonial Block (7 Cols) */}
          <div className="lg:col-span-7 bg-[#FFF9F1] border border-[#D6A24A]/30 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row gap-6 items-center">
            <img
              src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400"
              alt="Testimonial Couple"
              className="w-32 h-32 rounded-2xl object-cover border border-[#D6A24A]/30 shrink-0"
            />
            <div className="space-y-4">
              <p className="font-serif italic text-base text-[#100A18] leading-relaxed">
                "We found not just each other, but also a family that shares our values and traditions."
              </p>
              <div>
                <p className="font-bold text-sm text-[#6E1231]">- Riya & Meet, Mumbai</p>
              </div>
            </div>
          </div>

          {/* Stats Box (5 Cols) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="bg-white border border-[#D6A24A]/25 rounded-2xl p-4 text-center shadow-sm">
              <p className="font-serif text-2xl font-bold text-[#6E1231]">25K+</p>
              <p className="text-[10px] text-[#756B70] font-medium mt-1">Profiles Created</p>
            </div>
            <div className="bg-white border border-[#D6A24A]/25 rounded-2xl p-4 text-center shadow-sm">
              <p className="font-serif text-2xl font-bold text-[#6E1231]">10K+</p>
              <p className="text-[10px] text-[#756B70] font-medium mt-1">Successful Matches</p>
            </div>
            <div className="bg-white border border-[#D6A24A]/25 rounded-2xl p-4 text-center shadow-sm">
              <p className="font-serif text-2xl font-bold text-[#6E1231]">15+</p>
              <p className="text-[10px] text-[#756B70] font-medium mt-1">Jain Communities</p>
            </div>
            <div className="bg-white border border-[#D6A24A]/25 rounded-2xl p-4 text-center shadow-sm">
              <p className="font-serif text-2xl font-bold text-[#6E1231]">24/7</p>
              <p className="text-[10px] text-[#756B70] font-medium mt-1">Dedicated Support</p>
            </div>
          </div>
        </div>

        {/* Search Subscription Banner */}
        <div className="bg-gradient-to-r from-[#6E1231] to-[#100A18] rounded-3xl p-8 sm:p-10 border border-[#D6A24A]/30 text-center space-y-6 shadow-xl relative overflow-hidden mt-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(214,162,74,0.1),transparent_70%)] pointer-events-none" />
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Your Search for the Right Jain Saathi Starts Here
          </h3>
          <p className="text-xs text-[#F3D59B] max-w-md mx-auto">
            Join thousands of families who have found compatible matches based on values, traditions, and lifestyle.
          </p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-2 pt-2">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 bg-white/10 border border-[#D6A24A]/40 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#D6A24A]"
            />
            <button className="bg-[#9E183A] text-white text-xs font-semibold px-6 py-3 rounded-xl hover:bg-[#80122E] transition-all">
              Get Started
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
