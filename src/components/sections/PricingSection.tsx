"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PricingSection() {
  const { user, openAuthModal } = useAuth();
  const router = useRouter();
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Free Trial",
      priceMonthly: "Rp 0",
      priceAnnual: "Rp 0",
      desc: "Coba kemampuan AI kami untuk satu kasus.",
      features: [
        { name: "1x Generate Analisis", inc: true },
        { name: "Rekomendasi Pasal", inc: true },
        { name: "Penjelasan Sederhana", inc: true },
        { name: "Riwayat Konsultasi", inc: false },
        { name: "Download Laporan", inc: false },
        { name: "Prioritas Respon", inc: false },
      ],
      cta: "Coba Sekarang",
      highlight: false
    },
    {
      name: "Basic Plan",
      priceMonthly: "Rp 59.000",
      priceAnnual: "Rp 50.000",
      period: "/bulan",
      desc: "Cocok untuk masyarakat umum yang butuh akses reguler.",
      features: [
        { name: "Unlimited Generate", inc: true },
        { name: "Rekomendasi Pasal", inc: true },
        { name: "Penjelasan Sederhana", inc: true },
        { name: "Riwayat Konsultasi", inc: true },
        { name: "Download Laporan PDF", inc: true },
        { name: "Prioritas Respon", inc: false },
      ],
      cta: "Berlangganan",
      highlight: true
    },
    {
      name: "Professional",
      priceMonthly: "Rp 115.000",
      priceAnnual: "Rp 100.000",
      period: "/bulan",
      desc: "Untuk praktisi, mahasiswa hukum, dan UMKM.",
      features: [
        { name: "Unlimited Generate", inc: true },
        { name: "Analisis Mendalam & Detail", inc: true },
        { name: "Template Laporan Premium", inc: true },
        { name: "Riwayat Konsultasi", inc: true },
        { name: "Download Laporan PDF", inc: true },
        { name: "Prioritas Respon AI", inc: true },
      ],
      cta: "Berlangganan",
      highlight: false
    },
    {
      name: "Business",
      priceMonthly: "Rp 299.000",
      priceAnnual: "Rp 250.000",
      period: "/bulan",
      desc: "Untuk perusahaan, startup, dan firma hukum.",
      features: [
        { name: "Semua Fitur Professional", inc: true },
        { name: "Akses Tim (5 Akun)", inc: true },
        { name: "Akses Draft Kontrak Bisnis", inc: true },
        { name: "Manajemen Dokumen Terpusat", inc: true },
        { name: "Dukungan Prioritas 24/7", inc: true },
        { name: "Kustomisasi Template Laporan", inc: true },
      ],
      cta: "Hubungi Sales",
      highlight: false
    }
  ];

  return (
    <section id="harga" className="py-24 bg-navy-light/20">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Pilih Paket <span className="text-gold">Sesuai Kebutuhan</span></h2>
          <p className="text-putih/70 text-lg mb-8">Konsultasi hukum kini tidak lagi mahal. Dapatkan akses ke AI Legal Assistant dengan harga terjangkau.</p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`font-semibold ${!isAnnual ? "text-putih" : "text-putih/50"}`}>Bulanan</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-14 h-7 rounded-full bg-navy border border-gold/30 p-1 relative transition-colors duration-300"
            >
              <motion.div 
                animate={{ x: isAnnual ? 28 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-5 h-5 rounded-full bg-gold"
              />
            </button>
            <span className={`font-semibold flex items-center gap-2 ${isAnnual ? "text-putih" : "text-putih/50"}`}>
              Tahunan <span className="bg-green-500/20 text-green-400 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Hemat 15%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-[1400px] w-full mx-auto items-stretch">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className={`relative flex flex-col rounded-3xl p-8 border ${plan.highlight
                  ? "bg-navy-dark border-gold shadow-[0_0_30px_rgba(212,175,55,0.15)] md:scale-105 z-10"
                  : "bg-navy border-putih/20"
                }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gold text-navy text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                  Paling Populer
                </div>
              )}

              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <p className="text-sm text-putih/60 mb-6 h-10">{plan.desc}</p>

              <div className="mb-8">
                <div className="flex items-baseline gap-1 whitespace-nowrap">
                  <span className="text-3xl xl:text-4xl font-bold text-gold tracking-tight">{isAnnual ? plan.priceAnnual : plan.priceMonthly}</span>
                  {plan.period && <span className="text-putih/50 text-sm">{plan.period}</span>}
                </div>
                {isAnnual && plan.name !== "Free Trial" && (
                  <p className="text-xs text-green-400 mt-1 font-medium">
                    Ditagih {plan.name === "Basic Plan" ? "Rp 600.000" : plan.name === "Professional" ? "Rp 1.200.000" : "Rp 3.000.000"} per tahun
                  </p>
                )}
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-3 text-sm">
                    {feat.inc ? (
                      <Check className="w-5 h-5 text-green-400 shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-putih/20 shrink-0" />
                    )}
                    <span className={feat.inc ? "text-putih/90" : "text-putih/40 leading-tight"}>{feat.name}</span>
                  </li>
                ))}
              </ul>

              {plan.cta === "Berlangganan" ? (
                <button
                  onClick={() => {
                    if (!user) {
                      openAuthModal("login");
                    } else {
                      router.push(`/chat?plan=${encodeURIComponent(plan.name)}&cycle=${isAnnual ? "annual" : "monthly"}`);
                    }
                  }}
                  className={`w-full py-3 rounded-xl font-bold transition-all mt-auto ${plan.highlight
                      ? "bg-gold text-navy hover:bg-gold-light"
                      : "bg-navy-light text-putih border border-putih/20 hover:bg-putih/10"
                    }`}
                >
                  {plan.cta}
                </button>
              ) : (
                <Link href={plan.name === "Business" ? "mailto:muhammadnuril155@gmail.com?subject=Tertarik%20Paket%20Business%20KonsultanAI" : "/konsultasi"} className="mt-auto">
                  <button className={`w-full py-3 rounded-xl font-bold transition-all ${plan.highlight
                      ? "bg-gold text-navy hover:bg-gold-light"
                      : "bg-navy-light text-putih border border-putih/20 hover:bg-putih/10"
                    }`}>
                    {plan.cta}
                  </button>
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

