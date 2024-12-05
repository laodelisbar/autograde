const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Registrasi User
exports.register = async (req, res) => {
    try {
      const { email, password, username } = req.body;

      if (!email || !username) {
        return res.status(400).json({ message: 'Email and username are required' });
      }
  
      // Cek apakah user sudah terdaftar
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = await User.create({ email, password: hashedPassword, username });

      return res.status(201).json({ message: 'Register Success', user });
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cari user berdasarkan email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Email not found' });
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Wrong Password' });
    }

    // Buat JWT token
    const token = jwt.sign({ id: user.id, email: user.email, username: user.username }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    return res.json({ message: 'Login success', token, username: user.username });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { access_token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: access_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name: username, picture: profilePictureUrl } = payload;

    let user = await User.findOne({ where: { email } });

    if (user) {
      // Jika user ditemukan berdasarkan email, perbarui googleId dan profilePictureUrl
      user.googleId = googleId;
      user.profilePictureUrl = profilePictureUrl;
      user.isVerified = true;
      await user.save();
    } else {
      // Jika user tidak ditemukan, buat user baru
      user = await User.create({
        googleId,
        email,
        username,
        profilePictureUrl,
        isVerified: true,
      });
    }

    const token = jwt.sign({ id: user.id, email: user.email, username: user.username }, process.env.JWT_SECRET, { expiresIn: '24h' });

    return res.json({ message: 'Login success', token, username: user.username });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};