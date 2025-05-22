import { User, Department, Report } from '../models/Index.js';
import bcrypt from 'bcryptjs';

// Controller for admin-specific operations
const adminController = {
  // List all users
  async listUsers(req, res, next) {
    try {
      const users = await User.findAll({
        attributes: ['user_id','university_id','email','first_name','last_name','role','is_active','department_id'],
      });
      res.json(users);
    } catch (err) {
      next(err);
    }
  },

  // Create a new department
  async createDepartment(req, res, next) {
    try {
      const { name, faculty, secret_key } = req.body;
      const secret_key_hash = await bcrypt.hash(secret_key, 12);
      const dept = await Department.create({ name, faculty, secret_key_hash });
      res.status(201).json(dept);
    } catch (err) {
      next(err);
    }
  },

  // Update an existing department
  async updateDepartment(req, res, next) {
    try {
      const { id } = req.params;
      const dept = await Department.findByPk(id);
      if (!dept) return res.status(404).json({ error: 'Department not found' });
      const updates = { name: req.body.name, faculty: req.body.faculty };
      if (req.body.secret_key) {
        updates.secret_key_hash = await bcrypt.hash(req.body.secret_key, 12);
      }
      await dept.update(updates);
      res.json(dept);
    } catch (err) {
      next(err);
    }
  },

  // Delete a department
  async deleteDepartment(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await Department.destroy({ where: { department_id: id } });
      if (!deleted) return res.status(404).json({ error: 'Department not found' });
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  },

  // List all generated reports
  async listReports(req, res, next) {
    try {
      const reports = await Report.findAll({
        include: [{ model: Department, attributes: ['name','faculty'] }, { model: User, as: 'generatedBy', attributes: ['first_name','last_name','role'] }]
      });
      res.json(reports);
    } catch (err) {
      next(err);
    }
  }
};

export default adminController;
