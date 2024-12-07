package com.example.autograde.profile

import android.os.Bundle
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import com.example.autograde.data.di.ViewModelFactory
import com.example.autograde.databinding.ProfileBinding


class ProfileActivity : AppCompatActivity() {

    private val profileViewModel: ProfileViewModel by viewModels {
        ViewModelFactory.getInstance(applicationContext)
    }
    private lateinit var binding: ProfileBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ProfileBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupFragment()
        observeProfileResponse()

    }

    private fun setupFragment() {
        supportFragmentManager.beginTransaction()
            .replace(binding.fragmentContainer.id, ProfileFragment())
            .commit()
    }

    private fun observeProfileResponse() {
        profileViewModel.profileResponse.observe(this) { profile ->
            if (profile !== null) {
                binding.tvEmail.text = profile.email

            } else {
                Toast.makeText(this@ProfileActivity, "terjadi kesalahan ", Toast.LENGTH_SHORT)
                    .show()
            }
        }

    }

}