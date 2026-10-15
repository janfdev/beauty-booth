# Spec: LoveFun Authentication System (Credentials & Google OAuth)

## Problem Statement
Aplikasi LoveFun (`love-fun` di `fun.fizaa.me`) saat ini belum memiliki halaman dan alur autentikasi nyata. Tombol "Masuk Akun" di header hanya berupa simulasi sementara. Pengguna tidak dapat mendaftar (register) atau masuk (login) menggunakan akun email/password, maupun menggunakan Google OAuth yang kredensialnya sudah disiapkan di Vercel Environment. Akibatnya, profil pengguna, riwayat photo strip, dan lencana badges belum dapat tersimpan permanen ke database PostgreSQL.

## Solution
Membangun sistem autentikasi lengkap, aman, dan estetik untuk LoveFun:
1. **Halaman Autentikasi (`/login` dan `/register`)**:
   - Desain Warm Porcelain & Sweet Rose aesthetic sesuai `DESIGN.md`.
   - Tombol "Lanjutkan dengan Google" dengan logo resmi Google SVG.
   - Form Login (Email & Password).
   - Form Register (Nama Lengkap, Email, Password, Konfirmasi Password).
   - Tab switch atau toggle mulus antara Masuk dan Daftar.
2. **Backend API Autentikasi (Native App Router Routes)**:
   - `POST /api/auth/register`: Mendaftarkan user baru, hash password menggunakan `bcryptjs`, simpan ke tabel `users` Prisma.
   - `POST /api/auth/login`: Verifikasi kredensial email & password, menerbitkan cookie HTTP-only JWT session token.
   - `GET /api/auth/me`: Mengembalikan data user yang sedang login beserta role-nya (`SUPER_ADMIN` jika email ada di `SUPER_ADMIN_EMAILS`, atau `USER`).
   - `POST /api/auth/logout`: Menghapus cookie session token.
   - `GET /api/auth/google`: Mengalihkan user ke Google Consent Screen (`https://accounts.google.com/o/oauth2/v2/auth`).
   - `GET /api/auth/callback/google`: Menerima authorization code dari Google, menukar dengan access token (`https://oauth2.googleapis.com/token`), mengambil info profile Google (`https://www.googleapis.com/oauth2/v2/userinfo`), melakukan upsert user di database, lalu mengarahkan kembali ke `/profile` atau `/` dengan cookie session aktif.
3. **Database & ORM Integration**:
   - Menggunakan Prisma ORM (`lib/db.ts`) untuk koneksi ke PostgreSQL database yang telah diset di `DATABASE_URL`.
   - Menangani kasus graceful fallback jika `DATABASE_URL` belum terhubung pada mode testing/development offline.
4. **Header & Navigation Integration**:
   - Menghubungkan `components/user-nav.tsx` ke endpoint `/api/auth/me`.
   - Tombol "Masuk Akun" mengarahkan ke `/login`.
   - Setelah login, dropdown menampilkan nama asli, avatar, dan akses ke `/profile` serta `/dashboard` jika admin.

## User Stories
1. Sebagai pengunjung, saya ingin dapat mendaftar akun baru menggunakan nama, email, dan password agar data kenangan saya tersimpan.
2. Sebagai pengguna terdaftar, saya ingin masuk menggunakan email dan password yang telah saya daftarkan.
3. Sebagai pengguna yang ingin serba cepat, saya ingin mengklik "Lanjutkan dengan Google" untuk langsung login tanpa perlu mengingat password.
4. Sebagai pengguna yang telah login, saya ingin melihat nama dan avatar saya di header atas, serta dapat membuka halaman `/profile` dan melakukan logout.
5. Sebagai Super Admin (pemilik email terdaftar di `SUPER_ADMIN_EMAILS`), saya ingin diakui sebagai role `SUPER_ADMIN` sehingga menu Dashboard Admin muncul di dropdown profil saya.

## Implementation Decisions
- **Libraries**: `bcryptjs` untuk hashing password, `jose` untuk token enkripsi JWT cookie yang kompatibel dengan Next.js App Router & Edge, `@prisma/client` + `prisma` untuk akses database.
- **Session Strategy**: HTTP-only Cookie `lovefun_session` (SameSite=Lax, Secure di production, path=/), aman dari XSS.
- **Google OAuth**: Menggunakan endpoint resmi Google OAuth 2.0 tanpa wrapper bulky NextAuth, menghemat ukuran bundle dan menghilangkan bug compatibility pada Next.js 16/React 19.
- **Styling**: Memanfaatkan komponen shadcn `Button`, `Input`, `Badge`, `Card`, dengan palet warna Warm Porcelain (`#FFF9FB`) dan aksen Sweet Rose (`#FB6F92`).

## Testing Decisions
- Unit check untuk utility hashing, jwt sign/verify, dan validasi input.
- Next.js build verification (`npm run build`).
- Uji coba render UI form login dan register di browser harness.

## Out of Scope
- Fitur reset password via email OTP (dapat ditambahkan pada iterasi berikutnya).
