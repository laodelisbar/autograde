package com.example.autograde.data.local.room

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.example.autograde.data.local.entity.UserAnswer

@Dao
interface UserAnswerDao {
    @Query("SELECT * FROM user_answers WHERE questionId = :questionId LIMIT 1")
    suspend fun getAnswerByQuestionId(questionId: String): UserAnswer?

    @Query("SELECT * FROM user_answers WHERE userTestId = :userTestId")
    suspend fun getAllAnswersByUserTestId(userTestId: String): List<UserAnswer>


    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAnswer(answer: UserAnswer)

    @Update
    suspend fun updateAnswer(userAnswer: UserAnswer)

    // Fungsi untuk menghapus jawaban berdasarkan questionId
    @Query("DELETE FROM user_answers WHERE questionId = :questionId")
    suspend fun deleteAnswerByQuestionId(questionId: String)
}
