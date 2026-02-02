import db from '../config/database.js';

export class Achievement {
  static create(achievementData) {
    try {
      const stmt = db.prepare(`
        INSERT INTO achievements (user_id, achievement_id, title, description, icon)
        VALUES (?, ?, ?, ?, ?)
      `);

      stmt.run(
        achievementData.userId,
        achievementData.achievementId,
        achievementData.title,
        achievementData.description,
        achievementData.icon
      );

      return this.findByUserIdAndAchievementId(
        achievementData.userId,
        achievementData.achievementId
      );
    } catch (error) {
      // Achievement already exists
      return null;
    }
  }

  static findByUserId(userId) {
    const stmt = db.prepare(`
      SELECT * FROM achievements
      WHERE user_id = ?
      ORDER BY earned_at DESC
    `);
    return stmt.all(userId);
  }

  static findByUserIdAndAchievementId(userId, achievementId) {
    const stmt = db.prepare(`
      SELECT * FROM achievements
      WHERE user_id = ? AND achievement_id = ?
    `);
    return stmt.get(userId, achievementId);
  }

  static getRecent(userId, limit = 5) {
    const stmt = db.prepare(`
      SELECT * FROM achievements
      WHERE user_id = ?
      ORDER BY earned_at DESC
      LIMIT ?
    `);
    return stmt.all(userId, limit);
  }

  static deleteByUserId(userId) {
    const stmt = db.prepare('DELETE FROM achievements WHERE user_id = ?');
    stmt.run(userId);
  }
}
