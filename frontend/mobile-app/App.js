import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Screens
import WelcomeScreen from './screens/WelcomeScreen';
import TaskFormScreen from './screens/TaskFormScreen';
import TaskListScreen from './screens/TaskListScreen';
import TrashScreen from './screens/TrashScreen';
import EditTaskScreen from './screens/EditTaskScreen';
import NotificationSettingsScreen from './screens/NotificationSettingsScreen';

// API Service
import * as taskService from './services/taskService';

// Notifications Hook
import { useNotifications } from './hooks/useNotifications';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Colores de la aplicación web
const colors = {
  primary: '#2596be',
  secondary: '#98FB98',
  accent: '#FFB6C1',
  error: '#FFA07A',
  background: '#F0F8FF',
  cardBackground: '#f8f9fa',
  textPrimary: '#000000',
  textSecondary: '#333333',
  white: '#ffffff',
  purple: '#667eea',
};

function TaskStack({ tasks, onDeleteTask, onUpdateTask, onRefresh, loading }) {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="TaskList" 
        options={{ headerShown: false }}
      >
        {(props) => (
          <TaskListScreen
            {...props}
            tasks={tasks}
            onDeleteTask={onDeleteTask}
            onUpdateTask={onUpdateTask}
            onRefresh={onRefresh}
            loading={loading}
          />
        )}
      </Stack.Screen>
      <Stack.Screen 
        name="EditTask" 
        component={EditTaskScreen}
        options={{
          title: 'Editar Tarea',
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.white,
        }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [deletedTasks, setDeletedTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Hook de notificaciones
  const {
    isInitialized,
    hasPermissions,
    scheduleTaskNotifications,
    scheduleTaskNotification,
    cancelTaskNotification,
    sendTestNotification
  } = useNotifications();

  // Cargar tareas al iniciar la app
  useEffect(() => {
    fetchTasks();
    fetchDeletedTasks();
  }, []);

  // Programar notificaciones cuando las tareas cambien
  useEffect(() => {
    if (isInitialized && hasPermissions && tasks.length > 0) {
      console.log('📅 Programando notificaciones para', tasks.length, 'tareas');
      scheduleTaskNotifications(tasks);
    }
  }, [tasks, isInitialized, hasPermissions]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const fetchedTasks = await taskService.getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeletedTasks = async () => {
    try {
      const fetchedDeletedTasks = await taskService.getDeletedTasks();
      setDeletedTasks(fetchedDeletedTasks);
    } catch (error) {
      console.error('Error fetching deleted tasks:', error);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await taskService.createTask(taskData);
      await fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      await taskService.updateTask(taskId, taskData);
      await fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      await fetchTasks();
      await fetchDeletedTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  const handleRestoreTask = async (taskId) => {
    try {
      await taskService.restoreTask(taskId);
      await fetchTasks();
      await fetchDeletedTasks();
    } catch (error) {
      console.error('Error restoring task:', error);
      throw error;
    }
  };

  const handlePermanentDelete = async (taskId) => {
    try {
      await taskService.permanentDeleteTask(taskId);
      await fetchDeletedTasks();
    } catch (error) {
      console.error('Error permanently deleting task:', error);
      throw error;
    }
  };

  const handleEmptyTrash = async () => {
    try {
      await taskService.emptyTrash();
      await fetchDeletedTasks();
    } catch (error) {
      console.error('Error emptying trash:', error);
      throw error;
    }
  };

  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor={colors.primary} />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Bienvenida') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Agregar') {
              iconName = focused ? 'add-circle' : 'add-circle-outline';
            } else if (route.name === 'Tareas') {
              iconName = focused ? 'list' : 'list-outline';
            } else if (route.name === 'Papelera') {
              iconName = focused ? 'trash' : 'trash-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: {
            backgroundColor: colors.white,
            borderTopColor: colors.primary,
            borderTopWidth: 2,
          },
          headerStyle: {
            backgroundColor: colors.purple,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      >
        <Tab.Screen 
          name="Bienvenida" 
          component={WelcomeScreen}
          options={{ title: 'Inicio' }}
        />
        <Tab.Screen 
          name="Agregar"
          options={{ title: 'Nueva Tarea' }}
        >
          {(props) => (
            <TaskFormScreen
              {...props}
              onCreateTask={handleCreateTask}
              loading={loading}
            />
          )}
        </Tab.Screen>
        <Tab.Screen 
          name="Tareas"
          options={{ title: 'Mis Tareas', headerShown: false }}
        >
          {() => (
            <TaskStack
              tasks={tasks}
              onDeleteTask={handleDeleteTask}
              onUpdateTask={handleUpdateTask}
              onRefresh={fetchTasks}
              loading={loading}
            />
          )}
        </Tab.Screen>
        <Tab.Screen 
          name="Papelera"
          options={{ title: 'Eliminadas' }}
        >
          {(props) => (
            <TrashScreen
              {...props}
              deletedTasks={deletedTasks}
              onRestoreTask={handleRestoreTask}
              onPermanentDelete={handlePermanentDelete}
              onEmptyTrash={handleEmptyTrash}
              onRefresh={fetchDeletedTasks}
              loading={loading}
            />
          )}
        </Tab.Screen>

      </Tab.Navigator>
    </NavigationContainer>
  );
}
