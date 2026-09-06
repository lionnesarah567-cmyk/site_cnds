import express from 'express';
import crypto from 'crypto';
import { z } from 'zod';
import { db } from '../db/index.js';
import { sendWelcomeEmail, testSmtpConnection } from '../services/emailService.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

const subscribeSchema = z.object({
  email: z.string().email('Format d’adresse email invalide').max(100),
  lang: z.enum(['fr', 'rn', 'en']).default('fr'),
});

// POST /api/newsletter/subscribe - S'abonner aux actualités
router.post('/subscribe', async (req, res) => {
  try {
    const validation = subscribeSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.error.errors[0].message,
      });
    }

    const { email, lang } = validation.data;
    const normalizedEmail = email.trim().toLowerCase();

    // Vérifier si l'email existe déjà
    const existing = await db.execute({
      sql: 'SELECT id, is_active, unsubscribe_token FROM newsletter_subscribers WHERE email = ?',
      args: [normalizedEmail],
    });

    if (existing.rows.length > 0) {
      const subscriber = existing.rows[0];
      if (subscriber.is_active === 1) {
        const alreadyMessages = {
          fr: 'Vous êtes déjà abonné(e) à nos actualités avec cette adresse email.',
          rn: 'Mwamaze kwandikwa mu bakira amakuru kuri iyi email.',
          en: 'You are already subscribed to our updates with this email address.',
        };
        return res.status(200).json({
          success: true,
          alreadySubscribed: true,
          message: alreadyMessages[lang] || alreadyMessages.fr,
        });
      } else {
        // Réactiver l'abonnement
        await db.execute({
          sql: 'UPDATE newsletter_subscribers SET is_active = 1, lang = ? WHERE id = ?',
          args: [lang, subscriber.id],
        });

        sendWelcomeEmail(normalizedEmail, lang, subscriber.unsubscribe_token).catch(() => {});

        const reactivatedMessages = {
          fr: 'Votre abonnement aux actualités du CNDS a été réactivé avec succès !',
          rn: 'Ubusabe bwanyu bwakiriwe kandi bwasubiye gutangura neza !',
          en: 'Your subscription to CNDS updates has been successfully reactivated!',
        };
        return res.status(200).json({
          success: true,
          message: reactivatedMessages[lang] || reactivatedMessages.fr,
        });
      }
    }

    // Nouvel abonné
    const unsubscribeToken = crypto.randomBytes(24).toString('hex');

    await db.execute({
      sql: `INSERT INTO newsletter_subscribers (email, lang, unsubscribe_token, is_active)
            VALUES (?, ?, ?, 1)`,
      args: [normalizedEmail, lang, unsubscribeToken],
    });

    // Envoyer l'email de bienvenue en arrière-plan
    sendWelcomeEmail(normalizedEmail, lang, unsubscribeToken).catch((err) => {
      console.error('Notice welcome email:', err.message);
    });

    const successMessages = {
      fr: 'Merci ! Vous recevrez désormais les nouvelles actualités du CNDS par email.',
      rn: 'Murakoze ! Muzoza muraronka amakuru mashasha ya CNDS ku mbuga ya email.',
      en: 'Thank you! You will now receive new CNDS updates by email.',
    };

    return res.status(201).json({
      success: true,
      message: successMessages[lang] || successMessages.fr,
    });
  } catch (err) {
    console.error('Erreur POST /newsletter/subscribe:', err);
    return res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de l’enregistrement de votre abonnement.',
    });
  }
});

// GET /api/newsletter/unsubscribe - Se désabonner
router.get('/unsubscribe', async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).send('Jeton de désabonnement manquant.');
    }

    const result = await db.execute({
      sql: 'UPDATE newsletter_subscribers SET is_active = 0 WHERE unsubscribe_token = ?',
      args: [token],
    });

    const clientUrl = process.env.CLIENT_URL || 'https://site-cnds-bbce.vercel.app';

    return res.send(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>Désabonnement confirmé — CNDS Burundi</title>
        <style>
          body { font-family: -apple-system, sans-serif; background: #F8F7F4; color: #1E1C1A; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
          .card { background: #FFFFFF; padding: 40px; border-radius: 12px; border: 1px solid #E6E3DC; max-width: 480px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
          h1 { color: #A91E2C; font-size: 22px; margin-bottom: 12px; }
          p { color: #5C5852; font-size: 14.5px; line-height: 1.6; }
          .btn { display: inline-block; margin-top: 20px; background: #1E1C1A; color: #FFF; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Désabonnement Confirmé</h1>
          <p>Votre adresse email a été retirée de la liste de diffusion. Vous ne recevrez plus les notifications d’actualités du CNDS Burundi.</p>
          <a href="${clientUrl}" class="btn">Retour au site CNDS</a>
        </div>
      </body>
      </html>
    `);
  } catch (err) {
    console.error('Erreur GET /newsletter/unsubscribe:', err);
    return res.status(500).send('Une erreur est survenue lors du désabonnement.');
  }
});

// GET /api/newsletter/stats - Statistiques abonnés (Admin protégé)
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const totalResult = await db.execute('SELECT COUNT(*) as count FROM newsletter_subscribers');
    const activeResult = await db.execute('SELECT COUNT(*) as count FROM newsletter_subscribers WHERE is_active = 1');
    const listResult = await db.execute('SELECT email, lang, is_active, created_at FROM newsletter_subscribers ORDER BY created_at DESC LIMIT 50');

    return res.json({
      success: true,
      total: totalResult.rows[0].count,
      active: activeResult.rows[0].count,
      subscribers: listResult.rows,
    });
  } catch (err) {
    console.error('Erreur GET /newsletter/stats:', err);
    return res.status(500).json({ success: false, message: 'Erreur récupération statistiques' });
  }
});

// GET /api/newsletter/test-smtp?to=votre-email@gmail.com
router.get('/test-smtp', async (req, res) => {
  try {
    const to = req.query.to || 'infocndsburundi2011@gmail.com';
    const result = await testSmtpConnection(to);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
