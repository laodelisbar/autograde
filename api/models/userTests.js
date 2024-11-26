'use strict';
const {
  Model
} = require('sequelize');
// models/userTests.js
module.exports = (sequelize, DataTypes) => {
  const UserTests = sequelize.define('UserTests', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
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
    testId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Test', // Mengacu pada tabel Tests
        key: 'id', // Kolom yang mengacu
      },
      onDelete: 'CASCADE',
    },
    timeLeft: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalGrade: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    testDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  UserTests.associate = (models) => {
    UserTests.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    UserTests.belongsTo(models.Test, {
      foreignKey: 'testId',
      as: 'test',
    });
    UserTests.hasMany(models.Answer, {
      foreignKey: 'userTestId',
      as: 'answers',
    });
  };

  return UserTests;
};