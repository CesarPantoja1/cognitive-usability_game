import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, ProgressBar } from '../ui';
import { Zap, Clock, Target, AlertCircle } from 'lucide-react';

interface ReactionGameProps {
  onComplete: (score: number, accuracy: number) => void;
}

type GamePhase = 'waiting' | 'ready' | 'go' | 'tooEarly' | 'result' | 'finished';

const ROUNDS = 5;
const MIN_WAIT = 1500;
const MAX_WAIT = 4000;

export const ReactionGame: React.FC<ReactionGameProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<GamePhase>('waiting');
  const [round, setRound] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [currentReactionTime, setCurrentReactionTime] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startRound = useCallback(() => {
    setPhase('ready');
    setCurrentReactionTime(null);
    
    // Tiempo aleatorio de espera
    const waitTime = MIN_WAIT + Math.random() * (MAX_WAIT - MIN_WAIT);
    
    timeoutRef.current = setTimeout(() => {
      setPhase('go');
      setStartTime(Date.now());
    }, waitTime);
  }, []);

  const handleClick = useCallback(() => {
    if (phase === 'waiting') {
      // Iniciar primera ronda
      startRound();
    } else if (phase === 'ready') {
      // Clicó demasiado pronto
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setPhase('tooEarly');
    } else if (phase === 'go') {
      // Medir tiempo de reacción
      const reactionTime = Date.now() - startTime;
      setCurrentReactionTime(reactionTime);
      setReactionTimes(prev => [...prev, reactionTime]);
      setPhase('result');
    } else if (phase === 'tooEarly') {
      // Reintentar después de clic temprano
      startRound();
    } else if (phase === 'result') {
      // Siguiente ronda o finalizar
      if (round + 1 >= ROUNDS) {
        finishGame();
      } else {
        setRound(prev => prev + 1);
        startRound();
      }
    }
  }, [phase, startTime, round, startRound]);

  const finishGame = () => {
    setPhase('finished');
    
    const avgTime = reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length;
    
    // Calcular puntuación (menor tiempo = mejor puntuación)
    const score = Math.round(Math.max(0, 1000 - avgTime));
    const accuracy = Math.min(1, 300 / avgTime); // 300ms como referencia óptima
    
    setTimeout(() => {
      onComplete(score, accuracy);
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getPhaseContent = () => {
    switch (phase) {
      case 'waiting':
        return {
          bg: 'from-primary-500 to-indigo-600',
          icon: '👆',
          title: '¿Listo?',
          subtitle: 'Haz clic para comenzar',
        };
      case 'ready':
        return {
          bg: 'from-amber-500 to-orange-600',
          icon: '⏳',
          title: 'Espera...',
          subtitle: 'Haz clic cuando veas VERDE',
        };
      case 'go':
        return {
          bg: 'from-green-500 to-emerald-600',
          icon: '⚡',
          title: '¡AHORA!',
          subtitle: '¡Haz clic rápido!',
        };
      case 'tooEarly':
        return {
          bg: 'from-red-500 to-rose-600',
          icon: '😅',
          title: '¡Muy pronto!',
          subtitle: 'Espera a que se ponga verde',
        };
      case 'result':
        return {
          bg: 'from-primary-500 to-indigo-600',
          icon: currentReactionTime && currentReactionTime < 250 ? '🚀' : currentReactionTime && currentReactionTime < 350 ? '⚡' : '👍',
          title: `${currentReactionTime}ms`,
          subtitle: currentReactionTime && currentReactionTime < 250 ? '¡Increíble!' : currentReactionTime && currentReactionTime < 350 ? '¡Muy bien!' : 'Buen intento',
        };
      case 'finished':
        return {
          bg: 'from-purple-500 to-pink-600',
          icon: '🏆',
          title: '¡Terminado!',
          subtitle: 'Calculando resultados...',
        };
    }
  };

  const content = getPhaseContent();
  const avgTime = reactionTimes.length > 0 
    ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length) 
    : 0;
  const bestTime = reactionTimes.length > 0 ? Math.min(...reactionTimes) : 0;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Panel de estadísticas */}
      <Card className="mb-6 bg-gradient-to-r from-slate-50 to-gray-50">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                <Target className="w-4 h-4 text-primary-500" />
                <span>Ronda</span>
              </div>
              <div className="text-2xl font-bold text-primary-600">
                {round + 1} / {ROUNDS}
              </div>
            </div>
            
            <div className="h-12 w-px bg-gray-200" />
            
            <div className="text-center">
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Promedio</span>
              </div>
              <div className="text-2xl font-bold text-amber-600">
                {avgTime > 0 ? `${avgTime}ms` : '-'}
              </div>
            </div>
            
            <div className="h-12 w-px bg-gray-200" />
            
            <div className="text-center">
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                <Zap className="w-4 h-4 text-green-500" />
                <span>Mejor</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {bestTime > 0 ? `${bestTime}ms` : '-'}
              </div>
            </div>
          </div>
        </div>
        
        {/* Barra de progreso */}
        <div className="mt-4">
          <ProgressBar 
            value={(round / ROUNDS) * 100} 
            max={100} 
            variant="primary" 
            size="medium"
            label="Progreso del juego"
          />
        </div>
      </Card>

      {/* Área de juego principal */}
      <motion.button
        onClick={handleClick}
        className={`
          w-full aspect-square rounded-3xl
          bg-gradient-to-br ${content.bg}
          flex flex-col items-center justify-center
          cursor-pointer shadow-2xl
          transition-all duration-200
          focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-4
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-label={`${content.title} - ${content.subtitle}`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-center text-white"
          >
            <motion.div 
              className="text-8xl mb-6"
              animate={phase === 'go' ? { 
                scale: [1, 1.2, 1],
              } : {}}
              transition={{ duration: 0.3, repeat: Infinity }}
            >
              {content.icon}
            </motion.div>
            
            <h2 className="text-5xl font-extrabold mb-3">
              {content.title}
            </h2>
            
            <p className="text-2xl text-white/90">
              {content.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>
      </motion.button>

      {/* Historial de tiempos */}
      {reactionTimes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Tiempos de reacción
            </h3>
            <div className="flex flex-wrap gap-3">
              {reactionTimes.map((time, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`
                    px-4 py-2 rounded-xl font-semibold
                    ${time < 250 
                      ? 'bg-green-100 text-green-700' 
                      : time < 350 
                        ? 'bg-amber-100 text-amber-700' 
                        : 'bg-gray-100 text-gray-700'
                    }
                  `}
                >
                  {time}ms
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Instrucciones */}
      <Card className="mt-6 bg-gradient-to-r from-primary-50 to-indigo-50 border-primary-100">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Cómo jugar</h3>
            <p className="text-gray-600 text-sm">
              Espera a que la pantalla se ponga <span className="font-semibold text-green-600">VERDE</span> y 
              haz clic lo más rápido posible. ¡Cuidado! Si haces clic antes de tiempo, tendrás que 
              esperar de nuevo.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
