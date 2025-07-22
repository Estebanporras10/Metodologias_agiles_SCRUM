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

export const getTasks = async () => {
    try {
        const response = await fetch(`${API_URL}/tasks`);
        if (!response.ok) {
            throw new Error('Failed to fetch tasks');
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};
