import db from '../config/database.js';

export class GameSession {
  static create(sessionData) {
    const stmt = db.prepare(`
      INSERT INTO game_sessions (
        id, user_id, game_id, game_type, difficulty,
        score, max_score, accuracy, time_spent, performance_rating
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
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
    );

    return this.findById(sessionData.id);
  }

  static findById(id) {
    const stmt = db.prepare('SELECT * FROM game_sessions WHERE id = ?');
    return stmt.get(id);
  }

  static findByUserId(userId, limit = 50) {
    const stmt = db.prepare(`
      SELECT * FROM game_sessions
      WHERE user_id = ?
      ORDER BY completed_at DESC
      LIMIT ?
    `);
    return stmt.all(userId, limit);
  }

  static findByUserIdAndGameType(userId, gameType) {
    const stmt = db.prepare(`
      SELECT * FROM game_sessions
      WHERE user_id = ? AND game_type = ?
      ORDER BY completed_at DESC
    `);
    return stmt.all(userId, gameType);
  }

  static getStats(userId) {
    const stmt = db.prepare(`
      SELECT
        game_type,
        COUNT(*) as games_played,
        AVG(score) as avg_score,
        MAX(score) as best_score,
        AVG(accuracy) as avg_accuracy,
        SUM(time_spent) as total_time
      FROM game_sessions
      WHERE user_id = ?
      GROUP BY game_type
    `);
    return stmt.all(userId);
  }

  static getRecentSessions(userId, limit = 10) {
    const stmt = db.prepare(`
      SELECT * FROM game_sessions
      WHERE user_id = ?
      ORDER BY completed_at DESC
      LIMIT ?
    `);
    return stmt.all(userId, limit);
  }

  static deleteByUserId(userId) {
    const stmt = db.prepare('DELETE FROM game_sessions WHERE user_id = ?');
    stmt.run(userId);
  }
}
