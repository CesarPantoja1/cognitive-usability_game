# 🚀 Inicio Rápido

## Ejecutar la Aplicación

### 1. Instalar Dependencias
```bash
cd cognitive-game
npm install
```

### 2. Iniciar el Servidor de Desarrollo
```bash
npm run dev
```

### 3. Abrir en el Navegador
Navega a: **http://localhost:5173** (o el puerto que se muestre en la terminal)

---

## 📁 Estructura de Archivos Importante

```
cognitive-game/
├── src/
│   ├── pages/              # Páginas principales de la app
│   │   ├── HomePage.tsx           # Página de inicio
│   │   ├── TrainingSelectionPage.tsx  # Selección de juegos
│   │   ├── GamePage.tsx           # Jugando un juego
│   │   ├── ResultsPage.tsx        # Resultados del juego
│   │   └── SettingsPage.tsx       # Configuración
│   │
│   ├── components/
│   │   ├── games/          # Juegos implementados
│   │   │   ├── MemoryGame.tsx     # Juego de memoria
│   │   │   ├── SequenceGame.tsx   # Secuencia de colores
│   │   │   ├── AttentionGame.tsx  # Encuentra el diferente
│   │   │   └── LogicGame.tsx      # Completa patrones
│   │   │
│   │   └── ui/             # Componentes reutilizables
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── ...
│   │
│   ├── types/index.ts      # Definiciones de tipos TypeScript
│   ├── models/             # Clases de lógica de negocio
│   ├── contexts/           # Contextos de React (estado global)
│   └── services/           # Servicios (almacenamiento, etc.)
```

---

## 🎮 Flujo de la Aplicación

1. **Inicio** (`/`) → Pantalla principal con 3 opciones
2. **Entrenar** (`/training`) → Selecciona un juego
3. **Instrucciones** (`/instructions/:gameId`) → Lee las instrucciones
4. **Jugar** (`/game/:gameId`) → Juega el juego seleccionado
5. **Resultados** (`/results/:sessionId`) → Ve tu desempeño
6. **Retroalimentación** (`/feedback/:sessionId`) → Comparte cómo te sentiste
7. **Progreso** (`/progress`) → Estadísticas generales
8. **Configuración** (`/settings`) → Ajusta accesibilidad

---

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo

# Producción
npm run build            # Construir para producción
npm run preview          # Previsualizar build de producción

# Linting
npm run lint             # Verificar código
```

---

## ✅ Características Implementadas

- ✅ 4 Juegos funcionales
- ✅ Sistema de progreso y logros
- ✅ Configuración de accesibilidad
- ✅ Navegación por teclado completa
- ✅ Almacenamiento local (LocalStorage)
- ✅ Animaciones y efectos visuales
- ✅ Diseño responsivo
- ✅ Alto contraste y tamaño de texto ajustable

---

## 📝 Personalización

### Agregar un Nuevo Juego

1. Crear componente en `src/components/games/NuevoJuego.tsx`
2. Agregar definición en `src/data/gamesData.ts`
3. Importar en `src/pages/GamePage.tsx`
4. Agregar caso en el switch del GamePage

### Modificar Colores

Editar `tailwind.config.js` para cambiar la paleta de colores.

### Ajustar Accesibilidad

Modificar configuraciones por defecto en:
- `src/services/StorageService.ts` → `getDefaultAccessibilitySettings()`

---

## 🐛 Solución de Problemas

### El servidor no inicia
```bash
# Verificar que Node.js esté instalado
node --version

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Errores de TypeScript
```bash
# Verificar configuración de TypeScript
npm run type-check
```

### Limpiar caché
```bash
# Borrar archivos temporales de Vite
rm -rf .vite node_modules/.cache
```

---

## 🌐 Navegadores Soportados

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

---

## 📧 Soporte

Para reportar problemas o sugerencias, crear un issue en el repositorio del proyecto.
