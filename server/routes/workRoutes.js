const express = require('express');
const router = express.Router();
const workController = require('../controllers/workController');

router.get('/', workController.getWorkGroups);
router.post('/', workController.createWorkGroup);
router.put('/:id', workController.updateWorkGroup);
router.get('/partners', workController.getPartnerCompanies);
router.get('/employeeId', workController.workgroupsByEmployeeId);

module.exports = router;