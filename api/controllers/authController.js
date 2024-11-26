const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registrasi User
exports.register = async (req, res) => {
    try {
      const { email, password, username } = req.body;
  
      // Cek apakah user sudah terdaftar
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email sudah terdaftar' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = await User.create({ email, password: hashedPassword, username });

      return res.status(201).json({ message: 'User berhasil terdaftar', user });
    } catch (err) {
      console.error('Error di registrasi:', err.message);
      return res.status(500).json({ message: err.message });
    }
  };
  

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cari user berdasarkan email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Email tidak ditemukan' });
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Password salah' });
    }

    // Buat JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    return res.json({ message: 'Login berhasil', token });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};