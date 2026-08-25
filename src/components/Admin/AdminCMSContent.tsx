import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ContentData } from '../../types';
import { Save, RefreshCw, Layers, Sparkles, Image, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const AdminCMSContent: React.FC = () => {
  const { lang, content, updateContentRemote, resetDefaultsRemote, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<string>('hero');
  const [formData, setFormData] = useState<ContentData>(JSON.parse(JSON.stringify(content)));
  const [isSaving, setIsSaving] = useState(false);

  // Sync state if context content changes
  React.useEffect(() => {
    setFormData(JSON.parse(JSON.stringify(content)));
  }, [content]);

  const handleSave = async () => {
    setIsSaving(true);
    const success = await updateContentRemote(formData);
    setIsSaving(false);
    if (success) {
      showToast(lang === 'ar' ? 'تم حفظ التعديلات بنجاح' : 'Content saved successfully', 'success');
    } else {
      showToast(lang === 'ar' ? 'فشل حفظ التعديلات' : 'Failed to save content', 'error');
    }
  };

  const handleReset = async () => {
    if (window.confirm(lang === 'ar' ? 'هل تريد استعادة النصوص الافتراضية؟' : 'Reset all content to defaults?')) {
      await resetDefaultsRemote();
      showToast(lang === 'ar' ? 'تمت استعادة المحتوى الافتراضي' : 'Reset to defaults', 'info');
    }
  };

  const tabs = [
    { id: 'hero', labelAr: 'قسم البداية (Hero)', labelEn: 'Hero Section' },
    { id: 'opportunity', labelAr: 'فرصة الشراكة', labelEn: 'Opportunity' },
    { id: 'story', labelAr: 'قصتنا (Our Story)', labelEn: 'Our Story' },
    { id: 'why', labelAr: 'لماذا الباتشينو؟ (6 بطاقات)', labelEn: 'Why Us (6 Cards)' },
    { id: 'financials', labelAr: 'الاستثمار المالي', labelEn: 'Financials' },
    { id: 'jv-model', labelAr: 'نموذج JV والمعادلة', labelEn: 'JV Model' },
    { id: 'support', labelAr: 'منظومة الدعم (9 ركائز)', labelEn: 'Support (9 Pillars)' },
    { id: 'journey', labelAr: 'خارطة الطريق (8 خطوات)', labelEn: 'Journey (8 Steps)' },
    { id: 'cities', labelAr: 'المدن المستهدفة', labelEn: 'Target Cities' },
    { id: 'contact', labelAr: 'بيانات التواصل', labelEn: 'Contact Info' },
    { id: 'cta', labelAr: 'الدعوة الختامية (CTA)', labelEn: 'Final CTA' },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Save / Reset actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">
            {lang === 'ar' ? 'إدارة محتوى الموقع (Bilingual CMS)' : 'Bilingual CMS Editor'}
          </h2>
          <p className="text-sm text-gray-400">
            {lang === 'ar'
              ? 'تعديل جميع نصوص وعناوين وعناصر الموقع بالعربية والإنجليزية مباشرة.'
              : 'Edit all website text, headings, and assets in Arabic and English.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl bg-[#1A1426] hover:bg-[#251C36] border border-[#2B2338] text-xs font-bold text-gray-300 flex items-center gap-2 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'استعادة الافتراضي' : 'Reset Defaults'}</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl font-black text-sm text-black bg-gradient-to-r from-[#D4AF37] to-[#E5BE48] hover:brightness-110 shadow-lg shadow-amber-500/20 flex items-center gap-2 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? (lang === 'ar' ? 'جارٍ الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ التعديلات' : 'Save Changes')}</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#2B2338]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-[#3B113D] border border-[#D4AF37] text-[#D4AF37] shadow-sm'
                : 'bg-[#161222] border border-[#2B2338] text-gray-400 hover:text-white'
            }`}
          >
            <span>{lang === 'ar' ? tab.labelAr : tab.labelEn}</span>
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#161222] border border-[#2B2338] space-y-6 text-start">
        {/* HERO SECTION */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-[#2B2338] pb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>{lang === 'ar' ? 'محتوى قسم البداية (Hero)' : 'Hero Section Content'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-2">شارة النموذج (عربي)</label>
                <input
                  type="text"
                  value={formData.hero.badgeAr}
                  onChange={(e) =>
                    setFormData({ ...formData, hero: { ...formData.hero, badgeAr: e.target.value } })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0D0B12] border border-[#2B2338] text-white text-sm focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-2">Model Badge (English)</label>
                <input
                  type="text"
                  value={formData.hero.badgeEn}
                  onChange={(e) =>
                    setFormData({ ...formData, hero: { ...formData.hero, badgeEn: e.target.value } })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0D0B12] border border-[#2B2338] text-white text-sm focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-2">العنوان الرئيسي (عربي)</label>
                <input
                  type="text"
                  value={formData.hero.titleAr}
                  onChange={(e) =>
                    setFormData({ ...formData, hero: { ...formData.hero, titleAr: e.target.value } })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0D0B12] border border-[#2B2338] text-white text-sm focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-2">Main Title (English)</label>
                <input
                  type="text"
                  value={formData.hero.titleEn}
                  onChange={(e) =>
                    setFormData({ ...formData, hero: { ...formData.hero, titleEn: e.target.value } })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0D0B12] border border-[#2B2338] text-white text-sm focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-2">العنوان الثانوي / الشعار (عربي)</label>
                <input
                  type="text"
                  value={formData.hero.subtitleAr}
                  onChange={(e) =>
                    setFormData({ ...formData, hero: { ...formData.hero, subtitleAr: e.target.value } })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0D0B12] border border-[#2B2338] text-white text-sm focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-2">Subtitle / Tagline (English)</label>
                <input
                  type="text"
                  value={formData.hero.subtitleEn}
                  onChange={(e) =>
                    setFormData({ ...formData, hero: { ...formData.hero, subtitleEn: e.target.value } })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0D0B12] border border-[#2B2338] text-white text-sm focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-300 mb-2">الوصف الاستثماري (عربي)</label>
                <textarea
                  rows={2}
                  value={formData.hero.descriptionAr}
                  onChange={(e) =>
                    setFormData({ ...formData, hero: { ...formData.hero, descriptionAr: e.target.value } })
                  }
                  className="w-full p-3 rounded-xl bg-[#0D0B12] border border-[#2B2338] text-white text-sm focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-300 mb-2">Investment Description (English)</label>
                <textarea
                  rows={2}
                  value={formData.hero.descriptionEn}
                  onChange={(e) =>
                    setFormData({ ...formData, hero: { ...formData.hero, descriptionEn: e.target.value } })
                  }
                  className="w-full p-3 rounded-xl bg-[#0D0B12] border border-[#2B2338] text-white text-sm focus:border-[#D4AF37] outline-none"
                />
              </div>

              {/* HERO BACKGROUND IMAGE & FILTER CONTROLS */}
              <div className="sm:col-span-2 p-4 rounded-2xl bg-[#0D0B12] border border-[#2B2338] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Image className="w-4 h-4 text-[#D4AF37]" />
                    <span>{lang === 'ar' ? 'صورة الواجهة الرئيسية والتحكم بالسطوع والشفافية' : 'Hero Image & Filter Tuning'}</span>
                  </span>
                  <span className="text-[11px] text-gray-400 font-mono">
                    💡{formData.hero.bgImageBrightness ?? 100}% | 👁️{formData.hero.bgImageOpacity ?? 100}%
                  </span>
                </div>

                {/* Upload from Computer or URL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">
                      {lang === 'ar' ? 'رفع صورة من الحاسوب' : 'Upload from Computer'}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 5 * 1024 * 1024) {
                            showToast(lang === 'ar' ? 'حجم الصورة يجب ألا يتجاوز 5MB' : 'Image must be under 5MB', 'error');
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData({
                              ...formData,
                              hero: { ...formData.hero, bgImage: reader.result as string },
                            });
                            showToast(lang === 'ar' ? 'تم اختيار الصورة بنجاح' : 'Image loaded from computer', 'success');
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full text-xs text-gray-400 file:me-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#271F36] file:text-[#D4AF37] hover:file:bg-[#342948] file:cursor-pointer cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">
                      {lang === 'ar' ? 'أو رابط الصورة (URL)' : 'Or Image URL'}
                    </label>
                    <input
                      type="text"
                      value={formData.hero.bgImage || formData.hero.heroImage || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, hero: { ...formData.hero, bgImage: e.target.value } })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#161222] border border-[#2B2338] text-white text-xs font-mono focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                </div>

                {/* Brightness & Opacity Sliders */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#231B32]">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-300">
                      <span>{lang === 'ar' ? 'سطوع الصورة الخلفية (Brightness)' : 'Hero Brightness'}</span>
                      <span className="text-[#D4AF37] font-mono">{formData.hero.bgImageBrightness ?? 100}%</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="200"
                      value={formData.hero.bgImageBrightness ?? 100}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, bgImageBrightness: Number(e.target.value) },
                        })
                      }
                      className="w-full accent-[#D4AF37] cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-300">
                      <span>{lang === 'ar' ? 'شفافية الصورة الخلفية (Opacity)' : 'Hero Opacity'}</span>
                      <span className="text-[#D4AF37] font-mono">{formData.hero.bgImageOpacity ?? 100}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={formData.hero.bgImageOpacity ?? 100}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, bgImageOpacity: Number(e.target.value) },
                        })
                      }
                      className="w-full accent-[#D4AF37] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Preview Thumbnail */}
                {(formData.hero.bgImage || formData.hero.heroImage) && (
                  <div className="aspect-[21/9] max-h-40 rounded-xl bg-black overflow-hidden border border-[#2B2338] relative">
                    <img
                      src={formData.hero.bgImage || formData.hero.heroImage}
                      alt="Hero Background Preview"
                      style={{
                        opacity: (formData.hero.bgImageOpacity ?? 100) / 100,
                        filter: `brightness(${(formData.hero.bgImageBrightness ?? 100) / 100})`,
                      }}
                      className="w-full h-full object-cover transition-all"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* OPPORTUNITY SECTION */}
        {activeTab === 'opportunity' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-[#2B2338] pb-3">
              {lang === 'ar' ? 'فرصة الشراكة والاستثمار' : 'Opportunity Section'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-2">عنوان القسم (عربي)</label>
                <input
                  type="text"
                  value={formData.opportunity.titleAr}
                  onChange={(e) =>
                    setFormData({ ...formData, opportunity: { ...formData.opportunity, titleAr: e.target.value } })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0D0B12] border border-[#2B2338] text-white text-sm focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-2">Title (English)</label>
                <input
                  type="text"
                  value={formData.opportunity.titleEn}
                  onChange={(e) =>
                    setFormData({ ...formData, opportunity: { ...formData.opportunity, titleEn: e.target.value } })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0D0B12] border border-[#2B2338] text-white text-sm focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-2">العبارة البارزة (عربي)</label>
                <input
                  type="text"
                  value={formData.opportunity.highlightTextAr}
                  onChange={(e) =>
                    setFormData({ ...formData, opportunity: { ...formData.opportunity, highlightTextAr: e.target.value } })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0D0B12] border border-[#2B2338] text-white text-sm focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-2">Highlight Statement (English)</label>
                <input
                  type="text"
                  value={formData.opportunity.highlightTextEn}
                  onChange={(e) =>
                    setFormData({ ...formData, opportunity: { ...formData.opportunity, highlightTextEn: e.target.value } })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0D0B12] border border-[#2B2338] text-white text-sm focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-300 mb-2">الفقرة الأولى (عربي)</label>
                <textarea
                  rows={2}
                  value={formData.opportunity.paragraph1Ar}
                  onChange={(e) =>
                    setFormData({ ...formData, opportunity: { ...formData.opportunity, paragraph1Ar: e.target.value } })
                  }
                  className="w-full p-3 rounded-xl bg-[#0D0B12] border border-[#2B2338] text-white text-sm focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-300 mb-2">Paragraph 1 (English)</label>
                <textarea
                  rows={2}
                  value={formData.opportunity.paragraph1En}
                  onChange={(e) =>
                    setFormData({ ...formData, opportunity: { ...formData.opportunity, paragraph1En: e.target.value } })
                  }
                  className="w-full p-3 rounded-xl bg-[#0D0B12] border border-[#2B2338] text-white text-sm focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-300 mb-2">الفقرة الثانية (عربي)</label>
                <textarea
                  rows={2}
                  value={formData.opportunity.paragraph2Ar}
                  onChange={(e) =>
                    setFormData({ ...formData, opportunity: { ...formData.opportunity, paragraph2Ar: e.target.value } })
                  }
                  className="w-full p-3 rounded-xl bg-[#0D0B12] border border-[#2B2338] text-white text-sm focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-300 mb-2">Paragraph 2 (English)</label>
                <textarea
                  rows={2}
                  value={formData.opportunity.paragraph2En}
                  onChange={(e) =>
                    setFormData({ ...formData, opportunity: { ...formData.opportunity, paragraph2En: e.target.value } })
                  }
                  className="w-full p-3 rounded-xl bg-[#0D0B12] border border-[#2B2338] text-white text-sm focus:border-[#D4AF37] outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STORY SECTION */}
        {activeTab === 'story' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-[#2B2338] pb-3">
              {lang === 'ar' ? 'قصتنا وفلسفة العلامة' : 'Our Story Section'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-2">عنوان القصة (عربي)</label>
                <input
                  type="text"
                  value={formData.story.titleAr}
                  onChange={(e) =>
                    setFormData({ ...formData, story: { ...formData.story, titleAr: e.target.value } })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0D0B12] border border-[#2B2338] text-white text-sm focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-2">Story Title (English)</label>
                <input
                  type="text"
                  value={formData.story.titleEn}
                  onChange={(e) =>
                    setFormData({ ...formData, story: { ...formData.story, titleEn: e.target.value } })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0D0B12] border border-[#2B2338] text-white text-sm focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-2">المقولة البارزة (عربي)</label>
                <input
                  type="text"
                  value={formData.story.quoteAr}
                  onChange={(e) =>
                    setFormData({ ...formData, story: { ...formData.story, quoteAr: e.target.value } })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0D0B12] border border-[#2B2338] text-white text-sm focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-2">Quote (English)</label>
                <input
                  type="text"
                  value={formData.story.quoteEn}
                  onChange={(e) =>
                    setFormData({ ...formData, story: { ...formData.story, quoteEn: e.target.value } })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0D0B12] border border-[#2B2338] text-white text-sm focus:border-[#D4AF37] outline-none"
                />
              </div>

              {/* STORY IMAGE & FILTER CONTROLS */}
              <div className="sm:col-span-2 p-4 rounded-2xl bg-[#0D0B12] border border-[#2B2338] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Image className="w-4 h-4 text-[#D4AF37]" />
                    <span>{lang === 'ar' ? 'صورة قصة النجاح والتحكم بالسطوع والشفافية' : 'Story Image & Filter Controls'}</span>
                  </span>
                  <span className="text-[11px] text-gray-400 font-mono">
                    💡{formData.story.storyImageBrightness ?? 100}% | 👁️{formData.story.storyImageOpacity ?? 100}%
                  </span>
                </div>

                {/* Upload from Computer or URL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">
                      {lang === 'ar' ? 'رفع صورة من الحاسوب' : 'Upload from Computer'}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 5 * 1024 * 1024) {
                            showToast(lang === 'ar' ? 'حجم الصورة يجب ألا يتجاوز 5MB' : 'Image must be under 5MB', 'error');
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData({
                              ...formData,
                              story: { ...formData.story, storyImage: reader.result as string },
                            });
                            showToast(lang === 'ar' ? 'تم اختيار صورة القصة بنجاح' : 'Story image loaded from computer', 'success');
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full text-xs text-gray-400 file:me-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#271F36] file:text-[#D4AF37] hover:file:bg-[#342948] file:cursor-pointer cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">
                      {lang === 'ar' ? 'أو رابط الصورة (URL)' : 'Or Image URL'}
                    </label>
                    <input
                      type="text"
                      value={formData.story.storyImage || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, story: { ...formData.story, storyImage: e.target.value } })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#161222] border border-[#2B2338] text-white text-xs font-mono focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                </div>

                {/* Brightness & Opacity Sliders */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#231B32]">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-300">
                      <span>{lang === 'ar' ? 'سطوع صورة القصة (Brightness)' : 'Story Brightness'}</span>
                      <span className="text-[#D4AF37] font-mono">{formData.story.storyImageBrightness ?? 100}%</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="200"
                      value={formData.story.storyImageBrightness ?? 100}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          story: { ...formData.story, storyImageBrightness: Number(e.target.value) },
                        })
                      }
                      className="w-full accent-[#D4AF37] cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-300">
                      <span>{lang === 'ar' ? 'شفافية صورة القصة (Opacity)' : 'Story Opacity'}</span>
                      <span className="text-[#D4AF37] font-mono">{formData.story.storyImageOpacity ?? 100}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={formData.story.storyImageOpacity ?? 100}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          story: { ...formData.story, storyImageOpacity: Number(e.target.value) },
                        })
                      }
                      className="w-full accent-[#D4AF37] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Preview Thumbnail */}
                {formData.story.storyImage && (
                  <div className="aspect-[16/10] max-h-48 rounded-xl bg-black overflow-hidden border border-[#2B2338] relative">
                    <img
                      src={formData.story.storyImage}
                      alt="Story Preview"
                      style={{
                        opacity: (formData.story.storyImageOpacity ?? 100) / 100,
                        filter: `brightness(${(formData.story.storyImageBrightness ?? 100) / 100})`,
                      }}
                      className="w-full h-full object-cover transition-all"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* WHY US CARDS */}
        {activeTab === 'why' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-[#2B2338] pb-3">
              {lang === 'ar' ? 'بطاقات "لماذا الباتشينو؟"' : 'Why AL PACINO Cards'}
            </h3>

            <div className="space-y-4">
              {formData.whyAlPacino.cards.map((card, idx) => (
                <div key={card.id || idx} className="p-4 rounded-2xl bg-[#0D0B12] border border-[#2B2338] space-y-3">
                  <div className="text-xs font-bold text-[#D4AF37]">البطاقة 0{idx + 1}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">العنوان (عربي)</label>
                      <input
                        type="text"
                        value={card.titleAr}
                        onChange={(e) => {
                          const updated = [...formData.whyAlPacino.cards];
                          updated[idx].titleAr = e.target.value;
                          setFormData({ ...formData, whyAlPacino: { ...formData.whyAlPacino, cards: updated } });
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-[#161222] border border-[#2B2338] text-white text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">Title (English)</label>
                      <input
                        type="text"
                        value={card.titleEn}
                        onChange={(e) => {
                          const updated = [...formData.whyAlPacino.cards];
                          updated[idx].titleEn = e.target.value;
                          setFormData({ ...formData, whyAlPacino: { ...formData.whyAlPacino, cards: updated } });
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-[#161222] border border-[#2B2338] text-white text-xs outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] text-gray-400 mb-1">الوصف (عربي)</label>
                      <textarea
                        rows={2}
                        value={card.descAr}
                        onChange={(e) => {
                          const updated = [...formData.whyAlPacino.cards];
                          updated[idx].descAr = e.target.value;
                          setFormData({ ...formData, whyAlPacino: { ...formData.whyAlPacino, cards: updated } });
                        }}
                        className="w-full p-2.5 rounded-lg bg-[#161222] border border-[#2B2338] text-white text-xs outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] text-gray-400 mb-1">Description (English)</label>
                      <textarea
                        rows={2}
                        value={card.descEn}
                        onChange={(e) => {
                          const updated = [...formData.whyAlPacino.cards];
                          updated[idx].descEn = e.target.value;
                          setFormData({ ...formData, whyAlPacino: { ...formData.whyAlPacino, cards: updated } });
                        }}
                        className="w-full p-2.5 rounded-lg bg-[#161222] border border-[#2B2338] text-white text-xs outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FINANCIALS & DISCLAIMER */}
        {activeTab === 'financials' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-[#2B2338] pb-3">
              {lang === 'ar' ? 'البيانات المالية والتنويه القانوني' : 'Financials & Disclaimer'}
            </h3>

            <div className="space-y-4">
              {formData.investmentGlance.metrics.map((m, idx) => (
                <div key={m.id || idx} className="p-4 rounded-xl bg-[#0D0B12] border border-[#2B2338] grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">القيمة (عربي)</label>
                    <input
                      type="text"
                      value={m.valueAr}
                      onChange={(e) => {
                        const updated = [...formData.investmentGlance.metrics];
                        updated[idx].valueAr = e.target.value;
                        setFormData({ ...formData, investmentGlance: { ...formData.investmentGlance, metrics: updated } });
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-[#161222] border border-[#2B2338] text-white text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Value (English)</label>
                    <input
                      type="text"
                      value={m.valueEn}
                      onChange={(e) => {
                        const updated = [...formData.investmentGlance.metrics];
                        updated[idx].valueEn = e.target.value;
                        setFormData({ ...formData, investmentGlance: { ...formData.investmentGlance, metrics: updated } });
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-[#161222] border border-[#2B2338] text-white text-xs outline-none"
                    />
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-[#2B2338]">
                <label className="block text-xs font-bold text-gray-300 mb-2">نص التنويه القانوني (عربي)</label>
                <textarea
                  rows={3}
                  value={formData.investmentGlance.disclaimerAr}
                  onChange={(e) =>
                    setFormData({ ...formData, investmentGlance: { ...formData.investmentGlance, disclaimerAr: e.target.value } })
                  }
                  className="w-full p-3 rounded-xl bg-[#0D0B12] border border-[#2B2338] text-white text-xs outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* CONTACT INFO */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-[#2B2338] pb-3">
              {lang === 'ar' ? 'معلومات التواصل المباشر' : 'Contact Information'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-2">رقم الواتساب (مع رمز الدولة)</label>
                <input
                  type="text"
                  value={formData.contact.whatsapp}
                  onChange={(e) =>
                    setFormData({ ...formData, contact: { ...formData.contact, whatsapp: e.target.value } })
                  }
                  placeholder="+966500000000"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0D0B12] border border-[#2B2338] text-white text-sm focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-2">البريد الإلكتروني المخصص للاستثمار</label>
                <input
                  type="email"
                  value={formData.contact.email}
                  onChange={(e) =>
                    setFormData({ ...formData, contact: { ...formData.contact, email: e.target.value } })
                  }
                  placeholder="invest@alpacino.sa"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0D0B12] border border-[#2B2338] text-white text-sm focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-2">العنوان والمقر (عربي)</label>
                <input
                  type="text"
                  value={formData.contact.addressAr}
                  onChange={(e) =>
                    setFormData({ ...formData, contact: { ...formData.contact, addressAr: e.target.value } })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0D0B12] border border-[#2B2338] text-white text-sm focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-2">Address (English)</label>
                <input
                  type="text"
                  value={formData.contact.addressEn}
                  onChange={(e) =>
                    setFormData({ ...formData, contact: { ...formData.contact, addressEn: e.target.value } })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0D0B12] border border-[#2B2338] text-white text-sm focus:border-[#D4AF37] outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* FINAL CTA */}
        {activeTab === 'cta' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-[#2B2338] pb-3">
              {lang === 'ar' ? 'القسم الختامي والدعوة للانضمام' : 'Final CTA Section'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-2">العنوان (عربي)</label>
                <input
                  type="text"
                  value={formData.finalCta.titleAr}
                  onChange={(e) =>
                    setFormData({ ...formData, finalCta: { ...formData.finalCta, titleAr: e.target.value } })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0D0B12] border border-[#2B2338] text-white text-sm focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-2">Title (English)</label>
                <input
                  type="text"
                  value={formData.finalCta.titleEn}
                  onChange={(e) =>
                    setFormData({ ...formData, finalCta: { ...formData.finalCta, titleEn: e.target.value } })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0D0B12] border border-[#2B2338] text-white text-sm focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-2">العبارة الختامية البارزة (عربي)</label>
                <input
                  type="text"
                  value={formData.finalCta.finalStatementAr}
                  onChange={(e) =>
                    setFormData({ ...formData, finalCta: { ...formData.finalCta, finalStatementAr: e.target.value } })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0D0B12] border border-[#2B2338] text-white text-sm focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-2">Final Statement (English)</label>
                <input
                  type="text"
                  value={formData.finalCta.finalStatementEn}
                  onChange={(e) =>
                    setFormData({ ...formData, finalCta: { ...formData.finalCta, finalStatementEn: e.target.value } })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0D0B12] border border-[#2B2338] text-white text-sm focus:border-[#D4AF37] outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
