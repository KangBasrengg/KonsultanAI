# Product Requirements Document (PRD): KonsultanAI

## 1. Product Overview
**Nama Produk:** KonsultanAI  
**Tagline:** "Akses Bantuan Hukum Cerdas, Kapan Saja, di Mana Saja."  
**Visi:** Mendemokratisasi akses terhadap informasi dan layanan hukum di Indonesia menggunakan teknologi Artificial Intelligence (AI) terkini, sehingga setiap lapisan masyarakat dapat memahami hak dan posisi hukum mereka secara mudah dan terjangkau.  
**Misi:** Menjadi jembatan antara masyarakat awam dengan sistem hukum Indonesia melalui AI yang akurat, edukasi hukum terstruktur, dan koneksi langsung dengan advokat profesional.

---

## 2. Target Audience
1. **Masyarakat Umum (B2C):** Individu yang sedang menghadapi masalah hukum (penipuan, keluarga, sengketa tanah) namun ragu/takut biaya mahal untuk konsultasi ke pengacara.
2. **UMKM & Bisnis Kecil (B2B):** Pelaku usaha yang membutuhkan panduan legalitas dasar, penyusunan kontrak, atau penyelesaian sengketa bisnis.
3. **Mahasiswa Hukum & Praktisi Pemula:** Pengguna yang ingin belajar dan mencari referensi pasal-pasal hukum secara cepat melalui *Learning Center*.
4. **Advokat Profesional:** Pengacara yang ingin mendapatkan klien baru dan memperluas jangkauan layanan mereka melalui ekosistem digital.

---

## 3. Core Features (Current State)

Aplikasi saat ini telah memiliki fungsionalitas *end-to-end* yang kuat dengan 4 pilar utama:

### A. AI Legal Assistant (Chatbot)
Fitur inti platform yang memberikan analisis hukum awal secara instan.
- **Engine:** Menggunakan model LLM (via FreeModel API / OpenAI SDK) dengan prompt sistem khusus hukum Indonesia (KUHP, KUHPerdata, UU ITE, dll).
- **Limitasi Pengguna:** Sistem *Free Trial* (3x chat gratis), dilanjutkan dengan sistem berbayar.
- **Export PDF:** Pengguna dapat mengunduh riwayat konsultasi AI ke dalam format PDF sebagai dokumen referensi legal awal sebelum ke kantor polisi atau pengacara.
- **Auto-History:** Seluruh percakapan otomatis tersimpan di database untuk dilanjutkan kapan saja.



### B. Legal Learning Center (Edukasi Hukum)
Modul pembelajaran interaktif untuk meningkatkan literasi hukum pengguna.
- **Tier-based Access:** Akses materi dikunci berdasarkan tingkatan langganan pengguna (Free, Basic, Professional, Business).
- **Kategori & Modul:** Materi hukum terstruktur (contoh: Hukum Bisnis, Hukum Pidana).
- **Interactive Quiz:** Evaluasi pemahaman di akhir modul pembelajaran.

### C. Sistem Berlangganan & Monetisasi (Subscriptions)
Sistem monetisasi freemium terintegrasi penuh.
- **Payment Gateway:** Terintegrasi dengan Midtrans (Webhook) untuk pembayaran otomatis.
- **Tier Pricing:**
  - **Free:** 3x Trial AI Chat.
  - **Basic / Professional / Business:** Kuota generasi AI bertingkat, akses Learning Center eksklusif, prioritas dukungan.

### D. Admin Dashboard & Role Management
- **Role-Based Access Control (RBAC):** Pemisahan hak akses antara `user` dan `admin`.
- **User Management:** Admin dapat mengatur tier langganan pengguna dan memantau keseluruhan platform.

---

## 4. Technology Stack
Platform KonsultanAI dibangun di atas teknologi *modern web* untuk menjamin skalabilitas dan performa:
- **Frontend / Framework:** Next.js (App Router), React, TypeScript.
- **Styling & UI:** Tailwind CSS, Framer Motion (untuk animasi UI premium), Lucide Icons.
- **Backend / Database:** Supabase (PostgreSQL, Row Level Security, Authentication).
- **AI Integration:** Vercel AI SDK dengan endpoint OpenAI-compatible (FreeModel).
- **Payments:** Midtrans API (dalam tahap proses aktivasi akun).
- **Deployment & Hosting:** Vercel (Edge network optimization).

---

## 5. Monetization Strategy (Business Model)
1. **B2C Subscriptions (SaaS):** Pendapatan berulang (Recurring Revenue) dari langganan bulanan pengguna untuk menggunakan AI secara penuh dan mengakses Learning Center.
2. **Marketplace Commission (Rencana Masa Depan):** Potensi pendapatan berupa potongan komisi (persentase) dari setiap transaksi booking advokat manusia yang terjadi melalui platform.
3. **B2B API / Enterprise:** Menyediakan akses tier *Business* khusus untuk perusahaan yang butuh kuota analisis hukum besar atau konsultasi berkala.

---

## 6. Competitive Advantage (Why KonsultanAI?)
1. **All-in-One Legal Hub:** Tidak hanya memberikan analisis AI, tetapi mengarahkan ke penyelesaian akhir melalui edukasi (Learning Center) dan rekomendasi jalur hukum.
2. **Lokal & Akurat:** Prompt AI disetel secara ketat spesifik untuk yurisdiksi Hukum Indonesia.
3. **User-Friendly Design:** Menghilangkan stigma "hukum itu kaku dan menakutkan" dengan UI/UX yang modern, *dark-mode premium*, dan interaksi yang menenangkan.

---

## 7. Roadmap (Next Steps for Sponsors)
Bagi calon investor atau sponsor, berikut adalah metrik pertumbuhan selanjutnya:
- **Pengembangan Mobile App Asli (React Native / Flutter)** untuk aksesibilitas *on-the-go*.
- **Live Video/Chat Consultation System:** Membangun *in-app messaging/video call* langsung antara klien dan advokat tanpa keluar aplikasi.
- **Document Generator:** Fitur AI untuk otomatis *drafting* dokumen hukum dasar (contoh: Surat Perjanjian Kerja Sama, Surat Somasi).
- **Advocate Marketplace:** Platform *two-sided* yang menghubungkan pengguna dengan advokat asli secara langsung.
- **Partnership B2B:** Kerjasama dengan Firma Hukum ternama sebagai *verified partners* di dalam Marketplace.
