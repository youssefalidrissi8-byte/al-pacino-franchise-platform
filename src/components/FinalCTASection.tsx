import React from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { Crown, Sparkles, ArrowUpRight, MessageCircle } from 'lucide-react';
import { scrollToSection } from '../utils/scrollHelper';

export const FinalCTASection: React.FC = () => {
  const { lang, content } = useApp();
  const cta = content.finalCta;

  return (
    <section
      id="final-cta"
      className="relative py-20 sm:py-28 bg-[#0A0A0A] overflow-hidden border-b border-[#2B2338] scroll-mt-24"
    >
      {/* Background Lighting & Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#4B0082]/15 to-[#0A0A0A]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#4B0082]/25 rounded-full blur-[170px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
        {/* Crown Icon Emblem */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4B0082] via-[#6B1B8A] to-[#C19B4A] p-0.5 shadow-2xl shadow-black/60 mb-6 flex items-center justify-center"
        >
          <div className="w-full h-full bg-[#1A1128] rounded-[14px] flex items-center justify-center">
            <Crown className="w-7 h-7 text-[#C19B4A]" />
          </div>
        </motion.div>

        {/* English & Arabic Title */}
        <div className="text-xs sm:text-sm font-bold text-[#C19B4A] tracking-widest uppercase font-['Outfit'] mb-2.5">
          {cta.titleEn}
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.2] max-w-3xl">
          {lang === 'ar' ? cta.titleAr : cta.titleEn}
        </h2>

        {/* Main Golden Statement: INVEST. WE OPERATE. GROW TOGETHER */}
        <div className="mt-4 text-xl sm:text-2xl md:text-3xl font-extrabold text-[#C19B4A] tracking-wide">
          "{lang === 'ar' ? cta.finalStatementAr : cta.finalStatementEn}"
        </div>

        {/* Supporting Taglines */}
        <p className="mt-4 text-base sm:text-lg text-gray-300 font-medium max-w-xl">
          {lang === 'ar' ? cta.supportingTaglineAr : cta.supportingTaglineEn}
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-md">
          <a
            href="#investor-form"
            onClick={(e) => scrollToSection('investor-form', e)}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-sm text-black bg-[#C19B4A] hover:bg-[#D4AF37] shadow-xl shadow-[#C19B4A]/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{lang === 'ar' ? cta.ctaTextAr : cta.ctaTextEn}</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>

          {content.contact.whatsapp && (
            <a
              href={`https://wa.me/${content.contact.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                lang === 'ar' ? 'مرحباً، أود التحدث مع مسؤول الاستثمار والشراكات في الباتشينو بروستد.' : 'Hello, I would like to speak with the AL PACINO investment director.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-full font-bold text-xs sm:text-sm text-emerald-400 bg-[#1A1128] hover:bg-[#251A38] border border-emerald-500/30 transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{lang === 'ar' ? 'محادثة فورية عبر واتساب' : 'WhatsApp Direct'}</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
};
