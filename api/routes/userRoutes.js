const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Registrasi User
router.post('/register', userController.register);

// Login User
router.post('/login', userController.login);

// Profile User (dengan autentikasi)
router.get('/profile', authMiddleware, userController.profile);

module.exports = router;