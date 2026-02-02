import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import { ProgressProvider } from './contexts/ProgressContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { HomePageEnhanced as HomePage } from './pages/HomePageEnhanced';
import { TrainingSelectionPage } from './pages/TrainingSelectionPageEnhanced';
import { InstructionsPage } from './pages/InstructionsPage';
import { GamePage } from './pages/GamePage';
import { ResultsPage } from './pages/ResultsPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { ProgressPage } from './pages/ProgressPage';
import { SettingsPage } from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LeaderboardPage from './pages/LeaderboardPage';
import './index.css';

/**
 * Componente para proteger rutas que requieren autenticación
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

/**
 * Componente para rutas públicas (redirige si ya está autenticado)
 */
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

/**
 * Contenido principal de la aplicación con rutas
 */
function AppContent() {
  return (
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
          {/* Rutas públicas (login/register) */}
          <Route path="/login" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          } />

          {/* Rutas protegidas */}
          <Route path="/" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />
          <Route path="/training" element={
            <ProtectedRoute>
              <TrainingSelectionPage />
            </ProtectedRoute>
          } />
          <Route path="/instructions/:gameId" element={
            <ProtectedRoute>
              <InstructionsPage />
            </ProtectedRoute>
          } />
          <Route path="/game/:gameId" element={
            <ProtectedRoute>
              <GamePage />
            </ProtectedRoute>
          } />
          <Route path="/results/:sessionId" element={
            <ProtectedRoute>
              <ResultsPage />
            </ProtectedRoute>
          } />
          <Route path="/feedback/:sessionId" element={
            <ProtectedRoute>
              <FeedbackPage />
            </ProtectedRoute>
          } />
          <Route path="/progress" element={
            <ProtectedRoute>
              <ProgressPage />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } />
          <Route path="/leaderboard" element={
            <ProtectedRoute>
              <LeaderboardPage />
            </ProtectedRoute>
          } />
          
          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

/**
 * Componente principal de la aplicación
 */
function App() {
  return (
    <AuthProvider>
      <AccessibilityProvider>
        <ProgressProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </ProgressProvider>
      </AccessibilityProvider>
    </AuthProvider>
  );
}

export default App;
