// ============================================
// TIPOS Y ENUMS PRINCIPALES
// ============================================

/**
 * Tipos de juegos disponibles
 */
export enum GameType {
  MEMORY = 'memory',
  SEQUENCE = 'sequence',
  ATTENTION = 'attention',
  LOGIC = 'logic',
  REACTION = 'reaction'
}

/**
 * Niveles de dificultad
 */
export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

/**
 * Estados posibles del juego
 */
export enum GameState {
  NOT_STARTED = 'not_started',
  INSTRUCTIONS = 'instructions',
  PLAYING = 'playing',
  PAUSED = 'paused',
  COMPLETED = 'completed'
}

/**
 * Resultados de rendimiento
 */
export enum PerformanceRating {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  REGULAR = 'regular',
  NEEDS_PRACTICE = 'needs_practice'
}

/**
 * Tipos de retroalimentación emocional
 */
export enum FeedbackEmotion {
  VERY_HAPPY = 'very_happy',
  HAPPY = 'happy',
  NEUTRAL = 'neutral',
  SAD = 'sad',
  VERY_SAD = 'very_sad'
}

// ============================================
// INTERFACES DE DATOS
// ============================================

/**
 * Configuración de accesibilidad
 */
export interface AccessibilitySettings {
  highContrast: boolean;
  subtitlesEnabled: boolean;
  soundEnabled: boolean;
  fontSize: 'normal' | 'large' | 'extra-large';
  reducedMotion: boolean;
}

/**
 * Información del juego
 */
export interface GameInfo {
  id: string;
  type: GameType;
  name: string;
  description: string;
  icon: string;
  category: 'memory' | 'logic' | 'attention';
  difficulty: DifficultyLevel;
  estimatedTime: number; // en segundos
  instructions: string[];
  videoTutorialUrl?: string;
}

/**
 * Configuración del juego
 */
export interface GameConfig {
  timeLimit?: number; // tiempo límite en segundos (opcional)
  maxAttempts?: number; // número máximo de intentos
  targetScore?: number; // puntaje objetivo
  difficultyLevel: DifficultyLevel;
}

/**
 * Estadísticas de una sesión de juego
 */
export interface GameSession {
  id: string;
  gameType: GameType;
  startTime: Date;
  endTime?: Date;
  score: number;
  maxScore: number;
  accuracy: number; // porcentaje de aciertos (0-100)
  timeSpent: number; // en segundos
  completed: boolean;
  performanceRating: PerformanceRating;
}

/**
 * Resultado del juego
 */
export interface GameResult {
  session: GameSession;
  feedback?: string;
  achievements?: Achievement[];
  nextRecommendation?: GameType;
}

/**
 * Logro obtenido
 */
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

/**
 * Progreso general del usuario
 */
export interface UserProgress {
  totalScore: number;
  gamesPlayed: number;
  gamesCompleted: number;
  accuracyAverage: number; // porcentaje promedio
  totalTimeSpent: number; // en segundos
  currentLevel: number;
  activeDays: number;
  achievements: Achievement[];
  gameSessions: GameSession[];
  lastPlayedAt?: Date;
}

/**
 * Retroalimentación del usuario
 */
export interface UserFeedback {
  sessionId: string;
  emotion: FeedbackEmotion;
  comment?: string;
  timestamp: Date;
}

/**
 * Estadísticas por tipo de juego
 */
export interface GameTypeStats {
  gameType: GameType;
  timesPlayed: number;
  averageScore: number;
  bestScore: number;
  averageAccuracy: number;
  totalTimeSpent: number;
}

/**
 * Datos del perfil de usuario
 */
export interface UserProfile {
  id: string;
  name: string;
  createdAt: Date;
  lastAccessAt: Date;
  accessibilitySettings: AccessibilitySettings;
  progress: UserProgress;
  preferences: {
    favoriteGames: GameType[];
    preferredDifficulty: DifficultyLevel;
  };
}
