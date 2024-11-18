const express = require('express');
const router = express.Router();
const Controller = require('../controllers/testController');

// Routes
router.get('/', Controller.getTests); // GET /api/users
router.post('/', Controller.createTest); // POST /api/users

module.exports = router;