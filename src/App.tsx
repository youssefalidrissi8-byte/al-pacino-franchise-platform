import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { OpportunitySection } from './components/OpportunitySection';
import { StorySection } from './components/StorySection';
import { WhyAlPacinoSection } from './components/WhyAlPacinoSection';
import { InvestmentGlanceSection } from './components/InvestmentGlanceSection';
import { JVModelSection } from './components/JVModelSection';
import { JVSupportSection } from './components/JVSupportSection';
import { JVJourneySection } from './components/JVJourneySection';
import { CityExpansionSection } from './components/CityExpansionSection';
import { InvestorLeadForm } from './components/InvestorLeadForm';
import { FinalCTASection } from './components/FinalCTASection';
import { Footer } from './components/Footer';
import { MobileStickyCTA } from './components/MobileStickyCTA';
import { ToastContainer } from './components/ToastContainer';
import { AdminAuthModal } from './components/AdminAuthModal';
import { AdminLayout } from './components/Admin/AdminLayout';

const MainLanding: React.FC = () => {
  const { sections, isAdmin } = useApp();
  const [selectedCity, setSelectedCity] = useState<string>('الرياض');
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  // Keyboard shortcut to open admin (Alt + A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey || e.metaKey) && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        if (isAdmin) {
          setIsAdminDashboardOpen(true);
        } else {
          setIsAdminAuthOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdmin]);

  // Map of component renderers by section id (supporting camelCase, kebab-case, and aliases)
  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'hero':
        return <HeroSection key="hero" />;
      case 'opportunity':
        return <OpportunitySection key="opportunity" />;
      case 'story':
        return <StorySection key="story" />;
      case 'why-us':
      case 'whyAlPacino':
      case 'why':
        return <WhyAlPacinoSection key="why-us" />;
      case 'financials':
      case 'investmentGlance':
      case 'financial':
        return <InvestmentGlanceSection key="financials" />;
      case 'jv-model':
      case 'jvModel':
        return <JVModelSection key="jv-model" />;
      case 'jv-support':
      case 'jvSupport':
      case 'support':
        return <JVSupportSection key="jv-support" />;
      case 'jv-journey':
      case 'jvJourney':
      case 'journey':
        return <JVJourneySection key="jv-journey" />;
      case 'expansion':
      case 'cityExpansion':
      case 'cities':
        return (
          <CityExpansionSection
            key="expansion"
            onSelectCity={(city) => setSelectedCity(city)}
          />
        );
      case 'investor-form':
      case 'investorForm':
      case 'form':
      case 'lead-form':
      case 'contact':
        return <InvestorLeadForm key="investor-form" prefilledCity={selectedCity} />;
      case 'final-cta':
      case 'finalCta':
      case 'cta':
        return <FinalCTASection key="final-cta" />;
      default:
        return null;
    }
  };

  const sectionsList = sections || [];

  return (
    <div className="min-h-screen bg-[#0D0B12] text-[#FAF8F5] font-['Tajawal'] selection:bg-[#D4AF37] selection:text-black">
      {/* Navigation Bar */}
      <Navbar
        onOpenAdminAuth={() => setIsAdminAuthOpen(true)}
        onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
      />

      {/* Main Content Sections */}
      <main>
        {sectionsList.length > 0
          ? sectionsList
              .filter((s) => s.visible)
              .map((s) => renderSection(s.id))
          : [
              <HeroSection key="hero" />,
              <OpportunitySection key="opportunity" />,
              <StorySection key="story" />,
              <WhyAlPacinoSection key="why-us" />,
              <InvestmentGlanceSection key="financials" />,
              <JVModelSection key="jv-model" />,
              <JVSupportSection key="jv-support" />,
              <JVJourneySection key="jv-journey" />,
              <CityExpansionSection
                key="expansion"
                onSelectCity={(city) => setSelectedCity(city)}
              />,
              <InvestorLeadForm key="investor-form" prefilledCity={selectedCity} />,
              <FinalCTASection key="final-cta" />,
            ]}
      </main>

      {/* Footer */}
      <Footer
        onOpenAdminAuth={() => setIsAdminAuthOpen(true)}
        onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
      />

      {/* Mobile Sticky CTA */}
      <MobileStickyCTA />

      {/* Toast Notifications */}
      <ToastContainer />

      {/* Admin Auth Modal */}
      <AdminAuthModal
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
        onSuccess={() => setIsAdminDashboardOpen(true)}
      />

      {/* Full Admin Dashboard Suite */}
      {isAdminDashboardOpen && (
        <AdminLayout onClose={() => setIsAdminDashboardOpen(false)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLanding />
    </AppProvider>
  );
}
