import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ThemeSettings } from '../../types';
import { Palette, Save } from 'lucide-react';

export const AdminThemeEditor: React.FC = () => {
  const { lang, theme, updateThemeRemote, showToast } = useApp();

  const [themeForm, setThemeForm] = useState<ThemeSettings>(JSON.parse(JSON.stringify(theme)));
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    setThemeForm(JSON.parse(JSON.stringify(theme)));
  }, [theme]);

  const handleSave = async () => {
    setIsSaving(true);
    const success = await updateThemeRemote(themeForm);
    setIsSaving(false);
    if (success) {
      showToast(lang === 'ar' ? 'تم تحديث ألوان وهوية الموقع بنجاح' : 'Theme colors updated', 'success');
    }
  };

  const presets = [
    {
      nameAr: 'التركيز العالي (High Density - الافتراضي)',
      nameEn: 'High Density (Default)',
      colors: {
        primaryColor: '#4B0082',
        primaryHover: '#5A009D',
        secondaryColor: '#1A1128',
        accentColor: '#C19B4A',
        accentHover: '#D4AF37',
        backgroundColor: '#0A0A0A',
        cardBackground: '#1A1128',
        textColor: '#F5F5F0',
        textMutedColor: '#A3A39E',
        borderColor: '#2B2338',
      },
    },
    {
      nameAr: 'الملكي البنفسجي والذهب الكلاسيكي',
      nameEn: 'Royal Purple & Gold Classic',
      colors: {
        primaryColor: '#4A154B',
        primaryHover: '#6B1F6C',
        secondaryColor: '#161222',
        accentColor: '#D4AF37',
        accentHover: '#E5BE48',
        backgroundColor: '#0D0B12',
        cardBackground: '#161222',
        textColor: '#FAF8F5',
        textMutedColor: '#9E9AA7',
        borderColor: '#2B2338',
      },
    },
    {
      nameAr: 'الزمردي الليلي والبرونز',
      nameEn: 'Midnight Emerald & Bronze',
      colors: {
        primaryColor: '#0F3B2C',
        primaryHover: '#175942',
        secondaryColor: '#0E221B',
        accentColor: '#C5A059',
        accentHover: '#D8B673',
        backgroundColor: '#08140F',
        cardBackground: '#0E221B',
        textColor: '#F4F9F6',
        textMutedColor: '#8EA69A',
        borderColor: '#1A3D31',
      },
    },
    {
      nameAr: 'الكحلي والبلاتين الفاخر',
      nameEn: 'Deep Navy & Platinum',
      colors: {
        primaryColor: '#132238',
        primaryHover: '#1E3658',
        secondaryColor: '#0F1A2D',
        accentColor: '#38BDF8',
        accentHover: '#60A5FA',
        backgroundColor: '#070D18',
        cardBackground: '#0F1A2D',
        textColor: '#F8FAFC',
        textMutedColor: '#94A3B8',
        borderColor: '#1F3150',
      },
    },
    {
      nameAr: 'المخملي العنابي والذهب',
      nameEn: 'Crimson Velvet & Gold',
      colors: {
        primaryColor: '#4C0D17',
        primaryHover: '#6E1322',
        secondaryColor: '#1C0B10',
        accentColor: '#EAB308',
        accentHover: '#FACC15',
        backgroundColor: '#120508',
        cardBackground: '#1C0B10',
        textColor: '#FFF5F5',
        textMutedColor: '#A89297',
        borderColor: '#361620',
      },
    },
  ];

  const applyPreset = (presetColors: any) => {
    setThemeForm({
      ...themeForm,
      ...presetColors,
    });
    showToast(lang === 'ar' ? 'تم تطبيق ألوان النموذج المحدد' : 'Applied preset palette', 'info');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">
            {lang === 'ar' ? 'تخصيص الثيم والألوان (Theme & Palette Customization)' : 'Theme & Palette Customization'}
          </h2>
          <p className="text-sm text-gray-400">
            {lang === 'ar'
              ? 'التحكم بألوان العلامة التجارية والخلفيات والبطاقات والتأثيرات الملكية.'
              : 'Customize brand palette tokens, canvas background, and card borders.'}
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 rounded-xl font-black text-sm text-black bg-gradient-to-r from-[#D4AF37] to-[#E5BE48] hover:brightness-110 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? (lang === 'ar' ? 'جارٍ الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ الألوان' : 'Save Theme')}</span>
        </button>
      </div>

      {/* Preset Themes Grid */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#161222] border border-[#2B2338] space-y-4 text-start">
        <h3 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider">
          {lang === 'ar' ? 'نماذج ألوان فاخرة جاهزة' : 'Curated Luxury Presets'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(preset.colors)}
              className="p-4 rounded-2xl bg-[#0D0B12] border border-[#2B2338] hover:border-[#D4AF37] text-start transition group cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-5 h-5 rounded-full border border-white/20"
                  style={{ backgroundColor: preset.colors.primaryColor }}
                />
                <div
                  className="w-5 h-5 rounded-full border border-white/20"
                  style={{ backgroundColor: preset.colors.accentColor }}
                />
                <div
                  className="w-5 h-5 rounded-full border border-white/20"
                  style={{ backgroundColor: preset.colors.backgroundColor }}
                />
              </div>
              <div className="font-bold text-xs text-white group-hover:text-[#D4AF37] transition-colors">
                {lang === 'ar' ? preset.nameAr : preset.nameEn}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Color Pickers */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#161222] border border-[#2B2338] space-y-6 text-start">
        <h3 className="text-lg font-bold text-white border-b border-[#2B2338] pb-3 flex items-center gap-2">
          <Palette className="w-5 h-5 text-[#D4AF37]" />
          <span>{lang === 'ar' ? 'محدد الألوان الدقيق (Hex Color Tokens)' : 'Color Tokens'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Primary Color */}
          <div className="p-4 rounded-2xl bg-[#0D0B12] border border-[#241E30] space-y-2">
            <label className="block text-xs font-bold text-gray-300">
              {lang === 'ar' ? 'اللون البنفسجي الأساسي (Primary)' : 'Primary Color'}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={themeForm.primaryColor}
                onChange={(e) => setThemeForm({ ...themeForm, primaryColor: e.target.value })}
                className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
              />
              <input
                type="text"
                value={themeForm.primaryColor}
                onChange={(e) => setThemeForm({ ...themeForm, primaryColor: e.target.value })}
                className="flex-1 px-3 py-2 rounded-xl bg-[#161222] border border-[#2B2338] text-white text-xs font-mono outline-none"
              />
            </div>
          </div>

          {/* Accent Gold */}
          <div className="p-4 rounded-2xl bg-[#0D0B12] border border-[#241E30] space-y-2">
            <label className="block text-xs font-bold text-gray-300">
              {lang === 'ar' ? 'اللون الذهبي الملكي (Accent Gold)' : 'Accent Gold'}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={themeForm.accentColor}
                onChange={(e) => setThemeForm({ ...themeForm, accentColor: e.target.value })}
                className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
              />
              <input
                type="text"
                value={themeForm.accentColor}
                onChange={(e) => setThemeForm({ ...themeForm, accentColor: e.target.value })}
                className="flex-1 px-3 py-2 rounded-xl bg-[#161222] border border-[#2B2338] text-white text-xs font-mono outline-none"
              />
            </div>
          </div>

          {/* Background */}
          <div className="p-4 rounded-2xl bg-[#0D0B12] border border-[#241E30] space-y-2">
            <label className="block text-xs font-bold text-gray-300">
              {lang === 'ar' ? 'خلفية الموقع الداكنة (Background)' : 'Background Canvas'}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={themeForm.backgroundColor}
                onChange={(e) => setThemeForm({ ...themeForm, backgroundColor: e.target.value })}
                className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
              />
              <input
                type="text"
                value={themeForm.backgroundColor}
                onChange={(e) => setThemeForm({ ...themeForm, backgroundColor: e.target.value })}
                className="flex-1 px-3 py-2 rounded-xl bg-[#161222] border border-[#2B2338] text-white text-xs font-mono outline-none"
              />
            </div>
          </div>

          {/* Card Background */}
          <div className="p-4 rounded-2xl bg-[#0D0B12] border border-[#241E30] space-y-2">
            <label className="block text-xs font-bold text-gray-300">
              {lang === 'ar' ? 'خلفية البطاقات (Card Background)' : 'Card Background'}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={themeForm.cardBackground}
                onChange={(e) => setThemeForm({ ...themeForm, cardBackground: e.target.value })}
                className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
              />
              <input
                type="text"
                value={themeForm.cardBackground}
                onChange={(e) => setThemeForm({ ...themeForm, cardBackground: e.target.value })}
                className="flex-1 px-3 py-2 rounded-xl bg-[#161222] border border-[#2B2338] text-white text-xs font-mono outline-none"
              />
            </div>
          </div>

          {/* Border Color */}
          <div className="p-4 rounded-2xl bg-[#0D0B12] border border-[#241E30] space-y-2">
            <label className="block text-xs font-bold text-gray-300">
              {lang === 'ar' ? 'حدود البطاقات (Card Border)' : 'Card Border'}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={themeForm.borderColor}
                onChange={(e) => setThemeForm({ ...themeForm, borderColor: e.target.value })}
                className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
              />
              <input
                type="text"
                value={themeForm.borderColor}
                onChange={(e) => setThemeForm({ ...themeForm, borderColor: e.target.value })}
                className="flex-1 px-3 py-2 rounded-xl bg-[#161222] border border-[#2B2338] text-white text-xs font-mono outline-none"
              />
            </div>
          </div>

          {/* Primary Text */}
          <div className="p-4 rounded-2xl bg-[#0D0B12] border border-[#241E30] space-y-2">
            <label className="block text-xs font-bold text-gray-300">
              {lang === 'ar' ? 'لون النصوص الرئيسي (Text Primary)' : 'Text Primary'}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={themeForm.textColor}
                onChange={(e) => setThemeForm({ ...themeForm, textColor: e.target.value })}
                className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
              />
              <input
                type="text"
                value={themeForm.textColor}
                onChange={(e) => setThemeForm({ ...themeForm, textColor: e.target.value })}
                className="flex-1 px-3 py-2 rounded-xl bg-[#161222] border border-[#2B2338] text-white text-xs font-mono outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
