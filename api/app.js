const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const testRoutes = require('./routes/testRoutes');
const answerRoutes = require('./routes/answerRoutes');
const app = express();

// Middleware untuk parsing body request
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/answers', answerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// TODO: Change submit answer body request and give response in submitAnswer
// TODO: Connect to Machine Learning
// TODO: Connect to cloud login
// TODO: Connect to cloud SQL
// TODO: Connect to cloud Storage
// TODO: Connect to Machine Learning