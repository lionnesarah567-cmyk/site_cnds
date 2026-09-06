import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';
import { authLimiter } from '../middleware/rateLimit.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', authLimiter, async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Veuillez renseigner un identifiant et un mot de passe',
    });
  }

  try {
    const result = await db.execute({
      sql: 'SELECT * FROM admins WHERE username = ? OR email = ?',
      args: [username, username],
    });

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides',
      });
    }

    const admin = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides',
      });
    }

    const secret = process.env.JWT_SECRET || 'cnds-super-secure-jwt-secret-replace-in-production-burundi-2024';
    const expiresIn = process.env.JWT_EXPIRES_IN || '8h';

    const token = jwt.sign(
      {
        id: admin.id,
        username: admin.username,
        role: admin.role,
      },
      secret,
      { expiresIn }
    );

    return res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error('Erreur login:', err);
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur lors de la connexion',
    });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, (req, res) => {
  return res.json({
    success: true,
    admin: req.admin,
  });
});

export default router;
