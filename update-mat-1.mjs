import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function updateMaterials() {
  const updates = [
    {
      title: "Fundamental Hukum Perjanjian: Syarat Sah Kontrak",
      content: `
# Fundamental Hukum Perjanjian: Syarat Sah Kontrak

Setiap hari kita melakukan perjanjian, mulai dari membeli kopi hingga menandatangani kontrak bernilai miliaran rupiah. Namun, apakah kontrak Anda mengikat secara hukum? Di Indonesia, landasan utama dari sahnya sebuah kontrak diatur dengan tegas dalam **Pasal 1320 Kitab Undang-Undang Hukum Perdata (KUHPerdata)**.

## 4 Syarat Sah Perjanjian (Pasal 1320 KUHPerdata)

Agar sebuah perjanjian mengikat dan diakui hukum, ia harus memenuhi 4 syarat mutlak:

### 1. Kesepakatan Mereka yang Mengikatkan Dirinya (Syarat Subjektif)
Kedua belah pihak harus setuju tanpa adanya paksaan (*dwang*), kekhilafan (*dwaling*), atau penipuan (*bedrog*).
> **Contoh Masalah:** Anda dipaksa menandatangani kontrak penjualan tanah di bawah ancaman kekerasan. Kesepakatan ini tidak sah karena adanya unsur paksaan.

### 2. Kecakapan untuk Membuat Suatu Perikatan (Syarat Subjektif)
Pihak yang membuat perjanjian harus "cakap" secara hukum. Menurut Pasal 330 KUHPerdata, mereka harus sudah dewasa (berusia 21 tahun atau sudah menikah) dan tidak berada di bawah pengampuan (gangguan jiwa atau pemboros).
> **Contoh Masalah:** Seorang anak berusia 16 tahun menandatangani kontrak pembelian mobil mewah. Karena ia belum cakap hukum, orang tuanya dapat meminta pengadilan untuk membatalkan kontrak tersebut.

### 3. Suatu Hal Tertentu (Syarat Objektif)
Objek yang diperjanjikan harus jelas, spesifik, dan dapat ditentukan jenis serta jumlahnya.
> **Contoh Masalah:** Anda membuat kontrak jual beli "sebidang tanah". Ini tidak sah karena tidak jelas luasnya, batas-batasnya, dan nomor sertifikatnya. Harus spesifik, misalnya: "Satu bidang tanah Hak Milik No. 123 seluas 500 meter persegi di Jl. Sudirman."

### 4. Suatu Sebab yang Halal (Syarat Objektif)
Isi perjanjian tidak boleh bertentangan dengan undang-undang yang berlaku, ketertiban umum, atau kesusilaan.
> **Contoh Masalah:** Anda membuat kontrak sewa-menyewa rumah yang secara eksplisit disebutkan akan digunakan sebagai tempat perjudian terselubung. Karena perjudian dilarang oleh undang-undang, sebabnya menjadi tidak halal.

## Akibat Hukum Jika Syarat Tidak Terpenuhi

Sangat penting untuk memahami perbedaan akibat hukumnya:

- **Dapat Dibatalkan (Voidable):** Jika syarat subjektif (Poin 1 & 2) dilanggar, perjanjian tersebut **tetap berlaku** sampai ada pihak yang merasa dirugikan mengajukan pembatalan ke pengadilan dan hakim memutuskan membatalkannya.
- **Batal Demi Hukum (Null and Void):** Jika syarat objektif (Poin 3 & 4) dilanggar, maka secara otomatis (sejak awal) perjanjian itu **dianggap tidak pernah ada**. Tidak perlu ada keputusan hakim; kontrak itu batal dengan sendirinya.

Pastikan setiap kontrak bisnis Anda melalui *review* legal untuk memastikan keempat unsur ini terpenuhi dengan sempurna.
      `
    },
    {
      title: "Panduan Pemutusan Hubungan Kerja (PHK) dan Perhitungan Pesangon",
      content: `
# Panduan Lengkap Pemutusan Hubungan Kerja (PHK) dan Perhitungan Pesangon

Proses PHK adalah salah satu ranah hukum yang paling sensitif dan berpotensi tinggi berujung pada sengketa di Pengadilan Hubungan Industrial (PHI). Saat ini, rujukan utamanya adalah **Undang-Undang No. 6 Tahun 2023** (Penetapan Perppu Cipta Kerja menjadi UU) dan aturan turunannya yaitu **Peraturan Pemerintah (PP) No. 35 Tahun 2021**.

## Alasan PHK yang Dibenarkan Secara Hukum

Perusahaan tidak boleh melakukan PHK sepihak tanpa alasan yang jelas. Berdasarkan Pasal 154A UU Ketenagakerjaan (pasca UU Cipta Kerja), alasan PHK yang diizinkan meliputi:
1. **Perusahaan melakukan penggabungan (Merger), peleburan, pemisahan, atau pengambilalihan (Akuisisi).**
2. **Efisiensi:** Baik disertai dengan penutupan perusahaan maupun tidak (biasanya karena kerugian).
3. **Perusahaan tutup** karena mengalami kerugian secara terus-menerus selama 2 tahun, atau keadaan memaksa (*Force Majeure*).
4. **Pekerja melanggar Peraturan Perusahaan/PKB:** Harus didahului dengan pemberian Surat Peringatan (SP) Pertama, Kedua, dan Ketiga secara berturut-turut.
5. **Pekerja mengundurkan diri secara sukarela (Resign).**
6. **Pelanggaran Bersifat Mendesak (Pelanggaran Berat):** Misalnya melakukan pencurian, penggelapan, mabuk di tempat kerja, atau membocorkan rahasia perusahaan.

> **Contoh Masalah:** Perusahaan mem-PHK karyawan hanya karena karyawan tersebut sering terlambat, namun perusahaan tidak pernah memberikan SP 1, 2, atau 3. Karyawan dapat menggugat ke Disnaker dan PHK tersebut bisa dibatalkan atau perusahaan dihukum membayar kompensasi lebih besar.

## Komponen Hak Karyawan Akibat PHK

Sesuai PP No. 35/2021, karyawan tetap (PKWTT) yang di-PHK berhak atas:
- **Uang Pesangon (UP):** Diberikan berdasarkan masa kerja, maksimal 9 bulan upah untuk masa kerja 8 tahun atau lebih.
- **Uang Penghargaan Masa Kerja (UPMK):** Diberikan kepada pekerja dengan masa kerja minimal 3 tahun. Maksimal 10 bulan upah.
- **Uang Penggantian Hak (UPH):** Meliputi sisa cuti tahunan yang belum gugur, dan ongkos pulang pekerja.

## Pengali (Multiplier) Pesangon Berdasarkan Alasan PHK

UU Cipta Kerja mengubah skema pesangon lama. Kini, jumlah pesangon sangat bergantung pada *alasan* PHK tersebut (Pasal 40-57 PP 35/2021):

- **Efisiensi (tanpa penutupan perusahaan):** 0,5 x UP + 1 x UPMK + UPH.
- **Perusahaan Merger/Akuisisi (pekerja tidak mau lanjut):** 1 x UP + 1 x UPMK + UPH.
- **Pekerja melanggar SP3:** 0,5 x UP + 1 x UPMK + UPH.
- **Pekerja memasuki usia Pensiun:** 1,75 x UP + 1 x UPMK + UPH.

### Kasus Khusus: Karyawan Resign
Jika karyawan mengundurkan diri atas kemauan sendiri secara tertulis, ia **TIDAK berhak** mendapatkan Uang Pesangon dan UPMK. Ia hanya berhak mendapatkan **Uang Penggantian Hak (UPH)** dan **Uang Pisah** (jika besarannya diatur dalam Perjanjian Kerja atau Peraturan Perusahaan).

> **Contoh Masalah:** Karyawan senior (masa kerja 10 tahun) dipaksa menandatangani surat *resign* agar perusahaan tidak perlu membayar pesangon. Jika karyawan bisa membuktikan di pengadilan adanya paksaan tersebut, maka *resign* dianggap batal dan dikonversi menjadi PHK sepihak, sehingga perusahaan diwajibkan membayar pesangon penuh (multiplier 1 atau 2 kali tergantung putusan hakim).
      `
    }
  ];

  for (const item of updates) {
    const { error } = await supabase.from('legal_materials').update({ content: item.content }).eq('title', item.title);
    if (error) console.error("Error updating", item.title, error.message);
    else console.log("Updated:", item.title);
  }
}

updateMaterials();
