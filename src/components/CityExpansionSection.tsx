import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { MapPin, Sparkles, ArrowDown, CheckCircle2 } from 'lucide-react';
import { scrollToSection } from '../utils/scrollHelper';

interface CityExpansionSectionProps {
  onSelectCity?: (cityName: string) => void;
}

export const CityExpansionSection: React.FC<CityExpansionSectionProps> = ({ onSelectCity }) => {
  const { lang, content } = useApp();
  const cityExp = content.cityExpansion;
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);

  const handleCityClick = (city: { nameAr: string; nameEn: string; id: string }) => {
    setSelectedCityId(city.id);
    const chosenName = lang === 'ar' ? city.nameAr : city.nameEn;
    if (onSelectCity) {
      onSelectCity(chosenName);
    }
    scrollToSection('investor-form');
  };

  return (
    <section
      id="expansion"
      className="relative py-20 sm:py-28 bg-[#0A0A0A] overflow-hidden border-b border-[#2B2338] scroll-mt-24"
    >
      {/* Glow */}
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[350px] bg-[#4B0082]/15 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A1128] border border-[#C19B4A]/30 text-xs font-semibold text-[#C19B4A] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'خطة التوسع الجغرافي' : 'Expansion Map & Target Cities'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            {lang === 'ar' ? cityExp.titleAr : cityExp.titleEn}
          </h2>
          <div className="text-lg sm:text-xl font-bold text-[#C19B4A] mt-2 font-['Outfit']">
            {lang === 'ar' ? cityExp.titleEn : cityExp.titleAr}
          </div>
          <div className="w-20 h-1 bg-gradient-to-r from-[#4B0082] via-[#C19B4A] to-[#4B0082] mx-auto mt-4 rounded-full" />
        </div>

        {/* Cities Grid with interactive chips */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 mb-12">
          {cityExp.cities.map((city, index) => {
            const isSelected = selectedCityId === city.id;
            return (
              <motion.button
                key={city.id || index}
                type="button"
                onClick={() => handleCityClick(city)}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                className={`p-4 sm:p-5 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-between group cursor-pointer ${
                  isSelected
                    ? 'bg-[#2D0A35] border-[#C19B4A] shadow-lg shadow-black/40 -translate-y-1'
                    : 'bg-[#1A1128] border-[#C19B4A]/20 hover:border-[#C19B4A]/50 hover:bg-[#251A38] hover:-translate-y-1'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-[#4B0082]/70 border border-[#C19B4A]/30 flex items-center justify-center text-[#C19B4A] mb-2.5 group-hover:scale-105 transition-transform">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="text-sm sm:text-base font-bold text-white mb-1">
                  {lang === 'ar' ? city.nameAr : city.nameEn}
                </div>
                <div className="text-[11px] text-[#C19B4A] font-semibold px-2 py-0.5 rounded-full bg-black/40 border border-[#C19B4A]/30 group-hover:border-[#C19B4A]/60">
                  {lang === 'ar' ? city.statusAr : city.statusEn}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Final Statement Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#200725] via-[#2E0B32] to-[#17051C] border border-[#C19B4A]/40 shadow-2xl text-center max-w-4xl mx-auto">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-snug">
            "{lang === 'ar' ? cityExp.finalStatementAr : cityExp.finalStatementEn}"
          </h3>
          <p className="mt-2.5 text-xs sm:text-sm text-gray-300">
            {lang === 'ar'
              ? 'اختر مدينتك من القائمة أعلاه أو سجّل اهتمامك مباشرة لحجز أولوية الاستثمار.'
              : 'Select your city above or apply below to secure franchise priority.'}
          </p>
        </div>
      </div>
    </section>
  );
};
