import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui';
import { CheckCircle, XCircle } from 'lucide-react';

interface LogicGameProps {
  onComplete: (score: number, accuracy: number) => void;
}

const PATTERNS = [
  { sequence: ['🔴', '🔵', '🔴', '🔵'], answer: '🔴', options: ['🔴', '🔵', '🟢'] },
  { sequence: ['⭐', '⭐', '🌙', '⭐', '⭐'], answer: '🌙', options: ['⭐', '🌙', '☀️'] },
  { sequence: ['🍎', '🍊', '🍎', '🍊', '🍎'], answer: '🍊', options: ['🍎', '🍊', '🍋'] },
  { sequence: ['🔺', '🔻', '🔺', '🔻'], answer: '🔺', options: ['🔺', '🔻', '🔶'] },
  { sequence: ['🐱', '🐶', '🐱', '🐶', '🐱'], answer: '🐶', options: ['🐱', '🐶', '🐭'] },
];

export const LogicGame: React.FC<LogicGameProps> = ({ onComplete }) => {
  const [currentPattern, setCurrentPattern] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const handleAnswer = (answer: string) => {
    const pattern = PATTERNS[currentPattern];
    const isCorrect = answer === pattern.answer;

    setFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      setScore(score + 200);
      setCorrectAnswers(correctAnswers + 1);
    }

    setTimeout(() => {
      setFeedback(null);

      if (currentPattern + 1 >= PATTERNS.length) {
        // Fin del juego
        const accuracy = (correctAnswers + (isCorrect ? 1 : 0)) / PATTERNS.length;
        onComplete(score + (isCorrect ? 200 : 0), accuracy);
      } else {
        setCurrentPattern(currentPattern + 1);
      }
    }, 1500);
  };

  const pattern = PATTERNS[currentPattern];

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="mb-6">
        <div className="flex justify-between items-center" role="status" aria-live="polite">
          <div tabIndex={0} aria-label={`Pregunta ${currentPattern + 1} de ${PATTERNS.length}`}>
            <div className="text-sm text-gray-600">Pregunta</div>
            <div className="text-3xl font-bold text-primary-600">
              {currentPattern + 1} / {PATTERNS.length}
            </div>
          </div>
          <div tabIndex={0} aria-label={`Puntos: ${score}`}>
            <div className="text-sm text-gray-600">Puntos</div>
            <div className="text-3xl font-bold text-success-600">{score}</div>
          </div>
          <div tabIndex={0} aria-label={`Respuestas correctas: ${correctAnswers}`}>
            <div className="text-sm text-gray-600">Correctas</div>
            <div className="text-3xl font-bold text-warning-600">{correctAnswers}</div>
          </div>
        </div>
      </Card>

      <Card className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center" tabIndex={0}>
          ¿Cuál figura completa el patrón?
        </h2>

        <div className="flex justify-center items-center gap-4 mb-8">
          {pattern.sequence.map((item, index) => (
            <div
              key={index}
              className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center text-4xl border-2 border-gray-300"
            >
              {item}
            </div>
          ))}

          <div className="w-20 h-20 bg-primary-100 rounded-xl flex items-center justify-center text-4xl border-4 border-primary-400 border-dashed">
            ?
          </div>
        </div>

        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            role="alert"
            aria-live="assertive"
            tabIndex={0}
            className={`text-center p-4 rounded-lg mb-6 ${
              feedback === 'correct'
                ? 'bg-success-100 text-success-800'
                : 'bg-error-100 text-error-800'
            }`}
          >
            <div className="flex items-center justify-center gap-2 text-xl font-semibold">
              {feedback === 'correct' ? (
                <>
                  <CheckCircle size={24} />
                  ¡Correcto!
                </>
              ) : (
                <>
                  <XCircle size={24} />
                  Incorrecto
                </>
              )}
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-3 gap-4">
          {pattern.options.map((option, index) => (
            <motion.button
              key={index}
              onClick={() => !feedback && handleAnswer(option)}
              disabled={!!feedback}
              className={`
                aspect-square rounded-xl bg-white border-4 border-gray-300
                hover:border-primary-400 hover:shadow-lg
                transition-all duration-200 text-6xl
                focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-500 focus-visible:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
              whileHover={!feedback ? { scale: 1.05 } : {}}
              whileTap={!feedback ? { scale: 0.95 } : {}}
              aria-label={`Opción ${index + 1}: ${option}`}
            >
              {option}
            </motion.button>
          ))}
        </div>
      </Card>
    </div>
  );
};
