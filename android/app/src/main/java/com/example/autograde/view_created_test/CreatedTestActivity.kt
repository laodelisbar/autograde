package com.example.autograde.view_created_test

import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.example.autograde.R
import com.example.autograde.data.api.response.CreateTestResponse
import com.example.autograde.data.api.response.Test
import com.example.autograde.data.di.ViewModelFactory
import com.example.autograde.databinding.ActivityCreatedTestBinding
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class CreatedTestActivity : AppCompatActivity() {

    private lateinit var binding: ActivityCreatedTestBinding

    private val createdTestViewModel: CreatedTestViewModel by viewModels {
        ViewModelFactory.getInstance(applicationContext)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityCreatedTestBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Observasi loading state
        createdTestViewModel.isLoading.observe(this) {
            showLoading(it)
        }

        // Ambil test yang dibuat dari intent
        val testCreated: CreateTestResponse? = intent.getParcelableExtra("TEST_OBJECT")

        if (testCreated != null && testCreated.test?.id != null) {
            val testId = testCreated.test.id
            createdTestViewModel.getTestById(testId)
        } else {
            Log.e("CreatedTestActivity", "Test data is null")
            Toast.makeText(this, "Gagal memuat data tes", Toast.LENGTH_SHORT).show()
        }

        observeTestResponse()
        observeAcceptResponse()
    }

    private fun observeTestDetails(test: Test) {
        lifecycleScope.launch {
            withContext(Dispatchers.Main) {
                binding.tvTestTitle.text = test.testTitle
                binding.tvTestMinutes.text = getString(R.string.minutes, test.testDuration ?: 0)
                if (test?.acceptResponses != null) {
                binding.switch1.isChecked = test.acceptResponses }
                else {
                    binding.switch1.isChecked = false
                }

                binding.switch1.setOnCheckedChangeListener { _, isChecked ->
                    // Log status sebelumnya dan status baru
                    Log.d("SwitchListener", "Current state: ${test.acceptResponses}, New state: $isChecked")

                    // Pastikan bahwa statusnya berubah
                    if (isChecked != test.acceptResponses) {
                        // Jika ada perubahan, kirimkan request ke API
                        createdTestViewModel.acceptResponse(test.id, isChecked)
                    }
                }
            }
        }
    }

    fun showLoading(isLoading: Boolean) {
        binding.progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
    }

    private fun observeAcceptResponse() {
        createdTestViewModel.acceptTestResponse.observe(this) { response ->
            if (response != null) {
                Toast.makeText(this@CreatedTestActivity, response, Toast.LENGTH_SHORT).show()
            }
        }

        createdTestViewModel.errorMessage.observe(this) { errorMsg ->
            if (errorMsg != null) {
                Toast.makeText(
                    this@CreatedTestActivity,
                    errorMsg,
                    Toast.LENGTH_SHORT
                ).show()

                // Kembalikan switch ke state sebelumnya jika gagal
                createdTestViewModel.testDetailResponse.value?.let { test ->
                    test.acceptResponses?.let { state ->
                        binding.switch1.isChecked = state
                    }
                }
            }
        }
    }

    private fun observeTestResponse() {
        createdTestViewModel.testDetailResponse.observe(this) { test ->
            if (test != null) {
                observeTestDetails(test)
            } else {
                createdTestViewModel.errorMessage.observe(this) { errorMsg ->
                    Toast.makeText(
                        this@CreatedTestActivity,
                        errorMsg ?: "Gagal memuat data",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
        }
    }
}
