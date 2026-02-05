import { pool } from '../config/database.js';

export class GameSession {
  static async create(sessionData) {
    const result = await pool.query(
      `INSERT INTO game_sessions (
        id, user_id, game_id, game_type, difficulty,
        score, max_score, accuracy, time_spent, performance_rating
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        sessionData.id,
        sessionData.userId,
        sessionData.gameId,
        sessionData.gameType,
        sessionData.difficulty,
        sessionData.score,
        sessionData.maxScore,
        sessionData.accuracy,
        sessionData.timeSpent,
        sessionData.performanceRating
      ]
    );

    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM game_sessions WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async findByUserId(userId, limit = 50) {
    const result = await pool.query(
      `SELECT * FROM game_sessions
       WHERE user_id = $1
       ORDER BY completed_at DESC
       LIMIT $2`,
      [userId, limit]
    );
    return result.rows;
  }

  static async findByUserIdAndGameType(userId, gameType) {
    const result = await pool.query(
      `SELECT * FROM game_sessions
       WHERE user_id = $1 AND game_type = $2
       ORDER BY completed_at DESC`,
      [userId, gameType]
    );
    return result.rows;
  }

  static async getStats(userId) {
    const result = await pool.query(
      `SELECT
        game_type,
        COUNT(*) as games_played,
        AVG(score) as avg_score,
        MAX(score) as best_score,
        AVG(accuracy) as avg_accuracy,
        SUM(time_spent) as total_time
      FROM game_sessions
      WHERE user_id = $1
      GROUP BY game_type`,
      [userId]
    );
    return result.rows;
  }

  static async getRecentSessions(userId, limit = 10) {
    const result = await pool.query(
      `SELECT * FROM game_sessions
       WHERE user_id = $1
       ORDER BY completed_at DESC
       LIMIT $2`,
      [userId, limit]
    );
    return result.rows;
  }

  static async deleteByUserId(userId) {
    await pool.query('DELETE FROM game_sessions WHERE user_id = $1', [userId]);
  }
}
