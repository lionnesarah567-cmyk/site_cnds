import express from 'express';
import slugify from 'slugify';
import { db } from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';
import { newsSchema, sanitizeString } from '../middleware/validate.js';

const router = express.Router();

// GET /api/news - List news with search & pagination
router.get('/', async (req, res) => {
  try {
    const { category, search, limit = 20, offset = 0 } = req.query;
    
    let sql = 'SELECT id, slug, title_fr, title_rn, summary_fr, summary_rn, category, image_url, published_at, views_count FROM news WHERE is_published = 1';
    const args = [];

    if (category && category !== 'all') {
      sql += ' AND category = ?';
      args.push(category);
    }

    if (search) {
      sql += ' AND (title_fr LIKE ? OR summary_fr LIKE ?)';
      args.push(`%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY published_at DESC LIMIT ? OFFSET ?';
    args.push(Number(limit), Number(offset));

    const result = await db.execute({ sql, args });

    const countResult = await db.execute('SELECT COUNT(*) as total FROM news WHERE is_published = 1');
    const total = countResult.rows[0].total;

    return res.json({
      success: true,
      total,
      news: result.rows,
    });
  } catch (err) {
    console.error('Erreur GET /news:', err);
    return res.status(500).json({ success: false, message: 'Erreur lors de la récupération des actualités' });
  }
});

// GET /api/news/:slug - Detail of one news item
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await db.execute({
      sql: 'SELECT * FROM news WHERE slug = ? AND is_published = 1',
      args: [slug],
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Article introuvable' });
    }

    // Increment view count asynchronously
    db.execute({
      sql: 'UPDATE news SET views_count = views_count + 1 WHERE slug = ?',
      args: [slug],
    }).catch((e) => console.error('Error incrementing views:', e));

    return res.json({
      success: true,
      news: result.rows[0],
    });
  } catch (err) {
    console.error('Erreur GET /news/:slug:', err);
    return res.status(500).json({ success: false, message: 'Erreur lors de la récupération de l\'article' });
  }
});

// POST /api/news - Create news (Admin Protected)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const validation = newsSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.error.errors[0].message,
      });
    }

    const {
      title_fr,
      title_rn,
      summary_fr,
      summary_rn,
      content_fr,
      content_rn,
      category,
      image_url,
      published_at,
    } = validation.data;

    // Generate unique slug
    let baseSlug = slugify(title_fr, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await db.execute({
        sql: 'SELECT id FROM news WHERE slug = ?',
        args: [slug],
      });
      if (existing.rows.length === 0) break;
      slug = `${baseSlug}-${counter++}`;
    }

    // Sanitize HTML fields to prevent stored XSS / evil scripts
    const cleanContentFr = sanitizeString(content_fr);
    const cleanContentRn = content_rn ? sanitizeString(content_rn) : null;

    const pubDate = published_at || new Date().toISOString();

    const insertResult = await db.execute({
      sql: `INSERT INTO news (slug, title_fr, title_rn, summary_fr, summary_rn, content_fr, content_rn, category, image_url, published_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        slug,
        title_fr,
        title_rn || null,
        summary_fr,
        summary_rn || null,
        cleanContentFr,
        cleanContentRn,
        category || 'Dialogue Social',
        image_url || null,
        pubDate,
      ],
    });

    return res.status(201).json({
      success: true,
      message: 'Actualité créée avec succès',
      id: Number(insertResult.lastInsertRowid),
      slug,
    });
  } catch (err) {
    console.error('Erreur POST /news:', err);
    return res.status(500).json({ success: false, message: 'Erreur lors de la création de l\'actualité' });
  }
});

// PUT /api/news/:id - Update news (Admin Protected)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const validation = newsSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.error.errors[0].message,
      });
    }

    const {
      title_fr,
      title_rn,
      summary_fr,
      summary_rn,
      content_fr,
      content_rn,
      category,
      image_url,
      published_at,
    } = validation.data;

    const cleanContentFr = sanitizeString(content_fr);
    const cleanContentRn = content_rn ? sanitizeString(content_rn) : null;

    await db.execute({
      sql: `UPDATE news 
            SET title_fr = ?, title_rn = ?, summary_fr = ?, summary_rn = ?, content_fr = ?, content_rn = ?, category = ?, image_url = ?, published_at = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?`,
      args: [
        title_fr,
        title_rn || null,
        summary_fr,
        summary_rn || null,
        cleanContentFr,
        cleanContentRn,
        category || 'Dialogue Social',
        image_url || null,
        published_at || new Date().toISOString(),
        id,
      ],
    });

    return res.json({
      success: true,
      message: 'Actualité mise à jour avec succès',
    });
  } catch (err) {
    console.error('Erreur PUT /news/:id:', err);
    return res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour de l\'actualité' });
  }
});

// DELETE /api/news/:id - Delete news (Admin Protected)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute({
      sql: 'DELETE FROM news WHERE id = ?',
      args: [id],
    });

    return res.json({
      success: true,
      message: 'Actualité supprimée avec succès',
    });
  } catch (err) {
    console.error('Erreur DELETE /news/:id:', err);
    return res.status(500).json({ success: false, message: 'Erreur lors de la suppression de l\'actualité' });
  }
});

export default router;
