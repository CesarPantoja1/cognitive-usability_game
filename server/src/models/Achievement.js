import { pool } from '../config/database.js';

export class Achievement {
  static async create(achievementData) {
    try {
      const result = await pool.query(
        `INSERT INTO achievements (user_id, achievement_id, title, description, icon)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (user_id, achievement_id) DO NOTHING
         RETURNING *`,
        [
          achievementData.userId,
          achievementData.achievementId,
          achievementData.title,
          achievementData.description,
          achievementData.icon
        ]
      );

      return result.rows[0] || null;
    } catch (error) {
      // Achievement already exists or other error
      return null;
    }
  }

  static async findByUserId(userId) {
    const result = await pool.query(
      `SELECT * FROM achievements
       WHERE user_id = $1
       ORDER BY earned_at DESC`,
      [userId]
    );
    return result.rows;
  }

  static async findByUserIdAndAchievementId(userId, achievementId) {
    const result = await pool.query(
      `SELECT * FROM achievements
       WHERE user_id = $1 AND achievement_id = $2`,
      [userId, achievementId]
    );
    return result.rows[0];
  }

  static async getRecent(userId, limit = 5) {
    const result = await pool.query(
      `SELECT * FROM achievements
       WHERE user_id = $1
       ORDER BY earned_at DESC
       LIMIT $2`,
      [userId, limit]
    );
    return result.rows;
  }

  static async deleteByUserId(userId) {
    await pool.query('DELETE FROM achievements WHERE user_id = $1', [userId]);
  }
}
