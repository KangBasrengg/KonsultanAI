# PRD (Product Requirements Document)
# AI Legal Assistant Indonesia

## Platform Konsultasi Hukum AI Berbasis KUHP Terbaru Indonesia

---

# 1. Informasi Produk

## Nama Produk
AI Legal Assistant Indonesia

## Tagline
“Memahami Hukum Indonesia Dengan Cepat, Mudah, dan Cerdas.”

## Pemilik Hak Cipta
© Muhammad Nuril & Bahrul Ilmi

## Jenis Produk
Web Application (SaaS Legal Technology)

## Deskripsi Produk
AI Legal Assistant Indonesia adalah platform konsultasi hukum berbasis Artificial Intelligence (AI) yang membantu masyarakat Indonesia memahami permasalahan hukum berdasarkan kronologi kejadian yang mereka alami.

Sistem akan:
- Menganalisis kronologi pengguna
- Mengidentifikasi unsur hukum
- Menampilkan pasal KUHP terbaru yang relevan
- Memberikan delik atau kategori tindak pidana
- Menjelaskan hukum dengan bahasa sederhana
- Membuat laporan kronologi otomatis
- Menyediakan konsultasi hukum AI berbasis chat

Platform ini ditujukan untuk masyarakat umum Indonesia yang awam terhadap hukum namun membutuhkan solusi hukum yang cepat, praktis, dan terjangkau.

---

# 2. Landasan Hukum

## KUHP yang Digunakan
Sistem wajib menggunakan:
- KUHP Nasional terbaru Indonesia
- Undang-Undang terbaru yang masih berlaku
- Perubahan hukum terbaru yang relevan

AI harus:
- Menghindari penggunaan pasal usang
- Memberikan referensi hukum terbaru
- Menampilkan tanggal atau status UU jika diperlukan

---

# 3. Tujuan Produk

Membantu masyarakat Indonesia:
- Memahami hukum secara sederhana
- Mengetahui pasal yang sesuai dengan kasus
- Mendapat analisis hukum instan
- Membuat laporan hukum otomatis
- Mengakses konsultasi hukum murah
- Mendapat edukasi hukum modern berbasis AI

---

# 4. Target Pengguna

## Primary Users
### Masyarakat Indonesia Umum
Karakteristik:
- Awam terhadap hukum
- Tidak memahami pasal KUHP
- Membutuhkan jawaban cepat
- Ingin solusi murah/praktis

## Secondary Users
- Mahasiswa hukum
- UMKM
- Paralegal
- Korban tindak pidana
- Konten kreator edukasi hukum

---

# 5. Problem Statement

“Masyarakat Indonesia kesulitan memahami hukum karena bahasa hukum rumit, konsultasi hukum mahal, dan informasi hukum di internet sering tidak akurat.”

---

# 6. Solusi Produk

Platform menyediakan AI Legal Assistant yang mampu:
1. Menerima kronologi kejadian
2. Menganalisis unsur hukum
3. Menentukan pasal KUHP terbaru
4. Menentukan delik pidana/perdata
5. Memberikan penjelasan sederhana
6. Membuat laporan otomatis
7. Menyimpan histori konsultasi
8. Menawarkan konsultasi premium berlangganan

---

# 7. Model Bisnis

## Monetisasi Utama
Subscription / Membership

## Mekanisme Free Trial
- User hanya dapat melakukan generate analisis hukum sebanyak 1x secara gratis
- Setelah penggunaan pertama:
  - User wajib berlangganan
  - Atau membeli akses premium

## Paket Premium
### Basic Plan
- Unlimited generate
- Riwayat konsultasi
- Download laporan

### Professional Plan
- AI lebih detail
- Analisis lebih mendalam
- Prioritas respon
- Template laporan premium

---

# 8. Sistem Pembayaran

## Payment Gateway
Sistem pembayaran harus mendukung:
- QRIS
- Transfer Bank BCA
- E-Wallet

## Fitur Pembayaran
- Generate QRIS otomatis
- Redirect pembayaran otomatis
- Validasi pembayaran real-time
- Status subscription otomatis aktif setelah pembayaran berhasil

## Integrasi yang Direkomendasikan
- Midtrans
- Xendit
- Tripay

## Catatan
QRIS pembayaran harus terhubung dengan rekening BCA milik owner aplikasi.

---

# 9. Teknologi yang Digunakan

## Frontend
- Next.js terbaru (App Router)
- React.js
- TypeScript
- Tailwind CSS
- Framer Motion

## Backend
- Next.js API Route / Server Actions
- Node.js

## Database
- PostgreSQL
- Supabase

## Authentication
- Supabase Auth

## AI Integration
- Claude API
- API Key dari freemodel.dev

## Deployment
- Vercel

---

# 10. Arsitektur Frontend

## Struktur Folder Frontend

```bash
src/
 ├── app/
 ├── components/
 │    ├── ui/
 │    │    ├── button.tsx
 │    │    ├── navbar.tsx
 │    │    ├── logo.tsx
 │    │    ├── card.tsx
 │    │    ├── modal.tsx
 │    │    └── input.tsx
 │    │
 │    ├── layout/
 │    ├── sections/
 │    └── dashboard/
 │
 ├── lib/
 ├── services/
 ├── hooks/
 ├── types/
 └── utils/

 Tujuan Struktur
Mudah maintenance
Reusable component
Mudah scaling
Modular architecture
11. User Flow
Alur Pengguna
User membuka landing page
User input kronologi kejadian
AI menganalisis kronologi
Sistem menampilkan:
Pasal terkait
Delik hukum
Penjelasan sederhana
Jika user sudah menggunakan free trial:
Sistem meminta subscribe
User melakukan pembayaran QRIS
Subscription aktif
User dapat menggunakan fitur premium
12. Fitur Utama
12.1 Input Kronologi

User dapat menulis:

Waktu kejadian
Lokasi
Pihak terkait
Detail peristiwa
12.2 AI Analisis Hukum

AI melakukan:

NLP Analysis
Identifikasi unsur pidana
Klasifikasi pasal
Mapping KUHP terbaru

Output:

Pasal terkait
Penjelasan hukum
Potensi pelanggaran
Rekomendasi tindakan
12.3 Rekomendasi Pasal Hukum

Sistem menampilkan:

Nomor pasal
Isi singkat
Delik terkait
Tingkat relevansi
12.4 Pembuatan Laporan

Sistem menghasilkan:

PDF laporan
Draft laporan polisi
Ringkasan kronologi
12.5 Riwayat Konsultasi

User dapat:

Melihat histori
Download laporan lama
Menyimpan kasus
12.6 Subscription System

Fitur:

Limit generate gratis
Membership premium
Billing management
Status subscription
13. Functional Requirements
ID	Requirement
FR-01	User dapat input kronologi
FR-02	AI menganalisis kronologi
FR-03	Sistem menampilkan pasal KUHP terbaru
FR-04	Sistem menampilkan delik hukum
FR-05	User dapat menyimpan laporan
FR-06	User dapat subscribe
FR-07	Sistem generate QRIS otomatis
FR-08	Subscription aktif otomatis
FR-09	Sistem membatasi free trial 1x
FR-10	Admin dapat update database hukum
14. Non Functional Requirements
Kategori	Requirement
Performance	Response AI < 10 detik
Security	Data terenkripsi
Accessibility	Mobile responsive
Reliability	Uptime 99%
Privacy	Riwayat user bersifat privat
Scalability	Support ribuan user
15. UI/UX Design Direction
Konsep UI

Modern + Nasionalis Indonesia + Premium Legal Technology

Nuansa Visual

Menggabungkan:

Elegan
Profesional
Futuristik
Identitas Indonesia
Inspirasi Tema
Garuda
Lambang negara
Nuansa emas
Navy dark
Motif batik modern
Elemen hukum Indonesia
16. Warna Utama
Warna	Fungsi
Navy Dark	Background utama
Gold	Premium & hukum
Merah Putih Accent	Identitas Indonesia
White	Typography
17. UI Components
Komponen Penting
Animated Navbar
Premium CTA Button
AI Chat Bubble
Legal Result Card
Subscription Modal
QRIS Payment Modal
Timeline Kronologi
AI Typing Animation
18. Landing Page Sections
Hero Section
Statistik Pengguna
Cara Kerja AI
Keunggulan Produk
Demo Analisis Hukum
Pricing Section
FAQ
Footer Nasionalis Indonesia
19. Hak Cipta & Perlindungan Produk
Kepemilikan

Produk ini dimiliki oleh:

Muhammad Nuril
Bahrul Ilmi
Perlindungan
Seluruh source code dilindungi hak cipta
Branding tidak boleh digunakan ulang tanpa izin
Logo dan identitas visual menjadi aset resmi produk
Rekomendasi Legal

Disarankan:

Mendaftarkan HKI/Hak Cipta
Mendaftarkan merek dagang
Membuat Terms of Service & Privacy Policy
20. Disclaimer Hukum

“Aplikasi ini bukan pengganti pengacara profesional. Semua hasil AI hanya berupa edukasi dan rekomendasi awal berdasarkan data yang diberikan pengguna.”

21. Success Metrics
Metric	Target
User aktif bulanan	10.000+
Conversion premium	>15%
Akurasi rekomendasi	>85%
Retensi pengguna	>60%
Waktu respon AI	<10 detik
22. MVP Scope
MVP Features
Input kronologi
AI analisis hukum
Rekomendasi pasal
Subscription system
QRIS payment
Login/Register
Riwayat konsultasi
23. Future Vision

Menjadi platform konsultasi hukum AI terbesar di Indonesia dengan pendekatan modern, nasionalis, dan mudah diakses seluruh masyarakat Indonesia.

---

# 24. Database Schema (Supabase PostgreSQL)

Sistem menggunakan Supabase sebagai Database utama dengan struktur tabel sebagai berikut:

## Table `users`
- `id` (UUID, Primary Key) - Referensi dari Supabase Auth
- `email` (String)
- `full_name` (String)
- `is_premium` (Boolean, Default: false)
- `created_at` (Timestamp)

## Table `consultations` (Riwayat Kasus)
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key ke `users`)
- `chronology` (Text) - Input kronologi kejadian dari user
- `ai_analysis` (Text) - Hasil analisis AI (Pasal & Penjelasan)
- `created_at` (Timestamp)

## Table `subscriptions`
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key ke `users`)
- `plan_type` (String) - misal: 'Basic', 'Professional'
- `start_date` (Timestamp)
- `end_date` (Timestamp)
- `status` (String) - misal: 'Active', 'Expired'

---

# 25. Subscription Flow (Manual / MVP Phase)

Untuk versi MVP awal ini, integrasi Payment Gateway otomatis (Midtrans/Xendit) **ditunda sementara**.
Alur langganan menggunakan metode manual/simulasi:
1. User yang batas *free trial*-nya (1x) habis akan diarahkan ke halaman pembayaran premium.
2. User diarahkan untuk melakukan transfer manual (misal: Transfer Bank biasa) atau menggunakan "Tombol Simulasi Pembayaran" selama masa *development*.
3. Setelah konfirmasi, status `is_premium` pada tabel `users` akan diubah menjadi `true`.
4. User langsung mendapatkan akses *unlimited* ke fitur konsultasi premium.

---

# 26. AI System Prompt (Instruksi Sistem Claude)

Untuk mendapatkan analisis yang akurat, *System Prompt* yang akan diberikan ke Claude API:

**Role:** 
Anda adalah AI Legal Assistant profesional yang berdedikasi dan ahli dalam Hukum Indonesia, khususnya KUHP Nasional terbaru.

**Task (Tugas):**
1. Analisis kronologi masalah yang diberikan oleh pengguna dengan teliti.
2. Identifikasi unsur-unsur pidana, perdata, atau administratif yang relevan.
3. **WAJIB** mencantumkan Nomor Pasal dari KUHP Terbaru (atau UU Sektoral terbaru lainnya) yang paling sesuai, beserta kutipan singkat isi pasalnya.
4. Jelaskan bagaimana berjalannya proses hukum apabila masalah tersebut dibawa ke ranah hukum.
5. Sampaikan penjelasan menggunakan bahasa sehari-hari yang sederhana dan menenangkan pengguna.

---

# 27. Skenario Edge Cases (AI Tidak Yakin / Kasus Terlalu Spesifik)

Skenario jika AI menghadapi kasus yang tidak memiliki rujukan pasal pasti atau berada di luar batas pengetahuan (untuk menghindari halusinasi AI):
1. **Prioritas Utama**: AI tetap diusahakan menjawab dengan menjabarkan prinsip dasar hukum atau delik umum yang paling mendekati kronologi masalah.
2. **Disclaimer Ketidaktahuan**: Jika AI tidak dapat memberikan nomor pasal spesifik secara pasti, AI harus menyatakan hal tersebut secara jujur.
3. **Rujukan Pemerintah**: AI harus merekomendasikan user untuk membaca rujukan langsung dari website resmi hukum pemerintah seperti **JDIH BPK RI** (jdih.bpk.go.id), **JDIH Kemenkumham**, atau **Direktori Putusan Mahkamah Agung**.