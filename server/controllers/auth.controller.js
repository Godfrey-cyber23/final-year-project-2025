import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from '../config/database.js';
import { sendResetEmail } from '../services/email.service.js';

import 'dotenv/config'; // Add this if not already present
console.log('JWT Reset Secret:', process.env.JWT_RESET_SECRET);

const generateToken = (lecturerId, isAdmin) => {
  return jwt.sign(
    { 
      lecturer_id: lecturerId,
      isAdmin,
      iat: Math.floor(Date.now() / 1000) // issued at time
    }, 
    process.env.JWT_SECRET, 
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
      algorithm: 'HS256'
    }
  );
};

export const login = async (req, res) => {
  const { email, password, secret_key } = req.body;
  const ip = req.ip || req.connection.remoteAddress;
  const MAX_LOGIN_ATTEMPTS = 5;
  const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

  // Validate input
  if (!email || !password || !secret_key) {
    return res.status(400).json({ 
      success: false,
      error: 'All fields are required' 
    });
  }

  try {
    // Verify department secret key first (not in database query)
    if (secret_key !== process.env.DEPARTMENT_SECRET_KEY) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid department key' 
      });
    }

    // Check for existing lockout
    const [lockoutRows] = await pool.query(
      `SELECT lockout_until 
       FROM login_attempts 
       WHERE email = ? AND lockout_until > NOW() 
       ORDER BY attempt_time DESC 
       LIMIT 1`,
      [email]
    );

    if (lockoutRows.length > 0) {
      const lockoutTime = new Date(lockoutRows[0].lockout_until);
      const remainingTime = Math.ceil((lockoutTime - new Date()) / 1000 / 60); // in minutes
      return res.status(429).json({
        success: false,
        error: `Account temporarily locked. Try again in ${remainingTime} minutes.`
      });
    }

    // Get user from database
    const [rows] = await pool.query(
      `SELECT lecturer_id, email, password_hash, is_admin, account_status
       FROM lecturers 
       WHERE email = ?`,
      [email]
    );

    if (rows.length === 0) {
      // Record failed attempt even if user doesn't exist (prevent user enumeration)
      await recordLoginAttempt(email, ip, false);
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }

    const lecturer = rows[0];

    // Check account status
    if (lecturer.account_status === 'locked') {
      return res.status(403).json({
        success: false,
        error: 'Account locked. Please contact administrator.'
      });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, lecturer.password_hash);
    
    if (!isMatch) {
      // Record failed attempt
      await recordLoginAttempt(email, ip, false);
      
      // Check if account should be locked
      const [attemptRows] = await pool.query(
        `SELECT COUNT(*) as attempt_count
         FROM login_attempts 
         WHERE email = ? AND success = 0 AND attempt_time > DATE_SUB(NOW(), INTERVAL 1 HOUR)`,
        [email]
      );

      if (attemptRows[0].attempt_count >= MAX_LOGIN_ATTEMPTS - 1) {
        // Lock the account
        await pool.query(
          `UPDATE lecturers SET account_status = 'locked' WHERE email = ?`,
          [email]
        );
        
        await pool.query(
          `INSERT INTO login_attempts 
           (email, ip_address, success, lockout_until) 
           VALUES (?, ?, 0, DATE_ADD(NOW(), INTERVAL ${LOCKOUT_DURATION/1000/60} MINUTE))`,
          [email, ip]
        );

        return res.status(429).json({
          success: false,
          error: `Too many failed attempts. Account locked for ${LOCKOUT_DURATION/1000/60} minutes.`
        });
      }

      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials',
        attemptsRemaining: MAX_LOGIN_ATTEMPTS - attemptRows[0].attempt_count - 1
      });
    }

    // Successful login
    // Record successful attempt
    await recordLoginAttempt(email, ip, true);
    
    // Reset failed attempts counter
    await pool.query(
      `DELETE FROM login_attempts 
       WHERE email = ? AND success = 0`,
      [email]
    );

    // Generate JWT token with additional security claims
    const token = generateToken(lecturer.lecturer_id, lecturer.is_admin);

    // Set last login time
    await pool.query(
      `UPDATE lecturers 
       SET last_login = NOW() 
       WHERE lecturer_id = ?`,
      [lecturer.lecturer_id]
    );

    // Secure cookie settings for production
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    };

    // Send token in both response body and HTTP-only cookie
    return res
      .cookie('token', token, cookieOptions)
      .json({
        success: true,
        token,
        lecturer: {
          id: lecturer.lecturer_id,
          email: lecturer.email,
          isAdmin: lecturer.is_admin
        }
      });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Authentication failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Helper function to record login attempts
async function recordLoginAttempt(email, ip, success) {
  await pool.query(
    `INSERT INTO login_attempts 
     (email, ip_address, success) 
     VALUES (?, ?, ?)`,
    [email, ip, success ? 1 : 0]
  );
}

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Validate input
    if (!email || !email.trim()) {
      return res.status(400).json({ 
        success: false,
        message: 'Email is required',
        error: 'VALIDATION_ERROR'
      });
    }

    // Check if email exists
    const [rows] = await pool.query(
      'SELECT lecturer_id FROM lecturers WHERE email = ?', 
      [email.trim()]
    );

    // Only proceed if user exists (security: don't reveal if user doesn't exist)
    if (rows.length > 0) {
      const user = rows[0];
      const token = jwt.sign(
        { id: user.lecturer_id }, 
        process.env.JWT_RESET_SECRET, 
        { expiresIn: '1h' }
      );
      
      await sendResetEmail(email, token);
    }

    // Always return success to prevent email enumeration
    return res.status(200).json({ 
      success: true,
      message: 'If this email exists in our system, you will receive a reset link'
    });

  } catch (error) {
    console.error('Password reset error:', error);
    
    // Differentiate between JWT errors and other errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(500).json({
        success: false,
        message: 'Token generation failed',
        error: 'JWT_ERROR'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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

    if (!first_name || !last_name || !email || !password || !staff_id || !department_id) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

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


export const getCurrentLecturer = async (req, res) => {
  try {
    // Validate user ID from authentication middleware
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Invalid user session'
      });
    }

    const lecturerId = req.user.id;

    // Execute query with parameterized values to prevent SQL injection
    const [rows] = await pool.query(
      `SELECT 
        lecturer_id, 
        email, 
        first_name, 
        last_name, 
        staff_id, 
        department_id,
        is_admin,
        created_at,
        last_login
       FROM lecturers 
       WHERE lecturer_id = ? AND is_active = 1`, // Only return active lecturers
      [lecturerId]
    );

    // Handle case where lecturer not found
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Lecturer not found or account inactive'
      });
    }

    const lecturer = rows[0];
    
    // Remove sensitive fields before sending response
    delete lecturer.password_hash;
    delete lecturer.reset_token;
    delete lecturer.reset_token_expiry;

    // Add additional useful information
    const departmentInfo = await getDepartmentInfo(lecturer.department_id);
    
    res.json({
      success: true,
      lecturer: {
        ...lecturer,
        department_name: departmentInfo?.name || null,
        permissions: await getUserPermissions(lecturer.lecturer_id)
      },
      meta: {
        request_id: req.headers['x-request-id'],
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Get current lecturer error:', {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id,
      endpoint: req.originalUrl
    });

    // Differentiate between database errors and other errors
    const isDatabaseError = error.code && error.code.startsWith('ER_');
    
    res.status(isDatabaseError ? 503 : 500).json({
      success: false,
      error: isDatabaseError 
        ? 'Service temporarily unavailable' 
        : 'Internal server error',
      reference_id: req.headers['x-request-id']
    });
  }
};

// Helper function to get department info
async function getDepartmentInfo(departmentId) {
  const [deptRows] = await pool.query(
    `SELECT name FROM departments WHERE department_id = ?`,
    [departmentId]
  );
  return deptRows[0];
}

// Helper function to get user permissions
async function getUserPermissions(lecturerId) {
  const [permRows] = await pool.query(
    `SELECT permission_key FROM lecturer_permissions WHERE lecturer_id = ?`,
    [lecturerId]
  );
  return permRows.map(row => row.permission_key);
}