const mongoose = require('mongoose');

const deletedTaskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  status: { type: String, enum: ['pendiente', 'en progreso', 'completada'], default: 'pendiente' },
  priority: { type: String, enum: ['alta', 'media', 'baja'], default: 'media' },
  dueDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DeletedTask', deletedTaskSchema);
