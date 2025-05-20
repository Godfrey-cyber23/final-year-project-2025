 
import pool from '../config/database.js';

class User {
  static async create({ email, password, role = 'user' }) {
    const [result] = await pool.query(
      `INSERT INTO users (email, password, role) 
       VALUES (?, ?, ?)`,
      [email, password, role]
    );
    return this.findById(result.insertId);
  }

  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT id, email, role, created_at 
       FROM users WHERE id = ?`,
      [id]
    );
    return rows[0];
  }

  static async findByEmail(email) {
    const [rows] = await pool.query(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );
    return rows[0];
  }

  static async updatePassword(id, newPassword) {
    await pool.query(
      `UPDATE users SET password = ? WHERE id = ?`,
      [newPassword, id]
    );
  }
}

export default User;