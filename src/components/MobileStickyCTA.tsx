import React from 'react';
import { useApp } from '../context/AppContext';
import { MessageCircle, ArrowUpRight } from 'lucide-react';
import { scrollToSection } from '../utils/scrollHelper';

export const MobileStickyCTA: React.FC = () => {
  const { lang, content } = useApp();

  return (
    <div
      id="mobile-sticky-cta"
      className="sm:hidden fixed bottom-0 inset-x-0 z-40 p-3 bg-[#0D0B12]/95 backdrop-blur-xl border-t border-[#2B2338] shadow-2xl flex items-center gap-2.5"
    >
      {/* WhatsApp Button */}
      {content.contact.whatsapp && (
        <a
          href={`https://wa.me/${content.contact.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
            lang === 'ar' ? 'مرحباً، أود الاستفسار عن فرصة الشراكة والاستثمار في الباتشينو بروستد.' : 'Hello, I want to inquire about the AL PACINO JV investment.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-xl bg-green-950/80 border border-green-500/50 text-green-400 flex items-center justify-center shrink-0 shadow-sm"
          aria-label="WhatsApp Chat"
        >
          <MessageCircle className="w-5 h-5" />
        </a>
      )}

      {/* Primary Action Button */}
      <a
        href="#investor-form"
        onClick={(e) => scrollToSection('investor-form', e)}
        className="flex-1 py-3 px-4 rounded-xl font-black text-sm text-black bg-gradient-to-r from-[#D4AF37] via-[#E5BE48] to-[#D4AF37] hover:brightness-110 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 text-center cursor-pointer"
      >
        <span>{lang === 'ar' ? 'سجل اهتمامك كشريك JV' : 'Apply as JV Partner'}</span>
        <ArrowUpRight className="w-4 h-4" />
      </a>
    </div>
  );
};
