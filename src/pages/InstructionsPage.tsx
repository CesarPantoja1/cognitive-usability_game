import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button, Card } from '../components/ui';
import { getGameById } from '../data/gamesData';
import { ArrowLeft, Play, HelpCircle } from 'lucide-react';
import { getIcon } from '../utils/iconMapping';

export const InstructionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { gameId } = useParams<{ gameId: string }>();

  const game = gameId ? getGameById(gameId) : null;

  if (!game) {
    return (
      <div className="container-center min-h-screen flex items-center justify-center" role="main">
        <Card className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Juego no encontrado
          </h1>
          <Button onClick={() => navigate('/training')} aria-label="Volver a selección de juegos">
            Volver a la selección
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-center min-h-screen py-8" role="main">
      <div className="mb-8">
        <Button
          variant="secondary"
          onClick={() => navigate('/training')}
          icon={<ArrowLeft size={24} aria-hidden="true" />}
          aria-label="Volver a selección de juegos"
        >
          Volver
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <Card className="mb-8">
          <div className="flex items-start gap-6 mb-6">
            <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center flex-shrink-0" aria-hidden="true">
              {getIcon(game.icon, 40)}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {game.name}
              </h1>
              <p className="text-lg text-gray-600">
                {game.description}
              </p>
            </div>
          </div>

          <section className="mb-6" aria-labelledby="instructions-heading">
            <h2 id="instructions-heading" className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <HelpCircle size={24} className="text-primary-600" aria-hidden="true" />
              Instrucciones
            </h2>
            <ol className="space-y-3" aria-label="Lista de instrucciones del juego">
              {game.instructions.map((instruction, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-lg text-gray-700"
                >
                  <span className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold" aria-hidden="true">
                    {index + 1}
                  </span>
                  <span className="pt-1">
                    <span className="sr-only">Paso {index + 1}: </span>
                    {instruction}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          {game.videoTutorialUrl && (
            <section className="mb-6" aria-labelledby="video-heading">
              <h3 id="video-heading" className="text-lg font-semibold text-gray-900 mb-3">
                Video Tutorial
              </h3>
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center" role="region" aria-label="Área del video tutorial">
                <p className="text-gray-500">
                  [Video tutorial con subtítulos activados]
                </p>
              </div>
            </section>
          )}

          <div className="flex gap-4 justify-center mt-8" role="group" aria-label="Acciones del juego">
            <Button
              variant="secondary"
              onClick={() => navigate('/training')}
              aria-label="Volver y elegir otro juego"
            >
              Elegir otro juego
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate(`/game/${gameId}`)}
              icon={<Play size={24} aria-hidden="true" />}
              size="large"
              aria-label={`Comenzar a jugar ${game.name}. Duración estimada: ${Math.ceil(game.estimatedTime / 60)} minutos`}
            >
              ¡Estoy listo, jugar!
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
