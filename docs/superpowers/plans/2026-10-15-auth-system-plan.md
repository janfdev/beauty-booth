# LoveFun Authentication System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun sistem autentikasi lengkap untuk LoveFun: Form Login & Register, Tombol Login Google OAuth, API Routes (/api/auth/*), session JWT, dan integrasi dengan database Prisma PostgreSQL.

**Architecture:** Next.js 16 App Router dengan API Routes mandiri, `bcryptjs` untuk password hashing, `jose` untuk session cookie JWT, dan `@prisma/client` untuk persistensi data pengguna.

**Tech Stack:** Next.js 16, React 19, Prisma ORM, PostgreSQL, bcryptjs, jose, Lucide React, Tailwind CSS v3.

**Spec:** `docs/superpowers/specs/2026-10-15-auth-system.md`

## Global Constraints
- Zero em-dash (`—`) pada seluruh teks antarmuka maupun komentar kode.
- Mendukung Google OAuth sesuai variabel lingkungan yang diset pengguna di Vercel (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`).
- Mendukung Email/Password login dan pendaftaran akun baru.
- Otomatis memberikan wewenang `SUPER_ADMIN` jika email yang login terdaftar di `SUPER_ADMIN_EMAILS`.
- Desain antarmuka Warm Porcelain, Sweet Rose, dan komponen bergaya shadcn/ui.

---

### Task 1: Setup Dependencies, Prisma Client, and Auth Helpers
**Files:**
- Modify: `package.json`
- Create: `lib/db.ts`, `lib/auth.ts`
- Test: `npx prisma generate`

- [ ] **Step 1: Install `@prisma/client`, `prisma`, `bcryptjs`, `@types/bcryptjs`, `jose`**
- [ ] **Step 2: Generate Prisma Client (`npx prisma generate`)**
- [ ] **Step 3: Buat singleton Prisma client di `lib/db.ts`**
- [ ] **Step 4: Buat helper hashing dan JWT session token di `lib/auth.ts`**
- [ ] **Step 5: Commit perubahan Task 1**

### Task 2: Implement Auth API Routes
**Files:**
- Create:
  - `app/api/auth/register/route.ts`
  - `app/api/auth/login/route.ts`
  - `app/api/auth/me/route.ts`
  - `app/api/auth/logout/route.ts`
  - `app/api/auth/google/route.ts`
  - `app/api/auth/callback/google/route.ts`
- Test: Test curl / fetch API endpoints

- [ ] **Step 1: Buat endpoint pendaftaran `POST /api/auth/register`**
- [ ] **Step 2: Buat endpoint login email/password `POST /api/auth/login`**
- [ ] **Step 3: Buat endpoint cek session profil `GET /api/auth/me`**
- [ ] **Step 4: Buat endpoint logout `POST /api/auth/logout`**
- [ ] **Step 5: Buat endpoint inisiasi Google OAuth `GET /api/auth/google`**
- [ ] **Step 6: Buat endpoint penanganan callback Google OAuth `GET /api/auth/callback/google`**
- [ ] **Step 7: Commit perubahan Task 2**

### Task 3: Build Login & Register Page (`app/login/page.tsx` & `app/register/page.tsx`)
**Files:**
- Create: `app/login/page.tsx`, `app/register/page.tsx`
- Test: `npm run build`

- [ ] **Step 1: Rancang halaman `app/login/page.tsx` dengan tab toggle Masuk vs Daftar, tombol Google Login, dan form Email/Password**
- [ ] **Step 2: Buat halaman `app/register/page.tsx` sebagai alias/deep-link form pendaftaran akun**
- [ ] **Step 3: Tambahkan penanganan pesan error, loading spinner, dan redirect otomatis setelah login**
- [ ] **Step 4: Commit perubahan Task 3**

### Task 4: Integrate Header Navigation & Final Verification
**Files:**
- Modify: `components/user-nav.tsx`
- Test: `npm test && npm run build` + Browser harness check

- [ ] **Step 1: Update `components/user-nav.tsx` untuk membaca sesi dari `/api/auth/me` dan tombol "Masuk Akun" mengarah ke `/login`**
- [ ] **Step 2: Jalankan `npm test` dan `npm run build` untuk memverifikasi 100% build lolos**
- [ ] **Step 3: Uji coba form login di browser harness dan tangkap verifikasi visual**
- [ ] **Step 4: Push perubahan ke GitHub branch `main`**
