import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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

export default function WelcomeScreen({ navigation }) {
  const features = [
    {
      icon: 'add-circle',
      title: 'Crear Tareas',
      description: 'Agrega nuevas tareas con título, descripción, prioridad y fecha límite',
      color: colors.secondary,
    },
    {
      icon: 'list',
      title: 'Gestionar Tareas',
      description: 'Ve, edita y organiza todas tus tareas en un solo lugar',
      color: colors.primary,
    },
    {
      icon: 'checkmark-circle',
      title: 'Seguimiento',
      description: 'Marca tareas como pendientes, en progreso o completadas',
      color: colors.accent,
    },
    {
      icon: 'trash',
      title: 'Papelera',
      description: 'Restaura tareas eliminadas o elimínalas permanentemente',
      color: colors.error,
    },
  ];

  const navigateToTab = (tabName) => {
    navigation.navigate(tabName);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Ionicons name="checkmark-done-circle" size={80} color={colors.primary} />
        <Text style={styles.title}>Gestor de Tareas</Text>
        <Text style={styles.subtitle}>
          Organiza tu trabajo de manera eficiente con metodologías ágiles
        </Text>
      </View>

      <View style={styles.featuresContainer}>
        <Text style={styles.sectionTitle}>Características principales</Text>
        
        {features.map((feature, index) => (
          <View key={index} style={styles.featureCard}>
            <View style={[styles.iconContainer, { backgroundColor: feature.color }]}>
              <Ionicons name={feature.icon} size={30} color={colors.white} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Acciones rápidas</Text>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={() => navigateToTab('Agregar')}
        >
          <Ionicons name="add" size={24} color={colors.white} />
          <Text style={styles.actionButtonText}>Crear Nueva Tarea</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.secondary }]}
          onPress={() => navigateToTab('Tareas')}
        >
          <Ionicons name="list" size={24} color={colors.white} />
          <Text style={styles.actionButtonText}>Ver Mis Tareas</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Desarrollado con metodologías ágiles SCRUM
        </Text>
        <Text style={styles.versionText}>Versión 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
  },
  featuresContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 15,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  featureContent: {
    flex: 1,
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  quickActions: {
    marginBottom: 30,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  versionText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 5,
  },
});
