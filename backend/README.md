# Backend API – Metodologías Ágiles SCRUM

Este backend provee una API REST para la gestión de tareas, incluyendo CRUD, papelera y restauración, usando Node.js, Express y MongoDB.

## Tabla de Contenido
- [Instalación](#instalacion)
- [Modelos de Datos](#modelos-de-datos)
  - [Task](#modelo-task)
  - [DeletedTask](#modelo-deletedtask)
- [Rutas de la API](#rutas-de-la-api)
- [Conexión a la Base de Datos](#conexion-a-la-base-de-datos)
- [Ejemplos de Uso](#ejemplos-de-uso)

## Instalación

1. Clona el repositorio y entra al directorio backend:

   git clone <repo-url>
   cd backend

2. Instala las dependencias:

   npm install

3. Crea un archivo `.env` si quieres personalizar la conexión MongoDB:

   MONGO_URI=mongodb://localhost:27017/tasks-db
   PORT=5000

4. Ejecuta el servidor:

   npm start

## Modelos de Datos

### Modelo `Task` (`models/task.js`)
Representa una tarea activa en el sistema.

```js
const taskSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  status:      { type: String, enum: ['pendiente', 'en progreso', 'completada'], default: 'pendiente' },
  priority:    { type: String, enum: ['alta', 'media', 'baja'], default: 'media' },
  dueDate:     { type: Date },
  createdAt:   { type: Date, default: Date.now },
  updatedAt:   { type: Date, default: Date.now }
});
```
- **Campos:**
  - `title`: Título de la tarea (obligatorio)
  - `description`: Descripción (obligatorio)
  - `status`: Estado de la tarea
  - `priority`: Prioridad
  - `dueDate`: Fecha límite
  - `createdAt`, `updatedAt`: Timestamps automáticos

### Modelo `DeletedTask` (`models/deletedTask.js`)
Representa una tarea eliminada (papelera).

```js
const deletedTaskSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  status:      { type: String, enum: ['pendiente', 'en progreso', 'completada'], default: 'pendiente' },
  priority:    { type: String, enum: ['alta', 'media', 'baja'], default: 'media' },
  dueDate:     { type: Date },
  createdAt:   { type: Date, default: Date.now },
  updatedAt:   { type: Date, default: Date.now },
  deletedAt:   { type: Date, default: Date.now }
});
```
- **Campos:**
  - Igual que `Task`, pero agrega `deletedAt` para saber cuándo fue eliminada.

## Rutas de la API

Todas las rutas están bajo `/api/tasks`.

### Tareas activas
- `GET /api/tasks` — Lista todas las tareas activas
- `GET /api/tasks/:id` — Obtiene una tarea por ID
- `POST /api/tasks` — Crea una nueva tarea
  - **Body:** `{ title, description, status, priority, dueDate }`
- `PUT /api/tasks/:id` — Actualiza una tarea existente
  - **Body:** `{ title, description, status, priority, dueDate }`
- `DELETE /api/tasks/:id` — Mueve una tarea a la papelera (la elimina lógicamente)

### Papelera
- `GET /api/tasks/trash` — Lista todas las tareas eliminadas
- `POST /api/tasks/restore/:id` — Restaura una tarea de la papelera
- `DELETE /api/tasks/trash/:id` — Elimina definitivamente una tarea de la papelera
- `DELETE /api/tasks/trash/empty` — Vacía toda la papelera

---

## Conexión a la Base de Datos

La conexión se realiza en `db.js` o directamente en `server.js`:
```js
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tasks-db', ...)
```
- Usa la variable de entorno `MONGO_URI` o localhost por defecto.
- Lanza mensajes de éxito o error en consola.

## Ejemplos de Uso

### Crear una tarea
POST /api/tasks
Content-Type: application/json

{
  "title": "Implementar notificaciones",
  "description": "Agregar notificaciones locales a la app móvil",
  "priority": "alta",
  "status": "pendiente",
  "dueDate": "2025-08-10T06:00:00.000Z"
}

### Mover una tarea a la papelera
DELETE /api/tasks/64d5c6f8a2b5e0b1c2a12345

### Restaurar una tarea
POST /api/tasks/restore/64d5c6f8a2b5e0b1c2a12345


### Vaciar la papelera
DELETE /api/tasks/trash/empty

## Notas
- El modelo `DeletedTask` permite mantener un historial de tareas eliminadas.
- Los endpoints están pensados para integrarse fácilmente con un frontend móvil o web.
- El backend es fácilmente ampliable para nuevas funciones (etiquetas, usuarios, etc).

¿Dudas o mejoras? ¡Abre un issue o contribuye! 🚀
