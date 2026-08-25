import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminOverview } from './AdminOverview';
import { AdminLeads } from './AdminLeads';
import { AdminCMSContent } from './AdminCMSContent';
import { AdminMediaLibrary } from './AdminMediaLibrary';
import { AdminBrandLogo } from './AdminBrandLogo';
import { AdminThemeEditor } from './AdminThemeEditor';
import { AdminSectionControls } from './AdminSectionControls';
import { AdminSEO } from './AdminSEO';
import { AdminDatabaseSync } from './AdminDatabaseSync';
import {
  LayoutDashboard,
  Users,
  FileText,
  Image as ImageIcon,
  Crown,
  Palette,
  Layers,
  Globe,
  Database,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Languages,
} from 'lucide-react';
import { LeadStatus } from '../../types';

interface AdminLayoutProps {
  onClose: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onClose }) => {
  const { lang, setLang, logoutAdmin, leads } = useApp();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [leadsInitialStatus, setLeadsInitialStatus] = useState<LeadStatus | undefined>(undefined);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const newLeadsCount = leads.filter((l) => l.status === 'new').length;

  const navItems = [
    { id: 'overview', labelAr: 'لوحة المؤشرات', labelEn: 'Dashboard Overview', icon: LayoutDashboard },
    {
      id: 'leads',
      labelAr: 'طلبات المستثمرين',
      labelEn: 'Investor Leads',
      icon: Users,
      badge: newLeadsCount > 0 ? newLeadsCount : null,
    },
    { id: 'cms', labelAr: 'محتوى الموقع (CMS)', labelEn: 'CMS Content', icon: FileText },
    { id: 'media', labelAr: 'مكتبة الصور والوسائط', labelEn: 'Media Library', icon: ImageIcon },
    { id: 'brand', labelAr: 'الشعار والعلامة', labelEn: 'Brand & Logo', icon: Crown },
    { id: 'theme', labelAr: 'الثيم والألوان', labelEn: 'Theme & Colors', icon: Palette },
    { id: 'sections', labelAr: 'الأقسام والترتيب', labelEn: 'Section Controls', icon: Layers },
    { id: 'seo', labelAr: 'محركات البحث (SEO)', labelEn: 'SEO & Pixels', icon: Globe },
    { id: 'database', labelAr: 'قاعدة البيانات والمزامنة', labelEn: 'Database & Sync', icon: Database },
  ];

  const handleNavigateToLeads = (statusFilter?: LeadStatus) => {
    setLeadsInitialStatus(statusFilter);
    setActiveTab('leads');
  };

  const handleNavigateToCMS = () => {
    setActiveTab('cms');
  };

  return (
    <div
      id="admin-dashboard-container"
      className="fixed inset-0 z-[100] bg-[#0A080F] text-white flex flex-col md:flex-row overflow-hidden font-['Tajawal']"
    >
      {/* Top Mobile Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#120E1C] border-b border-[#231B2F]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#4A154B] to-[#D4AF37] p-0.5">
            <div className="w-full h-full bg-[#0D0B12] rounded-[10px] flex items-center justify-center">
              <Crown className="w-4 h-4 text-[#D4AF37]" />
            </div>
          </div>
          <span className="font-black text-sm text-white font-['Outfit']">AL PACINO ADMIN</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="p-2 rounded-lg bg-[#1C1629] text-xs font-bold text-[#D4AF37]"
          >
            {lang === 'ar' ? 'EN' : 'عربي'}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-[#1C1629] text-gray-300"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside
        className={`w-full md:w-72 bg-[#120E1C] border-e border-[#231B2F] flex flex-col justify-between shrink-0 z-20 ${
          isMobileMenuOpen ? 'block' : 'hidden md:flex'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-[#231B2F] hidden md:block">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#4A154B] via-[#7E22CE] to-[#D4AF37] p-0.5 shadow-lg shadow-purple-950/40">
              <div className="w-full h-full bg-[#0D0B12] rounded-[14px] flex items-center justify-center">
                <Crown className="w-5 h-5 text-[#D4AF37]" />
              </div>
            </div>
            <div>
              <h1 className="font-extrabold text-base text-white font-['Outfit']">AL PACINO</h1>
              <div className="text-[11px] text-[#D4AF37] font-semibold">
                {lang === 'ar' ? 'لوحة الإدارة المركزية' : 'Executive Command Center'}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="p-4 space-y-1 overflow-y-auto flex-1 text-start">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center justify-between group cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#3B113D] to-[#240C29] text-[#D4AF37] border border-[#D4AF37]/40 shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-[#1A1426]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : 'text-gray-400 group-hover:text-purple-400'}`} />
                  <span>{lang === 'ar' ? item.labelAr : item.labelEn}</span>
                </div>

                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#D4AF37] text-black">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Actions Bar */}
        <div className="p-4 border-t border-[#231B2F] space-y-2">
          {/* Language Switch */}
          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="w-full px-4 py-2.5 rounded-xl bg-[#1C1629] hover:bg-[#251D36] text-xs font-bold text-gray-300 flex items-center justify-center gap-2 transition"
          >
            <Languages className="w-4 h-4 text-[#D4AF37]" />
            <span>{lang === 'ar' ? 'Switch to English' : 'التحويل للعربية'}</span>
          </button>

          {/* View Website */}
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 rounded-xl bg-[#271F36] hover:bg-[#342A48] text-xs font-bold text-[#D4AF37] flex items-center justify-center gap-2 transition"
          >
            <ExternalLink className="w-4 h-4" />
            <span>{lang === 'ar' ? 'معاينة الموقع الحي' : 'View Public Site'}</span>
          </button>

          {/* Logout */}
          <button
            onClick={() => {
              logoutAdmin();
              onClose();
            }}
            className="w-full px-4 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-950/40 flex items-center justify-center gap-2 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>{lang === 'ar' ? 'تسجيل الخروج' : 'Log Out'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10 bg-[#0A080F]">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'overview' && (
            <AdminOverview
              onNavigateToLeads={handleNavigateToLeads}
              onNavigateToCMS={handleNavigateToCMS}
            />
          )}
          {activeTab === 'leads' && <AdminLeads initialStatusFilter={leadsInitialStatus} />}
          {activeTab === 'cms' && <AdminCMSContent />}
          {activeTab === 'media' && <AdminMediaLibrary />}
          {activeTab === 'brand' && <AdminBrandLogo />}
          {activeTab === 'theme' && <AdminThemeEditor />}
          {activeTab === 'sections' && <AdminSectionControls />}
          {activeTab === 'seo' && <AdminSEO />}
          {activeTab === 'database' && <AdminDatabaseSync />}
        </div>
      </main>
    </div>
  );
};
