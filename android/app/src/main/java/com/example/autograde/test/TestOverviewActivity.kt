package com.example.autograde.test

import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.example.autograde.R
import com.example.autograde.data.api.response.Test
import com.example.autograde.databinding.SecondTestOverviewBinding
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext


class TestOverviewActivity : AppCompatActivity() {

    private lateinit var binding : SecondTestOverviewBinding


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = SecondTestOverviewBinding.inflate(layoutInflater)
        setContentView(binding.root)

      val testOverview : Test? = intent.getParcelableExtra("TEST_OBJECT")

        if (testOverview != null) {
            observeTestDetails(testOverview)
        }
    }


    private fun observeTestDetails(testOverview: Test) {
        showLoading(true)
        lifecycleScope.launch {
            withContext(Dispatchers.IO) {
                delay(500)
            }

            withContext(Dispatchers.Main) {
                binding.tvTestTitle.text = testOverview.testTitle
                binding.textMinutes.text = getString(R.string.minutes, testOverview.testDuration ?: 0)
                binding.textNumber.text = getString(R.string.number, testOverview.questionCount ?: 0)
                binding.testUsers.text = getString(R.string.users, testOverview.userTestCount ?: 0)
                showLoading(false)
            }
        }
    }


    private fun showLoading(isLoading : Boolean) {
        binding.progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
    }
}