const express = require('express');
const app = express();
const PORT = 3000;

// Middleware untuk JSON
app.use(express.json());

// Import routes
const userRoutes = require('./routes/userRoutes');
const testRoutes = require('./routes/testRoutes');

// Routes
app.use('/api/users', userRoutes);
app.use('/api/test', testRoutes);

// Error handling
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});