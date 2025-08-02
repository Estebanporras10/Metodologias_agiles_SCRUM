import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  TextInput,
  Modal,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

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

export default function TaskListScreen({ 
  tasks, 
  onDeleteTask, 
  onUpdateTask, 
  onRefresh, 
  loading,
  navigation 
}) {
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterDate, setFilterDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState(null);

  // Filtrar tareas basado en nombre y fecha límite
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Filtrar por texto de búsqueda
    if (searchText.trim()) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchText.toLowerCase()) ||
        task.description.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filtrar por fecha límite (desde hoy hasta la fecha seleccionada)
    if (filterDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Inicio del día actual
      const selectedDate = new Date(filterDate);
      selectedDate.setHours(23, 59, 59, 999); // Final del día seleccionado
      
      filtered = filtered.filter(task => {
        if (!task.dueDate) return false;
        const taskDueDate = new Date(task.dueDate);
        return taskDueDate >= today && taskDueDate <= selectedDate;
      });
    }

    // Filtrar por prioridad
    if (selectedPriority) {
      filtered = filtered.filter(task => task.priority === selectedPriority);
    }

    return filtered;
  }, [tasks, searchText, filterDate, selectedPriority]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeleteTask = (taskId, taskTitle) => {
    Alert.alert(
      'Eliminar Tarea',
      `¿Estás seguro de que deseas eliminar "${taskTitle}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => onDeleteTask(taskId),
        },
      ]
    );
  };

  const handleEditTask = (task) => {
    navigation.navigate('EditTask', { task, onUpdateTask });
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setFilterDate(selectedDate);
    }
  };

  const clearFilters = () => {
    setSearchText('');
    setFilterDate(null);
    setSelectedPriority(null);
    setShowFilterModal(false);
  };

  const formatFilterDate = (date) => {
    if (!date) return 'Seleccionar fecha límite';
    
    const today = new Date();
    const formattedDate = date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    
    return `Hasta ${formattedDate}`;
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
            Creada: {formatDate(item.createdAt)}
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
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditTask(item)}
        >
          <Ionicons name="pencil" size={16} color={colors.white} />
          <Text style={styles.actionButtonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteTask(item._id, item.title)}
        >
          <Ionicons name="trash" size={16} color={colors.white} />
          <Text style={styles.actionButtonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="clipboard-outline" size={80} color={colors.textSecondary} />
      <Text style={styles.emptyTitle}>
        {searchText || filterDate ? 'No se encontraron tareas' : 'No hay tareas'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchText || filterDate 
          ? 'Intenta ajustar los filtros de búsqueda'
          : 'Crea tu primera tarea usando el botón "+" en la pestaña Agregar'
        }
      </Text>
    </View>
  );

  const renderFilterModal = () => (
    <Modal
      visible={showFilterModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowFilterModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtrar Tareas</Text>
            <TouchableOpacity
              onPress={() => setShowFilterModal(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Buscar por nombre:</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Escribe el nombre de la tarea..."
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Tareas hasta fecha límite:</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar" size={20} color={colors.primary} />
              <Text style={styles.dateButtonText}>
                {formatFilterDate(filterDate)}
              </Text>
            </TouchableOpacity>
            {filterDate && (
              <TouchableOpacity
                style={styles.clearDateButton}
                onPress={() => setFilterDate(null)}
              >
                <Text style={styles.clearDateText}>Limpiar fecha</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Filtrar por prioridad:</Text>
            <View style={styles.priorityFilterContainer}>
              {['alta', 'media', 'baja'].map(priority => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.priorityOption,
                    selectedPriority === priority && styles.priorityOptionSelected,
                    { backgroundColor: getPriorityColor(priority) + '40' }
                  ]}
                  onPress={() => setSelectedPriority(selectedPriority === priority ? null : priority)}
                >
                  <Text style={[
                    styles.priorityOptionText,
                    selectedPriority === priority && styles.priorityOptionTextSelected
                  ]}>
                    {getPriorityText(priority)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, styles.clearButton]}
              onPress={clearFilters}
            >
              <Text style={styles.clearButtonText}>Limpiar Filtros</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.applyButton]}
              onPress={() => setShowFilterModal(false)}
            >
              <Text style={styles.applyButtonText}>Aplicar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={filterDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>Mis Tareas</Text>
            <Text style={styles.subtitle}>
              {filteredTasks.length} de {tasks.length} {tasks.length === 1 ? 'tarea' : 'tareas'}
              {(searchText || filterDate) && ' (filtradas)'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilterModal(true)}
          >
            <Ionicons 
              name="filter" 
              size={20} 
              color={searchText || filterDate ? colors.primary : colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>
        
        {(searchText || filterDate || selectedPriority) && (
          <View style={styles.activeFilters}>
            {searchText && (
              <View style={styles.filterChip}>
                <Text style={styles.filterChipText}>Texto: {searchText}</Text>
                <TouchableOpacity onPress={() => setSearchText('')}>
                  <Ionicons name="close-circle" size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>
            )}
            {filterDate && (
              <View style={styles.filterChip}>
                <Text style={styles.filterChipText}>Fecha: {formatFilterDate(filterDate)}</Text>
                <TouchableOpacity onPress={() => setFilterDate(null)}>
                  <Ionicons name="close-circle" size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>
            )}
            {selectedPriority && (
              <View style={styles.filterChip}>
                <Text style={styles.filterChipText}>
                  Prioridad: {getPriorityText(selectedPriority)}
                </Text>
                <TouchableOpacity onPress={() => setSelectedPriority(null)}>
                  <Ionicons name="close-circle" size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>

      <FlatList
        data={filteredTasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={filteredTasks.length === 0 ? styles.emptyContainer : styles.listContainer}
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
      
      {renderFilterModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  activeFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  filterChipText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
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
  editButton: {
    backgroundColor: '#4CAF50',
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
  // Estilos del modal de filtros
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: colors.background,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: colors.background,
    gap: 8,
  },
  dateButtonText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  clearDateButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  clearDateText: {
    fontSize: 14,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.textSecondary,
  },
  applyButton: {
    backgroundColor: colors.primary,
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  priorityFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  priorityOption: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  priorityOptionSelected: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  priorityOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  priorityOptionTextSelected: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
});
