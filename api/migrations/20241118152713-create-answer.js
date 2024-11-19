// migrations/20231118000000-create-answer.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Answers', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      user_test_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'User_tests', // Nama tabel yang direferensikan (User_tests)
          key: 'user_test_id', // Kolom yang mengacu
        },
        onDelete: 'CASCADE', // Hapus jawaban jika user_test dihapus
      },
      question_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Questions', // Nama tabel yang direferensikan (Questions)
          key: 'id', // Kolom yang mengacu
        },
        onDelete: 'CASCADE', // Hapus jawaban jika pertanyaan dihapus
      },
      answer: {
        type: Sequelize.TEXT, // Tipe data TEXT untuk jawaban
        allowNull: false,
      },
      grade: {
        type: Sequelize.FLOAT, // Tipe data FLOAT untuk grade
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
    await queryInterface.dropTable('Answers');
  },
};