const { Test, Question } = require('../models');

// Tambahkan test beserta questions
exports.addTestWithQuestions = async (req, res) => {
  try {
    const { test_title, test_duration, questions } = req.body;

    // Ambil `creator_id` dari token yang sudah diverifikasi oleh middleware
    const creator_id = req.user.id; // `req.user` berasal dari middleware autentikasi

    // Validasi input
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'Pertanyaan harus disediakan' });
    }

    // Buat test baru
    const test = await Test.create(
      {
        creator_id, // Ambil creator_id dari token
        test_title,
        test_duration,
        Questions: questions.map((q) => ({
          question_text: q.question_text,
          answer_text: q.answer_text,
        })),
      },
      {
        include: [{ model: Question, as: 'Questions' }],
      }
    );

    return res.status(201).json({ message: 'Test berhasil dibuat', test });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getTests = async (req, res) => {
  try {
    const creator_id = req.user.id;
    console.log(creator_id);

    const tests = await Test.findAll({
      where: { creator_id },
      include: [{ model: Question, as: 'Questions' }],
    });

    return res.status(200).json({ message: 'Daftar tes berhasil diambil', tests });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


exports.getTestById = async (req, res) => {
  try {
    const { id } = req.params;

    const test = await Test.findOne({
      where: { id },
      attributes: { exclude: ['createdAt', 'updatedAt', 'creator_id'] }, // Exclude atribut dari Test
      include: [
        {
          model: Question,
          as: 'Questions',
          attributes: { exclude: ['answer_text', 'createdAt', 'updatedAt', 'test_id'] }, // Exclude atribut dari Questions
        },
      ],
    });

    if (!test) {
      return res.status(404).json({ message: 'Test tidak ditemukan' });
    }

    return res.status(200).json({ message: 'Detail test berhasil diambil', test });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};