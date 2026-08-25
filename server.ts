import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import {
  initDatabase,
  readDatabase,
  writeDatabase,
  getLeads,
  addLead,
  updateLeadStatus,
  addLeadNote,
  deleteLead,
} from './src/server/db';
import { DEFAULT_CONTENT, DEFAULT_THEME, DEFAULT_SECTIONS, DEFAULT_SEO, INITIAL_MEDIA, SAMPLE_LEADS } from './src/defaultData';

dotenv.config();

const app = express();
const PORT = 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const UPLOADS_DIR = path.join(process.cwd(), 'data', 'uploads');

// Ensure uploads folder exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Middlewares
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Serve user uploaded media
app.use('/uploads', express.static(UPLOADS_DIR));

// Initialize local DB
initDatabase();

// ----------------------------------------------------
// PUBLIC API ROUTES
// ----------------------------------------------------

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), brand: 'AL PACINO BROASTED' });
});

// Get public website content & settings
app.get('/api/state', (req, res) => {
  try {
    const db = readDatabase();
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
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Submit a new investor lead
app.post('/api/leads', async (req, res) => {
  try {
    const { fullName, phone, email, targetCity, hasProposedLocation, budgetRange, investmentInterest, notes } = req.body;

    if (!fullName || !phone || !targetCity || !budgetRange || !investmentInterest) {
      res.status(400).json({ success: false, error: 'يرجى تعبئة الحقول الأساسية المطلوبة' });
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
    res.status(500).json({ success: false, error: 'فشل في حفظ الطلب، يرجى المحاولة مرة أخرى' });
  }
});

// ----------------------------------------------------
// ADMIN AUTHENTICATION
// ----------------------------------------------------

app.post('/api/admin/auth/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    // Generate a simple timestamped session token
    const token = 'token_' + Buffer.from(`admin_${Date.now()}_${Math.random()}`).toString('base64');
    res.json({ success: true, token, user: { role: 'admin', name: 'Al Pacino SuperAdmin' } });
  } else {
    res.status(401).json({ success: false, error: 'كلمة المرور غير صحيحة' });
  }
});

// Auth helper middleware for protected admin routes
function authMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || (!authHeader.startsWith('Bearer token_') && authHeader !== `Bearer ${ADMIN_PASSWORD}`)) {
    res.status(401).json({ success: false, error: 'غير مصرح بالدخول' });
    return;
  }
  next();
}

// ----------------------------------------------------
// PROTECTED ADMIN API ROUTES
// ----------------------------------------------------

// Get all leads
app.get('/api/admin/leads', authMiddleware, async (req, res) => {
  try {
    const leads = await getLeads();
    res.json({ success: true, leads });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch leads' });
  }
});

// Update lead status
app.patch('/api/admin/leads/:id/status', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await updateLeadStatus(id, status);
    if (!updated) {
      res.status(404).json({ success: false, error: 'Lead not found' });
      return;
    }
    res.json({ success: true, lead: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update lead status' });
  }
});

// Add internal comment/note to lead
app.post('/api/admin/leads/:id/notes', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { author, comment } = req.body;
    if (!comment) {
      res.status(400).json({ success: false, error: 'Comment text is required' });
      return;
    }
    const note = await addLeadNote(id, author || 'المسؤول', comment);
    res.json({ success: true, note });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to add note' });
  }
});

// Delete lead
app.delete('/api/admin/leads/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const success = await deleteLead(id);
    res.json({ success });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete lead' });
  }
});

// Export leads as CSV
app.get('/api/admin/export-csv', authMiddleware, async (req, res) => {
  try {
    const leads = await getLeads();
    // Prepend UTF-8 BOM so Arabic letters render cleanly in Excel
    let csv = '\uFEFF';
    csv += 'المعرف,الاسم الكامل,رقم الجوال,البريد الإلكتروني,المدينة المستهدفة,هل يوجد موقع مقترح,الميزانية الاستثمارية,نوع الاهتمام,الحالة,تاريخ التقديم,الملاحظات\n';

    leads.forEach((l) => {
      const row = [
        `"${l.id}"`,
        `"${(l.fullName || '').replace(/"/g, '""')}"`,
        `"${(l.phone || '').replace(/"/g, '""')}"`,
        `"${(l.email || '').replace(/"/g, '""')}"`,
        `"${(l.targetCity || '').replace(/"/g, '""')}"`,
        l.hasProposedLocation ? '"نعم"' : '"لا"',
        `"${(l.budgetRange || '').replace(/"/g, '""')}"`,
        `"${(l.investmentInterest || '').replace(/"/g, '""')}"`,
        `"${l.status}"`,
        `"${new Date(l.createdAt).toLocaleString('ar-SA')}"`,
        `"${(l.notes || '').replace(/"/g, '""')}"`,
      ];
      csv += row.join(',') + '\n';
    });

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=alpacino-investor-leads-${Date.now()}.csv`);
    res.send(csv);
  } catch (error) {
    res.status(500).send('Error generating CSV');
  }
});

// Update CMS Content
app.put('/api/admin/content', authMiddleware, (req, res) => {
  try {
    const content = req.body;
    const updated = writeDatabase({ content });
    res.json({ success: true, content: updated.content });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update content' });
  }
});

// Update Theme & Brand
app.put('/api/admin/theme', authMiddleware, (req, res) => {
  try {
    const theme = req.body;
    const updated = writeDatabase({ theme });
    res.json({ success: true, theme: updated.theme });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update theme' });
  }
});

// Update Sections order and visibility
app.put('/api/admin/sections', authMiddleware, (req, res) => {
  try {
    const sections = req.body;
    const updated = writeDatabase({ sections });
    res.json({ success: true, sections: updated.sections });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update sections' });
  }
});

// Update SEO
app.put('/api/admin/seo', authMiddleware, (req, res) => {
  try {
    const seo = req.body;
    const updated = writeDatabase({ seo });
    res.json({ success: true, seo: updated.seo });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update SEO' });
  }
});

// Media Library: Upload image
app.post('/api/admin/media', authMiddleware, (req, res) => {
  try {
    const { title, category, type, dataUrl, externalUrl } = req.body;
    let finalUrl = externalUrl;

    if (dataUrl && dataUrl.startsWith('data:image')) {
      const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (matches) {
        const ext = matches[1] === 'svg+xml' ? 'svg' : matches[1];
        const base64Data = matches[2];
        const fileName = `upload_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
        const filePath = path.join(UPLOADS_DIR, fileName);
        fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
        finalUrl = `/uploads/${fileName}`;
      }
    }

    if (!finalUrl) {
      res.status(400).json({ success: false, error: 'No image data or URL provided' });
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

    const db = readDatabase();
    const updatedMedia = [newItem, ...db.media];
    writeDatabase({ media: updatedMedia });

    res.json({ success: true, media: newItem });
  } catch (error) {
    console.error('Error uploading media:', error);
    res.status(500).json({ success: false, error: 'Failed to upload media' });
  }
});

// Delete media item
app.delete('/api/admin/media/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const db = readDatabase();
    const filtered = db.media.filter((m) => m.id !== id);
    writeDatabase({ media: filtered });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete media' });
  }
});

// Reset database to default template
app.post('/api/admin/reset-defaults', authMiddleware, (req, res) => {
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
    writeDatabase(resetDb);
    res.json({ success: true, message: 'Database reset to initial template state successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to reset database' });
  }
});

// ----------------------------------------------------
// VITE / STATIC SERVING
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AL PACINO BROASTED Platform server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
