const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController'); // Adjust path as needed

router.get('/tasks', taskController.getTasks);
router.get('/tasks/employee/:employeeId', taskController.getTasksByEmployeeId);
router.post('/tasks', taskController.createTask);
router.put('/tasks/:id', taskController.updateTask);
router.delete('/tasks/:id', taskController.deleteTask);
router.put('/tasks/:id/status', taskController.updateTaskStatus);

router.get('/projects', taskController.getProjects);
router.get('/projects/employee/:employeeId', taskController.getProjectsByEmployeeId);
router.post('/projects', taskController.createProject);
router.put('/projects/:id', taskController.updateProject);
router.delete('/projects/:id', taskController.deleteProject);

module.exports = router;