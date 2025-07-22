import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Button } from 'react-native';

export default function HomeScreen({ navigation, tasks, setTasks, deletedTasks, setDeletedTasks, setEditingTask }) {
  const toggleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    const taskToDelete = tasks.find(t => t.id === id);
    if (taskToDelete) {
      setDeletedTasks([...deletedTasks, taskToDelete]);
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  const goToEditTask = (task) => {
    setEditingTask(task);
    navigation.navigate('Crear Tarea');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tareas Activas y Completadas</Text>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={{ marginTop: 20, textAlign: 'center' }}>No hay tareas aún.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.taskItem, item.completed && styles.completed]}
            onPress={() => toggleComplete(item.id)}
            onLongPress={() => goToEditTask(item)}
          >
            <Text style={styles.taskTitle}>
              {item.title} ({item.priority})
            </Text>
            <Text style={styles.taskDetails}>{item.details}</Text>
            <Text style={styles.taskDate}>Vence: {item.dueDate.toLocaleDateString()}</Text>
            <Button title="Eliminar" onPress={() => deleteTask(item.id)} />
          </TouchableOpacity>
        )}
      />

      <View style={styles.buttonContainer}>
        <Button title="Crear Tarea" onPress={() => {
          setEditingTask(null);
          navigation.navigate('Crear Tarea');
        }} />
        <Button title="Tareas Eliminadas" onPress={() => navigation.navigate('Eliminadas')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 , backgroundColor : '#E3DAC9'
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  taskItem: { marginBottom: 15, padding: 15, backgroundColor: '#eee', borderRadius: 8 },
  completed: { backgroundColor: '#d4fcd4' },
  taskTitle: { fontWeight: 'bold' },
  taskDetails: { fontStyle: 'italic' },
  taskDate: { color: '#555', marginBottom: 8 },
  buttonContainer: { marginTop: 20, gap: 10 },

});
