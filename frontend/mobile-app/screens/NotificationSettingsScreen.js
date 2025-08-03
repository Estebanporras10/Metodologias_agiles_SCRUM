import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNotifications } from '../hooks/useNotifications';

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

export default function NotificationSettingsScreen() {
  const [scheduledNotifications, setScheduledNotifications] = useState([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  
  const {
    isInitialized,
    hasPermissions,
    getScheduledNotifications,
    sendTestNotification,
    cancelAllNotifications,
  } = useNotifications();

  useEffect(() => {
    if (isInitialized) {
      setNotificationsEnabled(hasPermissions);
      loadScheduledNotifications();
    }
  }, [isInitialized, hasPermissions]);

  const loadScheduledNotifications = async () => {
    try {
      const notifications = await getScheduledNotifications();
      setScheduledNotifications(notifications);
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
    }
  };

  const handleTestNotification = async () => {
    if (!hasPermissions) {
      Alert.alert(
        'Permisos requeridos',
        'Para enviar notificaciones necesitas otorgar permisos en la configuración de tu dispositivo.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      await sendTestNotification();
      Alert.alert(
        '✅ Notificación enviada',
        'Si no ves la notificación, verifica que las notificaciones estén habilitadas en la configuración de tu dispositivo.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar la notificación de prueba');
    }
  };

  const handleCancelAllNotifications = async () => {
    Alert.alert(
      'Cancelar notificaciones',
      '¿Estás seguro de que quieres cancelar todas las notificaciones programadas?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelAllNotifications();
              await loadScheduledNotifications();
              Alert.alert('✅ Completado', 'Todas las notificaciones han sido canceladas');
            } catch (error) {
              Alert.alert('Error', 'No se pudieron cancelar las notificaciones');
            }
          },
        },
      ]
    );
  };

  const formatNotificationDate = (date) => {
    return new Date(date).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="notifications" size={32} color={colors.primary} />
        <Text style={styles.title}>Configuración de Notificaciones</Text>
      </View>

      {/* Estado del servicio */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Estado del Servicio</Text>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Inicializado:</Text>
          <View style={styles.statusIndicator}>
            <Ionicons 
              name={isInitialized ? "checkmark-circle" : "close-circle"} 
              size={20} 
              color={isInitialized ? colors.secondary : colors.error} 
            />
            <Text style={[styles.statusText, { color: isInitialized ? colors.secondary : colors.error }]}>
              {isInitialized ? 'Sí' : 'No'}
            </Text>
          </View>
        </View>
        
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Permisos:</Text>
          <View style={styles.statusIndicator}>
            <Ionicons 
              name={hasPermissions ? "checkmark-circle" : "close-circle"} 
              size={20} 
              color={hasPermissions ? colors.secondary : colors.error} 
            />
            <Text style={[styles.statusText, { color: hasPermissions ? colors.secondary : colors.error }]}>
              {hasPermissions ? 'Otorgados' : 'Denegados'}
            </Text>
          </View>
        </View>
      </View>

      {/* Controles */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Controles</Text>
        
        <TouchableOpacity 
          style={[styles.button, styles.testButton]} 
          onPress={handleTestNotification}
          disabled={!hasPermissions}
        >
          <Ionicons name="send" size={20} color={colors.white} />
          <Text style={styles.buttonText}>Enviar Notificación de Prueba</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.cancelButton]} 
          onPress={handleCancelAllNotifications}
        >
          <Ionicons name="trash" size={20} color={colors.white} />
          <Text style={styles.buttonText}>Cancelar Todas las Notificaciones</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.refreshButton]} 
          onPress={loadScheduledNotifications}
        >
          <Ionicons name="refresh" size={20} color={colors.white} />
          <Text style={styles.buttonText}>Actualizar Lista</Text>
        </TouchableOpacity>
      </View>

      {/* Notificaciones programadas */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Notificaciones Programadas ({scheduledNotifications.length})
        </Text>
        
        {scheduledNotifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No hay notificaciones programadas</Text>
          </View>
        ) : (
          scheduledNotifications.map((notification, index) => (
            <View key={index} style={styles.notificationItem}>
              <View style={styles.notificationHeader}>
                <Ionicons name="alarm" size={16} color={colors.primary} />
                <Text style={styles.notificationTitle}>
                  {notification.content?.title || 'Sin título'}
                </Text>
              </View>
              <Text style={styles.notificationBody}>
                {notification.content?.body || 'Sin descripción'}
              </Text>
              <Text style={styles.notificationDate}>
                📅 {formatNotificationDate(notification.trigger?.date)}
              </Text>
            </View>
          ))
        )}
      </View>

      {/* Información adicional */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>ℹ️ Información</Text>
        <Text style={styles.infoText}>
          • Las notificaciones se envían 24 horas antes del vencimiento de cada tarea
        </Text>
        <Text style={styles.infoText}>
          • Solo se programan notificaciones para tareas no completadas
        </Text>
        <Text style={styles.infoText}>
          • Si cambias una tarea, su notificación se reprograma automáticamente
        </Text>
        <Text style={styles.infoText}>
          • Las notificaciones se cancelan cuando completas o eliminas una tarea
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.white,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 10,
  },
  card: {
    backgroundColor: colors.white,
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 15,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  testButton: {
    backgroundColor: colors.primary,
  },
  cancelButton: {
    backgroundColor: colors.error,
  },
  refreshButton: {
    backgroundColor: colors.secondary,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 10,
  },
  notificationItem: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginLeft: 8,
  },
  notificationBody: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 5,
  },
  notificationDate: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
});
