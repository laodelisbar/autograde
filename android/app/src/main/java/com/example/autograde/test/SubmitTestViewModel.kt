package com.example.autograde.test

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.autograde.data.api.response.Answer
import com.example.autograde.data.api.response.JoinTestResponse
import com.example.autograde.data.api.response.ResultsItem
import com.example.autograde.data.api.response.SubmitTestRequest
import com.example.autograde.data.api.response.SubmitTestResponse
import com.example.autograde.data.api.response.TestRequest
import com.example.autograde.data.repository.MainRepository
import com.google.gson.Gson
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class SubmitTestViewModel (private val mainRepository: MainRepository) : ViewModel() {

    private val _submitTestResponse = MutableLiveData<SubmitTestResponse>()
    val submitTestResponse : LiveData<SubmitTestResponse> get() = _submitTestResponse

    private val _resultItemResponse = MutableLiveData<List<ResultsItem>>()
    val resultItemResponse : LiveData<List<ResultsItem>> get() = _resultItemResponse

    private val _errorMessage = MutableLiveData<String>()
    val errorMessage: LiveData<String> get() = _errorMessage

    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> = _isLoading


    fun submitTest(userTestId : String, body : List<SubmitTestRequest>) {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                val response = withContext(Dispatchers.IO) {
                    mainRepository.submitTest(userTestId, body)
                }
                if (response.isSuccessful) {
                    response.body()?.let { body ->
                        body.results?.let { test ->
                            _resultItemResponse.postValue(listOf(ResultsItem()))
                            _submitTestResponse.postValue(body)
                        } ?: run {
                            _submitTestResponse.postValue(body)
                            _errorMessage.postValue("Gagal")
                        }
                    }
                } else {
                    val errorMessage = response.errorBody()?.string()?.let { errorBody ->
                        try {
                            val errorResponse = Gson().fromJson(errorBody, JoinTestResponse::class.java)
                            errorResponse.message
                        } catch (e: Exception) {
                            "Terjadi kesalahan: ${response.message()}"
                        }
                    } ?: "Terjadi kesalahan tak dikenal"
                    _submitTestResponse.postValue(SubmitTestResponse(message = errorMessage)) // Mengirimkan data default
                }
            } catch (e: Exception) {

            } finally {
                _isLoading.value = false
            }
        }
    }
}