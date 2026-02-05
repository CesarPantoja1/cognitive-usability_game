import pg from 'pg';
import { config } from './env.js';

const { Pool } = pg;

// Parse the DATABASE_URL for Render PostgreSQL
const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl: config.nodeEnv === 'production' ? { rejectUnauthorized: false } : false
});

// Test connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL pool error:', err);
});

// Helper class to provide similar API to better-sqlite3
class Database {
  constructor(pool) {
    this.pool = pool;
  }

  // Execute raw SQL (for schema creation)
  async exec(sql) {
    const client = await this.pool.connect();
    try {
      await client.query(sql);
    } finally {
      client.release();
    }
  }

  // Query method for direct SQL execution
  async query(sql, params = []) {
    const pgSql = convertToPostgres(sql);
    const result = await this.pool.query(pgSql, params);
    return result;
  }
}

// Convert SQLite-style ? placeholders to PostgreSQL $1, $2, etc.
function convertToPostgres(sql) {
  let paramIndex = 0;
  return sql.replace(/\?/g, () => `$${++paramIndex}`);
}

const db = new Database(pool);

export default db;
export { pool };
