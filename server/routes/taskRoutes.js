const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.get('/tasks', taskController.getTasks);
router.get('/tasks/employee/:employeeId', taskController.getTasksByEmployeeId);
router.post('/tasks', taskController.createTask);
router.put('/tasks/:id', taskController.updateTask);
router.delete('/tasks/:id', taskController.deleteTask);
router.get('/projects', taskController.getProjects);
router.get('/projects/employee/:employeeId', taskController.getProjectsByEmployeeId);

module.exports = router;