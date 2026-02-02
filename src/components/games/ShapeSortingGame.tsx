import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, ProgressBar } from '../ui';
import { Shapes, Trophy, Target, CheckCircle, XCircle } from 'lucide-react';

interface ShapeSortingGameProps {
  onComplete: (score: number, accuracy: number) => void;
}

interface Shape {
  id: string;
  type: 'circle' | 'square' | 'triangle' | 'hexagon' | 'star';
  color: 'red' | 'blue' | 'green' | 'yellow' | 'purple';
  size: 'small' | 'medium' | 'large';
}

interface RoundData {
  shapes: Shape[];
  question: string;
  correctAnswer: number;
  options: number[];
  criteria: string;
}

const COLORS: Record<string, string> = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-400',
  purple: 'bg-purple-500',
};

const SIZES = {
  small: 'w-8 h-8 sm:w-10 sm:h-10',
  medium: 'w-10 h-10 sm:w-12 sm:h-12',
  large: 'w-12 h-12 sm:w-14 sm:h-14',
};

const ROUNDS = 8;

export const ShapeSortingGame: React.FC<ShapeSortingGameProps> = ({ onComplete }) => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [roundData, setRoundData] = useState<RoundData | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const renderShape = (shape: Shape) => {
    const colorClass = COLORS[shape.color];
    const sizeClass = SIZES[shape.size];
    
    switch (shape.type) {
      case 'circle':
        return (
          <div className={`${colorClass} ${sizeClass} rounded-full shadow-md`} />
        );
      case 'square':
        return (
          <div className={`${colorClass} ${sizeClass} rounded-lg shadow-md`} />
        );
      case 'triangle':
        return (
          <div 
            className={`${sizeClass} flex items-center justify-center`}
          >
            <div 
              className="w-0 h-0 border-l-[18px] border-r-[18px] border-b-[32px] border-l-transparent border-r-transparent"
              style={{ 
                borderBottomColor: shape.color === 'red' ? '#ef4444' :
                                   shape.color === 'blue' ? '#3b82f6' :
                                   shape.color === 'green' ? '#22c55e' :
                                   shape.color === 'yellow' ? '#facc15' :
                                   '#a855f7'
              }}
            />
          </div>
        );
      case 'hexagon':
        return (
          <div className={`${colorClass} ${sizeClass} shadow-md`} 
               style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />
        );
      case 'star':
        return (
          <div 
            className={`${sizeClass} flex items-center justify-center`}
          >
            <span className="text-2xl sm:text-3xl" style={{ 
              color: shape.color === 'red' ? '#ef4444' :
                     shape.color === 'blue' ? '#3b82f6' :
                     shape.color === 'green' ? '#22c55e' :
                     shape.color === 'yellow' ? '#facc15' :
                     '#a855f7'
            }}>★</span>
          </div>
        );
    }
  };

  const generateRound = useCallback((): RoundData => {
    const types: Shape['type'][] = ['circle', 'square', 'triangle', 'hexagon', 'star'];
    const colors: Shape['color'][] = ['red', 'blue', 'green', 'yellow', 'purple'];
    const sizes: Shape['size'][] = ['small', 'medium', 'large'];
    
    // Generar 8-12 formas aleatorias
    const numShapes = Math.floor(Math.random() * 5) + 8;
    const shapes: Shape[] = [];
    
    for (let i = 0; i < numShapes; i++) {
      shapes.push({
        id: `shape-${i}`,
        type: types[Math.floor(Math.random() * types.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        size: sizes[Math.floor(Math.random() * sizes.length)],
      });
    }
    
    // Tipos de preguntas
    const questionTypes = [
      { criteria: 'type', values: types },
      { criteria: 'color', values: colors },
    ];
    
    const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    const targetValue = questionType.values[Math.floor(Math.random() * questionType.values.length)];
    
    let question: string;
    let correctAnswer: number;
    let criteriaLabel: string;
    
    if (questionType.criteria === 'type') {
      const typeNames: Record<string, string> = {
        circle: 'círculos',
        square: 'cuadrados',
        triangle: 'triángulos',
        hexagon: 'hexágonos',
        star: 'estrellas',
      };
      question = `¿Cuántos ${typeNames[targetValue]} hay?`;
      correctAnswer = shapes.filter(s => s.type === targetValue).length;
      criteriaLabel = typeNames[targetValue];
    } else {
      const colorNames: Record<string, string> = {
        red: 'rojas',
        blue: 'azules',
        green: 'verdes',
        yellow: 'amarillas',
        purple: 'moradas',
      };
      question = `¿Cuántas figuras ${colorNames[targetValue]} hay?`;
      correctAnswer = shapes.filter(s => s.color === targetValue).length;
      criteriaLabel = colorNames[targetValue];
    }
    
    // Generar opciones (incluir la respuesta correcta)
    const options = new Set<number>();
    options.add(correctAnswer);
    
    while (options.size < 4) {
      const variation = Math.floor(Math.random() * 5) - 2;
      const option = Math.max(0, correctAnswer + variation);
      if (option !== correctAnswer) {
        options.add(option);
      }
    }
    
    return {
      shapes,
      question,
      correctAnswer,
      options: Array.from(options).sort(() => Math.random() - 0.5),
      criteria: criteriaLabel,
    };
  }, []);

  useEffect(() => {
    setRoundData(generateRound());
  }, []);

  const handleAnswer = (answer: number) => {
    if (showFeedback || !roundData) return;
    
    setSelectedAnswer(answer);
    setShowFeedback(true);
    
    const isCorrect = answer === roundData.correctAnswer;
    
    if (isCorrect) {
      setScore(score + 125);
      setCorrectAnswers(correctAnswers + 1);
    }

    setTimeout(() => {
      if (round >= ROUNDS) {
        const accuracy = (correctAnswers + (isCorrect ? 1 : 0)) / ROUNDS;
        onComplete(score + (isCorrect ? 125 : 0), accuracy);
      } else {
        setRound(round + 1);
        setRoundData(generateRound());
        setSelectedAnswer(null);
        setShowFeedback(false);
      }
    }, 2000);
  };

  if (!roundData) return null;

  const progress = (round / ROUNDS) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Panel de estadísticas */}
      <Card className="mb-4 bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-100">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                <Target className="w-4 h-4 text-indigo-500" />
                <span>Ronda</span>
              </div>
              <div className="text-2xl font-bold text-primary-600">
                {round} / {ROUNDS}
              </div>
            </div>
            
            <div className="h-10 w-px bg-gray-200" />
            
            <div className="text-center">
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Puntos</span>
              </div>
              <div className="text-2xl font-bold text-success-600">{score}</div>
            </div>
            
            <div className="h-10 w-px bg-gray-200" />
            
            <div className="text-center">
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
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

      {/* Pregunta */}
      <Card className="mb-4 text-center bg-gradient-to-r from-cyan-50 to-teal-50 border-cyan-200">
        <div className="flex items-center justify-center gap-2">
          <Shapes className="w-6 h-6 text-cyan-600" />
          <p className="text-xl font-bold text-gray-900">
            {roundData.question}
          </p>
        </div>
      </Card>

      {/* Grid de formas */}
      <Card className="mb-4">
        <div className="flex flex-wrap items-center justify-center gap-3 min-h-[120px]">
          {roundData.shapes.map((shape, index) => (
            <motion.div
              key={shape.id}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                delay: index * 0.05,
                type: 'spring',
                stiffness: 200,
                damping: 15
              }}
              className="flex items-center justify-center"
            >
              {renderShape(shape)}
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Opciones de respuesta */}
      <div className="grid grid-cols-4 gap-3">
        {roundData.options.map((option, index) => {
          const isCorrect = option === roundData.correctAnswer;
          const isSelected = selectedAnswer === option;
          
          return (
            <motion.button
              key={`option-${index}`}
              onClick={() => handleAnswer(option)}
              disabled={showFeedback}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`
                h-16 sm:h-20 rounded-xl font-bold text-2xl
                transition-all duration-200 relative
                focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-400 focus-visible:ring-offset-2
                ${showFeedback 
                  ? isCorrect 
                    ? 'bg-green-500 text-white ring-4 ring-green-300' 
                    : isSelected 
                      ? 'bg-red-500 text-white ring-4 ring-red-300' 
                      : 'bg-gray-200 text-gray-400'
                  : 'bg-primary-100 text-primary-700 hover:bg-primary-500 hover:text-white cursor-pointer hover:scale-105'
                }
              `}
              whileHover={!showFeedback ? { scale: 1.05 } : {}}
              whileTap={!showFeedback ? { scale: 0.95 } : {}}
            >
              {option}
              
              {showFeedback && isCorrect && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2"
                >
                  <CheckCircle className="w-6 h-6 text-white bg-green-600 rounded-full" />
                </motion.div>
              )}
              
              {showFeedback && isSelected && !isCorrect && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2"
                >
                  <XCircle className="w-6 h-6 text-white bg-red-600 rounded-full" />
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
              ? `¡Correcto! Había ${roundData.correctAnswer} ${roundData.criteria}`
              : `Incorrecto. La respuesta correcta era ${roundData.correctAnswer}`
            }
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
