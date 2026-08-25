import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { LogoSettings } from '../../types';
import { Crown, Save, Sliders, Upload, Trash2, Sun, Eye, Sparkles, RefreshCw, ZoomIn, Maximize2, MoveVertical, ShieldCheck } from 'lucide-react';

export const AdminBrandLogo: React.FC = () => {
  const { lang, theme, updateThemeRemote, content, updateContentRemote, uploadMediaRemote, showToast } = useApp();

  const [logoForm, setLogoForm] = useState<LogoSettings>(
    JSON.parse(
      JSON.stringify(
        theme.logoSettings || {
          lightLogoUrl: '',
          darkLogoUrl: '',
          widthDesktop: 190,
          heightDesktop: 52,
          widthMobile: 150,
          position: 'right',
          marginTop: 0,
          marginBottom: 0,
          opacity: 100,
          brightness: 100,
          contrast: 100,
          scale: 100,
          offsetY: 0,
          allowOverflow: true,
          showTextBrand: true,
        }
      )
    )
  );

  const [taglineAr, setTaglineAr] = useState(content.finalCta.taglineAr || 'بروستد بطعم الأوسكار');
  const [taglineEn, setTaglineEn] = useState(content.finalCta.taglineEn || 'Oscar-Grade Broasted');
  const [isSaving, setIsSaving] = useState(false);
  const [previewBg, setPreviewBg] = useState<'dark' | 'purple' | 'light' | 'white'>('dark');
  const [isDraggingDark, setIsDraggingDark] = useState(false);
  const [isDraggingLight, setIsDraggingLight] = useState(false);

  const darkFileInputRef = useRef<HTMLInputElement>(null);
  const lightFileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (theme.logoSettings) {
      setLogoForm({
        ...theme.logoSettings,
        brightness: theme.logoSettings.brightness ?? 100,
        contrast: theme.logoSettings.contrast ?? 100,
        opacity: theme.logoSettings.opacity ?? 100,
        scale: theme.logoSettings.scale ?? 100,
        offsetY: theme.logoSettings.offsetY ?? 0,
        allowOverflow: theme.logoSettings.allowOverflow ?? true,
      });
    }
  }, [theme.logoSettings]);

  // Handle Local File Upload from Computer
  const handleLogoFileUpload = (file: File, type: 'dark' | 'light') => {
    if (!file.type.startsWith('image/')) {
      showToast(lang === 'ar' ? 'يرجى اختيار ملف صورة صالح (PNG, SVG, JPG, WebP)' : 'Please select a valid image file', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast(lang === 'ar' ? 'حجم ملف الشعار يجب ألا يتجاوز 5 ميغابايت' : 'Logo file must be under 5MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        if (type === 'dark') {
          setLogoForm((prev) => ({ ...prev, darkLogoUrl: dataUrl }));
        } else {
          setLogoForm((prev) => ({ ...prev, lightLogoUrl: dataUrl }));
        }

        // Upload to server media storage in the background for permanent persistence
        uploadMediaRemote({
          title: `Logo (${type === 'dark' ? 'Dark' : 'Light'}) - ${file.name}`,
          category: 'brand',
          type: 'logo',
          dataUrl,
        });

        showToast(
          lang === 'ar'
            ? `تم تحميل شعار (${type === 'dark' ? 'الخلفيات الداكنة' : 'الخلفيات الفاتحة'}) من الحاسوب بنجاح!`
            : `Logo uploaded from computer successfully!`,
          'success'
        );
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const updatedTheme = {
      ...theme,
      logoSettings: logoForm,
    };
    const updatedContent = {
      ...content,
      finalCta: {
        ...content.finalCta,
        taglineAr,
        taglineEn,
      },
    };

    const s1 = await updateThemeRemote(updatedTheme);
    const s2 = await updateContentRemote(updatedContent);
    setIsSaving(false);

    if (s1 && s2) {
      showToast(lang === 'ar' ? 'تم تحديث إعدادات الشعار والعلامة التجارية بنجاح' : 'Brand & Logo settings updated', 'success');
    }
  };

  const handleResetFilters = () => {
    setLogoForm((prev) => ({
      ...prev,
      opacity: 100,
      brightness: 100,
      contrast: 100,
    }));
    showToast(lang === 'ar' ? 'تمت استعادة فلاتر السطوع والشفافية الافتراضية' : 'Filters reset to default', 'info');
  };

  // Compute CSS filter style for live preview
  const logoFilterStyle = {
    opacity: (logoForm.opacity ?? 100) / 100,
    filter: `brightness(${(logoForm.brightness ?? 100) / 100}) contrast(${(logoForm.contrast ?? 100) / 100})`,
  };

  const bgClasses = {
    dark: 'bg-[#0A0A0A] border-[#2B2338]',
    purple: 'bg-[#1A1128] border-[#C19B4A]/30',
    light: 'bg-[#F5F5F0] border-gray-300',
    white: 'bg-[#FFFFFF] border-gray-300',
  };

  const isLightBg = previewBg === 'light' || previewBg === 'white';
  const displayedLogo = isLightBg
    ? (logoForm.lightLogoUrl || logoForm.darkLogoUrl)
    : (logoForm.darkLogoUrl || logoForm.lightLogoUrl);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">
            {lang === 'ar' ? 'تخصيص الشعار والتحكم بالسطوع والشفافية' : 'Brand Logo, Brightness & Transparency Controls'}
          </h2>
          <p className="text-sm text-gray-400">
            {lang === 'ar'
              ? 'رفع الشعار الخاص بك مباشرة من جهاز الكمبيوتر، والتحكم الدقيق في شفافية وسطوع وتباين الشعار.'
              : 'Upload your own logo from your computer, with precise controls for brightness, opacity, and dimensions.'}
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 rounded-xl font-black text-sm text-black bg-gradient-to-r from-[#D4AF37] to-[#E5BE48] hover:brightness-110 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? (lang === 'ar' ? 'جارٍ الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ إعدادات الهوية' : 'Save Brand Settings')}</span>
        </button>
      </div>

      {/* Live Interactive Preview Card with Background & Filter Switchers */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#161222] border border-[#2B2338] space-y-6 text-start shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2B2338] pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-sm font-bold text-white uppercase tracking-wider">
              {lang === 'ar' ? 'المعاينة الحية للشعار والمحاكاة في الشريط العلوي' : 'Live Logo & Navbar Simulation'}
            </span>
          </div>

          {/* Background selector chips */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-gray-400 me-1">{lang === 'ar' ? 'خلفية المعاينة:' : 'Preview Bg:'}</span>
            <button
              type="button"
              onClick={() => setPreviewBg('dark')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                previewBg === 'dark' ? 'bg-[#0A0A0A] text-[#D4AF37] border border-[#D4AF37]' : 'bg-[#0D0B12] text-gray-400 hover:text-white'
              }`}
            >
              {lang === 'ar' ? 'داكن (Obsidian)' : 'Dark'}
            </button>
            <button
              type="button"
              onClick={() => setPreviewBg('purple')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                previewBg === 'purple' ? 'bg-[#4B0082] text-white border border-[#D4AF37]' : 'bg-[#0D0B12] text-gray-400 hover:text-white'
              }`}
            >
              {lang === 'ar' ? 'بنفسجي ملكي' : 'Royal Purple'}
            </button>
            <button
              type="button"
              onClick={() => setPreviewBg('white')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                previewBg === 'white' ? 'bg-white text-black border border-[#D4AF37]' : 'bg-[#0D0B12] text-gray-400 hover:text-white'
              }`}
            >
              {lang === 'ar' ? 'أبيض' : 'White'}
            </button>
          </div>
        </div>

        {/* 1. Isolated Logo Visual Display */}
        <div className={`p-8 rounded-2xl border flex items-center justify-center min-h-[140px] transition-colors duration-300 ${bgClasses[previewBg]}`}>
          {displayedLogo ? (
            <div className="flex flex-col items-center gap-2">
              <div
                style={{
                  transform: `translateY(${logoForm.offsetY || 0}px) scale(${(logoForm.scale ?? 100) / 100})`,
                }}
                className="transition-transform duration-200"
              >
                <img
                  src={displayedLogo}
                  alt="Logo Preview"
                  style={{
                    width: `${logoForm.widthDesktop}px`,
                    maxHeight: `${logoForm.heightDesktop}px`,
                    objectFit: 'contain',
                    ...logoFilterStyle,
                  }}
                  className="transition-all duration-200"
                />
              </div>
              <span className={`text-[10px] font-mono mt-2 ${isLightBg ? 'text-gray-600' : 'text-gray-400'}`}>
                {lang === 'ar'
                  ? `الحجم: ${logoForm.scale ?? 100}% | السطوع: ${logoForm.brightness ?? 100}% | الشفافية: ${logoForm.opacity ?? 100}%`
                  : `Scale: ${logoForm.scale ?? 100}% | Brightness: ${logoForm.brightness ?? 100}% | Opacity: ${logoForm.opacity ?? 100}%`}
              </span>
            </div>
          ) : (
            <div
              className="flex items-center gap-3.5"
              style={logoFilterStyle}
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4B0082] via-[#7E22CE] to-[#D4AF37] p-0.5 flex items-center justify-center shadow-xl">
                <div className="w-full h-full bg-[#0D0B12] rounded-[14px] flex items-center justify-center">
                  <Crown className="w-6 h-6 text-[#D4AF37]" />
                </div>
              </div>
              {logoForm.showTextBrand && (
                <div>
                  <div className={`font-extrabold text-2xl font-['Outfit'] tracking-tight ${isLightBg ? 'text-gray-900' : 'text-white'}`}>
                    AL PACINO <span className="text-xs text-[#D4AF37] font-bold">BROASTED</span>
                  </div>
                  <div className={`text-xs font-medium tracking-wide ${isLightBg ? 'text-[#8C6B1C]' : 'text-[#D4AF37]'}`}>
                    {lang === 'ar' ? taglineAr : taglineEn}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 2. Simulated Navbar Header Bar (Shows that navbar height stays locked & fixed) */}
        <div className="space-y-2 pt-2 border-t border-[#2B2338]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              <span>{lang === 'ar' ? 'محاكاة الشعار في شريط التنقل العلوي للموقع (ارتفاع ثابت بدون تمدد):' : 'Navbar Header Simulation (Strict Fixed Height):'}</span>
            </span>
            <span className="text-[11px] font-mono text-green-400 bg-green-950/60 px-2 py-0.5 rounded border border-green-500/30">
              {lang === 'ar' ? 'ارتفاع الشريط ثابت (80px)' : 'Navbar Height: 80px (Locked)'}
            </span>
          </div>

          <div className="rounded-2xl bg-[#1A1128]/95 border border-[#C19B4A]/40 shadow-xl overflow-visible px-5 h-20 max-h-20 flex items-center justify-between relative">
            {/* Simulated Logo */}
            <div className="h-full flex items-center overflow-visible relative">
              <div
                style={{
                  transform: `translateY(${logoForm.offsetY || 0}px) scale(${(logoForm.scale ?? 100) / 100})`,
                  transformOrigin: lang === 'ar' ? 'right center' : 'left center',
                }}
                className="relative z-10 flex items-center transition-all duration-200"
              >
                {displayedLogo ? (
                  <img
                    src={displayedLogo}
                    alt="Navbar Simulation"
                    style={{
                      width: `${logoForm.widthDesktop}px`,
                      maxHeight: `${logoForm.heightDesktop}px`,
                      objectFit: 'contain',
                      ...logoFilterStyle,
                    }}
                    className="pointer-events-auto"
                  />
                ) : (
                  <div className="bg-[#4B0082] px-3 py-1.5 rounded-lg border border-[#C19B4A]/40">
                    <span className="text-base font-black text-[#C19B4A] font-['Outfit']">AL PACINO</span>
                  </div>
                )}
              </div>
            </div>

            {/* Mock Nav links */}
            <div className="hidden sm:flex items-center gap-3 text-xs text-gray-300 font-medium">
              <span className="text-[#C19B4A]">{lang === 'ar' ? 'الرئيسية' : 'Home'}</span>
              <span>{lang === 'ar' ? 'فرصة الاستثمار' : 'Opportunity'}</span>
              <span>{lang === 'ar' ? 'نموذج JV' : 'JV Model'}</span>
              <span>{lang === 'ar' ? 'تواصل معنا' : 'Contact'}</span>
            </div>

            {/* Mock CTA */}
            <div className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#E5BE48] text-black font-bold text-xs shadow-md">
              {lang === 'ar' ? 'سجل اهتمامك' : 'Apply Now'}
            </div>
          </div>
        </div>
      </div>

      {/* 1. UPLOAD LOGO FROM COMPUTER (MAIN FEATURE) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#161222] border border-[#2B2338] space-y-6 text-start">
        <div className="flex items-center justify-between border-b border-[#2B2338] pb-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Upload className="w-5 h-5 text-[#D4AF37]" />
            <span>{lang === 'ar' ? 'رفع الشعار الخاص بك من جهاز الكمبيوتر' : 'Upload Your Logo from Computer'}</span>
          </h3>
          <span className="text-xs text-[#D4AF37] bg-[#3B113D] px-3 py-1 rounded-full border border-[#D4AF37]/30">
            PNG, SVG, JPG, WebP
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dark Background Logo Upload Zone */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                <span>{lang === 'ar' ? 'الشعار الأساسي / للخلفيات الداكنة' : 'Primary Logo (Dark Background)'}</span>
              </label>
              {logoForm.darkLogoUrl && (
                <button
                  type="button"
                  onClick={() => setLogoForm((prev) => ({ ...prev, darkLogoUrl: '' }))}
                  className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>{lang === 'ar' ? 'إزالة الشعار' : 'Remove'}</span>
                </button>
              )}
            </div>

            <input
              type="file"
              ref={darkFileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleLogoFileUpload(file, 'dark');
              }}
            />

            <div
              onClick={() => darkFileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingDark(true);
              }}
              onDragLeave={() => setIsDraggingDark(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingDark(false);
                const file = e.dataTransfer.files?.[0];
                if (file) handleLogoFileUpload(file, 'dark');
              }}
              className={`p-6 rounded-2xl border-2 border-dashed transition flex flex-col items-center justify-center text-center cursor-pointer min-h-[160px] group ${
                isDraggingDark
                  ? 'border-[#D4AF37] bg-[#3B113D]/40'
                  : 'border-[#2B2338] bg-[#0D0B12] hover:border-[#D4AF37]/60 hover:bg-[#1A1426]'
              }`}
            >
              {logoForm.darkLogoUrl ? (
                <div className="space-y-2">
                  <img
                    src={logoForm.darkLogoUrl}
                    alt="Dark Logo"
                    className="max-h-16 max-w-[180px] object-contain mx-auto group-hover:scale-105 transition"
                  />
                  <p className="text-[11px] text-[#D4AF37] font-semibold">
                    {lang === 'ar' ? 'انقر أو اسحب ملفاً هنا لتغيير الشعار' : 'Click or drop to replace logo'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#1C1629] text-[#D4AF37] flex items-center justify-center mx-auto group-hover:scale-110 transition">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-white">
                    {lang === 'ar' ? 'اختر ملف الشعار من حاسوبك' : 'Choose Logo file from Computer'}
                  </div>
                  <p className="text-[11px] text-gray-500">
                    {lang === 'ar' ? 'اسحب وأفلت الملف هنا أو انقر للاستعراض' : 'Drag & drop file or click to browse'}
                  </p>
                </div>
              )}
            </div>

            {/* Optional URL override */}
            <div className="pt-1">
              <label className="block text-[10px] text-gray-400 mb-1">
                {lang === 'ar' ? 'أو أدخل رابط URL مباشر:' : 'Or enter direct URL:'}
              </label>
              <input
                type="text"
                value={logoForm.darkLogoUrl || ''}
                onChange={(e) => setLogoForm({ ...logoForm, darkLogoUrl: e.target.value })}
                placeholder="https://.../logo.png"
                className="w-full px-3 py-1.5 rounded-lg bg-[#0D0B12] border border-[#2B2338] text-white text-xs font-mono outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* Light Background Logo Upload Zone */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <span>{lang === 'ar' ? 'شعار الخلفيات الفاتحة (اختياري)' : 'Light Background Logo (Optional)'}</span>
              </label>
              {logoForm.lightLogoUrl && (
                <button
                  type="button"
                  onClick={() => setLogoForm((prev) => ({ ...prev, lightLogoUrl: '' }))}
                  className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>{lang === 'ar' ? 'إزالة' : 'Remove'}</span>
                </button>
              )}
            </div>

            <input
              type="file"
              ref={lightFileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleLogoFileUpload(file, 'light');
              }}
            />

            <div
              onClick={() => lightFileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingLight(true);
              }}
              onDragLeave={() => setIsDraggingLight(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingLight(false);
                const file = e.dataTransfer.files?.[0];
                if (file) handleLogoFileUpload(file, 'light');
              }}
              className={`p-6 rounded-2xl border-2 border-dashed transition flex flex-col items-center justify-center text-center cursor-pointer min-h-[160px] group ${
                isDraggingLight
                  ? 'border-purple-400 bg-[#3B113D]/40'
                  : 'border-[#2B2338] bg-[#0D0B12] hover:border-purple-400/60 hover:bg-[#1A1426]'
              }`}
            >
              {logoForm.lightLogoUrl ? (
                <div className="space-y-2">
                  <img
                    src={logoForm.lightLogoUrl}
                    alt="Light Logo"
                    className="max-h-16 max-w-[180px] object-contain mx-auto group-hover:scale-105 transition p-1 bg-white/10 rounded-lg"
                  />
                  <p className="text-[11px] text-purple-300 font-semibold">
                    {lang === 'ar' ? 'انقر أو اسحب لتغيير الشعار الفاتح' : 'Click or drop to replace light logo'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#1C1629] text-purple-400 flex items-center justify-center mx-auto group-hover:scale-110 transition">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-white">
                    {lang === 'ar' ? 'رفع شعار للخلفيات الفاتحة' : 'Upload Light Background Logo'}
                  </div>
                  <p className="text-[11px] text-gray-500">
                    {lang === 'ar' ? 'شعار بلون داكن أو أرجواني مناسب للمطبوعات الفاتحة' : 'Dark/purple logo for light themes'}
                  </p>
                </div>
              )}
            </div>

            {/* Optional URL override */}
            <div className="pt-1">
              <label className="block text-[10px] text-gray-400 mb-1">
                {lang === 'ar' ? 'أو أدخل رابط URL مباشر:' : 'Or enter direct URL:'}
              </label>
              <input
                type="text"
                value={logoForm.lightLogoUrl || ''}
                onChange={(e) => setLogoForm({ ...logoForm, lightLogoUrl: e.target.value })}
                placeholder="https://.../logo-dark.png"
                className="w-full px-3 py-1.5 rounded-lg bg-[#0D0B12] border border-[#2B2338] text-white text-xs font-mono outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. BRIGHTNESS, TRANSPARENCY & CONTRAST SLIDERS (REQUESTED CONTROLS) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#161222] border border-[#2B2338] space-y-6 text-start">
        <div className="flex items-center justify-between border-b border-[#2B2338] pb-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sun className="w-5 h-5 text-[#D4AF37]" />
            <span>{lang === 'ar' ? 'التحكم في سطوع وشفافية الشعار (Brightness & Transparency)' : 'Logo Brightness & Transparency Filters'}</span>
          </h3>
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-xs text-gray-400 hover:text-[#D4AF37] flex items-center gap-1 transition"
          >
            <RefreshCw className="w-3 h-3" />
            <span>{lang === 'ar' ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Brightness Slider (السطوع) */}
          <div className="p-4 rounded-2xl bg-[#0D0B12] border border-[#2B2338] space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-gray-300 flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-400" />
                <span>{lang === 'ar' ? 'مستوى السطوع (Brightness)' : 'Brightness'}</span>
              </span>
              <span className="text-[#D4AF37] font-mono font-bold">{logoForm.brightness ?? 100}%</span>
            </div>
            <input
              type="range"
              min="30"
              max="200"
              step="5"
              value={logoForm.brightness ?? 100}
              onChange={(e) => setLogoForm({ ...logoForm, brightness: Number(e.target.value) })}
              className="w-full accent-[#D4AF37] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-mono">
              <span>{lang === 'ar' ? 'داكن 30%' : 'Dark 30%'}</span>
              <span>100% (عادي)</span>
              <span>{lang === 'ar' ? 'ساطع 200%' : 'Bright 200%'}</span>
            </div>
          </div>

          {/* Opacity / Transparency Slider (الشفافية) */}
          <div className="p-4 rounded-2xl bg-[#0D0B12] border border-[#2B2338] space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-gray-300 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-purple-400" />
                <span>{lang === 'ar' ? 'درجة الشفافية (Opacity)' : 'Transparency / Opacity'}</span>
              </span>
              <span className="text-[#D4AF37] font-mono font-bold">{logoForm.opacity ?? 100}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              step="5"
              value={logoForm.opacity ?? 100}
              onChange={(e) => setLogoForm({ ...logoForm, opacity: Number(e.target.value) })}
              className="w-full accent-[#D4AF37] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-mono">
              <span>{lang === 'ar' ? 'شفاف 20%' : '20% Transparent'}</span>
              <span>{lang === 'ar' ? 'معتم 100%' : '100% Solid'}</span>
            </div>
          </div>

          {/* Contrast Slider (التباين) */}
          <div className="p-4 rounded-2xl bg-[#0D0B12] border border-[#2B2338] space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-gray-300 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-blue-400" />
                <span>{lang === 'ar' ? 'مستوى التباين (Contrast)' : 'Contrast'}</span>
              </span>
              <span className="text-[#D4AF37] font-mono font-bold">{logoForm.contrast ?? 100}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="160"
              step="5"
              value={logoForm.contrast ?? 100}
              onChange={(e) => setLogoForm({ ...logoForm, contrast: Number(e.target.value) })}
              className="w-full accent-[#D4AF37] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-mono">
              <span>50%</span>
              <span>100%</span>
              <span>160%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. LOGO SCALE & DIMENSIONS (ZERO NAVBAR SHIFT) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#161222] border border-[#2B2338] space-y-6 text-start">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2B2338] pb-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ZoomIn className="w-5 h-5 text-[#D4AF37]" />
            <span>{lang === 'ar' ? 'التحكم في تكبير وحجم الشعار (بدون تغيير ارتفاع الشريط)' : 'Logo Scale & Sizing (Zero Navbar Shift)'}</span>
          </h3>
          <span className="text-xs text-green-400 bg-green-950/60 px-3 py-1 rounded-full border border-green-500/30 flex items-center gap-1.5 w-fit">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'ارتفاع الشريط محمي وثابت 80px' : 'Navbar Height Locked (80px)'}</span>
          </span>
        </div>

        {/* Feature explanation notice */}
        <div className="p-3.5 rounded-xl bg-[#0D0B12] border border-[#D4AF37]/20 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-300 leading-relaxed">
            {lang === 'ar'
              ? 'يمكنك تكبير الشعار إلى أي حجم تريده (مثلاً 130% أو 150% أو 180%) ليظهر الشعار بارزاً وفخماً، بينما يظل شريط الموقع العلوي (Navbar) بنفس ارتفاعه الفاخر وثابتاً تماماً دون أي تشويه أو تمدد في الشريط.'
              : 'Scale your logo to any size (e.g. 130%, 150%, 180%) for maximum visual prominence, while the navbar bar remains locked at its fixed luxury height without stretching.'}
          </p>
        </div>

        {/* Primary Scale & Zoom Slider + Presets */}
        <div className="p-5 rounded-2xl bg-[#0D0B12] border border-[#2B2338] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Maximize2 className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-xs font-bold text-white">
                {lang === 'ar' ? 'مقياس تكبير الشعار (Logo Zoom & Scale %)' : 'Logo Zoom & Scale Multiplier'}
              </span>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { val: 100, labelAr: '100% عادي', labelEn: '100% Normal' },
                { val: 125, labelAr: '125% كبير', labelEn: '125% Large' },
                { val: 150, labelAr: '150% بارز', labelEn: '150% Prominent' },
                { val: 175, labelAr: '175% فاخر', labelEn: '175% XL' },
                { val: 200, labelAr: '200% ماكس', labelEn: '200% Max' },
              ].map((p) => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => setLogoForm((prev) => ({ ...prev, scale: p.val }))}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer whitespace-nowrap ${
                    (logoForm.scale ?? 100) === p.val
                      ? 'bg-[#3B113D] border border-[#D4AF37] text-white'
                      : 'bg-[#1C1628] text-gray-400 hover:text-white'
                  }`}
                >
                  {lang === 'ar' ? p.labelAr : p.labelEn}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-gray-300">{lang === 'ar' ? 'نسبة التكبير الفعلية:' : 'Actual Scale Factor:'}</span>
              <span className="text-[#D4AF37] font-mono text-sm font-black">{logoForm.scale ?? 100}%</span>
            </div>
            <input
              type="range"
              min="70"
              max="250"
              step="5"
              value={logoForm.scale ?? 100}
              onChange={(e) => setLogoForm({ ...logoForm, scale: Number(e.target.value) })}
              className="w-full accent-[#D4AF37] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-mono">
              <span>70% (أصغر)</span>
              <span>100% (الافتراضي)</span>
              <span>150% (بارز)</span>
              <span>250% (أقصى تكبير)</span>
            </div>
          </div>
        </div>

        {/* Secondary Dimension Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {/* Vertical Offset Y (تحريك الشعار رأسياً) */}
          <div className="p-4 rounded-2xl bg-[#0D0B12] border border-[#2B2338] space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-gray-300">
              <span className="flex items-center gap-1">
                <MoveVertical className="w-3.5 h-3.5 text-purple-400" />
                <span>{lang === 'ar' ? 'المحاذاة الرأسية (Y)' : 'Vertical Offset Y'}</span>
              </span>
              <span className="text-[#D4AF37] font-mono">{logoForm.offsetY ?? 0}px</span>
            </div>
            <input
              type="range"
              min="-25"
              max="25"
              step="1"
              value={logoForm.offsetY ?? 0}
              onChange={(e) => setLogoForm({ ...logoForm, offsetY: Number(e.target.value) })}
              className="w-full accent-[#D4AF37] cursor-pointer"
            />
            <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono">
              <span>-25px (أعلى)</span>
              <button
                type="button"
                onClick={() => setLogoForm((prev) => ({ ...prev, offsetY: 0 }))}
                className="text-[#D4AF37] hover:underline cursor-pointer"
              >
                0 (وسط)
              </button>
              <span>+25px (أسفل)</span>
            </div>
          </div>

          {/* Desktop Width Slider */}
          <div className="p-4 rounded-2xl bg-[#0D0B12] border border-[#2B2338] space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-gray-300">
              <span>{lang === 'ar' ? 'عرض الشعار (ديسكتوب)' : 'Desktop Width'}</span>
              <span className="text-[#D4AF37] font-mono">{logoForm.widthDesktop}px</span>
            </div>
            <input
              type="range"
              min="80"
              max="450"
              step="5"
              value={logoForm.widthDesktop}
              onChange={(e) => setLogoForm({ ...logoForm, widthDesktop: Number(e.target.value) })}
              className="w-full accent-[#D4AF37] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-mono">
              <span>80px</span>
              <span>250px</span>
              <span>450px</span>
            </div>
          </div>

          {/* Desktop Max Height Slider */}
          <div className="p-4 rounded-2xl bg-[#0D0B12] border border-[#2B2338] space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-gray-300">
              <span>{lang === 'ar' ? 'أقصى ارتفاع للشعار' : 'Max Logo Height'}</span>
              <span className="text-[#D4AF37] font-mono">{logoForm.heightDesktop}px</span>
            </div>
            <input
              type="range"
              min="24"
              max="160"
              step="2"
              value={logoForm.heightDesktop}
              onChange={(e) => setLogoForm({ ...logoForm, heightDesktop: Number(e.target.value) })}
              className="w-full accent-[#D4AF37] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-mono">
              <span>24px</span>
              <span>75px</span>
              <span>160px</span>
            </div>
          </div>

          {/* Mobile Width Slider */}
          <div className="p-4 rounded-2xl bg-[#0D0B12] border border-[#2B2338] space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-gray-300">
              <span>{lang === 'ar' ? 'عرض الشعار (الموبايل)' : 'Mobile Width'}</span>
              <span className="text-[#D4AF37] font-mono">{logoForm.widthMobile}px</span>
            </div>
            <input
              type="range"
              min="60"
              max="300"
              step="5"
              value={logoForm.widthMobile}
              onChange={(e) => setLogoForm({ ...logoForm, widthMobile: Number(e.target.value) })}
              className="w-full accent-[#D4AF37] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-mono">
              <span>60px</span>
              <span>160px</span>
              <span>300px</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. BRAND SLOGAN & TEXT */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#161222] border border-[#2B2338] space-y-6 text-start">
        <h3 className="text-lg font-bold text-white border-b border-[#2B2338] pb-3">
          {lang === 'ar' ? 'الشعار اللفظي للعلامة (Brand Tagline)' : 'Brand Tagline'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-2">الشعار اللفظي (عربي)</label>
            <input
              type="text"
              value={taglineAr}
              onChange={(e) => setTaglineAr(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0D0B12] border border-[#2B2338] text-white text-sm outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-2">Tagline (English)</label>
            <input
              type="text"
              value={taglineEn}
              onChange={(e) => setTaglineEn(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0D0B12] border border-[#2B2338] text-white text-sm outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

