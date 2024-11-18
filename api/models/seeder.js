const db = require('./db'); // Import koneksi database

async function seedDatabase() {
  try {
    // Seed untuk tabel `users`
    await db.query(`
      INSERT INTO users (username, email, password, sure_name, gender)
      VALUES 
        ('john_doe', 'john@example.com', 'password123', 'John Doe', 'male'),
        ('jane_doe', 'jane@example.com', 'password123', 'Jane Doe', 'female'),
        ('alex_smith', 'alex@example.com', 'password123', 'Alex Smith', 'other');
    `);

    console.log('Seeded users table.');

    // Seed untuk tabel `test`
    await db.query(`
      INSERT INTO test (creator_id, test_title, test_duration)
      VALUES 
        (1, 'Mathematics Test', 60),
        (1, 'Science Test', 45),
        (2, 'History Test', 30);
    `);

    console.log('Seeded test table.');

    // Seed untuk tabel `questions`
    await db.query(`
      INSERT INTO questions (test_id, question, answer)
      VALUES 
        (1, 'What is 2 + 2?', '4'),
        (1, 'What is the square root of 16?', '4'),
        (2, 'What is H2O?', 'Water'),
        (2, 'What planet is known as the Red Planet?', 'Mars'),
        (3, 'Who was the first president of the USA?', 'George Washington'),
        (3, 'When did World War II end?', '1945');
    `);

    console.log('Seeded questions table.');

    // Seed untuk tabel `user_tests`
    await db.query(`
      INSERT INTO user_tests (user_id, test_id, username, time_left, total_grade, test_date)
      VALUES 
        (1, 1, 'john_doe', 30, 90, '2024-11-18'),
        (2, 2, 'jane_doe', 20, 80, '2024-11-17'),
        (3, 3, 'alex_smith', 15, 70, '2024-11-16');
    `);

    console.log('Seeded user_tests table.');

    // Seed untuk tabel `answers`
    await db.query(`
      INSERT INTO answers (user_test_id, question_id, answer, grade)
      VALUES 
        (1, 1, '4', 10),
        (1, 2, '4', 10),
        (2, 3, 'Water', 10),
        (2, 4, 'Mars', 10),
        (3, 5, 'George Washington', 10),
        (3, 6, '1945', 10);
    `);

    console.log('Seeded answers table.');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    db.end(); // Tutup koneksi database setelah selesai
  }
}

// Panggil fungsi seeder
seedDatabase();
