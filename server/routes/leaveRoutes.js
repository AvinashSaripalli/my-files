const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');

router.post('/apply',leaveController.leaveApply);
router.get('/', leaveController.getLeavesByEmployee);
router.get('/leave', leaveController.getAllLeaves);
router.put('/update-status', leaveController.updateLeaveStatus);
router.get('/approved-leaves-today', leaveController.getApprovedLeavesToday);
router.get('/leave-counts', leaveController.getLeaveCounts);
router.get('/recent', leaveController.getRecentLeaves);

module.exports = router;
