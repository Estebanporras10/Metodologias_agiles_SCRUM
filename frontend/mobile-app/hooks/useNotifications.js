import { useEffect, useState } from 'react';
import notificationService from '../services/notificationService';

export const useNotifications = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);

  useEffect(() => {
    initializeNotifications();
    
    // Cleanup al desmontar
    return () => {
      notificationService.cleanup();
    };
  }, []);

  const initializeNotifications = async () => {
    try {
      const success = await notificationService.initialize();
      setHasPermissions(success);
      setIsInitialized(true);
      
      if (success) {
        console.log('✅ Servicio de notificaciones inicializado correctamente');
      } else {
        console.log('❌ No se pudieron inicializar las notificaciones');
      }
    } catch (error) {
      console.error('Error inicializando notificaciones:', error);
      setIsInitialized(true);
      setHasPermissions(false);
    }
  };

  // Programar notificaciones para una lista de tareas
  const scheduleTaskNotifications = async (tasks) => {
    if (!hasPermissions) {
      console.log('No hay permisos para programar notificaciones');
      return [];
    }

    try {
      const results = await notificationService.scheduleMultipleTaskNotifications(tasks);
      console.log(`✅ ${results.length} notificaciones programadas`);
      return results;
    } catch (error) {
      console.error('Error programando notificaciones:', error);
      return [];
    }
  };

  // Programar notificación para una tarea específica
  const scheduleTaskNotification = async (task) => {
    if (!hasPermissions) {
      console.log('No hay permisos para programar notificaciones');
      return null;
    }

    try {
      const notificationId = await notificationService.scheduleTaskNotification(task);
      if (notificationId) {
        console.log(`✅ Notificación programada para tarea: ${task.title}`);
      }
      return notificationId;
    } catch (error) {
      console.error('Error programando notificación:', error);
      return null;
    }
  };

  // Cancelar notificación de una tarea
  const cancelTaskNotification = async (taskId) => {
    try {
      await notificationService.cancelTaskNotification(taskId);
      console.log(`✅ Notificación cancelada para tarea: ${taskId}`);
    } catch (error) {
      console.error('Error cancelando notificación:', error);
    }
  };

  // Cancelar todas las notificaciones
  const cancelAllNotifications = async () => {
    try {
      await notificationService.cancelAllTaskNotifications();
      console.log('✅ Todas las notificaciones canceladas');
    } catch (error) {
      console.error('Error cancelando todas las notificaciones:', error);
    }
  };

  // Obtener notificaciones programadas
  const getScheduledNotifications = async () => {
    try {
      const notifications = await notificationService.getScheduledNotifications();
      return notifications;
    } catch (error) {
      console.error('Error obteniendo notificaciones:', error);
      return [];
    }
  };

  // Enviar notificación de prueba
  const sendTestNotification = async () => {
    if (!hasPermissions) {
      console.log('No hay permisos para enviar notificaciones');
      return;
    }

    try {
      await notificationService.sendTestNotification();
      console.log('✅ Notificación de prueba enviada');
    } catch (error) {
      console.error('Error enviando notificación de prueba:', error);
    }
  };

  return {
    isInitialized,
    hasPermissions,
    scheduleTaskNotifications,
    scheduleTaskNotification,
    cancelTaskNotification,
    cancelAllNotifications,
    getScheduledNotifications,
    sendTestNotification,
  };
};
