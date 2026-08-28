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

// ط°ط§ظƒط±ط© ظ…ط­ظ„ظٹط© ظ…ط¤ظ‚طھط© ظƒط§ط­طھظٹط§ط·
let memoryDb = {
  content: DEFAULT_CONTENT,
  theme: DEFAULT_THEME,
  sections: DEFAULT_SECTIONS,
  seo: DEFAULT_SEO,
  media: INITIAL_MEDIA,
  leads: SAMPLE_LEADS,
};

// ----------------------------------------------------
// 1. ظ‚ط±ط§ط،ط© ظˆط­ظپط¸ ط¥ط¹ط¯ط§ط¯ط§طھ ط§ظ„ظ…ظˆظ‚ط¹ ظپظ€ Supabase CMS
// ----------------------------------------------------

export async function readDatabaseAsync() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (!error && data) {
        if (data.content && Object.keys(data.content).length > 0) {
          memoryDb.content = data.content;
        }

        if (data.theme && Object.keys(data.theme).length > 0) {
          memoryDb.theme = data.theme;
        }

        if (data.sections && Object.keys(data.sections).length > 0) {
          memoryDb.sections = data.sections;
        }

        if (data.seo && Object.keys(data.seo).length > 0) {
          memoryDb.seo = data.seo;
        }

        if (data.media && Array.isArray(data.media) && data.media.length > 0) {
          memoryDb.media = data.media;
        }
      } else if (error) {
        console.error('Error reading settings from Supabase:', error.message);
      }
    } catch (err) {
      console.error('Error reading settings from Supabase:', err);
    }
  } else {
    console.warn('Supabase client is not configured. Using memory database.');
  }

  return memoryDb;
}

export function readDatabase() {
  return memoryDb;
}

export async function writeDatabaseAsync(updateData: any) {
  memoryDb = {
    ...memoryDb,
    ...updateData,
  };

  if (supabase) {
    try {
      const { error } = await supabase.from('settings').upsert({
        id: 1,
        content: memoryDb.content,
        theme: memoryDb.theme,
        sections: memoryDb.sections,
        seo: memoryDb.seo,
        media: memoryDb.media,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.error('â‌Œ ط®ط·ط£ ظپظٹ ط­ظپط¸ ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ ظپظ€ Supabase:', error.message);
      } else {
        console.log('âœ… طھظ… ط­ظپط¸ طھط¹ط¯ظٹظ„ط§طھ ط§ظ„ط¯ط§ط´ط¨ظˆط±ط¯ ظپظ€ Supabase ط¨ظ†ط¬ط§ط­!');
      }
    } catch (err) {
      console.error('â‌Œ ط®ط·ط£ ظپظٹ ط­ظپط¸ ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ ظپظ€ Supabase:', err);
    }
  } else {
    console.warn('Supabase client is not configured. Changes saved only in memory.');
  }

  return memoryDb;
}

export function writeDatabase(updateData: any) {
  writeDatabaseAsync(updateData);
  return memoryDb;
}

// ----------------------------------------------------
// 2. ط¥ط¯ط§ط±ط© ط·ظ„ط¨ط§طھ ط§ظ„ظ…ط³طھط«ظ…ط±ظٹظ† Leads
// ----------------------------------------------------

export async function addLead(leadData: any) {
  const newLead = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    ...leadData,
    status: 'ط¬ط¯ظٹط¯',
  };

  if (supabase) {
    try {
      const { error } = await supabase.from('leads').insert([
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
          status: 'ط¬ط¯ظٹط¯',
        },
      ]);

      if (error) {
        console.error('â‌Œ ط®ط·ط£ ط­ظپط¸ ط§ظ„ط­ط¬ط² ظپظ€ Supabase:', error.message);
      } else {
        console.log('âœ… طھظ… ط­ظپط¸ ط§ظ„ط­ط¬ط² ظپظ€ Supabase!');
      }
    } catch (err) {
      console.error('â‌Œ ط®ط·ط£ ط­ظپط¸ ط§ظ„ط­ط¬ط²:', err);
    }
  } else {
    memoryDb.leads = [newLead, ...memoryDb.leads];
  }

  return newLead;
}

export async function getLeads() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
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
      }

      if (error) {
        console.error('Error fetching leads from Supabase:', error.message);
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
    try {
      const { error } = await supabase.from('leads').update({ status }).eq('id', id);

      if (error) {
        console.error('Error updating lead status:', error.message);
      }
    } catch (err) {
      console.error('Error updating lead status:', err);
    }
  }

  memoryDb.leads = memoryDb.leads.map((lead: any) =>
    lead.id === id ? { ...lead, status } : lead
  );

  return { id, status };
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
  if (supabase) {
    try {
      const { error } = await supabase.from('leads').delete().eq('id', id);

      if (error) {
        console.error('Error deleting lead:', error.message);
        return false;
      }
    } catch (err) {
      console.error('Error deleting lead:', err);
      return false;
    }
  }

  memoryDb.leads = memoryDb.leads.filter((lead: any) => lead.id !== id);

  return true;
}
