import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function updateMaterials() {
  const updates = [
    {
      title: "Strategi Melindungi Hak Kekayaan Intelektual (HAKI)",
      content: `
# Strategi Eksekutif Melindungi Hak Kekayaan Intelektual (HAKI)

Bagi perusahaan berbasis teknologi, desain, atau waralaba (*franchise*), **Hak Kekayaan Intelektual (HAKI)** adalah aset yang valuasinya bisa melebihi aset fisik berupa gedung dan pabrik. Namun, perlindungan HAKI di Indonesia sangat bergantung pada tindakan proaktif Anda.

## 1. Merek Dagang (Trademark) - UU No. 20 Tahun 2016

Melindungi nama brand, logo, hingga jingle suara.
- **Prinsip Utama:** Indonesia menganut sistem **First to File** (Siapa yang mendaftar lebih dulu, dia yang berhak). Berbeda dengan sistem *First to Use* (Siapa yang memakai lebih dulu).
- **Contoh Masalah:** Kedai kopi Anda "Kopi Sejahtera" sudah beroperasi 5 tahun dan sangat viral. Namun, kompetitor Anda diam-diam mendaftarkan nama "Kopi Sejahtera" ke DJKI (Direktorat Jenderal Kekayaan Intelektual). Secara hukum, kompetitor Andalah pemilik sah merek tersebut, dan mereka bisa mensomasi Anda untuk mengganti nama toko Anda sendiri.

## 2. Hak Cipta (Copyright) - UU No. 28 Tahun 2014

Melindungi karya seni, buku, musik, desain UI/UX, dan yang paling penting untuk startup: **Source Code Aplikasi (Program Komputer)**.
- **Prinsip Utama:** Hak cipta timbul secara otomatis (deklaratif) saat karya tersebut diwujudkan secara nyata, tanpa harus didaftarkan. Namun, mendaftarkannya (pencatatan hak cipta) sangat disarankan untuk kemudahan pembuktian di pengadilan.
- **Contoh Masalah:** Perusahaan Anda membayar programmer lepasan (freelancer) untuk membuat aplikasi e-commerce tanpa kontrak tertulis yang jelas. Sang programmer kemudian menjual *source code* yang sama persis kepada pesaing Anda. Karena tidak ada klausul *IP Assignment* (Peralihan HAKI) di kontraknya, programmer tersebut bisa berargumen bahwa ia masih memegang hak cipta atas *source code* tersebut.

## 3. Rahasia Dagang (Trade Secret) - UU No. 30 Tahun 2000

Melindungi informasi yang tidak diketahui umum di bidang teknologi/bisnis yang mempunyai nilai ekonomi. (Contoh: Resep KFC, algoritma Google, database klien).
- **Prinsip Utama:** Rahasia Dagang mendapat perlindungan selama informasi itu tetap dirahasiakan melalui langkah-langkah yang patut (misal: disimpan dalam server terenkripsi, diakses terbatas).
- **Contoh Masalah:** Mantan Manajer Penjualan Anda keluar dan membawa file *Excel database* seluruh pelanggan VIP perusahaan untuk digunakan di tempat kerja barunya. Jika sejak awal ia tidak disodori **NDA (Non-Disclosure Agreement)** dan klausul kerahasiaan dalam kontrak kerjanya, akan sangat sulit mempidanakan mantan manajer tersebut dengan UU Rahasia Dagang.
      `
    },
    {
      title: "Kepatuhan Perlindungan Data Pribadi (UU PDP)",
      content: `
# Pedoman Eksekutif: Kepatuhan UU Perlindungan Data Pribadi (UU PDP)

Dengan diundangkannya **Undang-Undang No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP)**, Indonesia kini memiliki regulasi ketat setara GDPR di Eropa. Setiap entitas (Pengendali Data Pribadi) yang mengumpulkan data masyarakat (NIK, email, nomor HP, data biometrik) memiliki kewajiban hukum yang berat.

## Prinsip Pemrosesan Data (Pasal 16 UU PDP)

Perusahaan teknologi, *e-commerce*, dan perbankan harus merombak *Privacy Policy* (Kebijakan Privasi) dan sistem internal mereka untuk mematuhi prinsip ini:

1. **Persetujuan yang Sah (Explicit Consent):**
   Persetujuan pengguna atas pengumpulan data harus diberikan secara jelas, tidak boleh tersembunyi.
   > **Contoh Masalah:** Form registrasi aplikasi Anda mencantumkan kotak "Saya setuju menerima email marketing" yang **sudah tercentang secara otomatis** (*pre-ticked box*). Praktik ini ilegal menurut UU PDP. Pengguna harus melakukan tindakan afirmatif (mencentang sendiri).

2. **Pembatasan Tujuan (Purpose Limitation):**
   Data hanya boleh digunakan sesuai tujuan awal yang disetujui.
   > **Contoh Masalah:** Aplikasi ojek *online* mengumpulkan nomor telepon untuk keperluan logistik pengantaran makanan. Namun, diam-diam nomor tersebut dijual/diberikan ke perusahaan asuransi afiliasinya untuk keperluan telemarketing. Ini adalah pelanggaran serius yang bisa berujung pidana.

3. **Kewajiban Melapor Kebocoran Data (Pasal 46 UU PDP):**
   Jika server perusahaan Anda diretas dan data pelanggan bocor (Data Breach), Anda diwajibkan oleh undang-undang untuk memberitahukan secara tertulis paling lambat **3 x 24 jam** kepada:
   - Subjek Data (Pengguna yang datanya bocor).
   - Lembaga / Otoritas terkait pelindungan data pribadi.

## Ancaman Sanksi Berat

Bagi korporasi yang melanggar ketentuan UU PDP, sanksinya tidak main-main:
- **Sanksi Administratif:** Denda paling banyak **2% (dua persen) dari total pendapatan tahunan** atau penerimaan tahunan terhadap pelanggaran yang dilakukan (Pasal 57).
- **Sanksi Pidana:** Penjara hingga 5 tahun dan denda pidana hingga Rp 50 Miliar (Pasal 67-68) jika terbukti secara melawan hukum menjual, membeli, atau memalsukan data pribadi.
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
