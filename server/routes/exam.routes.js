import express from 'express';
import passport from 'passport';
import { examController } from '../controllers/exam.controller.js';

const router = express.Router();

// JWT Authentication middleware
const authenticate = passport.authenticate('jwt', { session: false });

// Role-based authorization middleware
const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Unauthorized access' });
  }
  next();
};

// Exam CRUD Routes
router.get('/', 
  authenticate,
  examController.getAllExams
);

router.get('/:examId',
  authenticate,
  examController.getExamDetails
);

router.post('/',
  authenticate,
  authorize(['admin', 'instructor']),
  examController.createExam
);

router.put('/:examId',
  authenticate,
  authorize(['admin', 'instructor']),
  examController.updateExam
);

router.delete('/:examId',
  authenticate,
  authorize(['admin']),
  examController.deleteExam
);

// Exam Registration Routes
router.get('/:examId/students',
  authenticate,
  authorize(['admin', 'instructor']),
  examController.getExamRegistrations
);

router.post('/:examId/register',
  authenticate,
  authorize(['student']),
  examController.registerForExam
);

router.put('/:examId/approve/:studentId',
  authenticate,
  authorize(['admin', 'instructor']),
  examController.approveRegistration
);

// Monitoring and Security Routes
router.get('/:examId/logs',
  authenticate,
  authorize(['admin', 'instructor']),
  examController.getMonitoringLogs
);

router.post('/:examId/logs',
  authenticate,
  examController.addMonitoringLog
);

// Incident Management Routes
router.get('/:examId/incidents',
  authenticate,
  authorize(['admin', 'instructor']),
  examController.getExamIncidents
);

router.post('/:examId/incidents',
  authenticate,
  authorize(['admin', 'instructor', 'system']),
  examController.createIncident
);

router.put('/:examId/incidents/:incidentId',
  authenticate,
  authorize(['admin', 'instructor']),
  examController.resolveIncident
);

export default router;