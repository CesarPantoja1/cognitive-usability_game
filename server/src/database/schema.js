export const createTables = async (db) => {
  // Users table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      full_name VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // User progress table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS user_progress (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      level INTEGER DEFAULT 1,
      total_points INTEGER DEFAULT 0,
      games_played INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Game sessions table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS game_sessions (
      id VARCHAR(255) PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      game_id VARCHAR(255) NOT NULL,
      game_type VARCHAR(255) NOT NULL,
      difficulty VARCHAR(50) NOT NULL,
      score INTEGER DEFAULT 0,
      max_score INTEGER DEFAULT 0,
      accuracy REAL DEFAULT 0,
      time_spent INTEGER DEFAULT 0,
      performance_rating VARCHAR(50),
      completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Achievements table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS achievements (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      achievement_id VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      icon VARCHAR(255) NOT NULL,
      earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, achievement_id)
    )
  `);

  // Accessibility settings table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS accessibility_settings (
      id SERIAL PRIMARY KEY,
      user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      high_contrast BOOLEAN DEFAULT FALSE,
      subtitles_enabled BOOLEAN DEFAULT TRUE,
      sound_enabled BOOLEAN DEFAULT TRUE,
      font_size INTEGER DEFAULT 16,
      reduced_motion BOOLEAN DEFAULT FALSE,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create indexes for better performance
  await db.exec(`
    CREATE INDEX IF NOT EXISTS idx_game_sessions_user_id ON game_sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_game_sessions_game_type ON game_sessions(game_type);
    CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
    CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id)
  `);

  console.log('✅ Database tables created successfully');
};
