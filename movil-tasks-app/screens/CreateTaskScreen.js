import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet,
  TouchableOpacity, Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';

export default function CreateTaskScreen({ navigation, tasks, setTasks, editingTask, setEditingTask }) {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [priority, setPriority] = useState('media');
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDetails(editingTask.details);
      setPriority(editingTask.priority);
      setDueDate(new Date(editingTask.dueDate));
    }
  }, [editingTask]);

  const scheduleNotification = async (taskTitle, taskDate) => {
    const now = new Date();
    const timeDiff = taskDate.getTime() - now.getTime();
    if (timeDiff > 0 && timeDiff <= 24 * 60 * 60 * 1000) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '📌 Tarea próxima a vencer',
          body: `La tarea "${taskTitle}" vence pronto.`,
        },
        trigger: { seconds: timeDiff / 1000 },
      });
    }
  };

  const saveTask = () => {
    if (!title.trim()) {
      alert('El título es obligatorio');
      return;
    }

    const newTask = {
      id: editingTask ? editingTask.id : Date.now().toString(),
      title,
      details,
      priority,
      dueDate,
      completed: editingTask ? editingTask.completed : false,
    };

    if (editingTask) {
      setTasks(tasks.map(t => (t.id === editingTask.id ? newTask : t)));
    } else {
      setTasks([...tasks, newTask]);
      scheduleNotification(title, dueDate);
    }

    setEditingTask(null);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{editingTask ? 'Editar Tarea' : 'Nueva Tarea'}</Text>

      <TextInput
        placeholder="Título"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        placeholder="Detalles"
        style={[styles.input, { height: 60 }]}
        multiline
        value={details}
        onChangeText={setDetails}
      />

      <Text style={{ marginTop: 10 }}>Prioridad:</Text>
      <View style={styles.priorityContainer}>
        {['alta', 'media', 'baja'].map(level => (
          <TouchableOpacity key={level} onPress={() => setPriority(level)}>
            <Text style={[styles.priorityButton, priority === level && styles.selected]}>
              {level.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button title="Seleccionar fecha de vencimiento" onPress={() => setShowDatePicker(true)} />
      {showDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          display="default"
          minimumDate={new Date()}
          onChange={(event, selectedDate) => {
            setShowDatePicker(Platform.OS === 'ios');
            if (selectedDate) setDueDate(selectedDate);
          }}
        />
      )}

      <View style={{ marginTop: 20 }}>
        <Button title={editingTask ? 'Guardar Cambios' : 'Crear Tarea'} onPress={saveTask} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 ,backgroundColor : '#E3DAC9'},
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 8 },
  priorityContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
  priorityButton: { padding: 10, borderWidth: 1, borderRadius: 5, color: '#555' },
  selected: { backgroundColor: '#1e90ff', color: '#fff' },
});
