'use strict';
const {
  Model
} = require('sequelize');
// models/answer.js
module.exports = (sequelize, DataTypes) => {
  const Answer = sequelize.define('Answer', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userTestId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'UserTests', // Mengacu pada tabel User_tests
        key: 'userTestId', // Kolom yang mengacu
      },
      onDelete: 'CASCADE', // Hapus jawaban jika user_test dihapus
    },
    questionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Questions', // Mengacu pada tabel Questions
        key: 'id', // Kolom yang mengacu
      },
      onDelete: 'CASCADE', // Hapus jawaban jika pertanyaan dihapus
    },
    answer: {
      type: DataTypes.TEXT, // Menyimpan jawaban dalam bentuk teks panjang
      allowNull: true,
    },
    grade: {
      type: DataTypes.FLOAT, // Nilai grade sebagai float
      allowNull: false,
    },
  });

  // Relasi dengan User_tests dan Question
  Answer.associate = (models) => {
    Answer.belongsTo(models.UserTests, {
      foreignKey: 'userTestId',
      as: 'userTest',
    });
    Answer.belongsTo(models.Question, {
      foreignKey: 'questionId',
      as: 'question',
    });
  };

  return Answer;
};