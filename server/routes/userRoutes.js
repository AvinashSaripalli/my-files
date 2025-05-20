const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const userController = require('../controllers/userController');
const { verifyToken } = require("../middleware/authMiddleware");

router.post('/users/register', upload.single('photo'), userController.registerUser);
router.post('/users/registers', upload.single('photo'), userController.registerUsers);
router.post('/login',userController.loginUser);
router.patch('/users/update',  userController.updateUser);
router.patch('/users/update-photo', upload.single('photo'), userController.updateUserPhoto);
router.get('/users', verifyToken, userController.getUsers);
router.get('/users-by-month', userController.getUsersByMonth);
router.get('/users-by-location',  userController.getUsersByLocation);
router.get('/users-by-genders', userController.getUsersByGenders);
router.get('/users-by-departments', userController.getUsersByDepartments);
router.put('/users/:id', upload.single('photo'), userController.updateUserDetails);
router.patch('/users/:id', userController.toggleUserExists);
router.get('/users/next-employee-id', userController.getNextEmployeeId);

module.exports = router;