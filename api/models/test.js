'use strict';
const {
  Model
} = require('sequelize');
// models/test.js
module.exports = (sequelize, DataTypes) => {
  const Test = sequelize.define('Test', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
      get() {
        const rawValue = this.getDataValue('id');
        return rawValue ? rawValue.toString().padStart(6, '0') : null;
      }
    },
    creatorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users', // Mengacu pada tabel Users
        key: 'id', // Kolom yang mengacu
      },
      onDelete: 'CASCADE', // Hapus test jika user dihapus
    },
    testTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    testDuration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    acceptResponses : {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });

  // Relasi dengan User
  Test.associate = (models) => {
    Test.belongsTo(models.User, {
      foreignKey: 'creatorId',
      as: 'creator',
    });
    Test.hasMany(models.Question, {
      foreignKey: 'testId',
      as: 'questions',
    });
    Test.hasMany(models.UserTests, {
      foreignKey: 'testId',
      as: 'userTests',
    });
    
  };
  return Test;
};