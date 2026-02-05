/**
 * Servicio para comunicarse con el backend API
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

interface LoginResponse {
  user: {
    id: number;
    username: string;
    email: string;
    full_name: string;
    created_at: string;
  };
  token: string;
}

interface ProgressResponse {
  progress: {
    level: number;
    total_points: number;
    games_played: number;
  };
  sessions: any[];
  achievements: any[];
}

class ApiService {
  private static token: string | null = null;

  static setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  static getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_URL}${endpoint}`;
    const token = this.getToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en la solicitud');
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error de conexión con el servidor');
    }
  }

  // ============================================
  // AUTENTICACIÓN
  // ============================================

  static async register(username: string, email: string, password: string, fullName?: string) {
    const response = await this.request<LoginResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, fullName }),
    });

    if (response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  static async login(email: string, password: string) {
    const response = await this.request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  static async getCurrentUser() {
    return this.request<{ user: LoginResponse['user'] }>('/api/auth/me');
  }

  static logout() {
    this.setToken(null);
  }

  // ============================================
  // PROGRESO
  // ============================================

  static async getProgress() {
    return this.request<ProgressResponse>('/api/progress');
  }

  static async addGameSession(sessionData: {
    id: string;
    gameId: string;
    gameType: string;
    difficulty: string;
    score: number;
    maxScore: number;
    accuracy: number;
    timeSpent: number;
    performanceRating: string;
  }) {
    return this.request('/api/progress/session', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  static async getStats() {
    return this.request('/api/progress/stats');
  }

  static async resetProgress() {
    return this.request('/api/progress/reset', {
      method: 'POST',
    });
  }

  // ============================================
  // ACCESIBILIDAD
  // ============================================

  static async getAccessibilitySettings() {
    return this.request('/api/progress/accessibility');
  }

  static async updateAccessibilitySettings(settings: {
    highContrast?: boolean;
    subtitlesEnabled?: boolean;
    soundEnabled?: boolean;
    fontSize?: number;
    reducedMotion?: boolean;
  }) {
    return this.request('/api/progress/accessibility', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // ============================================
  // HEALTH CHECK
  // ============================================

  static async healthCheck() {
    return this.request('/api/health');
  }
}

export default ApiService;
