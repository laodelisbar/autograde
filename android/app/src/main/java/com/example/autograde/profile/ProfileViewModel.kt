package com.example.autograde.profile

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.autograde.data.api.response.ProfileResponse
import com.example.autograde.data.repository.MainRepository
import com.google.gson.Gson
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class ProfileViewModel(private val mainRepository: MainRepository) : ViewModel() {

    private val _profileResponse = MutableLiveData<ProfileResponse>()
    val profileResponse: LiveData<ProfileResponse> get() = _profileResponse

    private val _errorMessage = MutableLiveData<String>()
    val errorMessage: LiveData<String> get() = _errorMessage

    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> = _isLoading

    init {
        getProfile()
    }

    fun getProfile() {
        viewModelScope.launch {
            try {
                _isLoading.value = true
                val response = withContext(Dispatchers.IO) {
                    mainRepository.getProfile()
                }

                if (response.isSuccessful) {
                    response.body()?.let { body ->
                        _profileResponse.postValue(body)
                    } ?: run {
                        _errorMessage.postValue("Respons dari server kosong")
                    }
                } else {
                    val errorBody = response.errorBody()?.string()
                    _errorMessage.postValue(
                        errorBody ?: "Terjadi kesalahan tak dikenal"
                    )
                }
            } catch (e: Exception) {
                _errorMessage.postValue(e.message ?: "Terjadi kesalahan")
            } finally {
                _isLoading.value = false
            }
        }
    }
}