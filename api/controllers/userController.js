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

// Profile User
exports.profile = async (req, res) => {
  try {
    const userId = req.user.id; // ID user dari token JWT
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Generate Refresh Token
const generateRefreshToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  };
  
// Generate Access Token
const generateAccessToken = (userId, email) => {
return jwt.sign({ id: userId, email }, process.env.JWT_SECRET, { expiresIn: '1h' });
};
  
// Endpoint untuk Refresh Token
exports.refreshToken = async (req, res) => {
try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token tidak ditemukan' });
    }

    // Cari user berdasarkan refresh token
    const user = await User.findOne({ where: { refreshToken } });
    if (!user) {
    return res.status(403).json({ message: 'Refresh token tidak valid' });
    }

    // Verifikasi refresh token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
        return res.status(403).json({ message: 'Refresh token tidak valid atau sudah kedaluwarsa' });
    }

    // Generate access token baru
    const accessToken = generateAccessToken(user.id, user.email);
    return res.json({ accessToken });
    });
} catch (err) {
    return res.status(500).json({ message: err.message });
}
};