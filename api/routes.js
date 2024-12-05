const express = require('express');
const bodyParser = require('body-parser');
const userController = require('./controllers/userController');
const authController = require('./controllers/authController');
const testController = require('./controllers/testController');
const authenticateMiddleware = require('./middlewares/authenticateMiddleware');
const authorizeMiddleware = require('./middlewares/authorizeMiddleware');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware untuk parsing body request
router.use(bodyParser.json());

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to Autograde API' });
});

// Route Auth
router.post('/api/register', authController.register);  // Registrasi User
router.post('/api/login', authController.login);  // Login User
router.post('/api/auth/google', authController.googleLogin);

// Route User
router.get('/api/users/profile', authenticateMiddleware, authorizeMiddleware, userController.profile);  // Profile User

// Route Test
// Get test by id without questions but total question.
// If logged_user = creator_id, give question answer
router.get('/api/tests/:id', authenticateMiddleware, testController.getTestById);
router.post('/api/tests/start', authenticateMiddleware, testController.startTest);  // Add new user_test if not exist and return test and questions without answer
router.post('/api/tests/update-time-left', authenticateMiddleware, testController.updateTimeLeft);  // Update time left
router.post('/api/tests/submit', authenticateMiddleware, testController.submitTest);  // Store

router.post('/api/tests/store', authenticateMiddleware, authorizeMiddleware, testController.storeTest);  // Add new test with questions
router.get('/api/tests', authenticateMiddleware, authorizeMiddleware, testController.getTests);  // Get all tests that created by
router.get('/api/pasttests/', authenticateMiddleware, authorizeMiddleware, testController.getPastTests);  // Get all past tests 
router.get('/api/pasttests/show/:id', authenticateMiddleware, authorizeMiddleware, testController.showPastTest);  // Get created test by id
router.get('/api/tests/show/:id', authenticateMiddleware, authorizeMiddleware, testController.showTest);  // Get created test by id
router.post('/api/tests/accept-responses', authenticateMiddleware, authorizeMiddleware, testController.acceptResponses);
router.post('/api/tests/update-answer-grade', authenticateMiddleware, authorizeMiddleware, testController.updateAnswerGrade);
router.post('/api/tests/show-user-test-details', authenticateMiddleware, authorizeMiddleware, testController.showUserTestDetails);

module.exports = router;