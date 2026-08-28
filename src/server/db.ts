import { createClient } from '@supabase/supabase-js';
import {
  DEFAULT_CONTENT,
  DEFAULT_THEME,
  DEFAULT_SECTIONS,
  DEFAULT_SEO,
  INITIAL_MEDIA,
  SAMPLE_LEADS,
} from '../defaultData.js';

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  'https://kaipmnlmrztbgbumocau.supabase.co';

const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  '';

export const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

type MemoryDb = {
  content: any;
  theme: any;
  sections: any;
  seo: any;
  media: any[];
  leads: any[];
};

let memoryDb: MemoryDb = {
  content: DEFAULT_CONTENT,
  theme: DEFAULT_THEME,
  sections: DEFAULT_SECTIONS,
  seo: DEFAULT_SEO,
  media: INITIAL_MEDIA,
  leads: SAMPLE_LEADS,
};

function hasObjectData(value: any) {
  return value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length > 0;
}

function hasArrayData(value: any) {
  return Array.isArray(value) && value.length > 0;
}

// ----------------------------------------------------
// Read website settings from Supabase
// ----------------------------------------------------

export async function readDatabaseAsync() {
  if (!supabase) {
    console.warn('Supabase client is not configured. Using default memory database.');
    return memoryDb;
  }

  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) {
      console.error('Error reading settings from Supabase:', error.message);
      return memoryDb;
    }

    if (!data) {
      return memoryDb;
    }

    if (hasObjectData(data.content)) {
      memoryDb.content = data.content;
    }

    if (hasObjectData(data.theme)) {
      memoryDb.theme = data.theme;
    }

    if (hasArrayData(data.sections)) {
      memoryDb.sections = data.sections;
    }

    if (hasObjectData(data.seo)) {
      memoryDb.seo = data.seo;
    }

    if (hasArrayData(data.media)) {
      memoryDb.media = data.media;
    }

    return memoryDb;
  } catch (err) {
    console.error('Error reading settings from Supabase:', err);
    return memoryDb;
  }
}

export function readDatabase() {
  return memoryDb;
}

// ----------------------------------------------------
// Save website settings to Supabase
// ----------------------------------------------------

export async function writeDatabaseAsync(updateData: any) {
  memoryDb = {
    ...memoryDb,
    ...updateData,
  };

  if (!supabase) {
    throw new Error(
      'Supabase client is not configured. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel.'
    );
  }

  try {
    const { error } = await supabase.from('settings').upsert(
      {
        id: 1,
        content: memoryDb.content,
        theme: memoryDb.theme,
        sections: memoryDb.sections,
        seo: memoryDb.seo,
        media: memoryDb.media,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'id',
      }
    );

    if (error) {
      console.error('Supabase save error:', error.message);
      throw error;
    }

    console.log('Dashboard changes saved successfully in Supabase.');
    return memoryDb;
  } catch (err) {
    console.error('Failed to save dashboard changes in Supabase:', err);
    throw err;
  }
}

export function writeDatabase(updateData: any) {
  memoryDb = {
    ...memoryDb,
    ...updateData,
  };

  writeDatabaseAsync(updateData).catch((err) => {
    console.error('Async save failed:', err);
  });

  return memoryDb;
}

// ----------------------------------------------------
// Leads management
// ----------------------------------------------------

export async function addLead(leadData: any) {
  const newLead = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    ...leadData,
    status: 'جديد',
  };

  if (!supabase) {
    memoryDb.leads = [newLead, ...memoryDb.leads];
    return newLead;
  }

  try {
    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          full_name: leadData.fullName || leadData.full_name || '',
          phone: leadData.phone || '',
          email: leadData.email || '',
          target_city: leadData.targetCity || leadData.target_city || '',
          has_proposed_location: Boolean(
            leadData.hasProposedLocation || leadData.has_proposed_location
          ),
          budget_range: leadData.budgetRange || leadData.budget_range || '',
          investment_interest:
            leadData.investmentInterest || leadData.investment_interest || '',
          notes: leadData.notes || '',
          status: 'جديد',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase lead insert error:', error.message);
      throw error;
    }

    if (data) {
      return {
        id: data.id,
        fullName: data.full_name,
        phone: data.phone,
        email: data.email,
        targetCity: data.target_city,
        hasProposedLocation: data.has_proposed_location,
        budgetRange: data.budget_range,
        investmentInterest: data.investment_interest,
        notes: data.notes,
        status: data.status,
        createdAt: data.created_at,
      };
    }

    return newLead;
  } catch (err) {
    console.error('Failed to save lead in Supabase:', err);
    throw err;
  }
}

export async function getLeads() {
  if (!supabase) {
    return memoryDb.leads;
  }

  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching leads from Supabase:', error.message);
      return memoryDb.leads;
    }

    if (!data) {
      return memoryDb.leads;
    }

    return data.map((item: any) => ({
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
      createdAt: item.created_at,
    }));
  } catch (err) {
    console.error('Error fetching leads:', err);
    return memoryDb.leads;
  }
}

export function initDatabase() {
  readDatabaseAsync()
    .then(() => {
      console.log('Database initialized and synced with Supabase settings.');
    })
    .catch((err) => {
      console.error('Database initialization failed:', err);
    });
}

export async function updateLeadStatus(id: string, status: string) {
  if (!supabase) {
    memoryDb.leads = memoryDb.leads.map((lead: any) =>
      String(lead.id) === String(id) ? { ...lead, status } : lead
    );

    return { id, status };
  }

  try {
    const { error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating lead status:', error.message);
      throw error;
    }

    memoryDb.leads = memoryDb.leads.map((lead: any) =>
      String(lead.id) === String(id) ? { ...lead, status } : lead
    );

    return { id, status };
  } catch (err) {
    console.error('Error updating lead status:', err);
    throw err;
  }
}

export async function addLeadNote(id: string, author: string, comment: string) {
  const note = {
    id: 'note-' + Date.now(),
    leadId: id,
    author,
    comment,
    date: new Date().toISOString(),
  };

  return note;
}

export async function deleteLead(id: string) {
  if (!supabase) {
    memoryDb.leads = memoryDb.leads.filter((lead: any) => String(lead.id) !== String(id));
    return true;
  }

  try {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting lead:', error.message);
      throw error;
    }

    memoryDb.leads = memoryDb.leads.filter((lead: any) => String(lead.id) !== String(id));

    return true;
  } catch (err) {
    console.error('Error deleting lead:', err);
    throw err;
  }
}