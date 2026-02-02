import {
  GameType,
  DifficultyLevel,
  GameInfo,
  GameConfig,
  GameSession,
  PerformanceRating,
} from '../types/index';

/**
 * Clase modelo para gestionar la información y lógica de un juego
 */
export class GameModel {
  private info: GameInfo;
  private config: GameConfig;
  private session: GameSession | null = null;

  constructor(info: GameInfo, config: GameConfig) {
    this.info = info;
    this.config = config;
  }

  /**
   * Inicia una nueva sesión de juego
   */
  startSession(): GameSession {
    this.session = {
      id: this.generateSessionId(),
      gameType: this.info.type,
      startTime: new Date(),
      score: 0,
      maxScore: this.calculateMaxScore(),
      accuracy: 0,
      timeSpent: 0,
      completed: false,
      performanceRating: PerformanceRating.NEEDS_PRACTICE,
    };
    return this.session;
  }

  /**
   * Actualiza el puntaje de la sesión actual
   */
  updateScore(points: number): void {
    if (!this.session) {
      throw new Error('No hay una sesión activa');
    }
    this.session.score = Math.min(this.session.score + points, this.session.maxScore);
  }

  /**
   * Actualiza la precisión de la sesión actual
   */
  updateAccuracy(correctAnswers: number, totalAnswers: number): void {
    if (!this.session) {
      throw new Error('No hay una sesión activa');
    }
    this.session.accuracy = totalAnswers > 0
      ? Math.round((correctAnswers / totalAnswers) * 100)
      : 0;
  }

  /**
   * Finaliza la sesión actual
   */
  endSession(): GameSession {
    if (!this.session) {
      throw new Error('No hay una sesión activa');
    }

    this.session.endTime = new Date();
    this.session.timeSpent = Math.floor(
      (this.session.endTime.getTime() - this.session.startTime.getTime()) / 1000
    );
    this.session.completed = true;
    this.session.performanceRating = this.calculatePerformanceRating();

    return this.session;
  }

  /**
   * Obtiene la sesión actual
   */
  getCurrentSession(): GameSession | null {
    return this.session;
  }

  /**
   * Obtiene la información del juego
   */
  getInfo(): GameInfo {
    return this.info;
  }

  /**
   * Obtiene la configuración del juego
   */
  getConfig(): GameConfig {
    return this.config;
  }

  /**
   * Calcula el puntaje máximo según la dificultad
   */
  private calculateMaxScore(): number {
    const baseScore = 1000;
    const multiplier = {
      [DifficultyLevel.EASY]: 1,
      [DifficultyLevel.MEDIUM]: 1.5,
      [DifficultyLevel.HARD]: 2,
    };
    return Math.floor(baseScore * multiplier[this.config.difficultyLevel]);
  }

  /**
   * Calcula la calificación de rendimiento basada en la precisión y puntaje
   */
  private calculatePerformanceRating(): PerformanceRating {
    if (!this.session) {
      return PerformanceRating.NEEDS_PRACTICE;
    }

    const scorePercentage = (this.session.score / this.session.maxScore) * 100;
    const accuracy = this.session.accuracy;

    // Combinar puntaje y precisión para la calificación
    const performanceScore = (scorePercentage + accuracy) / 2;

    if (performanceScore >= 90) {
      return PerformanceRating.EXCELLENT;
    } else if (performanceScore >= 70) {
      return PerformanceRating.GOOD;
    } else if (performanceScore >= 50) {
      return PerformanceRating.REGULAR;
    } else {
      return PerformanceRating.NEEDS_PRACTICE;
    }
  }

  /**
   * Genera un ID único para la sesión
   */
  private generateSessionId(): string {
    return `${this.info.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
