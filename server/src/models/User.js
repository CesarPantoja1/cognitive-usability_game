import db from '../config/database.js';
import bcrypt from 'bcryptjs';

export class User {
  static create({ username, email, password, fullName }) {
    const hashedPassword = bcrypt.hashSync(password, 10);

    const stmt = db.prepare(`
      INSERT INTO users (username, email, password, full_name)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(username, email, hashedPassword, fullName);

    // Create initial progress entry
    const progressStmt = db.prepare(`
      INSERT INTO user_progress (user_id)
      VALUES (?)
    `);
    progressStmt.run(result.lastInsertRowid);

    // Create initial accessibility settings
    const settingsStmt = db.prepare(`
      INSERT INTO accessibility_settings (user_id)
      VALUES (?)
    `);
    settingsStmt.run(result.lastInsertRowid);

    return this.findById(result.lastInsertRowid);
  }

  static findById(id) {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id);
  }

  static findByEmail(email) {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  }

  static findByUsername(username) {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username);
  }

  static verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  }

  static update(id, data) {
    const fields = [];
    const values = [];

    if (data.fullName) {
      fields.push('full_name = ?');
      values.push(data.fullName);
    }

    if (data.password) {
      fields.push('password = ?');
      values.push(bcrypt.hashSync(data.password, 10));
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const stmt = db.prepare(`
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = ?
    `);

    stmt.run(...values);
    return this.findById(id);
  }

  static sanitizeUser(user) {
    if (!user) return null;
    const { password, ...sanitized } = user;
    return sanitized;
  }
}
