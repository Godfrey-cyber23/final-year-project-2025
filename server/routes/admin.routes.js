import express from 'express';
import { 
  listLecturers,
  createLecturer,
  updateLecturer,
  getSystemStats,
  auditLogs
} from '../controllers/admin.controller.js';
import { authenticate, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authenticate);
router.use(isAdmin);

// Lecturer Management
router.get('/lecturers', listLecturers);
router.post('/lecturers', createLecturer);
router.put('/lecturers/:id', updateLecturer);

// System Management
router.get('/stats', getSystemStats);
router.get('/audit-logs', auditLogs);

export default router;