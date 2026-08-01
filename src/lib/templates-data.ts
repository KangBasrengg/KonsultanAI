import { LegalTemplate } from "@/types/cases";

export const templates: LegalTemplate[] = [
  {
    id: "somasi-penipuan",
    category: "somasi",
    title: "Surat Somasi (Dugaan Penipuan)",
    description: "Template surat teguran hukum (somasi) untuk kasus dugaan tindak pidana penipuan dan/atau penggelapan.",
    tier_required: "free",
    placeholders: [
      { key: "KOTA_TANGGAL", label: "Kota dan Tanggal Surat", type: "text", required: true },
      { key: "NAMA_PENERIMA", label: "Nama Penerima Somasi", type: "text", required: true },
      { key: "ALAMAT_PENERIMA", label: "Alamat Penerima", type: "text", required: true },
      { key: "NAMA_PENGIRIM", label: "Nama Anda (Pengirim)", type: "text", required: true },
      { key: "ALAMAT_PENGIRIM", label: "Alamat Anda", type: "text", required: true },
      { key: "TANGGAL_KEJADIAN", label: "Tanggal Kejadian", type: "date", required: true },
      { key: "NOMINAL_KERUGIAN", label: "Nominal Kerugian (Rp)", type: "number", required: true },
      { key: "BATAS_WAKTU", label: "Batas Waktu (Hari)", type: "number", required: true },
    ],
    content: `
**HAL: SOMASI / TEGURAN HUKUM PERTAMA DAN TERAKHIR**

[KOTA_TANGGAL]

Kepada Yth.,
Sdr/i. **[NAMA_PENERIMA]**
di 
[ALAMAT_PENERIMA]

Dengan hormat,

Yang bertanda tangan di bawah ini, saya **[NAMA_PENGIRIM]**, bertempat tinggal di [ALAMAT_PENGIRIM], dengan ini menyampaikan SOMASI (Teguran Hukum) kepada Saudara/i dengan alasan-alasan sebagai berikut:

1. Bahwa pada tanggal [TANGGAL_KEJADIAN], Saudara/i telah melakukan tindakan yang merugikan saya secara materil sebesar Rp [NOMINAL_KERUGIAN].
2. Bahwa tindakan Saudara/i tersebut patut diduga telah memenuhi unsur tindak pidana Penipuan dan/atau Penggelapan sebagaimana diatur dalam Pasal 378 dan/atau Pasal 372 Kitab Undang-Undang Hukum Pidana (KUHP).
3. Bahwa hingga surat somasi ini diterbitkan, Saudara/i belum menunjukkan itikad baik untuk menyelesaikan kewajiban dan mengembalikan kerugian saya.

Berdasarkan hal-hal tersebut di atas, dengan ini saya memberikan TEGURAN KERAS agar Saudara/i segera mengembalikan dana sebesar Rp [NOMINAL_KERUGIAN] kepada saya selambat-lambatnya dalam waktu **[BATAS_WAKTU] hari** sejak diterimanya surat ini.

Apabila dalam batas waktu tersebut Saudara/i tidak juga menunjukkan itikad baik, maka saya akan menempuh jalur hukum secara tegas, baik pelaporan pidana ke pihak Kepolisian RI maupun gugatan perdata di Pengadilan Negeri.

Demikian surat somasi ini dibuat agar menjadi perhatian Saudara/i.

Hormat saya,


( **[NAMA_PENGIRIM]** )
    `
  },
  {
    id: "perjanjian-pinjam-uang",
    category: "perjanjian",
    title: "Surat Perjanjian Pinjam Meminjam Uang",
    description: "Template dasar perjanjian utang piutang antar individu untuk melindungi hak hukum.",
    tier_required: "professional",
    placeholders: [
      { key: "HARI_TANGGAL", label: "Hari dan Tanggal", type: "text", required: true },
      { key: "NAMA_PIHAK_1", label: "Nama Pihak Pertama (Peminjam)", type: "text", required: true },
      { key: "NIK_PIHAK_1", label: "NIK Pihak Pertama", type: "number", required: true },
      { key: "ALAMAT_PIHAK_1", label: "Alamat Pihak Pertama", type: "text", required: true },
      { key: "NAMA_PIHAK_2", label: "Nama Pihak Kedua (Pemberi Pinjaman)", type: "text", required: true },
      { key: "NIK_PIHAK_2", label: "NIK Pihak Kedua", type: "number", required: true },
      { key: "ALAMAT_PIHAK_2", label: "Alamat Pihak Kedua", type: "text", required: true },
      { key: "NOMINAL_PINJAMAN", label: "Nominal Pinjaman (Rp)", type: "number", required: true },
      { key: "TANGGAL_JATUH_TEMPO", label: "Tanggal Jatuh Tempo", type: "date", required: true },
    ],
    content: `
**SURAT PERJANJIAN PINJAM MEMINJAM UANG**

Pada hari ini, [HARI_TANGGAL], kami yang bertanda tangan di bawah ini:

1. Nama: **[NAMA_PIHAK_1]**
   NIK: [NIK_PIHAK_1]
   Alamat: [ALAMAT_PIHAK_1]
   Selanjutnya disebut sebagai **PIHAK PERTAMA (Peminjam)**.

2. Nama: **[NAMA_PIHAK_2]**
   NIK: [NIK_PIHAK_2]
   Alamat: [ALAMAT_PIHAK_2]
   Selanjutnya disebut sebagai **PIHAK KEDUA (Pemberi Pinjaman)**.

Kedua belah pihak sepakat untuk mengadakan perjanjian utang piutang dengan syarat dan ketentuan sebagai berikut:

**Pasal 1: Besaran Pinjaman**
PIHAK KEDUA telah memberikan pinjaman uang tunai/transfer kepada PIHAK PERTAMA sebesar **Rp [NOMINAL_PINJAMAN]** dan PIHAK PERTAMA mengakui telah menerima uang tersebut secara penuh.

**Pasal 2: Jangka Waktu & Pengembalian**
PIHAK PERTAMA berjanji akan mengembalikan pinjaman tersebut secara lunas kepada PIHAK KEDUA selambat-lambatnya pada tanggal **[TANGGAL_JATUH_TEMPO]**.

**Pasal 3: Penyelesaian Sengketa**
Apabila terjadi perselisihan, kedua belah pihak sepakat menyelesaikan secara kekeluargaan. Jika tidak tercapai mufakat, maka akan diselesaikan melalui jalur hukum sesuai ketentuan hukum yang berlaku di Indonesia.

Demikian Surat Perjanjian ini dibuat dan ditandatangani oleh kedua belah pihak dalam keadaan sadar dan tanpa paksaan.

**PIHAK PERTAMA**
(materai 10.000)

**[NAMA_PIHAK_1]**

**PIHAK KEDUA**


**[NAMA_PIHAK_2]**
    `
  },
  {
    id: "kuasa-insidentil",
    category: "kuasa",
    title: "Surat Kuasa Insidentil (Keluarga)",
    description: "Template surat kuasa khusus bagi keluarga untuk mewakili di pengadilan tanpa advokat.",
    tier_required: "professional",
    placeholders: [
      { key: "NAMA_PEMBERI", label: "Nama Pemberi Kuasa", type: "text", required: true },
      { key: "ALAMAT_PEMBERI", label: "Alamat Pemberi", type: "text", required: true },
      { key: "NAMA_PENERIMA", label: "Nama Penerima Kuasa", type: "text", required: true },
      { key: "ALAMAT_PENERIMA", label: "Alamat Penerima", type: "text", required: true },
      { key: "HUBUNGAN", label: "Hubungan Kekeluargaan (mis. Suami, Anak)", type: "text", required: true },
      { key: "NAMA_PENGADILAN", label: "Nama Pengadilan (mis. PN Jakarta Selatan)", type: "text", required: true },
      { key: "HAL_KASUS", label: "Hal / Kasus", type: "text", required: true },
      { key: "KOTA_TANGGAL", label: "Kota dan Tanggal Surat", type: "text", required: true },
    ],
    content: `
**SURAT KUASA INSIDENTIL**

Yang bertanda tangan di bawah ini:
Nama: **[NAMA_PEMBERI]**
Alamat: [ALAMAT_PEMBERI]
Selanjutnya disebut sebagai **PEMBERI KUASA**.

Dengan ini memberikan kuasa kepada keluarga saya:
Nama: **[NAMA_PENERIMA]**
Alamat: [ALAMAT_PENERIMA]
Hubungan: [HUBUNGAN]
Selanjutnya disebut sebagai **PENERIMA KUASA**.

**------------------------- KHUSUS -------------------------**

Untuk dan atas nama PEMBERI KUASA, mewakili dan mendampingi Pemberi Kuasa di **[NAMA_PENGADILAN]** sebagai Penggugat/Tergugat/Pemohon/Termohon dalam perkara:

**"[HAL_KASUS]"**

Untuk itu Penerima Kuasa berhak menghadiri semua persidangan, menghadap hakim, menyerahkan alat-alat bukti, mengajukan saksi-saksi, menandatangani surat-surat, meminta putusan, dan melakukan segala tindakan hukum yang diperlukan demi membela hak-hak Pemberi Kuasa sejauh diperbolehkan hukum.

Kekuasaan ini diberikan dengan hak substitusi maupun retensi.

[KOTA_TANGGAL]

**PENERIMA KUASA**


**[NAMA_PENERIMA]**

**PEMBERI KUASA**
(materai 10.000)

**[NAMA_PEMBERI]**
    `
  }
];

export function getTemplateById(id: string): LegalTemplate | undefined {
  return templates.find(t => t.id === id);
}

export function getTemplatesByCategory(category: string): LegalTemplate[] {
  return templates.filter(t => t.category === category);
}
