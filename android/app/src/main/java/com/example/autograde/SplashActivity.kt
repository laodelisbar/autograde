package com.example.autograde

import android.content.Intent
import android.os.Bundle
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.example.autograde.home.HomeActivity
import com.example.autograde.home.HomeForGuestActivity
import com.google.android.material.button.MaterialButton

class SplashActivity : AppCompatActivity() {

    private var currentStep = 1

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.splash_fragment)

        val ivPlaceholder = findViewById<ImageView>(R.id.ivPlaceholder)
        val tvInformation = findViewById<TextView>(R.id.tv_information)
        val btnNext = findViewById<MaterialButton>(R.id.btn_next)
        val btnSkip = findViewById<MaterialButton>(R.id.btn_skip)

        btnSkip.setOnClickListener {
            navigateToHome()
        }

        btnNext.setOnClickListener {
            if (currentStep ==1) {
                ivPlaceholder.setImageResource(R.drawable.img_slide_one)
                tvInformation.text = "-------Information 2-------"
                currentStep++
            } else {
                navigateToHome()
            }
        }
    }

    private fun navigateToHome() {
        val intent = Intent(this,HomeForGuestActivity::class.java)
        startActivity(intent)
        finish()
    }
}