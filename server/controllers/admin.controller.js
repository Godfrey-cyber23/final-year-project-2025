import pool from '../config/database.js';

export const listLecturers = async (req, res, next) => {
  try {
    const [lecturers] = await pool.query(
      `SELECT lecturer_id, email, first_name, last_name, staff_id, department_id, is_admin 
       FROM lecturers`
    );
    res.json(lecturers);
  } catch (error) {
    next(error);
  }
};

export const createLecturer = async (req, res, next) => {
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

export const updateLecturer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email, first_name, last_name, staff_id, department_id, is_admin } = req.body;
    
    await pool.query(
      `UPDATE lecturers 
       SET email = ?, first_name = ?, last_name = ?, staff_id = ?, department_id = ?, is_admin = ?
       WHERE lecturer_id = ?`,
      [email, first_name, last_name, staff_id, department_id, is_admin, id]
    );
    
    res.json({ message: 'Lecturer updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const auditLogs = async (req, res, next) => {
  try {
    const [logs] = await pool.query(`
      SELECT report_id, report_type, generated_by, generated_at 
      FROM reports 
      ORDER BY generated_at DESC
    `);
    res.json(logs);
  } catch (error) {
    next(error);
  }
};

export const getSystemStats = async (req, res, next) => {
  try {
    const [[students]] = await pool.query(`SELECT COUNT(*) as total FROM students`);
    const [[lecturers]] = await pool.query(`SELECT COUNT(*) as total FROM lecturers`);
    const [[courses]] = await pool.query(`SELECT COUNT(*) as total FROM courses`);
    const [[exams]] = await pool.query(`SELECT COUNT(*) as total FROM exams`);

    res.json({
      totalStudents: students.total,
      totalLecturers: lecturers.total,
      totalCourses: courses.total,
      totalExams: exams.total
    });
  } catch (error) {
    next(error);
  }
};
