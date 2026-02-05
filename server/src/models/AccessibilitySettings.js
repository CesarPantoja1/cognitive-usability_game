import { pool } from '../config/database.js';

export class AccessibilitySettings {
  static async getByUserId(userId) {
    const result = await pool.query(
      'SELECT * FROM accessibility_settings WHERE user_id = $1',
      [userId]
    );
    return result.rows[0] || null;
  }

  static async update(userId, settings) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (settings.highContrast !== undefined) {
      fields.push(`high_contrast = $${paramIndex++}`);
      values.push(settings.highContrast);
    }

    if (settings.subtitlesEnabled !== undefined) {
      fields.push(`subtitles_enabled = $${paramIndex++}`);
      values.push(settings.subtitlesEnabled);
    }

    if (settings.soundEnabled !== undefined) {
      fields.push(`sound_enabled = $${paramIndex++}`);
      values.push(settings.soundEnabled);
    }

    if (settings.fontSize !== undefined) {
      fields.push(`font_size = $${paramIndex++}`);
      values.push(settings.fontSize);
    }

    if (settings.reducedMotion !== undefined) {
      fields.push(`reduced_motion = $${paramIndex++}`);
      values.push(settings.reducedMotion);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(userId);

    await pool.query(
      `UPDATE accessibility_settings SET ${fields.join(', ')} WHERE user_id = $${paramIndex}`,
      values
    );

    return this.getByUserId(userId);
  }
}
