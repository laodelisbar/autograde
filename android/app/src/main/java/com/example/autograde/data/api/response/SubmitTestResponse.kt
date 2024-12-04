package com.example.autograde.data.api.response

import com.google.gson.annotations.SerializedName

data class SubmitTestResponse(

	@field:SerializedName("totalGrade")
	val totalGrade: Int? = null,

	@field:SerializedName("message")
	val message: String? = null,

	@field:SerializedName("results")
	val results: List<ResultsItem?>? = null,

	@field:SerializedName("testTitle")
	val testTitle: String? = null
)

data class ResultsItem(

	@field:SerializedName("question")
	val question: Question? = null,

	@field:SerializedName("answer")
	val answer: Answer? = null
)

data class Answer(

	@field:SerializedName("userTestId")
	val userTestId: String? = null,

	@field:SerializedName("createdAt")
	val createdAt: String? = null,

	@field:SerializedName("questionId")
	val questionId: String? = null,

	@field:SerializedName("answer")
	val answer: String? = null,

	@field:SerializedName("grade")
	val grade: Int? = null,

	@field:SerializedName("id")
	val id: String? = null,

	@field:SerializedName("updatedAt")
	val updatedAt: String? = null
)

data class Question(

	@field:SerializedName("createdAt")
	val createdAt: String? = null,

	@field:SerializedName("answerText")
	val answerText: String? = null,

	@field:SerializedName("testId")
	val testId: Int? = null,

	@field:SerializedName("id")
	val id: String? = null,

	@field:SerializedName("questionText")
	val questionText: String? = null,

	@field:SerializedName("updatedAt")
	val updatedAt: String? = null
)

data class SubmitTestRequest (
	val questionId: String?,
	val answer: String?
)
