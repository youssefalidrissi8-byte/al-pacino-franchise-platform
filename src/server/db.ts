import { createClient } from '@supabase/supabase-js';

// إعداد الاتصال بـ Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://kaipmnlmrztbgbumocau.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

export const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// قاعدة بيانات محلية مؤقتة فـ الذاكرة
let localLeads: any[] = [];

export async function addLead(leadData: any) {
  const newLead = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    ...leadData,
    status: 'جديد'
  };

  localLeads.push(newLead);

  // ⚡ الإرسال المباشر لـ Supabase أونلاين
  if (supabase) {
    try {
      const { data, error } = await supabase.from('leads').insert([
        {
          full_name: leadData.fullName || leadData.full_name || '',
          phone: leadData.phone || '',
          email: leadData.email || '',
          target_city: leadData.targetCity || leadData.target_city || '',
          has_proposed_location: Boolean(leadData.hasProposedLocation || leadData.has_proposed_location),
          budget_range: leadData.budgetRange || leadData.budget_range || '',
          investment_interest: leadData.investmentInterest || leadData.investment_interest || '',
          notes: leadData.notes || '',
          status: 'جديد'
        }
      ]);

      if (error) {
        console.error('❌ خطأ Supabase:', error.message);
      } else {
        console.log('✅ تم تسجيل الطلب بنجاح فـ Supabase!');
      }
    } catch (err) {
      console.error('❌ فشل الاتصال بـ Supabase:', err);
    }
  } else {
    console.warn('⚠️ مفاتيح Supabase غير متوفرة فـ متغيرات البيئة');
  }

  return newLead;
}

export async function getLeads() {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        return data.map(item => ({
          id: item.id,
          fullName: item.full_name,
          phone: item.phone,
          email: item.email,
          targetCity: item.target_city,
          hasProposedLocation: item.has_proposed_location,
          budgetRange: item.budget_range,
          investmentInterest: item.investment_interest,
          notes: item.notes,
          status: item.status,
          createdAt: item.created_at
        }));
      }
    } catch (e) {
      console.error('Error fetching from Supabase:', e);
    }
  }
  return localLeads;
}

export function initDatabase() {
  console.log('Database initialized');
}

export function readDatabase() {
  return { leads: localLeads };
}

export function writeDatabase(data: any) {
  return data;
}

export async function updateLeadStatus(id: string, status: string) {
  if (supabase) {
    await supabase.from('leads').update({ status }).eq('id', id);
  }
  const lead = localLeads.find(l => l.id === id);
  if (lead) lead.status = status;
  return lead;
}

export async function addLeadNote(id: string, author: string, comment: string) {
  return { id, author, comment, date: new Date().toISOString() };
}

export async function deleteLead(id: string) {
  if (supabase) {
    await supabase.from('leads').delete().eq('id', id);
  }
  localLeads = localLeads.filter(l => l.id !== id);
  return true;
}