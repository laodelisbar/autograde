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
    test_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Tests', // Mengacu pada tabel Tests
        key: 'id', // Kolom yang mengacu
      },
      onDelete: 'CASCADE', // Hapus pertanyaan jika test dihapus
    },
    question_text: {
      type: DataTypes.TEXT, // Menggunakan tipe data TEXT
      allowNull: false,
    },
    answer_text: {
      type: DataTypes.TEXT, // Menggunakan tipe data TEXT
      allowNull: false,
    },
  });

  // Relasi dengan Test
  Question.associate = (models) => {
    Question.belongsTo(models.Test, {
      foreignKey: 'test_id',
      as: 'test',
    });
  };

  return Question;
};