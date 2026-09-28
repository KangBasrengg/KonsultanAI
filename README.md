# ⚖️ KonsultanAI

**Platform Bantuan Hukum Pintar Pertama di Indonesia yang Didukung oleh Kecerdasan Buatan (AI) & Ekosistem Advokat Terverifikasi.**

![KonsultanAI Banner](https://konsultan-ai.com/icon.png)

---

## 📖 Tentang KonsultanAI (Pendekatan 5W1H)

KonsultanAI bukan sekadar aplikasi web biasa. Ini adalah sebuah upaya untuk **mendemokratisasi akses keadilan hukum** di Indonesia menggunakan teknologi modern. Berikut adalah penjelasan lengkap mengenai ekosistem aplikasi ini:

### 1. WHAT (Apa itu KonsultanAI?)
KonsultanAI adalah platform *Legal-Tech* komprehensif yang menjembatani kesenjangan antara masyarakat umum dan layanan hukum. Fitur utamanya meliputi:
*   **AI Triage (Intake Form):** Chatbot pintar yang melakukan analisis awal terhadap kasus hukum pengguna secara *real-time*.
*   **Template Dokumen Hukum:** Koleksi draft dokumen hukum (seperti somasi, surat kuasa, dll) yang dapat diunduh (tergantung *Subscription Tier*).
*   **Marketplace Advokat:** Direktori advokat profesional terverifikasi di mana pengguna dapat melihat profil, spesialisasi, dan mem-booking sesi konsultasi *live-chat*.
*   **Government & Enterprise Analytics:** Dashboard analitik khusus yang memetakan tren permasalahan hukum berdasarkan demografi dan wilayah di Indonesia.

### 2. WHO (Siapa yang menggunakan KonsultanAI?)
Platform ini dirancang untuk ekosistem multi-aktor:
*   **Masyarakat Umum (B2C):** Individu yang sedang menghadapi masalah hukum (penipuan, perceraian, sengketa tanah) namun bingung harus mulai dari mana.
*   **Bisnis & UMKM (B2B):** Perusahaan yang membutuhkan *draft* dokumen legal atau panduan hukum bisnis tanpa harus meng-hire *in-house counsel* mahal.
*   **Advokat Profesional:** Pengacara tersumpah yang ingin memperluas jangkauan klien mereka secara digital dan aman.
*   **Pemerintah & Peneliti (B2G):** Instansi yang membutuhkan data analitik mengenai tren kasus hukum (misal: tingginya kasus penipuan online di Jawa Barat).

### 3. WHY (Mengapa KonsultanAI dibangun?)
*   **Akses Hukum yang Elitis:** Biaya untuk berkonsultasi dengan pengacara seringkali sangat mahal, membuat rakyat kelas menengah ke bawah takut mencari keadilan.
*   **Literasi Hukum yang Rendah:** Banyak orang yang tertipu karena kurangnya pemahaman hukum dasar. KonsultanAI hadir dengan **Legal Learning Center** untuk mengedukasi masyarakat.
*   **Inefisiensi Birokrasi:** Analisis awal oleh AI menghemat waktu advokat hingga 60%, karena pengguna datang dengan ringkasan kasus (kronologi) yang sudah distrukturkan oleh sistem.

### 4. WHERE (Di mana KonsultanAI beroperasi?)
*   **User Endpoint:** Dapat diakses secara fleksibel dari browser Desktop maupun Mobile di [konsultan-ai.com](https://konsultan-ai.com).
*   **Infrastruktur:**
    *   **Frontend & Backend:** Next.js (App Router) + TypeScript.
    *   **Database & Auth:** Supabase (PostgreSQL dengan *Row Level Security*).
    *   **Payment Gateway:** Midtrans (Snap & Webhook).
    *   **AI Engine:** Integrasi dengan Large Language Models melalui AI SDK.

### 5. WHEN (Kapan KonsultanAI digunakan?)
*   **Kapan saja (24/7):** Berbeda dengan kantor hukum tradisional yang tutup pada malam hari, AI konsultan selalu aktif merespons kondisi darurat (*First Aid Legal Help*).
*   Setelah fase AI selesai, sesi konsultasi lanjutan dengan manusia (Advokat) dapat dijadwalkan (*Booking*) sesuai ketersediaan.

### 6. HOW (Bagaimana KonsultanAI Bekerja?)
1.  **Registrasi & Auth:** Pengguna masuk menggunakan integrasi Auth yang aman (Supabase).
2.  **Triage:** Pengguna menceritakan masalah mereka. AI mencocokkannya dengan pasal-pasal relevan (KUHP, KUHPerdata, UU ITE, dll).
3.  **Upgrade Tier:** Pengguna dapat berlangganan (Basic, Pro, Enterprise) via **Midtrans**. Sistem mendeteksi notifikasi (*Webhook*) dan memperbarui status akun menggunakan *Optimistic Locking* untuk mencegah data *racing*.
4.  **Booking Advokat:** Uang pembayaran dialokasikan sebagai saldo (*Balance*) ke akun Advokat secara otomatis saat sesi selesai/terkonfirmasi.
5.  **Secure Live Chat:** Pengguna dan advokat berdiskusi di dalam *room* obrolan terenkripsi dengan batas waktu yang telah ditentukan oleh sistem.

---

## 🛠️ Stack Teknologi & Arsitektur

*   **Framework:** Next.js 16 (App Router)
*   **Bahasa:** TypeScript
*   **Styling:** Tailwind CSS + Framer Motion (untuk micro-animations)
*   **Backend as a Service (BaaS):** Supabase (Auth, Database, Realtime WebSockets)
*   **Pembayaran:** Midtrans (Client Snap & Server Webhook)
*   **AI Processing:** Vercel AI SDK

## 🚀 Instalasi & Menjalankan secara Lokal

1. Clone repositori ini.
2. Install dependensi:
   ```bash
   npm install
   ```
3. Salin file `.env.example` ke `.env.local` (Anda perlu mengisi keys Supabase, Midtrans, dan AI API).
4. Jalankan *development server*:
   ```bash
   npm run dev
   ```
5. Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## 🔒 Security & Engineering Best Practices
Aplikasi ini di-build dengan standar produksi enterprise:
*   **Atomic Database Operations:** Seluruh pemotongan/penambahan token dan saldo advokat menggunakan PostgreSQL RPC dengan locking transaksi atomik (mencegah *race condition* dan *double-spending*).
*   **Zero Leaks & Strict Privacy:** Perlindungan berkas sensitif (`.env*`, `*.pdf`, `*.docx`) dan sanitasi logging produksi.
*   **Middleware Authorization:** Proteksi berlapis seluruh endpoint API via validasi sesi cookie Supabase.
*   **Verification & Idempotency:** Penanganan Webhook Midtrans dengan verifikasi SHA-512 `signature_key` dan pencegahan duplikasi eksekusi.
*   **Automated Quality Assurance:** Rangkaian Playwright E2E automated testing untuk menjaga integritas alur pengguna kritis.

---

## 📜 Changelog & Versioning History

### [v2.1.1] - 2026-09 - *Security Hardening & Real-time State Concurrency*
* **Fix (Auth & Session):** Memperbaiki *race condition* pada alur logout pengguna di `AuthProvider` dan `Navbar`, memastikan sesi hancur seketika dan state navigasi beralih ke publik tanpa memerlukan refresh manual (F5).
* **Security (Atomic Token Operations):** Mengimplementasikan fungsi RPC atomik PostgreSQL (`deduct_token`, `add_tokens`, `transfer_tokens`, `add_advocate_earning`) untuk memitigasi celah kerentanan *Time-of-Check to Time-of-Use* (TOCTOU) saat pengurangan kuota chat, pembuatan kasus, dan *top-up* saldo.
* **Security (Middleware API Lockdown):** Mengetatkan validasi cookie sesi pada seluruh *sub-routes* `/api/*` di `middleware.ts` dengan respons JSON 401 terstandarisasi.
* **Security (Admin Endpoint Hardening):** Menyelaraskan otorisasi metode `DELETE` di `/api/admin/users` dengan proteksi *self-delete* akun admin sendiri.
* **Security (Prompt & AI Auth Guard):** Mengamankan rute `/api/chat` agar mengembalikan 401 saat autentikasi gagal alih-alih mengeksekusi LLM secara gratis.
* **Performance & Headers:** Menambahkan header `Cache-Control: no-store, no-cache, must-revalidate` pada rute sensitif (`/api/profile`, `/api/history`, `/api/admin/users`).
* **Clean Code & Privacy:** Memperbarui aturan `.gitignore` untuk melindungi seluruh dokumen pribadi (`*.pdf`, `*.doc`, `*.docx`) dan membersihkan logging token di konsol produksi.

### [v2.1.0] - 2026-09 - *Enterprise Management & Automated Testing*
* **Test (Playwright E2E):** Menambahkan test suite E2E otomatis (`e2e/app.spec.ts`) yang menguji navigasi, modal autentikasi, render katalog template dokumen, dan responsivitas tata letak mobile.
* **Feature (Enterprise Synchronization):** Integrasi sinkronisasi anggota enterprise dengan alokasi kuota organisasi terpusat.
* **Feature (Auth Recovery):** Implementasi alur lupa kata sandi (*forgot password*) dengan terjemahan pesan kesalahan ramah pengguna dan pengalihan dinamis.
* **SEO:** Optimalisasi sitemap dinamis (`sitemap.xml`) dan pembersihan rute 404 agar terindeks optimal di mesin pencari.

### [v2.0.0] - 2026-08 - *Executive Theme & Architecture Overhaul*
* **UI/UX:** Desain ulang tema eksekutif modern dengan palet warna HSL profesional, tipografi Google Fonts kontras tinggi, dan *glassmorphism*.
* **AI Engine:** Peningkatan model ke Google Gemini 3.1 Flash Lite untuk latensi kilat dan ketahanan terhadap *high demand bottleneck*.
* **Marketplace Advokat:** Direktori advokat terverifikasi, sistem booking konsultasi, alokasi *advocate earnings*, dan obrolan langsung (*live chat*).
* **E-Commerce & Payments:** Integrasi alur checkout Midtrans Snap profesional lengkap dengan verifikasi webhook SHA-512.

### [v1.2.0] - 2026-07 - *Government Analytics & Regional Triage*
* **Feature (Analytics Dashboard):** Dashboard pemetaan analitik hukum untuk kebutuhan instansi pemerintah dan riset demografi kasus hukum.
* **Feature (Regional Intake):** Pemisahan wilayah hukum berbasis hierarki Provinsi dan Kota/Kabupaten untuk akurasi yurisdiksi.
* **Feature (LegalKita Review):** Analisis risiko klausul kontrak dan *red-flag detection* otomatis berbasis unggah PDF/DOCX.
* **Performance:** Optimasi Core Web Vitals (PageSpeed 95+), eliminasi Total Blocking Time (TBT) pada browser mobile.

### [v1.0.0] - 2026-06 - *Initial Production Release*
* **Core:** Peluncuran MVP KonsultanAI dengan fitur Wizard Intake Kasus Hukum.
* **AI Engine:** Konsultasi hukum AI awal berbasis pasal KUHP, KUHPerdata, dan UU ITE.
* **Database & Auth:** Integrasi Supabase SSR Auth dan PostgreSQL Row Level Security (RLS).
* **Legal Learning Center:** Modul edukasi hukum interaktif dengan artikel dan kuis pemahaman.

---
*Dibangun dengan dedikasi tinggi untuk modernisasi akses hukum Indonesia oleh Hoodtech.*
