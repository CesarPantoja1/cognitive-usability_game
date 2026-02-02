import db from '../config/database.js';

export class AccessibilitySettings {
  static getByUserId(userId) {
    const stmt = db.prepare('SELECT * FROM accessibility_settings WHERE user_id = ?');
    const settings = stmt.get(userId);

    if (!settings) return null;

    // Convert SQLite boolean (0/1) to JavaScript boolean
    return {
      ...settings,
      high_contrast: Boolean(settings.high_contrast),
      subtitles_enabled: Boolean(settings.subtitles_enabled),
      sound_enabled: Boolean(settings.sound_enabled),
      reduced_motion: Boolean(settings.reduced_motion)
    };
  }

  static update(userId, settings) {
    const fields = [];
    const values = [];

    if (settings.highContrast !== undefined) {
      fields.push('high_contrast = ?');
      values.push(settings.highContrast ? 1 : 0);
    }

    if (settings.subtitlesEnabled !== undefined) {
      fields.push('subtitles_enabled = ?');
      values.push(settings.subtitlesEnabled ? 1 : 0);
    }

    if (settings.soundEnabled !== undefined) {
      fields.push('sound_enabled = ?');
      values.push(settings.soundEnabled ? 1 : 0);
    }

    if (settings.fontSize !== undefined) {
      fields.push('font_size = ?');
      values.push(settings.fontSize);
    }

    if (settings.reducedMotion !== undefined) {
      fields.push('reduced_motion = ?');
      values.push(settings.reducedMotion ? 1 : 0);
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(userId);

    const stmt = db.prepare(`
      UPDATE accessibility_settings
      SET ${fields.join(', ')}
      WHERE user_id = ?
    `);

    stmt.run(...values);
    return this.getByUserId(userId);
  }
}
