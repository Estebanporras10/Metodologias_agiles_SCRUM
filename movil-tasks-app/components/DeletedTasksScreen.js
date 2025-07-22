import React from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';

export default function DeletedTasksScreen({ deletedTasks, onBack }) {
  return (
    <View style={styles.deletedContainer}>
      <Text style={styles.title}>Tareas Eliminadas</Text>
      {deletedTasks.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>No hay tareas eliminadas.</Text>
      ) : (
        <FlatList
          data={deletedTasks}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.deletedItem}>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <Text style={styles.taskDetails}>{item.details}</Text>
              <Text style={styles.taskDate}>Vencía: {item.dueDate.toLocaleDateString()}</Text>
            </View>
          )}
        />
      )}
      <Button title="Volver" onPress={onBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  deletedContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  deletedItem: {
    padding: 15,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    backgroundColor: '#fcecec',
  },
  taskTitle: {
    fontWeight: 'bold',
  },
  taskDetails: {
    fontStyle: 'italic',
    marginTop: 4,
  },
  taskDate: {
    marginTop: 4,
    color: '#777',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
});
