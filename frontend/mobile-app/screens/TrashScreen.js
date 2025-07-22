import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
};

export default function TrashScreen({ 
  deletedTasks, 
  onRestoreTask, 
  onPermanentDelete, 
  onEmptyTrash, 
  onRefresh, 
  loading 
}) {
  const [refreshing, setRefreshing] = useState(false);
  const [emptyingTrash, setEmptyingTrash] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  };

  const handleRestoreTask = (taskId, taskTitle) => {
    Alert.alert(
      'Restaurar Tarea',
      `¿Deseas restaurar "${taskTitle}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Restaurar',
          onPress: () => onRestoreTask(taskId),
        },
      ]
    );
  };

  const handlePermanentDelete = (taskId, taskTitle) => {
    Alert.alert(
      'Eliminar Permanentemente',
      `¿Estás seguro de que deseas eliminar permanentemente "${taskTitle}"? Esta acción no se puede deshacer.`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => onPermanentDelete(taskId),
        },
      ]
    );
  };

  const handleEmptyTrash = () => {
    if (deletedTasks.length === 0) {
      Alert.alert('Información', 'La papelera ya está vacía');
      return;
    }

    Alert.alert(
      'Vaciar Papelera',
      '¿Estás seguro de que deseas vaciar toda la papelera? Esta acción eliminará permanentemente todas las tareas y no se puede deshacer.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Vaciar',
          style: 'destructive',
          onPress: async () => {
            setEmptyingTrash(true);
            try {
              await onEmptyTrash();
              Alert.alert('Éxito', 'Papelera vaciada exitosamente');
            } catch (error) {
              Alert.alert('Error', 'No se pudo vaciar la papelera');
            } finally {
              setEmptyingTrash(false);
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendiente':
        return '#FFD801';
      case 'en progreso':
        return '#4CAF50';
      case 'completada':
        return '#2196F3';
      default:
        return '#9E9E9E';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'alta':
        return colors.error;
      case 'media':
        return '#FF9800';
      case 'baja':
        return colors.secondary;
      default:
        return '#9E9E9E';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pendiente':
        return 'Pendiente';
      case 'en progreso':
        return 'En Progreso';
      case 'completada':
        return 'Completada';
      default:
        return status;
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'alta':
        return 'Alta';
      case 'media':
        return 'Media';
      case 'baja':
        return 'Baja';
      default:
        return priority;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderTaskItem = ({ item }) => (
    <View style={styles.taskCard}>
      <View style={styles.taskHeader}>
        <Text style={styles.taskTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.badges}>
          <View style={[styles.badge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.badgeText}>{getStatusText(item.status)}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: getPriorityColor(item.priority) }]}>
            <Text style={styles.badgeText}>{getPriorityText(item.priority)}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.taskDescription} numberOfLines={3}>
        {item.description}
      </Text>

      <View style={styles.taskDates}>
        <View style={styles.dateItem}>
          <Ionicons name="calendar" size={16} color={colors.textSecondary} />
          <Text style={styles.dateText}>
            Eliminada: {formatDate(item.deletedAt)}
          </Text>
        </View>
        {item.dueDate && (
          <View style={styles.dateItem}>
            <Ionicons name="time" size={16} color={colors.textSecondary} />
            <Text style={styles.dateText}>
              Límite: {formatDate(item.dueDate)}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.taskActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.restoreButton]}
          onPress={() => handleRestoreTask(item._id, item.title)}
        >
          <Ionicons name="refresh" size={16} color={colors.white} />
          <Text style={styles.actionButtonText}>Restaurar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handlePermanentDelete(item._id, item.title)}
        >
          <Ionicons name="trash" size={16} color={colors.white} />
          <Text style={styles.actionButtonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="trash-outline" size={80} color={colors.textSecondary} />
      <Text style={styles.emptyTitle}>Papelera vacía</Text>
      <Text style={styles.emptySubtitle}>
        Las tareas eliminadas aparecerán aquí
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Papelera</Text>
          <Text style={styles.subtitle}>
            {deletedTasks.length} {deletedTasks.length === 1 ? 'tarea eliminada' : 'tareas eliminadas'}
          </Text>
        </View>
        {deletedTasks.length > 0 && (
          <TouchableOpacity
            style={[styles.emptyTrashButton, emptyingTrash && styles.buttonDisabled]}
            onPress={handleEmptyTrash}
            disabled={emptyingTrash}
          >
            <Ionicons 
              name="trash" 
              size={16} 
              color={emptyingTrash ? colors.textSecondary : colors.white} 
            />
            <Text style={[
              styles.emptyTrashButtonText,
              emptyingTrash && styles.buttonTextDisabled
            ]}>
              {emptyingTrash ? 'Vaciando...' : 'Vaciar'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={deletedTasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={deletedTasks.length === 0 ? styles.emptyContainer : styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 5,
  },
  emptyTrashButton: {
    backgroundColor: colors.error,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  emptyTrashButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  buttonDisabled: {
    backgroundColor: '#f5f5f5',
  },
  buttonTextDisabled: {
    color: colors.textSecondary,
  },
  listContainer: {
    padding: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
  },
  taskCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    opacity: 0.8,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    flex: 1,
    marginRight: 10,
  },
  badges: {
    alignItems: 'flex-end',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.white,
  },
  taskDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 15,
  },
  taskDates: {
    marginBottom: 15,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 5,
  },
  taskActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  restoreButton: {
    backgroundColor: colors.secondary,
  },
  deleteButton: {
    backgroundColor: colors.error,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});
