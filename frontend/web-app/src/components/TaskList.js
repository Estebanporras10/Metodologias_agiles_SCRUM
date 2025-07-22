import React, { useState } from 'react';
import '../css/TaskList.css';
import EditTaskModal from './EditTaskModal';

function TaskList({ tasks, onDeleteTask, onRefresh, onUpdateTask }) {
  const [editingTask, setEditingTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSaveTask = async (taskId, taskData) => {
    if (onUpdateTask) {
      await onUpdateTask(taskId, taskData);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendiente':
        return '#FFD801';
      case 'en progreso':
        return '#4CAF50';
      case 'completada':
        return '#2196F3';
      default:
        return '#9E9E9E';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'alta':
        return '#cc0000';
      case 'media':
        return '#ff9800';
      case 'baja':
        return '#4caf50';
      default:
        return '#9e9e9e';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pendiente':
        return 'Pendiente';
      case 'en progreso':
        return 'En Progreso';
      case 'completada':
        return 'Completada';
      default:
        return status;
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'alta':
        return 'Alta';
      case 'media':
        return 'Media';
      case 'baja':
        return 'Baja';
      default:
        return priority;
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="task-list-container">
        <h2 className="list-title">Lista de Tareas</h2>
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No hay tareas aún</h3>
          <p>Comienza agregando tu primera tarea usando el formulario de arriba</p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      <div className="list-header">
        <h2 className="list-title">Lista de Tareas ({tasks.length})</h2>
        {onRefresh && (
          <button className="refresh-btn" onClick={onRefresh} title="Actualizar lista">
            🔄 Actualizar
          </button>
        )}
      </div>
      <div className="tasks-grid">
        {tasks.map((task) => (
          <div key={task._id} className="task-card">
            <div className="task-header">
              <h3 className="task-title">{task.title}</h3>
              <div className="task-badges">
                <span
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(task.status) }}
                >
                  {getStatusText(task.status)}
                </span>
                <span
                  className="priority-badge"
                  style={{ backgroundColor: getPriorityColor(task.priority) }}
                >
                  {getPriorityText(task.priority)}
                </span>
              </div>
            </div>
            
            <p className="task-description">{task.description}</p>
            
            <div className="task-dates">
              <div className="date-item">
                <span className="date-label">Creada:</span>
                <span className="date-value">
                  {new Date(task.createdAt).toLocaleDateString('es-ES')}
                </span>
              </div>
              {task.dueDate && (
                <div className="date-item">
                  <span className="date-label">Fecha límite:</span>
                  <span className="date-value">
                    {new Date(task.dueDate).toLocaleDateString('es-ES')}
                  </span>
                </div>
              )}
            </div>
            
            <div className="task-actions">
              <button 
                className="edit-btn"
                onClick={() => handleEditTask(task)}
                title="Editar tarea"
              >
                ✏️ Editar
              </button>
              <button 
                className="delete-btn"
                onClick={() => onDeleteTask(task._id)}
                title="Eliminar tarea"
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <EditTaskModal
        task={editingTask}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
      />
    </div>
  );
}

export default TaskList;
