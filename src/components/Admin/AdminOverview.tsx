import React from 'react';
import { useApp } from '../../context/AppContext';
import { Users, UserPlus, PhoneCall, CheckCircle2, TrendingUp, DollarSign, ArrowUpRight, MessageCircle, Building2 } from 'lucide-react';
import { LeadStatus } from '../../types';

interface AdminOverviewProps {
  onNavigateToLeads: (statusFilter?: LeadStatus) => void;
  onNavigateToCMS: () => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onNavigateToLeads, onNavigateToCMS }) => {
  const { lang, leads } = useApp();

  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === 'new').length;
  const contactedLeads = leads.filter((l) => l.status === 'contacted').length;
  const qualifiedLeads = leads.filter((l) => l.status === 'qualified').length;
  const negotiationLeads = leads.filter((l) => l.status === 'negotiation').length;
  const wonLeads = leads.filter((l) => l.status === 'won').length;

  const conversionRate = totalLeads > 0 ? Math.round(((qualifiedLeads + negotiationLeads + wonLeads) / totalLeads) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#3B113D] via-[#240C29] to-[#161222] border border-[#D4AF37]/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase font-bold text-[#D4AF37] tracking-wider">
            {lang === 'ar' ? 'نظرة عامة على بوابة الاستثمار' : 'Investment Portal Overview'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            {lang === 'ar' ? 'مرحباً بك في لوحة تحكم AL PACINO' : 'Welcome to AL PACINO Command Center'}
          </h2>
          <p className="text-sm text-gray-300 mt-2 max-w-xl">
            {lang === 'ar'
              ? 'متابعة مباشرة لطلبات الشركاء الاستثماريين، إدارة محتوى الهبوط، وتخصيص الهوية البصرية.'
              : 'Live tracking of JV investor leads, CMS landing content management, and brand identity controls.'}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigateToLeads()}
            className="px-5 py-3 rounded-xl font-bold text-sm text-black bg-gradient-to-r from-[#D4AF37] to-[#E5BE48] hover:brightness-110 shadow-lg shadow-amber-500/20 transition flex items-center gap-2"
          >
            <span>{lang === 'ar' ? 'عرض جميع الطلبات' : 'View All Leads'}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <button
          onClick={() => onNavigateToLeads()}
          className="p-5 rounded-2xl bg-[#161222] border border-[#2B2338] hover:border-purple-500/50 text-start transition group cursor-pointer"
        >
          <div className="flex items-center justify-between text-gray-400 mb-3">
            <span className="text-xs font-semibold">{lang === 'ar' ? 'إجمالي الطلبات' : 'Total Leads'}</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-white group-hover:text-[#D4AF37] transition-colors">{totalLeads}</div>
          <div className="text-[11px] text-gray-500 mt-1">{lang === 'ar' ? 'سجلات المستثمرين' : 'Investor records'}</div>
        </button>

        <button
          onClick={() => onNavigateToLeads('new')}
          className="p-5 rounded-2xl bg-[#161222] border border-[#2B2338] hover:border-amber-500/50 text-start transition group cursor-pointer"
        >
          <div className="flex items-center justify-between text-gray-400 mb-3">
            <span className="text-xs font-semibold">{lang === 'ar' ? 'طلبات جديدة' : 'New Leads'}</span>
            <UserPlus className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400">{newLeads}</div>
          <div className="text-[11px] text-amber-500/80 mt-1">{lang === 'ar' ? 'بحاجة للمراجعة' : 'Requires review'}</div>
        </button>

        <button
          onClick={() => onNavigateToLeads('contacted')}
          className="p-5 rounded-2xl bg-[#161222] border border-[#2B2338] hover:border-blue-500/50 text-start transition group cursor-pointer"
        >
          <div className="flex items-center justify-between text-gray-400 mb-3">
            <span className="text-xs font-semibold">{lang === 'ar' ? 'تم التواصل' : 'Contacted'}</span>
            <PhoneCall className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-blue-400">{contactedLeads}</div>
          <div className="text-[11px] text-gray-500 mt-1">{lang === 'ar' ? 'مرحلة التعارف' : 'Initial contact'}</div>
        </button>

        <button
          onClick={() => onNavigateToLeads('qualified')}
          className="p-5 rounded-2xl bg-[#161222] border border-[#2B2338] hover:border-green-500/50 text-start transition group cursor-pointer"
        >
          <div className="flex items-center justify-between text-gray-400 mb-3">
            <span className="text-xs font-semibold">{lang === 'ar' ? 'مؤهل للشراكة' : 'Qualified'}</span>
            <CheckCircle2 className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-3xl font-black text-green-400">{qualifiedLeads}</div>
          <div className="text-[11px] text-gray-500 mt-1">{lang === 'ar' ? 'سيولة وموقع جاهز' : 'High intent'}</div>
        </button>

        <button
          onClick={() => onNavigateToLeads('negotiation')}
          className="p-5 rounded-2xl bg-[#161222] border border-[#2B2338] hover:border-purple-500/50 text-start transition group cursor-pointer"
        >
          <div className="flex items-center justify-between text-gray-400 mb-3">
            <span className="text-xs font-semibold">{lang === 'ar' ? 'مفاوضات وعقود' : 'Negotiation'}</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-purple-300">{negotiationLeads}</div>
          <div className="text-[11px] text-gray-500 mt-1">{lang === 'ar' ? 'صياغة اتفاقية JV' : 'Drafting agreement'}</div>
        </button>

        <div className="p-5 rounded-2xl bg-[#161222] border border-[#2B2338] text-start">
          <div className="flex items-center justify-between text-gray-400 mb-3">
            <span className="text-xs font-semibold">{lang === 'ar' ? 'نسبة التأهيل' : 'Qualification Rate'}</span>
            <DollarSign className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="text-3xl font-black text-[#D4AF37]">{conversionRate}%</div>
          <div className="text-[11px] text-gray-500 mt-1">{lang === 'ar' ? 'تحويل الفرص' : 'Pipeline quality'}</div>
        </div>
      </div>

      {/* Recent Leads Pipeline */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#161222] border border-[#2B2338]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">
              {lang === 'ar' ? 'أحدث طلبات الاستثمار الواردة' : 'Recent Investor Submissions'}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {lang === 'ar' ? 'آخر المستثمرين المسجلين عبر النموذج' : 'Latest applicants awaiting review'}
            </p>
          </div>
          <button
            onClick={() => onNavigateToLeads()}
            className="text-xs font-bold text-[#D4AF37] hover:underline"
          >
            {lang === 'ar' ? 'إدارة الطلبات كاملة ←' : 'Manage Leads →'}
          </button>
        </div>

        {leads.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-sm">
            {lang === 'ar' ? 'لا توجد طلبات مسجلة بعد' : 'No investor submissions yet'}
          </div>
        ) : (
          <div className="space-y-3">
            {leads.slice(0, 5).map((lead) => (
              <div
                key={lead.id}
                className="p-4 rounded-2xl bg-[#0D0B12] border border-[#241E30] hover:border-purple-500/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base">{lead.fullName}</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/30">
                      {lead.targetCity}
                    </span>
                    {lead.hasProposedLocation && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-950/80 text-green-400 border border-green-500/30 flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        <span>{lang === 'ar' ? 'موقع متوفر' : 'Site Available'}</span>
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-4">
                    <span dir="ltr">{lead.phone}</span>
                    <span>•</span>
                    <span>{lead.budgetRange}</span>
                    <span>•</span>
                    <span>{lead.investmentInterest}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                      lead.status === 'new'
                        ? 'bg-amber-950/80 text-amber-400 border border-amber-500/30'
                        : lead.status === 'qualified'
                        ? 'bg-green-950/80 text-green-400 border border-green-500/30'
                        : lead.status === 'negotiation'
                        ? 'bg-purple-950/80 text-purple-300 border border-purple-500/30'
                        : 'bg-gray-800 text-gray-300'
                    }`}
                  >
                    {lead.status}
                  </span>

                  <a
                    href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `مرحباً أستاذ ${lead.fullName}، نتواصل معك من إدارة الاستثمار والتوسع لعلامة AL PACINO BROASTED بخصوص طلب الشراكة في مدينة ${lead.targetCity}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-green-950/60 hover:bg-green-900 border border-green-500/40 text-green-400 transition"
                    title={lang === 'ar' ? 'محادثة واتساب مباشرة' : 'WhatsApp Lead'}
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
