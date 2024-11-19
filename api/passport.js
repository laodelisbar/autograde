const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('./models'); // Path disesuaikan dengan struktur proyek Anda

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // Client ID Google
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Client Secret Google
      callbackURL: `${process.env.BASE_URL}/auth/google/callback`, // URL untuk callback setelah login
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Cari user berdasarkan Google ID
        let user = await User.findOne({ where: { googleId: profile.id } });

        if (!user) {
          // Jika user belum ada, buat user baru
          user = await User.create({
            username: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            profilePictureUrl: profile.photos[0]?.value,
          });
        }

        done(null, user); // Lanjutkan ke proses berikutnya dengan user yang ditemukan/dibuat
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id); // Simpan user ID ke session
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user); // Ambil kembali data user berdasarkan ID
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;