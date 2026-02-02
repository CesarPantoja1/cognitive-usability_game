import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button, Card, Icon } from '../components/ui';
import { Play, BarChart3, Settings } from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container-center min-h-screen flex flex-col items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold text-primary-700 mb-4">
          🧠 Entrenamiento Cognitivo
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Ejercita tu mente con juegos diseñados para estimular la memoria,
          lógica y atención de manera accesible y divertida.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <Card
          interactive
          onClick={() => navigate('/training')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              navigate('/training');
            }
          }}
          aria-label="Comenzar Entrenamiento"
          className="flex flex-col items-center text-center p-8"
        >
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mb-4">
            <Play size={40} className="text-primary-600" aria-hidden="true" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Entrenar
          </h2>
          <p className="text-gray-600">
            Comienza tu entrenamiento cognitivo
          </p>
        </Card>

        <Card
          interactive
          onClick={() => navigate('/progress')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              navigate('/progress');
            }
          }}
          aria-label="Ver Progreso"
          className="flex flex-col items-center text-center p-8"
        >
          <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mb-4">
            <BarChart3 size={40} className="text-success-600" aria-hidden="true" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Progreso
          </h2>
          <p className="text-gray-600">
            Revisa tus logros y estadísticas
          </p>
        </Card>

        <Card
          interactive
          onClick={() => navigate('/settings')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              navigate('/settings');
            }
          }}
          aria-label="Configuración"
          className="flex flex-col items-center text-center p-8"
        >
          <div className="w-20 h-20 bg-warning-100 rounded-full flex items-center justify-center mb-4">
            <Settings size={40} className="text-warning-600" aria-hidden="true" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Configuración
          </h2>
          <p className="text-gray-600">
            Ajusta la accesibilidad
          </p>
        </Card>
      </div>
    </div>
  );
};
