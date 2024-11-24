package com.example.intermediatesubmission1.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.intermediatesubmission1.data.api.response.RegisterResponse
import com.example.intermediatesubmission1.view.register.RegisterRepository
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class RegisterViewModel(private val registerRepository: RegisterRepository) : ViewModel() {

    private val _registerResponse = MutableLiveData<RegisterResponse>()
    val registerResponse: LiveData<RegisterResponse> get() = _registerResponse

    private val _errorMessage = MutableLiveData<String>()
    val errorMessage: LiveData<String> get() = _errorMessage

    fun registerUser(name: String, email: String, password: String) {
        viewModelScope.launch {
            try {
                val response = withContext(Dispatchers.IO) {
                    registerRepository.registerUser(name, email, password)
                }
                if (response.error == true) {
                    _errorMessage.postValue(response.message)
                } else {
                    _registerResponse.postValue(response)
                }
            } catch (e: Exception) {
                _errorMessage.postValue(e.message ?: "Terjadi kesalahan")
            }
        }
    }
}
