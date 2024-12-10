const { UserTests, Test, Answer, Question } = require('../models');
const axios = require('axios');

// Tambahkan test beserta questions
exports.storeTest = async (req, res) => {
  try {
    const { testTitle, testDuration, questions } = req.body;

    const creatorId = req.user.id;

    // Validasi input
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'Must have a question' });
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

    return res.status(201).json({ message: 'Test Created', test });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: 'Internal server error' });
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
          attributes: { exclude: ['createdAt', 'updatedAt', 'testId'] },
        },
      ],
      order: [['updatedAt', 'DESC']],
    });

    return res.status(200).json({ tests });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getPastTests = async (req, res) => {
  try {
    const userId = req.user.id;
    // console.log('User Id : ', userId);

    const userTests = await UserTests.findAll({
      where: { userId },
      attributes: ['testId'],
    });
    // console.log(userTests);
    const testIds = userTests.map(userTest => userTest.testId);

    if (testIds.length === 0) {
      return res.status(404).json({ message: 'No past tests found' });
    }

    const tests = await Test.findAll({
      where: { id: testIds },
      include: [
        {
          model: Question,
          as: 'questions',
          attributes: { exclude: ['createdAt', 'updatedAt', 'testId'] },
        },
      ],
      order: [['updatedAt', 'DESC']],
    });

    if (tests.length === 0) {
      return res.status(404).json({ message: 'Test notx found' });
    }

    return res.status(200).json({ tests });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: 'Internal server error' });
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
      order: [
        [{ model: UserTests, as: 'userTests' }, 'totalGrade', 'DESC'], // Sort by totalGrade in descending order
        [{ model: UserTests, as: 'userTests' }, 'timeLeft', 'DESC'] // Sort by timeLeft in descending order
      ],
    });

    console.log('TEST: ',test.dataValues.userTests);

    const userTestCount = await UserTests.count({ where: { testId: id } });
    test.dataValues.userTestCount = userTestCount;

    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    return res.status(200).json({ test });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.showPastTest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const userTest = await UserTests.findOne({
      where: { testId: id, userId },
      include: [
        {
          model: Test,
          as: 'test',
          include: [
            {
              model: Question,
              as: 'questions',
              attributes: { exclude: ['createdAt', 'updatedAt', 'testId'] },
            },
          ],
        },
        {
          model: Answer,
          as: 'answers',
          include: [
            {
              model: Question,
              as: 'question',
              attributes: ['questionText'],
            },
          ],
        },
      ],
    });

    if (!userTest) {
      return res.status(404).json({ message: 'Test not found' });
    }

    const results = userTest.answers.map(answer => ({
      question: answer.question.questionText,
      answer: answer.answer,
      grade: answer.grade,
    }));

    return res.status(200).json({
      testTitle: userTest.test.testTitle,
      totalGrade: userTest.totalGrade,
      results,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.acceptResponses = async (req, res) => {
  try {
    const { id, acceptResponses } = req.body;
    const creatorId = req.user.id;
    const test = await Test.findOne({ where: { id, creatorId } });

    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    test.acceptResponses = Boolean(acceptResponses); // Convert to boolean
    await test.save();

    return res.status(200).json({ message: 'Accept Responses updated'});
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: 'Internal server error' });
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
          as: 'userTest',
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
    const totalGrade = (answers.reduce((acc, answer) => acc + answer.grade, 0) / answers.length) * 20;
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
              attributes: ['questionText'],
            },
          ],
        },
      ],
    });

    if (!userTest) {
      return res.status(404).json({ message: 'Response not found' });
    }

    return res.status(200).json({ message: 'Response detail found', userTest });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

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
      return res.status(404).json({ message: 'Test not found' });
    }

    const questionCount = await Question.count({ where: { testId: id } });
    const UserTestCount = await UserTests.count({ where: { testId: id } });
    
    test.dataValues.questionCount = questionCount;
    test.dataValues.UserTestCount = UserTestCount;
    return res.status(200).json({ message: 'Test found', test });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.startTest = async (req, res) => {
  try {
    const { testId, username } = req.body; // Ambil test_id dan username dari body request
    let userId = req.user ? req.user.id : null; // Ambil user_id dari middleware atau null jika tidak ada
    console.log('User ID : ', userId);
    let userTestUsername = userId ? req.user.username : username; // Ambil username dari user yang login atau dari body
    console.log('User Test Username : ', userTestUsername);

    // Jika user_id dan username tidak ada, kembalikan error
    if (!userId && !userTestUsername) {
      return res.status(400).json({ message: 'Must have user' });
    }

    if (userTestUsername && !userId) {
      const existingUserTest = await UserTests.findOne({
        //TODO: cari usertest yang memiliki test id yang sama
        where: { testId, username : userTestUsername },
      });

      if (existingUserTest) {
        return res.status(400).json({ message: 'Username already exist' });
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
      return res.status(404).json({ message: 'Test not found' });
    }

    // Periksa apakah test mengizinkan hasil
    if (!test.acceptResponses) {
      return res.status(403).json({ message: 'Test doesnt accept response' });
    }

    // Periksa apakah User_tests sudah ada
    let userTest = await UserTests.findOne({
      where: { testId, username : userTestUsername },
    });
    
    console.log('User Test apakah usertests sudah ada: ', userTest);
    if (userTest) {
      // Jika sudah ada, kembalikan ID user_test dan detail tes
      return res.status(200).json({
        message: 'Tes sudah dimulai sebelumnya.',
        userTestId: userTest.id,
        timeLeft: userTest.timeLeft,
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

    console.log('User Test Buat Test Baru: ', userTest);
    return res.status(201).json({
      message: 'Tes berhasil dimulai.',
      userTestId: userTest.id,
      timeLeft: userTest.timeLeft,
      test,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateTimeLeft = async (req, res) => {
  try {
    const { userTestId, timeLeft } = req.body;

    const userTest = await UserTests.findOne({ where: { id: userTestId } });

    if (!userTest) {
      return res.status(404).json({ message: 'User test not found' });
    }

    userTest.timeLeft = timeLeft;
    await userTest.save();

    return res.status(200).json({ message: 'Time left updated successfully' });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.submitTest = async (req, res) => {
  try {
    const { userTestId, questions, timeLeft } = req.body;

    // Cari User_test untuk memastikan user memiliki akses
    const userTest = await UserTests.findOne({ where: { id: userTestId } });

    const test = await Test.findOne({ where: { id: userTest.testId } });

    if (!userTest) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Perbarui timeLeft
    userTest.timeLeft = timeLeft;
    await userTest.save();

    // Validasi setiap pertanyaan dan simpan jawabannya
    const results = [];
    const input_premise = [];
    const input_hypothesis = [];

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

      // Tambahkan input_premise dan input_hypothesis untuk API model
      input_premise.push(existingQuestion.answerText);
      input_hypothesis.push(answer);
    }

    // Kirim request ke API model
    const apiBaseUrl = process.env.MODEL_BASE_URL || 'http://host.docker.internal:8000';
    const apiUri = '/predict';
    const requestBody = {
      input_premise,
      input_hypothesis,
    };

    let predictedGrades;
    try {
      const response = await axios.post(`${apiBaseUrl}${apiUri}`, requestBody);
      predictedGrades = response.data.predicted.map(grade => Math.min(Math.max(Math.round(grade * 5), 1), 5)); // Normalize to 1-5 scale
    } catch (error) {
      console.error('Error making request to API:', error.message);
      console.log('Predicted Grades:', predictedGrades);
      // Handle the error appropriately, e.g., return a response with an error message
    }

    // Simpan jawaban baru dengan grade yang diprediksi
    for (let i = 0; i < questions.length; i++) {
      const { questionId, answer } = questions[i];
      let predictedGrade;
      if (predictedGrades) {
        predictedGrade = predictedGrades[i] || null;
      }

      const newAnswer = await Answer.create({
        userTestId,
        questionId,
        answer: answer || null, // Jawaban bisa null jika tidak diisi
        grade: predictedGrade || 0, // Default grade 0, akan di-update saat penilaian
      });

      results.push({
        question: await Question.findOne({ where: { id: questionId } }),
        answer: newAnswer,
      });
    }

    // Update the total grade of the user test
    const answers = await Answer.findAll({ where: { userTestId: userTest.id } });
    const totalGrade = (answers.reduce((acc, answer) => acc + answer.grade, 0) / answers.length) * 20;
    userTest.totalGrade = totalGrade;
    await userTest.save();

    return res.status(200).json({
      message: 'Proses pengiriman jawaban selesai.',
      totalGrade: userTest.totalGrade,
      testTitle: test.testTitle,
      results,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};