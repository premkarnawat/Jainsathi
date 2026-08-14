import React from 'react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      id: '01',
      title: 'Create Profile',
      desc: 'Create your profile or let your parents create for you.',
    },
    {
      id: '02',
      title: 'Tell Us About You',
      desc: 'Fill in your details, Jain identity and lifestyle.',
    },
    {
      id: '03',
      title: 'Set Preferences',
      desc: 'Set your partner preferences and expectations.',
    },
    {
      id: '04',
      title: 'Discover Matches',
      desc: 'Get matched with compatible Jain profiles.',
    },
    {
      id: '05',
      title: 'Express Interest',
      desc: 'Show interest in profiles you like.',
    },
    {
      id: '06',
      title: 'Connect & Plan',
      desc: 'After mutual acceptance, connect and start your journey.',
    },
  ];

  return (
    <section id="howitworks" className="py-20 bg-[#FFF9F1] px-4 sm:px-6 lg:px-8 border-b border-[#D6A24A]/25">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#100A18]">
            How JainSaathi Works
          </h2>
          <p className="text-xs font-semibold tracking-wider text-[#9E183A] uppercase">
            A simple journey to meaningful connections
          </p>
        </div>

        {/* Timeline Layout */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6E1231]/10 via-[#D6A24A]/30 to-[#6E1231]/10 -translate-y-1/2 hidden lg:block" />

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center text-center space-y-4 group">
                {/* Step Circle Badge */}
                <div className="w-14 h-14 rounded-full bg-[#FFF9F1] border-2 border-[#D6A24A]/40 flex items-center justify-center font-serif text-lg font-bold text-[#6E1231] shadow-md group-hover:border-[#9E183A] group-hover:scale-105 transition-all duration-300">
                  {step.id}
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-serif font-bold text-base text-[#100A18] group-hover:text-[#6E1231] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-[11px] text-[#756B70] leading-relaxed max-w-[160px] mx-auto font-medium">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
