# Next Plan & Backlog KonsultanAI

## 1. Sistem Subscription / Active Listing Advokat
- **Deskripsi:** Mengharuskan advokat membayar biaya *listing fee* (misal Rp 50.000 / bulan) agar profil mereka bisa tampil dan ditemukan di halaman Marketplace publik.
- **Alur Kerja (Workflow):**
  1. Advokat melakukan pendaftaran di `/daftar-advokat`.
  2. Admin memverifikasi dan mengklik **"Setujui"** di Dashboard Admin.
  3. Sistem secara otomatis mengirimkan chat/notifikasi/email tagihan kepada advokat untuk melakukan pembayaran Listing Fee (Rp 50.000).
  4. Advokat melakukan pembayaran (terintegrasi dengan Midtrans).
  5. Setelah sukses, sistem mengupdate tabel `listings` dan memasukkan `listing_status = 'active'`.
  6. Barulah profil advokat tersebut muncul di `/marketplace`.
- **Status Saat Ini:** Kode filternya sengaja di-*comment* / nonaktifkan selama masa testing agar pendaftaran advokat langsung muncul tanpa payment subscription.

## 2. Realtime Chat Konsultasi Berbayar (Setelah Booking)
- **Deskripsi:** Begitu pengguna selesai melakukan booking via Midtrans, sistem otomatis membuat ruang chat eksklusif.
- **Kebutuhan:** UI Chat Realtime, limitasi durasi konsultasi.
