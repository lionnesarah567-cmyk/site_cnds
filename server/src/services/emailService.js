import nodemailer from 'nodemailer';
import { db } from '../db/index.js';

function cleanEnv(val) {
  if (!val) return undefined;
  return String(val).replace(/^["']|["']$/g, '').trim();
}

export function getFromEmail() {
  const raw = process.env.SMTP_FROM || 'CNDS Burundi <no-reply@cndsburundi.bi>';
  return cleanEnv(raw);
}

// Configuration du transporteur d'email
function getTransporter() {
  const service = cleanEnv(process.env.SMTP_SERVICE);
  const host = cleanEnv(process.env.SMTP_HOST);
  const rawPort = cleanEnv(process.env.SMTP_PORT);
  const user = cleanEnv(process.env.SMTP_USER);
  const pass = cleanEnv(process.env.SMTP_PASS);

  if (!user || !pass) return null;

  // 1. Spécial Gmail : Toujours forcer le port 465 SSL car Railway bloque systématiquement le port 587
  const isGmail = (service && service.toLowerCase() === 'gmail') || (host && host.toLowerCase().includes('gmail'));
  if (isGmail) {
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });
  }

  // 2. Service prédéfini autre que Gmail
  if (service) {
    return nodemailer.createTransport({
      service,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 8000,
    });
  }

  // 3. Serveur SMTP personnalisé
  if (host) {
    const port = Number(rawPort) || 465;
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 8000,
    });
  }

  return null;
}

/**
 * Envoi direct via l'API REST HTTPS de Brevo (Port 443 - Garanti contre le blocage des ports SMTP par Railway)
 */
export async function sendViaBrevoApi({ to, subject, html, text }) {
  const apiKey = cleanEnv(process.env.BREVO_API_KEY) || cleanEnv(process.env.SMTP_PASS);
  if (!apiKey) {
    throw new Error('Clé API Brevo manquante (SMTP_PASS ou BREVO_API_KEY).');
  }

  const fromStr = getFromEmail();
  const match = fromStr.match(/^(.*?)\s*<(.+)>$/);
  const senderName = match ? match[1].trim() : 'CNDS Burundi';
  const senderEmail = match ? match[2].trim() : fromStr;

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: to }],
      subject,
      htmlContent: html || `<p>${text || subject}</p>`,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    const errMsg = data.message || (typeof data === 'object' ? JSON.stringify(data) : 'Erreur Brevo API');
    throw new Error(errMsg);
  }
  return data;
}

/**
 * Envoi unifié : tente l'API HTTPS Brevo en priorité (anti-blocage firewall), puis SMTP standard
 */
export async function sendMailUnified({ to, subject, html, text }) {
  const host = cleanEnv(process.env.SMTP_HOST);
  const pass = cleanEnv(process.env.SMTP_PASS);
  const isBrevo = (host && host.includes('brevo')) || (pass && (pass.startsWith('xsmtpsib-') || pass.startsWith('xkeysib-')));

  // 1. Si Brevo est utilisé, passer par l'API REST HTTPS (Port 443) pour contourner le blocage du port 587 sur Railway
  if (isBrevo) {
    try {
      const apiResult = await sendViaBrevoApi({ to, subject, html, text });
      console.log(`✅ Email envoyé via API HTTPS Brevo (Port 443) à ${to}`);
      return { success: true, method: 'brevo_https_api', messageId: apiResult.messageId };
    } catch (apiErr) {
      console.warn('⚠️ Tentative API Brevo HTTPS a échoué, repli sur le SMTP classique...', apiErr.message);
    }
  }

  // 2. Transporteur SMTP classique
  const transporter = getTransporter();
  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: getFromEmail(),
        to,
        subject,
        html,
        text,
      });
      console.log(`✅ Email envoyé via SMTP à ${to}`);
      return { success: true, method: 'smtp', messageId: info.messageId };
    } catch (mailErr) {
      console.error(`❌ Échec SMTP à ${to}:`, mailErr.message);
      throw mailErr;
    }
  }

  // 3. Mode simulation si aucun provider configuré
  console.log(`📨 [Simulation Email CNDS] À: ${to} | Objet: "${subject}"`);
  return { success: true, method: 'simulation' };
}

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

      try {
        await sendMailUnified({
          to: sub.email,
          subject,
          html,
        });
        sentCount++;
      } catch (mailErr) {
        console.error(`❌ Échec d'envoi à ${sub.email}:`, mailErr.message);
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

  try {
    const res = await sendMailUnified({
      to: email,
      subject: welcomeSubjects[subLang],
      html: welcomeHtml,
    });
    console.log(`✅ Email de bienvenue (${res.method}) envoyé à ${email}`);
  } catch (err) {
    console.error('❌ Erreur envoi email bienvenue:', err.message);
  }
}

/**
 * Endpoint de diagnostic et test direct de la connexion
 */
export async function testSmtpConnection(targetEmail) {
  const host = cleanEnv(process.env.SMTP_HOST);
  const pass = cleanEnv(process.env.SMTP_PASS);
  const isBrevo = (host && host.includes('brevo')) || (pass && (pass.startsWith('xsmtpsib-') || pass.startsWith('xkeysib-')));

  // Test 1 : Si Brevo est configuré, tester directement l'API REST HTTPS (Port 443 sans aucun blocage firewall)
  if (isBrevo) {
    try {
      const apiRes = await sendViaBrevoApi({
        to: targetEmail,
        subject: 'Test Connexion Brevo HTTPS — CNDS Burundi',
        text: 'Félicitations ! Votre compte Brevo est connecté avec succès via HTTPS (Port 443). Vos emails fonctionnent sans aucun blocage !',
      });
      return {
        success: true,
        methode: 'Brevo HTTPS API (Port 443 - Garanti sans blocage de port)',
        messageId: apiRes.messageId,
        expediteur_utilise: getFromEmail(),
        destinataire: targetEmail,
        message: 'Email de test envoyé avec succès ! Vérifiez votre boîte de réception.',
      };
    } catch (apiErr) {
      return {
        success: false,
        methode: 'Brevo HTTPS API (Port 443)',
        erreur: apiErr.message,
        expediteur_utilise: getFromEmail(),
        conseil: 'Vérifiez que votre clé SMTP_PASS est exacte et que l’adresse dans SMTP_FROM correspond à votre compte Brevo.',
      };
    }
  }

  // Test 2 : Si autre transporteur SMTP (ex: Gmail ou serveur dédié)
  const service = cleanEnv(process.env.SMTP_SERVICE);
  const isGmail = (service && service.toLowerCase() === 'gmail') || (host && host.toLowerCase().includes('gmail'));

  const transporter = getTransporter();
  if (!transporter) {
    return {
      success: false,
      configured: false,
      message: 'Aucun serveur d’email détecté sur Railway. Assurez-vous d’avoir configuré les variables sur Railway.',
      variables_detectees: {
        SMTP_SERVICE: !!process.env.SMTP_SERVICE,
        SMTP_HOST: !!process.env.SMTP_HOST,
        SMTP_PORT: !!process.env.SMTP_PORT,
        SMTP_USER: !!process.env.SMTP_USER,
        SMTP_PASS: !!process.env.SMTP_PASS,
        SMTP_FROM: !!process.env.SMTP_FROM,
      },
    };
  }

  try {
    await transporter.verify();
  } catch (verifyErr) {
    return {
      success: false,
      methode: isGmail ? 'Gmail_SSL_Port_465' : 'SMTP_Standard',
      etape: 'Verification_authentification_SMTP',
      erreur: verifyErr.message,
      code: verifyErr.code,
      reponse_serveur: verifyErr.response,
      conseil: isGmail
        ? 'Vérifiez que vous avez bien utilisé le mot de passe d’application de 16 lettres (et non votre mot de passe Gmail habituel).'
        : 'Si le port 587 est bloqué par Railway (ETIMEDOUT), réglez SMTP_PORT sur 2525 sur Railway.',
    };
  }

  try {
    const info = await transporter.sendMail({
      from: getFromEmail(),
      to: targetEmail,
      subject: 'Test Connexion SMTP — CNDS Burundi',
      text: 'Félicitations ! Votre serveur SMTP fonctionne avec succès.',
    });
    return {
      success: true,
      methode: isGmail ? 'Gmail_SSL_Port_465' : 'SMTP_Standard',
      messageId: info.messageId,
      accepted: info.accepted,
      expediteur_utilise: getFromEmail(),
    };
  } catch (sendErr) {
    return {
      success: false,
      methode: isGmail ? 'Gmail_SSL_Port_465' : 'SMTP_Standard',
      erreur: sendErr.message,
      code: sendErr.code,
      reponse_serveur: sendErr.response,
      expediteur_utilise: getFromEmail(),
    };
  }
}
