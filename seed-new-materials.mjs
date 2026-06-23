import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseAdminKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, supabaseAdminKey);

async function seedNewCategories() {
  console.log("Fetching categories...");
  const { data: categories, error: catErr } = await supabase.from("legal_categories").select("*");
  if (catErr) {
    console.error("Cat error:", catErr);
    return;
  }

  const getCatId = (nameQuery) => {
    const cat = categories.find(c => c.name.toLowerCase().includes(nameQuery));
    return cat ? cat.id : null;
  };

  const perjanjianId = getCatId("perjanjian");
  const pajakId = getCatId("pajak");
  const ketenagakerjaanId = getCatId("ketenagakerjaan");

  if (!perjanjianId || !pajakId || !ketenagakerjaanId) {
    console.error("Categories not found!");
    return;
  }

  const materials = [
    // --- HUKUM PERJANJIAN ---
    {
      category_id: perjanjianId,
      title: "Fundamental Hukum Perjanjian: Syarat Sah Kontrak",
      content: `
# Fundamental Hukum Perjanjian: Syarat Sah Kontrak (Pasal 1320 KUHPerdata)

Perjanjian atau kontrak adalah landasan dari setiap transaksi bisnis. Agar sebuah perjanjian diakui sah dan mengikat secara hukum di Indonesia, ia harus memenuhi 4 syarat mutlak yang diatur dalam Pasal 1320 Kitab Undang-Undang Hukum Perdata (KUHPerdata).

## 4 Syarat Sah Perjanjian
1. **Kesepakatan Mereka yang Mengikatkan Dirinya (Sepakat):** Kedua belah pihak harus setuju tanpa adanya paksaan (*dwang*), kekhilafan (*dwaling*), atau penipuan (*bedrog*).
2. **Kecakapan untuk Membuat Suatu Perikatan (Cakap):** Pihak yang membuat perjanjian harus sudah dewasa (minimal 21 tahun atau sudah menikah) dan tidak berada di bawah pengampuan.
3. **Suatu Hal Tertentu (Objek Tertentu):** Objek yang diperjanjikan harus jelas, dapat ditentukan jenis dan jumlahnya.
4. **Suatu Sebab yang Halal (Kausa yang Halal):** Isi perjanjian tidak boleh bertentangan dengan undang-undang, ketertiban umum, atau kesusilaan (misalnya perjanjian jual beli narkoba adalah batal).

## Akibat Hukum Jika Syarat Tidak Terpenuhi
- **Dapat Dibatalkan (Voidable):** Jika syarat subjektif (Sepakat & Cakap) tidak terpenuhi, perjanjian tetap berlaku sampai ada pihak yang meminta pembatalan ke pengadilan.
- **Batal Demi Hukum (Null and Void):** Jika syarat objektif (Objek Tertentu & Kausa Halal) tidak terpenuhi, maka dari awal perjanjian itu dianggap tidak pernah ada.
      `,
      is_premium: false,
      required_tier: "free",
      order_index: 1,
      quizzes: [
        {
          question: "Apa akibat hukumnya jika sebuah kontrak dibuat untuk melakukan perbuatan yang melanggar undang-undang (syarat Kausa Halal tidak terpenuhi)?",
          options: ["Dapat dibatalkan oleh salah satu pihak", "Batal demi hukum (dianggap tidak pernah ada)", "Sah asalkan kedua belah pihak sepakat", "Hanya berlaku jika disahkan notaris"],
          correct_option_index: 1,
          explanation: "Pelanggaran terhadap syarat objektif (seperti kausa yang halal) mengakibatkan perjanjian Batal Demi Hukum sejak awal dibuat."
        }
      ]
    },
    {
      category_id: perjanjianId,
      title: "Masterclass: Teknik Drafting Kontrak Komersial Anti-Bocor",
      content: `
# Masterclass: Teknik Drafting Kontrak Komersial "Anti-Bocor"

*Legal Drafting* bukan sekadar menyalin *template*. Ini adalah seni memprediksi kemungkinan terburuk dan melindungi klien sebelum sengketa terjadi.

## Anatomi Kontrak Komersial yang Kuat
1. **Recitals (Konsiderans):** Latar belakang mengapa para pihak mengadakan perjanjian. Sangat penting jika terjadi sengketa penafsiran.
2. **Definitions (Definisi):** Mencegah interpretasi ganda. Misalnya, mendefinisikan "Hari Kerja" apakah Senin-Jumat atau termasuk Sabtu.
3. **Rights & Obligations (Hak & Kewajiban):** Harus dibuat sejelas dan sedetail mungkin (prinsip 5W+1H).
4. **Representations & Warranties (Pernyataan & Jaminan):** Jaminan fakta hukum. (Misal: "Pihak Pertama menjamin bahwa barang ini bukan barang curian").
5. **Indemnification (Ganti Rugi):** Siapa yang menanggung kerugian jika pihak ketiga menggugat.
6. **Force Majeure (Keadaan Memaksa):** Kondisi spesifik apa saja yang membebaskan para pihak dari tanggung jawab (bencana alam, perang, pandemi).
7. **Dispute Resolution (Penyelesaian Sengketa):** Pilih antara Pengadilan Negeri, Arbitrase (BANI), atau Mediasi.

## Klausul "Jebakan" yang Sering Terlewat
- **Severability Clause:** Klausul yang menyatakan jika ada satu pasal yang batal demi hukum, pasal lainnya tetap berlaku.
- **Entire Agreement Clause:** Menyatakan bahwa draf final ini membatalkan semua negosiasi atau email sebelumnya.
- **Choice of Law & Jurisdiction:** Hukum negara mana yang dipakai, dan pengadilan mana yang berhak mengadili. Sangat krusial untuk kontrak internasional.
      `,
      is_premium: true,
      required_tier: "business",
      order_index: 2,
      quizzes: [
        {
          question: "Klausul mana yang berfungsi untuk memastikan bahwa jika pengadilan membatalkan satu pasal dalam kontrak, sisa kontrak tersebut tetap sah dan mengikat?",
          options: ["Force Majeure", "Severability Clause", "Indemnification", "Entire Agreement Clause"],
          correct_option_index: 1,
          explanation: "Severability Clause (Klausul Keterpisahan) memastikan bahwa ketidakabsahan satu ketentuan tidak membatalkan keseluruhan kontrak."
        }
      ]
    },

    // --- HUKUM PAJAK ---
    {
      category_id: pajakId,
      title: "Fundamental Kewajiban Perpajakan Wajib Pajak Badan",
      content: `
# Fundamental Kewajiban Perpajakan Wajib Pajak Badan (PT/CV)

Kepatuhan pajak bukan hanya soal kontribusi kepada negara, tetapi juga manajemen risiko. Kesalahan lapor dapat berujung pada sanksi administratif (denda/bunga) hingga pidana pajak.

## 4 Kewajiban Utama Wajib Pajak Badan
Setiap perusahaan (PT/CV) di Indonesia memiliki kewajiban dasar:
1. **Daftar:** Mendaftarkan diri untuk mendapatkan NPWP Badan. Jika omzet melebihi Rp4,8 Miliar/tahun, wajib dikukuhkan sebagai Pengusaha Kena Pajak (PKP).
2. **Hitung:** Menghitung pajak terutang dengan benar (Self-Assessment System).
3. **Bayar:** Membayar pajak tepat waktu ke Kas Negara menggunakan Surat Setoran Pajak (SSP) atau e-Billing.
4. **Lapor:** Melaporkan Surat Pemberitahuan (SPT) Masa (bulanan) dan SPT Tahunan.

## Jenis-Jenis Pajak yang Sering Dihadapi Perusahaan
- **PPh Pasal 21:** Pajak atas penghasilan karyawan yang dipotong oleh perusahaan.
- **PPh Pasal 23:** Pajak pemotongan atas jasa, dividen, bunga, royalti, dan sewa (selain tanah/bangunan).
- **PPh Pasal 4 ayat (2):** Pajak Final, misalnya atas sewa ruko/kantor atau jasa konstruksi.
- **PPN (Pajak Pertambahan Nilai):** Pajak atas konsumsi Barang/Jasa Kena Pajak (saat ini tarif 11%).

Keterlambatan lapor SPT Tahunan Badan dikenakan denda Rp1.000.000, sedangkan untuk SPT Masa denda bervariasi antara Rp100.000 hingga Rp500.000 per masa pajak.
      `,
      is_premium: true,
      required_tier: "basic",
      order_index: 1,
      quizzes: [
        {
          question: "Berapa batasan minimal omzet dalam setahun yang mewajibkan sebuah perusahaan mendaftarkan diri sebagai Pengusaha Kena Pajak (PKP)?",
          options: ["Rp 500 Juta", "Rp 1 Miliar", "Rp 4,8 Miliar", "Rp 10 Miliar"],
          correct_option_index: 2,
          explanation: "Sesuai ketentuan, Wajib Pajak yang memiliki peredaran bruto (omzet) melebihi Rp 4,8 Miliar dalam 1 tahun buku wajib melaporkan usahanya untuk dikukuhkan sebagai PKP."
        }
      ]
    },
    {
      category_id: pajakId,
      title: "Strategi Perencanaan Pajak (Tax Planning) Legal bagi Korporasi",
      content: `
# Masterclass: Strategi Perencanaan Pajak (Tax Planning) Legal bagi Korporasi

*Tax Avoidance* (Penghindaran Pajak yang legal) berbeda dengan *Tax Evasion* (Penggelapan Pajak yang ilegal). *Tax Planning* adalah seni menstrukturkan bisnis Anda sedemikian rupa sehingga meminimalkan beban pajak tanpa melanggar undang-undang.

## Strategi Dasar Tax Planning
1. **Memaksimalkan Biaya yang Dapat Dikurangkan (Deductible Expenses):**
   Tidak semua pengeluaran perusahaan bisa mengurangi laba kena pajak (Pasal 6 UU PPh vs Pasal 9 UU PPh).
   - *Contoh:* Tunjangan PPh 21 karyawan (Pajak ditanggung perusahaan) tidak bisa dibiayakan (Non-Deductible). Ubah strateginya menjadi memberikan Tunjangan Pajak (Gross-Up) dalam komponen gaji, maka tunjangan ini bisa dibiayakan.
   
2. **Pemilihan Struktur Usaha & Pendanaan:**
   Daripada menambah modal dengan *Equity* (pembagian keuntungan berupa dividen tidak mengurangi pajak), lebih efisien menggunakan *Debt* (Pinjaman), karena beban bunga pinjaman dapat dibiayakan (*Deductible*). Namun, perhatikan aturan *Debt to Equity Ratio* (DER) maksimal 4:1.

3. **Restrukturisasi Grup Perusahaan (Transfer Pricing):**
   Transaksi antar perusahaan dalam satu grup (pihak yang memiliki hubungan istimewa) harus menggunakan Prinsip Kewajaran dan Kelaziman Usaha (*Arm's Length Principle/ALP*). Jika tidak, otoritas pajak (DJP) dapat mengoreksi laba dan mengenakan sanksi denda.

*Disclaimer: Tax Planning harus disesuaikan dengan kondisi spesifik perusahaan dan berkonsultasi dengan Konsultan Pajak terdaftar.*
      `,
      is_premium: true,
      required_tier: "professional",
      order_index: 2,
      quizzes: [
        {
          question: "Apa perbedaan mendasar antara Tax Avoidance dan Tax Evasion?",
          options: ["Keduanya ilegal dan merupakan tindak pidana korupsi", "Tax Avoidance adalah penggelapan ilegal, Tax Evasion adalah perencanaan legal", "Tax Avoidance adalah meminimalkan pajak menggunakan celah hukum secara legal, Tax Evasion adalah penggelapan pajak yang ilegal", "Tidak ada bedanya"],
          correct_option_index: 2,
          explanation: "Tax Avoidance adalah upaya meminimalkan beban pajak dengan memanfaatkan ketentuan UU perpajakan yang ada secara legal, sedangkan Tax Evasion adalah tindakan ilegal menyembunyikan/memalsukan data agar tidak bayar pajak."
        }
      ]
    },

    // --- HUKUM KETENAGAKERJAAN ---
    {
      category_id: ketenagakerjaanId,
      title: "Panduan Pemutusan Hubungan Kerja (PHK) dan Perhitungan Pesangon",
      content: `
# Panduan Lengkap: Pemutusan Hubungan Kerja (PHK) dan Pesangon

PHK adalah proses hukum ketenagakerjaan yang paling rawan sengketa. Melakukan PHK tanpa prosedur yang benar dapat memicu gugatan ke Pengadilan Hubungan Industrial (PHI).

## Alasan PHK yang Dibenarkan (UU Cipta Kerja)
Perusahaan tidak boleh semena-mena mem-PHK karyawan. Alasan yang diperbolehkan antara lain:
- Perusahaan melakukan penggabungan (merger), peleburan, atau pemisahan.
- Perusahaan tutup karena rugi terus-menerus atau *force majeure*.
- Pekerja melanggar Perjanjian Kerja/Peraturan Perusahaan (setelah diberikan Surat Peringatan SP 1, 2, dan 3).
- Pekerja melakukan pelanggaran bersifat mendesak (pelanggaran berat) seperti pencurian atau penggelapan.
- Pekerja mengundurkan diri (Resign).

## Komponen Hak Akibat PHK
Jika karyawan tetap (PKWTT) di-PHK, ia berhak atas:
1. **Uang Pesangon (UP):** Dihitung berdasarkan masa kerja (Maksimal 9 bulan upah).
2. **Uang Penghargaan Masa Kerja (UPMK):** Bagi yang bekerja minimal 3 tahun (Maksimal 10 bulan upah).
3. **Uang Penggantian Hak (UPH):** Sisa cuti tahunan yang belum diambil, ongkos pulang ke tempat diterima kerja.

## Pengali Pesangon (Multiplier)
Berdasarkan PP No. 35 Tahun 2021, jumlah pesangon yang dibayarkan dikalikan dengan faktor alasan PHK.
- **PHK karena efisiensi/rugi:** Karyawan mendapat 0,5 x Pesangon + 1 x UPMK + UPH.
- **PHK karena pensiun:** Karyawan mendapat 1,75 x Pesangon + 1 x UPMK + UPH.
- **Karyawan Resign:** Tidak mendapat uang pesangon dan UPMK, melainkan hanya UPH dan Uang Pisah (jika diatur dalam kontrak).
      `,
      is_premium: true,
      required_tier: "professional",
      order_index: 1,
      quizzes: [
        {
          question: "Berdasarkan aturan ketenagakerjaan saat ini, apakah karyawan yang mengundurkan diri secara sukarela (Resign) berhak mendapatkan Uang Pesangon?",
          options: ["Ya, sebesar 1x ketentuan", "Ya, sebesar 0.5x ketentuan", "Tidak, mereka hanya berhak atas Uang Penggantian Hak dan Uang Pisah (jika diatur)", "Tergantung kebijaksanaan atasan langsung"],
          correct_option_index: 2,
          explanation: "Karyawan yang mengundurkan diri secara sukarela tidak berhak mendapatkan Uang Pesangon maupun UPMK, melainkan berhak atas Uang Penggantian Hak (sisa cuti, dsb) dan Uang Pisah yang besarannya diatur dalam Perjanjian Kerja/Peraturan Perusahaan."
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

  console.log("Seeding new categories complete!");
}

seedNewCategories().catch(console.error);
