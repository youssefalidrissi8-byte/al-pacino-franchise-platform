import React from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Sparkles, ChevronDown, Award, TrendingUp, ShieldCheck } from 'lucide-react';
import { scrollToSection } from '../utils/scrollHelper';

export const HeroSection: React.FC = () => {
  const { lang, content, theme } = useApp();
  const hero = content.hero;

  const minHeightClass = hero.sectionHeight === 'medium'
    ? 'min-h-[70vh]'
    : hero.sectionHeight === 'large'
    ? 'min-h-[85vh]'
    : 'min-h-[92vh]';

  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <section
      id="hero-section"
      className={`relative w-full ${minHeightClass} flex items-center justify-center overflow-hidden bg-[#0A0A0A]`}
    >
      {/* Background Image with editable overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={hero.bgImage || '/src/assets/images/al_pacino_hero_1787630392600.jpg'}
          alt="AL PACINO BROASTED Hero"
          referrerPolicy="no-referrer"
          style={{
            opacity: (hero.bgImageOpacity ?? 100) / 100,
            filter: `brightness(${(hero.bgImageBrightness ?? 100) / 100})`,
          }}
          className="w-full h-full object-cover object-center scale-105 transition-all duration-700 ease-out"
        />
        {/* Darkening & Color Gradient Overlays */}
        <div
          className="absolute inset-0 bg-[#0A0A0A] transition-opacity"
          style={{ opacity: (hero.overlayOpacity || 75) / 100 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#1A1128]/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#4B0082]/60 via-[#1A1128]/40 to-transparent pointer-events-none" />
      </div>

      {/* Decorative Cinematic Light Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#4B0082]/25 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-[#C19B4A]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center flex flex-col items-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A1128] border border-[#C19B4A]/40 backdrop-blur-md shadow-xl shadow-black/40 mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C19B4A]" />
          <span className="text-xs sm:text-sm font-semibold text-[#F5F5F0] tracking-wide">
            {lang === 'ar' ? hero.badgeAr : hero.badgeEn}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.12] max-w-4xl"
        >
          {lang === 'ar' ? (
            <>
              ظƒظ† ط´ط±ظٹظƒظ‹ط§ ظپظٹ <br className="hidden sm:block" />
              <span className="text-[#C19B4A]">ط§ظ„ظپطµظ„ ط§ظ„ظ‚ط§ط¯ظ…</span>
            </>
          ) : (
            hero.headlineEn
          )}
        </motion.h1>

        {/* Subheadline: ط¨ط±ظˆط³طھط¯ ط¨ط·ط¹ظ… ط§ظ„ط£ظˆط³ظƒط§ط± */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-3 sm:mt-5 flex items-center justify-center gap-3"
        >
          <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent to-[#C19B4A]" />
          <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#C19B4A] tracking-wide font-['Tajawal']">
            {lang === 'ar' ? hero.subheadlineAr : hero.subheadlineEn}
          </span>
          <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent to-[#C19B4A]" />
        </motion.div>

        {/* Supporting Quote/Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-4 text-base sm:text-xl md:text-2xl text-[#F5F5F0]/90 font-light max-w-2xl leading-relaxed italic"
        >
          "{lang === 'ar' ? hero.supportingTextAr : hero.supportingTextEn}"
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md"
        >
          <a
            href={hero.ctaPrimaryLink || '#investor-form'}
            onClick={(e) => scrollToSection(hero.ctaPrimaryLink || 'investor-form', e)}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-sm sm:text-base text-black bg-[#C19B4A] hover:bg-[#D4AF37] shadow-xl shadow-[#C19B4A]/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>{lang === 'ar' ? hero.ctaPrimaryAr : hero.ctaPrimaryEn}</span>
            <ArrowIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1" />
          </a>

          <a
            href={hero.ctaSecondaryLink || '#opportunity'}
            onClick={(e) => scrollToSection(hero.ctaSecondaryLink || 'opportunity', e)}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full font-bold text-sm sm:text-base text-white bg-white/5 hover:bg-white/10 border border-white/30 backdrop-blur-md shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{lang === 'ar' ? hero.ctaSecondaryAr : hero.ctaSecondaryEn}</span>
          </a>
        </motion.div>

        {/* High Density Metric Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 text-start"
        >
          <div className="bg-[#1A1128] rounded-2xl p-4 border border-[#C19B4A]/20 flex flex-col justify-between shadow-xl">
            <p className="text-[#C19B4A] text-xs font-bold uppercase tracking-wider">
              {lang === 'ar' ? 'ط§ظ„ط§ط³طھط«ظ…ط§ط± ط§ظ„طھظ‚ط¯ظٹط±ظٹ' : 'Est. Investment'}
            </p>
            <h3 className="text-2xl font-black text-white mt-2 mb-1">
              600-700K
            </h3>
            <p className="text-[10px] text-gray-400">
              {lang === 'ar' ? 'ط±ظٹط§ظ„ ط³ط¹ظˆط¯ظٹ ظ„ظ„ظپط±ط¹' : 'SAR per Branch'}
            </p>
          </div>

          <div className="bg-[#1A1128] rounded-2xl p-4 border border-[#C19B4A]/20 flex flex-col justify-between shadow-xl">
            <p className="text-[#C19B4A] text-xs font-bold uppercase tracking-wider">
              {lang === 'ar' ? 'ط§ظ„ظ…ط³ط§ط­ط© ط§ظ„ظ…ظ‚طھط±ط­ط©' : 'Suggested Area'}
            </p>
            <h3 className="text-2xl font-black text-white mt-2 mb-1">
              140 ظ…آ²
            </h3>
            <p className="text-[10px] text-gray-400">
              {lang === 'ar' ? 'ظ…ظ†ط§ط³ط¨ ظ„ظ„ظ…ظ†ط§ط·ظ‚ ط§ظ„ط­ظٹظˆظٹط©' : 'Ideal for High Traffic'}
            </p>
          </div>

          <div className="bg-[#1A1128] rounded-2xl p-4 border border-[#C19B4A]/20 flex flex-col justify-between shadow-xl">
            <p className="text-[#C19B4A] text-xs font-bold uppercase tracking-wider">
              {lang === 'ar' ? 'ظ…ط¯ط© ط§ظ„طھط£ط³ظٹط³' : 'Partnership Term'}
            </p>
            <h3 className="text-2xl font-black text-white mt-2 mb-1">
              {lang === 'ar' ? '3 ط£ط´ظ‡ط±' : '5 Years'}
            </h3>
            <p className="text-[10px] text-gray-400">
              {lang === 'ar' ? 'طھط´ط؛ظٹظ„ ظˆط¥ط¯ط§ط±ط© ظƒط§ظ…ظ„ط©' : 'Renewable subject to agreement'}
            </p>
          </div>

          <div className="bg-[#C19B4A] text-black rounded-2xl p-4 flex flex-col justify-between shadow-xl">
            <p className="text-black/70 text-xs font-bold uppercase tracking-wider">
              {lang === 'ar' ? 'ظ†ظ…ظˆط°ط¬ ط§ظ„ط´ط±ط§ظƒط©' : 'JV Model'}
            </p>
            <h3 className="text-xl sm:text-2xl font-black text-black mt-2 mb-1">
              JV + ط­ظ‚ ط§ظ„ط§ظ†طھظپط§ط¹
            </h3>
            <p className="text-[10px] font-bold underline text-black/80">
              {lang === 'ar' ? 'ط£ظ†طھ طھط³طھط«ظ…ط± ظˆظ†ط­ظ† ظ†ط´ط؛ظ„' : 'You Invest, We Operate'}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Down indicator */}
      <a
        href="#opportunity"
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-gray-500 hover:text-[#D4AF37] transition p-2 animate-bounce"
        aria-label="Scroll down"
      >
        <ChevronDown className="w-6 h-6" />
      </a>
    </section>
  );
};

