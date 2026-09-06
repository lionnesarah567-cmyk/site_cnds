import express from 'express';
import { db } from '../db/index.js';

const router = express.Router();

// GET /api/gallery - List photos
router.get('/', async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM gallery ORDER BY date_taken DESC');
    return res.json({
      success: true,
      photos: result.rows,
    });
  } catch (err) {
    console.error('Erreur GET /gallery:', err);
    return res.status(500).json({ success: false, message: 'Erreur lors de la récupération de la galerie' });
  }
});

export default router;
