import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { MediaItem } from '../../types';
import { Upload, Plus, Trash2, Copy, Check, Sliders, Sun, Eye, Sparkles, RefreshCw, X, Image as ImageIcon } from 'lucide-react';

export const AdminMediaLibrary: React.FC = () => {
  const { lang, media, uploadMediaRemote, deleteMediaRemote, updateContentRemote, content, showToast } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);

  // New Media Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'hero' | 'story' | 'storefront' | 'brand' | 'gallery'>('storefront');
  const [url, setUrl] = useState('');
  const [brightness, setBrightness] = useState<number>(100);
  const [opacity, setOpacity] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [blur, setBlur] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredMedia = media.filter(
    (m) => categoryFilter === 'all' || m.category === categoryFilter
  );

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast(lang === 'ar' ? 'يرجى اختيار ملف صورة صالح' : 'Please select a valid image file', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast(lang === 'ar' ? 'حجم الصورة يجب ألا يتجاوز 5 ميغابايت' : 'Image must be under 5MB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setUrl(reader.result as string);
      if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ''));
    };
    reader.readAsDataURL(file);
  };

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      showToast(lang === 'ar' ? 'يرجى اختيار صورة من جهازك أو وضع رابط URL' : 'Please upload an image or provide a URL', 'error');
      return;
    }

    setIsUploading(true);
    const newMedia = await uploadMediaRemote({
      title: title || 'AL PACINO Asset',
      dataUrl: url.startsWith('data:') ? url : undefined,
      externalUrl: !url.startsWith('data:') ? url : undefined,
      category,
      type: category === 'hero' ? 'banner' : category === 'brand' ? 'logo' : 'image',
      brightness,
      opacity,
      contrast,
      blur,
    });
    setIsUploading(false);

    if (newMedia) {
      showToast(lang === 'ar' ? 'تمت إضافة الصورة بنجاح وتطبيق الفلاتر!' : 'Media added to library with filters!', 'success');
      setShowAddModal(false);
      setTitle('');
      setUrl('');
      setBrightness(100);
      setOpacity(100);
      setContrast(100);
      setBlur(0);
    }
  };

  const handleCopy = (urlStr: string, id: string) => {
    navigator.clipboard.writeText(urlStr);
    setCopiedId(id);
    showToast(lang === 'ar' ? 'تم نسخ الرابط للحافظة' : 'URL copied to clipboard', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSetHeroImage = async (item: MediaItem) => {
    await updateContentRemote({
      ...content,
      hero: {
        ...content.hero,
        bgImage: item.url,
        bgImageBrightness: item.brightness ?? 100,
        bgImageOpacity: item.opacity ?? 100,
      },
    });
    showToast(lang === 'ar' ? 'تم تعيين الصورة كخلفية للواجهة الرئيسية (Hero) مع تأثيراتها' : 'Assigned as Hero background with filter settings', 'success');
  };

  const handleSetStoryImage = async (item: MediaItem) => {
    await updateContentRemote({
      ...content,
      story: {
        ...content.story,
        storyImage: item.url,
        storyImageBrightness: item.brightness ?? 100,
        storyImageOpacity: item.opacity ?? 100,
      },
    });
    showToast(lang === 'ar' ? 'تم تعيين الصورة لقسم قصة النجاح (Story)' : 'Assigned as Story image', 'success');
  };

  const applyPreset = (b: number, o: number, c: number, bl = 0) => {
    setBrightness(b);
    setOpacity(o);
    setContrast(c);
    setBlur(bl);
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">
            {lang === 'ar' ? 'مكتبة الوسائط والتحكم بالصور' : 'Media Assets & Image Filter Studio'}
          </h2>
          <p className="text-sm text-gray-400">
            {lang === 'ar'
              ? `رفع الصور من جهاز الكمبيوتر والتحكم في شفافية وسطوع وتباين كل صورة (${media.length} عنصر)`
              : `Upload images from your computer and manage brightness & transparency (${media.length} items)`}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-xl font-bold text-sm text-black bg-gradient-to-r from-[#D4AF37] to-[#E5BE48] hover:brightness-110 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === 'ar' ? 'إضافة صورة من الحاسوب' : 'Upload Image from Computer'}</span>
        </button>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', labelAr: 'الكل (All)', labelEn: 'All' },
          { id: 'hero', labelAr: 'الواجهة الرئيسية (Hero)', labelEn: 'Hero' },
          { id: 'story', labelAr: 'القصة (Story)', labelEn: 'Story' },
          { id: 'storefront', labelAr: 'الفروع (Storefront)', labelEn: 'Storefront' },
          { id: 'brand', labelAr: 'الهوية والشعار (Brand)', labelEn: 'Brand' },
          { id: 'gallery', labelAr: 'المعرض (Gallery)', labelEn: 'Gallery' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              categoryFilter === cat.id
                ? 'bg-[#3B113D] border border-[#D4AF37] text-white shadow-md shadow-purple-900/30'
                : 'bg-[#161222] border border-[#2B2338] text-gray-400 hover:text-white'
            }`}
          >
            {lang === 'ar' ? cat.labelAr : cat.labelEn}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredMedia.map((item) => {
          const itemFilterStyle = {
            opacity: (item.opacity ?? 100) / 100,
            filter: `brightness(${(item.brightness ?? 100) / 100}) contrast(${(item.contrast ?? 100) / 100}) blur(${item.blur ?? 0}px)`,
          };

          return (
            <div
              key={item.id}
              className="rounded-3xl bg-[#161222] border border-[#2B2338] overflow-hidden group shadow-xl flex flex-col justify-between hover:border-[#D4AF37]/50 transition-all duration-300"
            >
              {/* Image Preview Container with Filter applied */}
              <div className="relative aspect-video bg-[#0D0B12] overflow-hidden">
                <img
                  src={item.url}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  style={itemFilterStyle}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2.5 start-2.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[#D4AF37] border border-[#D4AF37]/30">
                  {item.category}
                </span>

                {/* Filter indicators badge */}
                {(item.brightness !== undefined || item.opacity !== undefined) && (
                  <span className="absolute bottom-2 end-2 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/80 text-gray-300 backdrop-blur-md border border-white/10">
                    💡{item.brightness ?? 100}% | 👁️{item.opacity ?? 100}%
                  </span>
                )}
              </div>

              {/* Info & Actions */}
              <div className="p-4 space-y-3">
                <div>
                  <h4 className="font-bold text-white text-sm truncate">{item.title}</h4>
                  <div className="text-[11px] text-gray-500 font-mono truncate mt-0.5" dir="ltr">
                    {item.fileSize || 'Asset'} • {item.uploadedAt}
                  </div>
                </div>

                {/* Direct Set Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#241E30]">
                  <button
                    type="button"
                    onClick={() => handleSetHeroImage(item)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#221834] hover:bg-[#342452] text-[11px] font-semibold text-purple-300 hover:text-white transition text-center cursor-pointer"
                  >
                    {lang === 'ar' ? 'تعيين لـ Hero' : 'Set as Hero'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetStoryImage(item)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#221834] hover:bg-[#342452] text-[11px] font-semibold text-purple-300 hover:text-white transition text-center cursor-pointer"
                  >
                    {lang === 'ar' ? 'تعيين للقصة' : 'Set as Story'}
                  </button>
                </div>

                {/* Adjust Filter & Copy & Delete */}
                <div className="flex items-center justify-between pt-1 border-t border-[#241E30]/60">
                  <button
                    type="button"
                    onClick={() => setEditingMedia(item)}
                    className="text-xs text-[#D4AF37] hover:text-[#E5BE48] flex items-center gap-1 transition cursor-pointer font-semibold"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'تعديل السطوع' : 'Adjust Filters'}</span>
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleCopy(item.url, item.id)}
                      className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition cursor-pointer"
                      title={lang === 'ar' ? 'نسخ الرابط' : 'Copy URL'}
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteMediaRemote(item.id)}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition cursor-pointer"
                      title={lang === 'ar' ? 'حذف' : 'Delete'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. ADD / UPLOAD MEDIA MODAL WITH LIVE FILTERS */}
      {/* ------------------------------------------------------------- */}
      {showAddModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl bg-[#161222] border border-[#3A2D52] shadow-2xl p-6 sm:p-8 space-y-5 text-start my-8">
            <div className="flex items-center justify-between border-b border-[#2B2338] pb-3">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-[#D4AF37]" />
                <span>{lang === 'ar' ? 'رفع صورة جديدة وضبط السطوع والشفافية' : 'Upload Image & Adjust Lighting'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMedia} className="space-y-5">
              {/* Drag & Drop File Upload Box */}
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-2">
                  {lang === 'ar' ? 'ملف الصورة من الحاسوب' : 'Image File from Computer'}
                </label>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileUpload(f);
                  }}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const f = e.dataTransfer.files?.[0];
                    if (f) handleFileUpload(f);
                  }}
                  className={`p-6 rounded-2xl border-2 border-dashed transition flex flex-col items-center justify-center text-center cursor-pointer min-h-[140px] group ${
                    isDragging
                      ? 'border-[#D4AF37] bg-[#3B113D]/40'
                      : 'border-[#2B2338] bg-[#0D0B12] hover:border-[#D4AF37]/60 hover:bg-[#1A1426]'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#1C1629] text-[#D4AF37] flex items-center justify-center mx-auto group-hover:scale-110 transition mb-2">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-white">
                    {url ? (lang === 'ar' ? 'انقر لتغيير الصورة المحددة' : 'Click to replace selected image') : (lang === 'ar' ? 'اسحب الصورة هنا أو انقر للاستعراض من جهازك' : 'Drag & drop image or browse from computer')}
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">PNG, JPG, WebP (Max 5MB)</p>
                </div>

                <div className="mt-2">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder={lang === 'ar' ? 'أو أدخل رابط URL مباشر...' : 'Or enter direct URL...'}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0D0B12] border border-[#2B2338] text-white text-xs font-mono outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    {lang === 'ar' ? 'عنوان أو وصف الصورة' : 'Image Title'}
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Al Pacino Signature Broasted"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0D0B12] border border-[#2B2338] text-white text-xs outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    {lang === 'ar' ? 'التصنيف' : 'Category'}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0D0B12] border border-[#2B2338] text-white text-xs outline-none focus:border-[#D4AF37]"
                  >
                    <option value="hero">Hero (الواجهة الرئيسية)</option>
                    <option value="story">Story (قصة النجاح)</option>
                    <option value="storefront">Storefront (الفروع والتصميم)</option>
                    <option value="brand">Brand (الهوية والشعار)</option>
                    <option value="gallery">Gallery (المعرض العام)</option>
                  </select>
                </div>
              </div>

              {/* Real-time Filter Adjustments */}
              {url && (
                <div className="p-4 rounded-2xl bg-[#0D0B12] border border-[#2B2338] space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Sun className="w-4 h-4 text-[#D4AF37]" />
                      <span>{lang === 'ar' ? 'التحكم في السطوع والشفافية المباشر' : 'Live Brightness & Opacity Tuning'}</span>
                    </span>
                    {/* Quick Presets */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => applyPreset(100, 100, 100, 0)}
                        className="px-2 py-0.5 rounded text-[10px] bg-[#1F172E] hover:bg-[#2B213E] text-gray-300"
                      >
                        {lang === 'ar' ? 'عادي' : 'Normal'}
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPreset(80, 85, 120, 0)}
                        className="px-2 py-0.5 rounded text-[10px] bg-[#1F172E] hover:bg-[#2B213E] text-[#D4AF37]"
                      >
                        {lang === 'ar' ? 'سينمائي' : 'Cinematic'}
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPreset(125, 100, 110, 0)}
                        className="px-2 py-0.5 rounded text-[10px] bg-[#1F172E] hover:bg-[#2B213E] text-amber-300"
                      >
                        {lang === 'ar' ? 'ساطع' : 'Bright'}
                      </button>
                    </div>
                  </div>

                  {/* Sliders Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Brightness */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-gray-300 font-semibold">
                        <span>{lang === 'ar' ? 'السطوع (Brightness)' : 'Brightness'}</span>
                        <span className="text-[#D4AF37] font-mono">{brightness}%</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="200"
                        value={brightness}
                        onChange={(e) => setBrightness(Number(e.target.value))}
                        className="w-full accent-[#D4AF37] cursor-pointer"
                      />
                    </div>

                    {/* Opacity */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-gray-300 font-semibold">
                        <span>{lang === 'ar' ? 'الشفافية (Opacity)' : 'Opacity'}</span>
                        <span className="text-[#D4AF37] font-mono">{opacity}%</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="100"
                        value={opacity}
                        onChange={(e) => setOpacity(Number(e.target.value))}
                        className="w-full accent-[#D4AF37] cursor-pointer"
                      />
                    </div>

                    {/* Contrast */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-gray-300 font-semibold">
                        <span>{lang === 'ar' ? 'التباين (Contrast)' : 'Contrast'}</span>
                        <span className="text-[#D4AF37] font-mono">{contrast}%</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="160"
                        value={contrast}
                        onChange={(e) => setContrast(Number(e.target.value))}
                        className="w-full accent-[#D4AF37] cursor-pointer"
                      />
                    </div>

                    {/* Blur */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-gray-300 font-semibold">
                        <span>{lang === 'ar' ? 'الضبابية (Blur)' : 'Blur'}</span>
                        <span className="text-[#D4AF37] font-mono">{blur}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="12"
                        value={blur}
                        onChange={(e) => setBlur(Number(e.target.value))}
                        className="w-full accent-[#D4AF37] cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Live Visual Preview */}
                  <div className="aspect-video rounded-xl bg-black overflow-hidden border border-[#2B2338] relative flex items-center justify-center">
                    <img
                      src={url}
                      alt="Preview"
                      style={{
                        opacity: opacity / 100,
                        filter: `brightness(${brightness / 100}) contrast(${contrast / 100}) blur(${blur}px)`,
                      }}
                      className="w-full h-full object-cover transition-all duration-150"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2B2338]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#231B34] text-gray-300 text-xs font-bold cursor-pointer"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5BE48] text-black text-xs font-bold shadow-md hover:brightness-110 disabled:opacity-50 cursor-pointer"
                >
                  {isUploading ? (lang === 'ar' ? 'جارٍ الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ الصورة في المكتبة' : 'Save Media')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. IMAGE INSPECTOR & FILTER TUNER MODAL FOR EXISTING IMAGES */}
      {/* ------------------------------------------------------------- */}
      {editingMedia && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl bg-[#161222] border border-[#3A2D52] shadow-2xl p-6 sm:p-8 space-y-5 text-start">
            <div className="flex items-center justify-between border-b border-[#2B2338] pb-3">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-[#D4AF37]" />
                  <span>{lang === 'ar' ? 'تعديل سطوع وشفافية الصورة' : 'Adjust Image Brightness & Opacity'}</span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">{editingMedia.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingMedia(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Filtered Preview */}
            <div className="aspect-video rounded-2xl bg-black overflow-hidden border border-[#2B2338] relative">
              <img
                src={editingMedia.url}
                alt={editingMedia.title}
                style={{
                  opacity: (editingMedia.opacity ?? 100) / 100,
                  filter: `brightness(${(editingMedia.brightness ?? 100) / 100}) contrast(${(editingMedia.contrast ?? 100) / 100}) blur(${editingMedia.blur ?? 0}px)`,
                }}
                className="w-full h-full object-cover transition-all duration-150"
              />
            </div>

            {/* Sliders */}
            <div className="space-y-4">
              {/* Brightness */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-gray-300 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>{lang === 'ar' ? 'مستوى السطوع (Brightness)' : 'Brightness'}</span>
                  </span>
                  <span className="text-[#D4AF37] font-mono">{editingMedia.brightness ?? 100}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="200"
                  value={editingMedia.brightness ?? 100}
                  onChange={(e) =>
                    setEditingMedia({ ...editingMedia, brightness: Number(e.target.value) })
                  }
                  className="w-full accent-[#D4AF37] cursor-pointer"
                />
              </div>

              {/* Opacity */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-gray-300 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-purple-400" />
                    <span>{lang === 'ar' ? 'درجة الشفافية (Opacity)' : 'Opacity'}</span>
                  </span>
                  <span className="text-[#D4AF37] font-mono">{editingMedia.opacity ?? 100}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={editingMedia.opacity ?? 100}
                  onChange={(e) =>
                    setEditingMedia({ ...editingMedia, opacity: Number(e.target.value) })
                  }
                  className="w-full accent-[#D4AF37] cursor-pointer"
                />
              </div>

              {/* Contrast */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-gray-300 font-semibold">
                  <span>{lang === 'ar' ? 'التباين (Contrast)' : 'Contrast'}</span>
                  <span className="text-[#D4AF37] font-mono">{editingMedia.contrast ?? 100}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="160"
                  value={editingMedia.contrast ?? 100}
                  onChange={(e) =>
                    setEditingMedia({ ...editingMedia, contrast: Number(e.target.value) })
                  }
                  className="w-full accent-[#D4AF37] cursor-pointer"
                />
              </div>
            </div>

            {/* Quick Actions to apply to Hero / Story */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  handleSetHeroImage(editingMedia);
                  setEditingMedia(null);
                }}
                className="py-2 px-3 rounded-xl bg-[#221834] hover:bg-[#342452] text-xs font-bold text-purple-300 border border-purple-500/30 transition text-center cursor-pointer"
              >
                {lang === 'ar' ? 'تطبيق مباشرة كخلفية Hero' : 'Apply as Hero Background'}
              </button>
              <button
                type="button"
                onClick={() => {
                  handleSetStoryImage(editingMedia);
                  setEditingMedia(null);
                }}
                className="py-2 px-3 rounded-xl bg-[#221834] hover:bg-[#342452] text-xs font-bold text-purple-300 border border-purple-500/30 transition text-center cursor-pointer"
              >
                {lang === 'ar' ? 'تطبيق مباشرة كصورة Story' : 'Apply as Story Image'}
              </button>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2B2338]">
              <button
                type="button"
                onClick={() => setEditingMedia(null)}
                className="px-5 py-2 rounded-xl bg-[#231B34] text-white text-xs font-bold cursor-pointer"
              >
                {lang === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

