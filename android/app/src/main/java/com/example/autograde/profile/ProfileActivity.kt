package com.example.autograde.profile

import android.app.Dialog
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.bumptech.glide.Glide
import com.bumptech.glide.Glide.init
import com.bumptech.glide.request.RequestOptions
import com.example.autograde.R
import com.example.autograde.data.di.ViewModelFactory
import com.example.autograde.databinding.ActivityConfirmationBinding
import com.example.autograde.databinding.ProfileBinding
import com.example.autograde.login.LoginViewModel
import kotlinx.coroutines.launch


class ProfileActivity : AppCompatActivity() {

    private val profileViewModel: ProfileViewModel by viewModels {
        ViewModelFactory.getInstance(applicationContext)
    }

    private val loginViewModel: LoginViewModel by viewModels {
        ViewModelFactory.getInstance(applicationContext)
    }

    private lateinit var dialogBinding: ActivityConfirmationBinding

    private var customDialog: Dialog? = null

    private lateinit var binding: ProfileBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ProfileBinding.inflate(layoutInflater)
        setContentView(binding.root)

        observeProfileResponse()

        binding.btnBack.setOnClickListener {
            onBackPressedDispatcher.onBackPressed()
        }
        binding.btnLogout.setOnClickListener {
            showLogoutConfirmation(this)
        }


    }


    private fun observeProfileResponse() {
        profileViewModel.getProfile()
        profileViewModel.profileResponse.observe(this) { profile ->
            if (profile !== null) {
                binding.tvEmail.text = profile.email
                binding.tvUsername.text = profile.username

                if (profile.profilePictureUrl != null) {
                    Glide.with(this)
                        .load(profile.profilePictureUrl)
                        .apply(RequestOptions.circleCropTransform())
                        .into(binding.imgViewProfile)
                } else {
                    Glide.with(this)
                        .load(R.drawable.default_profile)
                        .apply(RequestOptions.circleCropTransform())
                        .into(binding.imgViewProfile)
                }

            } else {
                Toast.makeText(this@ProfileActivity, "terjadi kesalahan ", Toast.LENGTH_SHORT)
                    .show()
            }
        }

    }

    fun showLogoutConfirmation(activity: AppCompatActivity) {
        val dialog = Dialog(activity)
        dialogBinding = ActivityConfirmationBinding.inflate(layoutInflater)
        val view: View = dialogBinding.root
        dialog.setContentView(view)

        dialog.window?.setBackgroundDrawableResource(android.R.color.transparent)

        dialogBinding.tvConfirmation.text = activity.getString(R.string.logout_confirmation)
        dialogBinding.btnContinue.text = activity.getString(R.string.logout)
        dialogBinding.btnBack.text = activity.getString(R.string.cancel)

        dialogBinding.btnContinue.setOnClickListener {
            loginViewModel.logout()
            finish()
        }

        dialogBinding.btnBack.setOnClickListener {
            dialog.dismiss()
        }

        this.customDialog = dialog // Menyimpan referensi dialog
        dialog.show()
    }



}