import React from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { Plus, Equal, Sparkles, User, ShieldCheck, TrendingUp, Check } from 'lucide-react';

export const JVModelSection: React.FC = () => {
  const { lang, content } = useApp();
  const jv = content.jvModel;

  return (
    <section
      id="jv-model"
      className="relative py-20 sm:py-28 bg-[#0A0A0A] overflow-hidden border-b border-[#2B2338] scroll-mt-24"
    >
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#4B0082]/15 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A1128] border border-[#C19B4A]/30 text-xs font-semibold text-[#C19B4A] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'نموذج التوسع المشترك' : 'Joint Venture Framework'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            {lang === 'ar' ? jv.titleAr : jv.titleEn}
          </h2>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#C19B4A] mt-3">
            "{lang === 'ar' ? jv.mainStatementAr : jv.mainStatementEn}"
          </div>
          <p className="mt-3 text-base sm:text-lg text-gray-300 font-normal max-w-2xl mx-auto leading-relaxed">
            {lang === 'ar' ? jv.explanationAr : jv.explanationEn}
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-[#4B0082] via-[#C19B4A] to-[#4B0082] mx-auto mt-5 rounded-full" />
        </div>

        {/* Visual Equation Card */}
        <div className="mb-8">
          <div className="p-6 sm:p-10 rounded-3xl bg-[#1A1128] border border-[#C19B4A]/25 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-11 gap-5 items-center">
              {/* Partner Side */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-3 p-5 sm:p-6 rounded-2xl bg-black/40 border border-white/10 text-center shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-[#4B0082]/70 border border-[#C19B4A]/30 mx-auto flex items-center justify-center text-[#C19B4A] mb-3 shadow-lg">
                  <User className="w-6 h-6" />
                </div>
                <div className="text-[11px] uppercase tracking-wider text-purple-300 font-bold mb-1">
                  {lang === 'ar' ? 'طرف الشريك' : 'Partner Side'}
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">
                  {lang === 'ar' ? jv.equationPartnerAr : jv.equationPartnerEn}
                </div>
                <ul className="mt-3.5 space-y-2 text-xs text-gray-300 text-start">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#C19B4A] shrink-0" />
                    <span>{lang === 'ar' ? 'تمويل رأس مال الفرع' : 'Branch Capex Funding'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#C19B4A] shrink-0" />
                    <span>{lang === 'ar' ? 'حق الانتفاع والأرباح' : 'Usufruct & Profit Share'}</span>
                  </li>
                </ul>
              </motion.div>

              {/* Plus Sign */}
              <div className="lg:col-span-1 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-[#1A1128] border border-[#C19B4A]/40 flex items-center justify-center text-[#C19B4A] shadow-lg">
                  <Plus className="w-5 h-5" />
                </div>
              </div>

              {/* Pacino Management Side */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-3 p-5 sm:p-6 rounded-2xl bg-black/40 border border-white/10 text-center shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-[#4B0082]/70 border border-[#C19B4A]/30 mx-auto flex items-center justify-center text-[#C19B4A] mb-3 shadow-lg">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="text-[11px] uppercase tracking-wider text-purple-300 font-bold mb-1">
                  {lang === 'ar' ? 'طرف AL PACINO' : 'AL PACINO Management'}
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">
                  {lang === 'ar' ? jv.equationPacinoAr : jv.equationPacinoEn}
                </div>
                <ul className="mt-3.5 space-y-2 text-xs text-gray-300 text-start">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#C19B4A] shrink-0" />
                    <span>{lang === 'ar' ? 'إدارة وتشغيل يومي بالكامل' : '100% Turnkey Operations'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#C19B4A] shrink-0" />
                    <span>{lang === 'ar' ? 'سلاسل التوريد والتدريب' : 'Supply Chain & Training'}</span>
                  </li>
                </ul>
              </motion.div>

              {/* Equals Sign */}
              <div className="lg:col-span-1 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-[#1A1128] border border-[#C19B4A]/40 flex items-center justify-center text-[#C19B4A] shadow-lg">
                  <Equal className="w-5 h-5" />
                </div>
              </div>

              {/* Outcome Side */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-3 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#2D0A35] to-[#17051C] border-2 border-[#C19B4A] text-center shadow-xl shadow-black/50"
              >
                <div className="w-12 h-12 rounded-xl bg-[#C19B4A] mx-auto flex items-center justify-center text-black mb-3 shadow-lg">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="text-[11px] uppercase tracking-wider text-[#C19B4A] font-bold mb-1">
                  {lang === 'ar' ? 'النتيجة الاستراتيجية' : 'Strategic Outcome'}
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">
                  {lang === 'ar' ? jv.equationOutcomeAr : jv.equationOutcomeEn}
                </div>
                <div className="mt-2.5 text-xs text-gray-200">
                  {lang === 'ar' ? 'نمو الأرباح وتعظيم القيمة الاستثمارية' : 'Maximizing enterprise value and returns'}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
