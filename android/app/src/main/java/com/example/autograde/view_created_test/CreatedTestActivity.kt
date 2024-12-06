package com.example.autograde.view_created_test

import android.os.Bundle
import android.util.Log
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.example.autograde.R
import com.example.autograde.data.api.response.CreateTestResponse
import com.example.autograde.data.api.response.CreatedTest
import com.example.autograde.databinding.ActivityCreatedTestBinding
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class CreatedTestActivity : AppCompatActivity() {

    private lateinit var binding : ActivityCreatedTestBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityCreatedTestBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val testCreated: CreateTestResponse? = intent.getParcelableExtra("TEST_OBJECT")

        if (testCreated != null && testCreated.test != null) {
            val test = testCreated.test
            observeTestDetails(test) // Aman karena null sudah ditangani
        } else {
            Log.e("CreatedTestActivity", "Test data is null")
        }

    }


    private fun observeTestDetails(testCreated: CreatedTest) {
        showLoading(true)
        lifecycleScope.launch {
            withContext(Dispatchers.IO) {
                delay(500)
            }
            withContext(Dispatchers.Main) {
                binding.tvTestTitle.text = testCreated.testTitle
                binding.tvTestMinutes.text = getString(R.string.minutes, testCreated.testDuration ?: 0)
            }
        }
        showLoading(false)
    }

    fun showLoading(isLoading: Boolean) {
        binding.progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
    }

}