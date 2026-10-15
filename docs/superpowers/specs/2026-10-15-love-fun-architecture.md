# Spec: LoveFun ("Love is Fun") Architecture & Spec

## Problem Statement
Aplikasi photobooth sebelumnya berfokus pada foto webcam satu arah tanpa fitur keterlibatan jangka panjang. Pengguna pasangan menginginkan ekosistem aktivitas bersama yang menyenangkan: mengabadikan foto strip berdua, bermain game kecocokan (Sync or Sink) dengan room code sementara, dan menyimpan kenangan serta lencana (badges) ke dalam profil akun jika memilih untuk login. Pengelola aplikasi juga memerlukan dashboard privat (`/dashboard`) untuk mengelola katalog bingkai dan aset tanpa harus mengubah kode sumber.

## Solution
Membangun platform **LoveFun** (`love-fun`) pada domain `fun.fizaa.me` dengan arsitektur Next.js 16 App Router yang modular:
1. **Pondasi Akses Bebas Friksi**: Photobooth (`/booth`) dan Game (`/games/sync`) dapat dimainkan 100% tanpa login.
2. **Sistem Akun & Profil Opsional**:
   - Pengguna yang login (Host) dapat membuat *Game Room Code* unik berdurasi 5 jam.
   - Tamu undangan (Partner) cukup memasukkan room code tanpa perlu login.
   - Pengguna login yang menyelesaikan sesi photobooth dapat memilih untuk menyimpan hasil cetak strip ke Cloud Storage sehingga riwayat foto dan lencana pencapaian game (*Chemistry Badges*) tampil di halaman profil (`/profile`).
3. **Penyimpanan Cloud Media**: Menggunakan **Cloudinary** (direct signed/unsigned client upload dengan transformasi on-the-fly otomatis) untuk menyimpan cetakan foto strip dan thumbnail profil.
4. **Dashboard Super Admin Privat (`/dashboard`)**: Terisolasi dengan proteksi kredensial sesi/token untuk mengelola daftar bingkai kustom, bank soal game, dan melihat statistik aktivitas.
5. **Skema Basis Data**: Drizzle ORM / Prisma PostgreSQL yang ringan untuk relasi pengguna, sesi room, pencapaian lencana, riwayat foto strip, dan katalog bingkai dinamis.

## User Stories
1. Sebagai pengunjung, saya ingin langsung memilih antara Photobooth Studio atau Couple Games dari halaman depan tanpa dipaksa mendaftar akun.
2. Sebagai pengguna terdaftar, saya ingin membuat Room Code game berdurasi 5 jam dan membagikan tautan/kode tersebut kepada pasangan saya.
3. Sebagai pasangan yang diundang, saya ingin langsung bergabung ke sesi game hanya dengan memasukkan nama panggilan dan kode room tanpa harus mendaftar akun.
4. Sebagai pengguna terdaftar, saya ingin melihat riwayat photo strip kenangan bersama pasangan dan lencana hasil skor kecocokan game di halaman profil saya.
5. Sebagai Super Admin, saya ingin masuk ke rute privat `/dashboard` untuk menambah opsi bingkai foto dan meninjau bank pertanyaan kuis.

## Implementation Decisions
- **Nama Proyek & Branding**: `love-fun` ("Love is Fun").
- **Cloud Storage**: Cloudinary (karena memiliki transformasi gambar otomatis, CDN cepat, dan kemudahan unggah gambar langsung dari canvas browser).
- **Rute Inti**:
  - `/`: Landing page dengan Hero + 2 Card Utama (Photobooth & Couple Games).
  - `/booth`: Studio kamera photostrip (bisa dipakai anonim atau simpan ke profil).
  - `/games/sync`: Game sinkronisasi kecocokan pasangan (Room code 5 jam).
  - `/profile`: Riwayat photo strip dan galeri lencana (khusus user login).
  - `/dashboard`: Panel kontrol privat Super Admin.
  - `/api/auth/*`, `/api/rooms/*`, `/api/history/*`: Endpoint REST API internal Next.js.
- **Skema Database**:
  - `users`: Identitas user, email, hash password/auth token, role (`USER`, `SUPER_ADMIN`).
  - `game_rooms`: `room_code`, `host_user_id`, `partner_name`, `status`, `expires_at` (5 jam TTL), `final_score`.
  - `photo_history`: `user_id`, `image_url`, `caption`, `frame_theme`, `created_at`.
  - `user_badges`: `user_id`, `badge_code`, `badge_title`, `earned_at`.
  - `frame_catalog`: `frame_code`, `frame_name`, `bg_color`, `border_color`, `is_active`.

## Testing Decisions
- Unit tests untuk logika kalkulasi expirable room code (TTL 5 jam) dan validasi canvas.
- Build verifikasi Next.js 16 (`npm run build`).

## Out of Scope
- Fitur video streaming real-time WebRTC berkecepatan tinggi antar perangkat (game menggunakan polling state interval atau server-sent events sederhana).
