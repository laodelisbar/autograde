package com.example.autograde.register

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.autograde.data.api.response.RegisterRequest
import com.example.autograde.data.api.response.RegisterResponse
import com.example.autograde.data.repository.MainRepository
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class RegisterViewModel(private val mainRepository: MainRepository) : ViewModel() {


    private val _registerResponse = MutableLiveData<RegisterResponse>()
    val registerResponse: LiveData<RegisterResponse> get() = _registerResponse

    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> = _isLoading

    private val _errorMessage = MutableLiveData<String>()
    val errorMessage: LiveData<String> get() = _errorMessage


    fun registerUser(registerRequest: RegisterRequest) {
        viewModelScope.launch {
            try {

                _isLoading.value = true
                val response = withContext(Dispatchers.IO) {
                    mainRepository.registerUser(registerRequest)
                }
                if (response.message !== null ) {
                    _isLoading.value = false
                    _registerResponse.postValue(response)
                } else {
                    _isLoading.value = false
                    _errorMessage.postValue("Gagal registrasi")
                }
            } catch (e: Exception) {
                _isLoading.value = false
                _errorMessage.postValue(e.message ?: "Terjadi kesalahan")
            }
        }
    }
}
