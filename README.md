# AUTOGRADE



## Langkah-Langkah Pengembangan

Repository ini terdiri dari tiga folder utama:
- `android`: untuk pengembangan aplikasi Android.
- `web`: untuk pengembangan web.
- `api`: untuk pengembangan API.

### Fork dan Clone Repository

**Fork Repository ini**
   - Klik tombol **Fork** di pojok kanan atas halaman repository ini di GitHub, dan buat fork ke akun Anda.

**Buat Folder Kosong untuk Clone**
   - Di komputer lokal Anda, buat folder kosong di lokasi yang diinginkan untuk menyimpan repository ini.

**Clone dengan Filter dan Sparse Checkout**
   - Buka terminal atau command prompt, masuk ke folder kosong, dan jalankan:
     ```bash
     git clone --filter=blob:none --sparse <URL-fork-repo-Anda> .
     ```

**Aktifkan Folder yang Ingin Diedit**
   - Setelah selesai clone, pilih folder yang ingin Anda kerjakan dengan salah satu perintah berikut:

   - **Android**
     ```bash
     git sparse-checkout set android
     ```
   
   - **API**
     ```bash
     git sparse-checkout set api
     ```
   
   - **Web**
     ```bash
     git sparse-checkout set web
     ```

### 2. Mulai Pengembangan

**Format Commit Message**
   - Gunakan format berikut untuk pesan commit:
     - `FEAT:` untuk penambahan fitur baru, contoh:
       ```bash
       git commit -m "FEAT: Menambahkan fitur login"
       ```
     - `FIX:` untuk memperbaiki bug, contoh:
       ```bash
       git commit -m "FIX: Memperbaiki bug validasi input"
       ```
   - Gunakan `TODO:` dalam komentar kode untuk menandai item yang masih perlu dikerjakan, contoh:
     ```javascript
     // TODO: Tambahkan validasi untuk kolom email
     ```

### 3. Mengirimkan Pull Request (PR)

**Push Branch ke Fork Anda**
   - Setelah selesai melakukan perubahan, push branch ke fork repository Anda di GitHub:
     ```bash
     git push origin main
     ```

**Buat Pull Request**
   - Buka halaman GitHub fork repository Anda. Akan ada opsi untuk membuat **Pull Request** (PR) ke repository utama.
   - Klik **New Pull Request** dan isi deskripsi perubahan yang Anda lakukan.

**Update PR jika Diperlukan**
   - Jika Anda membuat perubahan tambahan pada branch yang sama, cukup commit dan push kembali. PR akan otomatis diperbarui dengan perubahan tersebut.

### Tips Sinkronisasi
Pastikan branch Anda selalu up-to-date dengan branch utama di repository ini untuk mencegah konflik yang tidak diinginkan.