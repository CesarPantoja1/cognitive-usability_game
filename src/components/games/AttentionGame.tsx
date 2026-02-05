import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, ProgressBar } from '../ui';
import { Eye, Clock, Trophy, Target, Zap } from 'lucide-react';

interface AttentionGameProps {
  onComplete: (score: number, accuracy: number) => void;
}

const SHAPES = [
  { emoji: '🔴', name: 'Círculo rojo' },
  { emoji: '🔵', name: 'Círculo azul' },
  { emoji: '🟢', name: 'Círculo verde' },
  { emoji: '🟡', name: 'Círculo amarillo' },
  { emoji: '🟣', name: 'Círculo morado' },
  { emoji: '🟤', name: 'Círculo marrón' },
];
const GRID_SIZE = 16;
const ROUNDS = 8;

export const AttentionGame: React.FC<AttentionGameProps> = ({ onComplete }) => {
  const [grid, setGrid] = useState<string[]>([]);
  const [targetShape, setTargetShape] = useState('');
  const [differentIndex, setDifferentIndex] = useState(-1);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const startNewRound = useCallback(() => {
    setIsAnimating(true);
    setShowFeedback(null);
    
    setTimeout(() => {
      // Seleccionar forma objetivo
      const targetIndex = Math.floor(Math.random() * SHAPES.length);
      const target = SHAPES[targetIndex].emoji;
      setTargetShape(target);

      // Crear grid con una forma diferente
      const newGrid: string[] = [];
      const diffIdx = Math.floor(Math.random() * GRID_SIZE);
      setDifferentIndex(diffIdx);

      // Obtener una forma diferente
      const differentShapeIndex = (targetIndex + 1 + Math.floor(Math.random() * (SHAPES.length - 1))) % SHAPES.length;
      const differentShape = SHAPES[differentShapeIndex].emoji;

      for (let i = 0; i < GRID_SIZE; i++) {
        if (i === diffIdx) {
          newGrid.push(differentShape);
        } else {
          newGrid.push(target);
        }
      }

      setGrid(newGrid);
      setTimeLeft(10);
      setIsAnimating(false);
    }, 300);
  }, []);

  useEffect(() => {
    startNewRound();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0 || showFeedback) {
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
      
      if (timeLeft - 1 <= 0) {
        handleTimeout();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, showFeedback]);

  const handleTimeout = () => {
    setShowFeedback('incorrect');
    
    setTimeout(() => {
      if (round >= ROUNDS) {
        endGame();
      } else {
        setRound(round + 1);
        startNewRound();
      }
    }, 1500);
  };

  const handleShapeClick = (index: number) => {
    if (showFeedback || isAnimating) return;

    const isCorrect = index === differentIndex;

    setShowFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      const timeBonus = timeLeft * 15;
      setScore(score + 100 + timeBonus);
      setCorrectAnswers(correctAnswers + 1);
    }

    setTimeout(() => {
      if (round >= ROUNDS) {
        endGame();
      } else {
        setRound(round + 1);
        startNewRound();
      }
    }, 1500);
  };

  const endGame = () => {
    const accuracy = correctAnswers / ROUNDS;
    onComplete(score, accuracy);
  };

  const progress = (round / ROUNDS) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Panel de estadísticas */}
      <Card className="mb-6 bg-gradient-to-r from-orange-50 to-amber-50 border-orange-100">
        <div className="flex flex-wrap justify-between items-center gap-4" role="status" aria-live="polite">
          <div className="flex items-center gap-6">
            <div className="text-center" tabIndex={0} aria-label={`Ronda ${round} de ${ROUNDS}`}>
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                <Target className="w-4 h-4 text-orange-500" aria-hidden="true" />
                <span>Ronda</span>
              </div>
              <div className="text-2xl font-bold text-primary-600">
                {round} / {ROUNDS}
              </div>
            </div>
            
            <div className="h-12 w-px bg-gray-200" aria-hidden="true" />
            
            <div className="text-center" tabIndex={0} aria-label={`Puntos: ${score}`}>
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                <Trophy className="w-4 h-4 text-amber-500" aria-hidden="true" />
                <span>Puntos</span>
              </div>
              <div className="text-2xl font-bold text-success-600">{score}</div>
            </div>
            
            <div className="h-12 w-px bg-gray-200" aria-hidden="true" />
            
            <div className="text-center" tabIndex={0} aria-label={`Tiempo restante: ${timeLeft} segundos`}>
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                <Clock className="w-4 h-4 text-red-500" aria-hidden="true" />
                <span>Tiempo</span>
              </div>
              <div className={`text-2xl font-bold ${timeLeft <= 3 ? 'text-error-600 animate-pulse' : 'text-warning-600'}`}>
                {timeLeft}s
              </div>
            </div>
          </div>
        </div>
        
        {/* Barra de progreso */}
        <div className="mt-4">
          <ProgressBar 
            value={progress} 
            max={100} 
            variant="warning" 
            size="medium"
            label="Progreso del juego"
          />
        </div>
      </Card>

      {/* Instrucción */}
      <Card className="mb-6 text-center bg-gradient-to-r from-primary-50 to-indigo-50 border-primary-100 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 mb-2" tabIndex={0}>
            <Eye className="w-6 h-6 text-primary-600" aria-hidden="true" />
            <p className="text-xl font-bold text-gray-900">
              Encuentra la forma DIFERENTE
            </p>
          </div>
          <div className="flex items-center justify-center gap-4" aria-live="polite" tabIndex={0}>
            <span className="text-gray-600">La mayoría son:</span>
            <motion.span 
              key={targetShape}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-5xl"
              aria-label={`Forma objetivo: ${targetShape}`}
            >
              {targetShape}
            </motion.span>
            <span className="text-gray-600">→ Busca la diferente</span>
          </div>
        </div>
      </Card>

      {/* Grid de formas */}
      <motion.div 
        className="grid grid-cols-4 gap-2 sm:gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: isAnimating ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        {grid.map((shape, index) => {
          const isCorrectAnswer = showFeedback && index === differentIndex;
          
          return (
            <motion.button
              key={`${round}-${index}`}
              onClick={() => handleShapeClick(index)}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.03 }}
              disabled={!!showFeedback}
              className={`
                aspect-square rounded-lg sm:rounded-xl bg-white border-2 sm:border-4
                transition-all duration-200 text-2xl sm:text-3xl
                flex items-center justify-center
                focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-500 focus-visible:ring-offset-2
                ${isCorrectAnswer 
                  ? 'border-green-400 bg-green-100 ring-4 ring-green-300' 
                  : showFeedback && index === differentIndex
                    ? 'border-green-400 bg-green-100'
                    : 'border-gray-200 hover:border-primary-400 hover:shadow-lg cursor-pointer'
                }
                ${showFeedback && !isCorrectAnswer ? 'opacity-50' : ''}
              `}
              whileHover={!showFeedback ? { scale: 1.05 } : {}}
              whileTap={!showFeedback ? { scale: 0.95 } : {}}
              aria-label={`Forma ${index + 1}: ${shape}`}
            >
              {shape}
              {isCorrectAnswer && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="text-2xl">✓</div>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Feedback visual */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="alert"
            aria-live="assertive"
            tabIndex={0}
            className={`mt-6 p-4 rounded-xl text-center font-bold text-lg ${
              showFeedback === 'correct'
                ? 'bg-green-100 text-green-700 border-2 border-green-300'
                : 'bg-red-100 text-red-700 border-2 border-red-300'
            }`}
          >
            {showFeedback === 'correct' ? (
              <span className="flex items-center justify-center gap-2">
                <Zap className="w-5 h-5" aria-hidden="true" />
                ¡Correcto! +{timeLeft * 15 + 100} puntos
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                ¡Tiempo agotado o incorrecto! La diferente era la marcada en verde
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
