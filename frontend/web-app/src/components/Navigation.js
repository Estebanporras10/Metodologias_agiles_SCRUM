import React from 'react';
import '../css/Navigation.css';

function Navigation({ activeSection, setActiveSection }) {
  const menuItems = [
    { id: 'welcome', label: 'Inicio', icon: '🏠' },
    { id: 'add-task', label: 'Agregar Tarea', icon: '➕' },
    { id: 'task-list', label: 'Lista de Tareas', icon: '📋' },
    { id: 'trash', label: 'Papelera', icon: '🗑️' }
  ];

  return (
    <nav className="navigation">
      <div className="nav-header">
        <h1 className="nav-title">Task Manager</h1>
        <p className="nav-subtitle">Gestor de Tareas</p>
      </div>
      
      <ul className="nav-menu">
        {menuItems.map((item) => (
          <li key={item.id} className="nav-item">
            <button
              className={`nav-button ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => setActiveSection(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
      
      <div className="nav-footer">
        <div className="app-version">v1.0.0</div>
      </div>
    </nav>
  );
}

export default Navigation;
