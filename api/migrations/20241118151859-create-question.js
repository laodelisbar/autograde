// migrations/20231118000000-create-question.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Questions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      test_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Tests', // Nama tabel yang direferensikan (Tests)
          key: 'id', // Kolom yang mengacu
        },
        onDelete: 'CASCADE', // Menghapus pertanyaan jika test dihapus
      },
      question_text: {
        type: Sequelize.TEXT, // Menggunakan tipe data TEXT
        allowNull: false,
      },
      answer_text: {
        type: Sequelize.TEXT, // Menggunakan tipe data TEXT
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
    await queryInterface.dropTable('Questions');
  },
};