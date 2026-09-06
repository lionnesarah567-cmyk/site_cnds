import nodemailer from 'nodemailer';
import { db } from '../db/index.js';

// Configuration du transporteur d'email
function getTransporter() {
  const service = process.env.SMTP_SERVICE;
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (service && user && pass) {
    return nodemailer.createTransport({
      service,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
    });
  }

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
    });
  }
  return null;
}

const FROM_EMAIL = process.env.SMTP_FROM || 'CNDS Burundi <no-reply@cndsburundi.bi>';
const CLIENT_URL = process.env.CLIENT_URL || 'https://site-cnds-bbce.vercel.app';
const API_URL = process.env.API_URL || '';

/**
 * Génère le modèle HTML trilingue de notification d'une nouvelle actualité
 */
function generateNewsEmailHtml({ title, summary, slug, lang, unsubscribeToken }) {
  const articleUrl = slug ? `${CLIENT_URL}/actualites/${slug}` : `${CLIENT_URL}/actualites`;
  const unsubscribeUrl = `${API_URL || CLIENT_URL}/api/newsletter/unsubscribe?token=${unsubscribeToken}`;

  const texts = {
    fr: {
      preheader: slug ? 'Nouvelle publication officielle du CNDS Burundi' : 'Bienvenue sur le réseau d’information du CNDS Burundi',
      badge: slug ? 'Actualité Officielle' : 'Bienvenue',
      button: slug ? 'Lire l’article complet' : 'Découvrir les actualités',
      slogan: '« Le dialogue social au service de la paix sociale en milieu du travail »',
      footerNotice: 'Vous recevez cet email car vous êtes abonné(e) aux actualités officielles du Comité National de Dialogue Social (CNDS) du Burundi.',
      unsubscribe: 'Se désabonner de la newsletter',
    },
    rn: {
      preheader: slug ? 'Amakuru mashasha ava muri CNDS Burundi' : 'Murakaza neza muri CNDS Burundi',
      badge: slug ? 'Amakuru ya CNDS' : 'Kaze Neza',
      button: slug ? 'Soma inkuru yose' : 'Raba amakuru yose',
      slogan: '« Ibiganiro mu bakozi ku bw’amahoro arama mu kazi »',
      footerNotice: 'Mwakiriye iyi baruwa kuko mwanditse ubusabe bwo kuronka amakuru ya Komite Nserukiragihugu y’Ibiganiro mu Bakozi (CNDS).',
      unsubscribe: 'Guhagarika kwakira amakuru',
    },
    en: {
      preheader: slug ? 'New official update from CNDS Burundi' : 'Welcome to CNDS Burundi Information Network',
      badge: slug ? 'Official News' : 'Welcome',
      button: slug ? 'Read Full Article' : 'Explore News & Updates',
      slogan: '“Social dialogue for lasting social peace in the workplace”',
      footerNotice: 'You are receiving this email because you subscribed to updates from the National Committee for Social Dialogue (CNDS) of Burundi.',
      unsubscribe: 'Unsubscribe from newsletter',
    },
  };

  const t = texts[lang] || texts.fr;

  return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8F7F4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E1C1A;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F8F7F4; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #E6E3DC; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          
          <!-- Header CNDS -->
          <tr>
            <td style="background-color: #1E1C1A; padding: 26px 30px; text-align: center;">
              <p style="margin: 0 0 6px 0; color: #C29B38; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: 700;">
                République du Burundi
              </p>
              <h1 style="margin: 0; color: #FFFFFF; font-size: 20px; font-weight: 700; letter-spacing: 0.5px;">
                CNDS BURUNDI
              </h1>
              <p style="margin: 4px 0 0 0; color: #A8A59E; font-size: 11px;">
                Comité National de Dialogue Social
              </p>
            </td>
          </tr>

          <!-- Banner Badge -->
          <tr>
            <td style="padding: 24px 30px 0 30px;">
              <span style="display: inline-block; background-color: #EBF3ED; color: #1E6B37; font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 4px 10px; border-radius: 20px; border: 1px solid rgba(30,107,55,0.2);">
                ${t.badge}
              </span>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 16px 30px 24px 30px;">
              <h2 style="margin: 0 0 14px 0; color: #1E1C1A; font-size: 20px; line-height: 1.4; font-weight: 700;">
                ${title}
              </h2>
              <p style="margin: 0 0 24px 0; color: #5C5852; font-size: 14.5px; line-height: 1.6;">
                ${summary}
              </p>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="border-radius: 6px; background-color: #A91E2C;">
                    <a href="${articleUrl}" target="_blank" style="display: inline-block; padding: 12px 24px; color: #FFFFFF; font-size: 13px; font-weight: 700; text-decoration: none; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.5px;">
                      ${t.button} &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Slogan divider -->
          <tr>
            <td style="padding: 16px 30px; background-color: #F8F7F4; border-top: 1px solid #E6E3DC; border-bottom: 1px solid #E6E3DC; text-align: center;">
              <p style="margin: 0; font-style: italic; color: #736E65; font-size: 12px;">
                ${t.slogan}
              </p>
            </td>
          </tr>

          <!-- Footer & Unsubscribe -->
          <tr>
            <td style="padding: 20px 30px; text-align: center; color: #8C877D; font-size: 11px; line-height: 1.5;">
              <p style="margin: 0 0 8px 0;">
                ${t.footerNotice}
              </p>
              <p style="margin: 0;">
                <a href="${unsubscribeUrl}" style="color: #A91E2C; text-decoration: underline;">
                  ${t.unsubscribe}
                </a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Envoie une notification à tous les abonnés actifs lors de la publication d'un nouvel article
 */
export async function notifySubscribersAboutNewArticle(article) {
  try {
    const result = await db.execute({
      sql: 'SELECT email, lang, unsubscribe_token FROM newsletter_subscribers WHERE is_active = 1',
    });

    const subscribers = result.rows || [];
    if (subscribers.length === 0) {
      console.log('ℹ️ Newsletter : Aucun abonné actif pour le moment.');
      return { total: 0, sent: 0 };
    }

    console.log(`📬 Newsletter : Envoi de la notification pour "${article.title_fr}" à ${subscribers.length} abonné(s)...`);

    const transporter = getTransporter();

    let sentCount = 0;

    for (const sub of subscribers) {
      const subLang = sub.lang || 'fr';
      
      // Choix du titre et résumé selon la langue de l'abonné
      let title = article.title_fr;
      let summary = article.summary_fr;

      if (subLang === 'rn' && article.title_rn) {
        title = article.title_rn;
        summary = article.summary_rn || article.summary_fr;
      } else if (subLang === 'en' && article.title_en) {
        title = article.title_en;
        summary = article.summary_en || article.summary_fr;
      }

      const subjectMap = {
        fr: `CNDS Burundi — Nouvelle actualité : ${title}`,
        rn: `CNDS Burundi — Amakuru mashasha : ${title}`,
        en: `CNDS Burundi — New Update: ${title}`,
      };

      const subject = subjectMap[subLang] || subjectMap.fr;

      const html = generateNewsEmailHtml({
        title,
        summary,
        slug: article.slug,
        lang: subLang,
        unsubscribeToken: sub.unsubscribe_token,
      });

      if (transporter) {
        try {
          await transporter.sendMail({
            from: FROM_EMAIL,
            to: sub.email,
            subject,
            html,
          });
          sentCount++;
        } catch (mailErr) {
          console.error(`❌ Échec d'envoi à ${sub.email}:`, mailErr.message);
        }
      } else {
        // Mode simulation (quand pas de SMTP configuré)
        console.log(`📨 [Simulation Email CNDS] À: ${sub.email} (${subLang.toUpperCase()}) | Objet: "${subject}" | Lien: ${CLIENT_URL}/actualites/${article.slug}`);
        sentCount++;
      }
    }

    console.log(`✅ Newsletter : ${sentCount}/${subscribers.length} notification(s) envoyée(s) avec succès.`);
    return { total: subscribers.length, sent: sentCount };
  } catch (err) {
    console.error('❌ Erreur lors de l’envoi de la newsletter:', err);
    return { total: 0, sent: 0, error: err.message };
  }
}

/**
 * Envoie un email de confirmation de bienvenue à un nouvel abonné
 */
export async function sendWelcomeEmail(email, lang, unsubscribeToken) {
  const transporter = getTransporter();
  const subLang = ['fr', 'rn', 'en'].includes(lang) ? lang : 'fr';

  const welcomeSubjects = {
    fr: 'Confirmation d’abonnement — CNDS Burundi',
    rn: 'Kwakira ubusabe bwo kuronka amakuru — CNDS Burundi',
    en: 'Subscription Confirmation — CNDS Burundi',
  };

  const welcomeHtml = generateNewsEmailHtml({
    title: subLang === 'en' ? 'Welcome to CNDS Burundi Updates' : (subLang === 'rn' ? 'Murakaza neza mu bakira amakuru ya CNDS' : 'Bienvenue aux actualités du CNDS Burundi'),
    summary: subLang === 'en'
      ? 'Your subscription is now active. You will receive an email notification whenever new official announcements, decrees, or social dialogue reports are published.'
      : (subLang === 'rn'
        ? 'Ubusabe bwanyu bwakiriwe. Muzoza muraronka ubutumwa ku mbuga ya email igihe cose hasohotse amakuru mashasha canke amategeko mashasha ya CNDS.'
        : 'Votre abonnement est désormais actif. Vous recevrez une notification par email dès que de nouvelles actualités officielles, communiqués ou rapports du CNDS seront publiés.'),
    slug: '',
    lang: subLang,
    unsubscribeToken,
  });

  if (transporter) {
    try {
      await transporter.sendMail({
        from: FROM_EMAIL,
        to: email,
        subject: welcomeSubjects[subLang],
        html: welcomeHtml,
      });
    } catch (err) {
      console.error('Erreur envoi email bienvenue:', err.message);
    }
  } else {
    console.log(`📨 [Simulation Email Bienvenue CNDS] À: ${email} (${subLang.toUpperCase()}) | Sujet: "${welcomeSubjects[subLang]}"`);
  }
}
