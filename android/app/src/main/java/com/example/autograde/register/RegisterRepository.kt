package com.example.intermediatesubmission1.view.register

import com.example.intermediatesubmission1.data.api.response.RegisterResponse
import com.example.intermediatesubmission1.data.api.retrofit.ApiService

class RegisterRepository (private val apiService: ApiService) {

    suspend fun registerUser(name: String, email: String, password: String): RegisterResponse {
        return apiService.register(name, email, password)
    }

}