const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const testRoutes = require('./routes/testRoutes');
const answerRoutes = require('./routes/answerRoutes');
const passport = require('./passport');
const authRoutes = require('./routes/authRoutes');
const app = express();

// Middleware untuk parsing body request
app.use(bodyParser.json());
app.use(passport.initialize()); // Inisialisasi Passport

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/answers', answerRoutes);

app.use('/api', authRoutes); // Tambahkan route auth

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// TODO: give response in submitAnswer
// TODO: Connect to Machine Learning
// TODO: Connect to cloud login
// TODO: Connect to cloud SQL
// TODO: Connect to cloud Storage
// TODO: Connect to Machine Learning