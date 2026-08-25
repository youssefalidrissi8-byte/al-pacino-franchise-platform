import React from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { Quote, Sparkles, CheckCircle2 } from 'lucide-react';

export const StorySection: React.FC = () => {
  const { lang, content } = useApp();
  const story = content.story;

  const paragraphs = lang === 'ar' ? story.paragraphsAr : story.paragraphsEn;

  return (
    <section
      id="story"
      className="relative py-20 sm:py-28 bg-[#0A0A0A] overflow-hidden border-b border-[#2B2338] scroll-mt-24"
    >
      {/* Subtle Glows */}
      <div className="absolute top-10 right-1/4 w-[500px] h-[500px] bg-[#4B0082]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Image with Cinematic Framing */}
          <motion.div
            initial={{ opacity: 0, x: lang === 'ar' ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-[#C19B4A]/30 shadow-2xl shadow-black/60 group">
              <img
                src={story.storyImage || '/src/assets/images/al_pacino_story_1787630407673.jpg'}
                alt="AL PACINO Restaurant Story"
                referrerPolicy="no-referrer"
                style={{
                  opacity: (story.storyImageOpacity ?? 100) / 100,
                  filter: `brightness(${(story.storyImageBrightness ?? 100) / 100})`,
                }}
                className="w-full h-[440px] object-cover object-center group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#1A1128]/40 to-transparent" />

              {/* Floating Quote Badge on Image */}
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-[#1A1128]/95 backdrop-blur-md border border-[#C19B4A]/30 flex items-center gap-3">
                <Quote className="w-5 h-5 text-[#C19B4A] shrink-0" />
                <div className="text-xs sm:text-sm font-semibold text-white">
                  {lang === 'ar' ? story.captionAr : story.captionEn}
                </div>
              </div>
            </div>

            {/* Background Decorative Offset Frame */}
            <div className="absolute -inset-2 rounded-3xl border border-[#C19B4A]/20 -z-10 translate-x-2 translate-y-2 pointer-events-none" />
          </motion.div>

          {/* Right Column: Story Text */}
          <div className="lg:col-span-7 space-y-5">
            {/* Section Header */}
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A1128] border border-[#C19B4A]/30 text-xs font-semibold text-[#C19B4A] mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'فلسفة العلامة ورؤيتها' : 'Brand Philosophy & Vision'}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                {lang === 'ar' ? story.titleAr : story.titleEn}
              </h2>
            </div>

            {/* Big Punchy Quote */}
            <div className="p-5 sm:p-6 rounded-xl bg-[#1A1128] border-l-4 rtl:border-l-0 rtl:border-r-4 border-[#C19B4A] shadow-lg">
              <div className="text-xl sm:text-2xl font-black text-[#C19B4A] font-['Outfit'] tracking-wider">
                "{lang === 'ar' ? story.quoteAr : story.quoteEn}"
              </div>
            </div>

            {/* Paragraphs */}
            <div className="space-y-3.5 text-base sm:text-lg text-gray-200 leading-relaxed font-normal">
              {paragraphs.map((p, idx) => (
                <p key={idx} className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#C19B4A] mt-2.5 shrink-0" />
                  <span>{p}</span>
                </p>
              ))}
            </div>

            {/* Key Milestone Takeaway */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3.5 border-t border-[#2B2338]">
              <div className="p-3.5 rounded-xl bg-[#1A1128] border border-[#C19B4A]/20">
                <div className="text-xl font-black text-[#C19B4A]">100%</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {lang === 'ar' ? 'وصفات وتتبيلات حصرية' : 'Exclusive Recipes'}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#1A1128] border border-[#C19B4A]/20">
                <div className="text-xl font-black text-[#C19B4A]">SOPs</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {lang === 'ar' ? 'دليل تشغيلي معتمد' : 'Standardized SOPs'}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#1A1128] border border-[#C19B4A]/20 col-span-2 sm:col-span-1">
                <div className="text-xl font-black text-[#C19B4A]">JV</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {lang === 'ar' ? 'نموذج توسع مدروس' : 'Scalable JV Model'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
