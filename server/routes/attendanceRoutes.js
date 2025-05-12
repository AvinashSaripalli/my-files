const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.post('/clock-in', attendanceController.clockIn);
router.put('/clock-out', attendanceController.clockOut);

module.exports = router;
