const express = require('express');
const { getTasks, getTaskById, createTask, updateTask, deleteTask } = require('../Controllers/taskControllers');

const router = express.Router();

// Route for getting all tasks and creating a task
router.route('/').get(getTasks).post(createTask);

// Route for getting a task by ID, updating a task, and deleting a task
router.route('/:id').get(getTaskById).put(updateTask).delete(deleteTask);

module.exports = router;
