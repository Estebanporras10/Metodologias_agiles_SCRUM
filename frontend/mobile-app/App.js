import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import CreateTaskScreen from './screens/CreateTaskScreen';
import DeletedTasksScreen from './screens/DeletedTasksScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [deletedTasks, setDeletedTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null); // para editar tareas

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Tareas" options={{ title: 'Mis Tareas' }}>
          {(props) => (
            <HomeScreen
              {...props}
              tasks={tasks}
              setTasks={setTasks}
              deletedTasks={deletedTasks}
              setDeletedTasks={setDeletedTasks}
              setEditingTask={setEditingTask}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Crear Tarea">
          {(props) => (
            <CreateTaskScreen
              {...props}
              tasks={tasks}
              setTasks={setTasks}
              editingTask={editingTask}
              setEditingTask={setEditingTask}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Eliminadas">
          {(props) => (
            <DeletedTasksScreen
              {...props}
              deletedTasks={deletedTasks}
              setDeletedTasks={setDeletedTasks}
              tasks={tasks}
              setTasks={setTasks}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
