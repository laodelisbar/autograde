const db = require('./db');

// Fungsi untuk menjalankan migration
const runMigration = async () => {
  try {
    console.log('Starting database migration...');

    // Membuat tabel `Users`
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        sure_name VARCHAR(255),
        gender ENUM('male', 'female', 'other') NOT NULL
      );
    `);

    // Membuat tabel `Test`
    await db.query(`
      CREATE TABLE IF NOT EXISTS test (
        test_id INT AUTO_INCREMENT PRIMARY KEY,
        creator_id INT,
        test_title VARCHAR(255) NOT NULL,
        test_duration INT NOT NULL,
        FOREIGN KEY (creator_id) REFERENCES users(user_id)
      );
    `);

    // Membuat tabel `Questions`
    await db.query(`
      CREATE TABLE IF NOT EXISTS questions (
        question_id INT AUTO_INCREMENT PRIMARY KEY,
        test_id INT NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        FOREIGN KEY (test_id) REFERENCES test(test_id)
      );
    `);

    // Membuat tabel `User_tests`
    await db.query(`
      CREATE TABLE IF NOT EXISTS user_tests (
        user_test_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        test_id INT NOT NULL,
        username VARCHAR(255) NOT NULL,
        time_left INT,
        total_grade INT,
        test_date DATE,
        FOREIGN KEY (user_id) REFERENCES users(user_id),
        FOREIGN KEY (test_id) REFERENCES test(test_id)
      );
    `);

    // Membuat tabel `Answers`
    await db.query(`
      CREATE TABLE IF NOT EXISTS answers (
        answer_id INT AUTO_INCREMENT PRIMARY KEY,
        user_test_id INT NOT NULL,
        question_id INT NOT NULL,
        answer TEXT NOT NULL,
        grade INT,
        FOREIGN KEY (user_test_id) REFERENCES user_tests(user_test_id),
        FOREIGN KEY (question_id) REFERENCES questions(question_id)
      );
    `);

    console.log('Database migration completed successfully.');
  } catch (err) {
    console.error('Error during database migration:', err.message);
  } finally {
    db.end(); // Tutup koneksi database
  }
};

// Jalankan migration
runMigration();