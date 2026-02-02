import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { UserProgress, GameSession, GameType } from '../types/index';
import { UserProgressModel } from '../models/UserProgressModel';
import { StorageService } from '../services/StorageService';
import { useAuth } from './AuthContext';

interface ProgressContextType {
  progress: UserProgress;
  addGameSession: (session: GameSession) => void;
  getGameTypeStats: (gameType: GameType) => any;
  getLevelProgress: () => number;
  getRecentAchievements: () => any[];
  resetProgress: () => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

interface ProgressProviderProps {
  children: ReactNode;
}

// Claves de almacenamiento por usuario
const getUserProgressKey = (userId: string) => `cognitive_game_progress_${userId}`;
const getUserSessionsKey = (userId: string) => `cognitive_game_sessions_${userId}`;

export const ProgressProvider: React.FC<ProgressProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
  // Función para cargar progreso del usuario actual
  const loadUserProgress = useCallback((): UserProgress | null => {
    if (!user) return null;
    try {
      const data = localStorage.getItem(getUserProgressKey(user.id));
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
    } catch {
      return null;
    }
  }, [user]);

  // Función para guardar progreso del usuario actual
  const saveUserProgress = useCallback((progress: UserProgress) => {
    if (!user) return;
    try {
      localStorage.setItem(getUserProgressKey(user.id), JSON.stringify(progress));
    } catch (error) {
      console.error('Error guardando progreso:', error);
    }
  }, [user]);

  // Función para guardar sesión de juego
  const saveGameSession = useCallback((session: GameSession) => {
    if (!user) return;
    try {
      const key = getUserSessionsKey(user.id);
      const data = localStorage.getItem(key);
      const sessions: GameSession[] = data ? JSON.parse(data) : [];
      sessions.push(session);
      
      // Mantener solo las últimas 100 sesiones
      const recentSessions = sessions.slice(-100);
      localStorage.setItem(key, JSON.stringify(recentSessions));
    } catch (error) {
      console.error('Error guardando sesión:', error);
    }
  }, [user]);

  const [progressModel, setProgressModel] = useState<UserProgressModel>(() => {
    return new UserProgressModel();
  });

  const [progress, setProgress] = useState<UserProgress>(progressModel.getProgress());

  // Cargar progreso cuando cambie el usuario
  useEffect(() => {
    if (isAuthenticated && user) {
      const savedProgress = loadUserProgress();
      const newModel = savedProgress
        ? new UserProgressModel(savedProgress)
        : new UserProgressModel();
      setProgressModel(newModel);
      setProgress(newModel.getProgress());
    } else {
      // Usuario no autenticado: reiniciar progreso
      const newModel = new UserProgressModel();
      setProgressModel(newModel);
      setProgress(newModel.getProgress());
    }
  }, [user, isAuthenticated, loadUserProgress]);

  // Guardar progreso cada vez que cambie
  useEffect(() => {
    if (isAuthenticated && user) {
      saveUserProgress(progress);
    }
  }, [progress, isAuthenticated, user, saveUserProgress]);

  const addGameSession = (session: GameSession) => {
    progressModel.addGameSession(session);
    setProgress(progressModel.getProgress());
    if (user) {
      saveGameSession(session);
    }
  };

  const getGameTypeStats = (gameType: GameType) => {
    return progressModel.getGameTypeStats(gameType);
  };

  const getLevelProgress = () => {
    return progressModel.getLevelProgress();
  };

  const getRecentAchievements = () => {
    return progressModel.getRecentAchievements();
  };

  const resetProgress = () => {
    const newModel = new UserProgressModel();
    setProgressModel(newModel);
    setProgress(newModel.getProgress());
    if (user) {
      localStorage.removeItem(getUserProgressKey(user.id));
      localStorage.removeItem(getUserSessionsKey(user.id));
    }
  };

  const value: ProgressContextType = {
    progress,
    addGameSession,
    getGameTypeStats,
    getLevelProgress,
    getRecentAchievements,
    resetProgress,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = (): ProgressContextType => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress debe ser usado dentro de ProgressProvider');
  }
  return context;
};
