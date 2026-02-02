import {
  Brain,
  Layers,
  Search,
  Zap,
  Hash,
  Puzzle,
  Palette,
  Shapes,
  Trophy,
  Star,
  Medal,
  Award,
  Target,
  Home,
  BarChart3,
  Settings,
  Play,
  CheckCircle,
  XCircle,
  Clock,
  Smile,
  Frown,
  Meh,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Type,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

/**
 * Mapeo de nombres de iconos a componentes de Lucide React
 */
export const iconMap = {
  // Juegos
  brain: Brain,
  layers: Layers,
  search: Search,
  zap: Zap,
  hash: Hash,
  puzzle: Puzzle,
  palette: Palette,
  shapes: Shapes,

  // Logros
  trophy: Trophy,
  star: Star,
  medal: Medal,
  award: Award,
  target: Target,
  sparkles: Sparkles,

  // Navegación
  home: Home,
  chart: BarChart3,
  settings: Settings,
  play: Play,

  // Estados
  check: CheckCircle,
  error: XCircle,
  clock: Clock,

  // Emociones
  happy: Smile,
  sad: Frown,
  neutral: Meh,

  // Accesibilidad
  sound: Volume2,
  'sound-off': VolumeX,
  'eye': Eye,
  'eye-off': EyeOff,
  'text': Type,
  help: HelpCircle,

  // Acciones
  'arrow-right': ArrowRight,
  'arrow-left': ArrowLeft,
  restart: RotateCcw,
};

export type IconName = keyof typeof iconMap;

/**
 * Mapa de etiquetas accesibles para cada icono
 */
export const iconLabels: Record<string, string> = {
  brain: 'Cerebro',
  layers: 'Capas',
  search: 'Buscar',
  zap: 'Velocidad',
  hash: 'Números',
  puzzle: 'Puzzle',
  palette: 'Paleta de colores',
  shapes: 'Formas',
  trophy: 'Trofeo',
  star: 'Estrella',
  medal: 'Medalla',
  award: 'Premio',
  target: 'Objetivo',
  sparkles: 'Destellos',
  home: 'Inicio',
  chart: 'Gráfico',
  settings: 'Configuración',
  play: 'Jugar',
  check: 'Correcto',
  error: 'Error',
  clock: 'Tiempo',
  happy: 'Feliz',
  sad: 'Triste',
  neutral: 'Neutral',
  sound: 'Sonido activado',
  'sound-off': 'Sonido desactivado',
  eye: 'Visible',
  'eye-off': 'Oculto',
  text: 'Texto',
  help: 'Ayuda',
  'arrow-right': 'Siguiente',
  'arrow-left': 'Anterior',
  restart: 'Reiniciar',
};

/**
 * Obtiene un componente de icono por su nombre con accesibilidad integrada
 * @param name - Nombre del icono
 * @param size - Tamaño del icono en pixeles
 * @param ariaLabel - Etiqueta personalizada para lectores de pantalla (opcional)
 */
export const getIcon = (name: string, size: number = 24, ariaLabel?: string) => {
  const IconComponent = iconMap[name as IconName];
  if (!IconComponent) return null;
  
  const label = ariaLabel || iconLabels[name] || name;
  
  return (
    <span role="img" aria-label={label}>
      <IconComponent size={size} aria-hidden="true" />
    </span>
  );
};

/**
 * Obtiene un icono decorativo (sin significado semántico)
 * @param name - Nombre del icono
 * @param size - Tamaño del icono en pixeles
 */
export const getDecorativeIcon = (name: string, size: number = 24) => {
  const IconComponent = iconMap[name as IconName];
  return IconComponent ? <IconComponent size={size} aria-hidden="true" /> : null;
};
