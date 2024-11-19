// migrations/20231118000000-create-user_tests.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('User_tests', {
      user_test_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      username: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      test_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Tests',
          key: 'id',
        },
        onDelete: 'CASCADE'
      },
      time_left: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      total_grade: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      test_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('User_tests');
  },
};