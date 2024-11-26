package com.example.autograde.login

import android.animation.ObjectAnimator
import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.example.autograde.MainActivity
import com.example.autograde.R
import com.example.autograde.databinding.ActivityLoginBinding
import com.example.autograde.register.RegisterActivity
import com.example.intermediatesubmission1.data.api.retrofit.ApiConfig
import com.example.intermediatesubmission1.data.pref.UserPreference
import com.example.intermediatesubmission1.data.pref.dataStore
import com.example.intermediatesubmission1.view.login.LoginRepository
import com.example.intermediatesubmission1.view.login.LoginViewModel
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking

class LoginActivity : AppCompatActivity() {

    private lateinit var binding: ActivityLoginBinding

    private lateinit var loginViewModel: LoginViewModel
// TODO: Inisialisasi sebagai instance ViewModel dan Instance ke Factory



    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        playAnimation()

        loginViewModel.loginResponse.observe(this, { response ->
            startActivity(Intent(this, MainActivity::class.java))
            finish()
        })

        loginViewModel.errorMessage.observe(this, { error ->
            binding.emailEditText.error = error
        })

        binding.loginButton.setOnClickListener {
            val email = binding.emailEditText.text.toString()
            val password = binding.edLoginPassword.text.toString()

            // Validasi input
            if (email.isNotEmpty() && password.isNotEmpty()) {
                loginViewModel.loginUser(email, password)
            } else {
                binding.emailEditText.error = "Email dan password tidak boleh kosong"
            }
        }

        binding.textView1.setOnClickListener {
            intent = Intent(this@LoginActivity, RegisterActivity::class.java)
            startActivity(intent)
        }
    }

    fun getToken(): String {
        val user = UserPreference.getInstance(applicationContext.dataStore)
        val token = runBlocking { user.getSession().first()?.token }
        return token ?: ""
    }

    private fun playAnimation() {
        ObjectAnimator.ofFloat(binding.tvTitle, View.ALPHA, 1f).setDuration(1000).apply {
            startDelay = 100
            start()
        }
    }

}