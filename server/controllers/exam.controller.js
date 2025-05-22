
import { Exam, Course, StudentExam, MonitoringLog, Incident, Student, User } from '../models/Index.js';

export const examController = {
  // Fetch all exams
  async getAllExams(req, res, next) {
    try {
      const exams = await Exam.findAll({
        include: [{ model: Course, attributes: ['course_code', 'name'] }]
      });
      res.json(exams);
    } catch (err) {
      next(err);
    }
  },

  // Fetch details for a single exam
  async getExamDetails(req, res, next) {
    try {
      const { examId } = req.params;
      const exam = await Exam.findByPk(examId, {
        include: [
          { model: Course, attributes: ['course_code', 'name'] },
          { model: MonitoringLog },
          { model: Incident }
        ]
      });
      if (!exam) return res.status(404).json({ error: 'Exam not found' });
      res.json(exam);
    } catch (err) {
      next(err);
    }
  },

  // Create a new exam
  async createExam(req, res, next) {
    try {
      const { course_id, name, description, schedule_start, schedule_end, security_level } = req.body;
      const exam = await Exam.create({ course_id, name, description, schedule_start, schedule_end, security_level });
      res.status(201).json(exam);
    } catch (err) {
      next(err);
    }
  },

  // Update an existing exam
  async updateExam(req, res, next) {
    try {
      const { examId } = req.params;
      const exam = await Exam.findByPk(examId);
      if (!exam) return res.status(404).json({ error: 'Exam not found' });
      await exam.update(req.body);
      res.json(exam);
    } catch (err) {
      next(err);
    }
  },

  // Delete an exam
  async deleteExam(req, res, next) {
    try {
      const { examId } = req.params;
      const deleted = await Exam.destroy({ where: { exam_id: examId } });
      if (!deleted) return res.status(404).json({ error: 'Exam not found' });
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  },

  // Get registrations for an exam
  async getExamRegistrations(req, res, next) {
    try {
      const { examId } = req.params;
      const registrations = await StudentExam.findAll({
        where: { exam_id: examId },
        include: [{ model: Student, include: [User] }]
      });
      res.json(registrations);
    } catch (err) {
      next(err);
    }
  },

  // Student registers for an exam
  async registerForExam(req, res, next) {
    try {
      const userId = req.user.user_id;
      const student = await Student.findOne({ where: { user_id: userId } });
      if (!student) return res.status(404).json({ error: 'Student profile not found' });
      const { examId } = req.params;
      const registration = await StudentExam.create({ student_id: student.student_id, exam_id: examId });
      res.status(201).json(registration);
    } catch (err) {
      // handle duplicate registration
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ error: 'Already registered for this exam' });
      }
      next(err);
    }
  },

  // Approve a student's registration
  async approveRegistration(req, res, next) {
    try {
      const { examId, studentId } = req.params;
      const record = await StudentExam.findOne({ where: { exam_id: examId, student_id: studentId } });
      if (!record) return res.status(404).json({ error: 'Registration not found' });
      record.registration_status = 'approved';
      await record.save();
      res.json(record);
    } catch (err) {
      next(err);
    }
  },

  // Fetch monitoring logs for an exam
  async getMonitoringLogs(req, res, next) {
    try {
      const { examId } = req.params;
      const logs = await MonitoringLog.findAll({ where: { exam_id: examId } });
      res.json(logs);
    } catch (err) {
      next(err);
    }
  },

  // Add a new monitoring log
  async addMonitoringLog(req, res, next) {
    try {
      const { examId } = req.params;
      const { student_id, action_type, details, severity } = req.body;
      const log = await MonitoringLog.create({ exam_id: examId, student_id, action_type, details, severity });
      res.status(201).json(log);
    } catch (err) {
      next(err);
    }
  },

  // Fetch incidents for an exam
  async getExamIncidents(req, res, next) {
    try {
      const { examId } = req.params;
      const incidents = await Incident.findAll({ where: { '$log.exam_id$': examId }, include: [{ model: MonitoringLog, as: 'log' }] });
      res.json(incidents);
    } catch (err) {
      next(err);
    }
  },

  // Create a new incident
  async createIncident(req, res, next) {
    try {
      const { examId } = req.params;
      const { log_id, status, resolution_details } = req.body;
      const incident = await Incident.create({ log_id, status, resolution_details });
      res.status(201).json(incident);
    } catch (err) {
      next(err);
    }
  },

  // Resolve/update an incident
  async resolveIncident(req, res, next) {
    try {
      const { incidentId } = req.params;
      const incident = await Incident.findByPk(incidentId);
      if (!incident) return res.status(404).json({ error: 'Incident not found' });
      incident.status = req.body.status || incident.status;
      incident.resolution_details = req.body.resolution_details || incident.resolution_details;
      await incident.save();
      res.json(incident);
    } catch (err) {
      next(err);
    }
  }
};

export default examController;