// ============================================================
// Marketplace Advokat - TypeScript Types
// ============================================================

export const LEGAL_FIELDS = [
  { id: "pidana", label: "Pidana" },
  { id: "perdata", label: "Perdata" },
  { id: "cybercrime", label: "Cybercrime" },
  { id: "ketenagakerjaan", label: "Ketenagakerjaan" },
  { id: "pertanahan", label: "Pertanahan" },
  { id: "bisnis", label: "Bisnis" },
  { id: "hki", label: "Hak Kekayaan Intelektual" },
  { id: "pajak", label: "Pajak" },
  { id: "keluarga", label: "Keluarga & Perceraian" },
  { id: "lingkungan", label: "Lingkungan" },
] as const;

export type LegalFieldId = typeof LEGAL_FIELDS[number]["id"];

export interface Advocate {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  license_number: string;
  organization: string;
  experience_years: number;
  cases_handled: number | null;
  bio: string | null;
  photo_url: string | null;
  bank_name: string;
  bank_account: string;
  balance: number;
  consultation_rate: number;
  verification_status: "pending" | "approved" | "rejected";
  rejection_reason: string | null;
  rating_avg?: number;
  rating_count?: number;
  created_at: string;
  updated_at: string;
}

export interface AdvocateSpecialization {
  id: string;
  advocate_id: string;
  field: LegalFieldId;
  expertise_percent: number;
}

export interface AdvocateDocument {
  id: string;
  advocate_id: string;
  document_type: "ktp" | "kartu_advokat" | "berita_acara_sumpah";
  file_url: string;
  uploaded_at: string;
}

export interface Listing {
  id: string;
  advocate_id: string;
  listing_start_date: string;
  listing_expired_date: string;
  listing_status: "active" | "expired" | "cancelled";
  payment_order_id: string | null;
  payment_amount: number;
  created_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  advocate_id: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  consultation_rate: number;
  platform_fee: number;
  advocate_earning: number;
  payment_order_id: string | null;
  payment_status: "unpaid" | "paid" | "refunded";
  notes: string | null;
  scheduled_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdvocateReview {
  id: string;
  booking_id: string;
  user_id: string;
  advocate_id: string;
  rating: number;
  review: string | null;
  created_at: string;
}

export interface Withdrawal {
  id: string;
  advocate_id: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "rejected";
  bank_name: string;
  bank_account: string;
  notes: string | null;
  processed_at: string | null;
  created_at: string;
}

// Public-facing advocate (excludes private/sensitive fields)
export type PublicAdvocate = Omit<Advocate, "bank_name" | "bank_account" | "balance" | "rejection_reason" | "email" | "phone">;

// Extended types for UI
export interface AdvocateWithDetails extends PublicAdvocate {
  specializations: AdvocateSpecialization[];
  listing?: Listing | null;
}

export interface AdvocateRegistrationData {
  // Step 1: Personal
  full_name: string;
  email: string;
  phone: string;
  city: string;
  // Step 2: Professional
  license_number: string;
  organization: string;
  experience_years: number;
  cases_handled: number | null;
  bio: string;
  // Step 3: Financial
  bank_name: string;
  bank_account: string;
  // Step 4: Specializations
  specializations: { field: LegalFieldId; expertise_percent: number }[];
  // Step 5: Documents
  ktp: File | null;
  kartu_advokat: File | null;
  berita_acara_sumpah: File | null;
}
