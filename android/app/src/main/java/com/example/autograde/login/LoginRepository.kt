package com.example.intermediatesubmission1.view.login

import com.example.intermediatesubmission1.data.api.response.LoginResponse
import com.example.intermediatesubmission1.data.api.retrofit.ApiService
import com.example.intermediatesubmission1.data.pref.UserModel
import com.example.intermediatesubmission1.data.pref.UserPreference
import kotlinx.coroutines.flow.Flow

class LoginRepository (private val apiService : ApiService, private val userPreference: UserPreference) {

    suspend fun loginUser(email: String, password: String): LoginResponse {
        return apiService.login(email, password)
    }
    suspend fun saveSession(user: UserModel) {
        userPreference.saveSession(user)
    }

    fun getSession(): Flow<UserModel> {
        return userPreference.getSession()
    }

    suspend fun logout() {
        userPreference.logout()
    }

    companion object {
        @Volatile
        private var instance: LoginRepository? = null
        fun getInstance(
            userPreference: UserPreference,
            apiService: ApiService
        ): LoginRepository =
            instance ?: synchronized(this) {
                instance ?: LoginRepository(apiService, userPreference)
            }.also { instance = it }
    }
}