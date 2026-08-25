export type Language = 'ar' | 'en';

export interface BilingualText {
  ar: string;
  en: string;
}

export interface LeadComment {
  id: string;
  author: string;
  comment: string;
  createdAt: string;
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'negotiation' | 'won' | 'lost';

export interface InvestorLead {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  targetCity: string;
  hasProposedLocation: boolean;
  budgetRange: string;
  investmentInterest: string;
  notes?: string;
  createdAt: string;
  source: string;
  status: LeadStatus;
  adminComments: LeadComment[];
}

export interface MediaItem {
  id: string;
  url: string;
  title: string;
  type: 'image' | 'logo' | 'banner';
  category: 'hero' | 'story' | 'gallery' | 'storefront' | 'brand' | 'other';
  fileSize?: string;
  uploadedAt: string;
  opacity?: number;
  brightness?: number;
  contrast?: number;
  blur?: number;
}

export interface SEOSettings {
  pageTitleAr: string;
  pageTitleEn: string;
  metaDescriptionAr: string;
  metaDescriptionEn: string;
  keywords: string;
  ogImage: string;
  favicon: string;
  canonicalUrl: string;
  googleAnalyticsId: string;
  googleTagManagerId: string;
  facebookPixelId: string;
}

export interface LogoSettings {
  lightLogoUrl: string;
  darkLogoUrl: string;
  widthDesktop: number;
  heightDesktop: number;
  widthMobile: number;
  position: 'right' | 'center' | 'left';
  marginTop: number;
  marginBottom: number;
  opacity: number;
  brightness?: number;
  contrast?: number;
  scale?: number;
  offsetY?: number;
  allowOverflow?: boolean;
  showTextBrand: boolean;
}

export interface ThemeSettings {
  primaryColor: string;
  primaryHover: string;
  secondaryColor: string;
  accentColor: string;
  accentHover: string;
  backgroundColor: string;
  cardBackground: string;
  textColor: string;
  textMutedColor: string;
  borderColor: string;
  fontArabic: string;
  fontEnglish: string;
  logoSettings: LogoSettings;
}

export interface SectionConfig {
  id: string;
  name: string;
  nameEn: string;
  visible: boolean;
  order: number;
}

export interface WhyCard {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  icon: string;
}

export interface InvestmentMetric {
  id: string;
  valueAr: string;
  valueEn: string;
  labelAr: string;
  labelEn: string;
  sublabelAr?: string;
  sublabelEn?: string;
  icon: string;
}

export interface SupportCard {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  icon: string;
}

export interface JourneyStep {
  stepNumber: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
}

export interface ExpansionCity {
  id: string;
  nameAr: string;
  nameEn: string;
  statusAr: string;
  statusEn: string;
  isAvailable: boolean;
}

export interface ContentData {
  hero: {
    badgeAr: string;
    badgeEn: string;
    headlineAr: string;
    headlineEn: string;
    subheadlineAr: string;
    subheadlineEn: string;
    supportingTextAr: string;
    supportingTextEn: string;
    ctaPrimaryAr: string;
    ctaPrimaryEn: string;
    ctaSecondaryAr: string;
    ctaSecondaryEn: string;
    ctaPrimaryLink: string;
    ctaSecondaryLink: string;
    bgImage: string;
    overlayOpacity: number;
    bgImageBrightness?: number;
    bgImageOpacity?: number;
    sectionHeight: 'full' | 'large' | 'medium';
  };
  opportunity: {
    titleAr: string;
    titleEn: string;
    paragraph1Ar: string;
    paragraph1En: string;
    paragraph2Ar: string;
    paragraph2En: string;
    highlightTextAr: string;
    highlightTextEn: string;
    modelBadgeAr: string;
    modelBadgeEn: string;
  };
  story: {
    titleAr: string;
    titleEn: string;
    quoteAr: string;
    quoteEn: string;
    paragraphsAr: string[];
    paragraphsEn: string[];
    storyImage: string;
    storyImageBrightness?: number;
    storyImageOpacity?: number;
    captionAr: string;
    captionEn: string;
  };
  whyAlPacino: {
    titleAr: string;
    titleEn: string;
    subtitleAr: string;
    subtitleEn: string;
    cards: WhyCard[];
  };
  investmentGlance: {
    titleAr: string;
    titleEn: string;
    subtitleAr: string;
    subtitleEn: string;
    metrics: InvestmentMetric[];
    disclaimerAr: string;
    disclaimerEn: string;
  };
  jvModel: {
    titleAr: string;
    titleEn: string;
    mainStatementAr: string;
    mainStatementEn: string;
    explanationAr: string;
    explanationEn: string;
    equationPartnerAr: string;
    equationPartnerEn: string;
    equationPacinoAr: string;
    equationPacinoEn: string;
    equationOutcomeAr: string;
    equationOutcomeEn: string;
  };
  jvSupport: {
    titleAr: string;
    titleEn: string;
    subtitleAr: string;
    subtitleEn: string;
    items: SupportCard[];
  };
  jvJourney: {
    titleAr: string;
    titleEn: string;
    subtitleAr: string;
    subtitleEn: string;
    steps: JourneyStep[];
  };
  cityExpansion: {
    titleEn: string;
    titleAr: string;
    subtitleAr: string;
    subtitleEn: string;
    cities: ExpansionCity[];
    finalStatementAr: string;
    finalStatementEn: string;
  };
  finalCta: {
    titleEn: string;
    titleAr: string;
    finalStatementAr: string;
    finalStatementEn: string;
    brandName: string;
    taglineAr: string;
    taglineEn: string;
    supportingTaglineAr: string;
    supportingTaglineEn: string;
    ctaTextAr: string;
    ctaTextEn: string;
  };
  contact: {
    whatsapp: string;
    phone: string;
    email: string;
    addressAr: string;
    addressEn: string;
    instagram: string;
    twitter: string;
    linkedin: string;
  };
}
