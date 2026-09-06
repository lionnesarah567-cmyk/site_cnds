import rateLimit from 'express-rate-limit';

// Rate limiter for contact messages to prevent spam & bot floods
export const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 contact requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Trop de messages envoyés depuis cette adresse. Veuillez patienter 15 minutes avant de réessayer.',
  },
});

// Rate limiter for admin login to prevent brute force
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login attempts per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Trop de tentatives de connexion échouées. Veuillez patienter 15 minutes.',
  },
});

// General public API limiter
export const publicApiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 120, // 120 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
});
