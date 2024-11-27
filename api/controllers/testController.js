
const { where } = require('sequelize');
const { UserTests, Test, Answer, Question } = require('../models');

// Tambahkan test beserta questions
exports.storeTest = async (req, res) => {
  try {
    const { testTitle, testDuration, questions } = req.body;

    // Ambil `creator_id` dari token yang sudah diverifikasi oleh middleware
    const creatorId = req.user.id; // `req.user` berasal dari middleware autentikasi

    // Validasi input
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'Pertanyaan harus disediakan' });
    }

    // Buat test baru
    const test = await Test.create(
      {
        creatorId, // Ambil creator_id dari token
        testTitle,
        testDuration,
        questions: questions.map((q) => ({
          questionText: q.questionText,
          answerText: q.answerText,
        })),
      },
      {
        include: [{ model: Question, as: 'questions' }],
      }
    );

    return res.status(201).json({ message: 'Test berhasil dibuat', test });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getTests = async (req, res) => {
  try {
    const creatorId = req.user.id;

    const tests = await Test.findAll({
      where: { creatorId },
      include: [
        {
          model: Question,
          as: 'questions',
          attributes: { exclude: ['createdAt', 'updatedAt', 'testId'] }, // Menghapus createdAt dan updatedAt
        },
      ],
    });

    return res.status(200).json({ message: tests });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.showTest = async (req, res) => {
  try {
    const { id } = req.params;
    const creatorId = req.user.id;

    const test = await Test.findOne({
      where: { id, creatorId },
      include: [
        {
          model: Question,
          as: 'questions',
          attributes: { exclude: ['createdAt', 'updatedAt', 'testId'] }, // Exclude createdAt and updatedAt
        },
        {
          model: UserTests,
          as: 'userTests',
          attributes: { exclude: ['createdAt', 'updatedAt', 'testId'] }, // Exclude createdAt and updatedAt
        }
      ],
    });

    const userTestCount = await UserTests.count({ where: { testId: id } });
    test.dataValues.userTestCount = userTestCount;

    if (!test) {
      return res.status(404).json({ message: 'Test tidak ditemukan' });
    }

    return res.status(200).json({ message: test });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.acceptResponses = async (req, res) => {
  try {
    const { id, acceptResponses } = req.body;
    const creatorId = req.user.id;
    const test = await Test.findOne({ where: { id, creatorId } });

    if (!test) {
      return res.status(404).json({ message: 'Test tidak ditemukan' });
    }

    test.acceptResponses = Boolean(acceptResponses); // Convert to boolean
    await test.save();

    return res.status(200).json({ message: 'Test berhasil diubah', test });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Function to update the grade of an answer
exports.updateAnswerGrade = async (req, res) => {
  try {
    const { answerId, grade } = req.body;
    const creatorId = req.user.id;

    // Find the answer
    const answer = await Answer.findOne({
      where: { id: answerId },
      include: [
        {
          model: UserTests,
          as: 'userTests',
          include: [
            {
              model: Test,
              as: 'test',
              where: { creatorId },
            },
          ],
        },
      ],
    });

    if (!answer) {
      return res.status(404).json({ message: 'Answer tidak ditemukan atau Anda tidak memiliki izin untuk mengubahnya.' });
    }

    // Update the grade of the answer
    answer.grade = grade;
    await answer.save();

    // Update the total grade of the user test
    const userTest = await UserTests.findOne({ where: { id: answer.userTestId } });
    const answers = await Answer.findAll({ where: { userTestId: userTest.id } });
    const totalGrade = answers.reduce((acc, answer) => acc + answer.grade, 0) / answers.length;
    userTest.totalGrade = totalGrade;
    await userTest.save();

    return res.status(200).json({ message: 'Grade berhasil diubah', answer, userTest });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Function to show user test details
exports.showUserTestDetails = async (req, res) => {
  try {
    const { userTestId } = req.body;

    const userTest = await UserTests.findOne({
      where: { id : userTestId },
      include: [
        {
          model: Answer,
          as: 'answers',
          include: [
            {
              model: Question,
              as: 'question',
              attributes: ['questionTest'],
            },
          ],
        },
      ],
    });

    if (!userTest) {
      return res.status(404).json({ message: 'User test tidak ditemukan' });
    }

    return res.status(200).json({ message: 'Detail user test berhasil diambil', userTest });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// jika creator_id sama dengan id user yang login maka munculkan jawaban peserta beserta nilainya
exports.getTestById = async (req, res) => {
  try {
    const { id } = req.params;

    const test = await Test.findOne({
      where: { id },
      attributes: { exclude: ['createdAt', 'updatedAt', 'creatorId'] }, // Exclude atribut dari Test
      include: [
        {
          model: Question,
          as: 'questions',
          attributes: { exclude: ['answerText', 'createdAt', 'updatedAt', 'testId'] }, // Exclude atribut dari Questions
        },
      ],
    });

    if (!test) {
      return res.status(404).json({ message: 'Test tidak ditemukan' });
    }

    const questionCount = await Question.count({ where: { testId: id } });
    const UserTestCount = await UserTests.count({ where: { testId: id } });
    
    // Add questionCount to the test object
    test.dataValues.questionCount = questionCount;
    test.dataValues.UserTestCount = UserTestCount;
    return res.status(200).json({ message: 'Detail test berhasil diambil', test });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.startTest = async (req, res) => {
  try {
    const { testId, username } = req.body; // Ambil test_id dan username dari body request
    let userId = req.user ? req.user.id : null; // Ambil user_id dari middleware atau null jika tidak ada
    let userTestUsername = userId ? req.user.username : username; // Ambil username dari user yang login atau dari body

    // Jika user_id dan username tidak ada, kembalikan error
    if (!userId && !userTestUsername) {
      return res.status(400).json({ message: 'User ID atau username harus disediakan.' });
    }

    if (userTestUsername && !userId) {
      const existingUserTest = await UserTests.findOne({
        where: { username: userTestUsername },
      });

      if (existingUserTest) {
        return res.status(400).json({ message: 'Username sudah ada.' });
      }
    }

    // Cari test berdasarkan test_id
    const test = await Test.findOne({
      where: { id: testId },
      attributes: ['id', 'testTitle', 'testDuration', 'acceptResponses'], // Ambil data test tertentu
      include: [
        {
          model: Question,
          as: 'questions',
          attributes: { exclude: ['answerText', 'createdAt', 'updatedAt'] },
        },
      ],
    });

    if (!test) {
      return res.status(404).json({ message: 'Test tidak ditemukan.' });
    }

    // Periksa apakah test mengizinkan hasil
    if (!test.acceptResponses) {
      return res.status(403).json({ message: 'Tes ini tidak dapat dimulai (results disabled).' });
    }

    // Periksa apakah User_tests sudah ada
    let userTest = await UserTests.findOne({
      where: { testId, userId },
    });

    if (userTest) {
      // Jika sudah ada, kembalikan ID user_test dan detail tes
      return res.status(200).json({
        message: 'Tes sudah dimulai sebelumnya.',
        userTestId: userTest.id,
        test,
      });
    }

    // Buat User_tests baru
    userTest = await UserTests.create({
      userId: userId || null, // Jika user_id tidak ada, gunakan null
      testId,
      username: userTestUsername, // Gunakan username yang sudah ditentukan sebelumnya
      timeLeft: test.testDuration, // Waktu yang diberikan diambil dari durasi tes
      totalGrade: 0,
      testDate: new Date(),
    });

    return res.status(201).json({
      message: 'Tes berhasil dimulai.',
      userTestId: userTest.id,
      test,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.submitTest = async (req, res) => {
  try {
    const { userTestId, questions } = req.body;

    // Cari User_test untuk memastikan user memiliki akses
    const userTest = await UserTests.findOne({ where: { id: userTestId } });

    const test = await Test.findOne({ where: { id: userTest.testId } });

    if (!userTest) {
      return res.status(404).json({ message: 'User test tidak ditemukan.' });
    }

    // Validasi setiap pertanyaan dan simpan jawabannya
    const results = [];
    for (const question of questions) {
      const { questionId, answer } = question;

      // Cari pertanyaan untuk memvalidasi ID pertanyaan
      const existingQuestion = await Question.findOne({ where: { id: questionId } });

      if (!existingQuestion) {
        results.push({
          questionId,
          status: 'error',
          message: 'Pertanyaan tidak ditemukan.',
        });
        continue;
      }

      // Periksa apakah jawaban sudah ada sebelumnya
      let existingAnswer = await Answer.findOne({
        where: { userTestId, questionId },
      });

      if (existingAnswer) {
        results.push({
          existingQuestion,
          grade: existingAnswer.grade,
          answer_id: existingAnswer.id,
        });
        continue;
      }

      //TODO: Berikan Jawaban hasil machine learning model
      // Simpan jawaban baru
      const newAnswer = await Answer.create({
        userTestId,
        questionId,
        answer: answer || null, // Jawaban bisa null jika tidak diisi
        grade: 0, // Default grade 0, akan di-update saat penilaian
      });

      results.push({
        question: existingQuestion,
        answer: newAnswer,
      });
    }

    return res.status(200).json({
      message: 'Proses pengiriman jawaban selesai.',
      totalGrade: userTest.totalGrade,
      testTitle: test.testTitle,
      results,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};