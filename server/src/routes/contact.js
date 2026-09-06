import express from 'express';
import { db } from '../db/index.js';
import { contactLimiter } from '../middleware/rateLimit.js';
import { contactSchema, sanitizeString } from '../middleware/validate.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/contact - Submit contact form with rate limit & anti-spam honeypot
router.post('/', contactLimiter, async (req, res) => {
  try {
    // 1. Check Honeypot: if bot filled website_hp, silently return success
    if (req.body.website_hp && req.body.website_hp.trim() !== '') {
      return res.json({
        success: true,
        message: 'Votre message a été envoyé avec succès.',
      });
    }

    // 2. Validate input schema
    const validation = contactSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.error.errors[0].message,
      });
    }

    const { name, email, phone, subject, message } = validation.data;

    // 3. Sanitize inputs
    const cleanName = sanitizeString(name);
    const cleanEmail = sanitizeString(email);
    const cleanPhone = phone ? sanitizeString(phone) : null;
    const cleanSubject = sanitizeString(subject);
    const cleanMessage = sanitizeString(message);

    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';

    // 4. Store in database
    await db.execute({
      sql: `INSERT INTO contact_messages (name, email, phone, subject, message, ip_address)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [cleanName, cleanEmail, cleanPhone, cleanSubject, cleanMessage, String(clientIp)],
    });

    return res.status(201).json({
      success: true,
      message: 'Votre message a été transmis avec succès au secrétariat du CNDS.',
    });
  } catch (err) {
    console.error('Erreur POST /contact:', err);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'enregistrement de votre message. Veuillez réessayer plus tard.',
    });
  }
});

// GET /api/contact - List contact messages (Admin Protected)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM contact_messages ORDER BY created_at DESC');
    return res.json({
      success: true,
      messages: result.rows,
    });
  } catch (err) {
    console.error('Erreur GET /contact:', err);
    return res.status(500).json({ success: false, message: 'Erreur lors de la récupération des messages' });
  }
});

export default router;
