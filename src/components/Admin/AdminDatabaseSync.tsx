import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Database, Download, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const AdminDatabaseSync: React.FC = () => {
  const { lang, resetDefaultsRemote, showToast, leads, content, theme, sections, seo, media } = useApp();
  const [isResetting, setIsResetting] = useState(false);

  const handleExportFullBackup = () => {
    const fullBackup = {
      exportedAt: new Date().toISOString(),
      brand: 'AL PACINO BROASTED',
      theme,
      sections,
      seo,
      content,
      media,
      leads,
    };

    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alpacino_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(lang === 'ar' ? 'تم تنزيل النسخة الاحتياطية بنجاح' : 'Backup downloaded', 'success');
  };

  const handleResetAll = async () => {
    if (
      window.confirm(
        lang === 'ar'
          ? 'تحذير: هل أنت متأكد من رغبتك في إعادة ضبط جميع الإعدادات والمحتوى إلى الحالة الافتراضية؟'
          : 'Warning: Are you sure you want to reset all content, theme, and settings to defaults?'
      )
    ) {
      setIsResetting(true);
      await resetDefaultsRemote();
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-white">
          {lang === 'ar' ? 'حالة قاعدة البيانات والنسخ الاحتياطي' : 'Database & Cloud Persistence'}
        </h2>
        <p className="text-sm text-gray-400">
          {lang === 'ar'
            ? 'مراقبة حالة التخزين، تصدير النسخ الاحتياطية، وإدارة تكامل البيانات.'
            : 'Monitor storage engines, export full system snapshots, and manage data.'}
        </p>
      </div>

      {/* Storage Engine Status Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#161222] border border-[#2B2338] space-y-6 text-start">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3B113D] to-[#1F0821] border border-purple-500/40 flex items-center justify-center text-[#D4AF37]">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {lang === 'ar' ? 'محرك التخزين الحالي (Active Storage Engine)' : 'Active Storage Engine'}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-400 font-bold">
                  {lang === 'ar' ? 'جاهز ومتصل (Production Ready)' : 'Active & Connected'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#0D0B12] border border-[#241E30]">
            <div className="text-xs text-gray-400 mb-1">{lang === 'ar' ? 'سجلات المستثمرين' : 'Leads Records'}</div>
            <div className="text-2xl font-black text-white">{leads.length}</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0D0B12] border border-[#241E30]">
            <div className="text-xs text-gray-400 mb-1">{lang === 'ar' ? 'الوسائط والصور' : 'Media Assets'}</div>
            <div className="text-2xl font-black text-white">{media.length}</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0D0B12] border border-[#241E30]">
            <div className="text-xs text-gray-400 mb-1">{lang === 'ar' ? 'حالة التزامن' : 'Sync Status'}</div>
            <div className="text-base font-bold text-[#D4AF37] flex items-center gap-1.5 mt-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>{lang === 'ar' ? 'متزامن لحظياً' : 'Realtime Sync'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Backup & Factory Reset Actions */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#161222] border border-[#2B2338] space-y-6 text-start">
        <h3 className="text-lg font-bold text-white border-b border-[#2B2338] pb-3">
          {lang === 'ar' ? 'إجراءات النسخ الاحتياطي واستعادة الضبط' : 'Backup & Recovery Actions'}
        </h3>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-white text-sm">
              {lang === 'ar' ? 'تصدير نسخة احتياطية كاملة (Full JSON Snapshot)' : 'Export Full JSON Snapshot'}
            </h4>
            <p className="text-xs text-gray-400 mt-0.5">
              {lang === 'ar'
                ? 'تنزيل ملف يحتوي على كافة الطلبات، النصوص، الصور، الثيمات، وإعدادات SEO.'
                : 'Download a complete export of all leads, CMS copy, images, and theme configs.'}
            </p>
          </div>

          <button
            onClick={handleExportFullBackup}
            className="px-5 py-2.5 rounded-xl bg-[#271F36] hover:bg-[#352A4A] text-white text-xs font-bold border border-[#D4AF37]/30 flex items-center gap-2 transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#D4AF37]" />
            <span>{lang === 'ar' ? 'تنزيل النسخة الاحتياطية' : 'Download Backup'}</span>
          </button>
        </div>

        <div className="my-4 border-t border-[#241E30]" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-red-400 text-sm flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>{lang === 'ar' ? 'استعادة ضبط المصنع (Factory Defaults)' : 'Factory Defaults Reset'}</span>
            </h4>
            <p className="text-xs text-gray-400 mt-0.5">
              {lang === 'ar'
                ? 'إعادة كافة نصوص الموقع، الألوان، والشعار إلى الإعدادات الأولية الأصلية.'
                : 'Reset all landing content, theme colors, and logos to initial defaults.'}
            </p>
          </div>

          <button
            onClick={handleResetAll}
            disabled={isResetting}
            className="px-5 py-2.5 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 text-xs font-bold flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
          >
            <span>{isResetting ? (lang === 'ar' ? 'جارٍ الضبط...' : 'Resetting...') : (lang === 'ar' ? 'استعادة ضبط المصنع' : 'Reset Everything')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
