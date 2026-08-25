import React from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { DynamicIcon } from './DynamicIcon';
import { Sparkles } from 'lucide-react';

export const JVSupportSection: React.FC = () => {
  const { lang, content } = useApp();
  const support = content.jvSupport;

  return (
    <section
      id="jv-support"
      className="relative py-20 sm:py-28 bg-[#0A0A0A] overflow-hidden border-b border-[#2B2338]"
    >
      {/* Decorative Glow */}
      <div className="absolute top-1/4 right-10 w-[500px] h-[500px] bg-[#4B0082]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A1128] border border-[#C19B4A]/30 text-xs font-semibold text-[#C19B4A] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'منظومة الدعم الشامل' : 'Comprehensive Support Ecosystem'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            {lang === 'ar' ? support.titleAr : support.titleEn}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-gray-300 font-normal">
            {lang === 'ar' ? support.subtitleAr : support.subtitleEn}
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-[#4B0082] via-[#C19B4A] to-[#4B0082] mx-auto mt-4 rounded-full" />
        </div>

        {/* 9 Support Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {support.items.map((item, index) => (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.07 }}
              className="p-6 rounded-2xl bg-[#1A1128] border border-[#C19B4A]/20 hover:border-[#C19B4A]/50 shadow-xl transition-all duration-300 group hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="w-11 h-11 rounded-xl bg-[#4B0082]/70 border border-[#C19B4A]/30 flex items-center justify-center text-[#C19B4A] mb-4 group-hover:scale-105 group-hover:shadow-lg transition-all duration-300">
                  <DynamicIcon name={item.icon || 'Sparkles'} className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-[#F5F5F0] transition-colors">
                  {lang === 'ar' ? item.titleAr : item.titleEn}
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">
                  {lang === 'ar' ? item.descAr : item.descEn}
                </p>
              </div>

              <div className="mt-5 pt-2.5 border-t border-[#2B2338] flex items-center justify-between text-xs text-gray-400 group-hover:text-[#C19B4A] transition-colors font-mono">
                <span>0{index + 1}</span>
                <span>SUPPORT PILLAR</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
