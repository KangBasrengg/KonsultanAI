import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function updateMaterials() {
  const updates = [
    {
      title: "Strategi Perencanaan Pajak (Tax Planning) Legal bagi Korporasi",
      content: `
# Masterclass: Strategi Perencanaan Pajak (Tax Planning) Legal bagi Korporasi

Pajak adalah salah satu komponen biaya terbesar bagi sebuah bisnis. Tanpa perencanaan yang tepat, perusahaan bisa kehilangan aliran kas secara signifikan. *Tax Planning* adalah strategi menyusun pembukuan dan operasional untuk meminimalkan beban pajak tanpa melanggar **Undang-Undang Harmonisasi Peraturan Perpajakan (UU HPP No. 7 Tahun 2021)**.

## Tax Avoidance vs Tax Evasion

- **Tax Avoidance (Penghindaran Pajak Legal):** Memanfaatkan celah atau fasilitas keringanan yang diatur secara eksplisit dalam peraturan. Ini **LEGAL**.
- **Tax Evasion (Penggelapan Pajak):** Memanipulasi laporan keuangan, menyembunyikan penjualan, atau memalsukan faktur. Ini merupakan **TINDAK PIDANA** (Pasal 39 UU KUP).

> **Contoh Masalah Tax Evasion:** Perusahaan retail tidak melaporkan 30% dari penjualan tunainya untuk mengurangi pajak. Jika terdeteksi DJP melalui pemeriksaan, direktur perusahaan dapat dipidana penjara 6 bulan hingga 6 tahun dan denda 2 hingga 4 kali jumlah pajak yang kurang dibayar.

## Strategi Optimalisasi *Deductible Expenses* (Pasal 6 UU PPh)

Menurut UU PPh, ada biaya yang bisa dikurangkan dari laba kotor (*Deductible*), dan ada yang tidak bisa (*Non-Deductible*, Pasal 9 UU PPh).

**Strategi Gross-Up PPh 21:**
Seringkali perusahaan menanggung pajak penghasilan karyawan (PPh 21). Jika perusahaan hanya membayarkan pajak tersebut sebagai "pajak ditanggung perusahaan", biaya pajak ini adalah *Non-Deductible*.
- **Solusi:** Ubah sistem penggajian menjadi metode *Gross-Up*. Perusahaan memberikan "Tunjangan Pajak" sebesar pajak yang terutang. Tunjangan ini akan menambah penghasilan bruto karyawan, dan dapat dibiayakan secara penuh oleh perusahaan, sehingga mengurangi PPh Badan di akhir tahun.

## Transfer Pricing & Arm's Length Principle (ALP)

Banyak grup perusahaan menggunakan *Transfer Pricing* (penentuan harga transfer antar anak perusahaan) untuk menggeser laba ke perusahaan yang berada di negara/zona dengan tarif pajak rendah (*Tax Haven*).
Menurut Pasal 18 UU PPh, DJP berwenang menentukan kembali besarnya penghasilan jika transaksi antar entitas yang memiliki "Hubungan Istimewa" tidak menggunakan prinsip kewajaran dan kelaziman usaha (*Arm's Length Principle*).

> **Contoh Masalah Transfer Pricing:** PT Alpha (di Jakarta, PPh Badan 22%) menjual bahan baku ke afiliasinya PT Beta (di negara X dengan pajak 5%) dengan harga di bawah harga pasar. Akibatnya laba PT Alpha di Indonesia mengecil, sementara laba PT Beta membesar. DJP akan melakukan koreksi harga jual PT Alpha menjadi harga wajar (harga pasar), dan menagih kekurangan pajaknya beserta denda.

*Disclaimer: Implementasi Tax Planning yang kompleks harus melibatkan Konsultan Pajak atau Tax Lawyer bersertifikat.*
      `
    },
    {
      title: "Masterclass: Kepatuhan Anti-Suap & Penanganan Korupsi Korporasi",
      content: `
# Masterclass: Kepatuhan Anti-Suap & Pencegahan Tanggung Jawab Pidana Korporasi

Dulu, pidana korupsi hanya menyasar individu (Pejabat Negara atau Direktur Perusahaan). Kini, dengan berlakunya **Peraturan Mahkamah Agung (Perma) No. 13 Tahun 2016**, **Korporasi (Perusahaan) itu sendiri** dapat ditetapkan sebagai tersangka dalam kasus Tindak Pidana Korupsi.

## Mengapa Korporasi Bisa Dipidana? (Pasal 4 Perma 13/2016)

Korporasi dapat dimintai pertanggungjawaban pidana jika memenuhi salah satu dari tiga syarat berikut:
1. Tindak pidana korupsi/suap dilakukan untuk memberikan manfaat atau **keuntungan bagi korporasi**.
2. Korporasi **membiarkan terjadinya** tindak pidana tersebut.
3. Korporasi **tidak melakukan langkah-langkah yang diperlukan untuk mencegah**, mencegah dampak yang lebih besar, atau memastikan kepatuhan hukum (*lack of adequate procedures*).

> **Contoh Masalah:** Seorang manajer lapangan PT Delta memberikan "uang pelicin" Rp 500 Juta kepada panitia tender pemerintah agar perusahaannya memenangkan proyek jalan tol. Keuntungan proyek masuk ke rekening PT Delta. KPK tidak hanya menangkap sang manajer, tetapi juga menetapkan PT Delta sebagai tersangka korporasi karena sistem kontrol internalnya dinilai sengaja membiarkan penyuapan terjadi. Sanksinya: Izin usaha PT Delta dicabut dan asetnya dirampas untuk negara.

## Membangun Sistem Manajemen Anti-Penyuapan (ISO 37001)

Untuk melindungi perusahaan (dan Dewan Direksi) dari jeratan pidana korporasi, perusahaan HARUS memiliki benteng pencegahan yang dapat dibuktikan secara hukum:

### 1. Deklarasi Code of Conduct & Gift Policy
Tetapkan kebijakan tertulis mengenai pemberian dan penerimaan hadiah (*gratifikasi*), biaya hiburan (*entertainment*), dan larangan tegas atas uang pelicin (*facilitation payments*). Aturan Pasal 12B UU Tipikor melarang keras PNS/Penyelenggara Negara menerima gratifikasi yang berhubungan dengan jabatannya.

### 2. Whistleblowing System (WBS)
Sediakan portal pelaporan anonim (misalnya via email independen atau aplikasi pihak ketiga) bagi karyawan yang melihat adanya manipulasi tender, suap, atau *fraud* di dalam perusahaan. Lindungi pelapor dari sanksi demosi atau pemecatan.

### 3. Due Diligence Vendor Pihak Ketiga
Banyak korporasi besar terjerat kasus suap karena menggunakan "Konsultan" atau "Agen Pihak Ketiga" yang tugas sebenarnya adalah menjadi perantara pemberian suap (pencucian uang). Perusahaan wajib melakukan uji kelayakan (KYC) menyeluruh: siapa pemilik vendor, apakah mereka memiliki afiliasi politik (PEP - *Politically Exposed Person*), dan pastikan ada klausul Anti-Suap dalam kontrak vendor.

Dalam pengadilan, keberadaan prosedur di atas (*Adequate Procedures*) dapat digunakan oleh pengacara perusahaan sebagai pembelaan bahwa korporasi sudah melakukan upaya maksimal, sehingga kesalahan sepenuhnya berada pada individu oknum pelaku.
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
