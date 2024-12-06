package com.example.autograde.test

import android.app.Dialog
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.autograde.R
import com.example.autograde.data.api.response.Answers
import com.example.autograde.data.api.response.ResultsItem
import com.example.autograde.databinding.ActivityTestBinding
import com.example.autograde.data.api.response.TestStart
import com.example.autograde.data.di.ViewModelFactory
import com.example.autograde.data.local.entity.UserAnswer
import com.example.autograde.data.local.room.UserAnswerDao
import com.example.autograde.data.local.room.UserAnswerDatabase
import com.example.autograde.databinding.ActivityConfirmationBinding
import com.example.autograde.test_result.TestResultActivity
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking

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

        val db = UserAnswerDatabase.getInstance(this)
        userAnswerDao = db.userAnswerDao()


        // Inisialisasi adapter
        testAdapter = TestAdapter(
            { question, position ->
                saveCurrentAnswer()
                currentQuestionIndex = position
                displayQuestion(position)

                testAdapter.setCurrentlyDisplayedQuestion(position)
            },
            // Lambda untuk memeriksa apakah pertanyaan sudah dijawab
            { questionId ->
                runBlocking {
                    userAnswerDao.getAnswerByQuestionId(questionId) != null
                }
            },
            // Lambda untuk memeriksa apakah pertanyaan di-bookmark
            { questionId ->
                runBlocking {
                    userAnswerDao.isQuestionBookmarked(questionId)
                }
            },
            // Lambda untuk mendapatkan isi jawaban
            { questionId ->
                runBlocking {
                    userAnswerDao.getAnswerByQuestionId(questionId)?.answer
                }
            }
        )

        // Setup RecyclerView
        binding.rvNumberNav.layoutManager =
            LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false)
        binding.rvNumberNav.adapter = testAdapter


        val testData: TestStart? = intent.getParcelableExtra("TEST_START_OBJECT")

        testData?.let {
            binding.tvTestTitle.text = it.testTitle
            val nonNullQuestions =
                it.questions?.filterNotNull() ?: emptyList()
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
                saveCurrentAnswer()
                showCustomDialog(this)
            }
            saveCurrentAnswer()
        }

        // Navigasi tombol previous
        binding.btnPrevious.setOnClickListener {
            saveCurrentAnswer()
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--
                displayQuestion(currentQuestionIndex)
            }
            saveCurrentAnswer()
        }

        binding.btnBookmark.setOnClickListener {

            val testData: TestStart? = intent.getParcelableExtra("TEST_START_OBJECT")
            val currentQuestion = testData?.questions?.getOrNull(currentQuestionIndex)
            saveCurrentAnswer()

            currentQuestion?.let { question ->
                lifecycleScope.launch {
                    val isCurrentlyBookmarked =
                        userAnswerDao.isQuestionBookmarked(question.id ?: "")
                    val newBookmarkStatus = !isCurrentlyBookmarked
                    userAnswerDao.updateBookmarkStatus(question.id ?: "", newBookmarkStatus)

                    testAdapter.notifyItemChanged(currentQuestionIndex)
                    updateBookmarkedQuestion(newBookmarkStatus)
                    saveCurrentAnswer()
                }
            }
        }
    }

    private fun submitTest() {
        val testResponse = intent.getStringExtra("USER_TEST_ID")
        val testData: TestStart? = intent.getParcelableExtra("TEST_START_OBJECT")

        if (testResponse != null && testData != null) {
            Log.d("TestActivity", "request called")
            lifecycleScope.launch {
                // Ambil semua jawaban yang tersimpan untuk `userTestId`
                val savedAnswers = userAnswerDao.getAllAnswersByUserTestId(testResponse)

                // Konversi jawaban ke dalam format `SubmitTestRequest`
                val answers = savedAnswers.map { savedAnswer ->
                    Answers(
                        questionId = savedAnswer.questionId,
                        answer = savedAnswer.answer ?: ""
                    )
                }

                val timeLeft = 56
                submitTestViewModel.submitTest(testResponse, answers, timeLeft )
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
                val isBookmarked = userAnswerDao.isQuestionBookmarked(questions.id ?: "")
                updateBookmarkedQuestion(isBookmarked)
            }

            if (index == testData?.questions?.size?.minus(1)) {
                binding.btnNext.text =
                    getString(R.string.finish)  // Ganti tombol Next menjadi Finish
            } else {
                binding.btnNext.text =
                    getString(R.string.next)  // Kembali ke Next jika bukan soal terakhir
            }
        }
        testAdapter.notifyItemChanged(currentQuestionIndex)
        testAdapter.setCurrentlyDisplayedQuestion(index)
    }

    private fun saveCurrentAnswer() {
        val testData: TestStart? = intent.getParcelableExtra("TEST_START_OBJECT")
        val testResponse = intent.getStringExtra("USER_TEST_ID")
        val currentQuestion = testData?.questions?.getOrNull(currentQuestionIndex)
        testAdapter.notifyItemChanged(currentQuestionIndex)

        currentQuestion?.let { question ->
            val answerText = binding.edInputAnswer.text.toString()
                .trim() // Tambahkan trim() untuk menghapus spasi di awal/akhir
            if (testResponse != null) {
                lifecycleScope.launch {
                    val isBookmarked = userAnswerDao.isQuestionBookmarked(question.id ?: "")

                    // Simpan jawaban bahkan jika kosong
                    val userAnswer = UserAnswer(
                        userTestId = testResponse,
                        questionId = question.id ?: "",
                        answer = answerText,
                        isBookmarked = isBookmarked
                    )

                    // Gunakan insertOrReplace atau update
                    val existingAnswer = userAnswerDao.getAnswerByQuestionId(question.id ?: "")
                    if (existingAnswer != null) {
                        userAnswerDao.updateAnswerByQuestionId(question.id ?: "", answerText)
                    } else {
                        userAnswerDao.insertAnswer(userAnswer)
                    }

                    testAdapter.notifyItemChanged(currentQuestionIndex)
                }
            }
        }
    }


    fun showCustomDialog(activity: AppCompatActivity) {
        Log.d("TestActivity", "showCustomDialog called")
        val dialog = Dialog(activity)
        dialogBinding = ActivityConfirmationBinding.inflate(layoutInflater)
        val view: View = dialogBinding.root
        dialog.setContentView(view)

        dialog.window?.setBackgroundDrawableResource(android.R.color.transparent)

        dialogBinding.tvConfirmation.text = activity.getString(R.string.finish_test_confirmation)
        dialogBinding.btnContinue.text = activity.getString(R.string.finish)
        dialogBinding.btnBack.text = activity.getString(R.string.back)

        dialogBinding.btnContinue.setOnClickListener {
            submitTest()
            observeStartTestResponse()
        }


        dialogBinding.btnBack.setOnClickListener {
            dialog.dismiss()
        }

        this.customDialog = dialog // Menyimpan referensi dialog
        dialog.show()

        fun showDialogLoading(isLoading: Boolean) {
            dialogBinding.progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
        }
        submitTestViewModel.isLoading.observe(this) {
            showDialogLoading(it)
        }
    }

    private fun observeStartTestResponse() {
        submitTestViewModel.resultItemResponse.observe(this) { result ->
            if (result != null && result.isNotEmpty()) {
                val answers = ArrayList<ResultsItem>()
                answers.addAll(result)  // Memasukkan data ke answers

                val testResponse = intent.getStringExtra("USER_TEST_ID")

                submitTestViewModel.submitTestResponse.observe(this) { response ->
                    response.message?.let {
                        // Hapus sesi pengujian
                        deleteTestSession(testResponse)
                        Toast.makeText(this, it, Toast.LENGTH_SHORT).show()
                    }

                    // Membuat Intent untuk mengirim data ke TestResultActivity
                    val intent = Intent(this@TestActivity, TestResultActivity::class.java).apply {
                        putExtra("TEST_RESPONSE_OBJECT", response) // Mengirimkan objek response
                        putParcelableArrayListExtra(
                            "RESULT_ITEM_OBJECT",
                            answers
                        ) // Mengirimkan answers yang berisi ArrayList<ResultsItem>
                    }

                    // Memulai aktivitas dan mengakhiri aktivitas ini
                    startActivity(intent)
                    finish()
                }
            } else {
                submitTestViewModel.errorMessage.observe(this) { error ->
                    Toast.makeText(this@TestActivity, error, Toast.LENGTH_SHORT).show()

                }
            }

        }
    }


    private fun deleteTestSession(userTestId: String?) {
        userTestId?.let { userTestId ->
            lifecycleScope.launch {
                userAnswerDao.deleteAllAnswersByUserTestId(userTestId)
                binding.edInputAnswer.setText(null)
            }
        } ?: run {
            Toast.makeText(this, "User Test ID tidak ditemukan!", Toast.LENGTH_SHORT).show()
        }
    }

    private fun updateBookmarkedQuestion(isBookmark: Boolean) {
        if (isBookmark) {
            binding.btnBookmark.setImageResource(R.drawable.baseline_bookmark_24) // Gambar penuh
        } else {
            binding.btnBookmark.setImageResource(R.drawable.baseline_bookmark_border_24) // Gambar kosong
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        this.customDialog?.dismiss()
    }


}



