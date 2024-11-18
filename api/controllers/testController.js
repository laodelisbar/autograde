const db = require('../models/db');

// Mendapatkan semua user
exports.getTests = async (req, res) => {
    try {
        const userId = req.headers.user_id; // Ambil user_id dari header
  
      // Pastikan user_id diberikan
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
  
      // Query SQL menggunakan placeholder untuk parameter
      const query = 'SELECT * FROM test WHERE creator_id = ?';
      const [rows] = await db.query(query, [userId]);
  
      // Kirimkan data sebagai respons
      res.status(200).json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching tests', error });
    }
};

exports.createTest = async (req, res) => {
  try {
    const { creator_id, test_title, test_duration } = req.body;
    const query = 'INSERT INTO test (creator_id, test_title, test_duration) VALUES (?, ?, ?)';
    const [result] = await db.query(query, [creator_id, test_title, test_duration]);
    res.status(201).json({ message: 'Test created', userId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating test', error });
  }
};