 
// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Authentication routes
router.post('/login', adminController.login);
router.post('/register', authMiddleware.verifyToken, roleMiddleware.checkRole('admin'), adminController.register);
router.post('/forgot-password', adminController.forgotPassword);
router.post('/reset-password/:token', adminController.resetPassword);

// Protected routes
router.use(authMiddleware.verifyToken);

// Dashboard routes
router.get('/dashboard', adminController.getDashboardStats);
router.get('/dashboard/home', adminController.getDashboardHome);
router.get('/monitoring', adminController.getMonitoringData);
router.get('/reports', adminController.generateReports);

// Admin-only routes
router.use(roleMiddleware.checkRole('admin'));

// User management
router.route('/admin/users')
  .get(adminController.getAllUsers)
  .post(adminController.createUser);

router.route('/admin/users/:id')
  .get(adminController.getUser)
  .put(adminController.updateUser)
  .delete(adminController.deleteUser);

// System settings
router.route('/admin/settings')
  .get(adminController.getSettings)
  .put(adminController.updateSettings);

module.exports = router;
