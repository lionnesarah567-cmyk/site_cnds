import express from 'express';
import { db } from '../db/index.js';

const router = express.Router();

// GET /api/board-members - List the 5 executive bureau members
router.get('/', async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM board_members ORDER BY sort_order ASC');
    return res.json({
      success: true,
      members: result.rows,
    });
  } catch (err) {
    console.error('Erreur GET /board-members:', err);
    return res.status(500).json({ success: false, message: 'Erreur lors de la récupération des membres' });
  }
});

export default router;
