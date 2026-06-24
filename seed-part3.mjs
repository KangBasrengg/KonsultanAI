import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
  // Additional materials for existing categories
  const materials = [
    // === HUKUM PIDANA (c1) ===
    {
      id: 'd1000000-0000-0000-0000-000000000004',
      category_id: 'c1000000-0000-0000-0000-000000000001',
      title: 'Cara Mengajukan Laporan Polisi atas Kasus Penggelapan',
      order_index: 4, is_premium: true, required_tier: 'basic',
      content: `# Cara Mengajukan Laporan Polisi atas Kasus Penggelapan

Penggelapan diatur dalam **Pasal 372 KUHP**: "Barang siapa dengan sengaja dan melawan hukum memiliki barang sesuatu yang seluruhnya atau sebagian adalah kepunyaan orang lain, tetapi yang ada dalam kekuasaannya bukan karena kejahatan, diancam karena penggelapan, dengan pidana penjara paling lama empat tahun atau pidana denda paling banyak sembilan ratus rupiah."

## Perbedaan Penggelapan vs Pencurian

| Aspek | Pencurian (Pasal 362) | Penggelapan (Pasal 372) |
|---|---|---|
| Penguasaan barang | Diambil secara melawan hukum | Sudah ada di tangan pelaku secara sah |
| Contoh | Mengambil HP dari meja orang | Diberi titipan HP lalu dijual |
| Unsur kunci | "Mengambil" | "Memiliki barang yang ada padanya" |

## Langkah Pelaporan

### 1. Kumpulkan Bukti
- Bukti bahwa barang memang dipercayakan kepada pelaku (kwitansi serah terima, kontrak titipan, perjanjian kerja)
- Bukti komunikasi (WhatsApp, email) yang menunjukkan pelaku mengakui menerima barang
- Bukti kerugian materil (nilai barang yang digelapkan)

### 2. Datang ke SPKT Polsek/Polres
Bawa KTP asli, bukti-bukti tercetak, dan kronologi tertulis. Anda akan diminta membuat **Laporan Polisi (LP)** dan mendapatkan **Surat Tanda Penerimaan Laporan (STPL)**.

### 3. Proses Penyidikan
Penyidik akan memanggil pelaku untuk dimintai keterangan (BAP). Jika bukti cukup, berkas perkara (P-19/P-21) akan dilimpahkan ke Kejaksaan.

> **Tips Hukum:** Penggelapan dalam jabatan (**Pasal 374 KUHP**) memiliki ancaman lebih berat: 5 tahun penjara. Ini berlaku jika pelaku menggelapkan barang karena hubungan kerja, seperti karyawan yang menggelapkan uang perusahaan.`
    },
    {
      id: 'd1000000-0000-0000-0000-000000000005',
      category_id: 'c1000000-0000-0000-0000-000000000001',
      title: 'Hukum Pidana Korupsi: Ancaman dan Mekanisme Pelaporan',
      order_index: 5, is_premium: true, required_tier: 'professional',
      content: `# Hukum Pidana Korupsi: Ancaman dan Mekanisme Pelaporan

Korupsi di Indonesia diatur secara khusus dalam **UU No. 31 Tahun 1999** jo. **UU No. 20 Tahun 2001 tentang Pemberantasan Tindak Pidana Korupsi**. Undang-undang ini bersifat *lex specialis* (hukum khusus) yang mengenyampingkan ketentuan KUHP.

## Bentuk-Bentuk Tindak Pidana Korupsi

### 1. Kerugian Keuangan Negara (Pasal 2 & 3)
- **Pasal 2:** Memperkaya diri sendiri/orang lain/korporasi secara melawan hukum yang merugikan keuangan negara. Ancaman: **4-20 tahun penjara + denda Rp 200 juta - Rp 1 miliar**.
- **Pasal 3:** Menyalahgunakan kewenangan, kesempatan, atau sarana jabatan. Ancaman: **1-20 tahun penjara**.

### 2. Suap-Menyuap (Pasal 5, 6, 11, 12, 13)
Memberi atau menerima sesuatu kepada/dari penyelenggara negara untuk berbuat atau tidak berbuat sesuatu. Berlaku bagi **pemberi** DAN **penerima** suap.

### 3. Penggelapan dalam Jabatan (Pasal 8, 9, 10)
Pegawai negeri yang menggelapkan uang atau surat berharga yang disimpan karena jabatannya.

### 4. Gratifikasi (Pasal 12B & 12C)
Pemberian dalam arti luas yang diterima PNS/penyelenggara negara yang berhubungan dengan jabatannya. Gratifikasi > Rp 10 juta **dianggap suap** kecuali penerima melaporkannya ke KPK dalam **30 hari kerja**.

## Cara Melaporkan Dugaan Korupsi

1. **KPK (Komisi Pemberantasan Korupsi):** Melalui website pengaduan.kpk.go.id atau Hotline 198.
2. **Kejaksaan:** Lapor ke Bidang Pidana Khusus (Pidsus) Kejaksaan Tinggi.
3. **Kepolisian:** Lapor ke Direktorat Reserse Kriminal Khusus (Ditreskrimsus).

> **Perlindungan Pelapor:** Berdasarkan **UU No. 31 Tahun 2014 tentang Perlindungan Saksi dan Korban**, pelapor korupsi berhak atas perlindungan identitas dan keamanan fisik dari LPSK.`
    },

    // === HUKUM PERDATA (c2) ===
    {
      id: 'd2000000-0000-0000-0000-000000000003',
      category_id: 'c2000000-0000-0000-0000-000000000002',
      title: 'Hukum Waris di Indonesia: Pembagian Harta Peninggalan',
      order_index: 3, is_premium: true, required_tier: 'basic',
      content: `# Hukum Waris di Indonesia: Pembagian Harta Peninggalan

Indonesia memiliki 3 sistem hukum waris yang berlaku bersamaan: **Hukum Waris KUHPerdata** (BW), **Hukum Waris Islam** (Kompilasi Hukum Islam), dan **Hukum Waris Adat**. Pilihan sistem bergantung pada agama dan kesepakatan keluarga.

## Hukum Waris KUHPerdata (Pasal 830-1130)

### Ahli Waris Menurut Undang-Undang (Ab Intestato)

Dibagi dalam 4 golongan berdasarkan kedekatan hubungan darah:

| Golongan | Ahli Waris | Bagian |
|---|---|---|
| I | Suami/istri + anak-anak | Bagian yang sama rata |
| II | Orang tua + saudara kandung | Masing-masing min. 1/4 bagian |
| III | Kakek/nenek ke atas | Dibagi per garis (paternal/maternal) |
| IV | Saudara sepupu sampai derajat ke-6 | Paling terjauh yang berhak |

### Bagian Mutlak (Legitieme Portie) — Pasal 913-929

Ahli waris tertentu memiliki hak minimum yang **tidak bisa dihilangkan** bahkan oleh wasiat:
- **1 anak:** Legitieme portie = 1/2 dari harta
- **2 anak:** Masing-masing = 2/3 dibagi jumlah anak
- **3 anak atau lebih:** Masing-masing = 3/4 dibagi jumlah anak

## Hukum Waris Islam (Kompilasi Hukum Islam Pasal 171-214)

- **Anak laki-laki** mendapat 2x bagian anak perempuan (2:1)
- **Istri** mendapat 1/4 jika tidak ada anak, atau 1/8 jika ada anak
- **Suami** mendapat 1/2 jika tidak ada anak, atau 1/4 jika ada anak
- Penyelesaian melalui **Pengadilan Agama**

## Langkah Hukum Pengurusan Waris

1. **Surat Keterangan Waris:** Dari RT/RW/Kelurahan (untuk pribumi), Notaris (untuk WNI keturunan), atau Balai Harta Peninggalan.
2. **Surat Keterangan Kematian** dari Kelurahan/RS.
3. **Akta Pembagian Waris** di hadapan Notaris jika disepakati bersama, atau melalui gugatan di Pengadilan Negeri/Pengadilan Agama jika ada sengketa.

> **Peringatan:** Menguasai harta warisan tanpa persetujuan ahli waris lain dapat dijerat **Pasal 372 KUHP** (Penggelapan) jika ada niat melawan hukum.`
    },
    {
      id: 'd2000000-0000-0000-0000-000000000004',
      category_id: 'c2000000-0000-0000-0000-000000000002',
      title: 'Hukum Perlindungan Konsumen dan Hak Anda',
      order_index: 4, is_premium: true, required_tier: 'basic',
      content: `# Hukum Perlindungan Konsumen dan Hak Anda

Hak-hak konsumen di Indonesia dilindungi oleh **UU No. 8 Tahun 1999 tentang Perlindungan Konsumen (UUPK)**. Undang-undang ini memberikan posisi tawar yang kuat bagi konsumen terhadap pelaku usaha.

## Hak Konsumen (Pasal 4 UUPK)

1. **Hak atas kenyamanan, keamanan, dan keselamatan** dalam menggunakan barang/jasa.
2. **Hak untuk memilih** dan mendapatkan barang/jasa sesuai nilai tukar dan jaminan yang dijanjikan.
3. **Hak atas informasi yang benar, jelas, dan jujur** mengenai kondisi dan jaminan barang/jasa.
4. **Hak untuk didengar** pendapat dan keluhannya.
5. **Hak untuk mendapat advokasi dan perlindungan** dalam penyelesaian sengketa.
6. **Hak untuk mendapat kompensasi, ganti rugi, atau penggantian** jika barang/jasa tidak sesuai.

## Kewajiban Pelaku Usaha (Pasal 7 UUPK)

- Beritikad baik dalam menjalankan kegiatan usaha
- Memberikan informasi yang benar, jelas, dan jujur
- Memperlakukan konsumen secara adil dan tidak diskriminatif
- **Menjamin mutu** barang/jasa berdasarkan standar mutu yang berlaku
- Memberikan **kompensasi/ganti rugi** atas kerugian konsumen

## Klausul Baku yang Dilarang (Pasal 18)

Pelaku usaha dilarang mencantumkan klausul baku yang:
- Menyatakan pengalihan tanggung jawab pelaku usaha
- Menyatakan pelaku usaha berhak menolak pengembalian barang
- Menyatakan konsumen tunduk pada peraturan baru sepihak
- Menyatakan tunduk pada peraturan berupa aturan baru yang dibuat sepihak oleh pelaku usaha

> **Contoh:** Tulisan "Barang yang sudah dibeli tidak dapat dikembalikan" di struk belanja **melanggar Pasal 18** jika barang tersebut ternyata cacat.

## Penyelesaian Sengketa

1. **BPSK (Badan Penyelesaian Sengketa Konsumen):** Jalur di luar pengadilan yang lebih cepat.
2. **Pengadilan Negeri:** Jika melalui BPSK tidak tercapai kesepakatan.
3. **YLKI (Yayasan Lembaga Konsumen Indonesia):** Lembaga advokasi konsumen.

> **Tips:** Selalu simpan bukti pembayaran (struk, invoice) dan dokumentasikan cacat/kerusakan barang dengan foto/video sebagai bukti klaim.`
    },

    // === HUKUM BISNIS (c3) ===
    {
      id: 'd3000000-0000-0000-0000-000000000004',
      category_id: 'c3000000-0000-0000-0000-000000000003',
      title: 'Hak Kekayaan Intelektual (HKI): Merek, Paten, dan Hak Cipta',
      order_index: 4, is_premium: true, required_tier: 'basic',
      content: `# Hak Kekayaan Intelektual (HKI): Merek, Paten, dan Hak Cipta

Melindungi kekayaan intelektual adalah investasi penting bagi setiap pelaku bisnis. Indonesia memiliki beberapa undang-undang yang mengatur HKI secara komprehensif.

## 1. Hak Cipta — UU No. 28 Tahun 2014

**Definisi:** Hak eksklusif pencipta yang timbul secara otomatis saat karya diwujudkan dalam bentuk nyata.

**Karakteristik:**
- **Tidak perlu didaftarkan** (otomatis melekat pada pencipta)
- Berlaku seumur hidup pencipta + 70 tahun setelah meninggal
- Melindungi: buku, musik, software, foto, film, arsitektur, dll.

**Pelanggaran (Pasal 113):** Pidana penjara maks 4 tahun dan/atau denda maks Rp 1 miliar untuk penggunaan komersial tanpa izin.

## 2. Merek — UU No. 20 Tahun 2016

**Definisi:** Tanda berupa gambar, nama, kata, huruf, angka, susunan warna, atau kombinasinya yang digunakan dalam kegiatan perdagangan.

**Proses Pendaftaran:**
1. Ajukan permohonan ke DJKI (Direktorat Jenderal Kekayaan Intelektual)
2. Pemeriksaan formalitas (30 hari)
3. Pengumuman publik (2 bulan)
4. Pemeriksaan substantif (150 hari)
5. **Sertifikat Merek** diterbitkan — berlaku **10 tahun**, dapat diperpanjang

**Biaya:** Mulai Rp 500.000 (UMKM) hingga Rp 1.800.000 (umum) per kelas.

## 3. Paten — UU No. 13 Tahun 2016

**Definisi:** Hak eksklusif atas invensi (penemuan) di bidang teknologi.

| Jenis | Durasi | Syarat |
|---|---|---|
| Paten Biasa | 20 tahun | Baru, mengandung langkah inventif, dapat diterapkan industri |
| Paten Sederhana | 10 tahun | Baru dan dapat diterapkan industri |

> **Tips Bisnis:** Daftarkan merek Anda **secepat mungkin**. Di Indonesia berlaku prinsip **first-to-file** (siapa yang mendaftar duluan, dialah pemilik merek), bukan siapa yang menggunakan duluan.`
    },

    // === HUKUM ITE (c4) ===
    {
      id: 'd4000000-0000-0000-0000-000000000004',
      category_id: 'c4000000-0000-0000-0000-000000000004',
      title: 'Penipuan Online: Langkah Hukum dan Pelaporan',
      order_index: 4, is_premium: true, required_tier: 'basic',
      content: `# Penipuan Online: Langkah Hukum dan Pelaporan

Penipuan online merupakan gabungan dari tindak pidana penipuan (**Pasal 378 KUHP**) dan pelanggaran **Pasal 28 ayat 1 UU ITE**: "Setiap Orang yang dengan sengaja dan tanpa hak menyebarkan berita bohong dan menyesatkan yang mengakibatkan kerugian konsumen dalam Transaksi Elektronik."

## Modus Penipuan Online yang Umum

1. **Toko Online Palsu** — Menerima pembayaran tapi tidak mengirim barang
2. **Phishing** — Meniru website resmi untuk mencuri data login/kartu kredit
3. **Skema Investasi Bodong** — Menjanjikan return tidak wajar (>30%/bulan)
4. **Love Scam** — Membangun hubungan emosional lalu meminta uang
5. **Job Scam** — Lowongan kerja palsu yang meminta biaya pendaftaran

## Dasar Hukum yang Berlaku

| Pasal | Ancaman | Konteks |
|---|---|---|
| **Pasal 378 KUHP** | Maks 4 tahun penjara | Penipuan umum |
| **Pasal 28 ayat 1 UU ITE** | Maks 6 tahun + denda Rp 1 miliar | Berita bohong di transaksi elektronik |
| **Pasal 45A ayat 1 UU ITE** | Maks 6 tahun + denda Rp 1 miliar | Sanksi pidana Pasal 28 |

## Langkah Pelaporan

### 1. Kumpulkan Bukti Digital
- Screenshot percakapan, halaman website/toko, dan iklan
- Bukti transfer/mutasi rekening
- Nomor telepon, rekening bank, dan profil pelaku
- **Penting:** Jangan hapus percakapan apapun!

### 2. Lapor ke Kepolisian
Bawa semua bukti ke **SPKT Polres** (untuk kerugian > Rp 50 juta bisa langsung ke Polda). Minta nomor LP dan STPL.

### 3. Lapor ke Otoritas Online
- **patrolisiber.id** — Portal pelaporan siber Polri
- **lapor.go.id** — Kanal pengaduan nasional
- **cekrekening.id** — Untuk melaporkan rekening yang digunakan penipuan (bisa diblokir)

### 4. Lapor ke Bank
Minta bank memblokir rekening penerima transfer. Sertakan salinan Laporan Polisi.

> **Tips:** Laporkan dalam **1x24 jam** setelah transfer agar bank masih bisa melakukan pemblokiran dan kemungkinan pengembalian dana lebih tinggi.`
    }
  ];

  const { error } = await supabase.from('legal_materials').upsert(materials, { onConflict: 'id' });
  if (error) console.error('Error:', error.message);
  else console.log('Additional materials inserted:', materials.length);

  // Insert quizzes for new materials
  const quizzes = [
    // Ketenagakerjaan
    { material_id: 'd5000000-0000-0000-0000-000000000001', question: 'Berapa jam kerja maksimal per minggu menurut UU Ketenagakerjaan?', options: '["35 jam", "40 jam", "45 jam", "48 jam"]', correct_option_index: 1 },
    { material_id: 'd5000000-0000-0000-0000-000000000002', question: 'Berapa bulan upah maksimal Uang Pesangon (UP) yang berhak diterima pekerja?', options: '["6 bulan", "8 bulan", "9 bulan", "12 bulan"]', correct_option_index: 2 },
    { material_id: 'd5000000-0000-0000-0000-000000000003', question: 'Apa yang terjadi jika PKWT dibuat secara lisan (tidak tertulis)?', options: '["Batal demi hukum", "Otomatis menjadi PKWTT", "Tetap berlaku sebagai PKWT", "Harus diulang"]', correct_option_index: 1 },
    // Perjanjian
    { material_id: 'd6000000-0000-0000-0000-000000000001', question: 'Pasal berapa KUHPerdata yang mengatur syarat sah perjanjian?', options: '["Pasal 1233", "Pasal 1320", "Pasal 1365", "Pasal 1338"]', correct_option_index: 1 },
    { material_id: 'd6000000-0000-0000-0000-000000000002', question: 'Berapa nilai materai yang berlaku saat ini berdasarkan UU Bea Meterai?', options: '["Rp 3.000", "Rp 6.000", "Rp 10.000", "Rp 12.000"]', correct_option_index: 2 },
    // Pajak
    { material_id: 'd7000000-0000-0000-0000-000000000001', question: 'Kapan batas akhir pelaporan SPT Tahunan untuk Orang Pribadi?', options: '["31 Januari", "28 Februari", "31 Maret", "30 April"]', correct_option_index: 2 },
    { material_id: 'd7000000-0000-0000-0000-000000000002', question: 'Berapa omzet PTKP UMKM Orang Pribadi yang tidak dikenai pajak (PP 55/2022)?', options: '["Rp 100 juta", "Rp 250 juta", "Rp 500 juta", "Rp 1 miliar"]', correct_option_index: 2 },
    // Existing categories additional
    { material_id: 'd1000000-0000-0000-0000-000000000004', question: 'Pasal berapa KUHP yang mengatur tentang penggelapan?', options: '["Pasal 362", "Pasal 372", "Pasal 378", "Pasal 385"]', correct_option_index: 1 },
    { material_id: 'd2000000-0000-0000-0000-000000000003', question: 'Dalam hukum waris KUHPerdata, berapa golongan ahli waris menurut undang-undang?', options: '["2 golongan", "3 golongan", "4 golongan", "5 golongan"]', correct_option_index: 2 },
    { material_id: 'd2000000-0000-0000-0000-000000000004', question: 'Pasal berapa UUPK yang melarang pencantuman klausul baku merugikan konsumen?', options: '["Pasal 4", "Pasal 7", "Pasal 18", "Pasal 23"]', correct_option_index: 2 },
    { material_id: 'd4000000-0000-0000-0000-000000000004', question: 'Website untuk melaporkan rekening yang digunakan untuk penipuan online adalah?', options: '["lapor.go.id", "patrolisiber.id", "cekrekening.id", "aduan.keminfo.go.id"]', correct_option_index: 2 },
  ];

  const { error: qErr } = await supabase.from('legal_quizzes').insert(quizzes);
  if (qErr) console.error('Quiz error:', qErr.message);
  else console.log('Quizzes inserted:', quizzes.length);
}

run().catch(console.error);
