import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card } from '../components/ui';
import { GAMES_CATALOG, getGamesByCategory } from '../data/gamesData';
import { ArrowLeft, Brain, Target, Sparkles, Clock, Trophy, Zap, Filter, Puzzle } from 'lucide-react';
import { getIcon } from '../utils/iconMapping';

type Category = 'all' | 'memory' | 'logic' | 'attention';

const categoryInfo = {
  all: {
    icon: Sparkles,
    label: 'Todos',
    color: 'from-indigo-500 to-purple-500',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-600',
    description: 'Explora todos los juegos disponibles'
  },
  memory: {
    icon: Brain,
    label: 'Memoria',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    description: 'Ejercita tu capacidad de recordar'
  },
  logic: {
    icon: Puzzle,
    label: 'Lógica',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    description: 'Desarrolla el razonamiento lógico'
  },
  attention: {
    icon: Target,
    label: 'Atención',
    color: 'from-orange-500 to-amber-500',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-600',
    description: 'Mejora tu concentración'
  },
};

const difficultyColors = {
  easy: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    border: 'border-green-200',
    label: 'Fácil',
    icon: '🌱'
  },
  medium: {
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    border: 'border-amber-200',
    label: 'Medio',
    icon: '⚡'
  },
  hard: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    border: 'border-red-200',
    label: 'Difícil',
    icon: '🔥'
  },
};

export const TrainingSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [hoveredGame, setHoveredGame] = useState<string | null>(null);

  const filteredGames = selectedCategory === 'all'
    ? GAMES_CATALOG
    : getGamesByCategory(selectedCategory);

  const currentCategoryInfo = categoryInfo[selectedCategory];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-20">
        <div className="container-center py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="secondary"
              onClick={() => navigate('/')}
              icon={<ArrowLeft size={20} />}
              aria-label="Volver al inicio"
              className="shadow-sm"
            >
              Volver
            </Button>

            <div className="hidden sm:flex items-center gap-2 text-gray-600">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span className="font-medium">{GAMES_CATALOG.length} juegos disponibles</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container-center py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-3xl mb-6 shadow-xl shadow-primary-500/25"
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <Zap className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Elige tu Entrenamiento
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Selecciona un juego para comenzar a ejercitar tu mente
          </p>
        </motion.div>

        {/* Filtros de categoría */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-500">Filtrar por categoría</span>
          </div>
          
          <div 
            className="flex flex-wrap gap-3 justify-center" 
            role="tablist" 
            aria-label="Filtrar por categoría"
          >
            {(Object.keys(categoryInfo) as Category[]).map((category) => {
              const info = categoryInfo[category];
              const Icon = info.icon;
              const isSelected = selectedCategory === category;
              
              return (
                <motion.button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls="games-panel"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300
                    focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-400 focus-visible:ring-offset-2
                    ${isSelected
                      ? `bg-gradient-to-r ${info.color} text-white shadow-lg shadow-${category === 'all' ? 'indigo' : category}-500/25`
                      : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg'
                    }
                  `}
                >
                  <Icon size={20} className={isSelected ? 'text-white' : info.textColor} />
                  <span>{info.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Descripción de la categoría */}
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className={`inline-flex items-center gap-3 px-6 py-3 ${currentCategoryInfo.bgColor} rounded-2xl`}>
            <currentCategoryInfo.icon className={`w-6 h-6 ${currentCategoryInfo.textColor}`} />
            <span className={`font-medium ${currentCategoryInfo.textColor}`}>
              {currentCategoryInfo.description}
            </span>
          </div>
        </motion.div>

        {/* Lista de juegos */}
        <div 
          id="games-panel"
          role="tabpanel"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredGames.map((game, index) => {
              const difficulty = difficultyColors[game.difficulty];
              const isHovered = hoveredGame === game.id;
              
              return (
                <motion.div
                  key={game.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  onMouseEnter={() => setHoveredGame(game.id)}
                  onMouseLeave={() => setHoveredGame(null)}
                >
                  <Card
                    interactive
                    onClick={() => navigate(`/instructions/${game.id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        navigate(`/instructions/${game.id}`);
                      }
                    }}
                    aria-label={`${game.name}: ${game.description}. Dificultad ${difficulty.label}, duración ${Math.floor(game.estimatedTime / 60)} minutos. Presiona Enter para ver instrucciones.`}
                    className="h-full flex flex-col group relative overflow-hidden"
                  >
                    {/* Background gradient on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${categoryInfo[game.category].color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                    
                    <div className="relative z-10">
                      {/* Header del juego */}
                      <div className="flex items-start justify-between mb-4">
                        <motion.div 
                          className={`w-16 h-16 ${categoryInfo[game.category].bgColor} rounded-2xl flex items-center justify-center`}
                          animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          {getIcon(game.icon, 32)}
                        </motion.div>
                        
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${difficulty.bg} ${difficulty.text} ${difficulty.border} border`}>
                          <span className="text-sm">{difficulty.icon}</span>
                          <span className="text-sm font-medium">{difficulty.label}</span>
                        </div>
                      </div>

                      {/* Título y descripción */}
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                        {game.name}
                      </h3>

                      <p className="text-gray-600 mb-4 flex-grow line-clamp-2">
                        {game.description}
                      </p>

                      {/* Footer con metadatos */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <Clock size={16} className="text-gray-400" />
                            <span>{Math.floor(game.estimatedTime / 60)} min</span>
                          </div>
                          <div className={`flex items-center gap-1.5 ${categoryInfo[game.category].textColor}`}>
                            {React.createElement(categoryInfo[game.category].icon, { size: 16 })}
                            <span className="capitalize">{categoryInfo[game.category].label}</span>
                          </div>
                        </div>
                        
                        <motion.div
                          className="flex items-center gap-1 text-primary-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                          animate={isHovered ? { x: 5 } : { x: 0 }}
                        >
                          <span className="text-sm">Ver instrucciones</span>
                          <motion.span
                            animate={isHovered ? { x: [0, 5, 0] } : {}}
                            transition={{ repeat: Infinity, duration: 1 }}
                            aria-hidden="true"
                          >
                            →
                          </motion.span>
                        </motion.div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Mensaje si no hay juegos */}
        {filteredGames.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Puzzle size={48} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No hay juegos en esta categoría
            </h3>
            <p className="text-gray-500">
              Prueba seleccionando otra categoría
            </p>
          </motion.div>
        )}

        {/* Info adicional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <Card className="bg-gradient-to-r from-primary-50 to-indigo-50 border-primary-100">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <div className="flex-shrink-0 w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center">
                <Brain className="w-8 h-8 text-primary-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  💡 Tip: Entrena regularmente
                </h3>
                <p className="text-gray-600">
                  La práctica diaria de 10-15 minutos es más efectiva que sesiones largas ocasionales. 
                  Intenta jugar al menos 3 juegos diferentes por día para ejercitar distintas áreas cognitivas.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default TrainingSelectionPage;
