# 🧠 Entrenamiento Cognitivo - Aplicación Web Accesible

Una aplicación web de juegos educativos diseñada específicamente para personas con discapacidad auditiva moderada, con un fuerte enfoque en accesibilidad, usabilidad y comunicación visual.

## ✨ Características Principales

### 🎯 Accesibilidad Completa
- **Sin dependencia de audio**: Toda la información se presenta visualmente
- **Navegación por teclado**: 100% navegable con Tab, Enter y flechas
- **Lectores de pantalla**: Compatible con NVDA, JAWS y otros
- **Alto contraste**: Modo de alto contraste ajustable
- **Tamaño de texto**: 3 niveles de tamaño (Normal, Grande, Extra Grande)
- **Movimiento reducido**: Respeta las preferencias del sistema
- **Skip links**: Saltos de navegación para acceso rápido
- **ARIA labels**: Etiquetas descriptivas en todos los elementos interactivos

### 🎮 Juegos Incluidos

1. **Encuentra las Parejas (Memoria)**
   - Ejercita la memoria visual
   - Dificultad: Fácil
   - Duración: ~3 minutos

2. **Secuencia Visual (Memoria)**
   - Repite patrones de colores
   - Dificultad: Media
   - Duración: ~2 minutos

3. **Encuentra el Diferente (Atención)**
   - Identifica elementos únicos
   - Dificultad: Fácil
   - Duración: ~1.5 minutos

4. **Completa el Patrón (Lógica)**
   - Resuelve secuencias lógicas
   - Dificultad: Media
   - Duración: ~2.5 minutos

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 18+
- npm o yarn

### Instalación

\`\`\`bash
# Navegar al directorio del proyecto
cd cognitive-game

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
\`\`\`

### Acceso
Una vez iniciado, la aplicación estará disponible en:
\`\`\`
http://localhost:5173
\`\`\`

## 🏗️ Arquitectura Técnica

### Stack Tecnológico
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Estilos**: TailwindCSS
- **Animaciones**: Framer Motion
- **Iconos**: Lucide React
- **Routing**: React Router DOM
- **Almacenamiento**: LocalStorage

### Estructura del Proyecto

\`\`\`
cognitive-game/
├── src/
│   ├── components/
│   │   ├── games/          # Componentes de juegos
│   │   └── ui/             # Componentes UI reutilizables
│   ├── contexts/           # React Contexts
│   ├── data/              # Datos estáticos
│   ├── models/            # Modelos de datos
│   ├── pages/             # Páginas/Rutas
│   ├── services/          # Servicios
│   ├── types/             # Definiciones TypeScript
│   └── utils/             # Utilidades
└── ...
\`\`\`

## 🎨 Diseño y UX

### Principios de Diseño
1. **Claridad Visual**: Iconos grandes, texto legible, colores distintivos
2. **Consistencia**: Patrones de interacción predecibles
3. **Retroalimentación**: Respuesta visual inmediata a cada acción
4. **Simplicidad**: Interfaz minimalista sin distracciones
5. **Accesibilidad First**: Diseñado desde el inicio para todos

## 📄 Licencia

Este proyecto es de código abierto y está disponible para fines educativos.

---

**Desarrollado con ❤️ pensando en la inclusión y accesibilidad**
