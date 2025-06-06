const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.get('/getTasks', taskController.getTasks);
router.post('/create', taskController.createTask);

module.exports = router;