import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button, Card, Badge, ProgressBar } from '../components/ui';
import { useProgress } from '../contexts/ProgressContext';
import { ArrowLeft, Trophy, Target, Clock, Award } from 'lucide-react';

export const ProgressPage: React.FC = () => {
  const navigate = useNavigate();
  const { progress, getLevelProgress, getRecentAchievements } = useProgress();

  const levelProgress = getLevelProgress();
  const recentAchievements = getRecentAchievements();

  return (
    <div className="container-center min-h-screen py-8">
      <div className="mb-8">
        <Button
          variant="secondary"
          onClick={() => navigate('/')}
          icon={<ArrowLeft size={24} />}
          aria-label="Volver al inicio"
        >
          Volver
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Tu Progreso
          </h1>
          <p className="text-lg text-gray-600">
            Revisa tus logros y estadísticas
          </p>
        </div>

        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trophy size={32} className="text-primary-600" aria-hidden="true" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {progress.totalScore.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Puntos Totales</div>
          </Card>

          <Card className="text-center">
            <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target size={32} className="text-success-600" aria-hidden="true" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {progress.accuracyAverage}%
            </div>
            <div className="text-sm text-gray-600">Precisión Promedio</div>
          </Card>

          <Card className="text-center">
            <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock size={32} className="text-warning-600" aria-hidden="true" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {Math.floor(progress.totalTimeSpent / 60)}
            </div>
            <div className="text-sm text-gray-600">Minutos Jugados</div>
          </Card>

          <Card className="text-center">
            <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award size={32} className="text-error-600" aria-hidden="true" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {progress.achievements.length}
            </div>
            <div className="text-sm text-gray-600">Logros Desbloqueados</div>
          </Card>
        </div>

        {/* Nivel actual */}
        <Card className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              Nivel {progress.currentLevel}
            </h2>
            <Badge variant="primary" size="large">
              {levelProgress}% al siguiente nivel
            </Badge>
          </div>
          <ProgressBar
            value={levelProgress}
            label="Progreso al Nivel siguiente"
            variant="primary"
            size="large"
          />
        </Card>

        {/* Resumen de juegos */}
        <Card className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Resumen de Juegos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-primary-600 mb-1">
                {progress.gamesPlayed}
              </div>
              <div className="text-sm text-gray-600">Juegos Jugados</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-success-600 mb-1">
                {progress.gamesCompleted}
              </div>
              <div className="text-sm text-gray-600">Juegos Completados</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-warning-600 mb-1">
                {progress.gamesPlayed > 0
                  ? Math.round((progress.gamesCompleted / progress.gamesPlayed) * 100)
                  : 0}%
              </div>
              <div className="text-sm text-gray-600">Tasa de Finalización</div>
            </div>
          </div>
        </Card>

        {/* Logros recientes */}
        {recentAchievements.length > 0 && (
          <Card>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Logros Recientes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="p-4 bg-gradient-to-br from-primary-50 to-success-50 rounded-lg border-2 border-primary-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Award size={24} className="text-white" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {achievement.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {progress.gamesPlayed === 0 && (
          <Card className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy size={48} className="text-gray-400" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Aún no has jugado
            </h2>
            <p className="text-gray-600 mb-6">
              Comienza tu entrenamiento para ver tu progreso
            </p>
            <Button onClick={() => navigate('/training')} size="large">
              Comenzar Ahora
            </Button>
          </Card>
        )}
      </motion.div>
    </div>
  );
};
