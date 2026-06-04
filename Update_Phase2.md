# Pembaruan Fitur KonsultanAI

Berikut adalah daftar fitur dan perbaikan yang baru saja diselesaikan. **PENTING: Anda harus mengeksekusi file SQL secara manual di Supabase Dashboard.**

## 1. Perbaikan Marketplace & Keamanan Database
- Membuat file `supabase/migration_marketplace_fixes.sql`
- Memperbaiki validasi role sehingga user bisa diupdate menjadi `advokat`.
- Mengatur RLS untuk Admin agar bisa melihat dan memodifikasi semua data (Booking, Withdrawal, Advocate).
- Menyiapkan Storage Bucket `advocate-docs` dengan permission RLS yang tepat untuk upload dokumen.

## 2. Peningkatan UI Marketplace
- Menampilkan **foto formal** advokat secara langsung pada card di grid `/marketplace` dan di dalam modal detail.
- Jika foto belum diunggah, sistem akan fallback menggunakan inisial secara dinamis (seperti "TA").

## 3. Sistem Live Chat Konsultasi Berbayar
- Membuat file `supabase/migration_consultation_chat.sql` untuk skema database (tabel `consultation_rooms` dan `consultation_messages`) yang mendukung realtime WebSocket.
- Menambahkan Endpoint API `/api/booking/confirm` yang secara otomatis dipanggil setelah pembayaran Midtrans berhasil.
  - Membuat ruang chat eksklusif antara klien dan advokat yang berlakukan selama 7 hari.
  - Menambah otomatis saldo pendapatan advokat.
  - Mengirim pesan sambutan sistem ke dalam chat.
- Mengubah alur setelah pembayaran sukses di marketplace untuk me-redirect user langsung ke halaman chat.
- Membangun Halaman **Dashboard Konsultasi** (`/konsultasi-advokat`) yang melist seluruh ruang chat aktif maupun selesai (support view bagi klien dan advokat).
- Membangun Halaman **Live Chat Room** (`/konsultasi-advokat/[roomId]`) yang langsung tersinkronisasi via Real-time Supabase.
- Menambahkan navigasi *Chat Klien* di profil drop-down dan Dashboard Advokat.

---

### Tindakan Selanjutnya (Wajib Dilakukan)

Silakan buka **Supabase Dashboard -> SQL Editor**, lalu *copy-paste* dan jalankan kode dari file berikut secara berurutan:

1. `supabase/marketplace_schema.sql` (Jika sebelumnya belum dijalankan)
2. `supabase/migration_marketplace_fixes.sql`
3. `supabase/migration_consultation_chat.sql`

Setelah SQL dijalankan, Anda bisa mencoba alur penuh:
**Daftar Advokat -> Update Verifikasi via DB -> User Booking Advokat -> Bayar Midtrans -> Chat Real-time!**
