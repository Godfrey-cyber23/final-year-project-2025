 
// server/controllers/lecturer.controller.js
import pool from '../config/database.js';

export const getExams = async (req, res, next) => {
  try {
    const [exams] = await pool.query(
      `SELECT e.*, c.course_code, c.name as course_name 
       FROM exams e
       JOIN courses c ON e.course_id = c.course_id
       WHERE c.instructor_id = ?`,
      [req.user.id]
    );
    res.json(exams);
  } catch (error) {
    next(error);
  }
};

export const createExam = async (req, res, next) => {
  try {
    const { course_id, name, description, schedule_start, schedule_end, security_level } = req.body;
    
    const [result] = await pool.query(
      `INSERT INTO exams 
       (course_id, name, description, schedule_start, schedule_end, security_level)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [course_id, name, description, schedule_start, schedule_end, security_level]
    );
    
    res.status(201).json({
      exam_id: result.insertId,
      message: 'Exam created successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const updateExam = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, schedule_start, schedule_end, status, security_level } = req.body;
    
    await pool.query(
      `UPDATE exams 
       SET name = ?, description = ?, schedule_start = ?, schedule_end = ?, status = ?, security_level = ?
       WHERE exam_id = ?`,
      [name, description, schedule_start, schedule_end, status, security_level, id]
    );
    
    res.json({ message: 'Exam updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const getMonitoringData = async (req, res, next) => {
  try {
    const { examId } = req.params;
    
    const [logs] = await pool.query(
      `SELECT * FROM monitoring_logs 
       WHERE exam_id = ? 
       ORDER BY timestamp DESC`,
      [examId]
    );
    
    res.json(logs);
  } catch (error) {
    next(error);
  }
};

export const sendAlert = async (req, res, next) => {
  try {
    const { exam_id, student_id, message } = req.body;
    
    await pool.query(
      `INSERT INTO incidents 
       (exam_id, student_id, status, resolution_details)
       VALUES (?, ?, 'reported', ?)`,
      [exam_id, student_id, message]
    );
    
    res.json({ message: 'Alert sent successfully' });
  } catch (error) {
    next(error);
  }
};

export const generateExamReport = async (req, res, next) => {
  try {
    const { examId } = req.params;
    
    // Generate report data
    const [exam] = await pool.query('SELECT * FROM exams WHERE exam_id = ?', [examId]);
    const [incidents] = await pool.query('SELECT * FROM incidents WHERE exam_id = ?', [examId]);
    const [logs] = await pool.query('SELECT * FROM monitoring_logs WHERE exam_id = ?', [examId]);
    
    const report = {
      exam: exam[0],
      incident_count: incidents.length,
      incidents,
      log_count: logs.length,
      logs_sample: logs.slice(0, 10)
    };
    
    // Save report to database
    await pool.query(
      `INSERT INTO reports 
       (exam_id, generated_by, report_type, content)
       VALUES (?, ?, 'security', ?)`,
      [examId, req.user.id, JSON.stringify(report)]
    );
    
    res.json(report);
  } catch (error) {
    next(error);
  }
};