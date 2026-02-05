import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, ProgressBar } from '../ui';
import { Hash, Clock, Trophy, Target } from 'lucide-react';

interface CountingGameProps {
  onComplete: (score: number, accuracy: number) => void;
}

const EMOJIS = ['🍎', '🍊', '🍋', '🍇', '🍓', '🍒', '🥝', '🍑'];
const ROUNDS = 6;

interface RoundData {
  grid: string[];
  targetEmoji: string;
  correctCount: number;
}

export const CountingGame: React.FC<CountingGameProps> = ({ onComplete }) => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [roundData, setRoundData] = useState<RoundData | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [options, setOptions] = useState<number[]>([]);

  const generateRound = useCallback(() => {
    // Seleccionar 3-4 tipos de emojis para esta ronda
    const shuffledEmojis = [...EMOJIS].sort(() => Math.random() - 0.5);
    const usedEmojis = shuffledEmojis.slice(0, 3 + Math.floor(Math.random() * 2));
    
    // Generar grid con 16-25 elementos
    const gridSize = 16 + Math.floor(Math.random() * 10);
    const grid: string[] = [];
    
    for (let i = 0; i < gridSize; i++) {
      grid.push(usedEmojis[Math.floor(Math.random() * usedEmojis.length)]);
    }
    
    // Elegir emoji objetivo
    const targetEmoji = usedEmojis[Math.floor(Math.random() * usedEmojis.length)];
    const correctCount = grid.filter(e => e === targetEmoji).length;
    
    // Generar opciones de respuesta (incluyendo la correcta)
    const wrongOptions = new Set<number>();
    while (wrongOptions.size < 3) {
      const wrong = correctCount + Math.floor(Math.random() * 7) - 3;
      if (wrong > 0 && wrong !== correctCount) {
        wrongOptions.add(wrong);
      }
    }
    
    const allOptions = [correctCount, ...Array.from(wrongOptions)].sort(() => Math.random() - 0.5);
    
    setRoundData({ grid, targetEmoji, correctCount });
    setOptions(allOptions);
    setTimeLeft(15);
    setSelectedAnswer(null);
    setShowFeedback(false);
  }, []);

  useEffect(() => {
    generateRound();
  }, []);

  useEffect(() => {
    if (showFeedback || !roundData) return;
    
    if (timeLeft <= 0) {
      handleAnswer(-1); // Tiempo agotado
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, showFeedback, roundData]);

  const handleAnswer = (answer: number) => {
    if (showFeedback || !roundData) return;
    
    setSelectedAnswer(answer);
    setShowFeedback(true);
    
    const isCorrect = answer === roundData.correctCount;
    
    if (isCorrect) {
      const timeBonus = timeLeft * 10;
      setScore(score + 150 + timeBonus);
      setCorrectAnswers(correctAnswers + 1);
    }

    setTimeout(() => {
      if (round >= ROUNDS) {
        const accuracy = (correctAnswers + (isCorrect ? 1 : 0)) / ROUNDS;
        onComplete(score + (isCorrect ? 150 + timeLeft * 10 : 0), accuracy);
      } else {
        setRound(round + 1);
        generateRound();
      }
    }, 2000);
  };

  if (!roundData) return null;

  const progress = (round / ROUNDS) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Panel de estadísticas */}
      <Card className="mb-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100">
        <div className="flex flex-wrap justify-between items-center gap-4" role="status" aria-live="polite">
          <div className="flex items-center gap-6">
            <div className="text-center" tabIndex={0} aria-label={`Ronda ${round} de ${ROUNDS}`}>
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                <Target className="w-4 h-4 text-indigo-500" aria-hidden="true" />
                <span>Ronda</span>
              </div>
              <div className="text-2xl font-bold text-primary-600">
                {round} / {ROUNDS}
              </div>
            </div>
            
            <div className="h-10 w-px bg-gray-200" aria-hidden="true" />
            
            <div className="text-center" tabIndex={0} aria-label={`Puntos: ${score}`}>
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                <Trophy className="w-4 h-4 text-amber-500" aria-hidden="true" />
                <span>Puntos</span>
              </div>
              <div className="text-2xl font-bold text-success-600">{score}</div>
            </div>
            
            <div className="h-10 w-px bg-gray-200" aria-hidden="true" />
            
            <div className="text-center" tabIndex={0} aria-label={`Tiempo restante: ${timeLeft} segundos`}>
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                <Clock className="w-4 h-4 text-red-500" aria-hidden="true" />
                <span>Tiempo</span>
              </div>
              <div className={`text-2xl font-bold ${timeLeft <= 5 ? 'text-error-600 animate-pulse' : 'text-warning-600'}`}>
                {timeLeft}s
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <ProgressBar 
            value={progress} 
            max={100} 
            variant="primary" 
            size="medium"
            label="Progreso del juego"
          />
        </div>
      </Card>

      {/* Instrucción */}
      <Card className="mb-4 text-center bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <div className="flex items-center justify-center gap-3" tabIndex={0} aria-live="polite">
          <Hash className="w-6 h-6 text-amber-600" aria-hidden="true" />
          <p className="text-lg font-bold text-gray-900">
            ¿Cuántos <span className="text-3xl mx-2" aria-label={`emoji ${roundData.targetEmoji}`}>{roundData.targetEmoji}</span> hay?
          </p>
        </div>
      </Card>

      {/* Grid de elementos */}
      <Card className="mb-4">
        <div className="flex flex-wrap gap-2 justify-center p-2">
          {roundData.grid.map((emoji, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.02 }}
              className={`
                text-2xl sm:text-3xl p-1 rounded-lg transition-all
                ${emoji === roundData.targetEmoji && showFeedback ? 'bg-amber-200 ring-2 ring-amber-400' : ''}
              `}
            >
              {emoji}
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Opciones de respuesta */}
      <div className="grid grid-cols-4 gap-3">
        {options.map((option, index) => {
          const isCorrect = option === roundData.correctCount;
          const isSelected = selectedAnswer === option;
          
          return (
            <motion.button
              key={index}
              onClick={() => handleAnswer(option)}
              disabled={showFeedback}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`
                py-4 rounded-xl text-2xl font-bold
                transition-all duration-200
                focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-500
                ${showFeedback 
                  ? isCorrect 
                    ? 'bg-green-500 text-white ring-4 ring-green-300' 
                    : isSelected 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  : 'bg-white border-2 border-gray-200 text-gray-900 hover:border-primary-400 hover:bg-primary-50 cursor-pointer'
                }
              `}
              whileHover={!showFeedback ? { scale: 1.05 } : {}}
              whileTap={!showFeedback ? { scale: 0.95 } : {}}
            >
              {option}
            </motion.button>
          );
        })}
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mt-4 p-4 rounded-xl text-center font-bold text-lg ${
              selectedAnswer === roundData.correctCount
                ? 'bg-green-100 text-green-700 border-2 border-green-300'
                : 'bg-red-100 text-red-700 border-2 border-red-300'
            }`}
          >
            {selectedAnswer === roundData.correctCount 
              ? `¡Correcto! Había ${roundData.correctCount} ${roundData.targetEmoji}`
              : `Incorrecto. La respuesta era ${roundData.correctCount}`
            }
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
