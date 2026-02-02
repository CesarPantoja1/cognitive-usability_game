import type { UserProgress, AccessibilitySettings, UserProfile, GameSession } from '../types/index';

/**
 * Servicio para gestionar el almacenamiento local de datos
 */
export class StorageService {
  private static readonly KEYS = {
    USER_PROFILE: 'cognitive_game_user_profile',
    USER_PROGRESS: 'cognitive_game_user_progress',
    ACCESSIBILITY: 'cognitive_game_accessibility',
    SESSIONS: 'cognitive_game_sessions',
  };

  /**
   * Guarda el perfil del usuario
   */
  static saveUserProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(this.KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (error) {
      console.error('Error guardando perfil de usuario:', error);
    }
  }

  /**
   * Carga el perfil del usuario
   */
  static loadUserProfile(): UserProfile | null {
    try {
      const data = localStorage.getItem(this.KEYS.USER_PROFILE);
      if (!data) return null;

      const profile = JSON.parse(data);
      // Convertir fechas de string a Date
      profile.createdAt = new Date(profile.createdAt);
      profile.lastAccessAt = new Date(profile.lastAccessAt);

      return profile;
    } catch (error) {
      console.error('Error cargando perfil de usuario:', error);
      return null;
    }
  }

  /**
   * Guarda el progreso del usuario
   */
  static saveUserProgress(progress: UserProgress): void {
    try {
      localStorage.setItem(this.KEYS.USER_PROGRESS, JSON.stringify(progress));
    } catch (error) {
      console.error('Error guardando progreso:', error);
    }
  }

  /**
   * Carga el progreso del usuario
   */
  static loadUserProgress(): UserProgress | null {
    try {
      const data = localStorage.getItem(this.KEYS.USER_PROGRESS);
      if (!data) return null;

      const progress = JSON.parse(data);

      // Convertir fechas
      if (progress.lastPlayedAt) {
        progress.lastPlayedAt = new Date(progress.lastPlayedAt);
      }

      progress.gameSessions = progress.gameSessions?.map((session: any) => ({
        ...session,
        startTime: new Date(session.startTime),
        endTime: session.endTime ? new Date(session.endTime) : undefined,
      })) || [];

      progress.achievements = progress.achievements?.map((achievement: any) => ({
        ...achievement,
        unlockedAt: new Date(achievement.unlockedAt),
      })) || [];

      return progress;
    } catch (error) {
      console.error('Error cargando progreso:', error);
      return null;
    }
  }

  /**
   * Guarda la configuración de accesibilidad
   */
  static saveAccessibilitySettings(settings: AccessibilitySettings): void {
    try {
      localStorage.setItem(this.KEYS.ACCESSIBILITY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error guardando configuración de accesibilidad:', error);
    }
  }

  /**
   * Carga la configuración de accesibilidad
   */
  static loadAccessibilitySettings(): AccessibilitySettings | null {
    try {
      const data = localStorage.getItem(this.KEYS.ACCESSIBILITY);
      if (!data) return null;

      return JSON.parse(data);
    } catch (error) {
      console.error('Error cargando configuración de accesibilidad:', error);
      return null;
    }
  }

  /**
   * Obtiene la configuración de accesibilidad por defecto
   */
  static getDefaultAccessibilitySettings(): AccessibilitySettings {
    return {
      highContrast: false,
      subtitlesEnabled: true, // Activado por defecto para accesibilidad
      soundEnabled: false, // Desactivado por defecto para usuarios con discapacidad auditiva
      fontSize: 'normal',
      reducedMotion: false,
    };
  }

  /**
   * Guarda una sesión de juego
   */
  static saveGameSession(session: GameSession): void {
    try {
      const sessions = this.loadGameSessions();
      sessions.push(session);

      // Mantener solo las últimas 100 sesiones
      const recentSessions = sessions.slice(-100);

      localStorage.setItem(this.KEYS.SESSIONS, JSON.stringify(recentSessions));
    } catch (error) {
      console.error('Error guardando sesión de juego:', error);
    }
  }

  /**
   * Carga todas las sesiones de juego
   */
  static loadGameSessions(): GameSession[] {
    try {
      const data = localStorage.getItem(this.KEYS.SESSIONS);
      if (!data) return [];

      const sessions = JSON.parse(data);

      return sessions.map((session: any) => ({
        ...session,
        startTime: new Date(session.startTime),
        endTime: session.endTime ? new Date(session.endTime) : undefined,
      }));
    } catch (error) {
      console.error('Error cargando sesiones de juego:', error);
      return [];
    }
  }

  /**
   * Borra todos los datos almacenados
   */
  static clearAllData(): void {
    try {
      Object.values(this.KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error borrando datos:', error);
    }
  }

  /**
   * Exporta todos los datos a JSON
   */
  static exportData(): string {
    const data = {
      profile: this.loadUserProfile(),
      progress: this.loadUserProgress(),
      accessibility: this.loadAccessibilitySettings(),
      sessions: this.loadGameSessions(),
      exportedAt: new Date().toISOString(),
    };

    return JSON.stringify(data, null, 2);
  }

  /**
   * Importa datos desde JSON
   */
  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);

      if (data.profile) {
        this.saveUserProfile(data.profile);
      }

      if (data.progress) {
        this.saveUserProgress(data.progress);
      }

      if (data.accessibility) {
        this.saveAccessibilitySettings(data.accessibility);
      }

      return true;
    } catch (error) {
      console.error('Error importando datos:', error);
      return false;
    }
  }
}
