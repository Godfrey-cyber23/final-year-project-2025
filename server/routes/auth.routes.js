import express from 'express';
import {
  login,
  forgotPassword,
  resetPassword,
  registerLecturer
} from '../controllers/auth.controller.js';
import { authenticate, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// CORS Preflight Handling
const handleCorsPreflight = (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(200).send();
};

// Auth routes
router.route('/login')
  .post(login)
  .options(handleCorsPreflight);

router.route('/forgot-password')
  .post(forgotPassword)
  .options(handleCorsPreflight);

router.route('/reset-password/:token')
  .post(resetPassword)
  .options(handleCorsPreflight);

// Registration routes (choose one version based on your needs)
router.route('/register')
  .post(registerLecturer) // Open registration
  .options(handleCorsPreflight);

// OR for admin-only registration:
// router.route
// ('/register')
//   .post(authenticate, isAdmin, registerLecturer)
//   .options(handleCorsPreflight);

export default router;