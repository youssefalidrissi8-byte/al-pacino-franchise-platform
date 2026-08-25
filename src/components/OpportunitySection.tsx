import React from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { Sparkles, Building2, UserCheck, ShieldAlert, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { scrollToSection } from '../utils/scrollHelper';

export const OpportunitySection: React.FC = () => {
  const { lang, content } = useApp();
  const opp = content.opportunity;

  return (
    <section
      id="opportunity"
      className="relative py-20 sm:py-28 bg-[#0A0A0A] overflow-hidden border-b border-[#2B2338] scroll-mt-24"
    >
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-0 w-[450px] h-[450px] bg-[#4B0082]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#C19B4A]/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A1128] border border-[#C19B4A]/30 text-xs font-semibold text-[#C19B4A] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? opp.modelBadgeAr : opp.modelBadgeEn}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            {lang === 'ar' ? opp.titleAr : opp.titleEn}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#4B0082] via-[#C19B4A] to-[#4B0082] mx-auto mt-4 rounded-full" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Column: Text & Narrative */}
          <div className="lg:col-span-7 space-y-5">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#1A1128] border border-[#C19B4A]/20 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#4B0082]/20 rounded-bl-full pointer-events-none" />
              <p className="text-lg sm:text-xl text-[#F5F5F0] leading-relaxed font-normal">
                {lang === 'ar' ? opp.paragraph1Ar : opp.paragraph1En}
              </p>

              <div className="my-5 border-t border-[#2B2338]" />

              <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-normal">
                {lang === 'ar' ? opp.paragraph2Ar : opp.paragraph2En}
              </p>
            </div>

            {/* Key Highlight Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-[#2A1035] via-[#3E1643] to-[#200A28] border border-[#C19B4A]/40 shadow-xl shadow-purple-950/30 flex flex-col sm:flex-row items-center justify-between gap-6"
            >
              <div className="space-y-1 text-center sm:text-start">
                <span className="text-xs uppercase tracking-widest text-[#C19B4A] font-semibold">
                  {lang === 'ar' ? 'المعادلة الذهبية للشراكة' : 'The Golden Equation'}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  "{lang === 'ar' ? opp.highlightTextAr : opp.highlightTextEn}"
                </h3>
              </div>
              <a
                href="#investor-form"
                onClick={(e) => scrollToSection('investor-form', e)}
                className="px-6 py-3 rounded-xl font-bold text-sm text-black bg-[#C19B4A] hover:bg-[#D4AF37] shadow-md shrink-0 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>{lang === 'ar' ? 'انضم كشريك' : 'Join as Partner'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </motion.div>
          </div>

          {/* Right Column: Key Pillars of the JV Model */}
          <div className="lg:col-span-5 space-y-3.5">
            <div className="p-5 rounded-xl bg-[#1A1128] border border-[#C19B4A]/20 hover:border-[#C19B4A]/50 transition flex items-start gap-4 shadow-lg">
              <div className="w-11 h-11 rounded-lg bg-[#4B0082]/70 border border-[#C19B4A]/30 flex items-center justify-center shrink-0 text-[#C19B4A]">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white mb-1">
                  {lang === 'ar' ? 'توسع جغرافي مدروس' : 'Strategic Expansion'}
                </h4>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  {lang === 'ar'
                    ? 'اختيار أفضل المواقع التجارية الحيوية بالمدن السعودية بناءً على دراسات كثافة وحركة عملاء دقيقة.'
                    : 'Selecting prime commercial real estate with high foot-traffic based on verified demographic data.'}
                </p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#1A1128] border border-[#C19B4A]/20 hover:border-[#C19B4A]/50 transition flex items-start gap-4 shadow-lg">
              <div className="w-11 h-11 rounded-lg bg-[#4B0082]/70 border border-[#C19B4A]/30 flex items-center justify-center shrink-0 text-[#C19B4A]">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white mb-1">
                  {lang === 'ar' ? 'تشغيل احترافي كامل 100%' : '100% Turnkey Operations'}
                </h4>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  {lang === 'ar'
                    ? 'يتولى طاقم الباتشينو إدارة شؤون الفرع والعمالة وسلاسل الإمداد ومراقبة الجودة اليومية.'
                    : 'AL PACINO handles store staffing, day-to-day culinary execution, and strict QA protocols.'}
                </p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#1A1128] border border-[#C19B4A]/20 hover:border-[#C19B4A]/50 transition flex items-start gap-4 shadow-lg">
              <div className="w-11 h-11 rounded-lg bg-[#4B0082]/70 border border-[#C19B4A]/30 flex items-center justify-center shrink-0 text-[#C19B4A]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white mb-1">
                  {lang === 'ar' ? 'شفافية وتقارير أداء دورية' : 'Transparent Financial Reporting'}
                </h4>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  {lang === 'ar'
                    ? 'نظام محاسبي متطور يوفر للشريك تقارير دورية واضحة حول المبيعات والأرباح ونمو الفرع.'
                    : 'Advanced POS & accounting analytics providing transparent revenue and unit economics tracking.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
