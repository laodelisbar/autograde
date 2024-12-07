package com.example.autograde.data.api.retrofit


import com.example.autograde.data.api.response.AcceptResponse
import com.example.autograde.data.api.response.AcceptResponseRequest
import com.example.autograde.data.api.response.CreateTestRequest
import com.example.autograde.data.api.response.CreateTestResponse
import com.example.autograde.data.api.response.JoinTestResponse
import com.example.autograde.data.api.response.LoginResponse
import com.example.autograde.data.api.response.ProfileResponse
import com.example.autograde.data.api.response.RegisterRequest
import com.example.autograde.data.api.response.RegisterResponse
import com.example.autograde.data.api.response.StartTestResponse
import com.example.autograde.data.api.response.SubmitTestRequest
import com.example.autograde.data.api.response.SubmitTestResponse
import com.example.autograde.data.api.response.TestRequest
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

    @POST("api/tests/start")
    suspend fun startTestById(
        @Body  requestBody : TestRequest
    ): Response<StartTestResponse>

    @POST("/api/tests/submit")
    suspend fun submitTestAnswers(
        @Body request: SubmitTestRequest
    ): Response<SubmitTestResponse>

    @GET("/api/users/profile")
    suspend fun getProfile (): Response<ProfileResponse>

    @POST("/api/tests/store")
    suspend fun storeTest(
        @Body  requestBody : CreateTestRequest
    ): Response<CreateTestResponse>

    @POST("/api/tests/accept-responses")
    suspend fun acceptResponse(
        @Body  acceptResponse : AcceptResponseRequest
    ): Response<AcceptResponse>

}

