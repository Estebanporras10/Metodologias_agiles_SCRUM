# Gestor de Tareas - Aplicación Móvil

Esta es la aplicación móvil del Gestor de Tareas desarrollada con React Native y Expo, que comparte la misma funcionalidad y paleta de colores que la aplicación web.

## Características

- **Navegación por pestañas**: 4 secciones principales (Bienvenida, Agregar, Tareas, Papelera)
- **Misma paleta de colores**: Consistencia visual con la aplicación web
- **Funcionalidad completa**: Crear, editar, eliminar y restaurar tareas
- **Interfaz nativa**: Optimizada para dispositivos móviles Android e iOS

## Estructura de la Aplicación

### Pantallas Principales

1. **WelcomeScreen**: Pantalla de bienvenida con información de la app
2. **TaskFormScreen**: Formulario para crear nuevas tareas
3. **TaskListScreen**: Lista de todas las tareas con opciones de editar/eliminar
4. **EditTaskScreen**: Pantalla para editar tareas existentes
5. **TrashScreen**: Papelera con tareas eliminadas

### Servicios

- **taskService.js**: Servicio para comunicación con la API backend

## Configuración

### 1. Instalar Dependencias

```bash
cd frontend/mobile-app
npm install
```

### 2. Configurar la IP del Backend

Edita el archivo `services/taskService.js` y cambia la IP por la de tu computadora:

```javascript
const API_BASE_URL = 'http://TU_IP_LOCAL:5000/api'; // Ejemplo: http://192.168.1.100:5000/api
```

Para encontrar tu IP local:
- **Windows**: `ipconfig` en CMD
- **macOS/Linux**: `ifconfig` en Terminal

### 3. Ejecutar la Aplicación

```bash
# Iniciar Expo
npm start

# Para Android
npm run android

# Para iOS
npm run ios
```

## Paleta de Colores

La aplicación utiliza la misma paleta de colores que la versión web:

- **Primary**: `#2596be` (Azul principal)
- **Secondary**: `#98FB98` (Verde pastel)
- **Accent**: `#FFB6C1` (Rosa pastel)
- **Error**: `#FFA07A` (Salmón pastel)
- **Background**: `#F0F8FF` (Azul Alice)
- **Card Background**: `#f8f9fa` (Gris claro)

## Funcionalidades

### Gestión de Tareas

- ✅ Crear tareas con título, descripción, estado, prioridad y fecha límite
- ✅ Ver lista de tareas con información completa
- ✅ Editar tareas existentes
- ✅ Eliminar tareas (mover a papelera)
- ✅ Filtros por estado y prioridad visual

### Papelera

- ✅ Ver tareas eliminadas
- ✅ Restaurar tareas individuales
- ✅ Eliminar permanentemente tareas individuales
- ✅ Vaciar toda la papelera

### Estados de Tareas

- **Pendiente**: Tareas por hacer
- **En Progreso**: Tareas en desarrollo
- **Completada**: Tareas finalizadas

### Niveles de Prioridad

- **Alta**: Prioridad máxima (rojo)
- **Media**: Prioridad normal (naranja)
- **Baja**: Prioridad mínima (verde)

## Navegación

La aplicación utiliza navegación por pestañas en la parte inferior:

1. **🏠 Inicio**: Pantalla de bienvenida
2. **➕ Nueva Tarea**: Formulario de creación
3. **📋 Mis Tareas**: Lista de tareas
4. **🗑️ Eliminadas**: Papelera

## Requisitos del Sistema

- **Node.js**: v14 o superior
- **Expo CLI**: Instalado globalmente
- **Android Studio**: Para desarrollo Android
- **Xcode**: Para desarrollo iOS (solo macOS)

## Dependencias Principales

- `@react-navigation/bottom-tabs`: Navegación por pestañas
- `@react-navigation/native-stack`: Navegación por stack
- `@expo/vector-icons`: Iconos
- `@react-native-community/datetimepicker`: Selector de fechas
- `@react-native-picker/picker`: Selectores dropdown

## Desarrollo

### Estructura de Archivos

```
mobile-app/
├── screens/           # Pantallas de la aplicación
├── services/          # Servicios de API
├── App.js            # Componente principal
├── package.json      # Dependencias
└── README.md         # Este archivo
```

### Agregar Nuevas Funcionalidades

1. Crear nuevas pantallas en `/screens`
2. Agregar servicios de API en `/services`
3. Actualizar la navegación en `App.js`
4. Mantener consistencia con la paleta de colores

## Troubleshooting

### Problemas Comunes

1. **Error de conexión a la API**:
   - Verificar que el backend esté ejecutándose
   - Confirmar que la IP en `taskService.js` sea correcta
   - Verificar que el dispositivo esté en la misma red

2. **Dependencias faltantes**:
   ```bash
   npm install
   expo install
   ```

3. **Problemas de Metro Bundler**:
   ```bash
   expo start --clear
   ```

## Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crear una rama para tu feature
3. Mantener consistencia con el diseño existente
4. Probar en dispositivos Android e iOS
5. Crear un Pull Request

## Licencia

Este proyecto es parte del curso de Metodologías Ágiles SCRUM.
