const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const cors = require('cors');
const app = express();

// Middleware untuk parsing body request
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

// Routes
app.use(routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// REQUIREMENT
// User bisa register POST
// User bisa login menggunakan email dan password POST
// User bisa login menggunakan google ada username dan profil pict nya POST
// User bisa membuat test dan bisa menambahkan soal [user harus login] POST
// User bisa memasukkan kode test untuk memulai test. [jika user login maka tidak usah munculkan elemen untuk memasukkan nama] GET{} 
// Jika di bagian memulai kode test dan memasukkan username namun username nya sama maka munculkan pesan error POST
// User bisa memulai test dengan mengirimkan data berupa id dari test nya dan user yang login, jika tidak maka mengirimkan username.POST

// TODO: give response grade in submitAnswer
// TODO: Connect to cloud login
// TODO: Connect to cloud SQL
// TODO: Connect to cloud Storage
// TODO: Connect to Machine Learning