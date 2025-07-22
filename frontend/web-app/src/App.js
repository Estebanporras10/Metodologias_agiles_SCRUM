import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { createTask, getTasks, deleteTask, updateTask } from './api/taskService';

// Importar componentes
import Navigation from './components/Navigation';
import WelcomeScreen from './components/WelcomeScreen';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TrashScreen from './components/TrashScreen';

function App() {
  const [activeSection, setActiveSection] = useState('welcome');
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'pendiente',
    priority: 'media',
    dueDate: null
  });
  const [loading, setLoading] = useState(false);

  // Función para actualizar tareas (memoizada para evitar recreaciones innecesarias)
  const fetchTasks = useCallback(async () => {
    try {
      const tasks = await getTasks();
      setTasks(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }, []);

  // Efecto inicial para cargar tareas
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Efecto para actualizar tareas cuando cambia la sección activa
  useEffect(() => {
    if (activeSection === 'task-list') {
      fetchTasks();
    }
  }, [activeSection, fetchTasks]);

  // Efecto para actualización automática cada 15 segundos cuando está en lista de tareas o papelera
  useEffect(() => {
    let interval;
    if (activeSection === 'task-list' || activeSection === 'trash') {
      interval = setInterval(() => {
        fetchTasks();
      }, 15000); // Actualizar cada 15 segundos
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [activeSection, fetchTasks]);

  const handleDeleteTask = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta tarea?')) return;
    try {
      await deleteTask(id);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      alert('Error eliminando la tarea');
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      await updateTask(taskId, taskData);
      fetchTasks(); // Recargar la lista de tareas
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
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
        priority: 'media',
        dueDate: null
      });
      fetchTasks();
      // Cambiar a la lista de tareas después de crear una tarea
      setActiveSection('task-list');
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Error creando la tarea');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'welcome':
        return <WelcomeScreen />;
      case 'add-task':
        return (
          <TaskForm
            newTask={newTask}
            setNewTask={setNewTask}
            onSubmit={handleSubmit}
            loading={loading}
          />
        );
      case 'task-list':
        return (
          <TaskList
            tasks={tasks}
            onDeleteTask={handleDeleteTask}
            onRefresh={fetchTasks}
            onUpdateTask={handleUpdateTask}
          />
        );
      case 'trash':
        return <TrashScreen onTaskRestored={fetchTasks} />;
      default:
        return <WelcomeScreen />;
    }
  };

  return (
    <div className="app">
      <Navigation
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
