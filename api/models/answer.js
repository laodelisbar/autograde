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
    user_test_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'User_tests', // Mengacu pada tabel User_tests
        key: 'user_test_id', // Kolom yang mengacu
      },
      onDelete: 'CASCADE', // Hapus jawaban jika user_test dihapus
    },
    question_id: {
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
    Answer.belongsTo(models.User_tests, {
      foreignKey: 'user_test_id',
      as: 'user_test',
    });
    Answer.belongsTo(models.Question, {
      foreignKey: 'question_id',
      as: 'question',
    });
  };

  return Answer;
};