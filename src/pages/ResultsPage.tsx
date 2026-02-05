import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button, Card, Badge, ProgressBar } from '../components/ui';
import { useProgress } from '../contexts/ProgressContext';
import { Home, RotateCcw, ArrowRight, Trophy, Target, Clock, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { usePageTitle } from '../hooks/usePageTitle';

export const ResultsPage: React.FC = () => {
  usePageTitle('Resultados');
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();
  const { progress } = useProgress();

  const [session, setSession] = useState(() => {
    return progress.gameSessions.find(s => s.id === sessionId);
  });

  useEffect(() => {
    if (!session) {
      navigate('/');
      return;
    }

    // Confeti si el rendimiento es excelente
    if (session.performanceRating === 'excellent') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [session, navigate]);

  if (!session) {
    return null;
  }

  const getPerformanceMessage = () => {
    switch (session.performanceRating) {
      case 'excellent':
        return {
          title: '¡Excelente!',
          message: '¡Increíble trabajo! Has demostrado un desempeño excepcional.',
          color: 'success',
          emoji: '🎉'
        };
      case 'good':
        return {
          title: '¡Buen trabajo!',
          message: 'Has hecho un gran esfuerzo. ¡Sigue así!',
          color: 'primary',
          emoji: '👏'
        };
      case 'regular':
        return {
          title: 'Bien hecho',
          message: 'Vas por buen camino. La práctica hace al maestro.',
          color: 'warning',
          emoji: '👍'
        };
      default:
        return {
          title: 'Sigue practicando',
          message: 'Cada intento te acerca más al éxito. ¡No te rindas!',
          color: 'neutral',
          emoji: '💪'
        };
    }
  };

  const performance = getPerformanceMessage();
  const scorePercentage = (session.score / session.maxScore) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-success-50 to-warning-50 py-12">
      <div className="container-center max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="text-8xl mb-6"
              role="img"
              aria-label={performance.title}
            >
              {performance.emoji}
            </motion.div>

            <h1 className="text-4xl font-bold text-gray-900 mb-3" tabIndex={0}>
              {performance.title}
            </h1>
            <p className="text-xl text-gray-600 mb-8" tabIndex={0}>
              {performance.message}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" role="list" aria-label="Estadísticas de tu sesión de juego">
              <div className="p-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl" role="listitem" tabIndex={0} aria-label={`Puntos obtenidos: ${session.score}`}>
                <div className="flex justify-center mb-3">
                  <Trophy size={32} className="text-primary-600" aria-hidden="true" />
                </div>
                <div className="text-3xl font-bold text-primary-700 mb-1">
                  {session.score}
                </div>
                <div className="text-sm text-gray-600">Puntos</div>
              </div>

              <div className="p-6 bg-gradient-to-br from-success-50 to-success-100 rounded-xl" role="listitem" tabIndex={0} aria-label={`Precisión: ${session.accuracy} por ciento`}>
                <div className="flex justify-center mb-3">
                  <Target size={32} className="text-success-600" aria-hidden="true" />
                </div>
                <div className="text-3xl font-bold text-success-700 mb-1">
                  {session.accuracy}%
                </div>
                <div className="text-sm text-gray-600">Precisión</div>
              </div>

              <div className="p-6 bg-gradient-to-br from-warning-50 to-warning-100 rounded-xl" role="listitem" tabIndex={0} aria-label={`Tiempo: ${Math.floor(session.timeSpent / 60)} minutos ${session.timeSpent % 60} segundos`}>
                <div className="flex justify-center mb-3">
                  <Clock size={32} className="text-warning-600" aria-hidden="true" />
                </div>
                <div className="text-3xl font-bold text-warning-700 mb-1">
                  {Math.floor(session.timeSpent / 60)}:{String(session.timeSpent % 60).padStart(2, '0')}
                </div>
                <div className="text-sm text-gray-600">Tiempo</div>
              </div>

              <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl" role="listitem" tabIndex={0} aria-label={`Rendimiento: ${Math.round(scorePercentage)} por ciento`}>
                <div className="flex justify-center mb-3">
                  <Award size={32} className="text-purple-600" aria-hidden="true" />
                </div>
                <div className="text-3xl font-bold text-purple-700 mb-1">
                  {Math.round(scorePercentage)}%
                </div>
                <div className="text-sm text-gray-600">Rendimiento</div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-2" tabIndex={0} aria-label={`Progreso hacia el puntaje máximo: ${session.score} de ${session.maxScore} puntos`}>
                <span className="text-lg font-medium text-gray-700">
                  Progreso hacia el puntaje máximo
                </span>
                <span className="text-lg font-semibold text-primary-600">
                  {session.score} / {session.maxScore}
                </span>
              </div>
              <ProgressBar
                value={session.score}
                max={session.maxScore}
                variant={performance.color as any}
                size="large"
                showPercentage={false}
              />
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                variant="secondary"
                onClick={() => navigate('/')}
                icon={<Home size={24} />}
                size="large"
                aria-label="Volver al menú principal"
              >
                Ir al inicio
              </Button>

              <Button
                variant="primary"
                onClick={() => navigate('/training')}
                icon={<RotateCcw size={24} />}
                size="large"
                aria-label="Elegir otro juego para seguir practicando"
              >
                Practicar otro juego
              </Button>

              <Button
                variant="success"
                onClick={() => navigate(`/feedback/${sessionId}`)}
                icon={<ArrowRight size={24} />}
                iconPosition="right"
                size="large"
                aria-label="Continuar para dar tu opinión sobre el juego"
              >
                Dar mi opinión
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
