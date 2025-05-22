// server/routes/auth.routes.js
import express from 'express';
import {
  login,
  forgotPassword,
  resetPassword,
  registerLecturer
} from '../controllers/auth.controller.js';

const router = express.Router();

// Auth routes
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/register', registerLecturer); 
router.post('/reset-password/:token', resetPassword);
// router.post('/register', authenticate, registerLecturer); // Uncomment if you want to restrict registration to authenticated users
// router.post('/register', isAdmin, registerLecturer); // Uncomment if you want to restrict registration to admin users
// router.post('/register', authenticate, isAdmin, registerLecturer); // Uncomment if you want to restrict registration to authenticated admin users
export default router;
