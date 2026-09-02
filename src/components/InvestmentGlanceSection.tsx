import React from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { DynamicIcon } from './DynamicIcon';
import { Info, Sparkles } from 'lucide-react';

export const InvestmentGlanceSection: React.FC = () => {
  const { lang, content } = useApp();
  const glance = content.investmentGlance;

  const renderSectionTitle = () => {
    const title = lang === 'ar' ? glance.titleAr : glance.titleEn;
    const parts = title.split('|').map((part) => part.trim());

    if (parts.length >= 2) {
      const arabicPart = lang === 'ar' ? parts[0] : parts[1];
      const englishPart = lang === 'ar' ? parts[1] : parts[0];

      return (
        <div className="flex flex-col items-center gap-2">
          <span dir="rtl" className="block">
            {arabicPart}
          </span>

          <span dir="ltr" className="block font-['Outfit']">
            {englishPart}
          </span>
        </div>
      );
    }

    return (
      <span dir={lang === 'ar' ? 'rtl' : 'ltr'} className="block">
        {title}
      </span>
    );
  };

  return (
    <section
      id="financials"
      className="relative py-20 sm:py-28 bg-[#0A0A0A] overflow-hidden border-b border-[#2B2338] scroll-mt-24"
    >
      {/* Glow Effects */}
      <div className="absolute bottom-10 left-1/4 w-[500px] h-[500px] bg-[#4B0082]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A1128] border border-[#C19B4A]/30 text-xs font-semibold text-[#C19B4A] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {lang === 'ar'
                ? 'البيانات الاستثمارية المبدئية'
                : 'Key Investment Metrics'}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            {renderSectionTitle()}
          </h2>

          <p className="mt-3 text-base sm:text-lg text-gray-300 font-normal">
            {lang === 'ar' ? glance.subtitleAr : glance.subtitleEn}
          </p>

          <div className="w-20 h-1 bg-gradient-to-r from-[#4B0082] via-[#C19B4A] to-[#4B0082] mx-auto mt-4 rounded-full" />
        </div>

        {/* 5 Cards Display */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5 mb-10">
          {glance.metrics.map((m, index) => (
            <motion.div
              key={m.id || index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="p-5 rounded-2xl bg-[#1A1128] border border-[#C19B4A]/20 hover:border-[#C19B4A]/50 shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div>
                <div className="w-11 h-11 rounded-xl bg-[#4B0082]/70 border border-[#C19B4A]/30 flex items-center justify-center text-[#C19B4A] mb-4 group-hover:scale-105 transition-transform">
                  <DynamicIcon name={m.icon || 'Coins'} className="w-5 h-5" />
                </div>

                <div className="text-xl sm:text-2xl font-black text-white group-hover:text-[#C19B4A] transition-colors leading-tight mb-1.5">
                  {lang === 'ar' ? m.valueAr : m.valueEn}
                </div>

                <div className="text-xs sm:text-sm font-bold text-gray-300">
                  {lang === 'ar' ? m.labelAr : m.labelEn}
                </div>
              </div>

              {(m.sublabelAr || m.sublabelEn) && (
                <div className="mt-3.5 pt-2.5 border-t border-[#2B2338] text-[11px] text-gray-400 font-medium">
                  {lang === 'ar' ? m.sublabelAr : m.sublabelEn}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Legal Disclaimer Box */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#1A1128] border border-[#2B2338] flex items-start gap-4 shadow-lg">
          <div className="w-9 h-9 rounded-lg bg-amber-950/60 border border-amber-500/30 flex items-center justify-center shrink-0 text-[#C19B4A] mt-0.5">
            <Info className="w-4 h-4" />
          </div>

          <div className="space-y-1 text-start">
            <div className="text-xs font-bold text-[#C19B4A] uppercase tracking-wider">
              {lang === 'ar'
                ? 'تنويه قانوني واستثماري'
                : 'Legal & Investment Disclaimer'}
            </div>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">
              {lang === 'ar' ? glance.disclaimerAr : glance.disclaimerEn}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};