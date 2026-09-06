import sanitizeHtml from 'sanitize-html';
import { z } from 'zod';

// Strict HTML sanitization options for news content to prevent stored XSS and SEO spam
const sanitizeOptions = {
  allowedTags: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'blockquote', 'p', 'a', 'ul', 'ol',
    'nl', 'li', 'b', 'i', 'strong', 'em',
    'strike', 'code', 'hr', 'br', 'div',
    'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td',
    'span',
  ],
  allowedAttributes: {
    a: ['href', 'name', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height'],
    span: ['class'],
    div: ['class'],
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  transformTags: {
    a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }),
  },
};

export const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return sanitizeHtml(str, sanitizeOptions).trim();
};

// Zod schema for Contact form
export const contactSchema = z.object({
  name: z.string().min(2, 'Le nom doit comporter au moins 2 caractères').max(100),
  email: z.string().email('Adresse email invalide').max(150),
  phone: z.string().max(30).optional().nullable(),
  subject: z.string().min(3, 'L\'objet doit comporter au moins 3 caractères').max(200),
  message: z.string().min(10, 'Le message doit comporter au moins 10 caractères').max(5000),
  website_hp: z.string().optional(), // Honeypot field
});

// Zod schema for News creation/update
export const newsSchema = z.object({
  title_fr: z.string().min(3, 'Le titre en français est obligatoire').max(300),
  title_rn: z.string().max(300).optional().nullable(),
  summary_fr: z.string().min(5, 'Le résumé en français est obligatoire').max(600),
  summary_rn: z.string().max(600).optional().nullable(),
  content_fr: z.string().min(10, 'Le contenu en français est obligatoire'),
  content_rn: z.string().optional().nullable(),
  category: z.string().max(50).default('Dialogue Social'),
  image_url: z.string().url('URL d\'image invalide').optional().or(z.literal('')).nullable(),
  published_at: z.string().optional(),
});
