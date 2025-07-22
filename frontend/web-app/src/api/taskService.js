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
  const response = await fetch(`${API_URL}/tasks/trash`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to empty trash');
  }
  return response.json();
}

