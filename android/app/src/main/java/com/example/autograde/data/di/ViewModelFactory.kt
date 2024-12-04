package com.example.autograde.data.di

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.example.autograde.data.repository.MainRepository
import com.example.autograde.data.pref.UserPreference
import com.example.autograde.data.pref.dataStore
import com.example.autograde.home.HomeViewModel
import com.example.autograde.login.LoginViewModel
import com.example.autograde.register.RegisterViewModel
import com.example.autograde.test.SubmitTestViewModel
import com.example.autograde.test.TestViewModel


class ViewModelFactory (private val mainRespository: MainRepository, userPreference: UserPreference) : ViewModelProvider.NewInstanceFactory() {

    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(RegisterViewModel::class.java)) {
            return RegisterViewModel(mainRespository) as T
        }
        if (modelClass.isAssignableFrom(LoginViewModel::class.java)) {
            return LoginViewModel(mainRespository) as T
        }
        if (modelClass.isAssignableFrom(HomeViewModel::class.java)) {
            return HomeViewModel(mainRespository) as T
        }
        if (modelClass.isAssignableFrom(TestViewModel::class.java)) {
            return TestViewModel(mainRespository) as T
        }
        if (modelClass.isAssignableFrom(SubmitTestViewModel::class.java)) {
            return SubmitTestViewModel(mainRespository) as T
        }

        throw IllegalArgumentException("Unknown ViewModel class: " + modelClass.name)
    }

    companion object {
        @Volatile
        private var instance: ViewModelFactory? = null

        fun getInstance(context: Context): ViewModelFactory =
            instance ?: synchronized(this) {
                val mainRepository = Injection.provideRepository(context)
                val userPreference = UserPreference.getInstance(context.dataStore)
                instance ?: ViewModelFactory(mainRepository, userPreference)
            }.also { instance = it }
    }
}