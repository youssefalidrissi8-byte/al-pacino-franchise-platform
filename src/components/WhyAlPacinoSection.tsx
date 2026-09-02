import React from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { DynamicIcon } from './DynamicIcon';
import { Sparkles } from 'lucide-react';

export const WhyAlPacinoSection: React.FC = () => {
  const { lang, content } = useApp();
  const why = content.whyAlPacino;

  const renderBilingualTitle = () => {
    const title = lang === 'ar' ? why.titleAr : why.titleEn;
    const parts = title.split('|').map((part) => part.trim());

    if (parts.length >= 2) {
      const firstPart = parts[0];
      const secondPart = parts.slice(1).join(' | ');

      if (lang === 'ar') {
        return (
          <>
            <span dir="rtl" className="inline-block">
              {firstPart}
            </span>
            <span className="mx-2 text-[#C19B4A]">|</span>
            <span dir="ltr" className="inline-block font-['Outfit']">
              {secondPart}
            </span>
          </>
        );
      }

      return (
        <>
          <span dir="ltr" className="inline-block font-['Outfit']">
            {firstPart}
          </span>
          <span className="mx-2 text-[#C19B4A]">|</span>
          <span dir="rtl" className="inline-block">
            {secondPart}
          </span>
        </>
      );
    }

    return (
      <span dir={lang === 'ar' ? 'rtl' : 'ltr'} className="inline-block">
        {title}
      </span>
    );
  };

  return (
    <section
      id="why-us"
      className="relative py-20 sm:py-28 bg-[#0A0A0A] overflow-hidden border-b border-[#2B2338] scroll-mt-24"
    >
      {/* Decorative Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#4B0082]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A1128] border border-[#C19B4A]/30 text-xs font-semibold text-[#C19B4A] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {lang === 'ar'
                ? 'مزايا الشراكة الحصرية'
                : 'Exclusive Partnership Advantages'}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            {renderBilingualTitle()}
          </h2>

          <p className="mt-3 text-base sm:text-lg text-gray-300 font-normal">
            {lang === 'ar' ? why.subtitleAr : why.subtitleEn}
          </p>

          <div className="w-20 h-1 bg-gradient-to-r from-[#4B0082] via-[#C19B4A] to-[#4B0082] mx-auto mt-4 rounded-full" />
        </div>

        {/* 6 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {why.cards.map((card, index) => (
            <motion.div
              key={card.id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="p-6 sm:p-7 rounded-2xl bg-[#1A1128] border border-[#C19B4A]/20 hover:border-[#C19B4A]/50 shadow-xl transition-all duration-300 group hover:-translate-y-1 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Corner Glow on Hover */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#4B0082]/30 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div>
                {/* Icon & Number Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-[#4B0082]/80 border border-[#C19B4A]/30 flex items-center justify-center text-[#C19B4A] group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-black/40 transition-all duration-300">
                    <DynamicIcon
                      name={card.icon || 'Sparkles'}
                      className="w-6 h-6"
                    />
                  </div>

                  <span className="text-xl font-black text-white/20 group-hover:text-[#C19B4A]/40 transition-colors font-['Outfit']">
                    0{index + 1}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2.5 group-hover:text-[#F5F5F0] transition-colors">
                  {lang === 'ar' ? card.titleAr : card.titleEn}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-300 leading-relaxed font-normal">
                  {lang === 'ar' ? card.descAr : card.descEn}
                </p>
              </div>

              {/* Bottom Subtle Indicator */}
              <div className="mt-5 pt-3.5 border-t border-[#2B2338] flex items-center justify-between text-xs text-gray-400 group-hover:text-[#C19B4A] transition-colors">
                <span className="font-semibold">
                  {lang === 'ar' ? 'نموذج AL PACINO' : 'AL PACINO Model'}
                </span>
                <span>✦</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};