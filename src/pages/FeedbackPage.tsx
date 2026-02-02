import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button, Card } from '../components/ui';
import { FeedbackEmotion } from '../types/index';
import { Smile, Meh, Frown, SmilePlus, Angry } from 'lucide-react';

const emotionOptions: Array<{
  value: FeedbackEmotion;
  icon: React.ReactNode;
  label: string;
  color: string;
}> = [
  {
    value: FeedbackEmotion.VERY_HAPPY,
    icon: <SmilePlus size={48} />,
    label: 'Muy feliz',
    color: 'text-success-600 hover:bg-success-100',
  },
  {
    value: FeedbackEmotion.HAPPY,
    icon: <Smile size={48} />,
    label: 'Feliz',
    color: 'text-primary-600 hover:bg-primary-100',
  },
  {
    value: FeedbackEmotion.NEUTRAL,
    icon: <Meh size={48} />,
    label: 'Neutral',
    color: 'text-warning-600 hover:bg-warning-100',
  },
  {
    value: FeedbackEmotion.SAD,
    icon: <Frown size={48} />,
    label: 'Triste',
    color: 'text-orange-600 hover:bg-orange-100',
  },
  {
    value: FeedbackEmotion.VERY_SAD,
    icon: <Angry size={48} />,
    label: 'Muy triste',
    color: 'text-error-600 hover:bg-error-100',
  },
];

export const FeedbackPage: React.FC = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();
  const [selectedEmotion, setSelectedEmotion] = useState<FeedbackEmotion | null>(null);

  const handleSubmit = () => {
    if (!selectedEmotion) return;

    // Aquí se guardaría la retroalimentación (implementar después con backend)
    console.log('Retroalimentación:', {
      sessionId,
      emotion: selectedEmotion,
      timestamp: new Date(),
    });

    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-success-50 flex items-center justify-center py-12">
      <div className="container-center max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ¿Cómo te sentiste?
            </h1>
            <p className="text-lg text-gray-600 mb-12">
              Tu opinión nos ayuda a mejorar la experiencia
            </p>

            <div
              className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12"
              role="radiogroup"
              aria-label="Selecciona cómo te sentiste"
            >
              {emotionOptions.map((option) => (
                <motion.button
                  key={option.value}
                  role="radio"
                  aria-checked={selectedEmotion === option.value}
                  aria-label={option.label}
                  onClick={() => setSelectedEmotion(option.value)}
                  className={`
                    p-6 rounded-2xl border-4 transition-all
                    ${
                      selectedEmotion === option.value
                        ? 'border-primary-600 bg-primary-50 shadow-lg scale-105'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }
                    ${option.color}
                    focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-400 focus-visible:ring-offset-2
                  `}
                  whileHover={{ scale: selectedEmotion === option.value ? 1.05 : 1.02 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="mb-3" aria-hidden="true">
                    {option.icon}
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {option.label}
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                variant="secondary"
                onClick={() => navigate('/')}
                size="large"
              >
                Omitir
              </Button>

              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={!selectedEmotion}
                size="large"
              >
                Enviar y Finalizar
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
