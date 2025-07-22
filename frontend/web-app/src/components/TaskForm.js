import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../css/TaskForm.css';

function TaskForm({ newTask, setNewTask, onSubmit, loading }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="task-form-container">
      <h2 className="form-title">Agregar Nueva Tarea</h2>
      <form onSubmit={onSubmit} className="task-form">
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
            rows="4"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">Estado</label>
            <select
              id="status"
              name="status"
              value={newTask.status}
              onChange={handleInputChange}
            >
              <option value="pendiente">Pendiente</option>
              <option value="en progreso">En Progreso</option>
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
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
          </div>
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
            className="date-picker"
            minDate={new Date()}
          />
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Creando...' : 'Crear Tarea'}
        </button>
      </form>
    </div>
  );
}

export default TaskForm;
