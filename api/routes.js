const express = require('express');
const bodyParser = require('body-parser');
const passport = require('./passport');
const userController = require('./controllers/userController');
const authController = require('./controllers/authController');
const testController = require('./controllers/testController');
const authenticateMiddleware = require('./middlewares/authenticateMiddleware');
const authorizeMiddleware = require('./middlewares/authorizeMiddleware');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware untuk parsing body request
router.use(bodyParser.json());
router.use(passport.initialize()); // Inisialisasi Passport

// Route Auth
router.post('/api/register', authController.register);  // Registrasi User
router.post('/api/login', authController.login);  // Login User
// Route Authentication (Google OAuth)
router.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));  // Google Login
router.get('/api/auth/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  const token = jwt.sign(
    { id: req.user.id, email: req.user.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  res.json({ message: 'Login berhasil', token });
});

// Route User
router.get('/api/users/profile', authenticateMiddleware, authorizeMiddleware, userController.profile);  // Profile User

// Route Test
// Get test by id without questions but total question.
// If logged_user = creator_id, give question answer
router.get('/api/tests/:id', authenticateMiddleware, testController.getTestById);
router.post('/api/tests/start', authenticateMiddleware, testController.startTest);  // Add new user_test if not exist and return test and questions without answer
router.post('/api/tests/submit', authenticateMiddleware, testController.submitTest);  // Store

router.post('/api/tests/store', authenticateMiddleware, authorizeMiddleware, testController.storeTest);  // Add new test with questions
router.get('/api/tests', authenticateMiddleware, authorizeMiddleware, testController.getTests);  // Get all tests that created by
router.get('/api/tests/show/:id', authenticateMiddleware, authorizeMiddleware, testController.showTest);  // Get created test by id
router.post('/api/tests/accept-responses', authenticateMiddleware, authorizeMiddleware, testController.acceptResponses);  // Get created test by id
router.post('/api/tests/update-answer-grade', authenticateMiddleware, authorizeMiddleware, testController.updateAnswerGrade);
router.post('/api/tests/show-user-test-details', authenticateMiddleware, authorizeMiddleware, testController.showUserTestDetails);

module.exports = router;