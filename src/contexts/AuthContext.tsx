import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { StorageService } from '../services/StorageService';
import type { UserProfile, AccessibilitySettings, UserProgress, DifficultyLevel } from '../types/index';

// ============================================
// TIPOS DE AUTENTICACIÓN
// ============================================

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
}

interface StoredUser extends AuthUser {
  password: string; // En producción, esto debería estar hasheado
}

interface AuthContextType {
  user: AuthUser | null;
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

// ============================================
// BASE DE DATOS EMBEBIDA (localStorage)
// ============================================

const DB_KEYS = {
  USERS: 'cognitive_game_users',
  CURRENT_USER: 'cognitive_game_current_user',
  USER_PROFILES: 'cognitive_game_user_profiles',
};

class EmbeddedDatabase {
  // Obtener todos los usuarios
  static getUsers(): StoredUser[] {
    try {
      const data = localStorage.getItem(DB_KEYS.USERS);
      if (!data) return [];
      return JSON.parse(data).map((user: any) => ({
        ...user,
        createdAt: new Date(user.createdAt),
      }));
    } catch {
      return [];
    }
  }

  // Guardar usuarios
  static saveUsers(users: StoredUser[]): void {
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
  }

  // Buscar usuario por email
  static findUserByEmail(email: string): StoredUser | undefined {
    return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  // Crear nuevo usuario
  static createUser(name: string, email: string, password: string): StoredUser {
    const users = this.getUsers();
    
    if (this.findUserByEmail(email)) {
      throw new Error('Ya existe una cuenta con este correo electrónico');
    }

    const newUser: StoredUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: email.toLowerCase(),
      name,
      password, // En producción: bcrypt.hashSync(password, 10)
      createdAt: new Date(),
    };

    users.push(newUser);
    this.saveUsers(users);

    return newUser;
  }

  // Verificar credenciales
  static verifyCredentials(email: string, password: string): StoredUser {
    const user = this.findUserByEmail(email);
    
    if (!user) {
      throw new Error('No existe una cuenta con este correo electrónico');
    }

    // En producción: bcrypt.compareSync(password, user.password)
    if (user.password !== password) {
      throw new Error('Contraseña incorrecta');
    }

    return user;
  }

  // Guardar sesión actual
  static saveCurrentSession(user: AuthUser): void {
    localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(user));
  }

  // Obtener sesión actual
  static getCurrentSession(): AuthUser | null {
    try {
      const data = localStorage.getItem(DB_KEYS.CURRENT_USER);
      if (!data) return null;
      const user = JSON.parse(data);
      return {
        ...user,
        createdAt: new Date(user.createdAt),
      };
    } catch {
      return null;
    }
  }

  // Cerrar sesión
  static clearSession(): void {
    localStorage.removeItem(DB_KEYS.CURRENT_USER);
  }

  // Obtener perfil de usuario
  static getUserProfile(userId: string): UserProfile | null {
    try {
      const data = localStorage.getItem(`${DB_KEYS.USER_PROFILES}_${userId}`);
      if (!data) return null;
      const profile = JSON.parse(data);
      return {
        ...profile,
        createdAt: new Date(profile.createdAt),
        lastAccessAt: new Date(profile.lastAccessAt),
        progress: {
          ...profile.progress,
          lastPlayedAt: profile.progress.lastPlayedAt ? new Date(profile.progress.lastPlayedAt) : undefined,
          gameSessions: profile.progress.gameSessions?.map((s: any) => ({
            ...s,
            startTime: new Date(s.startTime),
            endTime: s.endTime ? new Date(s.endTime) : undefined,
          })) || [],
          achievements: profile.progress.achievements?.map((a: any) => ({
            ...a,
            unlockedAt: new Date(a.unlockedAt),
          })) || [],
        },
      };
    } catch {
      return null;
    }
  }

  // Guardar perfil de usuario
  static saveUserProfile(profile: UserProfile): void {
    localStorage.setItem(`${DB_KEYS.USER_PROFILES}_${profile.id}`, JSON.stringify(profile));
  }

  // Crear perfil inicial
  static createInitialProfile(user: AuthUser): UserProfile {
    const defaultSettings: AccessibilitySettings = StorageService.getDefaultAccessibilitySettings();
    
    const initialProgress: UserProgress = {
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

    const profile: UserProfile = {
      id: user.id,
      name: user.name,
      createdAt: user.createdAt,
      lastAccessAt: new Date(),
      accessibilitySettings: defaultSettings,
      progress: initialProgress,
      preferences: {
        favoriteGames: [],
        preferredDifficulty: 'easy' as DifficultyLevel,
      },
    };

    this.saveUserProfile(profile);
    return profile;
  }
}

// ============================================
// CONTEXTO DE AUTENTICACIÓN
// ============================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar sesión al iniciar
  useEffect(() => {
    const loadSession = () => {
      const savedUser = EmbeddedDatabase.getCurrentSession();
      if (savedUser) {
        setUser(savedUser);
        const profile = EmbeddedDatabase.getUserProfile(savedUser.id);
        if (profile) {
          // Actualizar último acceso
          profile.lastAccessAt = new Date();
          EmbeddedDatabase.saveUserProfile(profile);
          setUserProfile(profile);
        } else {
          // Crear perfil si no existe
          const newProfile = EmbeddedDatabase.createInitialProfile(savedUser);
          setUserProfile(newProfile);
        }
      }
      setIsLoading(false);
    };

    loadSession();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    const storedUser = EmbeddedDatabase.verifyCredentials(email, password);
    
    const authUser: AuthUser = {
      id: storedUser.id,
      email: storedUser.email,
      name: storedUser.name,
      avatar: storedUser.avatar,
      createdAt: storedUser.createdAt,
    };

    EmbeddedDatabase.saveCurrentSession(authUser);
    setUser(authUser);

    // Cargar o crear perfil
    let profile = EmbeddedDatabase.getUserProfile(authUser.id);
    if (!profile) {
      profile = EmbeddedDatabase.createInitialProfile(authUser);
    } else {
      profile.lastAccessAt = new Date();
      EmbeddedDatabase.saveUserProfile(profile);
    }
    setUserProfile(profile);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<void> => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    // Validaciones
    if (name.length < 2) {
      throw new Error('El nombre debe tener al menos 2 caracteres');
    }
    if (!email.includes('@')) {
      throw new Error('Por favor ingresa un correo electrónico válido');
    }
    if (password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    const storedUser = EmbeddedDatabase.createUser(name, email, password);
    
    const authUser: AuthUser = {
      id: storedUser.id,
      email: storedUser.email,
      name: storedUser.name,
      createdAt: storedUser.createdAt,
    };

    EmbeddedDatabase.saveCurrentSession(authUser);
    setUser(authUser);

    // Crear perfil inicial
    const profile = EmbeddedDatabase.createInitialProfile(authUser);
    setUserProfile(profile);
  }, []);

  const logout = useCallback(() => {
    EmbeddedDatabase.clearSession();
    setUser(null);
    setUserProfile(null);
  }, []);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    if (!userProfile) return;
    
    const updatedProfile = { ...userProfile, ...updates };
    EmbeddedDatabase.saveUserProfile(updatedProfile);
    setUserProfile(updatedProfile);
  }, [userProfile]);

  const value: AuthContextType = {
    user,
    userProfile,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

// Componente para proteger rutas
interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirigir a login - se manejará en App.tsx con Navigate
    return null;
  }

  return <>{children}</>;
};

export default AuthContext;
