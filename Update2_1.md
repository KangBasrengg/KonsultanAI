# UPDATE PRD
# Marketplace Advokat KonsultanAI v2.1

## Modul Ekspansi Legal Services Ecosystem

---

# 1. Ringkasan Fitur

Marketplace Advokat merupakan fitur tambahan pada KonsultanAI yang menghubungkan pengguna dengan advokat profesional yang telah diverifikasi oleh platform.

Fitur ini memungkinkan:

- User mencari advokat sesuai bidang hukum
- AI merekomendasikan advokat berdasarkan hasil analisis kasus
- Advokat mempromosikan jasanya melalui sistem listing
- Advokat menerima konsultasi berbayar dari pengguna
- KonsultanAI memperoleh pendapatan melalui model bisnis hybrid

---

# 2. Tujuan Bisnis

Marketplace Advokat bertujuan untuk:

- Menjadi jembatan antara masyarakat dan advokat
- Membantu advokat memperoleh calon klien berkualitas
- Menambah sumber pendapatan platform
- Meningkatkan tingkat konversi pengguna AI menjadi pengguna layanan hukum profesional

---

# 3. User Roles

## 3.1 User

Hak Akses:

- Menggunakan AI Legal Assistant
- Melihat Marketplace Advokat
- Mencari advokat
- Melihat profil advokat
- Melakukan booking konsultasi
- Melakukan pembayaran konsultasi
- Memberikan rating dan ulasan

---

## 3.2 Advokat

Hak Akses:

- Membuat profil profesional
- Mengelola data profil
- Mengelola tarif konsultasi
- Mengaktifkan listing marketplace
- Melihat lead masuk
- Menerima atau menolak konsultasi
- Melihat statistik profil
- Melihat pendapatan konsultasi

---

## 3.3 Admin

Hak Akses:

- Verifikasi akun advokat
- Menyetujui atau menolak pendaftaran advokat
- Mengelola marketplace
- Mengelola listing
- Mengelola pembayaran
- Mengelola komisi platform
- Suspend akun advokat
- Monitoring transaksi

---

# 4. Navigasi Baru

## Navbar

Tambahkan menu baru:

```text
Beranda
Konsultasi AI
Marketplace Advokat
Pricing
Tentang Kami
Login
```

---

## Visibility

### Guest

Dapat melihat:

```text
Marketplace Advokat
```

tetapi tidak dapat melakukan booking.

---

### User Login

Dapat:

```text
Lihat Profil
Booking Konsultasi
```

---

### Advokat Login

Navbar tambahan:

```text
Dashboard Advokat
```

---

# 5. Alur Registrasi Advokat

## Step 1

Advokat memilih:

```text
Daftar Sebagai Advokat
```

---

## Step 2

Mengisi Data

### Informasi Pribadi

- Nama Lengkap
- Email
- Nomor HP
- Kota Domisili

### Informasi Profesional

- Nomor Induk Advokat
- Organisasi Advokat
- Lama Pengalaman (Tahun)
- Jumlah Kasus yang Pernah Ditangani (Opsional)
- Biografi Singkat

### Bidang Hukum

Advokat dapat memilih lebih dari satu bidang hukum.

Contoh:

```text
☐ Pidana
☐ Perdata
☐ Cybercrime
☐ Ketenagakerjaan
☐ Pertanahan
☐ Bisnis
☐ Hak Kekayaan Intelektual
☐ Pajak
☐ Keluarga & Perceraian
☐ Lingkungan
```

Setiap bidang hukum yang dipilih wajib memiliki persentase keahlian.

Contoh:

```text
☑ Pidana               [90%]
☑ Cybercrime           [80%]
☑ Perdata              [70%]
☐ Pertanahan           [  ]
```

### Business Rules

- Persentase wajib diisi jika bidang hukum dicentang.
- Jika persentase kosong maka bidang hukum tidak dapat dipilih.
- Persentase hanya menerima nilai 1–100.
- Minimal memilih 1 bidang hukum.
- Persentase digunakan oleh AI Recommendation Engine untuk menentukan relevansi advokat terhadap suatu kasus.

---

## Step 3

Upload Dokumen

### Wajib

- KTP
- Kartu Advokat

### Opsional

- Berita Acara Sumpah Advokat

---

## Step 4

Status Akun

```text
Pending Verification
```

---

# 6. Verifikasi Advokat

## SLA Verifikasi

Maksimal:

```text
2 Hari Kerja
```

---

## Status Verifikasi

### Pending

```text
Menunggu Verifikasi Admin
```

---

### Approved

```text
Advokat Terverifikasi
```

---

### Rejected

Admin wajib memberikan alasan penolakan.

---

# 7. Marketplace Listing

## Model Listing

Advokat harus memiliki listing aktif agar tampil di marketplace.

Biaya:

```text
Rp50.000 / 30 Hari
```

---

## Setelah Pembayaran

Sistem membuat:

```text
listing_start_date
listing_expired_date
```

---

## Masa Aktif

```text
30 Hari
```

---

## Auto Expired

Jika:

```text
NOW() > listing_expired_date
```

maka:

```text
listing_status = expired
```

Profil otomatis:

- Hilang dari marketplace
- Hilang dari pencarian
- Hilang dari rekomendasi AI

---

## Reminder

Sistem mengirim notifikasi:

```text
H-7
H-3
H-1
```

sebelum masa aktif berakhir.

---

# 8. Model Bisnis Hybrid

## Pendapatan 1

### Listing Fee

```text
Rp50.000 / 30 Hari
```

Digunakan untuk menampilkan profil advokat di marketplace.

---

## Pendapatan 2

### Komisi Konsultasi

Advokat bebas menentukan tarif konsultasinya sendiri.

Contoh:

```text
Rp50.000
Rp100.000
Rp250.000
Rp500.000
```

---

### Potongan Platform

Default:

```text
10%
```

Persentase komisi dapat diubah oleh admin melalui dashboard.

---

### Simulasi

Tarif Advokat:

```text
Rp100.000
```

Maka:

```text
Advokat : Rp90.000
KonsultanAI : Rp10.000
```

---

# 9. Sistem Tarif Advokat

Advokat dapat menentukan tarif konsultasi secara mandiri melalui Dashboard Advokat.

Contoh:

```text
Rp50.000
Rp100.000
Rp250.000
Rp500.000
```

Tarif yang ditampilkan kepada pengguna merupakan tarif final sebelum dipotong komisi platform.

---

## Dashboard Tarif Advokat

Advokat dapat:

- Menentukan tarif konsultasi
- Mengubah tarif kapan saja
- Melihat simulasi potongan platform
- Melihat estimasi pendapatan bersih

Contoh:

```text
Tarif Konsultasi : Rp100.000

Potongan Platform : 10%

Pendapatan Bersih :
Rp90.000
```

---

## Aturan Tarif

- Tarif minimal Rp25.000
- Tarif maksimal tidak dibatasi
- Perubahan tarif tidak mempengaruhi konsultasi yang sudah dibayar
- Tarif baru hanya berlaku untuk transaksi berikutnya

---

## Transparansi Biaya

Sebelum pembayaran, pengguna akan melihat:

```text
Biaya Konsultasi
Rp100.000
```

Sedangkan advokat akan melihat:

```text
Tarif Konsultasi
Rp100.000

Komisi Platform
Rp10.000

Pendapatan Bersih
Rp90.000
```

Hal ini bertujuan menjaga transparansi antara platform dan advokat.