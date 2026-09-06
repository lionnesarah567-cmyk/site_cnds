import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Accès non autorisé : Token manquant',
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'cnds-super-secure-jwt-secret-replace-in-production-burundi-2024';
    const decoded = jwt.verify(token, secret);

    // Verify admin still exists in database
    const result = await db.execute({
      sql: 'SELECT id, username, email, role FROM admins WHERE id = ?',
      args: [decoded.id],
    });

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur introuvable ou désactivé',
      });
    }

    req.admin = result.rows[0];
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: 'Session expirée ou token invalide. Veuillez vous reconnecter.',
    });
  }
};
