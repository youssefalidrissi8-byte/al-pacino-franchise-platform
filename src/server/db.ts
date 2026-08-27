import { createClient } from '@supabase/supabase-js';
import { DEFAULT_CONTENT, DEFAULT_THEME, DEFAULT_SECTIONS, DEFAULT_SEO, INITIAL_MEDIA, SAMPLE_LEADS } from '../defaultData';

const supabaseUrl = process.env.SUPABASE_URL || 'https://kaipmnlmrztbgbumocau.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

export const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// ذاكرة محلية مؤقتة كاحتياط
let memoryDb = {
  content: DEFAULT_CONTENT,
  theme: DEFAULT_THEME,
  sections: DEFAULT_SECTIONS,
  seo: DEFAULT_SEO,
  media: INITIAL_MEDIA,
  leads: SAMPLE_LEADS
};

// ----------------------------------------------------
// 1. قراءة وحفظ إعدادات الموقع فـ Supabase (CMS)
// ----------------------------------------------------

export async function readDatabaseAsync() {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('settings').select('*').eq('id', 1).single();
      if (!error && data) {
        if (data.content && Object.keys(data.content).length > 0) memoryDb.content = data.content;
        if (data.theme && Object.keys(data.theme).length > 0) memoryDb.theme = data.theme;
        if (data.seo && Object.keys(data.seo).length > 0) memoryDb.seo = data.seo;
        if (data.media && Array.isArray(data.media) && data.media.length > 0) memoryDb.media = data.media;
      }
    } catch (err) {
      console.error('Error reading settings from Supabase:', err);
    }
  }
  return memoryDb;
}

export function readDatabase() {
  return memoryDb;
}

export async function writeDatabaseAsync(updateData: any) {
  memoryDb = { ...memoryDb, ...updateData };

  if (supabase) {
    try {
      await supabase.from('settings').upsert({
        id: 1,
        content: memoryDb.content,
        theme: memoryDb.theme,
        seo: memoryDb.seo,
        media: memoryDb.media,
        updated_at: new Date().toISOString()
      });
      console.log('✅ تم حفظ تعديلات الداشبورد فـ Supabase بنجاح!');
    } catch (err) {
      console.error('❌ خطأ في حفظ الإعدادات فـ Supabase:', err);
    }
  }
  return memoryDb;
}

export function writeDatabase(updateData: any) {
  writeDatabaseAsync(updateData);
  return memoryDb;
}

// ----------------------------------------------------
// 2. إدارة طلبات المستثمرين (Leads)
// ----------------------------------------------------

export async function addLead(leadData: any) {
  const newLead = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    ...leadData,
    status: 'جديد'
  };

  if (supabase) {
    try {
      await supabase.from('leads').insert([
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
      console.log('✅ تم حفظ الحجز فـ Supabase!');
    } catch (err) {
      console.error('❌ خطأ حفظ الحجز:', err);
    }
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
      console.error('Error fetching leads:', e);
    }
  }
  return memoryDb.leads;
}

export function initDatabase() {
  readDatabaseAsync();
  console.log('Database initialized and synced with Supabase settings');
}

export async function updateLeadStatus(id: string, status: string) {
  if (supabase) {
    await supabase.from('leads').update({ status }).eq('id', id);
  }
  return { id, status };
}

export async function addLeadNote(id: string, author: string, comment: string) {
  return { id, author, comment, date: new Date().toISOString() };
}

export async function deleteLead(id: string) {
  if (supabase) {
    await supabase.from('leads').delete().eq('id', id);
  }
  return true;
}