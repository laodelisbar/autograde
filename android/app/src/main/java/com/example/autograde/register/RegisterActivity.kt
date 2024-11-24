package com.example.autograde.register

import android.animation.ObjectAnimator
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import com.example.autograde.databinding.ActivityRegisterBinding
import com.example.autograde.login.LoginActivity
import com.example.intermediatesubmission1.data.pref.UserPreference
import com.example.intermediatesubmission1.data.pref.dataStore
import com.example.intermediatesubmission1.viewmodel.RegisterViewModel
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking

class RegisterActivity : AppCompatActivity() {

    private lateinit var binding: ActivityRegisterBinding
    private lateinit var registerViewModel: RegisterViewModel
    // TODO: Inisialisasi ViewModel dan Instance Factory


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityRegisterBinding.inflate(layoutInflater)
        setContentView(binding.root)

        playAnimation()

        binding.registerButton.setOnClickListener {
            binding.registerButton.isEnabled = false
            val name = binding.edRegisterName.text.toString()
            val email = binding.edRegisterEmail.text.toString()
            val password = binding.edRegisterPassword.text.toString()

            if (name.isNotBlank() && email.isNotBlank() && password.isNotBlank()) {
                registerViewModel.registerUser(name, email, password)
            } else {
                binding.registerButton.isEnabled = true
                Toast.makeText(this, "Semua kolom harus diisi", Toast.LENGTH_SHORT).show()
            }
        }

        observeViewModel()

        binding.textView1.setOnClickListener {
            intent = Intent(this@RegisterActivity, LoginActivity::class.java)
            startActivity(intent)
        }
    }

    private fun observeViewModel() {
        registerViewModel.registerResponse.observe(this) { response ->
            binding.registerButton.isEnabled = true

            if (response.error == true) {
                showError(response.message)
            } else {
                showSuccess(response.message)
            }
        }

        registerViewModel.errorMessage.observe(this) { errorMessage ->
            binding.registerButton.isEnabled = true
            showError(errorMessage)
        }
    }

    private fun showError(message: String?) {
        AlertDialog.Builder(this)
            .setMessage(message ?: "Terjadi kesalahan")
            .setPositiveButton("OK") { _, _ -> }
            .show()
    }

    private fun showSuccess(message: String?) {
        Toast.makeText(this, "Registrasi berhasil: ${message ?: ""}", Toast.LENGTH_SHORT).show()
        startActivity(Intent(this, LoginActivity::class.java))
        finish()
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