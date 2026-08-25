import React from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { Sparkles, ArrowDown, ArrowUpRight } from 'lucide-react';
import { scrollToSection } from '../utils/scrollHelper';

export const JVJourneySection: React.FC = () => {
  const { lang, content } = useApp();
  const journey = content.jvJourney;

  return (
    <section
      id="jv-journey"
      className="relative py-20 sm:py-28 bg-[#0A0A0A] overflow-hidden border-b border-[#2B2338] scroll-mt-24"
    >
      {/* Decorative Background Lighting */}
      <div className="absolute top-1/2 left-1/3 w-[600px] h-[350px] bg-[#4B0082]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A1128] border border-[#C19B4A]/30 text-xs font-semibold text-[#C19B4A] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'خارطة طريق الشراكة' : 'Partnership Roadmap'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            {lang === 'ar' ? journey.titleAr : journey.titleEn}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-gray-300 font-normal">
            {lang === 'ar' ? journey.subtitleAr : journey.subtitleEn}
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-[#4B0082] via-[#C19B4A] to-[#4B0082] mx-auto mt-4 rounded-full" />
        </div>

        {/* 8-step Timeline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 relative">
          {journey.steps.map((step, index) => (
            <motion.div
              key={step.stepNumber || index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="p-5 sm:p-6 rounded-2xl bg-[#1A1128] border border-[#C19B4A]/20 hover:border-[#C19B4A]/50 shadow-xl transition-all duration-300 group hover:-translate-y-1 flex flex-col justify-between relative"
            >
              <div>
                {/* Step Header */}
                <div className="flex items-center justify-between mb-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#4B0082]/70 border border-[#C19B4A]/30 flex items-center justify-center text-[#C19B4A] font-black text-base font-['Outfit'] shadow-md group-hover:scale-105 transition-transform">
                    {step.stepNumber}
                  </div>
                  <div className="h-[1px] flex-1 mx-3 bg-[#2B2338] group-hover:bg-[#C19B4A]/40 transition-colors" />
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white mb-1.5 group-hover:text-[#C19B4A] transition-colors">
                  {lang === 'ar' ? step.titleAr : step.titleEn}
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">
                  {lang === 'ar' ? step.descAr : step.descEn}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-[#2B2338] flex items-center justify-between text-[11px] text-gray-400">
                <span>{lang === 'ar' ? `المرحلة ${index + 1}` : `Phase ${index + 1}`}</span>
                <span className="text-[#C19B4A]">✦</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Prompt */}
        <div className="mt-12 text-center">
          <a
            href="#investor-form"
            onClick={(e) => scrollToSection('investor-form', e)}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm text-black bg-[#C19B4A] hover:bg-[#D4AF37] shadow-lg shadow-[#C19B4A]/20 transition-all cursor-pointer"
          >
            <span>{lang === 'ar' ? 'ابدأ الخطوة الأولى الآن (01)' : 'Start Phase 01 Now'}</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
