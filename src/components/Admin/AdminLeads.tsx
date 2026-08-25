import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InvestorLead, LeadStatus } from '../../types';
import {
  Search,
  Filter,
  Download,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Coins,
  Building,
  Calendar,
  Trash2,
  CheckCircle2,
  Clock,
  Send,
  X,
  UserCheck,
  FileText,
} from 'lucide-react';

interface AdminLeadsProps {
  initialStatusFilter?: LeadStatus;
}

export const AdminLeads: React.FC<AdminLeadsProps> = ({ initialStatusFilter }) => {
  const {
    lang,
    leads,
    updateLeadStatusRemote,
    addLeadNoteRemote,
    deleteLeadRemote,
    adminToken,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(initialStatusFilter || 'all');
  const [selectedLead, setSelectedLead] = useState<InvestorLead | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      lead.targetCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.email && lead.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (lead.notes && lead.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    await updateLeadStatusRemote(leadId, newStatus);
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newComment.trim()) return;

    setIsSubmittingComment(true);
    await addLeadNoteRemote(selectedLead.id, 'المسؤول', newComment.trim());
    setNewComment('');
    setIsSubmittingComment(false);

    // Refresh selected lead comments from leads array
    const updated = leads.find((l) => l.id === selectedLead.id);
    if (updated) {
      setSelectedLead(updated);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذا الطلب؟' : 'Are you sure you want to delete this lead?')) {
      await deleteLeadRemote(id);
      if (selectedLead?.id === id) {
        setSelectedLead(null);
      }
    }
  };

  const handleExportCSV = () => {
    const token = adminToken || localStorage.getItem('alp_admin_token') || '';
    window.open(`/api/admin/export-csv?token=${encodeURIComponent(token)}`, '_blank');
  };

  const statusBadges: Record<LeadStatus, { labelAr: string; labelEn: string; color: string }> = {
    new: { labelAr: 'جديد', labelEn: 'New', color: 'bg-amber-950/80 text-amber-400 border-amber-500/30' },
    contacted: { labelAr: 'تم التواصل', labelEn: 'Contacted', color: 'bg-blue-950/80 text-blue-400 border-blue-500/30' },
    qualified: { labelAr: 'مؤهل', labelEn: 'Qualified', color: 'bg-green-950/80 text-green-400 border-green-500/30' },
    negotiation: { labelAr: 'مفاوضات', labelEn: 'Negotiation', color: 'bg-purple-950/80 text-purple-300 border-purple-500/30' },
    won: { labelAr: 'تم التوقيع', labelEn: 'Won', color: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30' },
    lost: { labelAr: 'مستبعد', labelEn: 'Lost', color: 'bg-red-950/80 text-red-400 border-red-500/30' },
  };

  return (
    <div className="space-y-6">
      {/* Header & Export CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">
            {lang === 'ar' ? 'إدارة طلبات المستثمرين (Leads CRM)' : 'Investor Leads CRM'}
          </h2>
          <p className="text-sm text-gray-400">
            {lang === 'ar'
              ? `إجمالي الطلبات: ${leads.length} | المطابقة للبحث: ${filteredLeads.length}`
              : `Total Leads: ${leads.length} | Filtered: ${filteredLeads.length}`}
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-[#1E182B] hover:bg-[#2A223C] border border-[#3A2D52] text-sm font-bold text-[#D4AF37] flex items-center justify-center gap-2 transition"
        >
          <Download className="w-4 h-4" />
          <span>{lang === 'ar' ? 'تصدير إلى Excel (CSV)' : 'Export to CSV'}</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#161222] border border-[#2B2338] flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-gray-400 absolute inset-y-0 start-3.5 my-auto" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'ar' ? 'بحث بالاسم، رقم الجوال، المدينة، الملاحظات...' : 'Search by name, phone, city, notes...'}
            className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-[#0D0B12] border border-[#2B2338] text-white text-sm focus:border-[#D4AF37] outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {['all', 'new', 'contacted', 'qualified', 'negotiation', 'won', 'lost'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                statusFilter === st
                  ? 'bg-[#3B113D] border border-[#D4AF37] text-white'
                  : 'bg-[#0D0B12] border border-[#2B2338] text-gray-400 hover:text-white'
              }`}
            >
              {st === 'all' ? (lang === 'ar' ? 'الكل' : 'All') : (lang === 'ar' ? statusBadges[st as LeadStatus]?.labelAr : statusBadges[st as LeadStatus]?.labelEn)}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <div className="rounded-2xl bg-[#161222] border border-[#2B2338] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-sm">
            <thead className="bg-[#0D0B12] text-xs font-bold text-gray-400 uppercase border-b border-[#2B2338]">
              <tr>
                <th className="px-5 py-4 text-start">{lang === 'ar' ? 'المستثمر' : 'Investor'}</th>
                <th className="px-5 py-4 text-start">{lang === 'ar' ? 'المدينة' : 'City'}</th>
                <th className="px-5 py-4 text-start">{lang === 'ar' ? 'الميزانية والاهتمام' : 'Budget & Scope'}</th>
                <th className="px-5 py-4 text-start">{lang === 'ar' ? 'موقع مقترح' : 'Site'}</th>
                <th className="px-5 py-4 text-start">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                <th className="px-5 py-4 text-start">{lang === 'ar' ? 'تاريخ التقديم' : 'Date'}</th>
                <th className="px-5 py-4 text-center">{lang === 'ar' ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#241E30]">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-500">
                    {lang === 'ar' ? 'لم يتم العثور على أي طلبات تطابق هذا البحث' : 'No leads found matching criteria'}
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const badge = statusBadges[lead.status] || statusBadges.new;
                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-[#1C1629] transition cursor-pointer"
                      onClick={() => setSelectedLead(lead)}
                    >
                      {/* Name & Phone */}
                      <td className="px-5 py-4">
                        <div className="font-bold text-white text-base">{lead.fullName}</div>
                        <div className="text-xs text-gray-400 font-mono mt-0.5" dir="ltr">
                          {lead.phone}
                        </div>
                        {lead.email && <div className="text-[11px] text-purple-400">{lead.email}</div>}
                      </td>

                      {/* City */}
                      <td className="px-5 py-4">
                        <span className="font-semibold text-gray-200">{lead.targetCity}</span>
                      </td>

                      {/* Budget */}
                      <td className="px-5 py-4">
                        <div className="text-xs font-semibold text-[#D4AF37]">{lead.budgetRange}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{lead.investmentInterest}</div>
                      </td>

                      {/* Location */}
                      <td className="px-5 py-4">
                        {lead.hasProposedLocation ? (
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-950 text-green-400 border border-green-500/30">
                            {lang === 'ar' ? 'متوفر' : 'Available'}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-xs text-gray-500 bg-gray-900 border border-gray-800">
                            {lang === 'ar' ? 'غير متوفر' : 'None'}
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${badge.color}`}>
                          {lang === 'ar' ? badge.labelAr : badge.labelEn}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-xs text-gray-400 whitespace-nowrap">
                        {new Date(lead.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-2">
                          <a
                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                              `مرحباً أستاذ ${lead.fullName}، نتواصل معك من إدارة الاستثمار لعلامة AL PACINO BROASTED بخصوص طلب الشراكة في مدينة ${lead.targetCity}.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-green-950/60 hover:bg-green-900 text-green-400 border border-green-500/30 transition"
                            title={lang === 'ar' ? 'محادثة واتساب' : 'WhatsApp'}
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>

                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="p-2 rounded-xl bg-[#231B34] hover:bg-[#32264C] text-purple-300 border border-purple-500/30 transition text-xs font-semibold px-3"
                          >
                            {lang === 'ar' ? 'تفاصيل' : 'Details'}
                          </button>

                          <button
                            onClick={() => handleDelete(lead.id)}
                            className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/30 transition"
                            title={lang === 'ar' ? 'حذف' : 'Delete'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Details Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#161222] border border-[#3A2D52] shadow-2xl p-6 sm:p-8 space-y-6 text-start">
            <div className="flex items-center justify-between pb-4 border-b border-[#2B2338]">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#D4AF37] font-bold">
                  {lang === 'ar' ? 'تفاصيل طلب الشريك' : 'Partner Application Details'}
                </span>
                <h3 className="text-2xl font-black text-white">{selectedLead.fullName}</h3>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-2 rounded-xl hover:bg-[#231B34] text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Bar */}
            <div className="p-4 rounded-2xl bg-[#0D0B12] border border-[#2B2338] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-bold text-gray-300">{lang === 'ar' ? 'تغيير حالة الطلب:' : 'Update Status:'}</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {(['new', 'contacted', 'qualified', 'negotiation', 'won', 'lost'] as LeadStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(selectedLead.id, st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      selectedLead.status === st
                        ? 'bg-[#3B113D] border border-[#D4AF37] text-white shadow-sm'
                        : 'bg-[#181324] border border-[#2B2338] text-gray-400 hover:text-white'
                    }`}
                  >
                    {lang === 'ar' ? statusBadges[st].labelAr : statusBadges[st].labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#0D0B12] border border-[#2B2338]">
                <div className="text-xs text-gray-400 mb-1">{lang === 'ar' ? 'رقم الجوال' : 'Phone'}</div>
                <div className="text-base font-bold text-white font-mono" dir="ltr">
                  {selectedLead.phone}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0D0B12] border border-[#2B2338]">
                <div className="text-xs text-gray-400 mb-1">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</div>
                <div className="text-base font-bold text-white">
                  {selectedLead.email || '—'}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0D0B12] border border-[#2B2338]">
                <div className="text-xs text-gray-400 mb-1">{lang === 'ar' ? 'المدينة المستهدفة' : 'Target City'}</div>
                <div className="text-base font-bold text-[#D4AF37]">{selectedLead.targetCity}</div>
              </div>

              <div className="p-4 rounded-xl bg-[#0D0B12] border border-[#2B2338]">
                <div className="text-xs text-gray-400 mb-1">{lang === 'ar' ? 'الميزانية المتاحة' : 'Budget'}</div>
                <div className="text-base font-bold text-white">{selectedLead.budgetRange}</div>
              </div>

              <div className="p-4 rounded-xl bg-[#0D0B12] border border-[#2B2338]">
                <div className="text-xs text-gray-400 mb-1">{lang === 'ar' ? 'نوع الاهتمام' : 'Scope'}</div>
                <div className="text-base font-bold text-white">{selectedLead.investmentInterest}</div>
              </div>

              <div className="p-4 rounded-xl bg-[#0D0B12] border border-[#2B2338]">
                <div className="text-xs text-gray-400 mb-1">{lang === 'ar' ? 'توفر موقع مقترح' : 'Site Available'}</div>
                <div className="text-base font-bold text-white">
                  {selectedLead.hasProposedLocation ? (lang === 'ar' ? 'نعم، يتوفر موقع' : 'Yes, site available') : (lang === 'ar' ? 'لا، يتطلب ترشيح موقع' : 'No site yet')}
                </div>
              </div>
            </div>

            {/* Notes submitted by investor */}
            {selectedLead.notes && (
              <div className="p-4 rounded-xl bg-[#0D0B12] border border-[#2B2338]">
                <div className="text-xs font-bold text-purple-300 mb-1">
                  {lang === 'ar' ? 'ملاحظات المستثمر المرفقة:' : 'Applicant Notes:'}
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">{selectedLead.notes}</p>
              </div>
            )}

            {/* Internal Comments / Follow-up Notes */}
            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#D4AF37]" />
                <span>{lang === 'ar' ? 'سجل المتابعة والملاحظات الداخلية' : 'Internal Notes & Audit Log'}</span>
              </h4>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {(!selectedLead.adminComments || selectedLead.adminComments.length === 0) ? (
                  <div className="text-xs text-gray-500 py-3">{lang === 'ar' ? 'لا توجد ملاحظات داخلية بعد' : 'No internal comments yet'}</div>
                ) : (
                  selectedLead.adminComments.map((c) => (
                    <div key={c.id} className="p-3 rounded-xl bg-[#0D0B12] border border-[#241E30] text-xs">
                      <div className="flex items-center justify-between text-gray-400 mb-1">
                        <span className="font-bold text-purple-300">{c.author}</span>
                        <span>{new Date(c.createdAt).toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US')}</span>
                      </div>
                      <p className="text-gray-200">{c.comment}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={lang === 'ar' ? 'أضف ملاحظة داخلية جديدة...' : 'Add an internal note...'}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#0D0B12] border border-[#2B2338] text-white text-xs outline-none focus:border-[#D4AF37]"
                />
                <button
                  type="submit"
                  disabled={isSubmittingComment || !newComment.trim()}
                  className="px-4 py-2.5 rounded-xl bg-[#3B113D] hover:bg-[#4E1850] text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-40"
                >
                  <span>{lang === 'ar' ? 'إضافة' : 'Add'}</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            {/* Direct Connect Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2B2338]">
              <a
                href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `مرحباً أستاذ ${selectedLead.fullName}، نتواصل معك من إدارة الاستثمار لعلامة AL PACINO BROASTED.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-green-950 hover:bg-green-900 border border-green-500/40 text-green-400 text-sm font-bold flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{lang === 'ar' ? 'محادثة عبر واتساب' : 'Chat via WhatsApp'}</span>
              </a>
              <button
                onClick={() => setSelectedLead(null)}
                className="px-5 py-2.5 rounded-xl bg-[#231B34] text-gray-300 text-sm font-bold hover:bg-[#32264C]"
              >
                {lang === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
