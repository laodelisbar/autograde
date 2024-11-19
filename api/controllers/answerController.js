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
    const { user_test_id, questions } = req.body;

    // Cari User_test untuk memastikan user memiliki akses
    const userTest = await User_tests.findOne({ where: { user_test_id } });

    if (!userTest) {
      return res.status(404).json({ message: 'User test tidak ditemukan.' });
    }

    // Validasi setiap pertanyaan dan simpan jawabannya
    const results = [];
    for (const question of questions) {
      const { question_id, answer } = question;

      // Cari pertanyaan untuk memvalidasi ID pertanyaan
      const existingQuestion = await Question.findOne({ where: { id: question_id } });

      if (!existingQuestion) {
        results.push({
          question_id,
          status: 'error',
          message: 'Pertanyaan tidak ditemukan.',
        });
        continue;
      }

      // Periksa apakah jawaban sudah ada sebelumnya
      let existingAnswer = await Answer.findOne({
        where: { user_test_id, question_id },
      });

      if (existingAnswer) {
        results.push({
          question_id,
          status: 'skipped',
          message: 'Jawaban sudah disimpan sebelumnya.',
          answer_id: existingAnswer.id,
        });
        continue;
      }

      // Simpan jawaban baru
      const newAnswer = await Answer.create({
        user_test_id,
        question_id,
        answer: answer || null, // Jawaban bisa null jika tidak diisi
        grade: 0, // Default grade 0, akan di-update saat penilaian
      });

      results.push({
        question_id,
        status: 'success',
        message: 'Jawaban berhasil disimpan.',
        answer_id: newAnswer.id,
      });
    }

    return res.status(200).json({
      message: 'Proses pengiriman jawaban selesai.',
      results,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};