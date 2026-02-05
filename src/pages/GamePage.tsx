import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, ProgressBar } from '../components/ui';
import { getGameById } from '../data/gamesData';
import { GameModel } from '../models/GameModel';
import { DifficultyLevel, GameSession } from '../types/index';
import { useProgress } from '../contexts/ProgressContext';
import { MemoryGame } from '../components/games/MemoryGame';
import { SequenceGame } from '../components/games/SequenceGame';
import { AttentionGame } from '../components/games/AttentionGame';
import { LogicGame } from '../components/games/LogicGame';
import { ReactionGame } from '../components/games/ReactionGame';
import { CountingGame } from '../components/games/CountingGame';
import { ColorSequenceGame } from '../components/games/ColorSequenceGame';
import { ShapeSortingGame } from '../components/games/ShapeSortingGame';
import { X, Pause, Play } from 'lucide-react';

export const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const { gameId } = useParams<{ gameId: string }>();
  const { addGameSession } = useProgress();

  const [gameModel, setGameModel] = useState<GameModel | null>(null);
  const [session, setSession] = useState<GameSession | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    if (!gameId) return;

    const game = getGameById(gameId);
    if (!game) {
      navigate('/training');
      return;
    }

    const model = new GameModel(game, {
      difficultyLevel: game.difficulty,
      timeLimit: game.estimatedTime,
    });

    const newSession = model.startSession();
    setGameModel(model);
    setSession(newSession);
  }, [gameId, navigate]);

  useEffect(() => {
    if (!session || isPaused) return;

    const interval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [session, isPaused]);

  const handleGameComplete = (score: number, accuracy: number) => {
    if (!gameModel || !session) return;

    gameModel.updateScore(score);
    gameModel.updateAccuracy(Math.round(accuracy * 100), 100);

    const completedSession = gameModel.endSession();
    addGameSession(completedSession);

    navigate(`/results/${completedSession.id}`);
  };

  const handleExit = () => {
    const confirmMessage = `¿Seguro que deseas salir del juego?\n\n❌ Perderás los ${session?.score || 0} puntos acumulados\n❌ El progreso de esta partida no se guardará`;
    if (window.confirm(confirmMessage)) {
      navigate('/training');
    }
  };

  if (!gameModel || !session || !gameId) {
    return (
      <div className="container-center min-h-screen flex items-center justify-center" role="status" aria-live="polite">
        <Card className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" aria-hidden="true" />
          <p className="text-lg font-medium text-gray-700">Preparando tu juego...</p>
          <p className="text-sm text-gray-500 mt-1">Esto solo tomará un momento</p>
        </Card>
      </div>
    );
  }

  const game = gameModel.getInfo();

  // Renderizar el juego correspondiente
  const renderGame = () => {
    // Primero verificar por gameId específico para juegos que comparten tipo
    switch (gameId) {
      case 'counting-objects':
        return <CountingGame onComplete={handleGameComplete} />;
      case 'color-sequence':
        return <ColorSequenceGame onComplete={handleGameComplete} />;
      case 'shape-sorting':
        return <ShapeSortingGame onComplete={handleGameComplete} />;
    }
    
    // Luego por tipo de juego general
    switch (game.type) {
      case 'memory':
        return <MemoryGame onComplete={handleGameComplete} />;
      case 'sequence':
        return <SequenceGame onComplete={handleGameComplete} />;
      case 'attention':
        return <AttentionGame onComplete={handleGameComplete} />;
      case 'logic':
        return <LogicGame onComplete={handleGameComplete} />;
      case 'reaction':
        return <ReactionGame onComplete={handleGameComplete} />;
      default:
        return (
          <Card className="text-center">
            <h2 className="text-2xl font-bold mb-4">Juego en desarrollo</h2>
            <p className="mb-6">Este juego estará disponible pronto.</p>
            <Button onClick={() => navigate('/training')}>
              Volver a selección
            </Button>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-success-50">
      {/* Barra superior */}
      <div className="bg-white shadow-md">
        <div className="container-center py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900">
                {game.name}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm" role="timer" aria-live="off" aria-atomic="true">
                <span className="text-gray-600">Tiempo: </span>
                <span className="font-semibold text-gray-900" aria-label={`${Math.floor(timeElapsed / 60)} minutos y ${timeElapsed % 60} segundos`}>
                  {Math.floor(timeElapsed / 60)}:{String(timeElapsed % 60).padStart(2, '0')}
                </span>
              </div>

              <div className="text-sm" aria-live="polite" aria-atomic="true">
                <span className="text-gray-600">Puntos: </span>
                <span className="font-semibold text-primary-600">
                  {session.score}
                  <span className="sr-only"> puntos acumulados</span>
                </span>
              </div>

              <Button
                variant="secondary"
                size="small"
                onClick={() => setIsPaused(!isPaused)}
                icon={isPaused ? <Play size={20} /> : <Pause size={20} />}
                aria-label={isPaused ? 'Reanudar' : 'Pausar'}
              >
                {isPaused ? 'Reanudar' : 'Pausar'}
              </Button>

              <Button
                variant="secondary"
                size="small"
                onClick={handleExit}
                icon={<X size={20} />}
                aria-label="Salir del juego"
              >
                Salir
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Área del juego */}
      <div className="container-center py-8">
        <AnimatePresence mode="wait">
          {isPaused ? (
            <motion.div
              key="paused"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center min-h-[500px]"
            >
              <Card className="text-center max-w-md">
                <div className="w-20 h-20 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Pause size={40} className="text-warning-600" aria-hidden="true" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Juego en Pausa
                </h2>
                <p className="text-gray-600 mb-2">
                  Tu tiempo y progreso están guardados.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Llevas <strong>{Math.floor(timeElapsed / 60)}:{String(timeElapsed % 60).padStart(2, '0')}</strong> y <strong>{session.score} puntos</strong>
                </p>
                <Button
                  onClick={() => setIsPaused(false)}
                  icon={<Play size={24} />}
                  size="large"
                  aria-label="Continuar jugando"
                >
                  Reanudar Juego
                </Button>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {renderGame()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
