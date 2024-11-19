const express = require('express');
const router = express.Router();
const answerController = require('../controllers/answerController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/start', authMiddleware, answerController.startUserTest);
router.post('/submit', authMiddleware, answerController.submitAnswer);

module.exports = router;