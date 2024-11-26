'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,  // Menetapkan default UUID
        allowNull: false,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      googleId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      googleToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,  // Default value bisa ditambahkan jika perlu
      },
      refreshToken: {
        type: DataTypes.STRING,
      },
      profilePictureUrl: {
        type: DataTypes.STRING,
      },
      profilePictureCloudId: {
        type: DataTypes.STRING,
      },
    });
    User.associate = (models) => {
      User.hasMany(models.Test, {
        foreignKey: 'creatorId',
        as: 'tests',
      });
      User.hasMany(models.UserTests, {
        foreignKey: 'userId',
        as: 'userTests',
      });
    };
  return User;
};