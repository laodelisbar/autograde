'use strict';
const {
  Model
} = require('sequelize');
// models/test.js
module.exports = (sequelize, DataTypes) => {
  const Test = sequelize.define('Test', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    creator_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users', // Mengacu pada tabel Users
        key: 'id', // Kolom yang mengacu
      },
      onDelete: 'CASCADE', // Hapus test jika user dihapus
    },
    test_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    test_duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    accept_responses : {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });

  // Relasi dengan User
  Test.associate = (models) => {
    Test.belongsTo(models.User, {
      foreignKey: 'creator_id',
      as: 'creator',
    });
    Test.hasMany(models.Question, {
      foreignKey: 'test_id',
      as: 'Questions',
    });
    
  };

  return Test;
};