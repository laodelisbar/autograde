const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, testController.getTests);
router.get('/:id', authMiddleware, testController.getTestById);
router.post('/add', authMiddleware, testController.addTestWithQuestions);

module.exports = router;