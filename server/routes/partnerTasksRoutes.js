const express = require('express');
const router = express.Router();
const partnerTasksController = require('../controllers/partnerTasksController');

router.get('/getPartnerTasks', partnerTasksController.getPartnerTasks);
router.post('/createPartnerTask', partnerTasksController.createPartnerTask);
router.put('/updatePartnerTask/:id', partnerTasksController.updatePartnerTask);
router.post('/deletePartnerTask/:id', partnerTasksController.deletePartnerTask);
router.get('/getPartnerTasks/employee', partnerTasksController.getPartnerTasksByEmployeeId);

module.exports = router;