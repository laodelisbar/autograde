'use strict';
const {
  Model
} = require('sequelize');
// models/question.js
module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define('Question', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    testId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Tests', // Mengacu pada tabel Tests
        key: 'id', // Kolom yang mengacu
      },
      onDelete: 'CASCADE', // Hapus pertanyaan jika test dihapus
    },
    questionText: {
      type: DataTypes.TEXT, // Menggunakan tipe data TEXT
      allowNull: false,
    },
    answerText: {
      type: DataTypes.TEXT, // Menggunakan tipe data TEXT
      allowNull: false,
    },
  });

  // Relasi dengan Test
  Question.associate = (models) => {
    Question.belongsTo(models.Test, {
      foreignKey: 'testId',
      as: 'test',
    });
  };
  return Question;
};