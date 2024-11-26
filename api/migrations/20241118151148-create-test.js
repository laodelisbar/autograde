// migrations/20231118000000-create-test.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Tests', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      creatorId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users', // Nama tabel yang direferensikan (Users)
          key: 'id', // Kolom yang mengacu
        },
        onDelete: 'CASCADE', // Menghapus test jika pengguna dihapus
      },
      acceptResponses : {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      testTitle: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      testDuration: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('Tests');
  },
};