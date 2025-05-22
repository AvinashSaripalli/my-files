const express = require('express');
const router = express.Router();
const workController = require('../controllers/workController');

router.get('/', workController.getWorkGroups);

module.exports = router;