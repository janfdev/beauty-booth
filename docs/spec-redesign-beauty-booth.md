# Spec: Redesign UI Beauty Booth (Cute, Elegant & Modern Studio)

## Problem Statement
Antarmuka Beauty Booth saat ini masih menggunakan tema gelap generik (`bg-zinc-950`) dengan styling default yang kontras tajam. Tampilan ini kurang mencerminkan pengalaman photobooth estetik ala Korea/Jepang yang identik dengan suasana hangat, ceria (*cute*), dan bersih (*clean & elegant*). Kontrol kamera dan strip editor juga masih menggunakan elemen form standar tanpa micro-interactions yang memuaskan.

## Solution
Meredesain visual landing page (`/`) dan studio photobooth (`/booth`) dengan mengadopsi prinsip `soft-skill` (high-end visual design) dan komponen modular `shadcn` (Button, Card, Badge, Slider, Dialog, Tabs):
1. Mengubah background menjadi *Warm Porcelain* (`#FFF9FB`) dengan aksen *Soft Blush* (`#FFE5EC`) dan *Sweet Rose* (`#FB6F92`).
2. Menghadirkan struktur *Double-Bezel* pada viewfinder kamera dan bingkai photostrip agar menyerupai mesin photobooth modern fisik.
3. Menata panel kustomisasi booth (Filter, Frame, Pose, Stiker, Suara) dengan segmented pills, sliders, dan tabs interaktif yang nyaman digunakan di desktop maupun mobile.
4. Mempertahankan 100% fungsionalitas inti: webcam stream, automated multi-shot loop, sound effects sintetis, live canvas strip render, unduh PNG resolusi tinggi, dan export animasi GIF via `gifenc`.

## User Stories
1. Sebagai pengunjung, saya ingin melihat halaman depan yang estetik, ceria, dan memikat dengan showcase photo strip nyata, sehingga saya tertarik masuk ke studio booth.
2. Sebagai pengguna booth, saya ingin memilih mode 3-Pose atau 4-Pose dengan segmented toggle yang jelas, sehingga saya dapat menentukan format strip yang saya inginkan.
3. Sebagai pengguna booth, saya ingin melihat preview filter kecantikan real-time dengan tombol visual yang manis, sehingga saya tahu hasil foto sebelum countdown dimulai.
4. Sebagai pengguna booth, saya ingin mendengar hitungan mundur audio dan melihat animasi flash kamera yang dramatis namun lembut, sehingga saya siap berganti pose di setiap bidikan.
5. Sebagai pengguna booth, saya ingin menghias foto dengan stiker lucu dan teks caption yang fleksibel, lalu mengunduh hasil cetak foto PNG atau animasi GIF tanpa kehilangan kualitas.

## Implementation Decisions
- **Framework & Styling**: Next.js 16 App Router, React 19, Tailwind CSS v3 dengan palet kustom `booth`.
- **Komponen Modular**: Mengintegrasikan komponen UI bergaya shadcn (Button varian sweet-rose/outline/ghost, Badge, Card berarsitektur double-bezel, Slider kontrol stiker, Dialog modal preview hasil).
- **Zero Loss of Core Logic**: Seluruh fungsi di `src/booth.utils.ts` (`calcStripMetrics`, `FILTER_CSS`, `FRAME_STYLES`, `STICKER_PRESETS`, `SoundEngine`) dipertahankan sepenuhnya dan tetap lulus unit test.
- **Copywriting**: Menghindari em-dash (`—`), buzzwords klise AI, dan memastikan Bahasa Indonesia/Inggris terstruktur ramah dan humanis.

## Testing Decisions
- Menjalankan unit test `npm test` (`src/booth.test.ts`) untuk memastikan kalkulasi dimensi canvas strip 3-pose dan 4-pose tetap valid.
- Verifikasi build Next.js (`npm run build`) tanpa error kompilasi dan linting.
- Verifikasi interaksi di browser harness (render landing page, akses webcam/placeholder state, tombol interaktif).

## Out of Scope
- Migrasi backend penyimpanan cloud (tetap client-side browser 100% privacy-first).
- Perubahan algoritma kuantisasi GIF `gifenc`.
