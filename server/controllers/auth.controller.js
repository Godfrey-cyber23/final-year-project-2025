import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from '../config/database.js';
import { sendResetEmail } from '../services/email.service.js';

const generateToken = (lecturerId, isAdmin) => {
  return jwt.sign({ id: lecturerId, isAdmin }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const [rows] = await pool.query(
      `SELECT lecturer_id, password_hash, is_admin 
       FROM lecturers 
       WHERE email = ?`, 
      [email]
    );
    
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const lecturer = rows[0];
    const isMatch = await bcrypt.compare(password, lecturer.password_hash);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(lecturer.lecturer_id, lecturer.is_admin);
    
    res.json({
      user: {
        id: lecturer.lecturer_id,
        isAdmin: lecturer.is_admin
      },
      token
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    const [rows] = await pool.query(
      'SELECT lecturer_id FROM lecturers WHERE email = ?', 
      [email]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Lecturer not found' });
    }

    const lecturer = rows[0];
    const resetToken = jwt.sign(
      { id: lecturer.lecturer_id }, 
      process.env.JWT_RESET_SECRET, 
      { expiresIn: '1h' }
    );

    await sendResetEmail(email, resetToken);
    
    res.json({ message: 'Reset email sent' });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    
    const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    await pool.query(
      'UPDATE lecturers SET password_hash = ? WHERE lecturer_id = ?',
      [hashedPassword, decoded.id]
    );
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};