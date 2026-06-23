import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseAdminKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, supabaseAdminKey);

async function seed() {
  console.log("Fetching categories...");
  const { data: categories, error: catErr } = await supabase.from("legal_categories").select("*");
  if (catErr) {
    console.error("Cat error:", catErr);
    return;
  }

  // Clear existing materials and quizzes
  console.log("Clearing existing materials...");
  await supabase.from("legal_quizzes").delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from("legal_materials").delete().neq('id', '00000000-0000-0000-0000-000000000000');

  const getCatId = (nameQuery) => {
    const cat = categories.find(c => c.name.toLowerCase().includes(nameQuery));
    return cat ? cat.id : categories[0].id; // fallback
  };

  const pidanaId = getCatId("pidana");
  const perdataId = getCatId("perdata");
  const bisnisId = getCatId("bisnis");
  const techId = getCatId("teknologi");

  const materials = [
    // --- HUKUM BISNIS ---
    {
      category_id: bisnisId,
      title: "Dasar Hukum Mendirikan Usaha (PT vs CV)",
      content: `
# Dasar Hukum Mendirikan Usaha: PT vs CV

Memilih badan usaha yang tepat adalah langkah krusial pertama dalam membangun bisnis Anda. Dua bentuk badan usaha yang paling umum di Indonesia adalah Perseroan Terbatas (PT) dan Commanditaire Vennootschap (CV).

## 1. Perseroan Terbatas (PT)
PT adalah badan hukum yang merupakan persekutuan modal, didirikan berdasarkan perjanjian.
- **Tanggung Jawab:** Terbatas pada modal yang disetorkan. Kekayaan pribadi pemegang saham aman jika PT bangkrut.
- **Modal Dasar:** Menurut UU Cipta Kerja, besaran modal dasar kini ditentukan berdasarkan kesepakatan para pendiri.
- **Kredibilitas:** Lebih tinggi, sangat cocok untuk bisnis skala besar, tender pemerintah, atau mencari investasi dari luar.

## 2. Commanditaire Vennootschap (CV)
CV adalah badan usaha persekutuan yang didirikan oleh satu atau lebih sekutu aktif dan sekutu pasif.
- **Tanggung Jawab:** Sekutu aktif (pengurus) bertanggung jawab sampai harta pribadi. Sekutu pasif (pemodal) hanya sebatas modal yang disetor.
- **Modal Dasar:** Tidak ada batasan minimal modal.
- **Kredibilitas:** Cukup untuk UKM, pengurusan lebih mudah dan biaya pendirian lebih murah.
      `,
      is_premium: false,
      required_tier: "free",
      order_index: 1,
      quizzes: [
        {
          question: "Apa perbedaan utama tanggung jawab pemegang saham PT dan sekutu aktif CV?",
          options: ["PT tanggung jawabnya tidak terbatas, CV terbatas", "Keduanya tanggung jawab terbatas", "PT tanggung jawabnya sebatas modal, sekutu aktif CV sampai harta pribadi", "Keduanya sampai harta pribadi"],
          correct_option_index: 2,
          explanation: "Dalam PT, tanggung jawab pemegang saham terbatas pada modal yang disetor. Sedangkan sekutu aktif (pengurus) di CV bertanggung jawab secara renteng hingga ke harta pribadi."
        }
      ]
    },
    {
      category_id: bisnisId,
      title: "Panduan Membuat Kontrak Kerja Karyawan",
      content: `
# Panduan Membuat Kontrak Kerja Karyawan Sesuai UU Ketenagakerjaan

Kontrak kerja yang kuat melindungi perusahaan dan memberikan kepastian kepada karyawan. Ada dua jenis kontrak utama: **PKWT** (Perjanjian Kerja Waktu Tertentu) dan **PKWTT** (Perjanjian Kerja Waktu Tidak Tertentu).

## Poin Wajib dalam Kontrak Kerja
Menurut Pasal 54 UU Ketenagakerjaan, kontrak kerja harus memuat:
1. **Identitas Para Pihak:** Nama perusahaan, alamat perusahaan, nama karyawan, usia, dan alamat.
2. **Jabatan dan Tempat Pekerjaan:** Deskripsi tugas dan lokasi kerja spesifik.
3. **Besaran dan Cara Pembayaran Upah:** Gaji pokok, tunjangan, dan tanggal penggajian.
4. **Syarat Kerja:** Jam kerja, hari libur, dan hak cuti.
5. **Jangka Waktu (Khusus PKWT):** Tanggal mulai dan berakhirnya kontrak.

## Kesalahan Umum yang Harus Dihindari
- **Menahan Ijazah Asli:** Sangat tidak disarankan karena melanggar hak asasi, kecuali ada perjanjian khusus dengan kompensasi yang sepadan dan disepakati tanpa paksaan.
- **PKWT untuk Pekerjaan Tetap:** PKWT hanya boleh digunakan untuk pekerjaan yang sifatnya sementara, musiman, atau produk baru. Pekerjaan inti (core business) harus PKWTT.
      `,
      is_premium: true,
      required_tier: "basic",
      order_index: 2,
      quizzes: [
        {
          question: "Apakah PKWT (Pegawai Kontrak) boleh digunakan untuk pekerjaan inti perusahaan yang sifatnya terus-menerus?",
          options: ["Boleh, untuk menghemat biaya", "Tidak boleh, PKWT hanya untuk pekerjaan sementara atau musiman", "Boleh asal gajinya di atas UMR", "Tergantung kesepakatan"],
          correct_option_index: 1,
          explanation: "Menurut UU Ketenagakerjaan, PKWT tidak dapat diadakan untuk pekerjaan yang sifatnya tetap. Hanya boleh untuk pekerjaan yang sekali selesai, musiman, atau produk baru."
        }
      ]
    },
    {
      category_id: bisnisId,
      title: "Strategi Melindungi Hak Kekayaan Intelektual (HAKI)",
      content: `
# Strategi Eksekutif Melindungi Hak Kekayaan Intelektual (HAKI)

HAKI adalah aset tidak berwujud yang seringkali nilainya melebihi aset fisik perusahaan. Jika tidak didaftarkan, kompetitor bisa mencuri dan mendaftarkannya lebih dulu (prinsip *First to File*).

## Komponen HAKI Bisnis
1. **Merek Dagang (Trademark):** Melindungi nama, logo, dan slogan. Contoh: Logo Apple, nama "Kopi Kenangan".
2. **Hak Cipta (Copyright):** Melindungi karya tulis, software (source code), desain UI/UX, buku, dan seni.
3. **Paten (Patent):** Melindungi invensi teknologi yang baru dan dapat diterapkan secara industri.
4. **Rahasia Dagang (Trade Secret):** Informasi bernilai ekonomis yang tidak diketahui umum dan dijaga kerahasiaannya. Contoh: Resep Coca-Cola.

## Langkah Strategis Perlindungan
- **Pendaftaran Sejak Dini:** Daftarkan Merek sebelum produk Anda viral. Pendaftaran Merek membutuhkan waktu 1-2 tahun untuk keluar sertifikatnya.
- **NDA (Non-Disclosure Agreement):** Wajibkan seluruh karyawan, vendor, dan mitra bisnis menandatangani NDA sebelum membahas rahasia dapur perusahaan.
- **Klausul IP Assignment:** Pastikan dalam kontrak karyawan, secara eksplisit tertulis bahwa "Semua HAKI yang diciptakan karyawan selama jam kerja adalah milik perusahaan, bukan milik karyawan".
      `,
      is_premium: true,
      required_tier: "professional",
      order_index: 3,
      quizzes: [
        {
          question: "Prinsip perlindungan Merek di Indonesia menganut sistem...",
          options: ["First to Use (Siapa yang pertama pakai)", "First to Invent (Siapa yang pertama buat)", "First to File (Siapa yang pertama daftar)", "First to Sell (Siapa yang pertama jual)"],
          correct_option_index: 2,
          explanation: "Indonesia menganut prinsip First to File, artinya pihak yang pertama kali mendaftarkan merek tersebut ke DJKI adalah pemilik sah, terlepas dari siapa yang pertama menggunakannya."
        }
      ]
    },
    {
      category_id: bisnisId,
      title: "Masterclass: Menyusun Kontrak Bisnis Anti-Bocor & Strategi Ekspansi",
      content: `
# MASTERCLASS: Menyusun Kontrak Bisnis Skala Enterprise & Strategi M&A

Ini adalah materi tingkat lanjut untuk pemilik bisnis berskala menengah-besar yang bersiap untuk *scaling*, menerima *venture capital*, atau melakukan *Merger & Acquisition* (M&A).

## Arsitektur Kontrak Bisnis "Anti-Bocor"
Sebuah kontrak bisnis *high-stakes* harus menutupi setiap celah hukum yang bisa menjadi bencana (*deal-breakers*):

### 1. Representation & Warranties (Pernyataan & Jaminan)
Ini adalah "jantung" dari *Shareholder Agreement* atau *M&A*. Penjual harus menjamin bahwa perusahaan tidak memiliki hutang tersembunyi, pajak sudah dibayar, dan tidak ada sengketa hukum. Pelanggaran klausa ini memicu *Indemnification* (ganti rugi penuh).

### 2. Condition Precedents (Syarat Pendahuluan)
Syarat yang harus dipenuhi sebelum transaksi *closing*. Misalnya: "Akuisisi ini hanya terjadi JIKA izin dari BKPM telah terbit."

### 3. Non-Compete & Non-Solicitation
Mencegah mantan partner/karyawan kunci membuat bisnis saingan atau membajak klien dan tim Anda dalam radius waktu dan lokasi tertentu. 

## Strategi M&A: Legal Due Diligence (LDD)
Sebelum Anda membeli perusahaan lain atau menerima investasi besar, pihak legal akan melakukan LDD. Mereka akan memeriksa:
- **Corporate Documents:** Akta pendirian, izin usaha.
- **Material Contracts:** Apakah kontrak dengan klien utama bisa dibatalkan jika terjadi pergantian kepemilikan (*Change of Control clause*)?
- **Employment:** Apakah ada potensi pesangon massal tersembunyi?
      `,
      is_premium: true,
      required_tier: "business",
      order_index: 4,
      quizzes: [
        {
          question: "Apa fungsi utama klausul 'Condition Precedents' dalam sebuah kontrak transaksi bisnis besar?",
          options: ["Menentukan hukum negara mana yang berlaku", "Menetapkan syarat yang wajib dipenuhi sebelum transaksi dianggap sah/berlaku", "Mengatur pembagian dividen", "Melarang pihak lain mendirikan bisnis serupa"],
          correct_option_index: 1,
          explanation: "Condition Precedents adalah syarat tangguh yang harus dipenuhi terlebih dahulu. Jika syarat ini tidak terpenuhi (misal gagal mendapat izin regulator), maka kontrak belum berlaku efektif."
        }
      ]
    },
    
    // --- HUKUM TEKNOLOGI & ITE ---
    {
      category_id: techId,
      title: "Kepatuhan Perlindungan Data Pribadi (UU PDP)",
      content: `
# Pedoman Eksekutif: Kepatuhan UU Perlindungan Data Pribadi (UU PDP)

Dengan disahkannya UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP), setiap entitas bisnis (Pengendali Data) wajib melindungi data kliennya. Ancaman pidana dan denda hingga milyaran rupiah menanti pelanggar.

## Prinsip Dasar Pemrosesan Data
1. **Persetujuan Eksplisit (Consent):** Pengguna harus mencentang kotak persetujuan secara sadar (tidak boleh di-centang otomatis/pre-ticked box).
2. **Batasan Tujuan:** Data yang dikumpulkan untuk tujuan pengiriman barang, tidak boleh dijual ke pihak ketiga untuk telemarketing tanpa izin terpisah.
3. **Hak Subjek Data:** Pengguna berhak meminta datanya dihapus (*Right to be Forgotten*).

## Langkah Kepatuhan Perusahaan
1. **Tunjuk Data Protection Officer (DPO):** Wajib jika pemrosesan data dilakukan dalam skala besar.
2. **Update Privacy Policy:** Kebijakan privasi harus mudah dibaca, transparan tentang data apa yang diambil, untuk apa, dan disimpan di mana.
3. **Sistem Enkripsi:** Pastikan database pelanggan Anda terenkripsi. Jika terjadi kebocoran data (*Data Breach*), Anda wajib melapor ke pemerintah dan subjek data dalam 3x24 jam.
      `,
      is_premium: true,
      required_tier: "professional",
      order_index: 1,
      quizzes: [
        {
          question: "Berapa lama batas waktu perusahaan wajib melapor jika terjadi kegagalan pelindungan data pribadi (data breach) menurut UU PDP?",
          options: ["1x24 jam", "3x24 jam", "7 hari kerja", "1 bulan"],
          correct_option_index: 1,
          explanation: "Pasal 46 UU PDP mewajibkan Pengendali Data Pribadi untuk memberitahukan secara tertulis paling lambat 3x24 jam kepada subjek data dan lembaga berwenang jika terjadi kegagalan pelindungan data."
        }
      ]
    },
    {
      category_id: techId,
      title: "Masterclass: Aspek Hukum Teknologi AI & Cloud Computing",
      content: `
# MASTERCLASS: Lanskap Hukum AI, Cloud, dan Smart Contracts

Inovasi melaju lebih cepat dari hukum. Materi ini membedah risiko dan mitigasi hukum bagi *tech founders* yang membangun produk berbasis *Artificial Intelligence* (AI) dan *Blockchain/Web3*.

## 1. Hak Cipta dalam Generative AI
Siapa pemilik *output* dari AI (seperti Midjourney atau ChatGPT)? Di banyak yurisdiksi, hak cipta hanya diberikan untuk karya manusia. 
- **Risiko Infringement:** Jika AI Anda dilatih menggunakan data berhak cipta tanpa izin, perusahaan Anda bisa digugat.
- **Mitigasi:** Gunakan model dengan lisensi komersial jelas, atau buat *Terms of Service* (ToS) yang melimpahkan tanggung jawab *output* kepada *user*.

## 2. Kontrak Cloud & SLA (Service Level Agreement)
Saat menyewa AWS/GCP, perhatikan klausa *Data Residency*. Banyak sektor (seperti Perbankan dan Kesehatan) mewajibkan data sensitif WNI disimpan di server fisik yang berlokasi di Indonesia (PP 71/2019).
- **SLA Uptime:** Negosiasikan kompensasi (*service credits*) jika server *down* melewati batas toleransi, terutama jika aplikasi Anda *mission-critical*.

## 3. Legalitas Smart Contracts
Di Indonesia, *Smart Contract* diakui sebagai alat bukti elektronik yang sah berdasarkan UU ITE, selama memenuhi syarat sahnya perjanjian di KUHPerdata (Pasal 1320). Namun, tantangannya adalah ketika kode mengalami *bug*—siapa yang bertanggung jawab secara hukum? Klausa pengecualian tanggung jawab (*Limitation of Liability*) yang dikurasi dengan sangat hati-hati mutlak diperlukan di ToS platform.
      `,
      is_premium: true,
      required_tier: "business",
      order_index: 2,
      quizzes: [
        {
          question: "Mengapa penting memperhatikan aturan Data Residency dalam kontrak layanan Cloud Computing di Indonesia?",
          options: ["Agar server cloud lebih cepat diakses", "Karena PP 71/2019 mewajibkan penyelenggara sistem elektronik publik dan sektor tertentu menyimpan data di wilayah Indonesia", "Agar harga sewa cloud lebih murah", "Untuk menghindari pajak digital"],
          correct_option_index: 1,
          explanation: "PP 71/2019 mengatur tentang Penyelenggaraan Sistem dan Transaksi Elektronik, yang mewajibkan Penyelenggara Sistem Elektronik Lingkup Publik dan sektor finansial tertentu untuk menempatkan pusat data di dalam wilayah Indonesia untuk alasan kedaulatan dan keamanan."
        }
      ]
    },

    // --- HUKUM PERDATA ---
    {
      category_id: perdataId,
      title: "Memahami Wanprestasi dan Perbuatan Melawan Hukum (PMH)",
      content: `
# Memahami Wanprestasi dan Perbuatan Melawan Hukum (PMH)

Dalam hukum perdata, terdapat dua instrumen utama untuk menuntut ganti rugi terhadap pihak lain: **Wanprestasi** (Ingkar Janji) dan **Perbuatan Melawan Hukum (PMH)**. 

## 1. Wanprestasi (Ingkar Janji)
Wanprestasi terjadi ketika seseorang tidak memenuhi kewajibannya sebagaimana tertuang dalam **perjanjian (kontrak)** yang telah disepakati. Dasar hukumnya adalah Pasal 1243 KUHPerdata.

**Bentuk Wanprestasi:**
- Tidak memenuhi prestasi sama sekali (misal: tidak membayar hutang).
- Terlambat memenuhi prestasi (misal: proyek selesai 2 bulan lebih lambat).
- Memenuhi prestasi tetapi tidak sesuai kesepakatan (misal: memesan semen tipe A, tapi dikirim tipe B).

**Tindakan Pertama:** Kirimkan **Somasi** (surat teguran) sebelum menuntut ganti rugi.

## 2. Perbuatan Melawan Hukum (PMH)
PMH terjadi jika seseorang melanggar hak orang lain atau melanggar undang-undang, meskipun **tidak ada kontrak/perjanjian** di antara mereka. Dasar hukumnya adalah Pasal 1365 KUHPerdata.

**Syarat PMH:**
- Ada perbuatan yang melawan hukum.
- Ada kesalahan (kesengajaan atau kelalaian).
- Ada kerugian yang ditimbulkan.
- Ada hubungan sebab-akibat (kausalitas) antara perbuatan dan kerugian.

**Contoh:** Seseorang menabrak pagar rumah Anda hingga hancur. Anda tidak punya perjanjian dengan penabrak, tetapi Anda berhak menggugatnya atas dasar PMH.
      `,
      is_premium: false,
      required_tier: "free",
      order_index: 1,
      quizzes: [
        {
          question: "Apa syarat utama agar seseorang dapat digugat atas dasar Wanprestasi?",
          options: ["Adanya perbuatan yang melanggar undang-undang", "Adanya niat jahat dari pelaku", "Adanya perjanjian/kontrak yang mengikat kedua belah pihak", "Adanya kerugian materiil yang sangat besar"],
          correct_option_index: 2,
          explanation: "Wanprestasi lahir dari sebuah perjanjian. Tanpa adanya perjanjian/kontrak, Anda tidak bisa menggugat seseorang dengan dasar wanprestasi, melainkan harus menggunakan dasar Perbuatan Melawan Hukum (PMH)."
        }
      ]
    },
    {
      category_id: perdataId,
      title: "Panduan Eksekusi Jaminan Fidusia dan Hak Tanggungan",
      content: `
# Panduan Tingkat Lanjut: Eksekusi Jaminan Fidusia & Hak Tanggungan

Bagi lembaga pembiayaan atau kreditur individu, memastikan agunan (jaminan) dapat dieksekusi dengan mudah saat debitur macet (default) adalah prioritas tertinggi.

## 1. Jaminan Fidusia (Benda Bergerak)
Fidusia digunakan untuk benda bergerak, seperti kendaraan bermotor atau mesin pabrik.
- **Syarat Eksekusi:** Berdasarkan putusan Mahkamah Konstitusi (MK), kreditur (leasing/bank) **tidak boleh melakukan penarikan paksa** jika debitur menolak menyerahkan kendaraan dengan sukarela atau jika belum ada kesepakatan bahwa telah terjadi wanprestasi.
- **Solusi Eksekusi:** Jika debitur menolak, kreditur harus mengajukan permohonan eksekusi ke Pengadilan Negeri. Oleh karena itu, penting sekali memiliki Sertifikat Jaminan Fidusia yang memuat irah-irah "Demi Keadilan Berdasarkan Ketuhanan Yang Maha Esa" yang memberinya kekuatan eksekutorial layaknya putusan pengadilan.

## 2. Hak Tanggungan (Benda Tidak Bergerak)
Hak Tanggungan digunakan untuk benda tidak bergerak seperti tanah dan bangunan.
- **Pendaftaran:** Wajib didaftarkan ke Badan Pertanahan Nasional (BPN).
- **Eksekusi:** Jika debitur wanprestasi, pemegang Hak Tanggungan pertama (Kreditur Preferen) memiliki hak untuk menjual objek jaminan melalui pelelangan umum (Parate Executie) tanpa perlu persetujuan debitur lagi, karena sertifikat Hak Tanggungan memiliki kekuatan eksekutorial.
- **Titik Kritis:** Pastikan nilai taksiran (*appraisal*) tanah mencukupi untuk menutup nilai pokok utang beserta bunga dan denda, mengingat proses lelang sering kali menghasilkan nilai jual di bawah harga pasar.
      `,
      is_premium: true,
      required_tier: "professional",
      order_index: 2,
      quizzes: [
        {
          question: "Berdasarkan Putusan Mahkamah Konstitusi, apa yang harus dilakukan kreditur/leasing jika ingin menarik kendaraan fidusia namun debitur tidak mengakui telah cidera janji (wanprestasi) dan menolak menyerahkan kendaraan?",
          options: ["Menarik paksa menggunakan pihak ketiga (debt collector)", "Menjual sisa hutang ke pihak lain", "Mengajukan permohonan pelaksanaan eksekusi kepada Pengadilan Negeri", "Meminta bantuan Polisi untuk menyita kendaraan tanpa surat pengadilan"],
          correct_option_index: 2,
          explanation: "Putusan MK menegaskan bahwa jika tidak ada kesepakatan mengenai wanprestasi dan debitur keberatan menyerahkan barang, kreditur tidak boleh menarik secara sepihak/paksa, melainkan harus memohon eksekusi ke Pengadilan Negeri."
        }
      ]
    },

    // --- HUKUM PIDANA ---
    {
      category_id: pidanaId,
      title: "Cara Mengajukan Laporan Polisi atas Kasus Penipuan (Pasal 378)",
      content: `
# Panduan Mengajukan Laporan Polisi atas Kasus Penipuan (Pasal 378 KUHP)

Penipuan sering terjadi dalam transaksi bisnis, jual beli online, maupun investasi bodong. Jika Anda menjadi korban, pelaporan hukum adalah langkah tegas untuk mencari keadilan dan menekan pelaku.

## Unsur Pasal 378 KUHP (Penipuan)
Agar laporan Anda diterima oleh penyidik, perbuatan pelaku harus memenuhi unsur:
1. **Maksud menguntungkan diri sendiri/orang lain secara melawan hukum.**
2. **Menggunakan tipu muslihat, rangkaian kebohongan, atau nama/martabat palsu.**
3. **Menggerakkan orang lain untuk menyerahkan barang/uang.**

*Catatan Penting:* Jika pelaku hanya telat membayar hutang (namun dari awal tidak ada niat menipu), kasus ini adalah murni perdata (wanprestasi), BUKAN pidana. Penyidik polisi sering kali menolak laporan jika unsur kebohongannya sejak awal (*mens rea*) tidak terlihat.

## Langkah Melapor ke Polisi
1. **Siapkan Bukti:** Kumpulkan bukti transfer, mutasi rekening, chat WhatsApp (jangan dihapus atau diedit), perjanjian tertulis, dan dokumentasi lainnya. Cetak semuanya.
2. **Datang ke SPKT (Sentra Pelayanan Kepolisian Terpadu):** Datangi Polres atau Polda di wilayah terjadinya tindak pidana (locus delicti).
3. **Pembuatan Laporan (LP):** Anda akan diwawancara singkat. Jika unsur pidana terpenuhi, petugas akan menerbitkan Surat Tanda Terima Laporan Polisi (STTLP).
4. **BAP (Berita Acara Pemeriksaan):** Anda akan diarahkan ke penyidik (Reskrim) untuk dimintai keterangan lebih rinci dalam bentuk BAP. Bawa 2 orang saksi yang mengetahui kejadian tersebut agar laporan Anda semakin kuat.
      `,
      is_premium: true,
      required_tier: "basic",
      order_index: 1,
      quizzes: [
        {
          question: "Jika seseorang meminjam uang kepada Anda dengan perjanjian tertulis akan dikembalikan bulan depan, namun ia gagal bayar karena usahanya bangkrut, apakah ini bisa langsung dilaporkan sebagai penipuan (Pasal 378)?",
          options: ["Ya, karena dia tidak mengembalikan uang", "Tidak, ini murni wanprestasi (perdata) karena kegagalan bayar terjadi karena bangkrut, bukan niat menipu sejak awal", "Ya, karena ada unsur kerugian", "Tidak, harus dilaporkan sebagai penggelapan terlebih dahulu"],
          correct_option_index: 1,
          explanation: "Kegagalan membayar hutang karena alasan ekonomi/bangkrut tanpa adanya kebohongan atau tipu muslihat sejak awal perjanjian, adalah ranah hukum Perdata (wanprestasi), sehingga umumnya tidak bisa dipidanakan dengan pasal penipuan."
        }
      ]
    },
    {
      category_id: pidanaId,
      title: "Masterclass: Kepatuhan Anti-Suap & Penanganan Korupsi Korporasi",
      content: `
# MASTERCLASS: Kepatuhan Anti-Suap & Pencegahan Tanggung Jawab Pidana Korporasi

Di Indonesia, tidak hanya individu (direktur/karyawan) yang bisa dipidana, tetapi **Korporasi (Perusahaan)** juga dapat ditetapkan sebagai tersangka dalam kasus Tindak Pidana Korupsi, sesuai Peraturan Mahkamah Agung (Perma) No. 13 Tahun 2016.

## Mengapa Korporasi Bisa Dipidana?
Korporasi dapat dimintai pertanggungjawaban pidana jika:
1. Tindak pidana dilakukan demi keuntungan korporasi.
2. Korporasi membiarkan terjadinya tindak pidana.
3. Korporasi tidak melakukan langkah-langkah pencegahan (*adequate procedures*).

**Ancaman Hukuman:** Jika terbukti, perusahaan Anda bisa didenda sangat besar, aset disita, izin usaha dibekukan, hingga dibubarkan secara paksa.

## Membangun Sistem Manajemen Anti-Penyuapan (SMAP) / ISO 37001
Untuk melindungi perusahaan dan Dewan Direksi dari jerat pidana korporasi, perusahaan HARUS memiliki sistem pencegahan yang dapat dibuktikan di pengadilan:

### 1. Code of Conduct & Gift Policy
Tetapkan batasan tegas tentang penerimaan atau pemberian hadiah, parsel (*gratifikasi*), hiburan, dan biaya perjalanan kepada pejabat negara (PNS) maupun mitra bisnis swasta. Nol toleransi terhadap *facilitation payments* (uang pelicin).

### 2. Whistleblowing System (WBS)
Sediakan saluran pengaduan anonim bagi karyawan yang melihat adanya potensi suap atau kecurangan internal. Lindungi *whistleblower* dari sanksi pemecatan.

### 3. Due Diligence Vendor & Pihak Ketiga
Banyak kasus korporasi terjerat korupsi karena menggunakan konsultan atau agen pihak ketiga yang bertindak sebagai "penyuap" atas nama perusahaan. Lakukan verifikasi latar belakang secara menyeluruh sebelum menunjuk vendor.
      `,
      is_premium: true,
      required_tier: "business",
      order_index: 2,
      quizzes: [
        {
          question: "Berdasarkan Perma No. 13 Tahun 2016, dalam kondisi apa Korporasi (perusahaan) dapat dipidana?",
          options: ["Jika direktur korporasi melakukan tindak pidana untuk kepentingan pribadi", "Jika korporasi membiarkan tindak pidana terjadi atau tidak melakukan langkah pencegahan yang memadai", "Hanya jika 100% saham perusahaan dimiliki oleh tersangka", "Korporasi tidak bisa dipidana, hanya individu yang bisa dipidana"],
          correct_option_index: 1,
          explanation: "Perma 13/2016 menyebutkan korporasi dapat dipidana jika memperoleh keuntungan dari pidana tersebut, membiarkan terjadinya tindak pidana, atau tidak melakukan pencegahan/memastikan kepatuhan hukum."
        }
      ]
    }
  ];

  for (const mat of materials) {
    const { quizzes, ...materialData } = mat;
    
    // Insert Material
    const { data: insertedMat, error: insertErr } = await supabase
      .from("legal_materials")
      .insert({ ...materialData })
      .select("id")
      .single();

    if (insertErr) {
      console.error("Failed to insert material:", materialData.title, insertErr);
      continue;
    }

    // Insert Quizzes
    for (const quiz of quizzes) {
      await supabase.from("legal_quizzes").insert({
        material_id: insertedMat.id,
        ...quiz
      });
    }
    console.log("Inserted:", materialData.title);
  }

  console.log("Seeding complete!");
}

seed().catch(console.error);
