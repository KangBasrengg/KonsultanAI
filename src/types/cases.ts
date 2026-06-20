// Types for PRD v2.5: Intake Form + Cases + Templates

export type CaseType = 'pidana' | 'perdata' | 'keluarga' | 'bisnis';
export type UrgencyLevel = 'immediate' | 'normal' | 'planning';
export type TriageRecommendation = 'AI_ANALYSIS' | 'LEARNING_FIRST' | 'ADVOKAT_URGENT' | 'TEMPLATES';
export type CaseStatus = 'open' | 'in_progress' | 'closed' | 'abandoned';
export type CaseOutcome = 'settled' | 'ongoing' | 'escalated' | 'abandoned';

// Intake Form sub-categories per case type
export const CASE_SUB_CATEGORIES: Record<CaseType, { value: string; label: string }[]> = {
  pidana: [
    { value: 'penipuan', label: 'Penipuan' },
    { value: 'kekerasan', label: 'Kekerasan' },
    { value: 'pencurian', label: 'Pencurian' },
    { value: 'penggelapan', label: 'Penggelapan' },
    { value: 'penganiayaan', label: 'Penganiayaan' },
    { value: 'narkotika', label: 'Narkotika' },
    { value: 'korupsi', label: 'Korupsi' },
    { value: 'pidana_lainnya', label: 'Lainnya' },
  ],
  perdata: [
    { value: 'perceraian', label: 'Perceraian' },
    { value: 'sengketa_tanah', label: 'Sengketa Tanah' },
    { value: 'utang_piutang', label: 'Utang Piutang' },
    { value: 'sengketa_bisnis', label: 'Sengketa Bisnis' },
    { value: 'wanprestasi', label: 'Wanprestasi' },
    { value: 'pmh', label: 'Perbuatan Melawan Hukum' },
    { value: 'perdata_lainnya', label: 'Lainnya' },
  ],
  keluarga: [
    { value: 'waris', label: 'Waris' },
    { value: 'perwalian', label: 'Perwalian' },
    { value: 'adopsi', label: 'Adopsi' },
    { value: 'hak_asuh', label: 'Hak Asuh Anak' },
    { value: 'nafkah', label: 'Nafkah' },
    { value: 'keluarga_lainnya', label: 'Lainnya' },
  ],
  bisnis: [
    { value: 'kontrak', label: 'Kontrak & Perjanjian' },
    { value: 'hki', label: 'Hak Kekayaan Intelektual' },
    { value: 'ketenagakerjaan', label: 'Ketenagakerjaan' },
    { value: 'perizinan', label: 'Perizinan Usaha' },
    { value: 'pajak', label: 'Pajak' },
    { value: 'persaingan_usaha', label: 'Persaingan Usaha' },
    { value: 'bisnis_lainnya', label: 'Lainnya' },
  ],
};

export const CASE_TYPE_OPTIONS: { value: CaseType; label: string; icon: string }[] = [
  { value: 'pidana', label: 'Hukum Pidana', icon: '⚖️' },
  { value: 'perdata', label: 'Hukum Perdata', icon: '📋' },
  { value: 'keluarga', label: 'Hukum Keluarga', icon: '👨‍👩‍👧' },
  { value: 'bisnis', label: 'Hukum Bisnis & Komersial', icon: '💼' },
];

export const URGENCY_OPTIONS: { value: UrgencyLevel; label: string; desc: string; color: string }[] = [
  { value: 'immediate', label: 'Mendesak', desc: '< 7 hari', color: 'text-red-400' },
  { value: 'normal', label: 'Normal', desc: '1-4 minggu', color: 'text-gold' },
  { value: 'planning', label: 'Perencanaan', desc: '> 1 bulan', color: 'text-green-400' },
];

// Wilayah data (major Indonesian cities/kabupaten)
export const WILAYAH_OPTIONS = [
  // DKI Jakarta
  'Jakarta Pusat', 'Jakarta Barat', 'Jakarta Timur', 'Jakarta Selatan', 'Jakarta Utara',
  // Jawa Barat
  'Bandung', 'Bekasi', 'Bogor', 'Depok', 'Cirebon', 'Sukabumi', 'Tasikmalaya', 'Karawang', 'Garut',
  // Jawa Tengah
  'Semarang', 'Solo', 'Purwokerto', 'Pekalongan', 'Tegal', 'Magelang', 'Cilacap',
  // Jawa Timur
  'Surabaya', 'Malang', 'Sidoarjo', 'Kediri', 'Jember', 'Banyuwangi', 'Madiun',
  // Banten
  'Tangerang', 'Tangerang Selatan', 'Serang', 'Cilegon',
  // DIY
  'Yogyakarta', 'Sleman', 'Bantul',
  // Sumatera
  'Medan', 'Palembang', 'Padang', 'Pekanbaru', 'Lampung', 'Batam', 'Jambi', 'Bengkulu', 'Banda Aceh',
  // Kalimantan
  'Balikpapan', 'Samarinda', 'Banjarmasin', 'Pontianak', 'Palangkaraya',
  // Sulawesi
  'Makassar', 'Manado', 'Palu', 'Kendari', 'Gorontalo',
  // Bali & Nusa Tenggara
  'Denpasar', 'Mataram', 'Kupang',
  // Papua & Maluku
  'Jayapura', 'Sorong', 'Ambon', 'Ternate',
  // Lainnya
  'Lainnya',
].sort();

// Intake Form Data
export interface IntakeFormData {
  case_type: CaseType;
  sub_category: string;
  kronologi: string;
  wilayah: string;
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
