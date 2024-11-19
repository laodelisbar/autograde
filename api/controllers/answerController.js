const { User_tests, Test, Answer, Question } = require('../models');

exports.startUserTest = async (req, res) => {
  try {
    const { test_id } = req.body;
    const user_id = req.user.id; // ID pengguna dari middleware autentikasi

    // Cari test berdasarkan test_id
    const test = await Test.findOne({
      where: { id: test_id },
      attributes: ['id', 'test_title', 'test_duration','accept_responses'], // Ambil data test tertentu
      include: [
        {
          model: Question,
          as: 'Questions',
          attributes: { exclude: ['answer_text', 'createdAt', 'updatedAt'] },
        },
      ],
    });

    console.log(test);
    if (!test) {
      return res.status(404).json({ message: 'Test tidak ditemukan.' });
    }

    // Periksa apakah test mengizinkan hasil
    if (!test.accept_responses) {
      return res.status(403).json({ message: 'Tes ini tidak dapat dimulai (results disabled).' });
    }

    // Periksa apakah User_tests sudah ada
    let userTest = await User_tests.findOne({
      where: { test_id, user_id },
    });

    if (userTest) {
      // Jika sudah ada, kembalikan ID user_test dan detail tes
      return res.status(200).json({
        message: 'Tes sudah dimulai sebelumnya.',
        user_test_id: userTest.user_test_id,
        test,
      });
    }

    // Buat User_tests baru
    userTest = await User_tests.create({
      user_id,
      test_id,
      username: req.user.username || null, // Jika username tersedia di token, gunakan
      time_left: test.test_duration, // Waktu yang diberikan diambil dari durasi tes
      total_grade: 0,
      test_date: new Date(),
    });

    return res.status(201).json({
      message: 'Tes berhasil dimulai.',
      user_test_id: userTest.user_test_id,
      test,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.submitAnswer = async (req, res) => {
  try {
    const { user_test_id, question_id, answer } = req.body;

    // Cari User_test untuk memastikan user memiliki akses
    const userTest = await User_tests.findOne({ where: { user_test_id } });

    if (!userTest) {
      return res.status(404).json({ message: 'User test tidak ditemukan.' });
    }

    // Cari Question untuk memvalidasi ID pertanyaan
    const question = await Question.findOne({ where: { id: question_id } });

    if (!question) {
      return res.status(404).json({ message: 'Pertanyaan tidak ditemukan.' });
    }

    // Periksa apakah jawaban sudah ada sebelumnya
    let existingAnswer = await Answer.findOne({
      where: { user_test_id, question_id },
    });

    if (existingAnswer) {
      return res.status(200).json({
        message: 'Jawaban sudah disimpan sebelumnya.',
        answer_id: existingAnswer.id,
      });
    }

    // Simpan jawaban baru
    const newAnswer = await Answer.create({
      user_test_id,
      question_id,
      answer: answer || null, // Jawaban bisa null jika tidak diisi
      grade: 0, // Default grade 0, akan di-update saat penilaian
    });

    return res.status(201).json({
      message: 'Jawaban berhasil disimpan.',
      answer_id: newAnswer.id,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};