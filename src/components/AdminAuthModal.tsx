import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, X, KeyRound, ShieldAlert, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { lang, loginAdmin } = useApp();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await loginAdmin(password);
      if (res.success) {
        setPassword('');
        onSuccess();
        onClose();
      } else {
        setError(res.error || (lang === 'ar' ? 'كلمة المرور غير صحيحة' : 'Invalid password'));
      }
    } catch (err) {
      setError(lang === 'ar' ? 'حدث خطأ أثناء تسجيل الدخول' : 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div
      id="admin-auth-modal"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md p-8 rounded-3xl bg-[#161222] border border-[#3A2D52] shadow-2xl relative text-start"
      >
        <button
          onClick={onClose}
          className="absolute top-6 end-6 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#231B34] transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-[#D4AF37] mb-6 shadow-lg">
          <KeyRound className="w-7 h-7" />
        </div>

        <h3 className="text-2xl font-black text-white mb-1">
          {lang === 'ar' ? 'تسجيل دخول الإدارة' : 'Admin Portal Login'}
        </h3>
        <p className="text-sm text-gray-400 mb-6">
          {lang === 'ar'
            ? 'لوحة التحكم المركزية لإدارة المحتوى، الثيمات، والطلبات الاستثمارية.'
            : 'Enter admin credentials to manage content, theme, and investor leads.'}
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-2">
              {lang === 'ar' ? 'كلمة المرور' : 'Password'}
            </label>
            <div className="relative">
              <input
                type="password"
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-[#0D0B12] border border-[#2B2338] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] text-white text-sm outline-none transition"
              />
            </div>
            <div className="mt-2 text-[11px] text-gray-400 flex items-center justify-between">
              <span>{lang === 'ar' ? 'كلمة المرور الافتراضية:' : 'Default Password:'} <code className="text-[#D4AF37] font-mono font-bold bg-[#20182E] px-1.5 py-0.5 rounded">admin123</code></span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-black bg-gradient-to-r from-[#D4AF37] to-[#E5BE48] hover:brightness-110 shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? (lang === 'ar' ? 'جارٍ التحقق...' : 'Verifying...') : (lang === 'ar' ? 'دخول لوحة التحكم' : 'Login to Dashboard')}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>
        </form>
      </motion.div>
    </div>
  );
};
