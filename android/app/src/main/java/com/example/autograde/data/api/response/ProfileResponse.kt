package com.example.autograde.data.api.response

import com.google.gson.annotations.SerializedName

data class ProfileResponse(

	@field:SerializedName("googleId")
	val googleId: Any? = null,

	@field:SerializedName("profilePictureUrl")
	val profilePictureUrl: Any? = null,

	@field:SerializedName("createdAt")
	val createdAt: String? = null,

	@field:SerializedName("password")
	val password: String? = null,

	@field:SerializedName("isVerified")
	val isVerified: Boolean? = null,

	@field:SerializedName("id")
	val id: String? = null,

	@field:SerializedName("email")
	val email: String? = null,

	@field:SerializedName("profilePictureCloudId")
	val profilePictureCloudId: Any? = null,

	@field:SerializedName("username")
	val username: String? = null,

	@field:SerializedName("googleToken")
	val googleToken: Any? = null,

	@field:SerializedName("refreshToken")
	val refreshToken: Any? = null,

	@field:SerializedName("updatedAt")
	val updatedAt: String? = null
)
