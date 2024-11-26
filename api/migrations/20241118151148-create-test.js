// migrations/20231118000000-create-test.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Tests', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        get() {
          const rawValue = this.getDataValue('id');
          return rawValue ? rawValue.toString().padStart(6, '0') : null;
        }
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