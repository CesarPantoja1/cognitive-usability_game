import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button, ProgressBar } from '../ui';
import { RotateCcw, Trophy, Zap } from 'lucide-react';

interface MemoryCard {
  id: string;
  pairId: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryGameProps {
  onComplete: (score: number, accuracy: number) => void;
}

const EMOJI_SETS = [
  ['🎨', '🎭', '🎪', '🎯', '🎲', '🎸', '🎺', '🎻'],
  ['🌸', '🌺', '🌻', '🌼', '🌷', '🌹', '🪻', '🪷'],
  ['🦋', '🐝', '🐛', '🦗', '🐞', '🐌', '🪲', '🦂'],
  ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🫐'],
];

const CARDS_COUNT = 16;

export const MemoryGame: React.FC<MemoryGameProps> = ({ onComplete }) => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentEmojiSet] = useState(() => 
    EMOJI_SETS[Math.floor(Math.random() * EMOJI_SETS.length)]
  );

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const gameCards: MemoryCard[] = [];
    const pairs = CARDS_COUNT / 2;

    for (let i = 0; i < pairs; i++) {
      const emoji = currentEmojiSet[i % currentEmojiSet.length];

      gameCards.push({
        id: `card-${i}-a`,
        pairId: i,
        emoji,
        isFlipped: false,
        isMatched: false,
      });

      gameCards.push({
        id: `card-${i}-b`,
        pairId: i,
        emoji,
        isFlipped: false,
        isMatched: false,
      });
    }

    const shuffled = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setMoves(0);
    setMatches(0);
    setFlippedCards([]);
    setShowCelebration(false);
  };

  const handleCardClick = (cardId: string) => {
    if (isChecking) return;

    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    if (flippedCards.length < 2) {
      const newFlippedCards = [...flippedCards, cardId];
      setFlippedCards(newFlippedCards);

      setCards(cards.map(c =>
        c.id === cardId ? { ...c, isFlipped: true } : c
      ));

      if (newFlippedCards.length === 2) {
        setMoves(moves + 1);
        checkMatch(newFlippedCards);
      }
    }
  };

  const checkMatch = (flipped: string[]) => {
    setIsChecking(true);

    const [firstId, secondId] = flipped;
    const firstCard = cards.find(c => c.id === firstId);
    const secondCard = cards.find(c => c.id === secondId);

    if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
      setTimeout(() => {
        setCards(prev => prev.map(c =>
          c.id === firstId || c.id === secondId
            ? { ...c, isMatched: true }
            : c
        ));
        setMatches(prev => prev + 1);
        setFlippedCards([]);
        setIsChecking(false);

        if (matches + 1 === CARDS_COUNT / 2) {
          setShowCelebration(true);
          completeGame();
        }
      }, 600);
    } else {
      setTimeout(() => {
        setCards(prev => prev.map(c =>
          c.id === firstId || c.id === secondId
            ? { ...c, isFlipped: false }
            : c
        ));
        setFlippedCards([]);
        setIsChecking(false);
      }, 1000);
    }
  };

  const completeGame = () => {
    setTimeout(() => {
      const perfectMoves = CARDS_COUNT / 2;
      const efficiency = perfectMoves / moves;
      const score = Math.round(1000 * efficiency);
      const accuracy = Math.min(efficiency, 1);

      onComplete(score, accuracy);
    }, 1500);
  };

  const progress = (matches / (CARDS_COUNT / 2)) * 100;

  return (
    <div className="max-w-4xl mx-auto" role="main" aria-label="Juego de memoria">
      {/* Panel de estadísticas */}
      <Card className="mb-6 bg-gradient-to-r from-primary-50 to-indigo-50 border-primary-100">
        <div className="flex flex-wrap justify-between items-center gap-4" role="status" aria-live="polite">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                <Zap className="w-4 h-4 text-amber-500" aria-hidden="true" />
                <span id="moves-label">Movimientos</span>
              </div>
              <div className="text-3xl font-bold text-primary-600" aria-labelledby="moves-label">{moves}</div>
            </div>
            
            <div className="h-12 w-px bg-gray-200" aria-hidden="true" />
            
            <div className="text-center">
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                <Trophy className="w-4 h-4 text-green-500" aria-hidden="true" />
                <span id="pairs-label">Parejas</span>
              </div>
              <div className="text-3xl font-bold text-success-600" aria-labelledby="pairs-label">
                {matches} / {CARDS_COUNT / 2}
              </div>
            </div>
          </div>
          
          <Button
            variant="secondary"
            onClick={initializeGame}
            icon={<RotateCcw size={18} aria-hidden="true" />}
            size="small"
            aria-label="Reiniciar el juego de memoria"
          >
            Reiniciar
          </Button>
        </div>
        
        {/* Barra de progreso */}
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

      {/* Tablero de cartas */}
      <div 
        className="grid grid-cols-4 gap-2 sm:gap-3" 
        role="grid" 
        aria-label={`Tablero de memoria con ${CARDS_COUNT} cartas. ${matches} parejas encontradas de ${CARDS_COUNT / 2}.`}
      >
        <AnimatePresence>
          {cards.map((card) => (
            <motion.button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`
                aspect-square rounded-lg sm:rounded-xl text-2xl sm:text-3xl
                flex items-center justify-center
                font-bold transition-all duration-300
                focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-400 focus-visible:ring-offset-2
                relative overflow-hidden
                ${
                  card.isMatched
                    ? 'bg-gradient-to-br from-green-100 to-emerald-100 border-4 border-green-400 cursor-default'
                    : card.isFlipped
                    ? 'bg-white border-4 border-primary-400 shadow-lg'
                    : 'bg-gradient-to-br from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-700 cursor-pointer shadow-md hover:shadow-xl'
                }
              `}
              disabled={card.isFlipped || card.isMatched || isChecking}
              whileHover={!card.isFlipped && !card.isMatched ? { scale: 1.05 } : {}}
              whileTap={!card.isFlipped && !card.isMatched ? { scale: 0.95 } : {}}
              aria-label={
                card.isMatched
                  ? `Carta emparejada: ${card.emoji}`
                  : card.isFlipped
                  ? `Carta volteada: ${card.emoji}`
                  : 'Carta oculta - clic para voltear'
              }
            >
              {card.isFlipped || card.isMatched ? (
                <motion.span
                  initial={{ rotateY: 90, scale: 0.5 }}
                  animate={{ rotateY: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {card.emoji}
                </motion.span>
              ) : (
                <span className="text-white text-xl">?</span>
              )}
              
              {/* Efecto de brillo en tarjetas emparejadas */}
              {card.isMatched && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                />
              )}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Mensaje de celebración */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            role="alert"
            aria-live="assertive"
          >
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: 2 }}
                className="text-8xl mb-4"
                aria-hidden="true"
              >
                🎉
              </motion.div>
              <h2 className="text-4xl font-bold text-primary-600">
                ¡Excelente! Has completado el juego
              </h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};