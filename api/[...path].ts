import express from 'express';
import {
  readDatabaseAsync,
  writeDatabaseAsync,
  getLeads,
  addLead,
  updateLeadStatus,
  addLeadNote,
  deleteLead,
} from '../src/server/db.js';

import {
  DEFAULT_CONTENT,
  DEFAULT_THEME,
  DEFAULT_SECTIONS,
  DEFAULT_SEO,
  INITIAL_MEDIA,
  SAMPLE_LEADS,
} from '../src/defaultData.js';

const app = express();

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

function authMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const authHeader = req.headers.authorization;

  if (
    !authHeader ||
    (!authHeader.startsWith('Bearer token_') &&
      authHeader !== `Bearer ${ADMIN_PASSWORD}`)
  ) {
    res.status(401).json({
      success: false,
      error: 'غير مصرح بالدخول',
    });
    return;
  }

  next();
}

// ----------------------------------------------------
// HEALTH CHECK
// ----------------------------------------------------

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    brand: 'AL PACINO BROASTED',
    env: {
      hasSupabaseUrl: Boolean(process.env.SUPABASE_URL),
      hasServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      hasAnonKey: Boolean(process.env.SUPABASE_ANON_KEY),
      hasAdminPassword: Boolean(process.env.ADMIN_PASSWORD),
    },
  });
});

// ----------------------------------------------------
// PUBLIC API ROUTES
// ----------------------------------------------------

app.get('/api/state', async (req, res) => {
  try {
    const db = await readDatabaseAsync();

    res.json({
      success: true,
      content: db.content,
      theme: db.theme,
      sections: db.sections,
      seo: db.seo,
      media: db.media,
    });
  } catch (error) {
    console.error('Error reading state:', error);

    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

app.post('/api/leads', async (req, res) => {
  try {
    const {
      fullName,
      phone,
      email,
      targetCity,
      hasProposedLocation,
      budgetRange,
      investmentInterest,
      notes,
    } = req.body;

    if (!fullName || !phone || !targetCity || !budgetRange || !investmentInterest) {
      res.status(400).json({
        success: false,
        error: 'يرجى تعبئة الحقول الأساسية المطلوبة',
      });
      return;
    }

    const newLead = await addLead({
      fullName,
      phone,
      email: email || '',
      targetCity,
      hasProposedLocation: Boolean(hasProposedLocation),
      budgetRange,
      investmentInterest,
      notes: notes || '',
      source: 'موقع الاستثمار الرسمي',
    });

    res.status(201).json({
      success: true,
      message: 'تم استلام طلب الشراكة بنجاح، سيتواصل معك فريق الاستثمار قريباً.',
      lead: newLead,
    });
  } catch (error) {
    console.error('Error adding lead:', error);

    res.status(500).json({
      success: false,
      error: 'فشل في حفظ الطلب، يرجى المحاولة مرة أخرى',
    });
  }
});

// ----------------------------------------------------
// ADMIN AUTHENTICATION
// ----------------------------------------------------

app.post('/api/admin/auth/login', (req, res) => {
  const { password } = req.body;

  if (password === ADMIN_PASSWORD) {
    const token =
      'token_' +
      Buffer.from(`admin_${Date.now()}_${Math.random()}`).toString('base64');

    res.json({
      success: true,
      token,
      user: {
        role: 'admin',
        name: 'Al Pacino SuperAdmin',
      },
    });
  } else {
    res.status(401).json({
      success: false,
      error: 'كلمة المرور غير صحيحة',
    });
  }
});

// ----------------------------------------------------
// ADMIN LEADS
// ----------------------------------------------------

app.get('/api/admin/leads', authMiddleware, async (req, res) => {
  try {
    const leads = await getLeads();

    res.json({
      success: true,
      leads,
    });
  } catch (error) {
    console.error('Failed to fetch leads:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to fetch leads',
    });
  }
});

app.patch('/api/admin/leads/:id/status', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await updateLeadStatus(id, status);

    if (!updated) {
      res.status(404).json({
        success: false,
        error: 'Lead not found',
      });
      return;
    }

    res.json({
      success: true,
      lead: updated,
    });
  } catch (error) {
    console.error('Failed to update lead status:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to update lead status',
    });
  }
});

app.post('/api/admin/leads/:id/notes', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { author, comment } = req.body;

    if (!comment) {
      res.status(400).json({
        success: false,
        error: 'Comment text is required',
      });
      return;
    }

    const note = await addLeadNote(id, author || 'المسؤول', comment);

    res.json({
      success: true,
      note,
    });
  } catch (error) {
    console.error('Failed to add note:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to add note',
    });
  }
});

app.delete('/api/admin/leads/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const success = await deleteLead(id);

    res.json({
      success,
    });
  } catch (error) {
    console.error('Failed to delete lead:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to delete lead',
    });
  }
});

app.get('/api/admin/export-csv', authMiddleware, async (req, res) => {
  try {
    const leads = await getLeads();

    let csv = '\uFEFF';
    csv +=
      'المعرف,الاسم الكامل,رقم الجوال,البريد الإلكتروني,المدينة المستهدفة,هل يوجد موقع مقترح,الميزانية الاستثمارية,نوع الاهتمام,الحالة,تاريخ التقديم,الملاحظات\n';

    leads.forEach((l: any) => {
      const row = [
        `"${l.id}"`,
        `"${(l.fullName || '').replace(/"/g, '""')}"`,
        `"${(l.phone || '').replace(/"/g, '""')}"`,
        `"${(l.email || '').replace(/"/g, '""')}"`,
        `"${(l.targetCity || '').replace(/"/g, '""')}"`,
        l.hasProposedLocation ? '"نعم"' : '"لا"',
        `"${(l.budgetRange || '').replace(/"/g, '""')}"`,
        `"${(l.investmentInterest || '').replace(/"/g, '""')}"`,
        `"${l.status || ''}"`,
        `"${l.createdAt ? new Date(l.createdAt).toLocaleString('ar-SA') : ''}"`,
        `"${(l.notes || '').replace(/"/g, '""')}"`,
      ];

      csv += row.join(',') + '\n';
    });

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=alpacino-investor-leads-${Date.now()}.csv`
    );

    res.send(csv);
  } catch (error) {
    console.error('Error generating CSV:', error);

    res.status(500).send('Error generating CSV');
  }
});

// ----------------------------------------------------
// ADMIN CMS SETTINGS
// ----------------------------------------------------

app.put('/api/admin/content', authMiddleware, async (req, res) => {
  try {
    const content = req.body;

    const updated = await writeDatabaseAsync({
      content,
    });

    res.json({
      success: true,
      content: updated.content,
    });
  } catch (error: any) {
    console.error('Failed to update content:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to update content',
      details: error?.message || String(error),
    });
  }
});

app.put('/api/admin/theme', authMiddleware, async (req, res) => {
  try {
    const theme = req.body;

    const updated = await writeDatabaseAsync({
      theme,
    });

    res.json({
      success: true,
      theme: updated.theme,
    });
  } catch (error: any) {
    console.error('Failed to update theme:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to update theme',
      details: error?.message || String(error),
    });
  }
});

app.put('/api/admin/sections', authMiddleware, async (req, res) => {
  try {
    const sections = req.body;

    const updated = await writeDatabaseAsync({
      sections,
    });

    res.json({
      success: true,
      sections: updated.sections,
    });
  } catch (error: any) {
    console.error('Failed to update sections:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to update sections',
      details: error?.message || String(error),
    });
  }
});

app.put('/api/admin/seo', authMiddleware, async (req, res) => {
  try {
    const seo = req.body;

    const updated = await writeDatabaseAsync({
      seo,
    });

    res.json({
      success: true,
      seo: updated.seo,
    });
  } catch (error: any) {
    console.error('Failed to update SEO:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to update SEO',
      details: error?.message || String(error),
    });
  }
});

// ----------------------------------------------------
// ADMIN MEDIA
// ----------------------------------------------------

app.post('/api/admin/media', authMiddleware, async (req, res) => {
  try {
    const { title, category, type, dataUrl, externalUrl } = req.body;

    let finalUrl = externalUrl;

    // Vercel filesystem is not persistent.
    // For now we store uploaded image as dataUrl inside Supabase settings.
    // Later it is better to move media uploads to Supabase Storage.
    if (!finalUrl && dataUrl && dataUrl.startsWith('data:image')) {
      finalUrl = dataUrl;
    }

    if (!finalUrl) {
      res.status(400).json({
        success: false,
        error: 'No image data or URL provided',
      });
      return;
    }

    const newItem = {
      id: 'media-' + Date.now(),
      url: finalUrl,
      title: title || 'صورة جديدة',
      type: type || 'image',
      category: category || 'gallery',
      fileSize: 'محفوظ',
      uploadedAt: new Date().toISOString().split('T')[0],
    };

    const db = await readDatabaseAsync();
    const updatedMedia = [newItem, ...(db.media || [])];

    await writeDatabaseAsync({
      media: updatedMedia,
    });

    res.json({
      success: true,
      media: newItem,
    });
  } catch (error: any) {
    console.error('Error uploading media:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to upload media',
      details: error?.message || String(error),
    });
  }
});

app.delete('/api/admin/media/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const db = await readDatabaseAsync();
    const filtered = (db.media || []).filter((m: any) => m.id !== id);

    await writeDatabaseAsync({
      media: filtered,
    });

    res.json({
      success: true,
    });
  } catch (error: any) {
    console.error('Failed to delete media:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to delete media',
      details: error?.message || String(error),
    });
  }
});

// ----------------------------------------------------
// RESET DEFAULTS
// ----------------------------------------------------

app.post('/api/admin/reset-defaults', authMiddleware, async (req, res) => {
  try {
    const resetDb = {
      content: DEFAULT_CONTENT,
      theme: DEFAULT_THEME,
      sections: DEFAULT_SECTIONS,
      seo: DEFAULT_SEO,
      media: INITIAL_MEDIA,
      leads: SAMPLE_LEADS,
      lastUpdated: new Date().toISOString(),
    };

    await writeDatabaseAsync(resetDb);

    res.json({
      success: true,
      message: 'Database reset to initial template state successfully',
    });
  } catch (error: any) {
    console.error('Failed to reset database:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to reset database',
      details: error?.message || String(error),
    });
  }
});

export default app;