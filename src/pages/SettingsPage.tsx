import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button, Card, Toggle } from '../components/ui';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { ArrowLeft, Settings as SettingsIcon } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';

export const SettingsPage: React.FC = () => {
  usePageTitle('Configuración');
  const navigate = useNavigate();
  const {
    settings,
    toggleHighContrast,
    toggleSubtitles,
    toggleSound,
    toggleReducedMotion,
    toggleExtendedTime,
    setFontSize,
  } = useAccessibility();

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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="mb-8 text-center">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SettingsIcon size={40} className="text-primary-600" aria-hidden="true" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2" tabIndex={0}>
            Configuración
          </h1>
          <p className="text-lg text-gray-600" tabIndex={0}>
            Personaliza la aplicación según tus necesidades
          </p>
        </div>

        <Card className="space-y-8">
          {/* Feedback de guardado automático */}
          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg" role="status" aria-live="polite" tabIndex={0}>
            <span aria-hidden="true">✓</span>
            <span>Los cambios se guardan automáticamente</span>
          </div>

          <section aria-labelledby="accessibility-heading">
            <h2
              id="accessibility-heading"
              className="text-2xl font-semibold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200"
            >
              Accesibilidad
            </h2>

            <div className="space-y-6">
              <Toggle
                label="Alto Contraste"
                description="Aumenta el contraste de colores para mejorar la visibilidad"
                checked={settings.highContrast}
                onCheckedChange={toggleHighContrast}
              />

              <Toggle
                label="Subtítulos"
                description="Muestra subtítulos en todos los contenidos con audio"
                checked={settings.subtitlesEnabled}
                onCheckedChange={toggleSubtitles}
              />

              <Toggle
                label="Sonido"
                description="Activa efectos de sonido y música de fondo"
                checked={settings.soundEnabled}
                onCheckedChange={toggleSound}
              />

              <Toggle
                label="Reducir Movimiento"
                description="Minimiza las animaciones y transiciones"
                checked={settings.reducedMotion}
                onCheckedChange={toggleReducedMotion}
              />

              <Toggle
                label="Tiempo Extendido"
                description="Duplica el tiempo disponible en juegos con límite de tiempo (WCAG 2.2.1)"
                checked={settings.extendedTime}
                onCheckedChange={toggleExtendedTime}
              />

              <div>
                <label
                  htmlFor="font-size"
                  className="block text-lg font-medium text-gray-900 mb-3"
                >
                  Tamaño de Texto
                </label>
                <div className="flex gap-3" role="radiogroup" aria-labelledby="font-size">
                  {(['normal', 'large', 'extra-large'] as const).map((size) => (
                    <button
                      key={size}
                      role="radio"
                      aria-checked={settings.fontSize === size}
                      onClick={() => setFontSize(size)}
                      title={`Cambiar a tamaño ${size === 'normal' ? 'normal (16px)' : size === 'large' ? 'grande (18px)' : 'extra grande (20px)'}`}
                      className={`flex-1 px-6 py-4 rounded-lg font-medium transition-all touch-target ${
                        settings.fontSize === size
                          ? 'bg-primary-600 text-white shadow-lg'
                          : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-primary-400'
                      }`}
                    >
                      {size === 'normal' ? 'Normal' : size === 'large' ? 'Grande' : 'Extra Grande'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section aria-labelledby="info-heading">
            <h2
              id="info-heading"
              className="text-2xl font-semibold text-gray-900 mb-4 pb-3 border-b-2 border-gray-200"
              tabIndex={0}
            >
              Información
            </h2>
            <div className="space-y-3 text-gray-700">
              <p tabIndex={0}>
                <strong>Versión:</strong> 1.0.0
              </p>
              <p tabIndex={0}>
                <strong>Accesibilidad:</strong> Esta aplicación está diseñada
                específicamente para personas con discapacidad auditiva moderada.
              </p>
              <p className="text-sm text-gray-500" tabIndex={0}>
                Toda la información importante se presenta visualmente con iconos,
                colores y texto claro. Los sonidos son opcionales y complementarios.
              </p>
            </div>
          </section>
        </Card>
      </motion.div>
    </div>
  );
};
