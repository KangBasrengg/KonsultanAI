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

## 🔒 Security Best Practices
Aplikasi ini di-build dengan standar produksi:
*   Pemisahan API Keys (*Server-side vs Client-side*).
*   Penanganan Webhook Midtrans dengan verifikasi SHA-512 `signature_key`.
*   Tidak mengekspos *stack trace* server pada respon API produksi.
*   Validasi otorisasi lintas *role* (Admin, User, Advokat, Pemerintah).

---
*Dibangun dengan ❤️ untuk hukum Indonesia yang lebih adil dan transparan.*
