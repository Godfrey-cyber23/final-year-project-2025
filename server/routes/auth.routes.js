// server/routes/auth.routes.js
import express from 'express';
import {
  login,
  forgotPassword,
  resetPassword,
} from '../controllers/auth.controller.js';

const router = express.Router();

// Auth routes
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router; // ✅ Fix: ensure default export
