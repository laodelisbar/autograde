// seeders/20231118000000-demo-test.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Tests', [{
      creator_id: 'some-uuid-from-users-table', // Ganti dengan UUID yang valid dari tabel Users
      test_title: 'Math Test',
      test_duration: 60, // Durasi dalam menit
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tests', null, {});
  }
};