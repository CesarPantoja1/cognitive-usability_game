import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import { ProgressProvider } from './contexts/ProgressContext';
import { HomePage } from './pages/HomePage';
import { TrainingSelectionPage } from './pages/TrainingSelectionPage';
import { InstructionsPage } from './pages/InstructionsPage';
import { GamePage } from './pages/GamePage';
import { ResultsPage } from './pages/ResultsPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { ProgressPage } from './pages/ProgressPage';
import { SettingsPage } from './pages/SettingsPage';
import './index.css';

/**
 * Componente principal de la aplicación
 */
function App() {
  return (
    <AccessibilityProvider>
      <ProgressProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50">
            {/* Skip link para accesibilidad */}
            <a href="#main-content" className="skip-link">
              Saltar al contenido principal
            </a>

            {/* Región de anuncios en vivo para lectores de pantalla */}
            <div
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="live-region"
              id="live-region"
            />

            {/* Contenido principal */}
            <main id="main-content" tabIndex={-1}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/training" element={<TrainingSelectionPage />} />
                <Route path="/instructions/:gameId" element={<InstructionsPage />} />
                <Route path="/game/:gameId" element={<GamePage />} />
                <Route path="/results/:sessionId" element={<ResultsPage />} />
                <Route path="/feedback/:sessionId" element={<FeedbackPage />} />
                <Route path="/progress" element={<ProgressPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </ProgressProvider>
    </AccessibilityProvider>
  );
}

export default App;
