import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, Button, ProgressBar } from '../ui';
import { Eye, Zap, Trophy } from 'lucide-react';

interface SequenceGameProps {
  onComplete: (score: number, accuracy: number) => void;
}

const COLORS = [
  { id: 'red', name: 'Rojo', bg: 'bg-red-500', active: 'bg-red-300', glow: 'shadow-[0_0_60px_20px_rgba(239,68,68,0.8)]', border: 'border-red-300' },
  { id: 'blue', name: 'Azul', bg: 'bg-blue-500', active: 'bg-blue-300', glow: 'shadow-[0_0_60px_20px_rgba(59,130,246,0.8)]', border: 'border-blue-300' },
  { id: 'green', name: 'Verde', bg: 'bg-green-500', active: 'bg-green-300', glow: 'shadow-[0_0_60px_20px_rgba(34,197,94,0.8)]', border: 'border-green-300' },
  { id: 'yellow', name: 'Amarillo', bg: 'bg-yellow-400', active: 'bg-yellow-200', glow: 'shadow-[0_0_60px_20px_rgba(250,204,21,0.8)]', border: 'border-yellow-200' },
];

export const SequenceGame: React.FC<SequenceGameProps> = ({ onComplete }) => {
  const [sequence, setSequence] = useState<string[]>([]);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUserTurn, setIsUserTurn] = useState(false);
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);

  useEffect(() => {
    startNewRound();
  }, []);

  const startNewRound = () => {
    const newColor = COLORS[Math.floor(Math.random() * COLORS.length)].id;
    const newSequence = [...sequence, newColor];
    setSequence(newSequence);
    setUserSequence([]);
    playSequence(newSequence);
  };

  const playSequence = async (seq: string[]) => {
    setIsPlaying(true);
    setIsUserTurn(false);

    // Esperar un momento antes de empezar
    await new Promise(resolve => setTimeout(resolve, 500));

    for (const colorId of seq) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setActiveColor(colorId);
      await new Promise(resolve => setTimeout(resolve, 800));
      setActiveColor(null);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    setIsPlaying(false);
    setIsUserTurn(true);
  };

  const handleColorClick = (colorId: string) => {
    if (!isUserTurn || isPlaying) return;

    const newUserSequence = [...userSequence, colorId];
    setUserSequence(newUserSequence);

    // Feedback visual
    setActiveColor(colorId);
    setTimeout(() => setActiveColor(null), 250);

    // Verificar si es correcto
    const index = newUserSequence.length - 1;
    if (newUserSequence[index] !== sequence[index]) {
      // Error - fin del juego
      endGame(false);
      return;
    }

    // Si completó la secuencia correctamente
    if (newUserSequence.length === sequence.length) {
      const newScore = score + (level * 100);
      setScore(newScore);
      setLevel(level + 1);

      setTimeout(() => {
        startNewRound();
      }, 1000);
    }
  };

  const endGame = (success: boolean) => {
    const accuracy = success ? 1 : Math.max(level / 10, 0.1);
    onComplete(score, accuracy);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Panel de estadísticas */}
      <Card className="mb-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-100">
        <div className="flex justify-between items-center">
          <div className="text-center">
            <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
              <Zap className="w-4 h-4 text-purple-500" />
              <span>Nivel</span>
            </div>
            <div className="text-2xl font-bold text-primary-600">{level}</div>
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
              <Eye className="w-4 h-4 text-indigo-500" />
              <span>Secuencia</span>
            </div>
            <div className="text-2xl font-bold text-warning-600">{sequence.length}</div>
          </div>
        </div>
      </Card>

      {/* Estado del juego */}
      <Card className={`mb-4 text-center transition-all duration-300 ${
        isPlaying 
          ? 'bg-gradient-to-r from-amber-100 to-orange-100 border-amber-300' 
          : isUserTurn 
            ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-300'
            : 'bg-gray-50'
      }`}>
        <p className="text-lg font-bold text-gray-900">
          {isPlaying
            ? '👀 ¡Observa la secuencia!'
            : isUserTurn
            ? '✨ Tu turno - Repite la secuencia'
            : '⏳ Preparando...'}
        </p>
        {isUserTurn && (
          <p className="text-sm text-gray-600 mt-1">
            Paso {userSequence.length + 1} de {sequence.length}
          </p>
        )}
      </Card>

      {/* Botones de colores */}
      <div className="grid grid-cols-2 gap-3">
        {COLORS.map((color) => {
          const isActive = activeColor === color.id;
          
          return (
            <motion.button
              key={color.id}
              onClick={() => handleColorClick(color.id)}
              className={`
                h-28 sm:h-32 rounded-2xl text-white text-lg font-bold
                transition-all duration-150 border-4
                focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-4
                ${isActive ? `${color.active} ${color.glow} ${color.border} scale-105` : `${color.bg} border-transparent`}
                ${!isUserTurn || isPlaying ? 'cursor-not-allowed' : 'hover:scale-102 cursor-pointer hover:brightness-110'}
                ${!isActive && (isPlaying || !isUserTurn) ? 'opacity-60' : ''}
              `}
              animate={isActive ? { scale: 1.08 } : { scale: 1 }}
              whileTap={isUserTurn && !isPlaying ? { scale: 0.95 } : {}}
              disabled={!isUserTurn || isPlaying}
              aria-label={color.name}
            >
              {color.name}
            </motion.button>
          );
        })}
      </div>

      {/* Indicador de progreso de la secuencia */}
      {isUserTurn && (
        <div className="mt-4">
          <ProgressBar 
            value={(userSequence.length / sequence.length) * 100}
            max={100}
            variant="success"
            size="medium"
            label="Progreso de repetición"
          />
        </div>
      )}
    </div>
  );
};
