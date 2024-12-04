package com.example.autograde.test

import android.app.Dialog
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.room.Room
import com.example.autograde.R
import com.example.autograde.data.api.response.SubmitTestRequest
import com.example.autograde.databinding.ActivityTestBinding
import com.example.autograde.data.api.response.TestStart
import com.example.autograde.data.di.ViewModelFactory
import com.example.autograde.data.local.entity.UserAnswer
import com.example.autograde.data.local.room.UserAnswerDao
import com.example.autograde.data.local.room.UserAnswerDatabase
import com.example.autograde.databinding.ActivityConfirmationBinding
import kotlinx.coroutines.launch

class TestActivity : AppCompatActivity() {

    private lateinit var binding: ActivityTestBinding
    private lateinit var testAdapter: TestAdapter
    private var currentQuestionIndex: Int = 0
    private lateinit var userAnswerDao: UserAnswerDao
    private lateinit var dialogBinding: ActivityConfirmationBinding
    private var customDialog: Dialog? = null

    private val submitTestViewModel: SubmitTestViewModel by viewModels {
        ViewModelFactory.getInstance(applicationContext)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityTestBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Inisialisasi database
        val db = Room.databaseBuilder(
            applicationContext,
            UserAnswerDatabase::class.java,
            "user_answers_db"
        ).build()
        userAnswerDao = db.userAnswerDao()

        // Inisialisasi adapter
        testAdapter = TestAdapter { question, position ->
            saveCurrentAnswer()
            currentQuestionIndex = position
            displayQuestion(position)
        }

        // Setup RecyclerView
        binding.rvNumberNav.layoutManager =
            LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false)
        binding.rvNumberNav.adapter = testAdapter


        val testData: TestStart? = intent.getParcelableExtra("TEST_START_OBJECT")

        testData?.let {
            binding.tvTestTitle.text = it.testTitle
            val nonNullQuestions =
                it.questions?.filterNotNull() ?: emptyList() // Filter elemen null
            testAdapter.submitList(nonNullQuestions)
            displayQuestion(0) // Tampilkan soal pertama
        }

        binding.btnPrevious.text = getString(R.string.previous)

        // Navigasi tombol next
        binding.btnNext.setOnClickListener {
            saveCurrentAnswer()
            if (currentQuestionIndex < testData?.questions?.size?.minus(1) ?: 0) {
                currentQuestionIndex++
                displayQuestion(currentQuestionIndex)
            } else {
                showCustomDialog(this)
            }
        }

        // Navigasi tombol previous
        binding.btnPrevious.setOnClickListener {
            saveCurrentAnswer()
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--
                displayQuestion(currentQuestionIndex)
            }
        }
    }

    private fun displayQuestion(index: Int) {
        val testData: TestStart? = intent.getParcelableExtra("TEST_START_OBJECT")
        testData?.questions?.getOrNull(index)?.let { questions ->
            binding.tvQuestion.text = questions.questionText

            lifecycleScope.launch {
                val savedAnswer = userAnswerDao.getAnswerByQuestionId(questions.id ?: "")
                binding.edInputAnswer.setText(savedAnswer?.answer ?: "")
            }

            if (index == testData?.questions?.size?.minus(1)) {
                binding.btnNext.text =
                    getString(R.string.finish)  // Ganti tombol Next menjadi Finish
            } else {
                binding.btnNext.text =
                    getString(R.string.next)  // Kembali ke Next jika bukan soal terakhir
            }
        }
    }

    private fun saveCurrentAnswer() {
        val testData: TestStart? = intent.getParcelableExtra("TEST_START_OBJECT")
        val testResponse = intent.getStringExtra("USER_TEST_ID")
        val currentQuestion = testData?.questions?.getOrNull(currentQuestionIndex)

        currentQuestion?.let { question ->
            val answerText = binding.edInputAnswer.text.toString()
            if (answerText.isNotEmpty() && testResponse != null) {
                lifecycleScope.launch {
                    // Hapus jawaban lama yang memiliki questionId yang sama
                    userAnswerDao.deleteAnswerByQuestionId(question.id ?: "")

                    // Insert jawaban baru
                    val userAnswer = UserAnswer(
                        userTestId = testResponse,
                        questionId = question.id ?: "",
                        answer = answerText
                    )

                    // Insert jawaban baru
                    userAnswerDao.insertAnswer(userAnswer)
                }
            }
        }
    }


    fun showCustomDialog(activity: AppCompatActivity) {
        val dialog = Dialog(activity)
        dialogBinding = ActivityConfirmationBinding.inflate(layoutInflater)
        val view: View = dialogBinding.root
        dialog.setContentView(view)

        dialog.window?.setBackgroundDrawableResource(android.R.color.transparent)

        dialogBinding.tvConfirmation.text = activity.getString(R.string.start_test_confirmation)
        dialogBinding.btnContinue.text = activity.getString(R.string.start)
        dialogBinding.btnBack.text = activity.getString(R.string.back)

        dialogBinding.btnContinue.setOnClickListener {
            val testResponse = intent.getStringExtra("USER_TEST_ID")
            val testData: TestStart? = intent.getParcelableExtra("TEST_START_OBJECT")

            if (testResponse != null && testData != null) {
                lifecycleScope.launch {
                    // Ambil semua jawaban yang tersimpan untuk `userTestId`
                    val savedAnswers = userAnswerDao.getAllAnswersByUserTestId(testResponse)

                    // Konversi jawaban ke dalam format `SubmitTestRequest`
                    val submitTestRequests = savedAnswers.map { savedAnswer ->
                        SubmitTestRequest(
                            questionId = savedAnswer.questionId,
                            answer = savedAnswer.answer
                        )
                    }
                    submitTestViewModel.submitTest(testResponse, submitTestRequests)
                    observeStartTestResponse()
                }

                dialogBinding.btnBack.setOnClickListener {
                    dialog.dismiss()
                }

                this.customDialog = dialog // Menyimpan referensi dialog
                dialog.show()
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        this.customDialog?.dismiss()
    }

    private fun observeStartTestResponse() {
        submitTestViewModel.submitTestResponse.observe(this) { response ->
            response.message?.let {
                Toast.makeText(this, it, Toast.LENGTH_SHORT).show()
            }

        }

    }
}

