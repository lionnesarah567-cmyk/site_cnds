import express from 'express';
import { db } from '../db/index.js';

const router = express.Router();

// GET /api/multimedia - List multimedia or reports
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    let sql = 'SELECT * FROM multimedia';
    const args = [];

    if (type) {
      sql += ' WHERE type = ?';
      args.push(type);
    }

    sql += ' ORDER BY date_published DESC';
    const result = await db.execute({ sql, args });

    return res.json({
      success: true,
      items: result.rows,
    });
  } catch (err) {
    console.error('Erreur GET /multimedia:', err);
    return res.status(500).json({ success: false, message: 'Erreur lors de la récupération des éléments multimédia' });
  }
});

export default router;
