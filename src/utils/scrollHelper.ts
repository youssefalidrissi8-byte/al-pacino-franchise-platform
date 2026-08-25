import type React from 'react';

/**
 * Enhanced smooth scrolling utility that accounts for sticky navbar offset
 * and iframe quirks in React applications.
 */
export const scrollToSection = (targetIdOrHref: string, e?: React.MouseEvent | React.TouchEvent) => {
  if (e) {
    e.preventDefault();
  }

  const rawId = targetIdOrHref.replace(/^#/, '').trim();
  if (!rawId) return;

  // Resolve ID aliases
  let element = document.getElementById(rawId);
  if (!element) {
    if (['investor-form', 'investorForm', 'form', 'lead-form', 'contact', 'join'].includes(rawId)) {
      element = document.getElementById('investor-form') || document.getElementById('investorForm');
    } else if (['opportunity', 'opportunities'].includes(rawId)) {
      element = document.getElementById('opportunity');
    } else if (['story', 'our-story'].includes(rawId)) {
      element = document.getElementById('story');
    } else if (['why-us', 'whyAlPacino', 'why'].includes(rawId)) {
      element = document.getElementById('why-us');
    } else if (['financials', 'investmentGlance', 'financial'].includes(rawId)) {
      element = document.getElementById('financials');
    } else if (['jv-model', 'jvModel'].includes(rawId)) {
      element = document.getElementById('jv-model');
    } else if (['expansion', 'cityExpansion', 'cities'].includes(rawId)) {
      element = document.getElementById('expansion');
    }
  }

  if (element) {
    // Height of sticky navbar (around 80px)
    const navbar = document.getElementById('main-navbar');
    const navbarHeight = navbar ? navbar.offsetHeight : 80;

    const elementRect = element.getBoundingClientRect();
    const absoluteElementTop = elementRect.top + (window.pageYOffset || document.documentElement.scrollTop || 0);
    const targetScrollY = Math.max(0, absoluteElementTop - navbarHeight + 5);

    try {
      window.scrollTo({
        top: targetScrollY,
        behavior: 'smooth',
      });
    } catch {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Special interaction if scrolling to the investor form
    if (element.id === 'investor-form' || rawId.includes('form') || rawId.includes('investor')) {
      // Highlight the form container with a temporary golden pulse
      element.classList.add('ring-2', 'ring-[#D4AF37]', 'ring-offset-4', 'ring-offset-[#0A0A0A]', 'transition-all', 'duration-500');
      setTimeout(() => {
        element?.classList.remove('ring-2', 'ring-[#D4AF37]', 'ring-offset-4', 'ring-offset-[#0A0A0A]');
      }, 1800);

      // Focus the first input after scrolling completes
      setTimeout(() => {
        const firstInput = element?.querySelector<HTMLInputElement>('input[name="fullName"], input[type="text"], input');
        if (firstInput) {
          firstInput.focus();
        }
      }, 500);
    }
  } else {
    // Fallback: try default hash navigation
    try {
      window.location.hash = `#${rawId}`;
    } catch {
      // ignore
    }
  }
};
