import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const [rows] = await pool.query(
      `SELECT lecturer_id, is_admin 
       FROM lecturers 
       WHERE lecturer_id = ?`,
      [decoded.id]
    );
    
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = {
      id: rows[0].lecturer_id,
      isAdmin: rows[0].is_admin
    };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};