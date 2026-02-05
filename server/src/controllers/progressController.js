import { Progress } from '../models/Progress.js';
import { GameSession } from '../models/GameSession.js';
import { Achievement } from '../models/Achievement.js';
import { AccessibilitySettings } from '../models/AccessibilitySettings.js';

export const getProgress = async (req, res) => {
  try {
    const progress = await Progress.getByUserId(req.userId);
    const sessions = await GameSession.findByUserId(req.userId, 50);
    const achievements = await Achievement.findByUserId(req.userId);

    res.json({
      success: true,
      data: {
        progress,
        sessions,
        achievements
      }
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener progreso'
    });
  }
};

export const addGameSession = async (req, res) => {
  try {
    const sessionData = {
      ...req.body,
      userId: req.userId
    };

    const session = await GameSession.create(sessionData);

    // Update progress
    await Progress.incrementGamesPlayed(req.userId);
    const levelUpResult = await Progress.addPoints(req.userId, sessionData.score);

    // Check for achievements
    const newAchievements = await checkAndAwardAchievements(req.userId);

    res.json({
      success: true,
      message: 'Sesión guardada exitosamente',
      data: {
        session,
        levelUp: levelUpResult.levelUp,
        newLevel: levelUpResult.newLevel,
        newAchievements
      }
    });
  } catch (error) {
    console.error('Add game session error:', error);
    res.status(500).json({
      success: false,
      message: 'Error al guardar sesión'
    });
  }
};

export const getStats = async (req, res) => {
  try {
    const stats = await GameSession.getStats(req.userId);

    res.json({
      success: true,
      data: {
        stats
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas'
    });
  }
};

export const resetProgress = async (req, res) => {
  try {
    await Progress.reset(req.userId);
    await GameSession.deleteByUserId(req.userId);
    await Achievement.deleteByUserId(req.userId);

    res.json({
      success: true,
      message: 'Progreso reiniciado exitosamente'
    });
  } catch (error) {
    console.error('Reset progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Error al reiniciar progreso'
    });
  }
};

export const getAccessibilitySettings = async (req, res) => {
  try {
    const settings = await AccessibilitySettings.getByUserId(req.userId);

    res.json({
      success: true,
      data: {
        settings
      }
    });
  } catch (error) {
    console.error('Get accessibility settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener configuración de accesibilidad'
    });
  }
};

export const updateAccessibilitySettings = async (req, res) => {
  try {
    const settings = await AccessibilitySettings.update(req.userId, req.body);

    res.json({
      success: true,
      message: 'Configuración actualizada exitosamente',
      data: {
        settings
      }
    });
  } catch (error) {
    console.error('Update accessibility settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar configuración'
    });
  }
};

// Helper function to check and award achievements
async function checkAndAwardAchievements(userId) {
  const newAchievements = [];
  const progress = await Progress.getByUserId(userId);
  const sessions = await GameSession.findByUserId(userId);

  // First game achievement
  if (progress.games_played === 1) {
    const achievement = await Achievement.create({
      userId,
      achievementId: 'first_game',
      title: 'Primer Paso',
      description: 'Completaste tu primer juego',
      icon: 'trophy'
    });
    if (achievement) newAchievements.push(achievement);
  }

  // 10 games achievement
  if (progress.games_played === 10) {
    const achievement = await Achievement.create({
      userId,
      achievementId: 'ten_games',
      title: 'Entrenador Dedicado',
      description: 'Completaste 10 juegos',
      icon: 'star'
    });
    if (achievement) newAchievements.push(achievement);
  }

  // Level up achievement
  if (progress.level >= 5) {
    const achievement = await Achievement.create({
      userId,
      achievementId: 'level_5',
      title: 'Nivel Maestro',
      description: 'Alcanzaste el nivel 5',
      icon: 'award'
    });
    if (achievement) newAchievements.push(achievement);
  }

  // Perfect accuracy achievement
  const recentSession = sessions[0];
  if (recentSession && recentSession.accuracy === 100) {
    const achievement = await Achievement.create({
      userId,
      achievementId: 'perfect_accuracy',
      title: 'Precisión Perfecta',
      description: 'Completaste un juego con 100% de precisión',
      icon: 'target'
    });
    if (achievement) newAchievements.push(achievement);
  }

  return newAchievements;
}
