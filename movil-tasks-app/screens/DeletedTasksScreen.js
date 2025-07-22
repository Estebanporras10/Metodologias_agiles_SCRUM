import React from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';

export default function DeletedTasksScreen({ navigation, deletedTasks, setDeletedTasks, tasks, setTasks }) {
  const restoreTask = (id) => {
    const taskToRestore = deletedTasks.find(t => t.id === id);
    if (taskToRestore) {
      setTasks([...tasks, taskToRestore]);
      setDeletedTasks(deletedTasks.filter(t => t.id !== id));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tareas Eliminadas</Text>

      <FlatList
        data={deletedTasks}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={{ textAlign: 'center' }}>No hay tareas eliminadas.</Text>}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text>{item.details}</Text>
            <Text style={styles.taskDate}>Vencía: {item.dueDate.toLocaleDateString()}</Text>
            <Button title="Restaurar" onPress={() => restoreTask(item.id)} />
          </View>
        )}
      />

      <View style={{ marginTop: 20 }}>
        <Button title="Volver" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 ,backgroundColor : '#E3DAC9'},
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  taskItem: { backgroundColor: '#fdd', padding: 15, marginBottom: 15, borderRadius: 8 },
  taskTitle: { fontWeight: 'bold' },
  taskDate: { color: '#777', marginTop: 5 },
});
