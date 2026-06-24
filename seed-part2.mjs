import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
  // Hukum Perjanjian & Kontrak
  const perjanjian = [
    {
      id: 'd6000000-0000-0000-0000-000000000001',
      category_id: 'c6000000-0000-0000-0000-000000000006',
      title: 'Syarat Sah Perjanjian Menurut KUHPerdata',
      order_index: 1, is_premium: false, required_tier: 'free',
      content: `# Syarat Sah Perjanjian (Pasal 1320 KUHPerdata)

Setiap hari kita melakukan perjanjian, mulai dari membeli kopi hingga menandatangani kontrak miliaran rupiah. Agar mengikat secara hukum, perjanjian harus memenuhi **4 syarat mutlak** berdasarkan **Pasal 1320 KUHPerdata**.

## 1. Kesepakatan (Syarat Subjektif)
Kedua belah pihak harus setuju tanpa paksaan (*dwang*), kekhilafan (*dwaling*), atau penipuan (*bedrog*).
> **Contoh:** Anda dipaksa menandatangani perjanjian jual beli tanah di bawah ancaman. Kesepakatan ini tidak sah.

## 2. Kecakapan (Syarat Subjektif)
Pihak yang membuat perjanjian harus sudah dewasa (21 tahun atau sudah menikah) dan tidak di bawah pengampuan (**Pasal 330 KUHPerdata**).

## 3. Suatu Hal Tertentu (Syarat Objektif)
Objek perjanjian harus jelas dan spesifik — jenis, jumlah, dan identitasnya harus dapat ditentukan (**Pasal 1333 KUHPerdata**).

## 4. Sebab yang Halal (Syarat Objektif)
Isi perjanjian tidak boleh bertentangan dengan undang-undang, ketertiban umum, atau kesusilaan (**Pasal 1337 KUHPerdata**).

## Akibat Hukum

| Syarat Dilanggar | Akibat | Keterangan |
|---|---|---|
| Subjektif (1 & 2) | **Dapat Dibatalkan** | Perlu putusan hakim |
| Objektif (3 & 4) | **Batal Demi Hukum** | Otomatis dianggap tidak pernah ada |

## Asas-Asas Penting Hukum Perjanjian

- **Pacta Sunt Servanda (Pasal 1338 KUHPerdata):** Perjanjian yang dibuat secara sah berlaku sebagai undang-undang bagi para pembuatnya.
- **Asas Kebebasan Berkontrak:** Para pihak bebas menentukan isi kontrak selama tidak melanggar hukum.
- **Asas Itikad Baik (Pasal 1338 ayat 3):** Perjanjian harus dilaksanakan dengan itikad baik.

Pastikan setiap kontrak Anda melalui review legal untuk memastikan keempat unsur ini terpenuhi.`
    },
    {
      id: 'd6000000-0000-0000-0000-000000000002',
      category_id: 'c6000000-0000-0000-0000-000000000006',
      title: 'Panduan Menyusun Surat Perjanjian yang Sah',
      order_index: 2, is_premium: true, required_tier: 'basic',
      content: `# Panduan Menyusun Surat Perjanjian yang Sah

Surat perjanjian yang disusun dengan benar adalah perisai hukum terkuat Anda. Berdasarkan **Pasal 1320 jo. Pasal 1338 KUHPerdata**, berikut panduan strukturnya:

## Anatomi Surat Perjanjian

### 1. Judul Perjanjian
Harus jelas menggambarkan jenis perjanjian. Contoh: "Perjanjian Sewa Menyewa Rumah" atau "Perjanjian Kerja Sama Usaha Bersama".

### 2. Komparisi (Identitas Para Pihak)
Wajib mencantumkan:
- Nama lengkap sesuai KTP/Akta Perusahaan
- Tempat/tanggal lahir atau nomor akta pendirian
- Alamat lengkap
- Jabatan dan dasar kewenangan (untuk badan hukum)

### 3. Premis (Latar Belakang/Recital)
Menjelaskan mengapa perjanjian ini dibuat dan apa tujuan para pihak.

### 4. Isi Perjanjian (Pasal-Pasal)
- **Ruang Lingkup:** Deskripsi detail objek perjanjian
- **Hak & Kewajiban:** Rincian untuk masing-masing pihak
- **Jangka Waktu:** Kapan mulai dan berakhir
- **Nilai & Pembayaran:** Nominal, termin, metode pembayaran
- **Wanprestasi:** Konsekuensi jika salah satu pihak ingkar janji
- **Force Majeure:** Kondisi yang membebaskan tanggung jawab
- **Kerahasiaan (NDA):** Jika ada informasi sensitif
- **Penyelesaian Sengketa:** Musyawarah → Mediasi → Pengadilan

### 5. Penutup & Tanda Tangan
Ditandatangani di atas materai (sesuai **UU No. 10 Tahun 2020 tentang Bea Meterai**: Rp 10.000 untuk dokumen senilai > Rp 5 juta).

## Kesalahan Fatal yang Sering Terjadi

1. **Tidak mencantumkan klausul penyelesaian sengketa** — Jika terjadi konflik, tidak ada forum yang jelas.
2. **Identitas pihak tidak lengkap** — Bisa dipermasalahkan legal standing-nya.
3. **Menggunakan template tanpa penyesuaian** — Setiap transaksi bersifat unik.

> **Tips Hukum:** Perjanjian tetap sah secara hukum meskipun tanpa materai (Pasal 1320 KUHPerdata tidak mensyaratkan materai). Namun, materai diperlukan agar dokumen bisa dijadikan alat bukti di pengadilan.`
    },
    {
      id: 'd6000000-0000-0000-0000-000000000003',
      category_id: 'c6000000-0000-0000-0000-000000000006',
      title: 'Teknik Negosiasi Kontrak dan Klausul Kritis',
      order_index: 3, is_premium: true, required_tier: 'professional',
      content: `# Teknik Negosiasi Kontrak dan Klausul Kritis

Menyusun kontrak hanyalah separuh pertempuran. Menegosiasikannya dengan cerdas adalah seni yang membedakan profesional dari amatir. Panduan ini mengacu pada **Pasal 1338 KUHPerdata** (asas kebebasan berkontrak).

## 5 Klausul Kritis yang Wajib Dinegosiasikan

### 1. Limitation of Liability (Pembatasan Tanggung Jawab)
Membatasi total kerugian yang bisa dituntut. Tanpa klausul ini, Anda bisa dituntut ganti rugi tanpa batas berdasarkan **Pasal 1243-1252 KUHPerdata**.
> **Rumusan Ideal:** "Total tanggung jawab masing-masing pihak tidak melebihi nilai kontrak keseluruhan."

### 2. Indemnification (Ganti Rugi)
Mengatur siapa yang menanggung kerugian akibat klaim pihak ketiga. Penting dalam kontrak distribusi dan outsourcing.

### 3. Intellectual Property (Hak Kekayaan Intelektual)
Siapa pemilik karya yang dihasilkan selama kontrak? Berdasarkan **UU No. 28 Tahun 2014 tentang Hak Cipta**, pencipta secara default adalah pemilik, kecuali diatur lain dalam perjanjian.

### 4. Non-Compete & Non-Solicitation
Melarang pihak untuk bersaing langsung atau merekrut karyawan pihak lain selama periode tertentu pasca-kontrak. Harus wajar durasinya (6-24 bulan).

### 5. Governing Law & Dispute Resolution
Pilihan hukum mana yang berlaku dan forum penyelesaiannya. Untuk kontrak domestik, biasanya:
- Pilihan hukum: **Hukum Republik Indonesia**
- Forum: Musyawarah → BANI (Badan Arbitrase Nasional Indonesia) → Pengadilan Negeri

## Strategi Negosiasi Profesional

1. **Mulai dari draft Anda** — Pihak yang menyiapkan draft pertama memiliki keunggulan posisi.
2. **Identifikasi deal-breaker** — Pisahkan mana yang bisa dinegosiasikan dan mana yang tidak.
3. **Gunakan "redline"** — Tandai setiap perubahan agar transparan dan terlacak.
4. **Jangan terburu-buru** — Tekanan waktu adalah taktik negosiasi klasik.

> **Peringatan Hukum:** Klausul yang terlalu berat sebelah bisa dianggap bertentangan dengan **asas itikad baik (Pasal 1338 ayat 3 KUHPerdata)** dan berpotensi dibatalkan oleh hakim.`
    }
  ];

  const { error: pErr } = await supabase.from('legal_materials').upsert(perjanjian, { onConflict: 'id' });
  if (pErr) console.error('Perjanjian error:', pErr.message);
  else console.log('Perjanjian materials inserted:', perjanjian.length);

  // Hukum Pajak & Keuangan
  const pajak = [
    {
      id: 'd7000000-0000-0000-0000-000000000001',
      category_id: 'c7000000-0000-0000-0000-000000000007',
      title: 'Dasar-Dasar Perpajakan untuk Individu',
      order_index: 1, is_premium: false, required_tier: 'free',
      content: `# Dasar-Dasar Perpajakan untuk Individu

Pajak adalah kontribusi wajib kepada negara yang bersifat memaksa berdasarkan undang-undang (**Pasal 1 angka 1 UU KUP**). Setiap warga negara yang memiliki penghasilan di atas PTKP wajib memiliki NPWP dan melaporkan SPT Tahunan.

## Penghasilan Tidak Kena Pajak (PTKP) — PMK No. 101/2016

| Status | PTKP per Tahun |
|---|---|
| Tidak Kawin (TK/0) | Rp 54.000.000 |
| Kawin tanpa tanggungan (K/0) | Rp 58.500.000 |
| Kawin + 1 tanggungan (K/1) | Rp 63.000.000 |
| Kawin + 2 tanggungan (K/2) | Rp 67.500.000 |
| Kawin + 3 tanggungan (K/3) | Rp 72.000.000 |

## Tarif PPh 21 Progresif (UU HPP, berlaku sejak 2022)

| Penghasilan Kena Pajak | Tarif |
|---|---|
| Rp 0 - Rp 60 juta | 5% |
| Rp 60 juta - Rp 250 juta | 15% |
| Rp 250 juta - Rp 500 juta | 25% |
| Rp 500 juta - Rp 5 miliar | 30% |
| Di atas Rp 5 miliar | 35% |

## Kewajiban Pelaporan SPT

- **Batas Waktu SPT Tahunan Orang Pribadi:** 31 Maret setiap tahun (**Pasal 3 ayat 3 UU KUP**).
- **Sanksi Telat Lapor:** Denda Rp 100.000 untuk SPT Tahunan Orang Pribadi.
- **Sanksi Tidak Lapor:** Pidana penjara 6 bulan s.d. 6 tahun dan denda 2-4x jumlah pajak terutang (**Pasal 39 UU KUP**).

> **Tips:** Gunakan e-Filing di djponline.pajak.go.id untuk melaporkan SPT secara online. Gratis dan lebih cepat dibanding datang ke KPP.`
    },
    {
      id: 'd7000000-0000-0000-0000-000000000002',
      category_id: 'c7000000-0000-0000-0000-000000000007',
      title: 'Kewajiban Pajak UMKM dan PP 55/2022',
      order_index: 2, is_premium: true, required_tier: 'basic',
      content: `# Kewajiban Pajak UMKM dan PP 55/2022

Pemerintah memberikan kemudahan perpajakan bagi pelaku UMKM melalui skema **PPh Final 0,5%** yang diatur dalam **PP No. 55 Tahun 2022** (pengganti PP 23/2018).

## Siapa yang Berhak Menggunakan Tarif 0,5%?

Wajib Pajak (WP) dengan peredaran bruto (omzet) **tidak melebihi Rp 4,8 miliar per tahun**, baik orang pribadi maupun badan usaha.

## Fasilitas Baru: PTKP untuk UMKM Orang Pribadi

Berdasarkan **Pasal 60 PP 55/2022**, Wajib Pajak Orang Pribadi UMKM mendapat fasilitas **omzet Rp 500 juta pertama TIDAK dikenai pajak**!

> **Contoh:** Pak Ahmad punya toko dengan omzet Rp 800 juta/tahun. PPh Final yang terutang = 0,5% x (Rp 800 juta - Rp 500 juta) = 0,5% x Rp 300 juta = **Rp 1.500.000/tahun**.

## Batas Waktu Penggunaan Tarif PPh Final 0,5%

| Jenis WP | Durasi Maksimal |
|---|---|
| Orang Pribadi | 7 tahun pajak |
| Badan (CV, Koperasi, Firma) | 4 tahun pajak |
| PT (Perseroan Terbatas) | 3 tahun pajak |

Setelah periode tersebut berakhir, WP wajib menggunakan tarif PPh normal (progresif atau 22% untuk badan).

## Kewajiban Pelaporan

- **Setor PPh Final setiap bulan** paling lambat tanggal 15 bulan berikutnya.
- **Lapor SPT Masa** paling lambat tanggal 20 bulan berikutnya.
- **Lapor SPT Tahunan** sesuai batas waktu masing-masing (Maret untuk OP, April untuk Badan).

> **Peringatan:** Jika omzet Anda melewati Rp 4,8 miliar dalam satu tahun pajak, Anda wajib beralih ke tarif PPh normal mulai tahun pajak berikutnya dan harus menyelenggarakan pembukuan (bukan pencatatan).`
    },
    {
      id: 'd7000000-0000-0000-0000-000000000003',
      category_id: 'c7000000-0000-0000-0000-000000000007',
      title: 'Strategi Tax Planning Legal untuk Bisnis',
      order_index: 3, is_premium: true, required_tier: 'professional',
      content: `# Strategi Tax Planning Legal untuk Bisnis

Tax planning (perencanaan pajak) yang legal adalah hak setiap Wajib Pajak. Berbeda dengan penghindaran pajak ilegal (*tax evasion*), tax planning menggunakan celah yang diperbolehkan undang-undang untuk meminimalkan beban pajak.

## Prinsip Dasar (Tax Avoidance vs Tax Evasion)

- **Tax Avoidance (Legal):** Memanfaatkan fasilitas dan insentif pajak yang disediakan UU. Contoh: memanfaatkan PP 55/2022 untuk tarif 0,5%.
- **Tax Evasion (Ilegal):** Menyembunyikan omzet atau memalsukan faktur. Diancam pidana berdasarkan **Pasal 39 UU KUP**: penjara 6 bulan-6 tahun dan denda 2-4x pajak terutang.

## Strategi Tax Planning yang Diizinkan

### 1. Pemilihan Bentuk Badan Usaha
PT dikenai PPh Badan 22%, sedangkan UMKM bisa menikmati tarif 0,5%. Pilih bentuk badan usaha yang paling efisien secara pajak sesuai skala bisnis Anda.

### 2. Maksimalkan Biaya yang Dapat Dikurangkan (Deductible Expenses)
Berdasarkan **Pasal 6 UU PPh**, biaya yang boleh dikurangkan meliputi:
- Biaya gaji dan tunjangan karyawan
- Biaya sewa kantor dan utilitas
- Biaya penyusutan dan amortisasi aset
- Biaya penelitian dan pengembangan (R&D)
- Sumbangan yang diatur PP (bencana, pendidikan, olahraga)

### 3. Manfaatkan Insentif Pajak
- **Tax Holiday (PP 130/2020):** Pembebasan PPh Badan 100% untuk investasi di industri pionir dengan nilai minimal Rp 100 miliar.
- **Super Tax Deduction (PP 45/2019):** Pengurangan penghasilan bruto sampai 300% untuk kegiatan vokasi dan R&D.
- **Kawasan Ekonomi Khusus (KEK):** Fasilitas PPh Badan 10% dan pembebasan PPN.

### 4. Transfer Pricing yang Wajar
Untuk perusahaan grup, transaksi antar pihak afiliasi harus dilakukan berdasarkan **prinsip kewajaran (arm's length principle)** sesuai **Pasal 18 ayat 3 UU PPh**. Dokumentasi TP wajib disiapkan jika transaksi afiliasi melebihi threshold tertentu.

> **Peringatan:** Tax planning yang terlalu agresif bisa memicu pemeriksaan pajak. Selalu konsultasikan dengan konsultan pajak bersertifikat dan pastikan setiap strategi memiliki dasar hukum yang jelas.`
    }
  ];

  const { error: pjkErr } = await supabase.from('legal_materials').upsert(pajak, { onConflict: 'id' });
  if (pjkErr) console.error('Pajak error:', pjkErr.message);
  else console.log('Pajak materials inserted:', pajak.length);
}

run().catch(console.error);
