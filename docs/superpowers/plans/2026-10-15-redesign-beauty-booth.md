# Beauty Booth UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Meredesain visual Landing Page dan Studio Booth Beauty Booth menjadi cute, elegan, modern ala Korean aesthetic photobooth dengan komponen bergaya shadcn/ui tanpa mengubah fitur inti.

**Architecture:** Menggunakan arsitektur Next.js 16 App Router dengan styling Tailwind CSS diperkaya variabel tema lembut (Warm Porcelain, Soft Blush, Sweet Rose), token Double-Bezel hardware enclosure, dan komponen modular terstandarisasi shadcn (Button, Card, Badge, Slider, Dialog).

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v3, Lucide React, gifenc, HTML5 Canvas API, Web Audio API.

**Spec:** `/root/beauty-booth/docs/spec-redesign-beauty-booth.md` dan `DESIGN.md`

## Global Constraints
- Zero em-dash (`—`) pada seluruh teks antarmuka maupun komentar kode.
- Fitur inti (webcam getUserMedia, multi-shot 3/4 poses, countdown loop, canvas strip render, download PNG, GIF export) tetap bekerja 100%.
- WCAG AA contrast standard (kontras teks minimal 4.5:1 untuk teks normal pada background).
- Mobile layout responsif dan touch-friendly (minimal 44px tap target).

## Review Focus
1. Webcam stream error & loading state: Tampilan informatif ketika izin kamera belum diberikan atau sedang dimuat.
2. Interaksi Stiker di atas Canvas: Penempatan dan kontrol ukuran stiker tetap akurat pada koordinat canvas saat di-render ke PNG/GIF.
3. Audio feedback: Suara countdown beep dan camera shutter tetap tersinkronisasi dengan opsi toggle bisu (mute).
4. Responsivitas Layar Ponsel: Tata letak kamera dan strip editor bertransformasi rapi dari 2-kolom desktop menjadi 1-kolom teratur di layar mobile.
5. Kualitas Export: Hasil unduhan PNG photo strip dan file GIF animasi tetap tajam dan proporsional.

---

### Task 1: Scaffolding Fondasi Desain & Komponen UI Shadcn
**Files:**
- Create: `components/ui/button.tsx`, `components/ui/badge.tsx`, `components/ui/card.tsx`, `lib/utils.ts`
- Modify: `app/globals.css`, `tailwind.config.js`
- Test: `npm test`

- [ ] **Step 1: Buat utility helper `cn()` di `lib/utils.ts`**
- [ ] **Step 2: Buat komponen UI terstandarisasi shadcn (`Button`, `Badge`, `Card`)**
- [ ] **Step 3: Perbarui `app/globals.css` dengan token warna Warm Porcelain dan animasi flash lembut**
- [ ] **Step 4: Jalankan `npm test` untuk memastikan kompatibilitas**
- [ ] **Step 5: Commit perubahan Task 1**

### Task 2: Redesign Halaman Depan / Landing Page (`app/page.tsx`)
**Files:**
- Modify: `app/page.tsx`
- Test: `npm run build`

- [ ] **Step 1: Rombak `app/page.tsx` mengadopsi tema Warm Porcelain, Sweet Rose accent, dan typography berkelas**
- [ ] **Step 2: Pasang showcase strip interaktif dengan double-bezel photo frame mockup dan badge fitur estetik**
- [ ] **Step 3: Pastikan seluruh tombol dan link mengarah ke rute `/booth` yang valid tanpa dead links**
- [ ] **Step 4: Jalankan `npm run build` untuk memverifikasi kompilasi Next.js**
- [ ] **Step 5: Commit perubahan Task 2**

### Task 3: Redesign Studio Photobooth (`app/booth/page.tsx`)
**Files:**
- Modify: `app/booth/page.tsx`
- Test: `npm test && npm run build`

- [ ] **Step 1: Perbarui Viewfinder Kamera dengan framing Double-Bezel, countdown visual manis, dan audio shutter**
- [ ] **Step 2: Tata ulang Control Bar (Pilihan 3/4 Pose, Filter Warna, Bingkai Pastel, Stiker Lucu, dan Kustomisasi Caption) dengan segmented pills dan card yang rapi**
- [ ] **Step 3: Poles Photo Strip Preview & Action Bar (Unduh PNG Cetak & Simpan Animasi GIF) dengan feedback progress bar yang cantik**
- [ ] **Step 4: Jalankan `npm test` dan `npm run build`**
- [ ] **Step 5: Commit perubahan Task 3**

### Task 4: Verifikasi Visual Browser & Delivery Gate Audit
**Files:**
- Test: Browser inspection & screenshot capture
- Output: Delivery Gate Report

- [ ] **Step 1: Jalankan server Next.js lokal dan uji akses halaman `/` serta `/booth` via browser harness**
- [ ] **Step 2: Tangkap screenshot visual pembuktian hasil redesign**
- [ ] **Step 3: Periksa checklist Delivery Gate (zero em-dash, WCAG contrast, no broken mobile layout)**
- [ ] **Step 4: Hentikan server pengujian untuk menjaga kestabilan VPS**
- [ ] **Step 5: Final commit & push ke repositori**
