import React, { useEffect, useState } from 'react';
import { getDeletedTasks, restoreTask, deleteDeletedTask, emptyTrash } from './api/taskService';
import './App.css';

export default function TrashScreen({ onBack }) {
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
    await restoreTask(id);
    fetchDeletedTasks();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar permanentemente esta tarea?')) return;
    await deleteDeletedTask(id);
    fetchDeletedTasks();
  };

  const handleEmptyTrash = async () => {
    if (!window.confirm('¿Vaciar papelera? Esta acción no se puede deshacer.')) return;
    await emptyTrash();
    fetchDeletedTasks();
  };

  return (
    <div className="trash-screen">
      <h2>Papelera</h2>
      <button onClick={onBack} className="back-btn">Volver</button>
      <button onClick={handleEmptyTrash} className="empty-trash-btn">Vaciar Papelera</button>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="task-list">
          {deletedTasks.length === 0 ? (
            <p>No hay tareas en la papelera.</p>
          ) : (
            deletedTasks.map(task => (
              <div key={task._id} className="task-card">
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <div className="task-meta">
                  <span className="priority-badge" style={{ backgroundColor: '#bdbdbd' }}>{task.priority}</span>
                  <span className="task-date">Creada: {new Date(task.createdAt).toLocaleDateString('es-ES')}</span>
                  {task.dueDate && <span className="task-due-date">Fecha límite: {new Date(task.dueDate).toLocaleDateString('es-ES')}</span>}
                </div>
                <div className="trash-actions">
                  <span className="restore-icon" title="Restaurar" onClick={() => handleRestore(task._id)}>♻️</span>
                  <span className="delete-icon" title="Eliminar permanentemente" onClick={() => handleDelete(task._id)}>🗑️</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
