import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configurar el comportamiento de las notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class NotificationService {
  constructor() {
    this.expoPushToken = null;
    this.notificationListener = null;
    this.responseListener = null;
  }

  // Inicializar el servicio de notificaciones
  async initialize() {
    try {
      // Solicitar permisos
      const { status } = await this.requestPermissions();
      if (status !== 'granted') {
        console.log('Permisos de notificación denegados');
        return false;
      }

      // Para notificaciones locales no necesitamos el token de push
      // Solo configuramos los listeners
      this.setupNotificationListeners();
      
      console.log('✅ Servicio de notificaciones locales inicializado');
      return true;
    } catch (error) {
      console.error('Error inicializando notificaciones:', error);
      return false;
    }
  }

  // Solicitar permisos de notificación
  async requestPermissions() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    return { status: finalStatus };
  }

  // Configurar listeners para notificaciones
  setupNotificationListeners() {
    // Listener para cuando se recibe una notificación
    this.notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notificación recibida:', notification);
    });

    // Listener para cuando el usuario toca una notificación
    this.responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Respuesta a notificación:', response);
      // Aquí puedes navegar a una pantalla específica si es necesario
    });
  }

  // Programar notificación para una tarea específica
  async scheduleTaskNotification(task) {
    try {
      // Usar _id (MongoDB) o id según lo que esté disponible
      const taskId = task.id || task._id;
      console.log('🔍 Programando notificación para tarea:', { id: taskId, title: task.title, dueDate: task.dueDate });
      
      if (!task.dueDate) {
        console.log('Tarea sin fecha límite, no se programa notificación');
        return null;
      }
      
      if (!taskId) {
        console.error('❌ Error: task.id y task._id son undefined o null:', task);
        return null;
      }

      const dueDate = new Date(task.dueDate);
      const now = new Date();
      
      // Calcular 24 horas antes de la fecha límite
      const notificationTime = new Date(dueDate.getTime() - (24 * 60 * 60 * 1000));
      let trigger = null;
      let body = '';
      const msRestantes = dueDate - now;
      const horasRestantes = msRestantes / (60 * 60 * 1000);
      const minutosRestantes = Math.floor((msRestantes % (60 * 60 * 1000)) / (60 * 1000));

      if (horasRestantes <= 24 && horasRestantes > 0) {
        // Solo notificar si faltan menos de 24h
        trigger = null; // Inmediato
        if (horasRestantes >= 1) {
          body = `"${task.title}" vence en ${Math.floor(horasRestantes)} hora(s) y ${minutosRestantes} minuto(s)`;
        } else {
          body = `"${task.title}" vence en ${minutosRestantes} minuto(s)`;
        }
        console.log(`Notificación inmediata para tarea "${task.title}" (faltan menos de 24h)`);
        // NO cancelar notificaciones previas para trigger inmediato
      } else {
        // No notificar si faltan más de 24h o ya venció
        // Pero si en el futuro quieres programar una notificación, aquí sí cancelarías la previa
        // await this.cancelTaskNotification(task.id);
        console.log('No se programa notificación (faltan más de 24h o ya venció)');
        return null;
      }

      // Programar nueva notificación
      const timestamp = Date.now();
      const identifier = `task_${taskId}_${timestamp}`;
      
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '⏰ Tarea próxima a vencer',
          body,
          data: { 
            taskId: taskId,
            taskTitle: task.title,
            dueDate: task.dueDate,
            type: 'task_reminder',
            timestamp
          },
          sound: 'default',
        },
        trigger,
        identifier,
      });
      
      console.log(`✅ Notificación enviada con ID: ${identifier}`);
      return notificationId;
    } catch (error) {
      console.error('Error programando notificación:', error);
      return null;
    }
  }

  // Cancelar notificación de una tarea específica
  async cancelTaskNotification(taskId) {
    try {
      const identifier = `task_${taskId}`;
      await Notifications.cancelScheduledNotificationAsync(identifier);
      console.log(`Notificación cancelada para tarea ${taskId}`);
    } catch (error) {
      console.error('Error cancelando notificación:', error);
    }
  }

  // Programar notificaciones para múltiples tareas
  async scheduleMultipleTaskNotifications(tasks) {
    const results = [];
    let delayMs = 0; // Delay acumulativo para notificaciones inmediatas
    
    for (const task of tasks) {
      if (!task.completed) { // Solo para tareas no completadas
        // Agregar delay para notificaciones inmediatas
        if (delayMs > 0) {
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
        
        const notificationId = await this.scheduleTaskNotification(task);
        if (notificationId) {
          const taskId = task.id || task._id;
          results.push({ taskId: taskId, notificationId });
          delayMs += 500; // 500ms de delay entre cada notificación inmediata
        }
      }
    }
    return results;
  }

  // Cancelar todas las notificaciones de tareas
  async cancelAllTaskNotifications() {
    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      const taskNotifications = scheduledNotifications.filter(
        notification => notification.identifier.startsWith('task_')
      );
      
      for (const notification of taskNotifications) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
      
      console.log(`${taskNotifications.length} notificaciones de tareas canceladas`);
    } catch (error) {
      console.error('Error cancelando todas las notificaciones:', error);
    }
  }

  // Obtener notificaciones programadas
  async getScheduledNotifications() {
    try {
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      return notifications.filter(notification => 
        notification.identifier.startsWith('task_')
      );
    } catch (error) {
      console.error('Error obteniendo notificaciones programadas:', error);
      return [];
    }
  }

  // Formatear hora para mostrar en la notificación
  formatTime(date) {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  // Enviar notificación inmediata (para testing)
  async sendTestNotification() {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🧪 Notificación de prueba',
          body: 'El sistema de notificaciones está funcionando correctamente',
          data: { type: 'test' },
        },
        trigger: null, // Enviar inmediatamente
      });
    } catch (error) {
      console.error('Error enviando notificación de prueba:', error);
    }
  }

  // Limpiar listeners al destruir el servicio
  cleanup() {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
  }
}

// Exportar instancia singleton
const notificationService = new NotificationService();
export default notificationService;
