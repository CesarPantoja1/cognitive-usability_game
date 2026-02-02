import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función auxiliar para crear directorios
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Función auxiliar para escribir archivos
function writeFile(filePath, content) {
  ensureDirectoryExists(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Creado: ${filePath}`);
}

const pagesDir = path.join(__dirname, 'src', 'pages');
ensureDirectoryExists(pagesDir);

// ============================================
// PÁGINA DE INICIO (HomePage.tsx)
// ============================================
const homePageContent = `import React from 'react';
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
`;

writeFile(path.join(pagesDir, 'HomePage.tsx'), homePageContent);

// ============================================
// PÁGINA DE SELECCIÓN DE ENTRENAMIENTO
// ============================================
const trainingSelectionPageContent = `import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button, Card, Icon, Badge } from '../components/ui';
import { GAMES_CATALOG, getGamesByCategory } from '../data/gamesData';
import { ArrowLeft, Brain, Target, Sparkles } from 'lucide-react';
import { getIcon } from '../utils/iconMapping';

type Category = 'all' | 'memory' | 'logic' | 'attention';

export const TrainingSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');

  const filteredGames = selectedCategory === 'all'
    ? GAMES_CATALOG
    : getGamesByCategory(selectedCategory);

  const categoryIcons = {
    all: <Sparkles size={24} />,
    memory: <Brain size={24} />,
    logic: <Target size={24} />,
    attention: <Brain size={24} />,
  };

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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Selecciona un Juego
        </h1>
        <p className="text-lg text-gray-600">
          Elige un juego para comenzar tu entrenamiento cognitivo
        </p>
      </motion.div>

      {/* Filtros de categoría */}
      <div className="flex flex-wrap gap-3 justify-center mb-8" role="group" aria-label="Filtrar por categoría">
        {(['all', 'memory', 'logic', 'attention'] as Category[]).map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={\`px-6 py-3 rounded-lg font-medium transition-all \${
              selectedCategory === category
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
            }\`}
            aria-pressed={selectedCategory === category}
          >
            {category === 'all' ? 'Todos' : category === 'memory' ? 'Memoria' : category === 'logic' ? 'Lógica' : 'Atención'}
          </button>
        ))}
      </div>

      {/* Lista de juegos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              interactive
              onClick={() => navigate(\`/instructions/\${game.id}\`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(\`/instructions/\${game.id}\`);
                }
              }}
              aria-label={\`Jugar \${game.name}\`}
              className="h-full flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center">
                  {getIcon(game.icon, 32)}
                </div>
                <Badge variant="primary">
                  {game.difficulty === 'easy' ? 'Fácil' : game.difficulty === 'medium' ? 'Medio' : 'Difícil'}
                </Badge>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {game.name}
              </h3>

              <p className="text-gray-600 mb-4 flex-grow">
                {game.description}
              </p>

              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Aprox. {Math.floor(game.estimatedTime / 60)} min
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
`;

writeFile(path.join(pagesDir, 'TrainingSelectionPage.tsx'), trainingSelectionPageContent);

console.log('\\n✅ Archivos de páginas generados exitosamente!');
console.log('\\nPróximos pasos:');
console.log('1. Ejecutar: npm run dev');
console.log('2. Los archivos restantes se crearán en el siguiente paso');
