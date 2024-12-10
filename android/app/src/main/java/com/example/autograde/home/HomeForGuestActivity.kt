package com.example.autograde.home

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import com.example.autograde.data.di.ViewModelFactory
import com.example.autograde.databinding.ActivityHomeForGuestBinding
import com.example.autograde.login.LoginActivity
import com.example.autograde.login.LoginViewModel
import com.example.autograde.test.TestOverviewForGuestActivity

class HomeForGuestActivity : AppCompatActivity() {

    private lateinit var binding : ActivityHomeForGuestBinding

    private val loginViewModel: LoginViewModel by viewModels {
        ViewModelFactory.getInstance(applicationContext)
    }

    private val homeViewModel: HomeViewModel by viewModels {
        ViewModelFactory.getInstance(applicationContext)
    }


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityHomeForGuestBinding.inflate(layoutInflater)
        setContentView(binding.root)

        observeLogin()


        homeViewModel.isLoading.observe(this) {
            showLoading(it)
        }

        binding.joinButton.setOnClickListener {
            val testCode = binding.edInputCode.text.toString()
            if (testCode.isEmpty()) {
                binding.edInputCode.error = "Kode tidak boleh kosong"
                return@setOnClickListener
            }
            homeViewModel.getTestById(testCode)
        }

        binding.btnLogin.setOnClickListener {
            intent = Intent(this@HomeForGuestActivity, LoginActivity::class.java)
            startActivity(intent)
        }

        binding.qrButton.setOnClickListener {
            val intent = Intent(this, ScanQRActivity::class.java)
            startActivityForResult(intent, 1001)
        }

        observeJoinTestResponse()
        observeTestResponse()
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == 1001 && resultCode == RESULT_OK) {
            val result = data?.getStringExtra("QR_RESULT")
            homeViewModel.getTestById(result?: "0")
        }
    }


    private fun observeTestResponse() {
        homeViewModel.testResponse.observe(this) { testList ->
            if (testList != null && testList.isNotEmpty()) {
                val test = testList[0]
                val intent = Intent(this@HomeForGuestActivity, TestOverviewForGuestActivity::class.java).apply {
                    putExtra("TEST_OBJECT", test)  // Pass the test object to the next activity
                }
                startActivity(intent)
            } else {
                binding.edInputCode.error = "Kode Test Tidak ditemukkan"
            }
        }
    }

    private fun observeLogin() {
        loginViewModel.getSession().observe(this) { user ->
            if (user.isLogin) {
                startActivity(Intent(this, HomeActivity::class.java))
                finish()
            } else {

            }
        }
    }

    private fun observeJoinTestResponse() {
        homeViewModel.joinTestResponse.observe(this) { response ->
            response.message?.let {
                Toast.makeText(this, it, Toast.LENGTH_SHORT).show()
            }
        }
        homeViewModel.errorMessage.observe(this) { errorMessage ->
            errorMessage?.let {
                Toast.makeText(this, it, Toast.LENGTH_SHORT).show()
            }
        }

    }

    private fun showLoading(isLoading: Boolean) {
        binding.progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
    }

}