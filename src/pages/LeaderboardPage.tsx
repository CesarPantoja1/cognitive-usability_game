import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Medal, 
  Crown, 
  Search, 
  ArrowLeft,
  Star,
  Flame,
  Target,
  Filter,
  ChevronDown,
  User,
  Zap
} from 'lucide-react';
import { Card, Button } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';

// Tipos
interface LeaderboardUser {
  id: string;
  name: string;
  email: string;
  totalScore: number;
  gamesPlayed: number;
  level: number;
  accuracy: number;
  streak: number;
  joinedAt: Date;
}

type SortBy = 'score' | 'games' | 'level' | 'accuracy';

// Función para obtener todos los usuarios con sus estadísticas
const getAllUsersWithStats = (): LeaderboardUser[] => {
  const users: LeaderboardUser[] = [];
  
  try {
    // Obtener lista de usuarios registrados
    const usersData = localStorage.getItem('cognitive_game_users');
    if (!usersData) return [];
    
    const registeredUsers = JSON.parse(usersData);
    
    for (const user of registeredUsers) {
      // Obtener progreso del usuario
      const progressKey = `cognitive_game_progress_${user.id}`;
      const progressData = localStorage.getItem(progressKey);
      
      let progress = {
        totalScore: 0,
        gamesPlayed: 0,
        currentLevel: 1,
        accuracyAverage: 0,
        activeDays: 0,
      };
      
      if (progressData) {
        const parsed = JSON.parse(progressData);
        progress = {
          totalScore: parsed.totalScore || 0,
          gamesPlayed: parsed.gamesPlayed || 0,
          currentLevel: parsed.currentLevel || 1,
          accuracyAverage: parsed.accuracyAverage || 0,
          activeDays: parsed.activeDays || 0,
        };
      }
      
      users.push({
        id: user.id,
        name: user.name,
        email: user.email,
        totalScore: progress.totalScore,
        gamesPlayed: progress.gamesPlayed,
        level: progress.currentLevel,
        accuracy: progress.accuracyAverage,
        streak: progress.activeDays,
        joinedAt: new Date(user.createdAt),
      });
    }
  } catch (error) {
    console.error('Error loading leaderboard data:', error);
  }
  
  return users;
};

// Componente de medalla para los primeros lugares
const RankBadge: React.FC<{ rank: number }> = ({ rank }) => {
  if (rank === 1) {
    return (
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30"
        aria-label="Primer lugar"
      >
        <Crown className="w-5 h-5 text-white" aria-hidden="true" />
      </motion.div>
    );
  }
  if (rank === 2) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
        className="w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center shadow-lg"
        aria-label="Segundo lugar"
      >
        <Medal className="w-5 h-5 text-white" aria-hidden="true" />
      </motion.div>
    );
  }
  if (rank === 3) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full flex items-center justify-center shadow-lg"
        aria-label="Tercer lugar"
      >
        <Medal className="w-5 h-5 text-white" aria-hidden="true" />
      </motion.div>
    );
  }
  return (
    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center" aria-label={`Posición número ${rank}`}>
      <span className="text-lg font-bold text-gray-500" aria-hidden="true">#{rank}</span>
    </div>
  );
};

// Componente de tarjeta de usuario
const UserCard: React.FC<{ 
  user: LeaderboardUser; 
  rank: number; 
  isCurrentUser: boolean;
  sortBy: SortBy;
}> = ({ user, rank, isCurrentUser, sortBy }) => {
  const getMainStat = () => {
    switch (sortBy) {
      case 'score':
        return { value: user.totalScore.toLocaleString(), label: 'puntos' };
      case 'games':
        return { value: user.gamesPlayed.toString(), label: 'partidas' };
      case 'level':
        return { value: `Nivel ${user.level}`, label: '' };
      case 'accuracy':
        return { value: `${user.accuracy.toFixed(1)}%`, label: 'precisión' };
    }
  };
  
  const stat = getMainStat();
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.05 }}
      role="listitem"
      tabIndex={0}
      aria-label={`${user.name}, posición ${rank}, ${stat.value} ${stat.label}${isCurrentUser ? ', tu perfil' : ''}`}
      className={`
        relative p-4 rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2
        ${isCurrentUser 
          ? 'bg-gradient-to-r from-primary-50 to-purple-50 border-2 border-primary-300 shadow-lg shadow-primary-500/10' 
          : 'bg-white hover:bg-gray-50 border border-gray-100'
        }
        ${rank <= 3 ? 'shadow-md' : ''}
      `}
    >
      {isCurrentUser && (
        <div className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full font-medium" aria-hidden="true">
          Tú
        </div>
      )}
      
      <div className="flex items-center gap-4">
        <RankBadge rank={rank} />
        
        <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-purple-500 rounded-xl flex items-center justify-center" aria-hidden="true">
          <span className="text-white font-bold text-lg">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-500" aria-hidden="true" />
              Nivel {user.level}
            </span>
            <span className="flex items-center gap-1">
              <Target className="w-3 h-3 text-green-500" aria-hidden="true" />
              {user.gamesPlayed} juegos
            </span>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`text-xl font-bold ${rank === 1 ? 'text-amber-500' : rank === 2 ? 'text-gray-500' : rank === 3 ? 'text-amber-700' : 'text-primary-600'}`}>
            {stat.value}
          </div>
          {stat.label && (
            <div className="text-xs text-gray-400">{stat.label}</div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Componente principal
export default function LeaderboardPage() {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('score');
  const [showFilters, setShowFilters] = useState(false);
  
  usePageTitle('Tabla de Posiciones');
  
  // Cargar usuarios
  useEffect(() => {
    const loadUsers = () => {
      const allUsers = getAllUsersWithStats();
      setUsers(allUsers);
    };
    
    loadUsers();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(loadUsers, 30000);
    return () => clearInterval(interval);
  }, []);
  
  // Ordenar y filtrar usuarios
  const sortedUsers = useMemo(() => {
    let filtered = [...users];
    
    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query)
      );
    }
    
    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.totalScore - a.totalScore;
        case 'games':
          return b.gamesPlayed - a.gamesPlayed;
        case 'level':
          return b.level - a.level;
        case 'accuracy':
          return b.accuracy - a.accuracy;
        default:
          return b.totalScore - a.totalScore;
      }
    });
    
    return filtered;
  }, [users, searchQuery, sortBy]);
  
  // Encontrar la posición del usuario actual
  const currentUserRank = useMemo(() => {
    if (!currentUser) return -1;
    const allSorted = [...users].sort((a, b) => b.totalScore - a.totalScore);
    return allSorted.findIndex(u => u.id === currentUser.id) + 1;
  }, [users, currentUser]);
  
  const currentUserData = users.find(u => u.id === currentUser?.id);
  
  // Estadísticas globales
  const stats = useMemo(() => ({
    totalPlayers: users.length,
    totalGames: users.reduce((sum, u) => sum + u.gamesPlayed, 0),
    totalPoints: users.reduce((sum, u) => sum + u.totalScore, 0),
  }), [users]);

  const sortOptions = [
    { value: 'score', label: 'Puntuación', icon: Trophy },
    { value: 'games', label: 'Partidas jugadas', icon: Target },
    { value: 'level', label: 'Nivel', icon: Star },
    { value: 'accuracy', label: 'Precisión', icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-white">
        <div className="container-center py-6">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="secondary"
              size="small"
              onClick={() => navigate(-1)}
              className="bg-white/20 hover:bg-white/30 text-white border-none"
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Volver
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold flex items-center gap-3"
              >
                <Trophy className="w-8 h-8" />
                Tabla de Posiciones
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white/80 mt-1"
              >
                Compite con otros jugadores y sube en el ranking
              </motion.p>
            </div>
            
            {currentUserRank > 0 && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="hidden md:block bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center"
              >
                <div className="text-sm text-white/80">Tu posición</div>
                <div className="text-3xl font-bold">#{currentUserRank}</div>
                <div className="text-sm text-white/80">de {stats.totalPlayers}</div>
              </motion.div>
            )}
          </div>
        </div>
      </header>
      
      {/* Estadísticas globales */}
      <div className="container-center -mt-4">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Jugadores', value: stats.totalPlayers, icon: User, color: 'from-blue-500 to-cyan-500' },
            { label: 'Partidas totales', value: stats.totalGames.toLocaleString(), icon: Target, color: 'from-purple-500 to-pink-500' },
            { label: 'Puntos totales', value: stats.totalPoints.toLocaleString(), icon: Flame, color: 'from-orange-500 to-red-500' },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="text-center bg-white shadow-lg border-none">
                  <div className={`w-10 h-10 mx-auto mb-2 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {/* Tu tarjeta destacada */}
      {currentUserData && (
        <div className="container-center mt-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="bg-gradient-to-r from-primary-500 to-purple-600 text-white border-none shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl font-bold">
                    {currentUserData.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{currentUserData.name}</h3>
                  <div className="flex items-center gap-4 text-white/80 text-sm">
                    <span>Posición #{currentUserRank}</span>
                    <span>•</span>
                    <span>Nivel {currentUserData.level}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{currentUserData.totalScore.toLocaleString()}</div>
                  <div className="text-sm text-white/80">puntos</div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
      
      {/* Búsqueda y filtros */}
      <div className="container-center mt-6">
        <Card className="bg-white shadow-lg border-none">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Búsqueda */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
              <input
                type="text"
                placeholder="Buscar jugador por nombre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Buscar jugador por nombre"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>
            
            {/* Ordenar */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                aria-expanded={showFilters}
                aria-haspopup="listbox"
                aria-label={`Ordenar por ${sortOptions.find(o => o.value === sortBy)?.label}. Click para cambiar`}
                className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors w-full sm:w-auto justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              >
                <Filter className="w-4 h-4 text-gray-500" aria-hidden="true" />
                <span className="text-gray-700">
                  Ordenar por: {sortOptions.find(o => o.value === sortBy)?.label}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showFilters ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
              
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    role="listbox"
                    aria-label="Opciones de ordenamiento"
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20"
                  >
                    {sortOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value as SortBy);
                            setShowFilters(false);
                          }}
                          role="option"
                          aria-selected={sortBy === option.value}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors focus:outline-none focus-visible:bg-primary-100 ${
                            sortBy === option.value
                              ? 'bg-primary-50 text-primary-600'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="w-4 h-4" aria-hidden="true" />
                          {option.label}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Lista de jugadores */}
      <div className="container-center mt-6 pb-12">
        <div className="space-y-3" role="list" aria-label="Lista de jugadores en el ranking">
          {sortedUsers.length === 0 ? (
            <Card className="text-center py-12">
              <User className="w-16 h-16 mx-auto text-gray-300 mb-4" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {searchQuery ? 'No se encontraron jugadores' : 'Sin jugadores aún'}
              </h3>
              <p className="text-gray-500">
                {searchQuery 
                  ? 'Intenta con otro nombre o correo electrónico'
                  : 'Sé el primero en jugar y aparecer en el ranking'
                }
              </p>
            </Card>
          ) : (
            <>
              {/* Top 3 destacado */}
              {!searchQuery && sortedUsers.length >= 3 && (
                <div className="grid grid-cols-3 gap-4 mb-6" role="group" aria-label="Top 3 jugadores">
                  {/* Segundo lugar */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-center pt-8"
                    tabIndex={0}
                    aria-label={`Segundo lugar: ${sortedUsers[1]?.name}, ${sortedUsers[1]?.totalScore.toLocaleString()} puntos`}
                  >
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center shadow-lg mb-2" aria-hidden="true">
                      <span className="text-white font-bold text-xl">
                        {sortedUsers[1]?.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <Medal className="w-6 h-6 mx-auto text-gray-400 mb-1" aria-hidden="true" />
                    <h4 className="font-semibold text-gray-800 truncate px-2">{sortedUsers[1]?.name}</h4>
                    <p className="text-sm text-gray-500">{sortedUsers[1]?.totalScore.toLocaleString()} pts</p>
                  </motion.div>
                  
                  {/* Primer lugar */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                    tabIndex={0}
                    aria-label={`Primer lugar: ${sortedUsers[0]?.name}, ${sortedUsers[0]?.totalScore.toLocaleString()} puntos`}
                  >
                    <div className="relative">
                      <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -top-4 left-1/2 -translate-x-1/2"
                        aria-hidden="true"
                      >
                        <Crown className="w-8 h-8 text-amber-500" aria-hidden="true" />
                      </motion.div>
                      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-xl shadow-amber-500/30" aria-hidden="true">
                        <span className="text-white font-bold text-2xl">
                          {sortedUsers[0]?.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <Trophy className="w-6 h-6 mx-auto text-amber-500 mt-2 mb-1" aria-hidden="true" />
                    <h4 className="font-bold text-gray-900 truncate px-2">{sortedUsers[0]?.name}</h4>
                    <p className="text-sm font-semibold text-amber-600">{sortedUsers[0]?.totalScore.toLocaleString()} pts</p>
                  </motion.div>
                  
                  {/* Tercer lugar */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center pt-8"
                    tabIndex={0}
                    aria-label={`Tercer lugar: ${sortedUsers[2]?.name}, ${sortedUsers[2]?.totalScore.toLocaleString()} puntos`}
                  >
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-600 to-amber-700 rounded-full flex items-center justify-center shadow-lg mb-2" aria-hidden="true">
                      <span className="text-white font-bold text-xl">
                        {sortedUsers[2]?.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <Medal className="w-6 h-6 mx-auto text-amber-700 mb-1" aria-hidden="true" />
                    <h4 className="font-semibold text-gray-800 truncate px-2">{sortedUsers[2]?.name}</h4>
                    <p className="text-sm text-gray-500">{sortedUsers[2]?.totalScore.toLocaleString()} pts</p>
                  </motion.div>
                </div>
              )}
              
              {/* Lista completa */}
              {sortedUsers.map((user, index) => (
                <UserCard
                  key={user.id}
                  user={user}
                  rank={index + 1}
                  isCurrentUser={user.id === currentUser?.id}
                  sortBy={sortBy}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
