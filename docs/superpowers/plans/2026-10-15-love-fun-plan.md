# LoveFun ("Love is Fun") Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mengubah proyek menjadi LoveFun (`love-fun`), merombak landing page dengan 2 kartu utama (Photobooth & Couple Games), menyiapkan `.env.example`, skema database, API room code dengan masa aktif 5 jam, dan rute dashboard admin privat (`/dashboard`).

**Architecture:** Next.js 16 App Router dengan Prisma ORM / PostgreSQL, API Routes internal untuk Room Session (5 hours TTL), Cloudinary storage integration ready, dan antarmuka berbasis shadcn/ui.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v3, Prisma ORM, PostgreSQL, Lucide React, gifenc, Cloudinary API wrapper.

**Spec:** `docs/superpowers/specs/2026-10-15-love-fun-architecture.md`

## Global Constraints
- Zero em-dash (`—`) di seluruh antarmuka dan kode.
- Akses anonim dijamin 100% untuk Photobooth dan bermain game.
- Rute admin privat dipetakan ke `/dashboard`.
- Room code digenerate oleh user login dengan masa aktif tepat 5 jam (`expires_at`).
- Cloud storage terstandarisasi ke Cloudinary.

---

### Task 1: Rebranding ke `love-fun` & Update Landing Page (`app/page.tsx`)
**Files:**
- Modify: `package.json`, `app/layout.tsx`, `app/page.tsx`, `DESIGN.md`
- Test: `npm run build`

- [ ] **Step 1: Ubah nama package di `package.json` dan metadata di `app/layout.tsx` menjadi LoveFun**
- [ ] **Step 2: Rombak `app/page.tsx` menyajikan Hero Section + 2 Kartu Navigasi Utama (Photobooth Studio `/booth` & Couple Game `/games/sync`)**
- [ ] **Step 3: Jalankan `npm run build`**
- [ ] **Step 4: Commit perubahan Task 1**

### Task 2: Setup Konfigurasi `.env.example` & Database Schema (Prisma PostgreSQL)
**Files:**
- Create: `.env.example`, `prisma/schema.prisma`, `lib/db.ts`
- Modify: `package.json`
- Test: `npx prisma validate`

- [ ] **Step 1: Buat file `.env.example` dengan variabel DATABASE_URL, NEXTAUTH_SECRET, CLOUDINARY credentials, dan SUPER_ADMIN_SECRET**
- [ ] **Step 2: Install `@prisma/client` dan `prisma` di `package.json`**
- [ ] **Step 3: Definisikan skema Prisma (`User`, `GameRoom`, `PhotoHistory`, `UserBadge`, `FrameCatalog`)**
- [ ] **Step 4: Buat singleton Prisma client di `lib/db.ts`**
- [ ] **Step 5: Commit perubahan Task 2**

### Task 3: Setup Engine Room Code 5 Jam & API Endpoints
**Files:**
- Create: `lib/room-code.ts`, `app/api/rooms/create/route.ts`, `app/api/rooms/join/route.ts`
- Test: Unit check `src/booth.test.ts` dan API response validation

- [ ] **Step 1: Buat generator room code dan verifikator TTL 5 jam di `lib/room-code.ts`**
- [ ] **Step 2: Buat API Route `/api/rooms/create` (hanya bisa digenerate user login / host token)**
- [ ] **Step 3: Buat API Route `/api/rooms/join` (bebas diakses tamu/partner tanpa login)**
- [ ] **Step 4: Commit perubahan Task 3**

### Task 4: Setup Shell Rute Game Hub (`/games/sync`) & Admin Dashboard (`/dashboard`)
**Files:**
- Create: `app/games/sync/page.tsx`, `app/dashboard/page.tsx`, `app/profile/page.tsx`
- Test: `npm run build`

- [ ] **Step 1: Buat halaman Game Hub `/games/sync` dengan form Buat Room / Masuk Kode Room**
- [ ] **Step 2: Buat halaman Profil `/profile` untuk melihat riwayat photo strip dan lencana badge**
- [ ] **Step 3: Buat halaman privat `/dashboard` (Super Admin)**
- [ ] **Step 4: Jalankan `npm test && npm run build`**
- [ ] **Step 5: Commit dan push ke branch `main`**
