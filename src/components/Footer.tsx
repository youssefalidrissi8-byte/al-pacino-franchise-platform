import React from 'react';
import { useApp } from '../context/AppContext';
import { Crown, Shield, Mail, Phone, MapPin, MessageCircle, Instagram, Twitter, Linkedin } from 'lucide-react';
import { scrollToSection } from '../utils/scrollHelper';

interface FooterProps {
  onOpenAdminAuth: () => void;
  onOpenAdminDashboard: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdminAuth, onOpenAdminDashboard }) => {
  const { lang, content, theme, isAdmin } = useApp();

  return (
    <footer className="bg-[#0A0A0A] border-t border-[#2B2338] text-gray-400 py-12 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-[#2B2338]">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-3.5">
            <div className="flex items-center gap-2.5">
              {theme.logoSettings?.lightLogoUrl || theme.logoSettings?.darkLogoUrl ? (
                <img
                  src={theme.logoSettings.lightLogoUrl || theme.logoSettings.darkLogoUrl}
                  alt="AL PACINO BROASTED"
                  referrerPolicy="no-referrer"
                  className="object-contain h-10 max-w-[200px]"
                  style={{
                    filter: `brightness(${(theme.logoSettings.brightness ?? 100) / 100}) contrast(${(theme.logoSettings.contrast ?? 100) / 100})`,
                    opacity: (theme.logoSettings.opacity ?? 100) / 100,
                  }}
                />
              ) : (
                <>
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#4B0082] to-[#C19B4A] p-0.5 flex items-center justify-center">
                    <div className="w-full h-full bg-[#1A1128] rounded-[10px] flex items-center justify-center">
                      <Crown className="w-4 h-4 text-[#C19B4A]" />
                    </div>
                  </div>
                  <div className="font-extrabold text-base sm:text-lg text-white font-['Outfit']">
                    AL PACINO <span className="text-[#C19B4A] font-medium text-xs">BROASTED</span>
                  </div>
                </>
              )}
            </div>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-sm">
              {lang === 'ar'
                ? 'علامة سعودية رائدة متخصصة في البروستد الفاخر بنكهات ملكية ونظام تشغيلي ذكي قابل للتوسع بنموذج JV.'
                : 'A premier Saudi culinary brand revolutionizing the gourmet broasted segment through standardized scalable JV expansion.'}
            </p>
            <div className="text-xs text-[#C19B4A] font-semibold">
              {lang === 'ar' ? '« بروستد بطعم الأوسكار »' : '« Broasted with Oscar Taste »'}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-3 text-xs sm:text-sm">
              {lang === 'ar' ? 'روابط سريعة' : 'Quick Navigation'}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a
                  href="#opportunity"
                  onClick={(e) => scrollToSection('opportunity', e)}
                  className="hover:text-[#C19B4A] transition cursor-pointer"
                >
                  {lang === 'ar' ? 'فرصة الاستثمار' : 'Opportunity'}
                </a>
              </li>
              <li>
                <a
                  href="#story"
                  onClick={(e) => scrollToSection('story', e)}
                  className="hover:text-[#C19B4A] transition cursor-pointer"
                >
                  {lang === 'ar' ? 'قصة النجاح' : 'Our Story'}
                </a>
              </li>
              <li>
                <a
                  href="#why-us"
                  onClick={(e) => scrollToSection('why-us', e)}
                  className="hover:text-[#C19B4A] transition cursor-pointer"
                >
                  {lang === 'ar' ? 'لماذا الباتشينو؟' : 'Why AL PACINO'}
                </a>
              </li>
              <li>
                <a
                  href="#financials"
                  onClick={(e) => scrollToSection('financials', e)}
                  className="hover:text-[#C19B4A] transition cursor-pointer"
                >
                  {lang === 'ar' ? 'الأرقام التقديرية' : 'Financials'}
                </a>
              </li>
              <li>
                <a
                  href="#jv-model"
                  onClick={(e) => scrollToSection('jv-model', e)}
                  className="hover:text-[#C19B4A] transition cursor-pointer"
                >
                  {lang === 'ar' ? 'نموذج الشراكة JV' : 'JV Model'}
                </a>
              </li>
              <li>
                <a
                  href="#investor-form"
                  onClick={(e) => scrollToSection('investor-form', e)}
                  className="text-[#C19B4A] font-bold hover:underline transition cursor-pointer"
                >
                  {lang === 'ar' ? 'طلب الشراكة (كن شريكاً)' : 'Apply as Partner'}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-bold mb-3 text-xs sm:text-sm">
              {lang === 'ar' ? 'التواصل والاستثمار' : 'Contact & Investment'}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {content.contact.email && (
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#C19B4A] shrink-0" />
                  <a href={`mailto:${content.contact.email}`} className="hover:text-white transition">
                    {content.contact.email}
                  </a>
                </li>
              )}
              {content.contact.whatsapp && (
                <li className="flex items-center gap-2">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <a
                    href={`https://wa.me/${content.contact.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition"
                    dir="ltr"
                  >
                    {content.contact.whatsapp}
                  </a>
                </li>
              )}
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C19B4A] shrink-0" />
                <span>{lang === 'ar' ? content.contact.addressAr : content.contact.addressEn}</span>
              </li>
            </ul>
          </div>

          {/* Admin & Social */}
          <div>
            <h4 className="text-white font-bold mb-3 text-xs sm:text-sm">
              {lang === 'ar' ? 'بوابة الإدارة' : 'Administration'}
            </h4>
            <p className="text-xs text-gray-500 mb-3">
              {lang === 'ar' ? 'منطقة مخصصة لإدارة المحتوى والطلبات.' : 'Restricted portal for content and leads.'}
            </p>
            <button
              onClick={isAdmin ? onOpenAdminDashboard : onOpenAdminAuth}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A1128] hover:bg-[#251A38] border border-[#2B2338] text-xs font-semibold text-gray-200 transition"
            >
              <Shield className="w-3.5 h-3.5 text-[#C19B4A]" />
              <span>{isAdmin ? (lang === 'ar' ? 'فتح لوحة الإدارة' : 'Open Admin Panel') : (lang === 'ar' ? 'تسجيل دخول الإدارة' : 'Admin Login')}</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-300 text-center sm:text-start">
          <div>
            © {new Date().getFullYear()} AL PACINO BROASTED. {lang === 'ar' ? 'جميع الحقوق محفوظة. المملكة العربية السعودية.' : 'All Rights Reserved. Kingdom of Saudi Arabia.'}
          </div>
          <div className="text-[11px] text-gray-400 max-w-md">
            {lang === 'ar'
              ? 'تخضع جميع عروض الشراكة لدراسة الجدوى والاتفاقية المعتمدة ونموذج حق الانتفاع الرسمي.'
              : 'All JV proposals are subject to signed usufruct agreements and technical feasibility audits.'}
          </div>
        </div>
      </div>
    </footer>
  );
};
