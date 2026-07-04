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
    name: "Basic",
    priceMonthly: 80_000,
    priceAnnualPerMonth: 70_000,
    priceAnnualTotal: 840_000,
    displayMonthly: "Rp 80.000",
    displayAnnual: "Rp 70.000",
    displayAnnualTotal: "Rp 840.000",
    description: "Cocok untuk masyarakat umum yang butuh akses reguler.",
    features: [
      { name: "10x Generate Analisis", inc: true },
      { name: "10x Generate Kontrak (LegalKita)", inc: true },
      { name: "Rekomendasi Pasal", inc: true },
      { name: "Penjelasan Sederhana", inc: true },
      { name: "Riwayat Konsultasi", inc: true },
      { name: "Download Laporan PDF", inc: true },
      { name: "8 Materi Legal Learning", inc: true },
    ],
    cta: "Berlangganan",
    highlight: true,
  },
  {
    name: "Pro",
    priceMonthly: 149_000,
    priceAnnualPerMonth: 129_000,
    priceAnnualTotal: 1_548_000,
    displayMonthly: "Rp 149.000",
    displayAnnual: "Rp 129.000",
    displayAnnualTotal: "Rp 1.548.000",
    description: "Untuk praktisi, mahasiswa hukum, dan UMKM.",
    features: [
      { name: "25x Generate Analisis", inc: true },
      { name: "Unlimited Kontrak & Review (LegalKita)", inc: true },
      { name: "Semua Fitur Basic", inc: true },
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
    priceMonthly: 525_000,
    priceAnnualPerMonth: 445_000,
    priceAnnualTotal: 5_340_000,
    displayMonthly: "Rp 525.000",
    displayAnnual: "Rp 445.000",
    displayAnnualTotal: "Rp 5.340.000",
    description: "Solusi enterprise untuk instansi pemerintah, perusahaan berskala besar, dan firma hukum.",
    features: [
      { name: "Semua Fitur Professional", inc: true },
      { name: "Akses Tim (5 Akun)", inc: true },
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
