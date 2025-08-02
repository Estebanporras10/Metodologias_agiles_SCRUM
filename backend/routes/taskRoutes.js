const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const DeletedTask = require('../models/deletedTask');

// Create a new task
router.post('/', async (req, res) => {
    try {
        const { title, description, status, priority, dueDate } = req.body;
        
        const task = new Task({
            title,
            description,
            status,
            priority,
            dueDate
        });

        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// List all deleted tasks - DEBE IR ANTES que /:id
router.get('/trash', async (req, res) => {
    try {
        const deletedTasks = await DeletedTask.find().sort({ deletedAt: -1 });
        res.json(deletedTasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single task
router.get('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a task by ID
router.put('/:id', async (req, res) => {
    try {
        const { title, description, status, priority, dueDate } = req.body;
        
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                status,
                priority,
                dueDate,
                updatedAt: new Date()
            },
            { new: true, runValidators: true }
        );
        
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        // Move to DeletedTask collection
        const deletedTask = new DeletedTask({
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
            deletedAt: new Date()
        });
        await deletedTask.save();
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task moved to trash' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Restore a deleted task by ID
router.post('/trash/restore/:id', async (req, res) => {
    try {
        const deletedTask = await DeletedTask.findById(req.params.id);
        if (!deletedTask) {
            return res.status(404).json({ message: 'Deleted task not found' });
        }
        // Restore to Task collection
        const restoredTask = new Task({
            title: deletedTask.title,
            description: deletedTask.description,
            status: deletedTask.status,
            priority: deletedTask.priority,
            dueDate: deletedTask.dueDate,
            createdAt: deletedTask.createdAt,
            updatedAt: new Date()
        });
        await restoredTask.save();
        await DeletedTask.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task restored' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Empty the trash (delete all deleted tasks)
router.delete('/trash/empty', async (req, res) => {
    try {
        console.log('Intentando vaciar papelera...');
        const result = await DeletedTask.deleteMany({});
        console.log('Tareas eliminadas:', result.deletedCount);
        res.json({ message: 'Trash emptied', deletedCount: result.deletedCount });
    } catch (error) {
        console.error('Error vaciando papelera:', error);
        res.status(500).json({ message: error.message });
    }
});

// Permanently delete a deleted task by ID
router.delete('/trash/:id', async (req, res) => {
    try {
        const deleted = await DeletedTask.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Deleted task not found' });
        }
        res.json({ message: 'Task permanently deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
