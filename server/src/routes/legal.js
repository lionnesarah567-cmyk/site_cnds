import express from 'express';
import { db } from '../db/index.js';

const router = express.Router();

// GET /api/legal-texts - List decrees, charter and nomination acts
router.get('/', async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM legal_texts ORDER BY date_promulgated DESC');
    return res.json({
      success: true,
      texts: result.rows,
    });
  } catch (err) {
    console.error('Erreur GET /legal-texts:', err);
    return res.status(500).json({ success: false, message: 'Erreur lors de la récupération des textes juridiques' });
  }
});

export default router;
