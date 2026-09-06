import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { publicApiLimiter } from './middleware/rateLimit.js';

// Import Routes
import authRoutes from './routes/auth.js';
import newsRoutes from './routes/news.js';
import boardRoutes from './routes/board.js';
import legalRoutes from './routes/legal.js';
import multimediaRoutes from './routes/multimedia.js';
import galleryRoutes from './routes/gallery.js';
import partnersRoutes from './routes/partners.js';
import contactRoutes from './routes/contact.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
        connectSrc: ["'self'", 'https://*.turso.io', 'https://www.cndsburundi.bi'],
      },
    },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Non autorisé par la politique CORS'));
      }
    },
    credentials: true,
  })
);

// Parse JSON bodies with strict size limit to prevent payload flooding
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Apply general API rate limiter
app.use('/api', publicApiLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    institution: 'CNDS Burundi — Comité National de Dialogue Social',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/board-members', boardRoutes);
app.use('/api/legal-texts', legalRoutes);
app.use('/api/multimedia', multimediaRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/partners', partnersRoutes);
app.use('/api/contact', contactRoutes);

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { seed } from './db/seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDist = path.resolve(__dirname, '../../client/dist');

// Serve static frontend files if built
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Erreur API non gérée:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Une erreur interne est survenue sur le serveur',
  });
});

// Start Server & Auto-seed database
if (process.env.NODE_ENV !== 'test') {
  seed()
    .catch((err) => console.log('Notice: DB init check ->', err.message))
    .finally(() => {
      app.listen(PORT, () => {
        console.log(`🚀 Serveur CNDS API démarré sur le port ${PORT}`);
        console.log(`📡 URL API : http://localhost:${PORT}/api`);
      });
    });
}

export default app;
