import React from 'react';
import '../css/WelcomeScreen.css';

function WelcomeScreen() {
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1 className="welcome-title">¡Bienvenido al Gestor de Tareas!</h1>
        <div className="welcome-description">
          <p>
            Organiza tu trabajo de manera eficiente con nuestro sistema de gestión de tareas.
          </p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Crear Tareas</h3>
              <p>Agrega nuevas tareas con título, descripción, prioridad y fechas límite</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3>Gestionar Lista</h3>
              <p>Visualiza y administra todas tus tareas en un solo lugar</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🗑️</div>
              <h3>Papelera</h3>
              <p>Revisa y restaura tareas eliminadas cuando sea necesario</p>
            </div>
          </div>
        </div>
        <div className="welcome-stats">
          <div className="stat-item">
            <span className="stat-number">✨</span>
            <span className="stat-label">Productividad</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">🎯</span>
            <span className="stat-label">Organización</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">⚡</span>
            <span className="stat-label">Eficiencia</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeScreen;
