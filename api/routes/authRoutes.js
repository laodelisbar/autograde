const express = require('express');
const passport = require('../passport'); // Pastikan path sesuai dengan struktur proyek
const jwt = require('jsonwebtoken');

const router = express.Router();

// Endpoint untuk memulai login Google
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Endpoint callback setelah login Google
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { session: false }), // Nonaktifkan session jika menggunakan JWT
  (req, res) => {
    // Buat JWT token untuk user
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ message: 'Login berhasil', token });
  }
);

module.exports = router;