import express from 'express';
import { db } from '../db/index.js';

const router = express.Router();

// GET /api/partners - List institutional and social partners
router.get('/', async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM partners ORDER BY sort_order ASC');
    return res.json({
      success: true,
      partners: result.rows,
    });
  } catch (err) {
    console.error('Erreur GET /partners:', err);
    return res.status(500).json({ success: false, message: 'Erreur lors de la récupération des partenaires' });
  }
});

export default router;
