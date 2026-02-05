import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, Badge } from '../components/ui';
import { useProgress } from '../contexts/ProgressContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useAuth } from '../contexts/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { 
  Play, 
  BarChart3, 
  Settings, 
  Brain, 
  Puzzle, 
  Target, 
  Sparkles,
  Trophy,
  Star,
  Zap,
  Heart,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Calendar,
  LogOut,
  User,
  Medal,
  ChevronDown
} from 'lucide-react';

// Datos para las animaciones de las partículas de fondo
const floatingShapes = [
  { icon: '🧠', delay: 0, duration: 6, x: 10, y: 20 },
  { icon: '🎯', delay: 1, duration: 7, x: 85, y: 15 },
  { icon: '💡', delay: 2, duration: 5, x: 75, y: 70 },
  { icon: '⭐', delay: 0.5, duration: 8, x: 15, y: 75 },
  { icon: '🎮', delay: 1.5, duration: 6, x: 90, y: 45 },
  { icon: '🏆', delay: 3, duration: 7, x: 5, y: 50 },
];

// Características de la aplicación
const features = [
  {
    icon: Brain,
    title: 'Memoria',
    description: 'Fortalece tu capacidad de recordar',
    color: 'from-blue-500 to-cyan-400',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: Puzzle,
    title: 'Lógica',
    description: 'Desarrolla el razonamiento',
    color: 'from-purple-500 to-pink-400',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    icon: Target,
    title: 'Atención',
    description: 'Mejora tu concentración',
    color: 'from-orange-500 to-amber-400',
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-600',
  },
];

// Tips diarios
const dailyTips = [
  "🎯 Practica 10 minutos al día para mejores resultados",
  "💡 Los juegos de memoria mejoran la concentración",
  "🧘 Toma descansos entre sesiones para mayor efectividad",
  "⭐ Intenta nuevos juegos para ejercitar diferentes habilidades",
  "🏆 La consistencia es más importante que la intensidad",
];

export const HomePageEnhanced: React.FC = () => {
  usePageTitle('Inicio');
  const navigate = useNavigate();
  const { progress } = useProgress();
  const { settings } = useAccessibility();
  const { user, logout } = useAuth();
  const [currentTip, setCurrentTip] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Cerrar menú con Escape (WCAG 2.1.2 - Sin trampas de teclado)
  const closeMenu = useCallback(() => {
    setShowUserMenu(false);
  }, []);

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showUserMenu) {
        closeMenu();
        // Devolver foco al botón que abrió el menú
        const menuButton = document.querySelector('[aria-haspopup="menu"]') as HTMLElement;
        menuButton?.focus();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [showUserMenu, closeMenu]);

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };
    
    if (showUserMenu) {
      document.addEventListener('click', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showUserMenu]);

  // Rotar tips cada 5 segundos
  useEffect(() => {
    if (settings.reducedMotion) return;
    
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % dailyTips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [settings.reducedMotion]);

  // Obtener saludo según la hora
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '¡Buenos días!';
    if (hour < 18) return '¡Buenas tardes!';
    return '¡Buenas noches!';
  };

  // Nivel actual formateado
  const levelDisplay = `Nivel ${progress.currentLevel}`;
  const hasPlayed = progress.gamesPlayed > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden relative">
      {/* Partículas flotantes de fondo */}
      {!settings.reducedMotion && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          {floatingShapes.map((shape, index) => (
            <motion.div
              key={index}
              className="absolute text-4xl opacity-20"
              style={{ left: `${shape.x}%`, top: `${shape.y}%` }}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: shape.duration,
                delay: shape.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {shape.icon}
            </motion.div>
          ))}
        </div>
      )}

      {/* Header con estadísticas rápidas */}
      <header className="relative z-10">
        <div className="container-center py-4">
          <div className="flex justify-between items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
              tabIndex={0}
              role="banner"
              aria-label="MindGym - Aplicación de entrenamiento cognitivo"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg" aria-hidden="true">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-600">MindGym</h2>
                <p className="text-xs text-gray-400">Entrenamiento Cognitivo</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              {hasPlayed && (
                <div className="hidden sm:flex items-center gap-4 mr-4" role="status" aria-label="Resumen de tu progreso">
                  <div 
                    className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm"
                    tabIndex={0}
                    aria-label={`Puntuación total: ${progress.totalScore.toLocaleString()} puntos`}
                  >
                    <Trophy className="w-4 h-4 text-amber-500" aria-hidden="true" />
                    <span className="text-sm font-semibold text-gray-700">
                      {progress.totalScore.toLocaleString()} pts
                    </span>
                  </div>
                  <div 
                    className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm"
                    tabIndex={0}
                    aria-label={`Tu nivel actual: ${levelDisplay}`}
                  >
                    <Star className="w-4 h-4 text-primary-500" aria-hidden="true" />
                    <span className="text-sm font-semibold text-gray-700">
                      {levelDisplay}
                    </span>
                  </div>
                </div>
              )}
              
              {/* Botón de Leaderboard */}
              <button
                type="button"
                onClick={() => navigate('/leaderboard')}
                className="p-3 bg-gradient-to-r from-primary-500 to-purple-600 backdrop-blur-sm rounded-xl hover:from-primary-600 hover:to-purple-700 transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-offset-2"
                aria-label="Ver tabla de posiciones"
                tabIndex={0}
              >
                <Trophy className="w-5 h-5 text-white" aria-hidden="true" />
              </button>

              {/* Botón de Configuración */}
              <button
                type="button"
                onClick={() => navigate('/settings')}
                className="p-3 bg-white/80 backdrop-blur-sm rounded-xl hover:bg-white transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-offset-2"
                aria-label="Configuración y accesibilidad"
                tabIndex={0}
              >
                <Settings className="w-5 h-5 text-gray-600" aria-hidden="true" />
              </button>

              {/* Menú de usuario */}
              <div className="relative user-menu-container">
                <button
                  type="button"
                  onClick={() => setShowUserMenu(prev => !prev)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setShowUserMenu(prev => !prev);
                    }
                    if (e.key === 'Escape') {
                      setShowUserMenu(false);
                    }
                  }}
                  className="flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-xl hover:bg-white transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-offset-2"
                  aria-label={`Menú de usuario para ${user?.name || 'Usuario'}`}
                  aria-expanded={showUserMenu}
                  aria-haspopup="menu"
                  tabIndex={0}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center" aria-hidden="true">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden sm:inline text-sm font-medium text-gray-700 max-w-[100px] truncate">
                    {user?.name || 'Usuario'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>

                {showUserMenu && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                    role="menu"
                    aria-label="Opciones de usuario"
                  >
                    <div className="p-4 bg-gradient-to-r from-primary-50 to-purple-50 border-b border-gray-100">
                      <p className="font-semibold text-gray-800" tabIndex={0}>{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate" tabIndex={0}>{user?.email}</p>
                    </div>
                    <div className="p-2" role="none">
                      <button
                        type="button"
                        role="menuitem"
                        tabIndex={0}
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate('/progress');
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setShowUserMenu(false);
                            navigate('/progress');
                          }
                        }}
                        className="w-full flex items-center gap-3 px-3 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors focus:outline-none focus:bg-primary-100 focus:text-primary-700"
                      >
                        <BarChart3 className="w-4 h-4" aria-hidden="true" />
                        Ver mi progreso
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        tabIndex={0}
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate('/leaderboard');
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setShowUserMenu(false);
                            navigate('/leaderboard');
                          }
                        }}
                        className="w-full flex items-center gap-3 px-3 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors focus:outline-none focus:bg-primary-100 focus:text-primary-700"
                      >
                        <Medal className="w-4 h-4" aria-hidden="true" />
                        Tabla de posiciones
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        tabIndex={0}
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate('/settings');
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setShowUserMenu(false);
                            navigate('/settings');
                          }
                        }}
                        className="w-full flex items-center gap-3 px-3 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors focus:outline-none focus:bg-primary-100 focus:text-primary-700"
                      >
                        <Settings className="w-4 h-4" aria-hidden="true" />
                        Configuración
                      </button>
                      <hr className="my-2 border-gray-100" aria-hidden="true" />
                      <button
                        type="button"
                        role="menuitem"
                        tabIndex={0}
                        onClick={() => {
                          setShowUserMenu(false);
                          logout();
                          navigate('/login');
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setShowUserMenu(false);
                            logout();
                            navigate('/login');
                          }
                        }}
                        className="w-full flex items-center gap-3 px-3 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:bg-red-100"
                      >
                        <LogOut className="w-4 h-4" aria-hidden="true" />
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="container-center py-8 relative z-10">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div 
            className="inline-block mb-6"
            animate={!settings.reducedMotion ? { 
              scale: [1, 1.05, 1],
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="relative">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary-400 via-primary-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-primary-500/30">
                <span className="text-6xl" role="img" aria-label="Cerebro">🧠</span>
              </div>
              <motion.div
                className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
                animate={!settings.reducedMotion ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4 text-white" />
              </motion.div>
            </div>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4" tabIndex={0}>
            <span className="bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {getGreeting()}
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed" tabIndex={0}>
            Ejercita tu mente con juegos diseñados para 
            <span className="font-semibold text-primary-600"> estimular </span>
            tu memoria, lógica y atención
          </p>

          {/* CTA Principal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              onClick={() => navigate('/training')}
              size="large"
              icon={<Play size={24} />}
              className="min-w-[280px] bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 shadow-xl shadow-primary-500/25"
              aria-label={hasPlayed ? 'Continuar tu entrenamiento cognitivo' : 'Comenzar a entrenar tu mente ahora'}
            >
              {hasPlayed ? 'Seguir entrenando' : '¡Comenzar a entrenar!'}
            </Button>
            
            {hasPlayed && (
              <Button
                onClick={() => navigate('/progress')}
                variant="secondary"
                size="large"
                icon={<BarChart3 size={24} />}
                className="min-w-[200px]"
                aria-label="Ver mis estadísticas y logros"
              >
                Ver mis estadísticas
              </Button>
            )}
          </motion.div>
        </motion.section>

        {/* Tip del día */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
          aria-labelledby="tip-heading"
        >
          <div className="max-w-2xl mx-auto">
            <div 
              className="relative bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-5 overflow-hidden"
              tabIndex={0}
              role="region"
              aria-label="Consejo diario de entrenamiento"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full -mr-16 -mt-16" aria-hidden="true" />
              <div className="flex items-center gap-4 relative">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg" aria-hidden="true">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p id="tip-heading" className="text-xs font-medium text-amber-600 uppercase tracking-wide mb-1">
                    Tip del día
                  </p>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={currentTip}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-gray-700 font-medium"
                      aria-live="polite"
                      aria-atomic="true"
                    >
                      {dailyTips[currentTip]}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Características principales */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
          aria-labelledby="areas-heading"
        >
          <h2 id="areas-heading" className="text-2xl font-bold text-gray-900 text-center mb-8" tabIndex={0}>
            Áreas de Entrenamiento
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <Card
                  interactive
                  onClick={() => navigate('/training')}
                  className="group cursor-pointer relative overflow-hidden h-full"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate('/training');
                    }
                  }}
                  aria-label={`Entrenar ${feature.title}`}
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  <div className="relative z-10">
                    <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon size={32} className={feature.iconColor} />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-600" tabIndex={0}>
                      {feature.description}
                    </p>
                    
                    <div className="mt-4 flex items-center text-primary-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-sm">Explorar juegos</span>
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Estadísticas del usuario (si ha jugado) */}
        {hasPlayed && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-12"
            aria-labelledby="progress-heading"
          >
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 id="progress-heading" className="text-2xl font-bold text-gray-900" tabIndex={0}>
                  Tu Progreso
                </h2>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => navigate('/progress')}
                  icon={<ArrowRight size={18} />}
                  iconPosition="right"
                >
                  Ver todo
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4" role="list" aria-label="Estadísticas de tu progreso">
                <Card className="text-center bg-gradient-to-br from-primary-50 to-blue-50 border-primary-100" tabIndex={0} role="listitem" aria-label={`Puntos totales: ${progress.totalScore.toLocaleString()}`}>
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-3" aria-hidden="true">
                    <Trophy className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {progress.totalScore.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Puntos Totales</div>
                </Card>

                <Card className="text-center bg-gradient-to-br from-green-50 to-emerald-50 border-green-100" tabIndex={0} role="listitem" aria-label={`Juegos completados: ${progress.gamesCompleted}`}>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3" aria-hidden="true">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {progress.gamesCompleted}
                  </div>
                  <div className="text-sm text-gray-600">Juegos Completados</div>
                </Card>

                <Card className="text-center bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100" tabIndex={0} role="listitem" aria-label={`Precisión promedio: ${progress.accuracyAverage} por ciento`}>
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-3" aria-hidden="true">
                    <TrendingUp className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {progress.accuracyAverage}%
                  </div>
                  <div className="text-sm text-gray-600">Precisión</div>
                </Card>

                <Card className="text-center bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100" tabIndex={0} role="listitem" aria-label={`Nivel actual: ${progress.currentLevel}`}>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3" aria-hidden="true">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {progress.currentLevel}
                  </div>
                  <div className="text-sm text-gray-600">Nivel Actual</div>
                </Card>
              </div>
            </div>
          </motion.section>
        )}

        {/* Beneficios de la app */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-12"
          aria-labelledby="benefits-heading"
        >
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white overflow-hidden relative">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50" aria-hidden="true" />
              
              <div className="relative z-10 text-center py-4">
                <div className="flex justify-center mb-4" aria-hidden="true">
                  <div className="flex -space-x-2">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                
                <h3 id="benefits-heading" className="text-2xl font-bold mb-3" tabIndex={0}>
                  Diseñado para ti
                </h3>
                
                <p className="text-white/90 max-w-xl mx-auto mb-6 leading-relaxed" tabIndex={0}>
                  Esta aplicación está diseñada especialmente con enfoque en 
                  <span className="font-semibold"> accesibilidad visual</span>. 
                  Todos los elementos importantes se comunican mediante iconos, colores 
                  y texto claro.
                </p>
                
                <ul className="flex flex-wrap gap-3 justify-center" role="list" aria-label="Características de accesibilidad">
                  <li>
                    <Badge className="bg-white/20 text-white border-white/30 px-4 py-2" tabIndex={0}>
                      ✓ Sin dependencia de audio
                    </Badge>
                  </li>
                  <li>
                    <Badge className="bg-white/20 text-white border-white/30 px-4 py-2" tabIndex={0}>
                      ✓ Navegación por teclado
                    </Badge>
                  </li>
                  <li>
                    <Badge className="bg-white/20 text-white border-white/30 px-4 py-2" tabIndex={0}>
                      ✓ Alto contraste disponible
                    </Badge>
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </motion.section>

        {/* Footer con navegación secundaria */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center pt-8 pb-4 border-t border-gray-200"
          role="contentinfo"
        >
          <nav aria-label="Navegación secundaria" className="flex flex-wrap justify-center gap-6">
            <button
              type="button"
              onClick={() => navigate('/settings')}
              className="text-gray-500 hover:text-primary-600 transition-colors flex items-center gap-2 font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-lg px-2 py-1"
              tabIndex={0}
            >
              <Settings size={18} aria-hidden="true" />
              Configuración
            </button>
            <button
              type="button"
              onClick={() => navigate('/progress')}
              className="text-gray-500 hover:text-primary-600 transition-colors flex items-center gap-2 font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-lg px-2 py-1"
              tabIndex={0}
            >
              <BarChart3 size={18} aria-hidden="true" />
              Mi Progreso
            </button>
          </nav>
          <p className="text-sm text-gray-400 mt-6" tabIndex={0}>
            MindGym • Entrenamiento Cognitivo Accesible
          </p>
        </motion.footer>
      </main>
    </div>
  );
};

export default HomePageEnhanced;
