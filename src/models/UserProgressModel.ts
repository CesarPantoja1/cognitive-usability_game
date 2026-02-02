import {
  UserProgress,
  GameSession,
  Achievement,
  GameType,
  GameTypeStats,
  PerformanceRating,
} from '../types/index';

/**
 * Clase modelo para gestionar el progreso del usuario
 */
export class UserProgressModel {
  private progress: UserProgress;

  constructor(initialProgress?: UserProgress) {
    this.progress = initialProgress || this.createInitialProgress();
  }

  /**
   * Crea un progreso inicial vacío
   */
  private createInitialProgress(): UserProgress {
    return {
      totalScore: 0,
      gamesPlayed: 0,
      gamesCompleted: 0,
      accuracyAverage: 0,
      totalTimeSpent: 0,
      currentLevel: 1,
      activeDays: 0,
      achievements: [],
      gameSessions: [],
    };
  }

  /**
   * Registra una sesión de juego completada
   */
  addGameSession(session: GameSession): void {
    this.progress.gameSessions.push(session);
    this.progress.gamesPlayed++;

    if (session.completed) {
      this.progress.gamesCompleted++;
    }

    this.progress.totalScore += session.score;
    this.progress.totalTimeSpent += session.timeSpent;
    this.progress.lastPlayedAt = session.endTime || new Date();

    // Recalcular promedio de precisión
    this.recalculateAccuracyAverage();

    // Actualizar nivel del usuario
    this.updateLevel();

    // Verificar logros
    this.checkAchievements(session);
  }

  /**
   * Obtiene el progreso actual
   */
  getProgress(): UserProgress {
    return { ...this.progress };
  }

  /**
   * Obtiene estadísticas por tipo de juego
   */
  getGameTypeStats(gameType: GameType): GameTypeStats {
    const sessions = this.progress.gameSessions.filter(s => s.gameType === gameType);

    if (sessions.length === 0) {
      return {
        gameType,
        timesPlayed: 0,
        averageScore: 0,
        bestScore: 0,
        averageAccuracy: 0,
        totalTimeSpent: 0,
      };
    }

    const totalScore = sessions.reduce((sum, s) => sum + s.score, 0);
    const totalAccuracy = sessions.reduce((sum, s) => sum + s.accuracy, 0);
    const totalTime = sessions.reduce((sum, s) => sum + s.timeSpent, 0);
    const bestScore = Math.max(...sessions.map(s => s.score));

    return {
      gameType,
      timesPlayed: sessions.length,
      averageScore: Math.round(totalScore / sessions.length),
      bestScore,
      averageAccuracy: Math.round(totalAccuracy / sessions.length),
      totalTimeSpent: totalTime,
    };
  }

  /**
   * Obtiene todas las estadísticas por tipo de juego
   */
  getAllGameTypeStats(): GameTypeStats[] {
    return Object.values(GameType).map(type => this.getGameTypeStats(type));
  }

  /**
   * Obtiene el porcentaje de progreso hacia el siguiente nivel
   */
  getLevelProgress(): number {
    const currentLevelThreshold = this.getLevelThreshold(this.progress.currentLevel);
    const nextLevelThreshold = this.getLevelThreshold(this.progress.currentLevel + 1);
    const progressInLevel = this.progress.totalScore - currentLevelThreshold;
    const levelRange = nextLevelThreshold - currentLevelThreshold;

    return Math.min(Math.round((progressInLevel / levelRange) * 100), 100);
  }

  /**
   * Obtiene los logros recientes (últimos 5)
   */
  getRecentAchievements(): Achievement[] {
    return this.progress.achievements
      .sort((a, b) => b.unlockedAt.getTime() - a.unlockedAt.getTime())
      .slice(0, 5);
  }

  /**
   * Recalcula el promedio de precisión
   */
  private recalculateAccuracyAverage(): void {
    if (this.progress.gameSessions.length === 0) {
      this.progress.accuracyAverage = 0;
      return;
    }

    const totalAccuracy = this.progress.gameSessions.reduce(
      (sum, session) => sum + session.accuracy,
      0
    );

    this.progress.accuracyAverage = Math.round(
      totalAccuracy / this.progress.gameSessions.length
    );
  }

  /**
   * Actualiza el nivel del usuario basado en el puntaje total
   */
  private updateLevel(): void {
    let newLevel = 1;
    while (this.progress.totalScore >= this.getLevelThreshold(newLevel + 1)) {
      newLevel++;
    }

    if (newLevel > this.progress.currentLevel) {
      this.progress.currentLevel = newLevel;
      this.unlockAchievement({
        id: `level_${newLevel}`,
        name: `Nivel ${newLevel}`,
        description: `Has alcanzado el nivel ${newLevel}`,
        icon: 'trophy',
        unlockedAt: new Date(),
      });
    }
  }

  /**
   * Calcula el umbral de puntaje para un nivel dado
   */
  private getLevelThreshold(level: number): number {
    // Fórmula: cada nivel requiere 1000 puntos más que el anterior
    return (level - 1) * 1000;
  }

  /**
   * Verifica y desbloquea logros basados en la sesión
   */
  private checkAchievements(session: GameSession): void {
    // Primer juego completado
    if (this.progress.gamesCompleted === 1) {
      this.unlockAchievement({
        id: 'first_game',
        name: 'Primer Paso',
        description: 'Completa tu primer juego',
        icon: 'star',
        unlockedAt: new Date(),
      });
    }

    // 10 juegos completados
    if (this.progress.gamesCompleted === 10) {
      this.unlockAchievement({
        id: 'ten_games',
        name: 'Practicante',
        description: 'Completa 10 juegos',
        icon: 'medal',
        unlockedAt: new Date(),
      });
    }

    // Rendimiento excelente
    if (session.performanceRating === PerformanceRating.EXCELLENT) {
      this.unlockAchievement({
        id: 'excellent_performance',
        name: '¡Excelente!',
        description: 'Obtén un rendimiento excelente',
        icon: 'award',
        unlockedAt: new Date(),
      });
    }

    // Precisión perfecta (100%)
    if (session.accuracy === 100) {
      this.unlockAchievement({
        id: 'perfect_accuracy',
        name: 'Precisión Perfecta',
        description: 'Logra 100% de precisión en un juego',
        icon: 'target',
        unlockedAt: new Date(),
      });
    }
  }

  /**
   * Desbloquea un logro si no está ya desbloqueado
   */
  private unlockAchievement(achievement: Achievement): void {
    const exists = this.progress.achievements.some(a => a.id === achievement.id);
    if (!exists) {
      this.progress.achievements.push(achievement);
    }
  }

  /**
   * Serializa el progreso para almacenamiento
   */
  toJSON(): string {
    return JSON.stringify(this.progress);
  }

  /**
   * Carga el progreso desde JSON
   */
  static fromJSON(json: string): UserProgressModel {
    const data = JSON.parse(json);

    // Convertir fechas de string a Date
    if (data.lastPlayedAt) {
      data.lastPlayedAt = new Date(data.lastPlayedAt);
    }

    data.gameSessions = data.gameSessions.map((session: any) => ({
      ...session,
      startTime: new Date(session.startTime),
      endTime: session.endTime ? new Date(session.endTime) : undefined,
    }));

    data.achievements = data.achievements.map((achievement: any) => ({
      ...achievement,
      unlockedAt: new Date(achievement.unlockedAt),
    }));

    return new UserProgressModel(data);
  }
}
