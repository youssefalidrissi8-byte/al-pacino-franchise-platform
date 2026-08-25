import fs from 'fs';
import path from 'path';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ContentData, ThemeSettings, SectionConfig, SEOSettings, InvestorLead, MediaItem, LeadComment } from '../types';
import { DEFAULT_CONTENT, DEFAULT_THEME, DEFAULT_SECTIONS, DEFAULT_SEO, INITIAL_MEDIA, SAMPLE_LEADS } from '../defaultData';

export interface DatabaseSchema {
  content: ContentData;
  theme: ThemeSettings;
  sections: SectionConfig[];
  seo: SEOSettings;
  media: MediaItem[];
  leads: InvestorLead[];
  lastUpdated: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Optional Supabase client (lazy initialization)
let supabaseClient: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (url && key) {
    try {
      supabaseClient = createClient(url, key);
      console.log('Supabase client initialized successfully');
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
    }
  }
  return supabaseClient;
}

function getDefaultDatabase(): DatabaseSchema {
  return {
    content: DEFAULT_CONTENT,
    theme: DEFAULT_THEME,
    sections: DEFAULT_SECTIONS,
    seo: DEFAULT_SEO,
    media: INITIAL_MEDIA,
    leads: SAMPLE_LEADS,
    lastUpdated: new Date().toISOString(),
  };
}

export function initDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      const initial = getDefaultDatabase();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }

    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as DatabaseSchema;

    // Ensure all keys exist in case of schema additions
    const defaultDb = getDefaultDatabase();
    const merged: DatabaseSchema = {
      content: { ...defaultDb.content, ...(parsed.content || {}) },
      theme: { ...defaultDb.theme, ...(parsed.theme || {}) },
      sections: parsed.sections && parsed.sections.length > 0 ? parsed.sections : defaultDb.sections,
      seo: { ...defaultDb.seo, ...(parsed.seo || {}) },
      media: parsed.media && parsed.media.length > 0 ? parsed.media : defaultDb.media,
      leads: parsed.leads || defaultDb.leads,
      lastUpdated: parsed.lastUpdated || new Date().toISOString(),
    };

    return merged;
  } catch (error) {
    console.error('Error initializing database file, falling back to default:', error);
    return getDefaultDatabase();
  }
}

export function readDatabase(): DatabaseSchema {
  return initDatabase();
}

export function writeDatabase(data: Partial<DatabaseSchema>): DatabaseSchema {
  const current = readDatabase();
  const updated: DatabaseSchema = {
    ...current,
    ...data,
    lastUpdated: new Date().toISOString(),
  };

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to database file:', error);
  }

  return updated;
}

// Leads operations
export async function getLeads(): Promise<InvestorLead[]> {
  const db = readDatabase();
  return db.leads;
}

export async function addLead(leadData: Omit<InvestorLead, 'id' | 'createdAt' | 'status' | 'adminComments'>): Promise<InvestorLead> {
  const db = readDatabase();
  const newLead: InvestorLead = {
    ...leadData,
    id: 'lead-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    createdAt: new Date().toISOString(),
    status: 'new',
    adminComments: [],
  };

  const updatedLeads = [newLead, ...db.leads];
  writeDatabase({ leads: updatedLeads });

  // Optional: Async push to Supabase if connected
  const sb = getSupabase();
  if (sb) {
    try {
      await sb.from('investor_leads').insert([{
        id: newLead.id,
        full_name: newLead.fullName,
        phone: newLead.phone,
        email: newLead.email,
        target_city: newLead.targetCity,
        has_proposed_location: newLead.hasProposedLocation,
        budget_range: newLead.budgetRange,
        investment_interest: newLead.investmentInterest,
        notes: newLead.notes || '',
        status: newLead.status,
        created_at: newLead.createdAt,
      }]);
    } catch (e) {
      console.warn('Supabase sync skipped/failed:', e);
    }
  }

  return newLead;
}

export async function updateLeadStatus(id: string, status: InvestorLead['status']): Promise<InvestorLead | null> {
  const db = readDatabase();
  const leadIndex = db.leads.findIndex((l) => l.id === id);
  if (leadIndex === -1) return null;

  db.leads[leadIndex].status = status;
  writeDatabase({ leads: db.leads });
  return db.leads[leadIndex];
}

export async function addLeadNote(id: string, author: string, comment: string): Promise<LeadComment | null> {
  const db = readDatabase();
  const leadIndex = db.leads.findIndex((l) => l.id === id);
  if (leadIndex === -1) return null;

  const newComment: LeadComment = {
    id: 'note-' + Date.now(),
    author: author || 'المسؤول',
    comment,
    createdAt: new Date().toISOString(),
  };

  if (!db.leads[leadIndex].adminComments) {
    db.leads[leadIndex].adminComments = [];
  }

  db.leads[leadIndex].adminComments.push(newComment);
  writeDatabase({ leads: db.leads });
  return newComment;
}

export async function deleteLead(id: string): Promise<boolean> {
  const db = readDatabase();
  const filtered = db.leads.filter((l) => l.id !== id);
  if (filtered.length === db.leads.length) return false;
  writeDatabase({ leads: filtered });
  return true;
}
