// Types for PRD v2.5: Intake Form + Cases + Templates

export type CaseType = 'pidana' | 'perdata' | 'keluarga' | 'bisnis' | 'teknologi';
export type UrgencyLevel = 'immediate' | 'normal' | 'planning';
export type TriageRecommendation = 'AI_ANALYSIS' | 'LEARNING_FIRST' | 'ADVOKAT_URGENT' | 'TEMPLATES';
export type CaseStatus = 'open' | 'in_progress' | 'closed' | 'abandoned';
export type CaseOutcome = 'settled' | 'ongoing' | 'escalated' | 'abandoned';

// Intake Form sub-categories per case type
export const CASE_SUB_CATEGORIES: Record<CaseType, { value: string; label: string }[]> = {
  pidana: [
    { value: 'penipuan', label: 'Penipuan' },
    { value: 'kekerasan', label: 'Kekerasan / Penganiayaan' },
    { value: 'pencurian', label: 'Pencurian' },
    { value: 'penggelapan', label: 'Penggelapan' },
    { value: 'pelecehan_seksual', label: 'Pelecehan Seksual' },
    { value: 'kesusilaan_asusila', label: 'Kesusilaan / Asusila' },
    { value: 'kdrt', label: 'KDRT (Kekerasan Dalam Rumah Tangga)' },
    { value: 'pembunuhan', label: 'Pembunuhan' },
    { value: 'pemerasan_ancaman', label: 'Pemerasan / Ancaman' },
    { value: 'pemalsuan', label: 'Pemalsuan Dokumen / Surat' },
    { value: 'narkotika', label: 'Narkotika / Psikotropika' },
    { value: 'perjudian', label: 'Perjudian' },
    { value: 'korupsi', label: 'Korupsi / Tindak Pidana Khusus' },
    { value: 'pencemaran_nama', label: 'Pencemaran Nama Baik' },
    { value: 'pornografi', label: 'Pornografi' },
    { value: 'perdagangan_orang', label: 'Perdagangan Orang / Trafficking' },
    { value: 'pidana_lainnya', label: 'Lainnya' },
  ],
  perdata: [
    { value: 'perceraian', label: 'Perceraian' },
    { value: 'sengketa_tanah', label: 'Sengketa Tanah / Properti' },
    { value: 'utang_piutang', label: 'Utang Piutang' },
    { value: 'sengketa_bisnis', label: 'Sengketa Bisnis' },
    { value: 'wanprestasi', label: 'Wanprestasi (Ingkar Janji)' },
    { value: 'pmh', label: 'Perbuatan Melawan Hukum (PMH)' },
    { value: 'perlindungan_konsumen', label: 'Perlindungan Konsumen' },
    { value: 'sengketa_hki', label: 'Sengketa Hak Kekayaan Intelektual' },
    { value: 'sengketa_waris', label: 'Sengketa Waris' },
    { value: 'perdata_lainnya', label: 'Lainnya' },
  ],
  keluarga: [
    { value: 'waris', label: 'Waris' },
    { value: 'perwalian', label: 'Perwalian' },
    { value: 'adopsi', label: 'Adopsi' },
    { value: 'hak_asuh', label: 'Hak Asuh Anak' },
    { value: 'nafkah', label: 'Nafkah' },
    { value: 'kdrt_keluarga', label: 'KDRT / Kekerasan Dalam Rumah Tangga' },
    { value: 'pembatalan_nikah', label: 'Pembatalan Perkawinan' },
    { value: 'dispensasi_nikah', label: 'Dispensasi Nikah' },
    { value: 'keluarga_lainnya', label: 'Lainnya' },
  ],
  bisnis: [
    { value: 'kontrak', label: 'Kontrak & Perjanjian' },
    { value: 'hki', label: 'Hak Kekayaan Intelektual' },
    { value: 'ketenagakerjaan', label: 'Ketenagakerjaan & PHK' },
    { value: 'perizinan', label: 'Perizinan Usaha' },
    { value: 'pajak', label: 'Pajak & Keuangan' },
    { value: 'persaingan_usaha', label: 'Persaingan Usaha' },
    { value: 'lingkungan', label: 'Lingkungan Hidup & AMDAL' },
    { value: 'bisnis_lainnya', label: 'Lainnya' },
  ],
  teknologi: [
    { value: 'ite_ujaran', label: 'UU ITE / Ujaran Kebencian Online' },
    { value: 'penipuan_online', label: 'Penipuan Online / Fraud Digital' },
    { value: 'data_pribadi', label: 'Pelanggaran Data Pribadi' },
    { value: 'cyberbullying', label: 'Cyberbullying / Pelecehan Online' },
    { value: 'hacking', label: 'Peretasan / Akses Ilegal' },
    { value: 'konten_ilegal', label: 'Konten Ilegal / Pornografi Online' },
    { value: 'ecommerce', label: 'Sengketa E-Commerce' },
    { value: 'teknologi_lainnya', label: 'Lainnya' },
  ],
};

export const CASE_TYPE_OPTIONS: { value: CaseType; label: string; icon: string }[] = [
  { value: 'pidana', label: 'Hukum Pidana', icon: '⚖️' },
  { value: 'perdata', label: 'Hukum Perdata', icon: '📋' },
  { value: 'keluarga', label: 'Hukum Keluarga', icon: '👨‍👩‍👧' },
  { value: 'bisnis', label: 'Hukum Bisnis & Komersial', icon: '💼' },
  { value: 'teknologi', label: 'Teknologi & Siber', icon: '💻' },
];

export const URGENCY_OPTIONS: { value: UrgencyLevel; label: string; desc: string; color: string }[] = [
  { value: 'immediate', label: 'Mendesak', desc: '< 7 hari', color: 'text-red-400' },
  { value: 'normal', label: 'Normal', desc: '1-4 minggu', color: 'text-gold' },
  { value: 'planning', label: 'Perencanaan', desc: '> 1 bulan', color: 'text-green-400' },
];

export const PROVINSI_KOTA_DATA: Record<string, string[]> = {
  "Aceh": ["Kab. Aceh Barat", "Kab. Aceh Barat Daya", "Kab. Aceh Besar", "Kab. Aceh Jaya", "Kab. Aceh Selatan", "Kab. Aceh Singkil", "Kab. Aceh Tamiang", "Kab. Aceh Tengah", "Kab. Aceh Tenggara", "Kab. Aceh Timur", "Kab. Aceh Utara", "Kab. Bener Meriah", "Kab. Bireuen", "Kab. Gayo Lues", "Kab. Nagan Raya", "Kab. Pidie", "Kab. Pidie Jaya", "Kab. Simeulue", "Kota Banda Aceh", "Kota Langsa", "Kota Lhokseumawe", "Kota Sabang", "Kota Subulussalam"],
  "Sumatera Utara": ["Kab. Asahan", "Kab. Batu Bara", "Kab. Dairi", "Kab. Deli Serdang", "Kab. Humbang Hasundutan", "Kab. Karo", "Kab. Labuhanbatu", "Kab. Labuhanbatu Selatan", "Kab. Labuhanbatu Utara", "Kab. Langkat", "Kab. Mandailing Natal", "Kab. Nias", "Kab. Nias Barat", "Kab. Nias Selatan", "Kab. Nias Utara", "Kab. Padang Lawas", "Kab. Padang Lawas Utara", "Kab. Pakpak Bharat", "Kab. Samosir", "Kab. Serdang Bedagai", "Kab. Simalungun", "Kab. Tapanuli Selatan", "Kab. Tapanuli Tengah", "Kab. Tapanuli Utara", "Kab. Toba Samosir", "Kota Binjai", "Kota Gunungsitoli", "Kota Medan", "Kota Padangsidempuan", "Kota Pematangsiantar", "Kota Sibolga", "Kota Tanjungbalai", "Kota Tebing Tinggi"],
  "Sumatera Barat": ["Kab. Agam", "Kab. Dharmasraya", "Kab. Kepulauan Mentawai", "Kab. Lima Puluh Kota", "Kab. Padang Pariaman", "Kab. Pasaman", "Kab. Pasaman Barat", "Kab. Pesisir Selatan", "Kab. Sijunjung", "Kab. Solok", "Kab. Solok Selatan", "Kab. Tanah Datar", "Kota Bukittinggi", "Kota Padang", "Kota Padangpanjang", "Kota Pariaman", "Kota Payakumbuh", "Kota Sawahlunto", "Kota Solok"],
  "Riau": ["Kab. Bengkalis", "Kab. Indragiri Hilir", "Kab. Indragiri Hulu", "Kab. Kampar", "Kab. Kepulauan Meranti", "Kab. Kuantan Singingi", "Kab. Pelalawan", "Kab. Rokan Hilir", "Kab. Rokan Hulu", "Kab. Siak", "Kota Dumai", "Kota Pekanbaru"],
  "Jambi": ["Kab. Batanghari", "Kab. Bungo", "Kab. Kerinci", "Kab. Merangin", "Kab. Muaro Jambi", "Kab. Sarolangun", "Kab. Tanjung Jabung Barat", "Kab. Tanjung Jabung Timur", "Kab. Tebo", "Kota Jambi", "Kota Sungai Penuh"],
  "Sumatera Selatan": ["Kab. Banyuasin", "Kab. Empat Lawang", "Kab. Lahat", "Kab. Muara Enim", "Kab. Musi Banyuasin", "Kab. Musi Rawas", "Kab. Musi Rawas Utara", "Kab. Ogan Ilir", "Kab. Ogan Komering Ilir", "Kab. Ogan Komering Ulu", "Kab. Ogan Komering Ulu Selatan", "Kab. Ogan Komering Ulu Timur", "Kab. Penukal Abab Lematang Ilir", "Kota Lubuklinggau", "Kota Pagar Alam", "Kota Palembang", "Kota Prabumulih"],
  "Bengkulu": ["Kab. Bengkulu Selatan", "Kab. Bengkulu Tengah", "Kab. Bengkulu Utara", "Kab. Kaur", "Kab. Kepahiang", "Kab. Lebong", "Kab. Mukomuko", "Kab. Rejang Lebong", "Kab. Seluma", "Kota Bengkulu"],
  "Lampung": ["Kab. Lampung Barat", "Kab. Lampung Selatan", "Kab. Lampung Tengah", "Kab. Lampung Timur", "Kab. Lampung Utara", "Kab. Mesuji", "Kab. Pesawaran", "Kab. Pesisir Barat", "Kab. Pringsewu", "Kab. Tanggamus", "Kab. Tulang Bawang", "Kab. Tulang Bawang Barat", "Kab. Way Kanan", "Kota Bandar Lampung", "Kota Metro"],
  "Kepulauan Bangka Belitung": ["Kab. Bangka", "Kab. Bangka Barat", "Kab. Bangka Selatan", "Kab. Bangka Tengah", "Kab. Belitung", "Kab. Belitung Timur", "Kota Pangkal Pinang"],
  "Kepulauan Riau": ["Kab. Bintan", "Kab. Karimun", "Kab. Kepulauan Anambas", "Kab. Lingga", "Kab. Natuna", "Kota Batam", "Kota Tanjung Pinang"],
  "DKI Jakarta": ["Kab. Kepulauan Seribu", "Kota Jakarta Barat", "Kota Jakarta Pusat", "Kota Jakarta Selatan", "Kota Jakarta Timur", "Kota Jakarta Utara"],
  "Jawa Barat": ["Kab. Bandung", "Kab. Bandung Barat", "Kab. Bekasi", "Kab. Bogor", "Kab. Ciamis", "Kab. Cianjur", "Kab. Cirebon", "Kab. Garut", "Kab. Indramayu", "Kab. Karawang", "Kab. Kuningan", "Kab. Majalengka", "Kab. Pangandaran", "Kab. Purwakarta", "Kab. Subang", "Kab. Sukabumi", "Kab. Sumedang", "Kab. Tasikmalaya", "Kota Bandung", "Kota Banjar", "Kota Bekasi", "Kota Bogor", "Kota Cimahi", "Kota Cirebon", "Kota Depok", "Kota Sukabumi", "Kota Tasikmalaya"],
  "Jawa Tengah": ["Kab. Banjarnegara", "Kab. Banyumas", "Kab. Batang", "Kab. Blora", "Kab. Boyolali", "Kab. Brebes", "Kab. Cilacap", "Kab. Demak", "Kab. Grobogan", "Kab. Jepara", "Kab. Karanganyar", "Kab. Kebumen", "Kab. Kendal", "Kab. Klaten", "Kab. Kudus", "Kab. Magelang", "Kab. Pati", "Kab. Pekalongan", "Kab. Pemalang", "Kab. Purbalingga", "Kab. Purworejo", "Kab. Rembang", "Kab. Semarang", "Kab. Sragen", "Kab. Sukoharjo", "Kab. Tegal", "Kab. Temanggung", "Kab. Wonogiri", "Kab. Wonosobo", "Kota Magelang", "Kota Pekalongan", "Kota Salatiga", "Kota Semarang", "Kota Surakarta", "Kota Tegal"],
  "DI Yogyakarta": ["Kab. Bantul", "Kab. Gunungkidul", "Kab. Kulon Progo", "Kab. Sleman", "Kota Yogyakarta"],
  "Jawa Timur": ["Kab. Bangkalan", "Kab. Banyuwangi", "Kab. Blitar", "Kab. Bojonegoro", "Kab. Bondowoso", "Kab. Gresik", "Kab. Jember", "Kab. Jombang", "Kab. Kediri", "Kab. Lamongan", "Kab. Lumajang", "Kab. Madiun", "Kab. Magetan", "Kab. Malang", "Kab. Mojokerto", "Kab. Nganjuk", "Kab. Ngawi", "Kab. Pacitan", "Kab. Pamekasan", "Kab. Pasuruan", "Kab. Ponorogo", "Kab. Probolinggo", "Kab. Sampang", "Kab. Sidoarjo", "Kab. Situbondo", "Kab. Sumenep", "Kab. Trenggalek", "Kab. Tuban", "Kab. Tulungagung", "Kota Batu", "Kota Blitar", "Kota Kediri", "Kota Madiun", "Kota Malang", "Kota Mojokerto", "Kota Pasuruan", "Kota Probolinggo", "Kota Surabaya"],
  "Banten": ["Kab. Lebak", "Kab. Pandeglang", "Kab. Serang", "Kab. Tangerang", "Kota Cilegon", "Kota Serang", "Kota Tangerang", "Kota Tangerang Selatan"],
  "Bali": ["Kab. Badung", "Kab. Bangli", "Kab. Buleleng", "Kab. Gianyar", "Kab. Jembrana", "Kab. Karangasem", "Kab. Klungkung", "Kab. Tabanan", "Kota Denpasar"],
  "Nusa Tenggara Barat": ["Kab. Bima", "Kab. Dompu", "Kab. Lombok Barat", "Kab. Lombok Tengah", "Kab. Lombok Timur", "Kab. Lombok Utara", "Kab. Sumbawa", "Kab. Sumbawa Barat", "Kota Bima", "Kota Mataram"],
  "Nusa Tenggara Timur": ["Kab. Alor", "Kab. Belu", "Kab. Ende", "Kab. Flores Timur", "Kab. Kupang", "Kab. Lembata", "Kab. Malaka", "Kab. Manggarai", "Kab. Manggarai Barat", "Kab. Manggarai Timur", "Kab. Nagekeo", "Kab. Ngada", "Kab. Rote Ndao", "Kab. Sabu Raijua", "Kab. Sikka", "Kab. Sumba Barat", "Kab. Sumba Barat Daya", "Kab. Sumba Tengah", "Kab. Sumba Timur", "Kab. Timor Tengah Selatan", "Kab. Timor Tengah Utara", "Kota Kupang"],
  "Kalimantan Barat": ["Kab. Bengkayang", "Kab. Kapuas Hulu", "Kab. Kayong Utara", "Kab. Ketapang", "Kab. Kubu Raya", "Kab. Landak", "Kab. Melawi", "Kab. Mempawah", "Kab. Sambas", "Kab. Sanggau", "Kab. Sekadau", "Kab. Sintang", "Kota Pontianak", "Kota Singkawang"],
  "Kalimantan Tengah": ["Kab. Barito Selatan", "Kab. Barito Timur", "Kab. Barito Utara", "Kab. Gunung Mas", "Kab. Kapuas", "Kab. Katingan", "Kab. Kotawaringin Barat", "Kab. Kotawaringin Timur", "Kab. Lamandau", "Kab. Murung Raya", "Kab. Pulang Pisau", "Kab. Sukamara", "Kab. Seruyan", "Kota Palangka Raya"],
  "Kalimantan Selatan": ["Kab. Balangan", "Kab. Banjar", "Kab. Barito Kuala", "Kab. Hulu Sungai Selatan", "Kab. Hulu Sungai Tengah", "Kab. Hulu Sungai Utara", "Kab. Kotabaru", "Kab. Tabalong", "Kab. Tanah Bumbu", "Kab. Tanah Laut", "Kab. Tapin", "Kota Banjarbaru", "Kota Banjarmasin"],
  "Kalimantan Timur": ["Kab. Berau", "Kab. Kutai Barat", "Kab. Kutai Kartanegara", "Kab. Kutai Timur", "Kab. Mahakam Ulu", "Kab. Paser", "Kab. Penajam Paser Utara", "Kota Balikpapan", "Kota Bontang", "Kota Samarinda"],
  "Kalimantan Utara": ["Kab. Bulungan", "Kab. Malinau", "Kab. Nunukan", "Kab. Tana Tidung", "Kota Tarakan"],
  "Sulawesi Utara": ["Kab. Bolaang Mongondow", "Kab. Bolaang Mongondow Selatan", "Kab. Bolaang Mongondow Timur", "Kab. Bolaang Mongondow Utara", "Kab. Kepulauan Sangihe", "Kab. Kepulauan Siau Tagulandang Biaro", "Kab. Kepulauan Talaud", "Kab. Minahasa", "Kab. Minahasa Selatan", "Kab. Minahasa Tenggara", "Kab. Minahasa Utara", "Kota Bitung", "Kota Kotamobagu", "Kota Manado", "Kota Tomohon"],
  "Sulawesi Tengah": ["Kab. Banggai", "Kab. Banggai Kepulauan", "Kab. Banggai Laut", "Kab. Buol", "Kab. Donggala", "Kab. Morowali", "Kab. Morowali Utara", "Kab. Parigi Moutong", "Kab. Poso", "Kab. Sigi", "Kab. Tojo Una-Una", "Kab. Tolitoli", "Kota Palu"],
  "Sulawesi Selatan": ["Kab. Bantaeng", "Kab. Barru", "Kab. Bone", "Kab. Bulukumba", "Kab. Enrekang", "Kab. Gowa", "Kab. Jeneponto", "Kab. Kepulauan Selayar", "Kab. Luwu", "Kab. Luwu Timur", "Kab. Luwu Utara", "Kab. Maros", "Kab. Pangkajene dan Kepulauan", "Kab. Pinrang", "Kab. Sidenreng Rappang", "Kab. Sinjai", "Kab. Soppeng", "Kab. Takalar", "Kab. Tana Toraja", "Kab. Toraja Utara", "Kab. Wajo", "Kota Makassar", "Kota Palopo", "Kota Parepare"],
  "Sulawesi Tenggara": ["Kab. Bombana", "Kab. Buton", "Kab. Buton Selatan", "Kab. Buton Tengah", "Kab. Buton Utara", "Kab. Kolaka", "Kab. Kolaka Timur", "Kab. Kolaka Utara", "Kab. Konawe", "Kab. Konawe Kepulauan", "Kab. Konawe Selatan", "Kab. Konawe Utara", "Kab. Muna", "Kab. Muna Barat", "Kab. Wakatobi", "Kota Bau-Bau", "Kota Kendari"],
  "Gorontalo": ["Kab. Boalemo", "Kab. Bone Bolango", "Kab. Gorontalo", "Kab. Gorontalo Utara", "Kab. Pohuwato", "Kota Gorontalo"],
  "Sulawesi Barat": ["Kab. Majene", "Kab. Mamasa", "Kab. Mamuju", "Kab. Mamuju Tengah", "Kab. Pasangkayu", "Kab. Polewali Mandar"],
  "Maluku": ["Kab. Buru", "Kab. Buru Selatan", "Kab. Kepulauan Aru", "Kab. Maluku Barat Daya", "Kab. Maluku Tengah", "Kab. Maluku Tenggara", "Kab. Kepulauan Tanimbar", "Kab. Seram Bagian Barat", "Kab. Seram Bagian Timur", "Kota Ambon", "Kota Tual"],
  "Maluku Utara": ["Kab. Halmahera Barat", "Kab. Halmahera Selatan", "Kab. Halmahera Tengah", "Kab. Halmahera Timur", "Kab. Halmahera Utara", "Kab. Kepulauan Sula", "Kab. Pulau Morotai", "Kab. Pulau Taliabu", "Kota Ternate", "Kota Tidore Kepulauan"],
  "Papua": ["Kab. Biak Numfor", "Kab. Jayapura", "Kab. Keerom", "Kab. Kepulauan Yapen", "Kab. Mamberamo Raya", "Kab. Sarmi", "Kab. Supiori", "Kab. Waropen", "Kota Jayapura"],
  "Papua Barat": ["Kab. Fakfak", "Kab. Kaimana", "Kab. Manokwari", "Kab. Manokwari Selatan", "Kab. Pegunungan Arfak", "Kab. Teluk Bintuni", "Kab. Teluk Wondama"],
  "Papua Selatan": ["Kab. Asmat", "Kab. Boven Digoel", "Kab. Mappi", "Kab. Merauke"],
  "Papua Tengah": ["Kab. Deiyai", "Kab. Dogiyai", "Kab. Intan Jaya", "Kab. Mimika", "Kab. Nabire", "Kab. Paniai", "Kab. Puncak", "Kab. Puncak Jaya"],
  "Papua Pegunungan": ["Kab. Jayawijaya", "Kab. Lanny Jaya", "Kab. Mamberamo Tengah", "Kab. Nduga", "Kab. Pegunungan Bintang", "Kab. Tolikara", "Kab. Yahukimo", "Kab. Yalimo"],
  "Papua Barat Daya": ["Kab. Maybrat", "Kab. Raja Ampat", "Kab. Sorong", "Kab. Sorong Selatan", "Kab. Tambrauw", "Kota Sorong"],
  "Lainnya": ["Lainnya"]
};

export interface IntakeFormData {
  case_type: CaseType;
  sub_category: string;
  kronologi: string;
  wilayah: string;
  provinsi?: string;
  kabupaten_kota?: string;
  jumlah_nilai?: number;
  urgency_level: UrgencyLevel;
  sudah_advokat: boolean;
  sudah_lapor_polisi: boolean;
}

// Triage Result from AI
export interface TriageResult {
  case_id: string;
  severity: number; // 1-5
  recommendation: TriageRecommendation;
  analysis: string;
  recommended_modules: string[];
  recommended_templates: string[];
  follow_up_questions: string[];
}

// Case record from database
export interface CaseRecord {
  id: string;
  user_id: string;
  case_type: CaseType;
  sub_category: string;
  kronologi: string;
  wilayah: string;
  jumlah_nilai: number;
  urgency_level: UrgencyLevel;
  sudah_advokat: boolean;
  sudah_lapor_polisi: boolean;
  triage_severity: number | null;
  triage_recommendation: TriageRecommendation | null;
  triage_result: string | null;
  recommended_modules: string[] | null;
  status: CaseStatus;
  outcome: CaseOutcome | null;
  closed_at: string | null;
  analytics_id: string | null;
  created_at: string;
  updated_at: string;
}

// Template types
export type TemplateCategory = 'somasi' | 'perjanjian' | 'kuasa' | 'perceraian' | 'ketenagakerjaan';

export interface LegalTemplate {
  id: string;
  category: TemplateCategory;
  title: string;
  description: string;
  tier_required: 'free' | 'basic' | 'professional' | 'business';
  placeholders: TemplatePlaceholder[];
  content: string; // Markdown with placeholders like [NAMA_PENGGUGAT]
}

export interface TemplatePlaceholder {
  key: string;
  label: string;
  type: 'text' | 'date' | 'number' | 'textarea';
  required: boolean;
}

export const TEMPLATE_CATEGORIES: { value: TemplateCategory; label: string; icon: string }[] = [
  { value: 'somasi', label: 'Surat Somasi', icon: '📩' },
  { value: 'perjanjian', label: 'Perjanjian', icon: '📝' },
  { value: 'kuasa', label: 'Surat Kuasa', icon: '🏛️' },
  { value: 'perceraian', label: 'Dokumen Perceraian', icon: '👨‍👩‍👧' },
  { value: 'ketenagakerjaan', label: 'Ketenagakerjaan', icon: '👷' },
];
