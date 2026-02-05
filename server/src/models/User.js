import { pool } from '../config/database.js';
import bcrypt from 'bcryptjs';

export class User {
  static async create({ username, email, password, fullName }) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Create user
      const userResult = await client.query(
        `INSERT INTO users (username, email, password, full_name)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [username, email, hashedPassword, fullName]
      );

      const userId = userResult.rows[0].id;

      // Create initial progress entry
      await client.query(
        `INSERT INTO user_progress (user_id) VALUES ($1)`,
        [userId]
      );

      // Create initial accessibility settings
      await client.query(
        `INSERT INTO accessibility_settings (user_id) VALUES ($1)`,
        [userId]
      );

      await client.query('COMMIT');

      return userResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  static async findByUsername(username) {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0];
  }

  static verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  }

  static async update(id, data) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (data.fullName) {
      fields.push(`full_name = $${paramIndex++}`);
      values.push(data.fullName);
    }

    if (data.password) {
      fields.push(`password = $${paramIndex++}`);
      values.push(bcrypt.hashSync(data.password, 10));
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await pool.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    return result.rows[0];
  }

  static sanitizeUser(user) {
    if (!user) return null;
    const { password, ...sanitized } = user;
    return sanitized;
  }
}
