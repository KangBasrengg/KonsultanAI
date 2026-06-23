import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function updateMaterials() {
  const updates = [
    {
      title: "Memahami Wanprestasi dan Perbuatan Melawan Hukum (PMH)",
      content: `
# Memahami Wanprestasi dan Perbuatan Melawan Hukum (PMH)

Dalam hukum perdata, jika Anda mengalami kerugian materiil akibat perbuatan orang lain/perusahaan, ada dua dasar gugatan utama yang bisa Anda gunakan di Pengadilan Negeri: **Wanprestasi** (Ingkar Janji) atau **Perbuatan Melawan Hukum (PMH)**. Jangan sampai keliru, karena salah dasar gugatan akan berakibat gugatan Anda ditolak hakim (*Niet Ontvankelijke Verklaard* / NO).

## 1. Wanprestasi (Pasal 1243 KUHPerdata)

Wanprestasi **HANYA BISA** terjadi jika sudah ada **perjanjian (kontrak)** sebelumnya antara Anda dan tergugat. Wanprestasi terjadi jika tergugat tidak melaksanakan kewajibannya sesuai isi kontrak.

**Ada 3 bentuk Wanprestasi:**
1. Tidak melaksanakan kewajiban sama sekali.
2. Melaksanakan kewajiban tetapi terlambat.
3. Melaksanakan kewajiban tetapi tidak sesuai (salah/cacat).

> **Contoh Masalah:** Anda membuat kontrak dengan kontraktor untuk merenovasi rumah selesai dalam 3 bulan. Memasuki bulan ke-5, kontraktor belum juga menyelesaikan atap rumah Anda. Anda **TIDAK BISA** langsung melaporkannya ke polisi sebagai penipuan. Langkah legal yang benar adalah:
> 1. Kirim **Somasi (Surat Teguran)** 1, 2, dan 3 untuk mendesak kontraktor memenuhi kewajibannya.
> 2. Jika tetap diabaikan, gugat ke Pengadilan Negeri atas dasar **Wanprestasi (Pasal 1243 KUHPerdata)** untuk menuntut ganti rugi keterlambatan dan pembatalan kontrak.

## 2. Perbuatan Melawan Hukum (PMH - Pasal 1365 KUHPerdata)

Berbeda dengan Wanprestasi, PMH digunakan ketika **TIDAK ADA KONTRAK** di antara kedua belah pihak, namun tindakan seseorang melanggar hukum, melanggar hak orang lain, atau bertentangan dengan kepatutan/kesusilaan, sehingga menimbulkan kerugian.

**Syarat Gugatan PMH (Berdasarkan Pasal 1365):**
1. Ada perbuatan yang melawan hukum.
2. Ada kesalahan (kesengajaan atau kelalaian).
3. Ada kerugian nyata.
4. Ada hubungan sebab-akibat (kausalitas) antara perbuatan dan kerugian.

> **Contoh Masalah:** Pabrik kimia di sebelah tambak udang Anda membuang limbah berbahaya ke sungai. Akibatnya, seluruh udang Anda mati gagal panen. Anda tidak memiliki "kontrak" dengan pabrik kimia tersebut, sehingga Anda tidak bisa menggugat wanprestasi. Anda harus menggugat atas dasar **PMH (Pasal 1365 KUHPerdata)** karena perbuatan pabrik tersebut melanggar Undang-Undang Lingkungan Hidup dan merugikan hak properti Anda.
      `
    },
    {
      title: "Panduan Eksekusi Jaminan Fidusia dan Hak Tanggungan",
      content: `
# Panduan Tingkat Lanjut: Eksekusi Jaminan Fidusia & Hak Tanggungan

Bagi lembaga pembiayaan (Multifinance), Bank, atau Perusahaan Leasing, kredit macet (Non-Performing Loan/NPL) adalah risiko operasional tertinggi. Oleh karena itu, pengikatan jaminan yang kuat dan pemahaman prosedur eksekusi agunan sangat vital.

## 1. Eksekusi Jaminan Fidusia (Benda Bergerak) - UU No. 42/1999

Fidusia digunakan untuk benda bergerak, misalnya mobil, motor, atau mesin industri.
Kekuatan utama Sertifikat Jaminan Fidusia adalah adanya irah-irah *"Demi Keadilan Berdasarkan Ketuhanan Yang Maha Esa"*, yang artinya ia memiliki kekuatan eksekutorial yang sama dengan putusan pengadilan yang inkracht (Pasal 15 ayat 2 UU Jaminan Fidusia).

**Perubahan Prosedur Eksekusi (Putusan MK No. 18/PUU-XVII/2019):**
Dulu, debt collector leasing bisa langsung menarik kendaraan di jalan jika debitur menunggak. Namun, Mahkamah Konstitusi mengubah aturan main ini:
- **Jika Debitur Mengakui Wanprestasi & Sukarela Menyerahkan:** Leasing BISA melakukan penarikan mandiri.
- **Jika Debitur Menolak & Tidak Mengakui Wanprestasi:** Leasing **DILARANG KERAS** menarik paksa secara sepihak. Leasing **WAJIB** mengajukan permohonan pelaksanaan eksekusi kepada Pengadilan Negeri terlebih dahulu.
> **Contoh Masalah:** Debt collector menarik paksa mobil di tengah jalan disertai ancaman fisik. Debitur kemudian melapor ke Polisi. Sang debt collector (dan perusahaan leasing yang menyuruhnya) dapat dijerat pidana **Perampasan (Pasal 368 KUHP)** atau **Perbuatan Tidak Menyenangkan (Pasal 335 KUHP)**.

## 2. Eksekusi Hak Tanggungan (Benda Tidak Bergerak) - UU No. 4/1996

Hak Tanggungan (HT) digunakan untuk benda tidak bergerak, yaitu tanah dan bangunan. Wajib didaftarkan ke Badan Pertanahan Nasional (BPN) agar sah.

**Hak Istimewa Kreditur (Parate Executie):**
Sesuai Pasal 6 UU Hak Tanggungan, jika debitur cedera janji, pemegang HT pertama memiliki hak untuk menjual objek secara langsung melalui pelelangan umum, tanpa persetujuan debitur lagi, dan mengambil pelunasan piutangnya dari hasil penjualan tersebut.

> **Contoh Masalah:** Bank meminjamkan Rp 2 Miliar dengan agunan rumah. Debitur macet. Bank berhak mendaftarkan rumah tersebut ke KPKNL (Kantor Pelayanan Kekayaan Negara dan Lelang) untuk dilelang. Jika rumah laku Rp 3 Miliar, Bank mengambil Rp 2 Miliar (+bunga/denda), dan sisa Rp 1 Miliar WAJIB dikembalikan kepada debitur. Bank tidak boleh mengambil alih kepemilikan rumah secara otomatis (*Beding van Vervall*).
      `
    },
    {
      title: "Cara Mengajukan Laporan Polisi atas Kasus Penipuan (Pasal 378)",
      content: `
# Panduan Hukum: Melaporkan Tindak Pidana Penipuan (Pasal 378 KUHP)

Kasus Penipuan dan Penggelapan adalah tindak pidana yang paling sering dilaporkan ke kepolisian. Mulai dari investasi bodong, arisan online, hingga transaksi e-commerce fiktif. Namun, tidak semua laporan diterima oleh Penyidik. Mengapa? Karena banyak pelapor gagal membedakan mana ranah "Perdata (Utang Piutang)" dan mana ranah "Pidana (Penipuan)".

## Unsur-Unsur Penipuan Berdasarkan Pasal 378 KUHP

Agar sebuah kasus dapat dikategorikan sebagai penipuan dan pelakunya diancam pidana penjara maksimal 4 tahun, perbuatan tersebut **wajib memenuhi seluruh unsur** di bawah ini:

1. **Memiliki maksud menguntungkan diri sendiri atau orang lain secara melawan hukum.**
2. **Menggunakan tipu muslihat, rangkaian kebohongan, atau nama/martabat palsu.** (Ini adalah unsur paling penting!)
3. **Membujuk atau menggerakkan orang lain untuk menyerahkan barang/uang, memberi hutang, atau menghapus piutang.**

> **Contoh Masalah (Ranah Perdata/Bukan Pidana):** Anda meminjamkan uang Rp 50 Juta kepada Budi untuk modal usaha. Budi menandatangani surat utang dan berjanji mengembalikan bulan depan. Bulan depan, bisnis Budi bangkrut dan ia gagal bayar. Jika Anda melapor ke polisi dengan Pasal 378, laporan Anda kemungkinan besar akan ditolak atau di-SP3 (dihentikan). Alasannya? Budi gagal bayar karena kondisi ekonomi, bukan karena ia "merangkai kebohongan" sejak awal. Ini adalah murni ranah Perdata (Wanprestasi).

> **Contoh Masalah (Ranah Pidana Penipuan):** Budi membujuk Anda investasi Rp 50 Juta di perusahaannya, sambil menunjukkan dokumen Surat Izin Usaha dan foto-foto pabriknya yang megah. Anda percaya dan transfer uang. Belakangan ketahuan, dokumen itu palsu dan pabrik itu fiktif hasil editan Photoshop. Ini adalah murni **Pidana Penipuan (Pasal 378)** karena sejak awal ada **niat jahat (Mens Rea)** berupa penggunaan tipu muslihat dan dokumen palsu untuk membujuk Anda menyerahkan uang.

## Langkah Strategis Melapor ke Polisi

1. **Susun Kronologi & Kumpulkan Alat Bukti:** Polisi bekerja berdasarkan bukti. Print mutasi rekening koran, screenshot percakapan WhatsApp lengkap (jangan diedit/dihapus sebagian), dokumen perjanjian, dan siapkan minimal 2 orang saksi (sesuai Pasal 184 KUHAP).
2. **Kirim Somasi Dulu:** Seringkali, mengirimkan Surat Somasi Resmi via Pengacara sudah cukup untuk membuat pelaku ketakutan dan mengembalikan uang, tanpa perlu proses polisi yang panjang.
3. **Datang ke SPKT:** Kunjungi Sentra Pelayanan Kepolisian Terpadu (SPKT) di Polres/Polda sesuai *locus delicti* (tempat kejadian pidana). Jika polisi menilai unsur tipu muslihatnya kuat, mereka akan menerbitkan Laporan Polisi (LP) untuk diproses ke tahap penyelidikan.
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
