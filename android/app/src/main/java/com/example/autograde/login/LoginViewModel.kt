package com.example.intermediatesubmission1.view.login

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.asLiveData
import com.example.intermediatesubmission1.data.api.response.LoginResponse
import com.example.intermediatesubmission1.data.pref.UserModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class LoginViewModel (private val loginRepository : LoginRepository) : ViewModel() {


    private val _loginResponse = MutableLiveData<LoginResponse>()
    val loginResponse : LiveData<LoginResponse> get() = _loginResponse

    private val _errorMessage = MutableLiveData<String>()
    val errorMessage: LiveData<String> get() = _errorMessage


    fun loginUser(email: String, password: String) {
        viewModelScope.launch {
            try {
                val response = withContext(Dispatchers.IO) {
                    loginRepository.loginUser(email, password)
                }
                if (response.error == true) {
                    _errorMessage.postValue(response.message)
                } else {

                    response.loginResult?.let { loginResult ->
                        loginRepository.saveSession(
                            UserModel(
                                email = email,
                                token = loginResult.token ?: "",
                                isLogin = true
                            )
                        )
                    }
                    _loginResponse.postValue(response)
                }

                _loginResponse.postValue(response)

            } catch (e: Exception) {
                _errorMessage.postValue(e.message ?: "Terjadi kesalahan")
            }
        }
    }

    fun getSession(): LiveData<UserModel> {
        return loginRepository.getSession().asLiveData()
    }

    fun logout() {
        viewModelScope.launch {
            loginRepository.logout()
        }
    }


}