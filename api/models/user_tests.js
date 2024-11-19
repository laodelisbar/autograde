'use strict';
const {
  Model
} = require('sequelize');
// models/user_tests.js
module.exports = (sequelize, DataTypes) => {
  const User_tests = sequelize.define('User_tests', {
    user_test_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    test_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Tests', // Mengacu pada tabel Tests
        key: 'id', // Kolom yang mengacu
      },
      onDelete: 'CASCADE', // Hapus user_test jika test dihapus
    },
    time_left: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_grade: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    test_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  // Relasi dengan User dan Test
  User_tests.associate = (models) => {
    User_tests.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
    User_tests.belongsTo(models.Test, {
      foreignKey: 'test_id',
      as: 'test',
    });
  };

  return User_tests;
};