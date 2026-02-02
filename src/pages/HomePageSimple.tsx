import React from 'react';
import { useNavigate } from 'react-router-dom';

export const HomePageSimple: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Inter, Arial, sans-serif',
      backgroundColor: '#f9fafb'
    }}>
      <h1 style={{
        fontSize: '3rem',
        fontWeight: 'bold',
        color: '#0369a1',
        marginBottom: '1rem'
      }}>
        🧠 Entrenamiento Cognitivo
      </h1>

      <p style={{
        fontSize: '1.25rem',
        color: '#4b5563',
        marginBottom: '3rem',
        textAlign: 'center',
        maxWidth: '600px'
      }}>
        Ejercita tu mente con juegos diseñados para estimular la memoria,
        lógica y atención de manera accesible y divertida.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        width: '100%',
        maxWidth: '900px'
      }}>
        <button
          onClick={() => navigate('/training')}
          style={{
            padding: '2rem',
            backgroundColor: 'white',
            border: '2px solid #e5e7eb',
            borderRadius: '1rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#38bdf8';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎮</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            Entrenar
          </h2>
          <p style={{ color: '#6b7280' }}>
            Comienza tu entrenamiento cognitivo
          </p>
        </button>

        <button
          onClick={() => navigate('/progress')}
          style={{
            padding: '2rem',
            backgroundColor: 'white',
            border: '2px solid #e5e7eb',
            borderRadius: '1rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#4ade80';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📊</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            Progreso
          </h2>
          <p style={{ color: '#6b7280' }}>
            Revisa tus logros y estadísticas
          </p>
        </button>

        <button
          onClick={() => navigate('/settings')}
          style={{
            padding: '2rem',
            backgroundColor: 'white',
            border: '2px solid #e5e7eb',
            borderRadius: '1rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#fbbf24';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>⚙️</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            Configuración
          </h2>
          <p style={{ color: '#6b7280' }}>
            Ajusta la accesibilidad
          </p>
        </button>
      </div>
    </div>
  );
};
