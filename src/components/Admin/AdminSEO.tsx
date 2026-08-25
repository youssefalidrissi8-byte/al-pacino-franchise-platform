import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SEOSettings } from '../../types';
import { Globe, Save, Search, Code } from 'lucide-react';

export const AdminSEO: React.FC = () => {
  const { lang, seo, updateSeoRemote, showToast } = useApp();

  const [seoForm, setSeoForm] = useState<SEOSettings>(JSON.parse(JSON.stringify(seo)));
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    setSeoForm(JSON.parse(JSON.stringify(seo)));
  }, [seo]);

  const handleSave = async () => {
    setIsSaving(true);
    const success = await updateSeoRemote(seoForm);
    setIsSaving(false);
    if (success) {
      showToast(lang === 'ar' ? 'تم حفظ إعدادات SEO وأكواد التتبع' : 'SEO & Tracking configs saved', 'success');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">
            {lang === 'ar' ? 'تهيئة محركات البحث والتتبع (SEO & Analytics)' : 'SEO & Analytics Setup'}
          </h2>
          <p className="text-sm text-gray-400">
            {lang === 'ar'
              ? 'التحكم بعناوين الميتا، بطاقات المشاركة في تويتر وواتساب، وأكواد Google Analytics وMeta Pixel.'
              : 'Configure OpenGraph tags, Google Analytics, GTM, and Meta Pixels.'}
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 rounded-xl font-black text-sm text-black bg-gradient-to-r from-[#D4AF37] to-[#E5BE48] hover:brightness-110 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? (lang === 'ar' ? 'جارٍ الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ إعدادات SEO' : 'Save SEO')}</span>
        </button>
      </div>

      {/* Search Engine Snippet Preview */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#161222] border border-[#2B2338] space-y-3 text-start">
        <div className="text-xs uppercase tracking-wider text-[#D4AF37] font-bold flex items-center gap-2">
          <Search className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'معاينة النتيجة في جوجل (Google Search Preview)' : 'Google Search Snippet Preview'}</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D0B12] border border-[#241E30] space-y-1">
          <div className="text-xs text-gray-400 font-mono">https://alpacino.sa</div>
          <h4 className="text-base sm:text-lg font-bold text-blue-400 hover:underline cursor-pointer">
            {lang === 'ar' ? seoForm.pageTitleAr : seoForm.pageTitleEn}
          </h4>
          <p className="text-xs sm:text-sm text-gray-300 line-clamp-2 leading-relaxed">
            {lang === 'ar' ? seoForm.metaDescriptionAr : seoForm.metaDescriptionEn}
          </p>
        </div>
      </div>

      {/* Meta Tags Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#161222] border border-[#2B2338] space-y-6 text-start">
        <h3 className="text-lg font-bold text-white border-b border-[#2B2338] pb-3 flex items-center gap-2">
          <Globe className="w-5 h-5 text-[#D4AF37]" />
          <span>{lang === 'ar' ? 'بيانات الميتا الأساسية' : 'Meta Tags'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-2">عنوان الصفحة (عربي)</label>
            <input
              type="text"
              value={seoForm.pageTitleAr}
              onChange={(e) => setSeoForm({ ...seoForm, pageTitleAr: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0D0B12] border border-[#2B2338] text-white text-sm outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-2">Page Title (English)</label>
            <input
              type="text"
              value={seoForm.pageTitleEn}
              onChange={(e) => setSeoForm({ ...seoForm, pageTitleEn: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0D0B12] border border-[#2B2338] text-white text-sm outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-300 mb-2">وصف الصفحة لمحركات البحث (عربي)</label>
            <textarea
              rows={2}
              value={seoForm.metaDescriptionAr}
              onChange={(e) => setSeoForm({ ...seoForm, metaDescriptionAr: e.target.value })}
              className="w-full p-3 rounded-xl bg-[#0D0B12] border border-[#2B2338] text-white text-sm outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-300 mb-2">Meta Description (English)</label>
            <textarea
              rows={2}
              value={seoForm.metaDescriptionEn}
              onChange={(e) => setSeoForm({ ...seoForm, metaDescriptionEn: e.target.value })}
              className="w-full p-3 rounded-xl bg-[#0D0B12] border border-[#2B2338] text-white text-sm outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-300 mb-2">الكلمات المفتاحية (Keywords)</label>
            <input
              type="text"
              value={seoForm.keywords}
              onChange={(e) => setSeoForm({ ...seoForm, keywords: e.target.value })}
              placeholder="بروستد، استثمار مطاعم، فرنشايز السعودية، AL PACINO..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#0D0B12] border border-[#2B2338] text-white text-sm outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-300 mb-2">
              {lang === 'ar' ? 'صورة بطاقة المشاركة (Open Graph Image URL)' : 'Open Graph Image URL'}
            </label>
            <input
              type="text"
              value={seoForm.ogImage}
              onChange={(e) => setSeoForm({ ...seoForm, ogImage: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0D0B12] border border-[#2B2338] text-white text-xs font-mono outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>
      </div>

      {/* Analytics & Pixel Tracking */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#161222] border border-[#2B2338] space-y-6 text-start">
        <h3 className="text-lg font-bold text-white border-b border-[#2B2338] pb-3 flex items-center gap-2">
          <Code className="w-5 h-5 text-[#D4AF37]" />
          <span>{lang === 'ar' ? 'أكواد التحليلات والتتبع الإعلاني' : 'Analytics & Pixels'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-2">Google Analytics (GA4 ID)</label>
            <input
              type="text"
              value={seoForm.googleAnalyticsId || ''}
              onChange={(e) => setSeoForm({ ...seoForm, googleAnalyticsId: e.target.value })}
              placeholder="G-XXXXXXXXXX"
              className="w-full px-4 py-2.5 rounded-xl bg-[#0D0B12] border border-[#2B2338] text-white text-xs font-mono outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-2">Google Tag Manager (GTM ID)</label>
            <input
              type="text"
              value={seoForm.googleTagManagerId || ''}
              onChange={(e) => setSeoForm({ ...seoForm, googleTagManagerId: e.target.value })}
              placeholder="GTM-XXXXXXX"
              className="w-full px-4 py-2.5 rounded-xl bg-[#0D0B12] border border-[#2B2338] text-white text-xs font-mono outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-2">Meta Pixel (Facebook/Instagram)</label>
            <input
              type="text"
              value={seoForm.facebookPixelId || ''}
              onChange={(e) => setSeoForm({ ...seoForm, facebookPixelId: e.target.value })}
              placeholder="123456789012345"
              className="w-full px-4 py-2.5 rounded-xl bg-[#0D0B12] border border-[#2B2338] text-white text-xs font-mono outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
