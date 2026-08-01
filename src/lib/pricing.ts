/**
 * Single source of truth for all pricing data.
 * Used by both the frontend PricingSection and the backend checkout API.
 */

export interface PlanPricing {
  name: string;
  /** Monthly price in IDR */
  priceMonthly: number;
  /** Annual price per month in IDR */
  priceAnnualPerMonth: number;
  /** Total annual price in IDR */
  priceAnnualTotal: number;
  /** Display string for monthly */
  displayMonthly: string;
  /** Display string for annual (per-month) */
  displayAnnual: string;
  /** Display string for annual total billing */
  displayAnnualTotal: string;
  description: string;
  features: { name: string; inc: boolean }[];
  cta: string;
  highlight: boolean;
}

export const PLANS: PlanPricing[] = [
  {
    name: "Free Trial",
    priceMonthly: 0,
    priceAnnualPerMonth: 0,
    priceAnnualTotal: 0,
    displayMonthly: "Rp 0",
    displayAnnual: "Rp 0",
    displayAnnualTotal: "Rp 0",
    description: "Coba kemampuan AI kami untuk satu kasus.",
    features: [
      { name: "3x Generate Analisis", inc: true },
      { name: "3x Generate Kontrak (LegalKita)", inc: true },
      { name: "Rekomendasi Pasal", inc: true },
      { name: "Penjelasan Sederhana", inc: true },
      { name: "3 Materi Legal Learning", inc: true },
      { name: "Preview Template (Watermark)", inc: true },
      { name: "Download Laporan", inc: false },
    ],
    cta: "Coba Sekarang",
    highlight: false,
  },
  {
    name: "Top-Up Kuota",
    priceMonthly: 20_000,
    priceAnnualPerMonth: 20_000,
    priceAnnualTotal: 20_000,
    displayMonthly: "Mulai Rp 20.000",
    displayAnnual: "Mulai Rp 20.000",
    displayAnnualTotal: "Rp 20.000",
    description: "Bayar sesuai pemakaian. Kuota hangus saat pemeliharaan sistem (6 bulan sekali).",
    features: [
      { name: "Sistem Sekali Bayar (Pay-As-You-Go)", inc: true },
      { name: "Minimal Pembelian 4 Kuota (Token)", inc: true },
      { name: "Bebas Sesuaikan Jumlah Kuota", inc: true },
      { name: "Akses AI \u0026 Draft Legal", inc: true },
      { name: "Riwayat Konsultasi", inc: true },
      { name: "Download Laporan PDF", inc: true },
      { name: "8 Materi Legal Learning", inc: true },
    ],
    cta: "Beli Kuota",
    highlight: true,
  },
  {
    name: "Pro",
    priceMonthly: 59_000,
    priceAnnualPerMonth: 49_000,
    priceAnnualTotal: 588_000,
    displayMonthly: "Rp 59.000",
    displayAnnual: "Rp 49.000",
    displayAnnualTotal: "Rp 588.000",
    description: "Untuk praktisi, mahasiswa hukum, dan UMKM.",
    features: [
      { name: "10x Generate Analisis", inc: true },
      { name: "Unlimited Kontrak & Review (LegalKita)", inc: true },
      { name: "Semua Fitur Free Trial", inc: true },
      { name: "Analisis Mendalam & Detail", inc: true },
      { name: "Template Laporan Premium", inc: true },
      { name: "AI Legal Tutor", inc: true },
      { name: "20 Materi & Sertifikat", inc: true },
    ],
    cta: "Berlangganan",
    highlight: false,
  },
  {
    name: "Enterprise",
    priceMonthly: 499_000,
    priceAnnualPerMonth: 399_000,
    priceAnnualTotal: 4_788_000,
    displayMonthly: "Mulai Rp 499.000",
    displayAnnual: "Mulai Rp 399.000",
    displayAnnualTotal: "Mulai Rp 4.788.000",
    description: "Solusi enterprise untuk instansi pemerintah, perusahaan berskala besar, dan firma hukum.",
    features: [
      { name: "Semua Fitur Professional", inc: true },
      { name: "18 Token / Bulan (Bisa Top-Up)", inc: true },
      { name: "Akses Tim (5 Akun Cabang)", inc: true },
      { name: "Manajemen Kuota Karyawan", inc: true },
      { name: "AI Contract Review", inc: true },
      { name: "Legal Compliance Checker", inc: true },
      { name: "Template Kontrak Bisnis", inc: true },
      { name: "Manajemen Dokumen Terpusat", inc: true },
      { name: "Government Analytics Dashboard", inc: true },
      { name: "Dukungan Prioritas", inc: true },
    ],
    cta: "Hubungi Sales",
    highlight: false,
  },
];

/**
 * Look up the actual IDR price for a plan by name and billing cycle.
 * Returns null if the plan name is not recognized.
 */
export function getPlanPrice(planName: string, isAnnual: boolean): number | null {
  const normalized = (planName || "").toLowerCase().trim();

  const plan = PLANS.find((p) => {
    const n = p.name.toLowerCase();
    return normalized.includes(n) || n.includes(normalized);
  });

  if (!plan) return null;
  if (plan.priceMonthly === 0) return 0;

  return isAnnual ? plan.priceAnnualTotal : plan.priceMonthly;
}
