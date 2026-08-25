import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Language,
  ContentData,
  ThemeSettings,
  SectionConfig,
  SEOSettings,
  InvestorLead,
  MediaItem,
  LeadStatus,
} from '../types';
import {
  DEFAULT_CONTENT,
  DEFAULT_THEME,
  DEFAULT_SECTIONS,
  DEFAULT_SEO,
  INITIAL_MEDIA,
  SAMPLE_LEADS,
} from '../defaultData';

interface ToastInfo {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  content: ContentData;
  setContent: React.Dispatch<React.SetStateAction<ContentData>>;
  theme: ThemeSettings;
  setTheme: React.Dispatch<React.SetStateAction<ThemeSettings>>;
  sections: SectionConfig[];
  setSections: React.Dispatch<React.SetStateAction<SectionConfig[]>>;
  seo: SEOSettings;
  setSeo: React.Dispatch<React.SetStateAction<SEOSettings>>;
  media: MediaItem[];
  setMedia: React.Dispatch<React.SetStateAction<MediaItem[]>>;
  leads: InvestorLead[];
  isAdmin: boolean;
  adminToken: string | null;
  loginAdmin: (password: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => void;
  isLoading: boolean;
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  submitLead: (leadData: {
    fullName: string;
    phone: string;
    email: string;
    targetCity: string;
    hasProposedLocation: boolean;
    budgetRange: string;
    investmentInterest: string;
    notes?: string;
  }) => Promise<{ success: boolean; message: string }>;
  updateContentRemote: (newContent: ContentData) => Promise<boolean>;
  updateThemeRemote: (newTheme: ThemeSettings) => Promise<boolean>;
  updateSectionsRemote: (newSections: SectionConfig[]) => Promise<boolean>;
  updateSeoRemote: (newSeo: SEOSettings) => Promise<boolean>;
  refreshLeads: () => Promise<void>;
  updateLeadStatusRemote: (id: string, status: LeadStatus) => Promise<boolean>;
  addLeadNoteRemote: (id: string, author: string, comment: string) => Promise<boolean>;
  deleteLeadRemote: (id: string) => Promise<boolean>;
  uploadMediaRemote: (payload: {
    title: string;
    category: string;
    type?: string;
    dataUrl?: string;
    externalUrl?: string;
    brightness?: number;
    opacity?: number;
    contrast?: number;
    blur?: number;
  }) => Promise<boolean>;
  deleteMediaRemote: (id: string) => Promise<boolean>;
  resetDefaultsRemote: () => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('ar');
  const [content, setContent] = useState<ContentData>(DEFAULT_CONTENT);
  const [theme, setTheme] = useState<ThemeSettings>(DEFAULT_THEME);
  const [sections, setSections] = useState<SectionConfig[]>(DEFAULT_SECTIONS);
  const [seo, setSeo] = useState<SEOSettings>(DEFAULT_SEO);
  const [media, setMedia] = useState<MediaItem[]>(INITIAL_MEDIA);
  const [leads, setLeads] = useState<InvestorLead[]>(SAMPLE_LEADS);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Update HTML lang, dir, and CSS variables when theme/lang change
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.primaryColor);
    root.style.setProperty('--color-primary-hover', theme.primaryHover || theme.primaryColor);
    root.style.setProperty('--color-secondary', theme.secondaryColor);
    root.style.setProperty('--color-accent', theme.accentColor);
    root.style.setProperty('--color-accent-hover', theme.accentHover || theme.accentColor);
    root.style.setProperty('--color-background', theme.backgroundColor);
    root.style.setProperty('--color-card-bg', theme.cardBackground);
    root.style.setProperty('--color-text', theme.textColor);
    root.style.setProperty('--color-text-muted', theme.textMutedColor);
    root.style.setProperty('--color-border', theme.borderColor);
    if (theme.fontArabic) {
      root.style.setProperty('--font-arabic', `'${theme.fontArabic}', sans-serif`);
    }
    if (theme.fontEnglish) {
      root.style.setProperty('--font-english', `'${theme.fontEnglish}', sans-serif`);
    }
  }, [theme]);

  // Update SEO head title and meta tags
  useEffect(() => {
    document.title = lang === 'ar' ? seo.pageTitleAr : (seo.pageTitleEn || seo.pageTitleAr);
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', lang === 'ar' ? seo.metaDescriptionAr : (seo.metaDescriptionEn || seo.metaDescriptionAr));
    }
  }, [seo, lang]);

  // Initial State Fetch from backend
  const fetchState = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/state');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          if (data.content) setContent(data.content);
          if (data.theme) setTheme(data.theme);
          if (data.sections) setSections(data.sections);
          if (data.seo) setSeo(data.seo);
          if (data.media) setMedia(data.media);
        }
      }
    } catch (err) {
      console.warn('Using default client state due to fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch leads if admin
  const refreshLeads = useCallback(async () => {
    const token = adminToken || localStorage.getItem('alp_admin_token');
    if (!token) return;
    try {
      const res = await fetch('/api/admin/leads', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.leads) {
          setLeads(data.leads);
        }
      }
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    }
  }, [adminToken]);

  useEffect(() => {
    fetchState();
    // Check saved admin session
    const savedToken = localStorage.getItem('alp_admin_token');
    if (savedToken) {
      setAdminToken(savedToken);
      setIsAdmin(true);
    }
  }, [fetchState]);

  useEffect(() => {
    if (isAdmin) {
      refreshLeads();
    }
  }, [isAdmin, refreshLeads]);

  // Submit Lead
  const submitLead = async (leadData: {
    fullName: string;
    phone: string;
    email: string;
    targetCity: string;
    hasProposedLocation: boolean;
    budgetRange: string;
    investmentInterest: string;
    notes?: string;
  }) => {
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (isAdmin) {
          refreshLeads();
        }
        return { success: true, message: data.message || 'تم تقديم طلبك بنجاح!' };
      } else {
        return { success: false, message: data.error || 'حدث خطأ أثناء تقديم الطلب' };
      }
    } catch (err) {
      return { success: false, message: 'تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً' };
    }
  };

  // Admin Auth
  const loginAdmin = async (password: string) => {
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdminToken(data.token);
        setIsAdmin(true);
        localStorage.setItem('alp_admin_token', data.token);
        showToast(lang === 'ar' ? 'تم تسجيل الدخول بنجاح إلى لوحة الإدارة' : 'Logged into Admin successfully', 'success');
        refreshLeads();
        return { success: true };
      } else {
        return { success: false, error: data.error || 'كلمة المرور غير صحيحة' };
      }
    } catch (err) {
      return { success: false, error: 'تعذر الاتصال بالخادم' };
    }
  };

  const logoutAdmin = () => {
    setAdminToken(null);
    setIsAdmin(false);
    localStorage.removeItem('alp_admin_token');
    showToast(lang === 'ar' ? 'تم تسجيل الخروج' : 'Logged out', 'info');
  };

  // Remote updates
  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${adminToken || localStorage.getItem('alp_admin_token') || ''}`,
  });

  const updateContentRemote = async (newContent: ContentData) => {
    setContent(newContent);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(newContent),
      });
      if (res.ok) {
        showToast(lang === 'ar' ? 'تم حفظ المحتوى بنجاح' : 'Content saved successfully', 'success');
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    showToast(lang === 'ar' ? 'فشل حفظ المحتوى على الخادم' : 'Failed to save content', 'error');
    return false;
  };

  const updateThemeRemote = async (newTheme: ThemeSettings) => {
    setTheme(newTheme);
    try {
      const res = await fetch('/api/admin/theme', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(newTheme),
      });
      if (res.ok) {
        showToast(lang === 'ar' ? 'تم تحديث الهوية والألوان بنجاح' : 'Theme updated successfully', 'success');
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    showToast(lang === 'ar' ? 'فشل تحديث الألوان' : 'Failed to update theme', 'error');
    return false;
  };

  const updateSectionsRemote = async (newSections: SectionConfig[]) => {
    setSections(newSections);
    try {
      const res = await fetch('/api/admin/sections', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(newSections),
      });
      if (res.ok) {
        showToast(lang === 'ar' ? 'تم حفظ ترتيب الأقسام' : 'Sections updated successfully', 'success');
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const updateSeoRemote = async (newSeo: SEOSettings) => {
    setSeo(newSeo);
    try {
      const res = await fetch('/api/admin/seo', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(newSeo),
      });
      if (res.ok) {
        showToast(lang === 'ar' ? 'تم حفظ إعدادات الـ SEO' : 'SEO settings saved', 'success');
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const updateLeadStatusRemote = async (id: string, status: LeadStatus) => {
    try {
      const res = await fetch(`/api/admin/leads/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
        showToast(lang === 'ar' ? 'تم تحديث حالة الطلب' : 'Lead status updated', 'success');
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const addLeadNoteRemote = async (id: string, author: string, comment: string) => {
    try {
      const res = await fetch(`/api/admin/leads/${id}/notes`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ author, comment }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.note) {
          setLeads((prev) =>
            prev.map((l) =>
              l.id === id
                ? { ...l, adminComments: [...(l.adminComments || []), data.note] }
                : l
            )
          );
          showToast(lang === 'ar' ? 'تمت إضافة الملاحظة' : 'Note added', 'success');
          return true;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const deleteLeadRemote = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
        showToast(lang === 'ar' ? 'تم حذف الطلب' : 'Lead deleted', 'info');
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const uploadMediaRemote = async (payload: {
    title: string;
    category: string;
    type?: string;
    dataUrl?: string;
    externalUrl?: string;
    brightness?: number;
    opacity?: number;
    contrast?: number;
    blur?: number;
  }) => {
    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.media) {
          setMedia((prev) => [data.media, ...prev]);
          showToast(lang === 'ar' ? 'تم رفع وحفظ الصورة في المكتبة بنجاح' : 'Media uploaded successfully', 'success');
          return true;
        }
      }
    } catch (e) {
      console.error(e);
    }
    showToast(lang === 'ar' ? 'فشل رفع الصورة' : 'Media upload failed', 'error');
    return false;
  };

  const deleteMediaRemote = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/media/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setMedia((prev) => prev.filter((m) => m.id !== id));
        showToast(lang === 'ar' ? 'تم حذف الصورة من المكتبة' : 'Media deleted', 'info');
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const resetDefaultsRemote = async () => {
    try {
      const res = await fetch('/api/admin/reset-defaults', {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setContent(DEFAULT_CONTENT);
        setTheme(DEFAULT_THEME);
        setSections(DEFAULT_SECTIONS);
        setSeo(DEFAULT_SEO);
        setMedia(INITIAL_MEDIA);
        setLeads(SAMPLE_LEADS);
        showToast(lang === 'ar' ? 'تمت استعادة إعدادات القالب الافتراضية' : 'Default settings restored', 'success');
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        content,
        setContent,
        theme,
        setTheme,
        sections,
        setSections,
        seo,
        setSeo,
        media,
        setMedia,
        leads,
        isAdmin,
        adminToken,
        loginAdmin,
        logoutAdmin,
        isLoading,
        toasts,
        showToast,
        removeToast,
        submitLead,
        updateContentRemote,
        updateThemeRemote,
        updateSectionsRemote,
        updateSeoRemote,
        refreshLeads,
        updateLeadStatusRemote,
        addLeadNoteRemote,
        deleteLeadRemote,
        uploadMediaRemote,
        deleteMediaRemote,
        resetDefaultsRemote,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
