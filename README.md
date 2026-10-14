# Beauty Booth · Digital Photo Strip & GIF Studio

Aplikasi studio foto strip digital bergaya retro modern dengan tema lucu (*playful pastel*), dijalankan 100% di browser pengguna (*client-side*) menggunakan HTML5 MediaDevices API, Canvas 2D, dan GIF Encoder tanpa mengunggah data foto ke server pihak ketiga.

---

## Fitur Utama

- **Live Camera & Countdown Multi-Pose**: Mengambil 3 atau 4 pose otomatis dengan jeda hitung mundur 3 detik, flash layar putih, dan efek suara *shutter* synthesizer Web Audio.
- **Beauty & Color Filters**: Preset filter real-time (Beauty Glow, Soft Peach, B&W Classic, Vintage Warm, Cyber Pop).
- **Cute Theme Frames**: Pilihan warna bingkai pastel (Blush Pink, Cream Pearl, Midnight Noir, Lavender Haze, Matcha Mint) dengan footer teks kustom dan tanggal otomatis.
- **Sticker Placement**: Bebas menempelkan stiker lucu (hati, glitter, pita, ceri, kucing, bunga tulip) di atas strip foto.
- **Dual Export (PNG & GIF)**:
  - **PNG**: Cetak gambar resolusi tinggi dengan radius sudut foto dan bingkai estetis.
  - **GIF**: Menggabungkan setiap frame pose menjadi animasi gerak looping (.gif) berukuran optimal via `gifenc`.

---

## Menjalankan Secara Lokal

```bash
# Masuk ke folder proyek
cd beauty-booth

# Install dependencies
npm install

# Jalankan pengujian unit (Layout & Filter Math)
npm test

# Jalankan server lokal
npm run dev
```

Buka browser di `http://localhost:5173` untuk melihat Landing Page atau langsung ke `http://localhost:5173/booth` untuk mencoba studio foto.

---

## Lisensi
MIT License - Dibuat oleh [@janfdev](https://github.com/janfdev).
