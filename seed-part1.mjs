import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
  // 1. Insert new categories
  const { error: catErr } = await supabase.from('legal_categories').upsert([
    { id: 'c5000000-0000-0000-0000-000000000005', name: 'Hukum Ketenagakerjaan', description: 'Pahami hak-hak pekerja, PHK, pesangon, kontrak kerja, dan penyelesaian sengketa hubungan industrial.' },
    { id: 'c6000000-0000-0000-0000-000000000006', name: 'Hukum Perjanjian & Kontrak', description: 'Pelajari syarat sah kontrak, wanprestasi, MoU, NDA, dan cara menyusun perjanjian yang mengikat secara hukum.' },
    { id: 'c7000000-0000-0000-0000-000000000007', name: 'Hukum Pajak & Keuangan', description: 'Panduan perpajakan untuk individu dan badan usaha, termasuk sanksi pajak, pelaporan SPT, dan penyelesaian sengketa pajak.' },
  ], { onConflict: 'id' });
  if (catErr) console.error('Category error:', catErr.message);
  else console.log('Categories inserted');

  // 2. Ketenagakerjaan materials
  const ketenagakerjaan = [
    {
      id: 'd5000000-0000-0000-0000-000000000001',
      category_id: 'c5000000-0000-0000-0000-000000000005',
      title: 'Hak-Hak Dasar Pekerja di Indonesia',
      order_index: 1, is_premium: false, required_tier: 'free',
      content: `# Hak-Hak Dasar Pekerja di Indonesia

Setiap pekerja di Indonesia dilindungi oleh **UU No. 13 Tahun 2003 tentang Ketenagakerjaan** sebagaimana diubah oleh **UU No. 6 Tahun 2023 (UU Cipta Kerja)**. Memahami hak-hak dasar ini sangat penting agar Anda tidak dirugikan oleh pemberi kerja.

## 1. Hak Atas Upah yang Layak

Berdasarkan **Pasal 88 UU Ketenagakerjaan**, setiap pekerja berhak memperoleh penghasilan yang memenuhi penghidupan yang layak bagi kemanusiaan. Upah Minimum ditetapkan oleh Gubernur setiap tahun berdasarkan formula yang mempertimbangkan pertumbuhan ekonomi dan inflasi.

> **Penting:** Pemberi kerja yang membayar upah di bawah Upah Minimum diancam pidana penjara paling singkat 1 tahun dan paling lama 4 tahun dan/atau denda paling sedikit Rp 100 juta dan paling banyak Rp 400 juta (Pasal 185 UU Ketenagakerjaan).

## 2. Hak Atas Waktu Kerja dan Istirahat

**Pasal 77 UU Ketenagakerjaan** mengatur:
- **7 jam/hari** dan 40 jam/minggu untuk 6 hari kerja, ATAU
- **8 jam/hari** dan 40 jam/minggu untuk 5 hari kerja.

Kelebihan jam kerja dihitung sebagai **lembur** dan wajib dibayar sesuai **PP No. 35 Tahun 2021**: jam pertama 1,5x upah per jam, jam berikutnya 2x upah per jam.

## 3. Hak Cuti

- **Cuti Tahunan:** Minimal 12 hari kerja setelah bekerja 12 bulan berturut-turut (Pasal 79 ayat 3).
- **Cuti Sakit:** Pekerja yang sakit berhak atas cuti dengan tetap dibayar. Untuk sakit berkepanjangan: 4 bulan pertama 100%, 4 bulan kedua 75%, 4 bulan ketiga 50%, dan 4 bulan keempat 25% (Pasal 93 ayat 3).
- **Cuti Melahirkan:** 3 bulan (1,5 bulan sebelum dan 1,5 bulan sesudah melahirkan) dengan upah penuh (Pasal 82).

## 4. Hak Atas Jaminan Sosial (BPJS)

Setiap pemberi kerja **WAJIB** mendaftarkan pekerjanya dalam program:
- **BPJS Kesehatan** (jaminan kesehatan)
- **BPJS Ketenagakerjaan**: JKK (Kecelakaan Kerja), JKM (Kematian), JHT (Hari Tua), JP (Pensiun)

Pelanggaran kewajiban ini dapat dikenai sanksi administratif hingga pencabutan izin usaha.

Pastikan Anda memahami hak-hak ini agar posisi Anda sebagai pekerja terlindungi secara hukum.`
    },
    {
      id: 'd5000000-0000-0000-0000-000000000002',
      category_id: 'c5000000-0000-0000-0000-000000000005',
      title: 'Panduan PHK dan Perhitungan Pesangon Lengkap',
      order_index: 2, is_premium: true, required_tier: 'basic',
      content: `# Panduan PHK dan Perhitungan Pesangon Lengkap

Pemutusan Hubungan Kerja (PHK) adalah momen krusial yang memiliki dampak besar. Rujukan utamanya adalah **UU No. 6 Tahun 2023** dan **PP No. 35 Tahun 2021**.

## Alasan PHK yang Sah (Pasal 154A UU Cipta Kerja)

1. **Merger/Akuisisi** — Pekerja yang menolak melanjutkan berhak atas 1x UP + 1x UPMK + UPH.
2. **Efisiensi karena kerugian** — 0,5x UP + 1x UPMK + UPH.
3. **Perusahaan tutup akibat Force Majeure** — 0,75x UP + 1x UPMK + UPH.
4. **Pelanggaran Peraturan Perusahaan** — Harus didahului SP1, SP2, SP3. Hak: 0,5x UP + 1x UPMK + UPH.
5. **Pelanggaran Berat** (Pasal 158): pencurian, penggelapan, mabuk di tempat kerja — Hak: UPH saja.
6. **Pekerja Resign** — Hanya berhak UPH + Uang Pisah (jika diatur dalam PK/PP/PKB).

## Tabel Uang Pesangon (UP) — Pasal 40 PP 35/2021

| Masa Kerja | UP |
|---|---|
| < 1 tahun | 1 bulan upah |
| 1-2 tahun | 2 bulan upah |
| 2-3 tahun | 3 bulan upah |
| 3-4 tahun | 4 bulan upah |
| 4-5 tahun | 5 bulan upah |
| 5-6 tahun | 6 bulan upah |
| 6-7 tahun | 7 bulan upah |
| 7-8 tahun | 8 bulan upah |
| ≥ 8 tahun | **9 bulan upah** (maksimal) |

## Tabel UPMK — Pasal 40 PP 35/2021

| Masa Kerja | UPMK |
|---|---|
| 3-6 tahun | 2 bulan upah |
| 6-9 tahun | 3 bulan upah |
| 9-12 tahun | 4 bulan upah |
| 12-15 tahun | 5 bulan upah |
| 15-18 tahun | 6 bulan upah |
| 18-21 tahun | 7 bulan upah |
| 21-24 tahun | 8 bulan upah |
| ≥ 24 tahun | **10 bulan upah** (maksimal) |

## Contoh Perhitungan

**Kasus:** Karyawan dengan masa kerja 10 tahun, gaji Rp 8 juta/bulan, di-PHK karena efisiensi.
- UP = 9 bulan x Rp 8 juta = Rp 72 juta
- Pengali efisiensi = 0,5x → Rp 36 juta
- UPMK = 4 bulan x Rp 8 juta = Rp 32 juta
- **Total minimum = Rp 68 juta + UPH (sisa cuti dll)**

> **Tips:** Jangan pernah menandatangani surat resign jika Anda sebenarnya di-PHK. Ini akan menghilangkan hak pesangon Anda secara hukum.`
    },
    {
      id: 'd5000000-0000-0000-0000-000000000003',
      category_id: 'c5000000-0000-0000-0000-000000000005',
      title: 'Kontrak Kerja PKWT vs PKWTT: Perbedaan dan Hak Anda',
      order_index: 3, is_premium: true, required_tier: 'basic',
      content: `# Kontrak Kerja PKWT vs PKWTT

Memahami jenis kontrak kerja Anda adalah langkah pertama melindungi hak. Di Indonesia terdapat dua jenis utama: **PKWT** (Perjanjian Kerja Waktu Tertentu) dan **PKWTT** (Perjanjian Kerja Waktu Tidak Tertentu).

## PKWT (Kontrak) — Pasal 56-59 UU Ketenagakerjaan

PKWT hanya boleh dibuat untuk pekerjaan yang:
- Bersifat sementara dan selesai dalam waktu tertentu
- Bersifat musiman
- Berkaitan dengan produk/kegiatan baru yang masih dalam tahap percobaan

**Aturan Pasca UU Cipta Kerja:**
- Jangka waktu PKWT **paling lama 5 tahun** (termasuk perpanjangan).
- Jika melebihi 5 tahun, **otomatis berubah menjadi PKWTT** (karyawan tetap).
- Pekerja PKWT berhak atas **Uang Kompensasi** saat kontrak berakhir (Pasal 61A): 1 bulan upah per 12 bulan masa kerja.

## PKWTT (Karyawan Tetap)

PKWTT tidak memiliki batas waktu dan berlaku sampai pekerja pensiun, resign, atau di-PHK. Karyawan PKWTT berhak atas:
- Masa percobaan maksimal 3 bulan (Pasal 60)
- Pesangon penuh jika di-PHK
- Semua hak cuti dan jaminan sosial

## Perbandingan

| Aspek | PKWT | PKWTT |
|---|---|---|
| Durasi | Maks 5 tahun | Tidak terbatas |
| Masa Percobaan | Dilarang | Maks 3 bulan |
| PHK | Kompensasi sisa kontrak | Pesangon penuh |
| Status | Kontrak | Tetap |

> **Peringatan Hukum (Pasal 57 ayat 2):** PKWT yang dibuat secara lisan (tidak tertulis) **otomatis dianggap PKWTT**. Artinya, jika perusahaan mempekerjakan Anda tanpa kontrak tertulis, Anda secara hukum adalah karyawan tetap.`
    },
    {
      id: 'd5000000-0000-0000-0000-000000000004',
      category_id: 'c5000000-0000-0000-0000-000000000005',
      title: 'Penyelesaian Sengketa Hubungan Industrial',
      order_index: 4, is_premium: true, required_tier: 'professional',
      content: `# Penyelesaian Sengketa Hubungan Industrial

Sengketa antara pekerja dan perusahaan diatur dalam **UU No. 2 Tahun 2004 tentang Penyelesaian Perselisihan Hubungan Industrial (PPHI)**. Proses ini memiliki tahapan yang wajib dilalui secara berurutan.

## Jenis Perselisihan (Pasal 2)

1. **Perselisihan Hak** — Hak normatif yang sudah diatur UU tidak dipenuhi (contoh: upah tidak dibayar).
2. **Perselisihan Kepentingan** — Perbedaan pendapat mengenai syarat kerja baru (contoh: negosiasi kenaikan gaji gagal).
3. **Perselisihan PHK** — Ketidaksepakatan mengenai PHK.
4. **Perselisihan Antar Serikat Pekerja** — Konflik keanggotaan atau kewenangan antar serikat.

## Tahapan Penyelesaian Wajib

### Tahap 1: Perundingan Bipartit (Pasal 3-7)
Perundingan langsung antara pekerja dan pengusaha. **Wajib** diselesaikan paling lama **30 hari kerja**. Jika gagal, lanjut ke tahap berikutnya.

### Tahap 2: Tripartit (Pasal 8-28)
Melibatkan pihak ketiga melalui Dinas Ketenagakerjaan (Disnaker). Terdapat 3 mekanisme:
- **Mediasi** (oleh Mediator Disnaker) — paling umum digunakan
- **Konsiliasi** — untuk perselisihan kepentingan dan antar serikat
- **Arbitrase** — keputusannya bersifat final dan mengikat

### Tahap 3: Pengadilan Hubungan Industrial / PHI (Pasal 55-115)
Jika mediasi gagal, salah satu pihak dapat mengajukan gugatan ke PHI di Pengadilan Negeri. Putusan PHI untuk perselisihan hak dan PHK **dapat dikasasi** ke Mahkamah Agung.

## Hak Pekerja Selama Proses

Berdasarkan **Pasal 155 ayat 3 UU Ketenagakerjaan**: selama proses PHK belum mendapat penetapan dari lembaga PPHI, **pekerja dan pengusaha harus tetap melaksanakan segala kewajibannya**. Artinya, pekerja tetap berhak menerima upah selama proses berlangsung.

> **Strategi:** Selalu dokumentasikan setiap perundingan bipartit dalam notulen tertulis yang ditandatangani kedua pihak. Dokumen ini menjadi bukti kunci jika kasus berlanjut ke PHI.`
    }
  ];

  const { error: ketErr } = await supabase.from('legal_materials').upsert(ketenagakerjaan, { onConflict: 'id' });
  if (ketErr) console.error('Ketenagakerjaan error:', ketErr.message);
  else console.log('Ketenagakerjaan materials inserted:', ketenagakerjaan.length);
}

run().catch(console.error);
