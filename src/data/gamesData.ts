import { GameInfo, GameType, DifficultyLevel } from '../types/index';

/**
 * Catálogo de juegos disponibles
 */
export const GAMES_CATALOG: GameInfo[] = [
  // ============================================
  // JUEGOS DE MEMORIA
  // ============================================
  {
    id: 'memory-pairs',
    type: GameType.MEMORY,
    name: 'Encuentra las Parejas',
    description: 'Encuentra todas las parejas de cartas iguales. Ejercita tu memoria visual.',
    icon: 'brain',
    category: 'memory',
    difficulty: DifficultyLevel.EASY,
    estimatedTime: 180,
    instructions: [
      'Se mostrarán cartas boca abajo',
      'Haz clic en dos cartas para voltearlas',
      'Si las cartas son iguales, se quedarán visibles',
      'Si son diferentes, se volverán a ocultar',
      'Encuentra todas las parejas para ganar',
    ],
  },
  {
    id: 'sequence-memory',
    type: GameType.SEQUENCE,
    name: 'Secuencia Visual',
    description: 'Memoriza y repite la secuencia de colores mostrada.',
    icon: 'layers',
    category: 'memory',
    difficulty: DifficultyLevel.MEDIUM,
    estimatedTime: 120,
    instructions: [
      'Observa la secuencia de colores que se ilumina',
      'Espera a que termine la secuencia',
      'Repite la secuencia en el mismo orden',
      'Cada ronda añade un color más',
      'Trata de llegar lo más lejos posible',
    ],
  },

  // ============================================
  // JUEGOS DE ATENCIÓN
  // ============================================
  {
    id: 'find-different',
    type: GameType.ATTENTION,
    name: 'Encuentra el Diferente',
    description: 'Identifica el elemento que es diferente a los demás.',
    icon: 'search',
    category: 'attention',
    difficulty: DifficultyLevel.EASY,
    estimatedTime: 90,
    instructions: [
      'Observa todos los elementos en pantalla',
      'Encuentra el que es diferente',
      'Haz clic en el elemento diferente',
      'Tienes tiempo limitado para cada ronda',
      'Cuanto más rápido, más puntos',
    ],
  },
  {
    id: 'reaction-time',
    type: GameType.REACTION,
    name: 'Tiempo de Reacción',
    description: 'Responde rápidamente cuando veas el estímulo visual correcto.',
    icon: 'zap',
    category: 'attention',
    difficulty: DifficultyLevel.MEDIUM,
    estimatedTime: 60,
    instructions: [
      'Observa la pantalla atentamente',
      'Cuando veas el círculo VERDE, haz clic',
      'NO hagas clic si ves otro color',
      'Responde lo más rápido posible',
      'Evita los clics incorrectos',
    ],
  },
  {
    id: 'counting-objects',
    type: GameType.ATTENTION,
    name: 'Cuenta los Elementos',
    description: 'Cuenta cuántos elementos de un tipo específico aparecen en pantalla.',
    icon: 'hash',
    category: 'attention',
    difficulty: DifficultyLevel.HARD,
    estimatedTime: 120,
    instructions: [
      'Aparecerán varios elementos en pantalla',
      'Se te pedirá contar un tipo específico',
      'Cuenta mentalmente los elementos',
      'Selecciona la cantidad correcta',
      'Tienes tiempo limitado',
    ],
  },

  // ============================================
  // JUEGOS DE LÓGICA
  // ============================================
  {
    id: 'pattern-completion',
    type: GameType.LOGIC,
    name: 'Completa el Patrón',
    description: 'Identifica el patrón y selecciona la pieza que falta.',
    icon: 'puzzle',
    category: 'logic',
    difficulty: DifficultyLevel.MEDIUM,
    estimatedTime: 150,
    instructions: [
      'Observa la secuencia de figuras',
      'Identifica el patrón que siguen',
      'Encuentra qué figura completa el patrón',
      'Selecciona la opción correcta',
      'Los patrones se vuelven más complejos',
    ],
  },
  {
    id: 'color-sequence',
    type: GameType.LOGIC,
    name: 'Secuencia de Colores',
    description: 'Descubre el patrón en la secuencia de colores.',
    icon: 'palette',
    category: 'logic',
    difficulty: DifficultyLevel.EASY,
    estimatedTime: 100,
    instructions: [
      'Se muestra una secuencia de colores',
      'Identifica el patrón que siguen',
      'Selecciona el siguiente color de la secuencia',
      'Hay diferentes tipos de patrones',
      'Usa la lógica para deducir la respuesta',
    ],
  },
  {
    id: 'shape-sorting',
    type: GameType.LOGIC,
    name: 'Clasificación de Formas',
    description: 'Clasifica las formas según sus características.',
    icon: 'shapes',
    category: 'logic',
    difficulty: DifficultyLevel.HARD,
    estimatedTime: 180,
    instructions: [
      'Observa las formas y sus propiedades',
      'Identifica la regla de clasificación',
      'Arrastra cada forma al grupo correcto',
      'Las reglas pueden cambiar',
      'Presta atención a color, tamaño y forma',
    ],
  },
];

/**
 * Obtiene todos los juegos de una categoría específica
 */
export const getGamesByCategory = (category: 'memory' | 'logic' | 'attention'): GameInfo[] => {
  return GAMES_CATALOG.filter(game => game.category === category);
};

/**
 * Obtiene todos los juegos de un tipo específico
 */
export const getGamesByType = (type: GameType): GameInfo[] => {
  return GAMES_CATALOG.filter(game => game.type === type);
};

/**
 * Obtiene un juego por su ID
 */
export const getGameById = (id: string): GameInfo | undefined => {
  return GAMES_CATALOG.find(game => game.id === id);
};

/**
 * Obtiene juegos por nivel de dificultad
 */
export const getGamesByDifficulty = (difficulty: DifficultyLevel): GameInfo[] => {
  return GAMES_CATALOG.filter(game => game.difficulty === difficulty);
};

/**
 * Obtiene un juego aleatorio
 */
export const getRandomGame = (): GameInfo => {
  const randomIndex = Math.floor(Math.random() * GAMES_CATALOG.length);
  return GAMES_CATALOG[randomIndex];
};

/**
 * Obtiene juegos recomendados basados en el historial del usuario
 */
export const getRecommendedGames = (
  playedGameIds: string[],
  preferredCategory?: 'memory' | 'logic' | 'attention'
): GameInfo[] => {
  let availableGames = GAMES_CATALOG.filter(game => !playedGameIds.includes(game.id));

  if (preferredCategory) {
    availableGames = availableGames.filter(game => game.category === preferredCategory);
  }

  // Si ya jugó todos, devolver todos
  if (availableGames.length === 0) {
    availableGames = GAMES_CATALOG;
  }

  // Devolver hasta 3 juegos recomendados
  return availableGames.slice(0, 3);
};
