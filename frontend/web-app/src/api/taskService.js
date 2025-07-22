const API_URL = 'http://localhost:5000/api';

export const createTask = async (taskData) => {
    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
        });

        if (!response.ok) {
            throw new Error('Failed to create task');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

export async function getTasks() {
  const response = await fetch(`${API_URL}/tasks`);
  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }
  return response.json();
}

export async function updateTask(id, taskData) {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) {
    throw new Error('Failed to update task');
  }
  return response.json();
}

export async function deleteTask(id) {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete task');
  }
  return response.json();
}

export async function getDeletedTasks() {
  const response = await fetch(`${API_URL}/tasks/trash/all`);
  if (!response.ok) {
    throw new Error('Failed to fetch deleted tasks');
  }
  return response.json();
}

export async function restoreTask(id) {
  const response = await fetch(`${API_URL}/tasks/trash/restore/${id}`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to restore task');
  }
  return response.json();
}

export async function deleteDeletedTask(id) {
  const response = await fetch(`${API_URL}/tasks/trash/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to permanently delete task');
  }
  return response.json();
}

export async function emptyTrash() {
  try {
    console.log('Enviando petición DELETE a:', `${API_URL}/tasks/trash/empty`);
    
    const response = await fetch(`${API_URL}/tasks/trash/empty`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Status de la respuesta:', response.status);
    console.log('Response OK:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error del servidor:', errorText);
      throw new Error(`Failed to empty trash: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log('Resultado del vaciado:', result);
    return result;
  } catch (error) {
    console.error('Error en emptyTrash:', error);
    throw error;
  }
}

