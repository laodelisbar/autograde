package com.example.autograde.data.local.room

import androidx.room.Database
import androidx.room.RoomDatabase
import com.example.autograde.data.local.entity.UserAnswer


@Database(entities = [UserAnswer::class], version = 1)
abstract class UserAnswerDatabase : RoomDatabase() {
    abstract fun userAnswerDao(): UserAnswerDao
}
