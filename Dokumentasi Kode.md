# Dokumentasi Kode & Progres Aplikasi - KonsultanAI
**Tanggal Update:** 11 Juni 2026
**Framework Utama:** Next.js 16 (App Router, Turbopack), React, TypeScript
**Styling & UI:** Tailwind CSS, Framer Motion, Lucide React
**Backend & Database:** Supabase (PostgreSQL, Auth, Storage)
**Payment Gateway:** Midtrans (Webhook & Snap API)

---

## 1. Arsitektur & Teknologi Inti
- **Aplikasi Web Modern:** Dibangun menggunakan App Router Next.js untuk performa maksimal dengan Server Components dan Client Components yang dipisahkan secara strategis.
- **Sistem Autentikasi (Supabase SSR):** Auth flow telah diimplementasikan dengan standar keamanan tertinggi menggunakan `@supabase/ssr` (mengandalkan `supabase.auth.getUser()` di server untuk validasi JWT yang aman).
- **Tema Global (Dark/Light Mode):** Diimplementasikan menggunakan `next-themes` dan dibungkus dalam komponen `<GlobalThemeToggle />` yang melayang agar bisa diakses dari halaman mana pun.

## 2. Struktur Database (Supabase)
Sistem database telah dilengkapi dengan tabel relasional yang saling terhubung beserta sistem keamanan **Row Level Security (RLS)**:
- `users`: Menyimpan profil pengguna, di-expand dengan kolom `role` ('user', 'admin') dan `tier` langganan ('free', 'basic', 'professional', 'business').
- `legal_categories`: Menyimpan daftar kategori hukum (Pidana, Perdata, dll).
- `legal_materials`: Menyimpan konten materi pembelajaran yang berelasi dengan `category_id`. Memiliki parameter `is_premium` dan `required_tier` untuk sistem *paywall*.
- `legal_quizzes`: Bank soal pilihan ganda yang terikat dengan `material_id` (menggunakan format JSONB untuk opsi jawaban).

## 3. Fitur yang Telah Selesai (Phase 1 & Phase 2)

### A. Sistem Pembayaran & Subscription (Midtrans)
- Integrasi tombol pembayaran di halaman Pricing yang terhubung ke Midtrans Snap.
- **Webhook Otomatis:** Endpoint `/api/webhook/midtrans/route.ts` yang mendengarkan notifikasi dari server Midtrans. Webhook ini otomatis mengecek *signature key*, lalu menggunakan akses `SUPABASE_SERVICE_ROLE_KEY` (bypass RLS) untuk meng-*update* kolom `tier` pengguna di database secara seketika setelah pembayaran sukses (*settlement*).

### B. Legal Learning Center
Sistem edukasi hukum interaktif dengan akses berbasis *tier*:
- **Katalog Dinamis (`/learning`):** Mengambil data secara *Server-Side* menggunakan Service Role Key agar pengunjung publik bisa melihat judul-judul materi sebagai pemancing *(lead magnet)*.
- **Halaman Kategori (`/learning/category/[id]`):** Mengelompokkan materi dengan indikator visual (Gratis vs Premium).
- **Halaman Materi (`/learning/material/[id]`):**
  - **Sistem Paywall:** Memiliki logika untuk mengecek `session` pengguna dan `user.tier`. Jika level pengguna di bawah `required_tier`, materi akan dikunci dan tombol "Upgrade" akan muncul.
  - **Rich Text Rendering:** Mem-parsing Markdown sederhana (Cetak Tebal dan Paragraf) untuk artikel hukum yang panjang.
  - **Kuis Interaktif:** *Client Component* untuk memunculkan evaluasi berganda di akhir materi dengan perhitungan skor instan.

### C. UI Khusus & Marketplace (Frontend)
- **Advocate Marketplace:** Menampilkan daftar pengacara, filter pencarian, dan sistem *booking* awal.
- **AI Chat Interface:** Tampilan utama untuk fitur konsultasi AI yang siap disambungkan ke API *Large Language Model* (LLM).

## 4. Keamanan & Aksesibilitas
- **Pemisahan Kunci API:** Menggunakan `NEXT_PUBLIC_SUPABASE_ANON_KEY` untuk operasi *Client-Side* umum dan `SUPABASE_SERVICE_ROLE_KEY` untuk operasi krusial di *Server-Side* (seperti Webhook dan validasi RLS tingkat tinggi).
- **Responsive Design:** 100% mendukung tampilan mobile, tablet, dan desktop dengan konsep *glassmorphism* dan warna emas (*gold*) yang *premium*.

## 5. Deployment
- **Platform:** Vercel
- **Status:** *Production Ready* untuk frontend dan database. Konfigurasi `package.json` dan `.env` telah disesuaikan agar bisa di-*build* dengan mulus di infrastruktur Vercel.

---
**Catatan untuk Tahap Selanjutnya (Phase 3):**
Fokus selanjutnya adalah integrasi logika AI untuk *Legal Tutor*, *Contract Review*, dan *AI Chatbot* sesungguhnya, serta menyelesaikan dashboard Admin untuk memanajemen konten dan pesanan secara komprehensif.
