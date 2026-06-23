import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function updateMaterials() {
  const updates = [
    {
      title: "Dasar Hukum Mendirikan Usaha (PT vs CV)",
      content: `
# Dasar Hukum Mendirikan Usaha: PT vs CV (Berdasarkan UU Cipta Kerja)

Memilih bentuk badan usaha adalah keputusan paling fundamental sebelum meluncurkan produk. Dua opsi terpopuler di Indonesia adalah **Perseroan Terbatas (PT)** dan **Persekutuan Komanditer (CV)**. Sejak disahkannya UU Cipta Kerja (UU No. 11/2020) yang kemudian diperbarui dengan Perppu No. 2/2022, aturan main mendirikan PT menjadi jauh lebih mudah.

## 1. Perseroan Terbatas (PT) - UU No. 40 Tahun 2007

PT adalah badan hukum yang merupakan persekutuan modal. Kekuatan utamanya terletak pada pemisahan harta kekayaan.
- **Tanggung Jawab Pemegang Saham (Pasal 3):** Bersifat terbatas (Limited Liability). Artinya, pemegang saham hanya bertanggung jawab sebesar modal yang disetorkan. Jika PT bangkrut dan punya banyak utang, penyita harta tidak bisa menyentuh rumah pribadi, mobil pribadi, atau tabungan pribadi pemegang saham.
- **Modal Dasar:** Dulu minimal Rp 50 Juta. Pasca UU Cipta Kerja, besaran modal dasar ditentukan *sepenuhnya berdasarkan kesepakatan pendiri PT*. Bahkan PT Perorangan bisa didirikan tanpa batasan modal minimal.
- **Organ PT:** Terdiri dari Rapat Umum Pemegang Saham (RUPS), Direksi (menjalankan perusahaan), dan Komisaris (mengawasi direksi).

> **Contoh Masalah:** Perusahaan startup Anda berbentuk PT, digugat oleh supplier sebesar Rp 5 Miliar karena gagal bayar. Total aset PT Anda hanya Rp 1 Miliar. Maka supplier hanya bisa menyita aset PT senilai Rp 1 Miliar. Mereka tidak bisa memaksa Anda menjual rumah pribadi Anda untuk melunasi sisa Rp 4 Miliar, KECUALI mereka bisa membuktikan *Piercing the Corporate Veil* (Anda mencampuradukkan uang pribadi dan uang perusahaan untuk penipuan).

## 2. Commanditaire Vennootschap (CV) - KUHD

CV bukan badan hukum, melainkan badan usaha (persekutuan). Ini sangat cocok untuk usaha keluarga, agensi kecil, atau bisnis kuliner yang modal awalnya tidak besar.
- **Tanggung Jawab Sekutu:** CV dibagi menjadi 2 jenis sekutu. **Sekutu Aktif (Pengurus/Direktur)** menjalankan roda perusahaan. Tanggung jawabnya TIDAK TERBATAS hingga ke harta pribadi (tanggung renteng). Sedangkan **Sekutu Pasif (Pemodal/Silent Partner)** hanya menyetor modal dan tanggung jawabnya sebatas modal yang disetor.
- **Kredibilitas Bank & Tender:** Jika Anda ingin mengikuti tender pemerintah (LKPP) bernilai di atas Rp 2,5 Miliar, atau mencari investasi dari *Venture Capital* asing, struktur CV biasanya ditolak. Anda wajib berbadan hukum (PT).

> **Contoh Masalah:** CV Kuliner Anda (di mana Anda adalah Direktur/Sekutu Aktif) digugat ganti rugi Rp 500 Juta karena keracunan makanan masal. Kas CV hanya sisa Rp 50 Juta. Maka, korban berhak menuntut penyitaan atas mobil pribadi Anda atau tabungan pribadi Anda untuk melunasi sisa kerugian tersebut.
      `
    },
    {
      title: "Panduan Membuat Kontrak Kerja Karyawan",
      content: `
# Panduan Menyusun Kontrak Kerja Karyawan (PKWT vs PKWTT)

Miskomunikasi sering berujung pada sengketa ketenagakerjaan. Untuk mencegahnya, hak dan kewajiban harus tertuang rinci dalam Perjanjian Kerja. Aturan ini tunduk pada UU No. 13 Tahun 2003 yang telah diubah oleh **UU Cipta Kerja dan PP No. 35 Tahun 2021**.

## PKWT (Karyawan Kontrak) vs PKWTT (Karyawan Tetap)

**1. Perjanjian Kerja Waktu Tertentu (PKWT):**
Digunakan untuk pekerja kontrak/musiman.
- **Syarat Pekerjaan (Pasal 59 UU 13/2003):** Hanya boleh untuk pekerjaan yang sekali selesai, sementara, musiman, atau produk baru. **TIDAK BOLEH** digunakan untuk pekerjaan yang sifatnya tetap (*core business*).
- **Masa Maksimal (PP 35/2021):** Maksimal jangka waktu PKWT beserta perpanjangannya sekarang adalah **5 tahun**.
- **Kompensasi Selesai Kontrak:** Dulu, karyawan kontrak yang selesai masa kontraknya tidak dapat apa-apa. Sekarang, menurut PP 35/2021, pengusaha WAJIB memberikan **Uang Kompensasi** pada saat berakhirnya PKWT (dihitung proporsional: Masa Kerja/12 x 1 Bulan Upah).

> **Contoh Masalah:** Anda adalah perusahaan manufaktur sepatu. Anda mempekerjakan operator mesin jahit (pekerjaan inti dan terus menerus) dengan status PKWT yang diperpanjang setiap tahun selama 4 tahun. Karyawan ini protes ke Disnaker. Disnaker akan menetapkan bahwa secara hukum (Batal Demi Hukum), status PKWT tersebut otomatis berubah menjadi **PKWTT (Karyawan Tetap)** sejak awal ia bekerja, dengan segala hak cuti dan pesangonnya melekat.

**2. Perjanjian Kerja Waktu Tidak Tertentu (PKWTT):**
Digunakan untuk karyawan berstatus tetap.
- Boleh mensyaratkan **Masa Percobaan (Probation)** paling lama 3 bulan. Selama masa probation, upah tidak boleh di bawah UMK.
- Jika terjadi PHK, perusahaan diwajibkan membayar Pesangon, UPMK, dan UPH.

## Klausul "Haram" dalam Kontrak Kerja
Menurut hukum perdata, kontrak kerja tidak boleh melanggar ketertiban umum dan HAM:
- **Klausul Penahanan Ijazah:** Meski sering dilakukan di industri retail, jika tidak disertai perjanjian khusus yang transparan dan perlindungan asuransi terhadap hilangnya ijazah, ini berpotensi digugat sebagai perbuatan melawan hukum.
- **Klausul Menghalangi Menikah dengan Rekan Sekantor:** Sejak Putusan MK Nomor 13/PUU-XV/2017, perusahaan tidak boleh mem-PHK karyawan hanya karena mereka menikah dengan teman sekantor.
      `
    },
    {
      title: "Masterclass: Menyusun Kontrak Bisnis Anti-Bocor & Strategi Ekspansi",
      content: `
# Masterclass: Menyusun Kontrak Bisnis Skala Enterprise & Strategi M&A

Ini adalah materi tingkat lanjut untuk pemilik bisnis berskala menengah-besar yang bersiap untuk *scaling*, menerima *venture capital*, atau melakukan *Merger & Acquisition* (M&A).

## Arsitektur Kontrak Bisnis "Anti-Bocor"
Sebuah kontrak bisnis *high-stakes* harus menutupi setiap celah hukum yang bisa menjadi bencana (*deal-breakers*). Beberapa klausul krusial meliputi:

### 1. Representation & Warranties (Pernyataan & Jaminan)
Ini adalah "jantung" dari *Shareholder Agreement* atau *M&A*. Penjual harus menjamin bahwa laporan keuangan akurat, pajak sudah dibayar, perusahaan tidak memiliki sengketa hukum, dan seluruh HAKI (Hak Kekayaan Intelektual) adalah milik perusahaan secara sah. Pelanggaran klausa ini akan memicu *Indemnification* (kewajiban ganti rugi penuh dari pihak penjual kepada pembeli tanpa perlu sidang panjang).

### 2. Condition Precedents (Syarat Pendahuluan)
Klausul ini menetapkan syarat yang harus dipenuhi **sebelum** transaksi/kontrak *closing* atau berlaku efektif.
> **Contoh Masalah:** Perusahaan asing A setuju mengakuisisi startup Anda dengan nilai Rp 50 Miliar. Mereka menambahkan *Condition Precedent* bahwa "Akuisisi ini hanya terjadi JIKA izin dari BKPM telah terbit dan laporan audit Big 4 menyatakan *Clean*." Jika syarat ini gagal terpenuhi dalam waktu 6 bulan, kontrak batal secara otomatis dan uang DP bisa ditarik kembali.

### 3. Non-Compete & Non-Solicitation (Anti-Pesaing dan Anti-Pembajakan)
Melindungi aset terbesar Anda: Rahasia Perusahaan dan Talenta Kunci.
- **Non-Compete:** Melarang mantan partner, founder yang keluar, atau karyawan kunci (C-Level) mendirikan bisnis sejenis atau bekerja di kompetitor selama radius waktu tertentu (misal: 2 tahun) dan lokasi tertentu.
- **Non-Solicitation:** Melarang mereka untuk mendekati, "membajak", atau merekrut staf dan pelanggan Anda setelah mereka keluar.

## Legal Due Diligence (LDD) dalam M&A
Sebelum Anda membeli perusahaan lain atau menerima investasi besar, *corporate lawyer* akan melakukan *Due Diligence* (Uji Tuntas) secara agresif. Mereka memeriksa:
- **Corporate Documents:** Legalitas akta pendirian, izin usaha, struktur saham.
- **Material Contracts:** Mereka akan menelusuri kontrak-kontrak Anda dengan klien besar. Apakah ada **Change of Control clause**? (Klausul yang membolehkan klien membatalkan kontrak sepihak jika struktur kepemilikan Anda berubah).
- **Employment Liabilities:** Apakah ada potensi pesangon massal yang disembunyikan?

*Studi Kasus:* Banyak akuisisi bernilai triliunan gagal di menit akhir (atau nilainya dipotong drastis) karena tim LDD menemukan bahwa perizinan *core product* belum lengkap, atau HAKI utama ternyata masih didaftarkan atas nama pribadi si Founder, bukan atas nama PT.
      `
    },
    {
      title: "Masterclass: Aspek Hukum Teknologi AI & Cloud Computing",
      content: `
# Masterclass: Lanskap Hukum AI, Cloud Computing, dan Smart Contracts

Inovasi teknologi hampir selalu melaju lebih cepat dari regulasi hukum. Materi ini membedah lanskap risiko dan strategi mitigasi hukum bagi *tech founders* yang membangun produk berbasis *Artificial Intelligence* (AI), platform SaaS, atau ekosistem Web3/Blockchain.

## 1. Problematika Hak Cipta dalam Generative AI

Ketika Anda menggunakan AI (seperti Midjourney, ChatGPT, Github Copilot) untuk men-generate gambar, artikel, atau *source code*, siapa pemilik hak ciptanya?
Menurut UU Hak Cipta di sebagian besar negara (termasuk prinsip hukum di Indonesia), hak cipta hanya bisa diberikan kepada **karya yang dihasilkan oleh pemikiran manusia yang memiliki keaslian**. 
- **Risiko Infringement (Pelanggaran Hak Cipta):** Model AI dilatih menggunakan miliaran data dari internet. Jika platform AI Anda menghasilkan *output* yang terlalu mirip dengan karya seniman asli (karena *overfitting* data latih), platform Anda bisa digugat.
- **Mitigasi:** Sebagai *developer*, selalu cek lisensi model AI yang Anda *fine-tune* (misal: lisensi Llama, MIT, Apache). Dalam *Terms of Service* (ToS) produk Anda, wajib cantumkan klausul *Limitation of Liability* yang melimpahkan sepenuhnya tanggung jawab atas *output* konten kepada *end-user*.

## 2. Kontrak Cloud Computing & Aturan Data Residency

Saat Anda menyewa infrastruktur cloud (AWS, Azure, Google Cloud), Anda wajib mematuhi **PP No. 71 Tahun 2019** tentang Penyelenggaraan Sistem dan Transaksi Elektronik.
- **Data Residency & Kedaulatan Data:** Jika Anda adalah Penyelenggara Sistem Elektronik (PSE) Lingkup Publik (instansi negara), Anda **WAJIB** menempatkan pusat data (*data center*) dan *disaster recovery center* (DRC) secara fisik di dalam wilayah Indonesia.
- **SLA Uptime & Service Credits:** Dalam kontrak *Enterprise*, pastikan ada parameter *Service Level Agreement* (SLA). Jika server dijanjikan *uptime* 99.99% namun nyatanya *down* 5 jam dalam sebulan, kontrak harus secara otomatis memberikan kompensasi kredit tagihan (*service credits*) kepada Anda tanpa proses komplain yang berbelit.

## 3. Legalitas Smart Contracts di Indonesia

Apakah *Smart Contract* (kode komputer yang mengeksekusi perjanjian secara otomatis di atas blockchain) diakui di Pengadilan Indonesia?
Jawabannya **YA**. Berdasarkan Pasal 1 angka 17 UU ITE, *Smart Contract* dapat dipersamakan dengan Kontrak Elektronik. Selama *smart contract* tersebut memenuhi syarat sah perjanjian menurut **Pasal 1320 KUHPerdata** (Sepakat, Cakap, Hal tertentu, Kausa halal), ia mengikat secara hukum.

> **Tantangan Hukum (Bug dalam Kode):** 
> Bagaimana jika *smart contract* Anda yang mengatur transfer aset crypto ternyata memiliki *bug* (cacat *coding*) dan diretas hingga dana pengguna terkuras habis? Pengadilan belum memiliki yurisprudensi kuat apakah ini murni kelalaian developer (*Wanprestasi*) atau risiko teknologi (*Force Majeure*). Oleh karena itu, *ToS* platform DeFi wajib memuat klausul *As-Is Basis* dan *Total Disclaimer of Liability* yang sangat ketat untuk melindungi *founder* dari kebangkrutan.
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
