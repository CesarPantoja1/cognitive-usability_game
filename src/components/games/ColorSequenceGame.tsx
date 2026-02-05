import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, ProgressBar } from '../ui';
import { Palette, Trophy, Target, CheckCircle, XCircle } from 'lucide-react';

interface ColorSequenceGameProps {
  onComplete: (score: number, accuracy: number) => void;
}

const COLORS = [
  { id: 'red', name: 'Rojo', bg: 'bg-red-500', light: 'bg-red-100', text: 'text-red-700', border: 'border-red-400' },
  { id: 'blue', name: 'Azul', bg: 'bg-blue-500', light: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-400' },
  { id: 'green', name: 'Verde', bg: 'bg-green-500', light: 'bg-green-100', text: 'text-green-700', border: 'border-green-400' },
  { id: 'yellow', name: 'Amarillo', bg: 'bg-yellow-400', light: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-400' },
  { id: 'purple', name: 'Morado', bg: 'bg-purple-500', light: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-400' },
  { id: 'orange', name: 'Naranja', bg: 'bg-orange-500', light: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-400' },
];

const ROUNDS = 8;

// Tipos de patrones
type PatternType = 'alternate' | 'repeat' | 'skip' | 'reverse';

interface RoundData {
  sequence: string[];
  correctAnswer: string;
  options: string[];
  patternType: PatternType;
}

export const ColorSequenceGame: React.FC<ColorSequenceGameProps> = ({ onComplete }) => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [roundData, setRoundData] = useState<RoundData | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const generatePattern = useCallback((): RoundData => {
    const patternTypes: PatternType[] = ['alternate', 'repeat', 'skip', 'reverse'];
    const patternType = patternTypes[Math.floor(Math.random() * patternTypes.length)];
    
    let sequence: string[] = [];
    let correctAnswer: string;
    
    const shuffledColors = [...COLORS].sort(() => Math.random() - 0.5);
    
    switch (patternType) {
      case 'alternate': {
        // A-B-A-B-A-? → B
        const colorA = shuffledColors[0].id;
        const colorB = shuffledColors[1].id;
        sequence = [colorA, colorB, colorA, colorB, colorA];
        correctAnswer = colorB;
        break;
      }
      case 'repeat': {
        // A-A-B-B-A-A-? → B
        const colorA = shuffledColors[0].id;
        const colorB = shuffledColors[1].id;
        sequence = [colorA, colorA, colorB, colorB, colorA, colorA];
        correctAnswer = colorB;
        break;
      }
      case 'skip': {
        // A-B-C-A-B-? → C
        const colorA = shuffledColors[0].id;
        const colorB = shuffledColors[1].id;
        const colorC = shuffledColors[2].id;
        sequence = [colorA, colorB, colorC, colorA, colorB];
        correctAnswer = colorC;
        break;
      }
      case 'reverse': {
        // A-B-C-C-B-? → A
        const colorA = shuffledColors[0].id;
        const colorB = shuffledColors[1].id;
        const colorC = shuffledColors[2].id;
        sequence = [colorA, colorB, colorC, colorC, colorB];
        correctAnswer = colorA;
        break;
      }
    }
    
    // Generar opciones (3 colores incluyendo el correcto)
    const wrongColors = shuffledColors
      .filter(c => c.id !== correctAnswer)
      .slice(0, 2)
      .map(c => c.id);
    
    const options = [correctAnswer, ...wrongColors].sort(() => Math.random() - 0.5);
    
    return { sequence, correctAnswer, options, patternType };
  }, []);

  useEffect(() => {
    setRoundData(generatePattern());
  }, []);

  const handleAnswer = (colorId: string) => {
    if (showFeedback || !roundData) return;
    
    setSelectedAnswer(colorId);
    setShowFeedback(true);
    
    const isCorrect = colorId === roundData.correctAnswer;
    
    if (isCorrect) {
      setScore(score + 150);
      setCorrectAnswers(correctAnswers + 1);
    }

    setTimeout(() => {
      if (round >= ROUNDS) {
        const accuracy = (correctAnswers + (isCorrect ? 1 : 0)) / ROUNDS;
        onComplete(score + (isCorrect ? 150 : 0), accuracy);
      } else {
        setRound(round + 1);
        setRoundData(generatePattern());
        setSelectedAnswer(null);
        setShowFeedback(false);
      }
    }, 1800);
  };

  const getColorById = (id: string) => COLORS.find(c => c.id === id) || COLORS[0];

  if (!roundData) return null;

  const progress = (round / ROUNDS) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Panel de estadísticas */}
      <Card className="mb-4 bg-gradient-to-r from-pink-50 to-rose-50 border-pink-100">
        <div className="flex flex-wrap justify-between items-center gap-4" role="status" aria-live="polite">
          <div className="flex items-center gap-6">
            <div className="text-center" tabIndex={0} aria-label={`Ronda ${round} de ${ROUNDS}`}>
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                <Target className="w-4 h-4 text-pink-500" aria-hidden="true" />
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
            
            <div className="text-center" tabIndex={0} aria-label={`Respuestas correctas: ${correctAnswers}`}>
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                <CheckCircle className="w-4 h-4 text-green-500" aria-hidden="true" />
                <span>Correctas</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
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
      <Card className="mb-4 text-center bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200">
        <div className="flex items-center justify-center gap-2" tabIndex={0}>
          <Palette className="w-6 h-6 text-violet-600" aria-hidden="true" />
          <p className="text-lg font-bold text-gray-900">
            ¿Qué color sigue en la secuencia?
          </p>
        </div>
      </Card>

      {/* Secuencia de colores */}
      <Card className="mb-4">
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          {roundData.sequence.map((colorId, index) => {
            const color = getColorById(colorId);
            return (
              <motion.div
                key={index}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.15 }}
                className={`
                  w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${color.bg}
                  shadow-md flex items-center justify-center
                  border-2 border-white
                `}
              >
                <span className="text-white text-xs font-bold opacity-80">
                  {index + 1}
                </span>
              </motion.div>
            );
          })}
          
          {/* Signo de interrogación */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: roundData.sequence.length * 0.15 }}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gray-200 border-4 border-dashed border-gray-400
                       flex items-center justify-center"
          >
            <span className="text-2xl font-bold text-gray-500">?</span>
          </motion.div>
        </div>
      </Card>

      {/* Opciones de respuesta */}
      <div className="grid grid-cols-3 gap-3">
        {roundData.options.map((colorId, index) => {
          const color = getColorById(colorId);
          const isCorrect = colorId === roundData.correctAnswer;
          const isSelected = selectedAnswer === colorId;
          
          return (
            <motion.button
              key={colorId}
              onClick={() => handleAnswer(colorId)}
              disabled={showFeedback}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`
                h-20 sm:h-24 rounded-xl font-bold text-white text-lg
                transition-all duration-200 relative overflow-hidden
                focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-2
                ${color.bg}
                ${showFeedback 
                  ? isCorrect 
                    ? 'ring-4 ring-green-400 ring-offset-2' 
                    : isSelected 
                      ? 'ring-4 ring-red-400 ring-offset-2 opacity-60' 
                      : 'opacity-40'
                  : 'hover:scale-105 hover:shadow-xl cursor-pointer'
                }
              `}
              whileHover={!showFeedback ? { scale: 1.05 } : {}}
              whileTap={!showFeedback ? { scale: 0.95 } : {}}
            >
              {color.name}
              
              {showFeedback && isCorrect && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1"
                >
                  <CheckCircle className="w-6 h-6 text-white drop-shadow-lg" />
                </motion.div>
              )}
              
              {showFeedback && isSelected && !isCorrect && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1"
                >
                  <XCircle className="w-6 h-6 text-white drop-shadow-lg" />
                </motion.div>
              )}
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
              selectedAnswer === roundData.correctAnswer
                ? 'bg-green-100 text-green-700 border-2 border-green-300'
                : 'bg-red-100 text-red-700 border-2 border-red-300'
            }`}
          >
            {selectedAnswer === roundData.correctAnswer 
              ? '¡Correcto! Has identificado el patrón'
              : `Incorrecto. El color correcto era ${getColorById(roundData.correctAnswer).name}`
            }
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
