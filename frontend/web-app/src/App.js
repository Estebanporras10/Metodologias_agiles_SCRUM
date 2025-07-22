import './App.css';

import React, { useState, useEffect } from 'react';
import './App.css';
import { createTask, getTasks, deleteTask } from './api/taskService';
import TrashScreen from './TrashScreen';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function App() {
  const [showTrash, setShowTrash] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'pendiente',
    priority: 'media',
    dueDate: null
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const tasks = await getTasks();
      setTasks(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta tarea?')) return;
    try {
      await deleteTask(id);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      alert('Error eliminando la tarea');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createTask(newTask);
      setNewTask({
        title: '',
        description: '',
        status: 'pendiente',
        priority: 'media'
      });
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendiente':
        return '#FFD801';
      case 'en_progreso':
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

  if (showTrash) return <TrashScreen onBack={() => setShowTrash(false)} />;

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Task Manager</h1>
      </header>

      <main className="app-main">
        <section className="task-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Título</label>
              <input
                type="text"
                id="title"
                name="title"
                value={newTask.title}
                onChange={handleInputChange}
                required
                placeholder="Ingrese el título de la tarea"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Descripción</label>
              <textarea
                id="description"
                name="description"
                value={newTask.description}
                onChange={handleInputChange}
                required
                placeholder="Ingrese la descripción de la tarea"
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Estado</label>
              <select
                id="status"
                name="status"
                value={newTask.status}
                onChange={handleInputChange}
              >
                <option value="pendiente">Pendiente</option>
                <option value="en_progreso">En Progreso</option>
                <option value="completada">Completada</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priority">Prioridad</label>
              <select
                id="priority"
                name="priority"
                value={newTask.priority}
                onChange={handleInputChange}
              >
                <option value="media">Media</option>
                <option value="alta">Alta</option>
                <option value="baja">Baja</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dueDate">Fecha de Finalización</label>
              <DatePicker
                selected={newTask.dueDate}
                onChange={(date) => setNewTask(prev => ({
                  ...prev,
                  dueDate: date
                }))}
                dateFormat="dd/MM/yyyy"
                placeholderText="Selecciona una fecha"
                className="form-control"
                selectsStart
                startDate={newTask.dueDate}
                endDate={new Date()}
                minDate={new Date()}
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Creando...' : 'Crear Tarea'}
            </button>
          </form>
        </section>
        <button className="open-trash-btn" onClick={() => setShowTrash(true)}>
          Ver Papelera
        </button>
        <section className="task-list">
          <h2>Tareas</h2>
          <div className="tasks-container">
            {tasks.map((task) => (
              <div key={task._id} className="task-card">
                <div className="task-header">
                  <span className="task-title">{task.title}</span>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(task.status) }}
                  >
                    {task.status}
                  </span>
                </div>
                <p className="task-description">{task.description}</p>
                <div className="task-meta">
                  <div className="priority-and-dates">
                    <span
                      className="priority-badge"
                      style={{ backgroundColor: getPriorityColor(task.priority) }}
                    >
                      {task.priority}
                    </span>
                    <div className="dates-container">
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
                  <span className="delete-icon" title="Eliminar tarea" onClick={() => handleDeleteTask(task._id)}>
  🗑️
</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
