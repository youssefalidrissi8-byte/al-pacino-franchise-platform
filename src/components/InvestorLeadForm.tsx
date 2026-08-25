import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Building,
  Phone,
  Mail,
  User,
  MapPin,
  Coins,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

interface InvestorLeadFormProps {
  prefilledCity?: string;
}

export const InvestorLeadForm: React.FC<InvestorLeadFormProps> = ({ prefilledCity }) => {
  const { lang, submitLead, showToast } = useApp();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    targetCity: prefilledCity || 'الرياض',
    hasProposedLocation: false,
    budgetRange: '600,000 – 700,000 ريال',
    investmentInterest: 'فرع واحد',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Update targetCity if prefilledCity prop changes
  React.useEffect(() => {
    if (prefilledCity) {
      setFormData((prev) => ({ ...prev, targetCity: prefilledCity }));
    }
  }, [prefilledCity]);

  const budgetOptions = [
    { ar: '600,000 – 700,000 ريال', en: 'SAR 600K – 700K' },
    { ar: '700,000 – 1,000,000 ريال', en: 'SAR 700K – 1M' },
    { ar: 'أكثر من 1,000,000 ريال', en: 'Over SAR 1M' },
  ];

  const interestOptions = [
    { ar: 'فرع واحد', en: 'Single Branch' },
    { ar: 'عدة فروع', en: 'Multiple Branches' },
    { ar: 'شراكة توسع في مدينة / منطقة', en: 'City/Regional Development' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!formData.fullName.trim()) {
      setErrorMessage(lang === 'ar' ? 'يرجى إدخال الاسم الكامل' : 'Please enter your full name');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 8) {
      setErrorMessage(lang === 'ar' ? 'يرجى إدخال رقم جوال صحيح' : 'Please enter a valid phone number');
      return;
    }
    if (!formData.targetCity.trim()) {
      setErrorMessage(lang === 'ar' ? 'يرجى تحديد المدينة المستهدفة' : 'Please specify target city');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitLead(formData);
      if (res.success) {
        setSubmittedSuccess(true);
        // Confetti effect
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#7E22CE', '#FAF8F5'],
        });
        showToast(res.message, 'success');
      } else {
        setErrorMessage(res.message);
        showToast(res.message, 'error');
      }
    } catch (err) {
      setErrorMessage(lang === 'ar' ? 'حدث خطأ في الإرسال' : 'Submission error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      targetCity: 'الرياض',
      hasProposedLocation: false,
      budgetRange: '600,000 – 700,000 ريال',
      investmentInterest: 'فرع واحد',
      notes: '',
    });
    setSubmittedSuccess(false);
  };

  return (
    <section
      id="investor-form"
      className="relative py-20 sm:py-28 bg-[#0A0A0A] overflow-hidden border-b border-[#2B2338] scroll-mt-24"
    >
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#4B0082]/20 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A1128] border border-[#C19B4A]/30 text-xs font-semibold text-[#C19B4A] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'بوابة المستثمرين وشركاء JV' : 'Investor & JV Partner Portal'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            {lang === 'ar' ? 'طلب الانضمام كشريك JV' : 'Become a JV Partner'}
          </h2>
          <div className="text-sm sm:text-base font-bold text-[#C19B4A] mt-2 font-['Outfit']">
            BECOME A PARTNER
          </div>
          <p className="mt-2.5 text-xs sm:text-sm text-gray-300">
            {lang === 'ar'
              ? 'يرجى تعبئة النموذج أدناه وسيقوم فريق الاستثمار والشراكات بالتواصل معكم خلال 24 ساعة.'
              : 'Complete the form below and our investment team will reach out within 24 hours.'}
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-[#4B0082] via-[#C19B4A] to-[#4B0082] mx-auto mt-4 rounded-full" />
        </div>

        {/* Form Container */}
        <div className="p-6 sm:p-10 rounded-2xl bg-[#1A1128] border border-[#C19B4A]/25 shadow-2xl backdrop-blur-xl relative">
          <AnimatePresence mode="wait">
            {submittedSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-10 text-center flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#4B0082]/80 border-2 border-[#C19B4A] flex items-center justify-center text-[#C19B4A] mb-5 shadow-xl shadow-black/40 animate-pulse">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
                  {lang === 'ar' ? 'تم استلام طلب الشراكة بنجاح!' : 'Partnership Application Received!'}
                </h3>
                <p className="text-gray-300 max-w-lg text-sm sm:text-base leading-relaxed mb-6">
                  {lang === 'ar'
                    ? `شكراً لاهتمامك بالاستثمار مع AL PACINO. تم حفظ طلبك وسيقوم فريق الشراكات بمراجعته والتواصل معك على الرقم (${formData.phone}) لترتيب الخطوات التالية.`
                    : `Thank you for your interest. We received your application and our team will contact you at (${formData.phone}) to schedule the next phase.`}
                </p>
                <button
                  onClick={handleResetForm}
                  className="px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm bg-black/40 hover:bg-[#2B2338] text-[#C19B4A] border border-[#C19B4A]/30 transition"
                >
                  {lang === 'ar' ? 'إرسال طلب إضافي' : 'Submit Another Application'}
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs sm:text-sm flex items-center gap-3">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* 1. Full Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-200 mb-1.5">
                      {lang === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-gray-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder={lang === 'ar' ? 'مثال: عبدالمحسن الخالدي' : 'e.g. Sultan Al-Muqrin'}
                        className="w-full ps-10 pe-3.5 py-3 rounded-xl bg-[#0A0A0A] border border-[#2B2338] focus:border-[#C19B4A] focus:ring-1 focus:ring-[#C19B4A] text-white placeholder-gray-500 text-xs sm:text-sm outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-200 mb-1.5">
                      {lang === 'ar' ? 'رقم الجوال *' : 'Phone Number *'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-gray-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        required
                        dir="ltr"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+966 50 000 0000"
                        className="w-full ps-10 pe-3.5 py-3 rounded-xl bg-[#0A0A0A] border border-[#2B2338] focus:border-[#C19B4A] focus:ring-1 focus:ring-[#C19B4A] text-white placeholder-gray-500 text-xs sm:text-sm outline-none transition text-start"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Email & Target City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-200 mb-1.5">
                      {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-gray-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        dir="ltr"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="investor@domain.com"
                        className="w-full ps-10 pe-3.5 py-3 rounded-xl bg-[#0A0A0A] border border-[#2B2338] focus:border-[#C19B4A] focus:ring-1 focus:ring-[#C19B4A] text-white placeholder-gray-500 text-xs sm:text-sm outline-none transition text-start"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-200 mb-1.5">
                      {lang === 'ar' ? 'المدينة المستهدفة *' : 'Target City *'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-gray-400">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.targetCity}
                        onChange={(e) => setFormData({ ...formData, targetCity: e.target.value })}
                        placeholder={lang === 'ar' ? 'الرياض / جدة / الدمام...' : 'Riyadh / Jeddah / Dammam...'}
                        className="w-full ps-10 pe-3.5 py-3 rounded-xl bg-[#0A0A0A] border border-[#2B2338] focus:border-[#C19B4A] focus:ring-1 focus:ring-[#C19B4A] text-white placeholder-gray-500 text-xs sm:text-sm outline-none transition"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Has Proposed Location? (Yes/No Toggle Buttons) */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-200 mb-2">
                    {lang === 'ar' ? 'هل لديك موقع أو عقار تجاري مقترح للفرع؟ *' : 'Do you have a proposed commercial site/location? *'}
                  </label>
                  <div className="grid grid-cols-2 gap-3.5">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, hasProposedLocation: true })}
                      className={`py-3 px-4 rounded-xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                        formData.hasProposedLocation
                          ? 'bg-[#4B0082]/70 border-[#C19B4A] text-[#C19B4A] shadow-md'
                          : 'bg-[#0A0A0A] border-[#2B2338] text-gray-400 hover:border-[#C19B4A]/30'
                      }`}
                    >
                      <Building className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'نعم، يتوفر لدي موقع' : 'Yes, I have a site'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, hasProposedLocation: false })}
                      className={`py-3 px-4 rounded-xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                        !formData.hasProposedLocation
                          ? 'bg-[#4B0082]/70 border-[#C19B4A] text-[#C19B4A] shadow-md'
                          : 'bg-[#0A0A0A] border-[#2B2338] text-gray-400 hover:border-[#C19B4A]/30'
                      }`}
                    >
                      <span>{lang === 'ar' ? 'لا، أبحث عن موقع بمساعدتكم' : 'No, need site assistance'}</span>
                    </button>
                  </div>
                </div>

                {/* 4. Investment Budget Range */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-200 mb-2">
                    {lang === 'ar' ? 'الميزانية الاستثمارية المتاحة *' : 'Investment Capital Budget *'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {budgetOptions.map((opt) => {
                      const isSelected = formData.budgetRange === opt.ar;
                      return (
                        <button
                          key={opt.ar}
                          type="button"
                          onClick={() => setFormData({ ...formData, budgetRange: opt.ar })}
                          className={`p-3 rounded-xl border text-center text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                            isSelected
                              ? 'bg-[#4B0082]/70 border-[#C19B4A] text-white shadow-md'
                              : 'bg-[#0A0A0A] border-[#2B2338] text-gray-400 hover:border-[#C19B4A]/30'
                          }`}
                        >
                          <Coins className={`w-4 h-4 ${isSelected ? 'text-[#C19B4A]' : 'text-gray-500'}`} />
                          <span>{lang === 'ar' ? opt.ar : opt.en}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Investment Scope Interest */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-200 mb-2">
                    {lang === 'ar' ? 'طبيعة اهتمامك الاستثماري *' : 'Investment Scope Interest *'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {interestOptions.map((opt) => {
                      const isSelected = formData.investmentInterest === opt.ar;
                      return (
                        <button
                          key={opt.ar}
                          type="button"
                          onClick={() => setFormData({ ...formData, investmentInterest: opt.ar })}
                          className={`p-3 rounded-xl border text-center text-xs sm:text-sm font-bold transition ${
                            isSelected
                              ? 'bg-[#4B0082]/70 border-[#C19B4A] text-white shadow-md'
                              : 'bg-[#0A0A0A] border-[#2B2338] text-gray-400 hover:border-[#C19B4A]/30'
                          }`}
                        >
                          <span>{lang === 'ar' ? opt.ar : opt.en}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 6. Additional Notes */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-200 mb-1.5">
                    {lang === 'ar' ? 'ملاحظات أو تفاصيل إضافية (اختياري)' : 'Additional Notes / Questions (Optional)'}
                  </label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder={lang === 'ar' ? 'أضف أي استفسارات أو تفاصيل حول الموقع والجدول الزمني...' : 'Add any additional questions or notes...'}
                    className="w-full p-3 rounded-xl bg-[#0A0A0A] border border-[#2B2338] focus:border-[#C19B4A] focus:ring-1 focus:ring-[#C19B4A] text-white placeholder-gray-500 text-xs sm:text-sm outline-none transition"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-full font-black text-sm text-black bg-[#C19B4A] hover:bg-[#D4AF37] shadow-xl shadow-[#C19B4A]/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span>{lang === 'ar' ? 'جارٍ إرسال الطلب...' : 'Submitting Application...'}</span>
                    ) : (
                      <>
                        <span>{lang === 'ar' ? 'أرسل طلب الشراكة' : 'Submit JV Partnership Request'}</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 text-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C19B4A]" />
                  <span>
                    {lang === 'ar'
                      ? 'بياناتك مشفرة ومحمية بسرية تامة وتُستخدم فقط لأغراض تقييم طلب الشراكة.'
                      : 'Your investment inquiry is strictly confidential and protected.'}
                  </span>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
