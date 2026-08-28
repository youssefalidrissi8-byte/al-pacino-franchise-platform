import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Globe,
  Menu,
  X,
  Shield,
  ArrowUpRight,
  MessageCircle,
} from 'lucide-react';
import { LogoSettings } from '../types';
import { scrollToSection } from '../utils/scrollHelper';

interface NavbarProps {
  onOpenAdminAuth: () => void;
  onOpenAdminDashboard: () => void;
}

const defaultLogoSettings: LogoSettings = {
  lightLogoUrl: '',
  darkLogoUrl: '',
  widthDesktop: 190,
  heightDesktop: 52,
  widthMobile: 150,
  position: 'right',
  marginTop: 0,
  marginBottom: 0,
  opacity: 100,
  showTextBrand: true,
};

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAdminAuth,
  onOpenAdminDashboard,
}) => {
  const { lang, setLang, content, theme, isAdmin } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    {
      labelAr: 'فرصة الاستثمار',
      labelEn: 'Opportunity',
      href: '#opportunity',
    },
    {
      labelAr: 'قصتنا',
      labelEn: 'Our Story',
      href: '#story',
    },
    {
      labelAr: 'لماذا الباتشينو؟',
      labelEn: 'Why AL PACINO',
      href: '#why-us',
    },
    {
      labelAr: 'أرقام الاستثمار',
      labelEn: 'Financials',
      href: '#financials',
    },
    {
      labelAr: 'نموذج JV',
      labelEn: 'JV Model',
      href: '#jv-model',
    },
    {
      labelAr: 'المدن المستهدفة',
      labelEn: 'Expansion',
      href: '#expansion',
    },
  ];

  const logoSettings: LogoSettings =
    theme.logoSettings || defaultLogoSettings;

  const isLightBackground =
    theme.backgroundColor.toLowerCase() === '#ffffff' ||
    theme.backgroundColor.toLowerCase() === '#faf8f5';

  const currentLogoUrl = isLightBackground
    ? logoSettings.darkLogoUrl || logoSettings.lightLogoUrl
    : logoSettings.lightLogoUrl || logoSettings.darkLogoUrl;

  const logoAlignmentClass =
    logoSettings.position === 'center'
      ? 'justify-center'
      : logoSettings.position === 'left'
      ? lang === 'ar'
        ? 'justify-end'
        : 'justify-start'
      : lang === 'ar'
      ? 'justify-start'
      : 'justify-end';

  const whatsappNumber = content.contact.whatsapp
    ? content.contact.whatsapp.replace(/[^0-9]/g, '')
    : '';

  const whatsappMessage =
    lang === 'ar'
      ? 'مرحباً، أود الاستفسار عن فرصة الشراكة والاستثمار في الباتشينو بروستد.'
      : 'Hello, I would like to inquire about the AL PACINO BROASTED JV investment opportunity.';

  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        whatsappMessage
      )}`
    : '';

  const handleMobileNavClick = (
    href: string,
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    setMobileMenuOpen(false);
    scrollToSection(href, e);
  };

  return (
    <header
      id="main-navbar"
      className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#1A1128]/95 border-b border-[#C19B4A]/30 shadow-2xl transition-all"
    >
      <div
        className="
          max-w-7xl mx-auto
          px-4 sm:px-6 lg:px-8
          h-[72px] sm:h-20
          max-h-20
          flex items-center justify-between
          gap-3 sm:gap-4
          overflow-visible
          relative
        "
      >
        {/* =========================
            BRAND LOGO
        ========================== */}
        <div
          className={`
            h-full
            flex items-center
            gap-4
            ${logoAlignmentClass}
            overflow-visible
            relative
            flex-shrink-0
            min-w-0
          `}
        >
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({
                top: 0,
                behavior: 'smooth',
              });
              setMobileMenuOpen(false);
            }}
            className="
              relative
              z-20
              flex items-center
              gap-3
              group
              focus:outline-none
              overflow-visible
              max-w-full
            "
            style={{
              marginTop: `${logoSettings.marginTop || 0}px`,
              marginBottom: `${logoSettings.marginBottom || 0}px`,
              transform: `translateY(${
                logoSettings.offsetY || 0
              }px) scale(${(logoSettings.scale ?? 100) / 100})`,
              transformOrigin:
                lang === 'ar' ? 'right center' : 'left center',
              opacity: (logoSettings.opacity ?? 100) / 100,
            }}
          >
            {currentLogoUrl ? (
              <div className="relative flex items-center justify-center overflow-visible">
                <img
                  src={currentLogoUrl}
                  alt="AL PACINO BROASTED"
                  referrerPolicy="no-referrer"
                  className="
                    object-contain
                    transition-all
                    duration-200
                    group-hover:scale-105
                    pointer-events-auto
                    w-[150px]
                    sm:w-[190px]
                  "
                  style={{
                    maxHeight: `${logoSettings.heightDesktop || 60}px`,
                    filter: `brightness(${
                      (logoSettings.brightness ?? 100) / 100
                    }) contrast(${
                      (logoSettings.contrast ?? 100) / 100
                    })`,
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="bg-[#4B0082] p-2 rounded-lg border border-[#C19B4A]/40 shadow-md">
                  <span className="text-lg sm:text-xl font-black tracking-tighter text-[#C19B4A] font-['Outfit']">
                    AL PACINO
                  </span>
                </div>

                <div className="h-6 w-[1px] bg-white/10 mx-1 hidden sm:block" />

                {logoSettings.showTextBrand !== false && (
                  <p className="text-xs sm:text-sm italic text-[#C19B4A]/80 font-medium hidden md:block">
                    {lang === 'ar'
                      ? 'بروستد بطعم الأوسكار'
                      : 'Oscar-Grade Broasted'}
                  </p>
                )}
              </div>
            )}
          </a>
        </div>

        {/* =========================
            DESKTOP NAVIGATION
        ========================== */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => scrollToSection(link.href, e)}
              className="
                px-3 py-1.5
                text-sm font-medium
                text-gray-200
                hover:text-[#C19B4A]
                hover:bg-white/5
                rounded-lg
                transition-colors
                cursor-pointer
                whitespace-nowrap
              "
            >
              {lang === 'ar' ? link.labelAr : link.labelEn}
            </a>
          ))}
        </nav>

        {/* =========================
            DESKTOP ACTIONS
        ========================== */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* WhatsApp */}
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                p-2
                rounded-lg
                bg-white/5
                hover:bg-white/10
                text-green-400
                border border-green-500/30
                hover:border-green-500/60
                transition
                shadow-sm
              "
              title={
                lang === 'ar'
                  ? 'تواصل عبر واتساب'
                  : 'Chat on WhatsApp'
              }
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          )}

          {/* Language Switch */}
          <button
            type="button"
            onClick={() =>
              setLang(lang === 'ar' ? 'en' : 'ar')
            }
            className="
              flex items-center gap-1.5
              px-3 py-1.5
              text-xs font-semibold
              rounded-lg
              bg-white/5
              hover:bg-white/10
              text-gray-200
              border border-white/10
              transition
              cursor-pointer
              hover:text-[#C19B4A]
            "
          >
            <Globe className="w-3.5 h-3.5 text-[#C19B4A]" />

            <span>
              {lang === 'ar' ? 'English' : 'العربية'}
            </span>
          </button>

          {/* Admin */}
          <button
            type="button"
            onClick={
              isAdmin
                ? onOpenAdminDashboard
                : onOpenAdminAuth
            }
            className={`
              flex items-center gap-1.5
              px-3 py-1.5
              text-xs font-medium
              rounded-lg
              border
              transition
              cursor-pointer
              ${
                isAdmin
                  ? 'bg-[#4B0082]/70 border-[#C19B4A]/50 text-[#C19B4A] hover:bg-[#4B0082]'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
              }
            `}
            title={
              isAdmin
                ? lang === 'ar'
                  ? 'لوحة التحكم الإدارية'
                  : 'Admin Dashboard'
                : lang === 'ar'
                ? 'دخول الإدارة'
                : 'Admin Login'
            }
          >
            <Shield
              className={`w-3.5 h-3.5 ${
                isAdmin
                  ? 'text-[#C19B4A]'
                  : 'text-gray-400'
              }`}
            />

            <span className="hidden md:inline">
              {isAdmin
                ? lang === 'ar'
                  ? 'لوحة الإدارة'
                  : 'Dashboard'
                : lang === 'ar'
                ? 'الإدارة'
                : 'Admin'}
            </span>
          </button>

          {/* Primary CTA */}
          <a
            href="#investor-form"
            onClick={(e) =>
              scrollToSection('investor-form', e)
            }
            className="
              flex items-center gap-1.5
              px-5 py-2
              rounded-md
              font-bold
              text-sm
              text-black
              bg-[#C19B4A]
              hover:bg-[#D4AF37]
              shadow-lg
              shadow-[#C19B4A]/10
              transition-all
              transform
              hover:-translate-y-0.5
              active:translate-y-0
              cursor-pointer
            "
          >
            <span>
              {lang === 'ar'
                ? content.hero.ctaPrimaryAr
                : content.hero.ctaPrimaryEn}
            </span>

            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* =========================
            MOBILE CONTROLS
        ========================== */}
        <div
          className="
            flex
            sm:hidden
            items-center
            gap-2
            relative
            z-[100]
            flex-shrink-0
          "
        >
          {/* Mobile Language */}
          <button
            type="button"
            onClick={() =>
              setLang(lang === 'ar' ? 'en' : 'ar')
            }
            className="
              relative
              z-[100]
              p-2
              rounded-lg
              bg-[#181424]
              text-xs
              font-bold
              text-gray-200
              border border-[#2B2338]
              cursor-pointer
              active:scale-95
            "
          >
            {lang === 'ar' ? 'EN' : 'عربي'}
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen((prev) => !prev)
            }
            className="
              relative
              z-[100]
              p-2.5
              rounded-xl
              bg-[#181424]
              text-white
              border border-[#2B2338]
              cursor-pointer
              active:scale-95
              transition-transform
              touch-manipulation
            "
            aria-label={
              mobileMenuOpen
                ? 'Close menu'
                : 'Open menu'
            }
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* =========================
          MOBILE DRAWER
      ========================== */}
      {mobileMenuOpen && (
        <div
          className="
            sm:hidden
            relative
            z-[90]
            bg-[#120F1C]
            border-b
            border-[#2B2338]
            px-4
            pt-3
            pb-6
            flex
            flex-col
            gap-3
            shadow-2xl
          "
        >
          {/* Mobile Navigation Links */}
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) =>
                handleMobileNavClick(link.href, e)
              }
              className="
                px-4
                py-2.5
                text-base
                font-medium
                text-gray-200
                hover:bg-[#1E1829]
                rounded-lg
                transition
                cursor-pointer
              "
            >
              {lang === 'ar'
                ? link.labelAr
                : link.labelEn}
            </a>
          ))}

          {/* Bottom Actions */}
          <div className="pt-2 border-t border-[#2B2338] flex flex-col gap-2.5">
            {/* CTA */}
            <a
              href="#investor-form"
              onClick={(e) => {
                setMobileMenuOpen(false);
                scrollToSection(
                  'investor-form',
                  e
                );
              }}
              className="
                w-full
                text-center
                py-3
                rounded-xl
                font-bold
                text-black
                bg-gradient-to-r
                from-[#D4AF37]
                to-[#E5BE48]
                shadow-md
                shadow-amber-500/20
                cursor-pointer
              "
            >
              {lang === 'ar'
                ? content.hero.ctaPrimaryAr
                : content.hero.ctaPrimaryEn}
            </a>

            {/* Admin + WhatsApp */}
            <div className="flex items-center gap-2">
              {/* Admin */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);

                  if (isAdmin) {
                    onOpenAdminDashboard();
                  } else {
                    onOpenAdminAuth();
                  }
                }}
                className="
                  flex-1
                  py-2.5
                  rounded-xl
                  bg-[#1E1829]
                  text-gray-300
                  text-sm
                  font-medium
                  border border-[#2B2338]
                  flex
                  items-center
                  justify-center
                  gap-2
                  cursor-pointer
                "
              >
                <Shield className="w-4 h-4 text-[#D4AF37]" />

                <span>
                  {isAdmin
                    ? lang === 'ar'
                      ? 'لوحة الإدارة'
                      : 'Admin Panel'
                    : lang === 'ar'
                    ? 'دخول الإدارة'
                    : 'Admin Login'}
                </span>
              </button>

              {/* WhatsApp */}
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    px-4
                    py-2.5
                    rounded-xl
                    bg-green-950/60
                    border border-green-500/40
                    text-green-400
                    flex
                    items-center
                    justify-center
                  "
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};