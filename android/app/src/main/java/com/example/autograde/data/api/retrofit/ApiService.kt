package com.example.autograde.data.api.retrofit

import com.example.autograde.data.api.response.LoginResponse
import com.example.autograde.data.api.response.RegisterRequest
import com.example.autograde.data.api.response.RegisterResponse
import com.example.autograde.data.api.response.User
import retrofit2.http.Body
import retrofit2.http.POST


interface ApiService {

    @POST("/api/register")
    suspend fun register(
        @Body user: RegisterRequest
    ): RegisterResponse


    @POST("/api/login")
    suspend fun login(
        @Body  user : User
    ): LoginResponse

}
