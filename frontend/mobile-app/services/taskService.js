// Configuración de la API
const API_BASE_URL = 'http://192.168.100.8:5000/api'; // Cambia esta IP por la IP de tu computadora

// Función auxiliar para hacer peticiones HTTP
const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${url}:`, error);
    throw error;
  }
};

// Obtener todas las tareas
export const getTasks = async () => {
  return await apiRequest('/tasks');
};

// Crear una nueva tarea
export const createTask = async (taskData) => {
  return await apiRequest('/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData),
  });
};

// Actualizar una tarea
export const updateTask = async (taskId, taskData) => {
  return await apiRequest(`/tasks/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify(taskData),
  });
};

// Eliminar una tarea (mover a papelera)
export const deleteTask = async (taskId) => {
  return await apiRequest(`/tasks/${taskId}`, {
    method: 'DELETE',
  });
};

// Obtener tareas eliminadas
export const getDeletedTasks = async () => {
  return await apiRequest('/tasks/trash');
};

// Restaurar una tarea de la papelera
export const restoreTask = async (taskId) => {
  return await apiRequest(`/tasks/trash/restore/${taskId}`, {
    method: 'POST',
  });
};

// Eliminar permanentemente una tarea
export const permanentDeleteTask = async (taskId) => {
  return await apiRequest(`/tasks/trash/${taskId}`, {
    method: 'DELETE',
  });
};

// Vaciar la papelera
export const emptyTrash = async () => {
  console.log('Intentando vaciar papelera...');
  try {
    const result = await apiRequest('/tasks/trash/empty', {
      method: 'DELETE',
    });
    console.log('Papelera vaciada exitosamente:', result);
    return result;
  } catch (error) {
    console.error('Error vaciando la papelera:', error);
    throw error;
  }
};
