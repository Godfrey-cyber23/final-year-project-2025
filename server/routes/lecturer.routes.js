import express from 'express';
import { 
  getExams, 
  createExam, 
  updateExam,
  getMonitoringData,
  sendAlert,
  generateExamReport
} from '../controllers/lecturer.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Exam Management
router.get('/exams', authenticate, getExams);
router.post('/exams', authenticate, createExam);
router.put('/exams/:id', authenticate, updateExam);
router.get('/me', authenticate, getCurrentLecturer);

// Monitoring
router.get('/monitoring/:examId', authenticate, getMonitoringData);
router.post('/monitoring/alert', authenticate, sendAlert);

// Reports
router.get('/reports/exam/:examId', authenticate, generateExamReport);

export default router;