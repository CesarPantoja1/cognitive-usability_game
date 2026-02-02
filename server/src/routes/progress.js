import express from 'express';
import {
  getProgress,
  addGameSession,
  getStats,
  resetProgress,
  getAccessibilitySettings,
  updateAccessibilitySettings
} from '../controllers/progressController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getProgress);
router.post('/sessions', addGameSession);
router.get('/stats', getStats);
router.delete('/reset', resetProgress);
router.get('/accessibility', getAccessibilitySettings);
router.put('/accessibility', updateAccessibilitySettings);

export default router;
