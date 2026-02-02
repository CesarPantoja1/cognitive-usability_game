import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/env.js';
import { createTables } from './database/schema.js';
import authRoutes from './routes/auth.js';
import progressRoutes from './routes/progress.js';

const app = express();

// Initialize database
createTables(await import('./config/database.js').then(m => m.default));

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

// Start server
app.listen(config.port, () => {
  console.log(`
╔════════════════════════════════════════════╗
║   🧠 Cognitive Training Server Running    ║
║                                            ║
║   Port: ${config.port}                          ║
║   Environment: ${config.nodeEnv}              ║
║   CORS Origin: ${config.corsOrigin}  ║
╚════════════════════════════════════════════╝
  `);
});
