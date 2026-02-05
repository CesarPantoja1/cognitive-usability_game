import { pool } from '../config/database.js';

export class Progress {
  static async getByUserId(userId) {
    const result = await pool.query('SELECT * FROM user_progress WHERE user_id = $1', [userId]);
    return result.rows[0];
  }

  static async update(userId, data) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (data.level !== undefined) {
      fields.push(`level = $${paramIndex++}`);
      values.push(data.level);
    }

    if (data.totalPoints !== undefined) {
      fields.push(`total_points = $${paramIndex++}`);
      values.push(data.totalPoints);
    }

    if (data.gamesPlayed !== undefined) {
      fields.push(`games_played = $${paramIndex++}`);
      values.push(data.gamesPlayed);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(userId);

    await pool.query(
      `UPDATE user_progress SET ${fields.join(', ')} WHERE user_id = $${paramIndex}`,
      values
    );

    return this.getByUserId(userId);
  }

  static async incrementGamesPlayed(userId) {
    await pool.query(
      `UPDATE user_progress
       SET games_played = games_played + 1, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $1`,
      [userId]
    );
  }

  static async addPoints(userId, points) {
    await pool.query(
      `UPDATE user_progress
       SET total_points = total_points + $1, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $2`,
      [points, userId]
    );

    // Check if level up is needed
    const progress = await this.getByUserId(userId);
    const newLevel = Math.floor(progress.total_points / 1000) + 1;

    if (newLevel > progress.level) {
      await this.update(userId, { level: newLevel });
      return { levelUp: true, newLevel };
    }

    return { levelUp: false };
  }

  static async reset(userId) {
    await pool.query(
      `UPDATE user_progress
       SET level = 1, total_points = 0, games_played = 0, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $1`,
      [userId]
    );
  }
}
