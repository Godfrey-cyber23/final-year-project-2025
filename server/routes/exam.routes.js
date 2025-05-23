import express from 'express';
import passport from 'passport';
import { examController } from '../controllers/exam.controller.js';

const router = express.Router();

// JWT Authentication middleware
const authenticate = passport.authenticate('jwt', { session: false });

// Role-based authorization middleware
const authorizeAdmin = (req, res, next) => {
  if (!req.lecturer?.is_admin) {
    return res.status(403).json({ error: 'Admin access only' });
  }
  next();
};

router.post('/',
  authenticate,
  authorizeAdmin,
  examController.createExam
);
// Exam CRUD Routes
router.get('/', 
  authenticate,
  authorizeAdmin,
  examController.getAllExams
);

router.get('/:examId',
  authenticate,
  authorizeAdmin,
  examController.getExamDetails
);

router.post('/',
  authenticate,
  authorizeAdmin,
  examController.createExam
);

router.put('/:examId',
  authenticate,
  authorizeAdmin,
  examController.updateExam
);

router.delete('/:examId',
  authenticate,
  authorizeAdmin,
  examController.deleteExam
);

// Exam Registration Routes
router.get('/:examId/students',
  authenticate,
  authorizeAdmin,
  examController.getExamRegistrations
);

router.post('/:examId/register',
  authenticate,
  authorize(['student']),
  examController.registerForExam
);

router.put('/:examId/approve/:studentId',
  authenticate,
  authorizeAdmin,
  examController.approveRegistration
);

// Monitoring and Security Routes
router.get('/:examId/logs',
  authenticate,
  authorizeAdmin,
  examController.getMonitoringLogs
);

router.post('/:examId/logs',
  authenticate,
  examController.addMonitoringLog
);

// Incident Management Routes
router.get('/:examId/incidents',
  authenticate,
  authorizeAdmin,
  examController.getExamIncidents
);

router.post('/:examId/incidents',
  authenticate,
  authorizeAdmin,
  examController.createIncident
);

router.put('/:examId/incidents/:incidentId',
  authenticate,
  authorizeAdmin,
  examController.resolveIncident
);

export default router;