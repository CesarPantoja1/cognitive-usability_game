import { useEffect } from 'react';

/**
 * Hook para actualizar el título de la página de forma accesible.
 * Cumple con WCAG 2.4.2 - Titulado de páginas (Nivel A)
 * 
 * @param title - Título específico de la página
 * @param suffix - Sufijo opcional (por defecto incluye el nombre de la app)
 */
export function usePageTitle(title: string, suffix = ' | MindGym'): void {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title + suffix;

    // Restaurar título anterior al desmontar (útil para navegación)
    return () => {
      document.title = previousTitle;
    };
  }, [title, suffix]);
}

export default usePageTitle;
