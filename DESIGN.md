# DESIGN.md - Beauty Booth Visual Identity & Token Spec

> Spec arah visual untuk Beauty Booth studio web-based camera photo strip.
> Menerapkan filter antislop & Taste Skill (soft-skill / high-end-visual-design) untuk menghasilkan tampilan Cute, Playful, namun tetap Elegan, Clean, dan Bersusun Presisi.

## 1. Identity & Mood
- **Brand Identity**: Beauty Booth (Digital Photo Strip & GIF Studio ala Korean Aesthetic Photobooth Seoul/Harajuku).
- **Core Mood**: Warm Porcelain, Soft Blush, Playful yet Luxurious Studio.
- **Dial Setting**:
  - **ENERGY**: 2 (Vibrant studio with friendly pastel pop)
  - **RHYTHM**: 2 (Structured photo cards, asymmetric showcase, bento controls)
  - **MOTION**: 2 (Spring micro-interactions, smooth camera flash, reactive buttons)

## 2. Color Palette (3 Core + 1 Accent)
- **Base Canvas (Light Porcelain)**: `#FFF9FB` (Warm Cream White)
- **Surface & Cards (Blush Card / Double-Bezel)**: `#FFFFFF` inside `#FFE5EC` (Machined double bezel)
- **Typography & Dark Contrast**: `#2B2D42` (Deep Charcoal Navy, soft off-black)
- **Secondary Muted Text**: `#7D7F9A`
- **Primary Accent (Vibrant Rose)**: `#FB6F92` (Sweet Rose Pink)
- **Secondary Soft Accent**: `#E8DFF5` (Soft Lavender Pastel)

## 3. Typography & Hierarchy
- **Display Headings**: Font sans-serif bersih dengan tight tracking (`letter-spacing: -0.02em`), leading rapi.
- **Micro Eyebrows**: Tiny capsule pill badge (`text-[11px] uppercase tracking-wider font-semibold`).
- **Data & Numeric**: Tabular numbers untuk timer countdown dan ukuran stiker.

## 4. Double-Bezel Hardware Architecture (Doppelrand)
- **Kamera & Strip Preview**: Ditempatkan di dalam nested card (outer shell radius `rounded-3xl` dengan background soft pastel border halus, inner container `rounded-2xl` dengan shadow halus).
- **Control Bar**: Beralih dari dropdown kasar ke tombol segmented pill dan slider presisi.

## 5. Delivery Gates & Quality Locks
- Zero em-dashes (`—`) di seluruh antarmuka.
- WCAG AA contrast terjaga (kontras teks charcoal pada background cream > 7:1).
- Semua tombol memiliki hover/active scale spring dan feedback suara/visual.
- Seluruh fitur inti (webcam stream, 3/4 shots, countdown, stiker drag, render canvas strip, download PNG, GIF export) tetap bekerja 100%.
