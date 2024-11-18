const db = require('../models/db');

// Mendapatkan semua user
exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

// Membuat user baru
exports.createUser = async (req, res) => {
  try {
    const { username, email, password, sure_name, gender } = req.body;
    const query = 'INSERT INTO users (username, email, password, sure_name, gender) VALUES (?, ?, ?, ?, ?)';
    const [result] = await db.query(query, [username, email, password, sure_name, gender]);
    res.status(201).json({ message: 'User created', userId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};