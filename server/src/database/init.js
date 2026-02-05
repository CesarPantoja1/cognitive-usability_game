import db from '../config/database.js';
import { createTables } from './schema.js';

console.log('🚀 Initializing database...');

try {
  await createTables(db);
  console.log('✅ Database initialized successfully!');
  process.exit(0);
} catch (error) {
  console.error('❌ Error initializing database:', error);
  process.exit(1);
}
