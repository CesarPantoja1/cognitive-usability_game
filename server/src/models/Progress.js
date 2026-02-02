import db from '../config/database.js';

export class Progress {
  static getByUserId(userId) {
    const stmt = db.prepare('SELECT * FROM user_progress WHERE user_id = ?');
    return stmt.get(userId);
  }

  static update(userId, data) {
    const fields = [];
    const values = [];

    if (data.level !== undefined) {
      fields.push('level = ?');
      values.push(data.level);
    }

    if (data.totalPoints !== undefined) {
      fields.push('total_points = ?');
      values.push(data.totalPoints);
    }

    if (data.gamesPlayed !== undefined) {
      fields.push('games_played = ?');
      values.push(data.gamesPlayed);
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(userId);

    const stmt = db.prepare(`
      UPDATE user_progress
      SET ${fields.join(', ')}
      WHERE user_id = ?
    `);

    stmt.run(...values);
    return this.getByUserId(userId);
  }

  static incrementGamesPlayed(userId) {
    const stmt = db.prepare(`
      UPDATE user_progress
      SET games_played = games_played + 1,
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `);
    stmt.run(userId);
  }

  static addPoints(userId, points) {
    const stmt = db.prepare(`
      UPDATE user_progress
      SET total_points = total_points + ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `);
    stmt.run(points, userId);

    // Check if level up is needed
    const progress = this.getByUserId(userId);
    const newLevel = Math.floor(progress.total_points / 1000) + 1;

    if (newLevel > progress.level) {
      this.update(userId, { level: newLevel });
      return { levelUp: true, newLevel };
    }

    return { levelUp: false };
  }

  static reset(userId) {
    const stmt = db.prepare(`
      UPDATE user_progress
      SET level = 1,
          total_points = 0,
          games_played = 0,
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `);
    stmt.run(userId);
  }
}
