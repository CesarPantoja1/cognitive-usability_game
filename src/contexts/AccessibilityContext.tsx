import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AccessibilitySettings } from '../types/index';
import { StorageService } from '../services/StorageService';

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
  toggleHighContrast: () => void;
  toggleSubtitles: () => void;
  toggleSound: () => void;
  toggleReducedMotion: () => void;
  setFontSize: (size: 'normal' | 'large' | 'extra-large') => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

interface AccessibilityProviderProps {
  children: ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    const saved = StorageService.loadAccessibilitySettings();
    return saved || StorageService.getDefaultAccessibilitySettings();
  });

  // Guardar configuración cada vez que cambie
  useEffect(() => {
    StorageService.saveAccessibilitySettings(settings);

    // Aplicar alto contraste al body si está activado
    if (settings.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }

    // Aplicar tamaño de fuente
    document.documentElement.style.fontSize = {
      normal: '16px',
      large: '18px',
      'extra-large': '20px',
    }[settings.fontSize];

    // Respetar preferencia de movimiento reducido
    if (settings.reducedMotion) {
      document.body.classList.add('reduce-motion');
    } else {
      document.body.classList.remove('reduce-motion');
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const toggleHighContrast = () => {
    setSettings(prev => ({ ...prev, highContrast: !prev.highContrast }));
  };

  const toggleSubtitles = () => {
    setSettings(prev => ({ ...prev, subtitlesEnabled: !prev.subtitlesEnabled }));
  };

  const toggleSound = () => {
    setSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  const toggleReducedMotion = () => {
    setSettings(prev => ({ ...prev, reducedMotion: !prev.reducedMotion }));
  };

  const setFontSize = (size: 'normal' | 'large' | 'extra-large') => {
    setSettings(prev => ({ ...prev, fontSize: size }));
  };

  const value: AccessibilityContextType = {
    settings,
    updateSettings,
    toggleHighContrast,
    toggleSubtitles,
    toggleSound,
    toggleReducedMotion,
    setFontSize,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility debe ser usado dentro de AccessibilityProvider');
  }
  return context;
};
