const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Routes
router.get('/', userController.getAllUsers); // GET /api/users
router.post('/', userController.createUser); // POST /api/users

module.exports = router;