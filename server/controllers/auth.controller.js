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

export const getLecturerProfile = async (req, res, next) => {
  try {
    const { id } = req.user;
    
    const [rows] = await pool.query(
      `SELECT lecturer_id, email, first_name, last_name, staff_id, department_id 
       FROM lecturers 
       WHERE lecturer_id = ?`, 
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Lecturer not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

export const updateLecturerProfile = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { email, first_name, last_name, staff_id, department_id } = req.body;
    
    await pool.query(
      `UPDATE lecturers 
       SET email = ?, first_name = ?, last_name = ?, staff_id = ?, department_id = ?
       WHERE lecturer_id = ?`, 
      [email, first_name, last_name, staff_id, department_id, id]
    );
    
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    next(error);
  }
};
export const changePassword = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { currentPassword, newPassword } = req.body;
    
    const [rows] = await pool.query(
      `SELECT password_hash 
       FROM lecturers 
       WHERE lecturer_id = ?`, 
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Lecturer not found' });
    }

    const lecturer = rows[0];
    const isMatch = await bcrypt.compare(currentPassword, lecturer.password_hash);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid current password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    await pool.query(
      `UPDATE lecturers 
       SET password_hash = ? 
       WHERE lecturer_id = ?`, 
      [hashedPassword, id]
    );
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};
export const logout = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};
export const getLecturerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.query(
      `SELECT lecturer_id, email, first_name, last_name, staff_id, department_id 
       FROM lecturers 
       WHERE lecturer_id = ?`, 
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Lecturer not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};
export const getAllLecturers = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT lecturer_id, email, first_name, last_name, staff_id, department_id 
       FROM lecturers`
    );
    
    res.json(rows);
  } catch (error) {
    next(error);
  }
};
export const deleteLecturer = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    await pool.query(
      `DELETE FROM lecturers 
       WHERE lecturer_id = ?`, 
      [id]
    );
    
    res.json({ message: 'Lecturer deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const updateLecturer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email, first_name, last_name, staff_id, department_id, is_admin } = req.body;
    
    await pool.query(
      `UPDATE lecturers 
       SET email = ?, first_name = ?, last_name = ?, staff_id = ?, department_id = ?, is_admin = ?
       WHERE lecturer_id = ?`, 
      [email, first_name, last_name, staff_id, department_id, is_admin || 0, id]
    );
    
    res.json({ message: 'Lecturer updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const registerLecturer = async (req, res, next) => {
  try {
    const { email, password, first_name, last_name, staff_id, department_id, is_admin } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const [result] = await pool.query(
      `INSERT INTO lecturers 
       (email, password_hash, first_name, last_name, staff_id, department_id, is_admin)
       VALUES (?, ?, ?, ?, ?, ?, ?)`, 
      [email, hashedPassword, first_name, last_name, staff_id, department_id, is_admin || 0]
    );
    
    res.status(201).json({
      lecturer_id: result.insertId,
      message: 'Lecturer created successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getLecturerCourses = async (req, res, next) => {
  try {
    const { id } = req.user;
    
    const [rows] = await pool.query(
      `SELECT c.course_id, c.name, c.description 
       FROM courses c 
       JOIN course_lecturers cl ON c.course_id = cl.course_id 
       WHERE cl.lecturer_id = ?`, 
      [id]
    );
    
    res.json(rows);
  } catch (error) {
    next(error);
  }
};