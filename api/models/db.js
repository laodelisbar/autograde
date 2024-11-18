const mysql = require('mysql2');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '123456789',
  database: 'test_management', // Nama database
};

// Buat koneksi awal tanpa menentukan database
const connection = mysql.createConnection({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
});

// Buat database jika belum ada
connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`, (err) => {
  if (err) {
    console.error('Error creating database:', err.message);
    process.exit(1); // Keluar jika gagal membuat database
  }
  console.log(`Database '${dbConfig.database}' ensured.`);
});

// Setelah memastikan database ada, buat pool koneksi
const pool = mysql.createPool(dbConfig);

module.exports = pool.promise();