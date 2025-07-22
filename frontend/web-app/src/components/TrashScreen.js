import React, { useEffect, useState } from 'react';
import { getDeletedTasks, restoreTask, deleteDeletedTask, emptyTrash } from '../api/taskService';
import '../css/TrashScreen.css';

export default function TrashScreen({ onTaskRestored }) {
  const [deletedTasks, setDeletedTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDeletedTasks = async () => {
    setLoading(true);
    try {
      const tasks = await getDeletedTasks();
      setDeletedTasks(tasks);
    } catch (err) {
      alert('Error cargando la papelera');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDeletedTasks();
  }, []);

  const handleRestore = async (id) => {
    if (!window.confirm('¿Restaurar esta tarea?')) return;
    try {
      await restoreTask(id);
      fetchDeletedTasks();
      // Notificar al componente padre que se restauró una tarea
      if (onTaskRestored) {
        onTaskRestored();
      }
    } catch (error) {
      alert('Error restaurando la tarea');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar permanentemente esta tarea?')) return;
    try {
      await deleteDeletedTask(id);
      fetchDeletedTasks();
    } catch (error) {
      alert('Error eliminando la tarea permanentemente');
    }
  };

  const handleEmptyTrash = async () => {
    // Verificar si realmente hay tareas para eliminar
    console.log('Tareas en papelera antes de vaciar:', deletedTasks.length);
    console.log('Tareas:', deletedTasks);
    
    if (deletedTasks.length === 0) {
      alert('La papelera ya está vacía');
      return;
    }
    
    if (!window.confirm(`¿Vaciar papelera? Se eliminarán ${deletedTasks.length} tarea(s) permanentemente. Esta acción no se puede deshacer.`)) return;
    
    setLoading(true);
    try {
      console.log('Intentando vaciar papelera...');
      console.log('URL del endpoint:', 'http://localhost:5000/api/tasks/trash/empty');
      
      const result = await emptyTrash();
      console.log('Respuesta del servidor:', result);
      
      // Limpiar el estado local inmediatamente
      setDeletedTasks([]);
      
      // Luego actualizar desde el servidor para confirmar
      await fetchDeletedTasks();
      
      alert('Papelera vaciada exitosamente');
    } catch (error) {
      console.error('Error completo:', error);
      console.error('Mensaje del error:', error.message);
      console.error('Stack trace:', error.stack);
      
      // Recargar los datos en caso de error para mostrar el estado real
      await fetchDeletedTasks();
      
      alert(`Error vaciando la papelera: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="trash-container">
        <h2 className="trash-title">Papelera</h2>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="trash-container">
      <div className="trash-header">
        <h2 className="trash-title">Papelera ({deletedTasks.length})</h2>
        <div className="trash-actions-header">
          <button 
            onClick={fetchDeletedTasks} 
            className="refresh-trash-btn" 
            title="Actualizar papelera"
            disabled={loading}
          >
            {loading ? '⏳ Cargando...' : '🔄 Actualizar'}
          </button>
          {deletedTasks.length > 0 && (
            <button 
              onClick={handleEmptyTrash} 
              className="empty-trash-btn"
              disabled={loading}
            >
              {loading ? '⏳ Vaciando...' : '🗑️ Vaciar Papelera'}
            </button>
          )}
        </div>
      </div>

      {deletedTasks.length === 0 ? (
        <div className="empty-trash">
          <div className="empty-icon">🗑️</div>
          <h3>La papelera está vacía</h3>
          <p>Las tareas eliminadas aparecerán aquí</p>
        </div>
      ) : (
        <div className="deleted-tasks-grid">
          {deletedTasks.map(task => (
            <div key={task._id} className="deleted-task-card">
              <div className="task-header">
                <h3 className="task-title">{task.title}</h3>
                <span className="deleted-badge">Eliminada</span>
              </div>
              
              <p className="task-description">{task.description}</p>
              
              <div className="task-meta">
                <div className="task-info">
                  <span className="priority-badge">{task.priority}</span>
                  <span className="task-date">
                    Creada: {new Date(task.createdAt).toLocaleDateString('es-ES')}
                  </span>
                  {task.dueDate && (
                    <span className="task-due-date">
                      Fecha límite: {new Date(task.dueDate).toLocaleDateString('es-ES')}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="trash-actions">
                <button 
                  className="restore-btn"
                  onClick={() => handleRestore(task._id)}
                  title="Restaurar tarea"
                >
                  ♻️ Restaurar
                </button>
                <button 
                  className="delete-permanent-btn"
                  onClick={() => handleDelete(task._id)}
                  title="Eliminar permanentemente"
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
