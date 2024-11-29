package com.example.autograde.data.api.retrofit

import com.example.autograde.data.api.response.JoinTestResponse
import com.example.autograde.data.api.response.LoginResponse
import com.example.autograde.data.api.response.RegisterRequest
import com.example.autograde.data.api.response.RegisterResponse
import com.example.autograde.data.api.response.User
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path


interface ApiService {

    @POST("/api/register")
    suspend fun register(
        @Body user: RegisterRequest
    ): Response<RegisterResponse>


    @POST("/api/login")
    suspend fun login(
        @Body  user : User
    ): Response<LoginResponse>

    @GET("api/tests/{testId}")
    suspend fun getTestById(
        @Path("testId") testId: String
    ): Response<JoinTestResponse>
}

