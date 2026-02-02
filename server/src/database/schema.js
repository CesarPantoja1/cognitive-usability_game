export const createTables = (db) => {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      full_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // User progress table
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      level INTEGER DEFAULT 1,
      total_points INTEGER DEFAULT 0,
      games_played INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Game sessions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS game_sessions (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      game_id TEXT NOT NULL,
      game_type TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      score INTEGER DEFAULT 0,
      max_score INTEGER DEFAULT 0,
      accuracy REAL DEFAULT 0,
      time_spent INTEGER DEFAULT 0,
      performance_rating TEXT,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Achievements table
  db.exec(`
    CREATE TABLE IF NOT EXISTS achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      achievement_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      icon TEXT NOT NULL,
      earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, achievement_id)
    )
  `);

  // Accessibility settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS accessibility_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      high_contrast BOOLEAN DEFAULT 0,
      subtitles_enabled BOOLEAN DEFAULT 1,
      sound_enabled BOOLEAN DEFAULT 1,
      font_size INTEGER DEFAULT 16,
      reduced_motion BOOLEAN DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Create indexes for better performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_game_sessions_user_id ON game_sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_game_sessions_game_type ON game_sessions(game_type);
    CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
    CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
  `);

  console.log('✅ Database tables created successfully');
};
